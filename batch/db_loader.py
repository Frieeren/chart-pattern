from __future__ import annotations

import os
from pathlib import Path
from typing import Optional

import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy import types as satypes
from dotenv import load_dotenv


def _create_engine_from_env() -> Engine:
    """환경변수(DB_USER, DB_PASSWD, DB_HOST, DB_PORT, DB_NAME)로 MySQL 엔진을 생성한다."""
    load_dotenv()
    user = os.getenv("DB_USER")
    passwd = os.getenv("DB_PASSWD")
    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT")
    db = os.getenv("DB_NAME")
    if not all([user, passwd, host, port, db]):
        raise ValueError("데이터베이스 환경 변수가 올바르게 설정되지 않았습니다.")
    url = f"mysql+pymysql://{user}:{passwd}@{host}:{port}/{db}?charset=utf8mb4"
    engine = create_engine(url, pool_pre_ping=True)
    return engine


def create_table_from_csv(
    table_name: str,
    csv_path: str | Path,
    *,
    if_exists: str = "replace",
    chunksize: int = 100_000,
    engine: Optional[Engine] = None,
) -> None:
    """CSV 파일을 읽어 MySQL에 테이블을 생성/치환하여 적재한다.

    - time 컬럼은 'YYYY-MM-DD HH:MM:SS'로 저장되어 있다고 가정하고 DATETIME으로 변환
    - 수치 컬럼(open, high, low, close, volume)은 DECIMAL(20,8)로 생성
    - if_exists: 'replace' | 'append' | 'fail'
    """
    csv_path = str(csv_path)
    eng = engine or _create_engine_from_env()

    # 스키마(dtypes) 정의
    dtype_map = {
        "time": satypes.DATETIME(),
        "open": satypes.Numeric(20, 8),
        "high": satypes.Numeric(20, 8),
        "low": satypes.Numeric(20, 8),
        "close": satypes.Numeric(20, 8),
        "volume": satypes.Numeric(20, 8),
    }

    # 첫 청크로 테이블 생성
    first_iter = pd.read_csv(
        csv_path,
        chunksize=chunksize,
        parse_dates=["time"],
        infer_datetime_format=True,
    )
    first_chunk = next(first_iter, None)
    if first_chunk is None or first_chunk.empty:
        raise ValueError("CSV가 비어있습니다.")

    # 타입 정제
    for col in ["open", "high", "low", "close", "volume"]:
        first_chunk[col] = pd.to_numeric(first_chunk[col], errors="coerce")

    first_chunk.to_sql(
        name=table_name,
        con=eng,
        if_exists=if_exists,
        index=True,
        dtype=dtype_map,
        method=None,
    )

    # 나머지 청크 append
    for chunk in first_iter:
        for col in ["open", "high", "low", "close", "volume"]:
            chunk[col] = pd.to_numeric(chunk[col], errors="coerce")
        chunk["time"] = pd.to_datetime(chunk["time"], errors="coerce")
        chunk.to_sql(
            name=table_name,
            con=eng,
            if_exists="append",
            index=True,
        )
