from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional, Tuple

import time

import httpx
import pandas as pd
from tenacity import retry, stop_after_attempt, wait_exponential


_BINANCE_API_BASE = "https://api.binance.com"
_DEFAULT_TIMEOUT_SECONDS = 20.0
_MAX_KLINES_LIMIT = 1000


class BinanceAPIError(RuntimeError):
    pass


def _to_millis(dt: datetime) -> int:
    if dt.tzinfo is None:
        # Assume UTC if naive
        dt = dt.replace(tzinfo=timezone.utc)
    return int(dt.timestamp() * 1000)


def _client() -> httpx.Client:
    return httpx.Client(base_url=_BINANCE_API_BASE, timeout=_DEFAULT_TIMEOUT_SECONDS)


@retry(wait=wait_exponential(multiplier=1, min=1, max=10), stop=stop_after_attempt(5))
def get_all_symbols(
    quote_asset: Optional[str] = None, status: str = "TRADING"
) -> List[str]:
    """바이낸스 현물 거래소의 심볼 목록을 조회한다.

    - quote_asset가 주어지면 해당 기준자산으로만 필터링한다. 예: "USDT"
    - status는 기본적으로 "TRADING" 상태만 반환
    """
    with _client() as client:
        resp = client.get("/api/v3/exchangeInfo")
        if resp.status_code != 200:
            raise BinanceAPIError(
                f"exchangeInfo failed: {resp.status_code} {resp.text}"
            )
        data = resp.json()
        symbols_meta = data.get("symbols", [])

        result: List[str] = []
        for s in symbols_meta:
            if status and s.get("status") != status:
                continue
            if quote_asset and s.get("quoteAsset") != quote_asset:
                continue
            result.append(s.get("symbol"))
        return result


@retry(wait=wait_exponential(multiplier=1, min=1, max=10), stop=stop_after_attempt(5))
def _fetch_klines_once(
    symbol: str,
    interval: str,
    start_time_ms: int,
    end_time_ms: int,
    limit: int = _MAX_KLINES_LIMIT,
) -> list:
    with _client() as client:
        params = {
            "symbol": symbol,
            "interval": interval,
            "startTime": start_time_ms,
            "endTime": end_time_ms,
            "limit": limit,
        }

        resp = client.get("/api/v3/klines", params=params)
        if resp.status_code != 200:
            raise BinanceAPIError(f"klines failed: {resp.status_code} {resp.text}")
        return resp.json()


def get_klines(
    symbol: str,
    interval: str,
    start_time: datetime,
    end_time: datetime,
    *,
    sleep_between_calls_seconds: float = 0.0,
    result_tz: Optional[datetime.tzinfo] = None,
) -> pd.DataFrame:
    """히스토리 캔들(예: 5분봉)을 조회하여 DataFrame으로 반환한다.

    - interval 예: "1m", "5m", "15m", "1h", ...
    - start_time, end_time는 timezone-aware 권장(UTC). naive면 UTC로 간주
    - 바이낸스 API 제약으로 요청당 최대 1000캔들이므로, 구간을 분할해서 페이지네이션한다.
    """
    if start_time >= end_time:
        raise ValueError("start_time must be earlier than end_time")

    start_ms = _to_millis(start_time)
    end_ms = _to_millis(end_time)

    all_rows: list = []
    current_start = start_ms
    last_batch_count = 1

    while current_start < end_ms and last_batch_count > 0:
        batch = _fetch_klines_once(
            symbol=symbol,
            interval=interval,
            start_time_ms=current_start,
            end_time_ms=end_ms,
            limit=_MAX_KLINES_LIMIT,
        )
        last_batch_count = len(batch)
        if last_batch_count == 0:
            print(f"[{symbol}] page rows=0; reached end")
            break

        all_rows.extend(batch)

        # 다음 구간 계산: 마지막 캔들의 close time 이후로 진행
        last_close_time_ms = batch[-1][6]  # closeTime index
        # 무한 루프 방지: 서버가 같은 구간을 반복 반환하는 경우를 회피
        if last_close_time_ms <= current_start:
            current_start = current_start + 1
        else:
            current_start = last_close_time_ms + 1

        if sleep_between_calls_seconds > 0:
            print(f"[{symbol}] sleep {sleep_between_calls_seconds}s before next page")
            time.sleep(sleep_between_calls_seconds)

    if not all_rows:
        print(f"[{symbol}] no rows fetched in range")
        return _empty_klines_df()

    df = _klines_to_dataframe(all_rows)
    # 구간으로 한 번 더 필터링(경계 포함/초과 문제 대비)
    df = df[
        (df["open_time"] >= pd.to_datetime(start_ms, unit="ms", utc=True))
        & (df["open_time"] <= pd.to_datetime(end_ms, unit="ms", utc=True))
    ]

    # 결과 타임존 변환 옵션
    if result_tz is not None:
        df["open_time"] = df["open_time"].dt.tz_convert(result_tz)
        df["close_time"] = df["close_time"].dt.tz_convert(result_tz)

    print(
        f"[{symbol}] get_klines done rows={len(df)} range=[{df['open_time'].min()} ~ {df['open_time'].max()}]"
    )
    return df.reset_index(drop=True)


def _klines_to_dataframe(rows: list) -> pd.DataFrame:
    columns = [
        "open_time_ms",
        "open",
        "high",
        "low",
        "close",
        "volume",
        "close_time_ms",
        "quote_asset_volume",
        "number_of_trades",
        "taker_buy_base_asset_volume",
        "taker_buy_quote_asset_volume",
        "ignore",
    ]
    df = pd.DataFrame(rows, columns=columns)

    # 타입 캐스팅 및 시간 컬럼 변환
    df["open_time"] = pd.to_datetime(df["open_time_ms"], unit="ms", utc=True)
    df["close_time"] = pd.to_datetime(df["close_time_ms"], unit="ms", utc=True)

    float_cols = [
        "open",
        "high",
        "low",
        "close",
        "volume",
        "quote_asset_volume",
        "taker_buy_base_asset_volume",
        "taker_buy_quote_asset_volume",
    ]
    for c in float_cols:
        df[c] = pd.to_numeric(df[c], errors="coerce")

    df["number_of_trades"] = pd.to_numeric(
        df["number_of_trades"], errors="coerce", downcast="integer"
    )

    # 최종 컬럼 순서 정리
    df = df[
        [
            "open_time",
            "open",
            "high",
            "low",
            "close",
            "volume",
            "close_time",
            "quote_asset_volume",
            "number_of_trades",
            "taker_buy_base_asset_volume",
            "taker_buy_quote_asset_volume",
        ]
    ]
    return df


def _empty_klines_df() -> pd.DataFrame:
    return pd.DataFrame(
        columns=[
            "open_time",
            "open",
            "high",
            "low",
            "close",
            "volume",
            "close_time",
            "quote_asset_volume",
            "number_of_trades",
            "taker_buy_base_asset_volume",
            "taker_buy_quote_asset_volume",
        ]
    )


def check_continuity_5m(df: pd.DataFrame) -> List[Tuple[pd.Timestamp, pd.Timestamp]]:
    """5분봉 연속성 검사.

    - 입력: get_klines가 반환한 DataFrame (열: open_time, close_time, ...)
    - 출력: 누락 구간 리스트 [(prev_open, next_open), ...]
    - 규칙: 연속 행의 open_time 간격이 정확히 5분(300초)인지 검사
    """
    if df.empty:
        return []

    # open_time 기준 정렬
    df_sorted = df.sort_values("open_time").reset_index(drop=True)

    gaps: List[Tuple[pd.Timestamp, pd.Timestamp]] = []
    expected_delta = pd.Timedelta(minutes=5)

    for i in range(len(df_sorted) - 1):
        cur_open = df_sorted.loc[i, "open_time"]
        next_open = df_sorted.loc[i + 1, "open_time"]
        if (next_open - cur_open) != expected_delta:
            gaps.append((cur_open, next_open))

    return gaps
