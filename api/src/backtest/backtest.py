"""
알고리즘 백테스팅 스크립트

사용법:
    python -m src.backtest.backtest --symbol BTCUSDT --period 300 --tick_count 12 --n 100 --strategy simple
    python -m src.backtest.backtest --symbol BTCUSDT --period 300 --tick_count 12 --n 100 --strategy price_analysis
"""

import argparse
import logging
import random
from typing import Dict, List, Tuple

import pandas as pd
from sqlalchemy import text

from src.backtest.algorithm_interface import SimilarityAlgorithm
from src.backtest.candleonly_algorithm import CandleOnlyAlgorithm
from src.backtest.evaluation_strategy_interface import EvaluationStrategy
from src.backtest.strategies import (
  PriceAnalysisStrategy,
  RandomStrategy,
  SimpleMajorityStrategy,
  TimeBasedAverageStrategy,
)
from src.constants.symbol_table_map import get_table_name_by_symbol
from src.db.session import SessionLocal

logging.basicConfig(
  level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def prepare_data(df: pd.DataFrame) -> pd.DataFrame:
  """데이터프레임을 준비하고 Date를 인덱스로 설정"""
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


def get_pattern_data(
  session, table_name: str, start_time: pd.Timestamp, count: int
) -> pd.DataFrame:
  """
    특정 시점부터 count 개의 데이터를 가져옵니다.

    Args:
      session: DB 세션
      table_name: 테이블명
      start_time: 시작 시점
      count: 가져올 데이터 개수

    Returns:
      데이터프레임
    """
  query = text(
    f"""
    SELECT * FROM {table_name}
    WHERE time >= :start_time
    ORDER BY time ASC
    LIMIT {count}
    """
  )
  df = pd.read_sql(query, session.bind, params={"start_time": start_time})
  return prepare_data(df)


def calculate_price_direction(
  data: pd.DataFrame, start_idx: int, tick_count: int
) -> str:
  """
    특정 시점 이후 tick_count 개의 틱이 상승인지 하락인지 판단합니다.

    Args:
      data: 전체 데이터
      start_idx: 시작 인덱스
      tick_count: 판단할 틱 개수

    Returns:
      'up' 또는 'down'
    """
  if start_idx + tick_count > len(data):
    raise ValueError("데이터가 부족합니다.")

  start_price = data["Close"].iloc[start_idx]
  end_price = data["Close"].iloc[start_idx + tick_count - 1]

  return "up" if end_price > start_price else "down"


def test_single_pattern(
  target_start_time: pd.Timestamp,
  target_pattern: pd.DataFrame,
  candidate_time_points: List[pd.Timestamp],
  all_data: pd.DataFrame,
  session,
  table_name: str,
  period: int,
  tick_count: int,
  algorithm: SimilarityAlgorithm,
  evaluation_strategy: EvaluationStrategy,
  pattern_name: str,
) -> Tuple[int, int, Tuple[str, float]]:
  """
    단일 패턴에 대한 백테스팅을 실행합니다.

    Args:
      target_start_time: 타겟 패턴 시작 시점
      target_pattern: 타겟 패턴 데이터프레임
      candidate_time_points: 후보 시점 리스트
      all_data: 전체 데이터
      session: DB 세션
      table_name: 테이블명
      period: 패턴 틱 개수
      tick_count: 이후 판단할 틱 개수
      algorithm: 유사도 알고리즘
      evaluation_strategy: 평가 전략 (평가 및 출력 담당)
      pattern_name: 패턴 식별자

    Returns:
      (상승 개수, 하락 개수, (방향, 확률)) 튜플
    """
  # 각 후보 패턴과의 유사도 계산 (타겟 제외)
  similarities: List[Tuple[pd.Timestamp, float, int]] = []

  for candidate_start_time in candidate_time_points:
    if candidate_start_time == target_start_time:
      continue  # 타겟 제외
    candidate_pattern = get_pattern_data(
      session, table_name, candidate_start_time, period
    )

    if len(candidate_pattern) < period:
      continue

    similarity = algorithm.calculate_similarity(target_pattern, candidate_pattern)
    candidate_end_idx = all_data.index.get_loc(candidate_pattern.index[-1])
    similarities.append((candidate_start_time, similarity, candidate_end_idx))

  # 유사도 순으로 정렬 (낮을수록 유사함)
  similarities.sort(key=lambda x: x[1])

  # 상위 10개 선택 (또는 가능한 만큼)
  top_n = min(10, len(similarities))
  top_results = similarities[:top_n]

  # 상위 10개의 상승/하락 판단 및 가격 변동률 계산
  up_count = 0
  down_count = 0
  up_price_changes: List[float] = []
  down_price_changes: List[float] = []
  # 여러 틱 시점별 가격 변동률 수집 (시간 단위 평균 경로 분석용)
  up_price_changes_by_tick: Dict[int, List[float]] = {}
  down_price_changes_by_tick: Dict[int, List[float]] = {}
  
  # 분석할 틱 시점들: 0부터 tick_count까지 10단위로 생성 (10, 20, 30, ...)
  tick_points = [tick for tick in range(10, tick_count + 1, 10)]

  for start_time, _, end_idx in top_results:
    try:
      # 패턴 끝 시점 이후 tick_count 틱의 가격 변동률 계산
      start_idx = end_idx + 1
      end_idx_price = start_idx + tick_count - 1
      
      if end_idx_price >= len(all_data):
        raise ValueError("데이터가 부족합니다.")
      
      start_price = all_data["Close"].iloc[start_idx]
      end_price = all_data["Close"].iloc[end_idx_price]
      price_change = ((end_price - start_price) / start_price) * 100  # 퍼센트

      direction = calculate_price_direction(all_data, start_idx, tick_count)
      
      # 여러 틱 시점별 가격 변동률 계산 (10단위로)
      for tick_point in tick_points:
        tick_end_idx = start_idx + tick_point - 1
        if tick_end_idx < len(all_data):
          tick_end_price = all_data["Close"].iloc[tick_end_idx]
          tick_price_change = ((tick_end_price - start_price) / start_price) * 100
          
          if direction == "up":
            if tick_point not in up_price_changes_by_tick:
              up_price_changes_by_tick[tick_point] = []
            up_price_changes_by_tick[tick_point].append(tick_price_change)
          else:
            if tick_point not in down_price_changes_by_tick:
              down_price_changes_by_tick[tick_point] = []
            down_price_changes_by_tick[tick_point].append(tick_price_change)
      
      if direction == "up":
        up_count += 1
        up_price_changes.append(price_change)
      else:
        down_count += 1
        down_price_changes.append(price_change)
    except (ValueError, KeyError) as e:
      logger.warning(f"시점 {start_time}에서 방향 판단 실패: {e}")
      continue

  # 평가 전략으로 결과 평가 및 출력
  evaluation_strategy.output_results(
    pattern_name=pattern_name,
    target_pattern=target_pattern,
    similarities=similarities,
    up_count=up_count,
    down_count=down_count,
    up_price_changes=up_price_changes if up_price_changes else None,
    down_price_changes=down_price_changes if down_price_changes else None,
    up_price_changes_by_tick=up_price_changes_by_tick if up_price_changes_by_tick else None,
    down_price_changes_by_tick=down_price_changes_by_tick if down_price_changes_by_tick else None,
  )

  # 반환값을 위해 평가
  direction, probability = evaluation_strategy.evaluate(up_count, down_count)

  return (up_count, down_count, (direction, probability))


def run_backtest(
  symbol: str,
  period: int,
  tick_count: int = 12,
  n: int = 100,
  algorithm: SimilarityAlgorithm | None = None,
  evaluation_strategy: EvaluationStrategy | None = None,
) -> Tuple[int, int, Tuple[str, float]]:
  """
    알고리즘 백테스팅을 실행합니다.

    Args:
      symbol: 심볼 (예: BTCUSDT)
      period: 입력 패턴의 틱 개수
      tick_count: 이후 판단할 틱 개수 (기본값: 12)
      n: 시점 개수 (기본값: 100)
      algorithm: 사용할 알고리즘 (기본값: CandleOnlyAlgorithm)
      evaluation_strategy: 평가 전략 (기본값: SimpleMajorityStrategy)

    Returns:
      (상승 개수, 하락 개수, (방향, 확률)) 튜플
    """
  if algorithm is None:
    algorithm = CandleOnlyAlgorithm()

  if evaluation_strategy is None:
    evaluation_strategy = SimpleMajorityStrategy()

  # 무작위 전략 사용
  strategy = RandomStrategy()

  table_name = get_table_name_by_symbol(symbol)
  session = SessionLocal()

  try:
    logger.info(f"심볼: {symbol}, 기간: {period}, 틱: {tick_count}, N: {n}")

    # 1. 무작위 시점 N개 선택 (후보 N개)
    test_time_points = strategy.get_test_points(
      session, table_name, period, tick_count, n
    )
    logger.info(f"무작위 시점 {len(test_time_points)}개 선택 완료")

    # 2. 전체 데이터 로드 (유사도 계산 및 방향 판단을 위해)
    all_data_query = text(f"SELECT * FROM {table_name} ORDER BY time ASC")
    all_df = pd.read_sql(all_data_query, session.bind)
    all_data = prepare_data(all_df)

    # 3. 타겟 패턴 선택 (무작위로 선택)
    target_start_time = random.choice(test_time_points)
    target_pattern = get_pattern_data(session, table_name, target_start_time, period)

    result = test_single_pattern(
      target_start_time=target_start_time,
      target_pattern=target_pattern,
      candidate_time_points=test_time_points,
      all_data=all_data,
      session=session,
      table_name=table_name,
      period=period,
      tick_count=tick_count,
      algorithm=algorithm,
      evaluation_strategy=evaluation_strategy,
      pattern_name="패턴-1",
    )

    return result

  finally:
    session.close()


def main():
  parser = argparse.ArgumentParser(description="알고리즘 백테스팅")
  parser.add_argument(
    "--symbol", type=str, required=True, help="심볼 (예: BTCUSDT)"
  )
  parser.add_argument(
    "--period", type=int, required=True, help="입력 패턴의 틱 개수"
  )
  parser.add_argument(
    "--tick_count",
    type=int,
    default=12,
    help="이후 판단할 틱 개수 (기본값: 12)",
  )
  parser.add_argument(
    "--n", type=int, default=100, help="무작위 시점 개수 (기본값: 100)"
  )
  parser.add_argument(
    "--strategy",
    type=str,
    default="simple",
    choices=["simple", "price_analysis", "time_based_average"],
    help="평가 전략 (기본값: simple)",
  )
  args = parser.parse_args()

  # 평가 전략 생성 (평가 및 출력 담당)
  if args.strategy == "simple":
    evaluation_strategy = SimpleMajorityStrategy()
  elif args.strategy == "price_analysis":
    evaluation_strategy = PriceAnalysisStrategy()
  elif args.strategy == "time_based_average":
    evaluation_strategy = TimeBasedAverageStrategy()
  else:
    evaluation_strategy = SimpleMajorityStrategy()

  up_count, down_count, (direction, probability) = run_backtest(
    symbol=args.symbol,
    period=args.period,
    tick_count=args.tick_count,
    n=args.n,
    evaluation_strategy=evaluation_strategy,
  )

  prob_percent = probability * 100
  print(f"\n최종 결과:")
  print(f"상승: {up_count}개, 하락: {down_count}개")
  if direction == "up":
    print(f"예측: 상승 {prob_percent:.1f}%")
  else:
    print(f"예측: 하락 {prob_percent:.1f}%")


if __name__ == "__main__":
  main()
