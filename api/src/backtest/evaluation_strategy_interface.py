from abc import ABC, abstractmethod
from typing import Dict, List, Tuple

import pandas as pd


class EvaluationStrategy(ABC):
  """평가 전략 인터페이스 - 평가 및 출력 담당"""

  @abstractmethod
  def evaluate(self, up_count: int, down_count: int) -> Tuple[str, float]:
    """
    상승/하락 개수를 기반으로 방향과 확률을 평가합니다.

    Args:
      up_count: 상승 개수
      down_count: 하락 개수

    Returns:
      (방향, 확률) 튜플
      - 방향: 'up', 'down', 또는 'neutral'
      - 확률: 0.0 ~ 1.0 사이의 값
    """
    pass

  @abstractmethod
  def output_results(
    self,
    pattern_name: str,
    target_pattern: pd.DataFrame,
    similarities: List[Tuple[pd.Timestamp, float, int]],
    up_count: int,
    down_count: int,
    up_price_changes: List[float] | None = None,
    down_price_changes: List[float] | None = None,
    up_price_changes_by_tick: Dict[int, List[float]] | None = None,
    down_price_changes_by_tick: Dict[int, List[float]] | None = None,
  ) -> None:
    """
    백테스팅 결과를 출력합니다.

    Args:
      pattern_name: 패턴 식별자
      target_pattern: 타겟 패턴 데이터프레임
      similarities: 유사도 결과 리스트 (시점, 유사도, 인덱스)
      up_count: 상승 개수
      down_count: 하락 개수
      up_price_changes: 상승 패턴들의 가격 변동률 리스트 (선택)
      down_price_changes: 하락 패턴들의 가격 변동률 리스트 (선택)
      up_price_changes_by_tick: 틱 시점별 상승 패턴 가격 변동률 딕셔너리 (선택)
      down_price_changes_by_tick: 틱 시점별 하락 패턴 가격 변동률 딕셔너리 (선택)
    """
    pass

  @abstractmethod
  def output_summary(
    self,
    results: List[Tuple[int, int, Tuple[str, float]]],
  ) -> None:
    """
    전체 패턴에 대한 요약을 출력합니다.

    Args:
      results: 결과 리스트 [(상승 개수, 하락 개수, (방향, 확률)), ...]
    """
    pass

