"""
무작위 시점 선택 전략
"""

import random
from typing import List

import pandas as pd
from sqlalchemy import text


class RandomStrategy:
  """무작위 시점 선택 전략"""

  def get_test_points(
    self,
    session,
    table_name: str,
    period: int,
    tick_count: int,
    n: int,
  ) -> List[pd.Timestamp]:
    """무작위로 N개의 시점을 선택합니다."""
    # 전체 데이터 개수 조회
    count_query = text(f"SELECT COUNT(*) FROM {table_name}")
    total_count = session.execute(count_query).scalar()

    required_count = period + tick_count
    if total_count < required_count:
      raise ValueError(
        f"데이터가 부족합니다. 필요: {required_count}, 현재: {total_count}"
      )

    # 무작위 시점 선택 (마지막 required_count 개는 제외)
    max_start_idx = total_count - required_count
    available_count = min(n, max_start_idx)

    if available_count == 0:
      raise ValueError("선택 가능한 시점이 없습니다.")

    # 효율적인 무작위 선택
    query = text(
      f"""
      SELECT id, time FROM {table_name}
      ORDER BY id
      LIMIT {max_start_idx}
      """
    )
    df = pd.read_sql(query, session.bind)

    if len(df) < available_count:
      available_count = len(df)

    random_indices = random.sample(range(len(df)), available_count)
    time_points = [pd.Timestamp(df.iloc[idx]["time"]) for idx in random_indices]

    return sorted(time_points)

