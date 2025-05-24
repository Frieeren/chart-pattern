import logging
import time
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from scipy.spatial.distance import euclidean
from sqlalchemy import text

from src.db.session import SessionLocal

logger = logging.getLogger(__name__)


def get_table_data(
  table_name: str,
  limit: int = None,
  order_by: str = None,
  order_direction: str = "asc",
):
  session = SessionLocal()

  try:
    query = text(f"SELECT * FROM {table_name}")

    if order_by:
      direction = "DESC" if order_direction.lower() == "desc" else "ASC"
      query = text(
        f"SELECT * FROM {table_name} ORDER BY {order_by} {direction}"
      )

    if limit:
      query = text(f"{query.text} LIMIT {limit}")

    df = pd.read_sql(query, session.bind)
    return df

  finally:
    session.close()


def prepare_data(df):
  df = df.rename(
    columns={
      "time": "Date",
      "open": "Open",
      "high": "High",
      "low": "Low",
      "close": "Close",
      "volume": "Volume",
    }
  )

  df["Date"] = pd.to_datetime(df["Date"])
  return df.set_index("Date")


def normalize_by_close(data):
  if len(data) == 0:
    return data.copy()

  norm_data = data.copy()
  first_close = data["Close"].iloc[0]

  for col in ["Open", "High", "Low", "Close"]:
    norm_data[col] = data[col] / first_close

  return norm_data


def calculate_close_similarity(target_norm, candidate_norm):
  return euclidean(target_norm["Close"].values, candidate_norm["Close"].values)


def first_stage_filter(data, target_pattern, window_size, n_candidates=1000):
  candidates = []
  target_norm = normalize_by_close(target_pattern)
  data_len = len(data)

  if len(target_pattern) == 0:
    return []

  target_start = target_pattern.index[0]
  target_end = target_pattern.index[-1]
  for i in range(data_len - window_size + 1):
    start_idx = i
    end_idx = i + window_size - 1

    if end_idx >= data_len:
      continue

    current_start = data.index[start_idx]
    current_end = data.index[end_idx]
    if current_start == target_start and current_end == target_end:
      continue

    candidate = data.iloc[start_idx : end_idx + 1]
    candidate_norm = normalize_by_close(candidate)
    similarity = calculate_close_similarity(target_norm, candidate_norm)
    candidates.append(
      (current_start, current_end, similarity, start_idx, end_idx)
    )

  candidates.sort(key=lambda x: x[2])
  return candidates[:n_candidates]


def extract_candlestick_features(data):
  features = pd.DataFrame(index=data.index)
  features["return"] = data["Close"].pct_change().fillna(0)
  features["range"] = (data["High"] - data["Low"]) / data["Open"]
  features["candle_type"] = np.where(data["Close"] >= data["Open"], 1, -1)
  features["body_ratio"] = abs(data["Close"] - data["Open"]) / (
    data["High"] - data["Low"]
  )
  features["body_ratio"] = (
    features["body_ratio"].fillna(0).replace([np.inf, -np.inf], 0)
  )
  features["upper_shadow"] = (
    data["High"] - data[["Open", "Close"]].max(axis=1)
  ) / (data["High"] - data["Low"])
  features["upper_shadow"] = (
    features["upper_shadow"].fillna(0).replace([np.inf, -np.inf], 0)
  )
  features["lower_shadow"] = (
    data[["Open", "Close"]].min(axis=1) - data["Low"]
  ) / (data["High"] - data["Low"])
  features["lower_shadow"] = (
    features["lower_shadow"].fillna(0).replace([np.inf, -np.inf], 0)
  )
  return features


def calculate_feature_similarity(target_features, candidate_features):
  feature_weights = {
    "return": 0.20,
    "range": 0.10,
    "candle_type": 0.10,
    "body_ratio": 0.20,
    "upper_shadow": 0.20,
    "lower_shadow": 0.20,
  }
  total_similarity = 0

  for feature, weight in feature_weights.items():
    if (
      feature in target_features.columns
      and feature in candidate_features.columns
    ):
      feature_distance = euclidean(
        target_features[feature].values, candidate_features[feature].values
      )
      total_similarity += weight * feature_distance

  return total_similarity


# ruff: noqa: C901
def second_stage_filter_candleonly(
  data,
  target_pattern,
  candidates,
  top_n=5,
  min_time_gap=timedelta(days=1),
  min_cluster_gap=0.2,
):
  processed_count = 0
  overlap_count = 0
  target_features = extract_candlestick_features(target_pattern)
  all_results = []

  for start, end, _, start_idx, end_idx in candidates:
    processed_count += 1
    candidate = data.iloc[start_idx : end_idx + 1]
    candidate_features = extract_candlestick_features(candidate)
    feature_similarity = calculate_feature_similarity(
      target_features, candidate_features
    )
    all_results.append((start, end, feature_similarity))

  all_results.sort(key=lambda x: x[2])
  final_results = []
  used_periods = set()

  if all_results:
    final_results.append(all_results[0])
    used_periods.add((all_results[0][0], all_results[0][1]))

  for start, end, similarity in all_results[1:]:
    if len(final_results) >= top_n:
      break

    is_overlapping = False
    for used_start, used_end in used_periods:
      time_gap = min(abs(start - used_end), abs(end - used_start))

      if time_gap < min_time_gap:
        is_overlapping = True
        overlap_count += 1
        break

    if is_overlapping:
      continue

    is_different_enough = True
    for selected_start, _, _ in final_results:
      if abs((start - selected_start).days) < int(min_cluster_gap * 365):
        is_different_enough = False
        break

    if is_different_enough:
      final_results.append((start, end, similarity))
      used_periods.add((start, end))

  if len(final_results) < top_n:
    for start, end, similarity in all_results:
      if len(final_results) >= top_n:
        break

      if any(s == start and e == end for s, e, _ in final_results):
        continue

      is_overlapping = False
      for used_start, used_end in used_periods:
        time_gap = min(abs(start - used_end), abs(end - used_start))

        if time_gap < min_time_gap:
          is_overlapping = True
          break

      if not is_overlapping:
        final_results.append((start, end, similarity))
        used_periods.add((start, end))

  final_results.sort(key=lambda x: x[2])
  return final_results


def find_similar_patterns_candleonly(
  data,
  start_date,
  end_date,
  window_size=None,
  top_n=5,
  candidates_ratio=0.05,
  min_time_gap=timedelta(days=1),
  min_cluster_gap=0.2,
):
  target_pattern = data.loc[start_date:end_date]

  if window_size is None:
    window_size = len(target_pattern)

  data_len = len(data)
  total_patterns = data_len - window_size + 1
  n_candidates = max(top_n * 20, int(total_patterns * candidates_ratio))
  n_candidates = min(n_candidates, total_patterns)

  candidates = first_stage_filter(
    data, target_pattern, window_size, n_candidates
  )

  final_results = second_stage_filter_candleonly(
    data,
    target_pattern,
    candidates,
    top_n=top_n,
    min_time_gap=min_time_gap,
    min_cluster_gap=min_cluster_gap,
  )

  return final_results


def save_similarity_results(session, symbol, time, results):
  for start, end, similarity in results:
    query = text("""
            INSERT INTO chart_similarity (time, symbol, start_time, end_time, similarity)
            VALUES (:time, :symbol, :start_time, :end_time, :similarity)
        """)
    session.execute(
      query,
      {
        "time": time,
        "symbol": symbol,
        "start_time": start,
        "end_time": end,
        "similarity": float(similarity),
      },
    )

  session.commit()
  logger.info(
    f"{len(results)}개 유사도 결과가 chart_similarity에 저장되었습니다."
  )


def chart_similarity_job(symbol, table_name, range, window_size=300, top_n=10):
  session = SessionLocal()

  try:
    start_time = time.time()
    logger.info(f"유사도 분석 시작: {symbol}")

    df = get_table_data(
      table_name, limit=range, order_by="id", order_direction="desc"
    )

    if df.empty or len(df) < window_size:
      logger.warning(f"{symbol} 데이터가 부족합니다.")
      return

    df = df.iloc[::-1].reset_index(drop=True)
    data = prepare_data(df)
    target_start = data.index[-window_size]
    target_end = data.index[-1]
    similar_patterns = find_similar_patterns_candleonly(
      data,
      pd.Timestamp(target_start),
      pd.Timestamp(target_end),
      window_size=window_size,
      top_n=top_n,
      candidates_ratio=0.1,
    )
    elapsed = time.time() - start_time

    logger.info(f"타겟 패턴: {target_start} ~ {target_end}")
    logger.info("\n유사한 패턴:")
    for i, (start, end, similarity) in enumerate(similar_patterns):
      logger.info(f"{i + 1}. {start} ~ {end}, 유사도: {similarity:.4f}")
    logger.info(f"[유사도 분석 소요시간] {elapsed:.2f}초")

    save_similarity_results(session, symbol, target_end, similar_patterns)
    logger.info(f"{symbol} 유사도 결과 저장 완료")

  except Exception as e:
    logger.error(f"{symbol} 차트 유사도 분석 중 오류 발생: {e}")
  finally:
    session.close()


def run_chart_similarity_jobs(targets):
  search_range = 105121  # 유사도 검색 범위 1년
  output_cnt = 10  # 유사도 검색 결과 개수
  window_size = 300  # 유사도 측정 캔들 개수

  for target in targets:
    chart_similarity_job(
      target["symbol"],
      target["table"],
      range=search_range,
      window_size=window_size,
      top_n=output_cnt,
    )
