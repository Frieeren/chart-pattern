"""
시간 단위 평균 경로 분석 평가 전략
상승/하락 패턴에서 여러 틱 시점별 평균 가격 변동률을 출력
"""

import logging
from typing import Dict, List, Tuple

import pandas as pd

from src.backtest.evaluation_strategy_interface import EvaluationStrategy

logger = logging.getLogger(__name__)

class TimeBasedAverageStrategy(EvaluationStrategy):
  """시간 단위 평균 경로 분석 전략 - 여러 틱 시점별 평균 변동률 계산"""

  def __init__(self, tick_points: List[int] | None = None):
    """
    Args:
      tick_points: 분석할 틱 시점 리스트 (None이면 backtest.py에서 동적으로 생성된 값 사용)
    """
    # tick_points는 backtest.py에서 동적으로 생성되므로 None일 수 있음
    # output_results에서 전달받은 데이터의 키를 기반으로 출력
    self.tick_points = tick_points

  def _output_top_candidates(
    self, similarities: List[Tuple[pd.Timestamp, float, int]]
  ) -> None:
    """상위 10개 후보를 출력합니다."""
    top_n = min(10, len(similarities))
    top_results = similarities[:top_n]
    logger.info(f"\n상위 {len(top_results)}개 후보:")
    for i, (start_time, sim, end_idx) in enumerate(top_results, 1):
      logger.info(f"{i}. {start_time}, 유사도: {sim:.4f}")

  def _output_time_based_average_path(
    self, pattern_name: str, count: int, price_changes_by_tick: Dict[int, List[float]], direction: str
  ) -> None:
    """시간 단위 평균 경로를 출력합니다."""
    if count > 0 and price_changes_by_tick:
      direction_label = "상승" if direction == "up" else "하락"
      logger.info(f"\n[{pattern_name}] {direction_label} {count}개의 평균 경로:")
      for tick in sorted(price_changes_by_tick.keys()):
        changes = price_changes_by_tick[tick]
        if len(changes) > 0:
          avg_change = sum(changes) / len(changes)
          logger.info(f"  - {tick}틱 후: {avg_change:+.2f}%")

  def _output_average_price_changes(
    self, pattern_name: str, up_count: int, down_count: int,
    up_price_changes: List[float] | None, down_price_changes: List[float] | None
  ) -> None:
    """평균 가격 변동률을 출력합니다."""
    if up_price_changes and len(up_price_changes) > 0:
      avg_up_change = sum(up_price_changes) / len(up_price_changes)
      logger.info(
        f"[{pattern_name}] 상승 {up_count}개 → 평균 {avg_up_change:+.2f}% 상승"
      )

    if down_price_changes and len(down_price_changes) > 0:
      avg_down_change = sum(down_price_changes) / len(down_price_changes)
      logger.info(
        f"[{pattern_name}] 하락 {down_count}개 → 평균 {avg_down_change:+.2f}% 하락"
      )

  def evaluate(self, up_count: int, down_count: int) -> Tuple[str, float]:
    """
    상승/하락 중 많은 쪽을 선택하고, 그 비율을 확률로 반환합니다.

    예: 상승 7개, 하락 3개 -> ('up', 0.7)
    """
    total = up_count + down_count
    if total == 0:
      return ("up", 0.5)  # 기본값

    if up_count >= down_count:
      probability = up_count / total
      return ("up", probability)
    else:
      probability = down_count / total
      return ("down", probability)

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
    결과를 출력합니다 (시간 단위 평균 경로 포함).

    Args:
      up_price_changes_by_tick: 틱 시점별 상승 패턴 가격 변동률 딕셔너리
        예: {10: [1.2, 1.5, 0.9], 20: [2.1, 2.3, 1.8]}
      down_price_changes_by_tick: 틱 시점별 하락 패턴 가격 변동률 딕셔너리
        예: {10: [-0.8, -1.2, -0.5], 20: [-1.5, -1.8, -1.2]}
    """
    logger.info(f"타겟 패턴: {target_pattern.index[0]} ~ {target_pattern.index[-1]}")
    logger.info(f"유사도 계산 완료: {len(similarities)}개")

    # 상위 10개 출력
    self._output_top_candidates(similarities)

    direction, probability = self.evaluate(up_count, down_count)
    prob_percent = probability * 100

    logger.info(f"\n[{pattern_name}] 결과: 상승 {up_count}개, 하락 {down_count}개")

    # 상승/하락 패턴의 시간 단위 평균 경로 출력
    self._output_time_based_average_path(
      pattern_name, up_count, up_price_changes_by_tick or {}, "up"
    )
    self._output_time_based_average_path(
      pattern_name, down_count, down_price_changes_by_tick or {}, "down"
    )

    # 평균 변동률 출력 (최종 틱 시점 기준)
    self._output_average_price_changes(
      pattern_name, up_count, down_count, up_price_changes, down_price_changes
    )

    if direction == "up":
      logger.info(f"[{pattern_name}] 예측: 상승 {prob_percent:.1f}%")
    elif direction == "down":
      logger.info(f"[{pattern_name}] 예측: 하락 {prob_percent:.1f}%")
    else:
      logger.info(f"[{pattern_name}] 예측: 중립 (확률: {prob_percent:.1f}%)")

  def output_summary(
    self,
    results: List[Tuple[int, int, Tuple[str, float]]],
  ) -> None:
    """전체 요약을 출력합니다."""
    if len(results) <= 1:
      return

    total_up = sum(r[0] for r in results)
    total_down = sum(r[1] for r in results)

    # 전체 결과에 대해 평가
    direction, probability = self.evaluate(total_up, total_down)
    prob_percent = probability * 100

    logger.info(f"\n{'='*60}")
    logger.info(f"전체 요약 ({len(results)}개 패턴):")
    logger.info(f"총 상승: {total_up}개, 총 하락: {total_down}개")
    if direction == "up":
      logger.info(f"전체 예측: 상승 {prob_percent:.1f}%")
    elif direction == "down":
      logger.info(f"전체 예측: 하락 {prob_percent:.1f}%")
    else:
      logger.info(f"전체 예측: 중립 (확률: {prob_percent:.1f}%)")
    logger.info(f"{'='*60}")

