from abc import ABC, abstractmethod

import pandas as pd


class SimilarityAlgorithm(ABC):
  """유사도 측정 알고리즘 인터페이스"""

  @abstractmethod
  def calculate_similarity(
    self, target_pattern: pd.DataFrame, candidate_pattern: pd.DataFrame
  ) -> float:
    """
    두 패턴 간의 유사도를 계산합니다.

    Args:
      target_pattern: 타겟 패턴 데이터프레임
      candidate_pattern: 후보 패턴 데이터프레임

    Returns:
      유사도 점수 (낮을수록 유사함)
    """
    pass

