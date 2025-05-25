import logging
import time
from datetime import datetime

import pandas as pd
import requests
from sqlalchemy import text

from src.db.session import SessionLocal

# 로깅 설정
logging.basicConfig(
  level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

BINANCE_API_URL = "https://api.binance.com/api/v3/klines"
REQUEST_DELAY = 0.5


# Binance에서 데이터 가져오기
def get_binance_data(symbol, interval="5m", limit=1000, start_time=None):
  params = {"symbol": symbol, "interval": interval, "limit": limit}

  if start_time:
    params["startTime"] = start_time

  response = requests.get(BINANCE_API_URL, params=params)
  response.raise_for_status()

  return response.json()


# 데이터프레임 변환
def process_candle_data(data):
  columns = ["time", "open", "high", "low", "close", "volume"]
  data = [row[:6] for row in data]
  df = pd.DataFrame(data, columns=columns)

  df["time"] = pd.to_datetime(df["time"], unit="ms") + pd.Timedelta(hours=9)

  for col in ["open", "high", "low", "close", "volume"]:
    df[col] = pd.to_numeric(df[col], errors="coerce")

  return df


# DB에서 마지막 타임스탬프 조회 (SessionLocal 사용)
def get_last_timestamp(session, table_name):
  query = text(f"SELECT time FROM {table_name} ORDER BY time DESC LIMIT 1")
  result = session.execute(query).fetchone()

  if result:
    return int(result[0].timestamp() * 1000)

  return None


# DB에 데이터 저장 (SessionLocal 사용)
def save_to_db(session, df, table_name):
  try:
    for _, row in df.iterrows():
      data_dict = row.to_dict()
      columns = ", ".join(data_dict.keys())
      values = ", ".join([f":{k}" for k in data_dict.keys()])
      query = text(f"INSERT INTO {table_name} ({columns}) VALUES ({values})")
      session.execute(query, data_dict)

    session.commit()
    logger.info(f"{len(df)}개의 데이터가 {table_name}에 저장되었습니다.")

  except Exception as e:
    logger.error(f"DB 저장 중 예외 발생: {e}")
    session.rollback()


# 연속성 검사 (timestamp 기반)
def check_data_continuity(df):
  if df.empty:
    return []

  df = df.sort_values("time")
  timestamps = df["time"].astype("int64") // 10**6
  gaps = []

  for i in range(len(timestamps) - 1):
    current_ts = timestamps.iloc[i]
    next_ts = timestamps.iloc[i + 1]
    expected_next_ts = current_ts + 300000

    if next_ts != expected_next_ts:
      gaps.append(
        (
          datetime.fromtimestamp(current_ts / 1000),
          datetime.fromtimestamp(next_ts / 1000),
        )
      )

  return gaps


# 누락 데이터 채우기
def fill_missing_data(symbol, start_time, end_time):
  start_timestamp = int(start_time.timestamp() * 1000)
  data = get_binance_data(symbol=symbol, start_time=start_timestamp)

  if data:
    return process_candle_data(data)

  return None


# 메인 스케줄러 함수
# ruff: noqa: C901
def collect_latest_data(session, symbol, table_name):
  logger.info(f"{symbol} 데이터 수집 시작")

  try:
    last_timestamp = get_last_timestamp(session, table_name)

    if last_timestamp:
      start_time = last_timestamp + 300000
    else:
      start_time = None
      logger.info("기존 데이터가 없습니다. 처음부터 데이터를 수집합니다.")

    all_data = pd.DataFrame()
    total_collected = 0

    while True:
      data = get_binance_data(symbol=symbol, start_time=start_time)

      if not data:
        logger.info(f"{symbol} 새로운 데이터가 없습니다.")
        break

      df = process_candle_data(data)
      all_data = pd.concat([all_data, df])
      total_collected += len(df)
      last_row = df.iloc[-1]
      next_start_time_kst = int(last_row["time"].timestamp() * 1000) + 300000
      start_time = next_start_time_kst - 32400000

      if len(data) < 1000:
        logger.info(
          f"{symbol} 최신 데이터까지 모두 수집 완료 (총 {total_collected}개)"
        )
        break

      time.sleep(REQUEST_DELAY)

    if not all_data.empty:
      gaps = check_data_continuity(all_data)

      if gaps:
        logger.info(f"\n{symbol} 누락된 시간대:")

        for start_time, end_time in gaps:
          logger.info(
            f"- {start_time} ~ {end_time} (약 {int((end_time - start_time).total_seconds() / 60)}분)"
          )

        total_filled = 0
        for start_time, end_time in gaps:
          missing_df = fill_missing_data(symbol, start_time, end_time)

          if missing_df is not None and not missing_df.empty:
            all_data = pd.concat([all_data, missing_df])
            total_filled += len(missing_df)

          time.sleep(REQUEST_DELAY)

        if total_filled > 0:
          logger.info(f"누락 데이터 채우기 완료 (총 {total_filled}개)")

        all_data = all_data.drop_duplicates(subset=["time"])
        all_data = all_data.sort_values("time")
        final_gaps = check_data_continuity(all_data)

        if final_gaps:
          logger.warning(f"\n{symbol} 여전히 누락된 시간대:")

          for start_time, end_time in final_gaps:
            logger.warning(
              f"- {start_time} ~ {end_time} (약 {int((end_time - start_time).total_seconds() / 60)}분)"
            )
        else:
          logger.info("모든 누락된 데이터가 채워졌습니다.")

      logger.info(all_data)
      save_to_db(session, all_data, table_name)
      logger.info(f"총 {len(all_data)}개의 데이터가 저장되었습니다.")

    logger.info(f"{symbol} 데이터 수집 완료")

  except Exception as e:
    logger.error(f"{symbol} 데이터 수집 중 오류 발생: {str(e)}")


def collect_latest_data_job(targets):
  session = SessionLocal()

  try:
    for target in targets:
      collect_latest_data(session, target["symbol"], target["table"])
  finally:
    session.close()
