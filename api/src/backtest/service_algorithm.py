"""
Service 기반 유사도 알고리즘 어댑터
Service를 SimilarityAlgorithm 인터페이스에 맞게 래핑
"""

import pandas as pd

from src.backtest.algorithm_interface import SimilarityAlgorithm


class ServiceSimilarityAlgorithm(SimilarityAlgorithm):
  """Service 기반 유사도 알고리즘 - Service의 calculate_similarity 메서드 사용"""

  def __init__(self, service):
    """
    Args:
      service: calculate_similarity 메서드를 가진 Service 인스턴스
        예: ChartSimilarityService
    """
    self.service = service

  def calculate_similarity(
    self, target_pattern: pd.DataFrame, candidate_pattern: pd.DataFrame
  ) -> float:
    """
    Service를 사용하여 두 패턴 간의 유사도를 계산합니다.

    Args:
      target_pattern: 타겟 패턴 데이터프레임
      candidate_pattern: 후보 패턴 데이터프레임

    Returns:
      유사도 점수 (낮을수록 유사함)
    """
    return self.service.calculate_similarity(target_pattern, candidate_pattern)

