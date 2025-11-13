"""
가격 변동률 분석 평가 전략 - 방향에 따른 평균 변동률 계산
"""

import logging
from typing import Dict, List, Tuple

import pandas as pd

from src.backtest.evaluation_strategy_interface import EvaluationStrategy

logger = logging.getLogger(__name__)


class PriceAnalysisStrategy(EvaluationStrategy):
  """가격 변동률 분석 전략 - 상승/하락 패턴의 평균 변동률을 계산"""

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
    """결과를 출력합니다 (평균 가격 변동률 포함)."""
    logger.info(f"타겟 패턴: {target_pattern.index[0]} ~ {target_pattern.index[-1]}")
    logger.info(f"유사도 계산 완료: {len(similarities)}개")

    # 상위 10개 출력
    top_n = min(10, len(similarities))
    top_results = similarities[:top_n]
    logger.info(f"\n상위 {len(top_results)}개 후보:")
    for i, (start_time, sim, end_idx) in enumerate(top_results, 1):
      logger.info(f"{i}. {start_time}, 유사도: {sim:.4f}")

    direction, probability = self.evaluate(up_count, down_count)
    prob_percent = probability * 100

    logger.info(f"\n[{pattern_name}] 결과: 상승 {up_count}개, 하락 {down_count}개")

    # 상승 패턴의 평균 변동률 계산
    if up_price_changes and len(up_price_changes) > 0:
      avg_up_change = sum(up_price_changes) / len(up_price_changes)
      logger.info(
        f"[{pattern_name}] 상승 {up_count}개 → 평균 {avg_up_change:+.2f}% 상승"
      )
    else:
      avg_up_change = 0.0

    # 하락 패턴의 평균 변동률 계산
    if down_price_changes and len(down_price_changes) > 0:
      avg_down_change = sum(down_price_changes) / len(down_price_changes)
      logger.info(
        f"[{pattern_name}] 하락 {down_count}개 → 평균 {avg_down_change:+.2f}% 하락"
      )
    else:
      avg_down_change = 0.0

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


