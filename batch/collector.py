from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import List
from zoneinfo import ZoneInfo

import pyarrow as pa
import pyarrow.csv as pacsv
import pandas as pd

from .binance_client import get_klines, check_continuity_5m, get_all_symbols

_KST = ZoneInfo("Asia/Seoul")


def collect_symbol_5m_to_csv(
    symbol: str,
    output_dir: str | Path,
    start_time: datetime | None = None,
) -> List[Path]:
    """심볼의 5분봉을 한국 시간(KST, UTC+9) 기준으로 단일 CSV로 저장한다.

    - 기본 시작 시각은 2017-01-01 00:00:00 KST (UTC+9)
    - 수집은 서버(API) 요청은 UTC 기준으로 수행하고, 저장 시 `time`만 KST(UTC+9)로 변환하여 [time, open, high, low, close, volume] 컬럼으로 기록
    - 바이낸스 API 특성상 start_time 이후의 첫 캔들부터 최신까지 자동 수집된다.
    """
    if start_time is None:
        # 기본: 한국시간 자정 기준
        start_time_kst = datetime(2017, 1, 1, 0, 0, 0, tzinfo=_KST)
    else:
        # 전달된 시간이 tz-aware면 KST로 변환, naive면 KST로 간주
        start_time_kst = (
            start_time
            if start_time.tzinfo is not None
            else start_time.replace(tzinfo=_KST)
        ).astimezone(_KST)

    # API 질의는 UTC 시간 기준으로 수행
    start_time_utc = start_time_kst.astimezone(timezone.utc)
    end_time_utc = datetime.now(timezone.utc)

    print(
        f"[{symbol}] Fetching 5m klines (UTC) from {start_time_utc.isoformat()} to {end_time_utc.isoformat()}"
    )
    df = get_klines(
        symbol=symbol,
        interval="5m",
        start_time=start_time_utc,
        end_time=end_time_utc,
    )
    if df.empty:
        print(f"[{symbol}] No data returned in range.")
        return []

    print(
        f"[{symbol}] Fetched rows={len(df)} time_range_utc=[{df['open_time'].min()} ~ {df['open_time'].max()}]"
    )

    # 저장 전 연속성 검사 (원본 df: UTC 기준 open_time/close_time 사용)
    gaps = check_continuity_5m(df)
    if gaps:
        print(f"[{symbol}] Continuity gaps detected: {len(gaps)}")
    else:
        print(f"[{symbol}] No continuity gaps (5m) detected.")

    # 필요한 컬럼만 선택 및 리네임 (UTC로 받은 뒤 저장 시 KST 변환)
    df = df[["open_time", "open", "high", "low", "close", "volume"]].copy()
    df.rename(columns={"open_time": "time"}, inplace=True)
    # CSV 저장 전, time을 KST로 변환하고 타임존 정보를 제거(naive KST)
    df["time"] = df["time"].dt.tz_convert(_KST)
    df["time"] = df["time"].dt.tz_localize(None)
    # 지정 포맷으로 문자열 변환 후 저장
    df["time"] = df["time"].dt.strftime("%Y-%m-%d %H:%M:%S")

    # 정렬 및 중복 제거(KST 기준)
    df.sort_values("time", inplace=True)
    df.drop_duplicates(subset=["time"], keep="first", inplace=True)

    # 단일 파일 저장 (KST 범위 기준)
    output_dir = Path(output_dir).resolve()
    (symbol_dir := output_dir / symbol / "5m").mkdir(parents=True, exist_ok=True)
    file_path = symbol_dir / f"{symbol}_5m.csv"
    first_ts = df["time"].iloc[0] if not df.empty else None
    last_ts = df["time"].iloc[-1] if not df.empty else None
    print(
        f"[{symbol}] Writing rows={len(df)} range=[{first_ts} ~ {last_ts}] -> {file_path}"
    )
    _write_csv_pyarrow(df.reset_index(drop=True), file_path)

    print(f"[{symbol}] Completed. File written: {file_path}")
    return [file_path]


def _write_csv_pyarrow(df: pd.DataFrame, file_path: Path) -> None:
    """pyarrow 기반 CSV 쓰기(빠르고 메모리 효율적).

    DataFrame의 인덱스는 저장하지 않는다.
    """
    table = pa.Table.from_pandas(df, preserve_index=False)
    pacsv.write_csv(table, str(file_path))


def collect_all_market_5m_to_csv(
    exclude_bases: List[str] | None = None,
) -> List[Path]:
    """전체 마켓(quote 기준) 심볼을 순회하며 5분봉 CSV를 저장한다.

    - exclude_bases: 예) ["BTC", "ETH"]. 대문자 기준 비교.
    - 반환: 저장된 파일 경로 리스트
    """
    output_dir = Path(__file__).resolve().parent / "data"
    start_time = datetime(2017, 1, 1).replace(tzinfo=timezone.utc)
    exclude = [b.upper() for b in exclude_bases] if exclude_bases else []
    symbols = get_all_symbols(quote_asset="USDT", status="TRADING")
    print(f"Total symbols with quote=USDT: {len(symbols)}")

    selected: List[str] = []
    for s in symbols:
        if not s.endswith("USDT"):
            continue
        base = s[: -len("USDT")]
        if base.upper() in exclude:
            print(f"Skip {s} (excluded base)")
            continue
        selected.append(s)

    print(f"Selected symbols: {len(selected)} (excluded bases={exclude})")

    written: List[Path] = []
    for idx, symbol in enumerate(selected, 1):
        print(f"[{idx}/{len(selected)}] Collect {symbol}")
        paths = collect_symbol_5m_to_csv(
            symbol=symbol, output_dir=output_dir, start_time=start_time
        )
        written.extend(paths)
    return written
