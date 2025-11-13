import numpy as np
import pandas as pd
from scipy.spatial.distance import euclidean

from src.repositories.chart_similarity_repository import (
  ChartSimilarityRepository,
)


def normalize_by_close(data: pd.DataFrame) -> pd.DataFrame:
  """Close 가격으로 정규화"""
  if len(data) == 0:
    return data.copy()

  norm_data = data.copy()
  first_close = data["Close"].iloc[0]

  for col in ["Open", "High", "Low", "Close"]:
    norm_data[col] = data[col] / first_close

  return norm_data


def extract_candlestick_features(data: pd.DataFrame) -> pd.DataFrame:
  """캔들스틱 특징 추출"""
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


class ChartSimilarityService:
  """차트 유사도 계산 서비스"""

  def __init__(self):
    self.repository = ChartSimilarityRepository()

  def get_latest_similarity(self, db, symbol: str):
    """최신 유사도 결과를 가져옵니다."""
    return self.repository.get_latest_by_symbol(db, symbol)

  def calculate_similarity(
    self, target_pattern: pd.DataFrame, candidate_pattern: pd.DataFrame
  ) -> float:
    """
    두 패턴 간의 유사도를 계산합니다 (ChartSimilarityService 사용).

    Args:
      target_pattern: 타겟 패턴 데이터프레임
      candidate_pattern: 후보 패턴 데이터프레임

    Returns:
      유사도 점수 (낮을수록 유사함)
    """
    target_norm = normalize_by_close(target_pattern)
    candidate_norm = normalize_by_close(candidate_pattern)

    # 1단계: Close 가격 유사도
    close_similarity = euclidean(
      target_norm["Close"].values, candidate_norm["Close"].values
    )

    # 2단계: 캔들스틱 특징 유사도
    target_features = extract_candlestick_features(target_pattern)
    candidate_features = extract_candlestick_features(candidate_pattern)

    feature_weights = {
      "return": 0.20,
      "range": 0.10,
      "candle_type": 0.10,
      "body_ratio": 0.20,
      "upper_shadow": 0.20,
      "lower_shadow": 0.20,
    }

    feature_similarity = 0
    for feature, weight in feature_weights.items():
      if (
        feature in target_features.columns
        and feature in candidate_features.columns
      ):
        feature_distance = euclidean(
          target_features[feature].values,
          candidate_features[feature].values,
        )
        feature_similarity += weight * feature_distance

    # 종합 유사도 (가중 평균)
    total_similarity = 0.5 * close_similarity + 0.5 * feature_similarity

    return total_similarity
