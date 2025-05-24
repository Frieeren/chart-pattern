import logging

from sqlalchemy import MetaData, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

from src.constants.symbol_table_map import get_table_name_by_symbol
from src.models.chart_similarity import (
  ChartData,
  ChartSimilarity,
)
from src.schemas.chart_similarity import (
  ChartSimilarityBase,
  ChartSimilarityList,
)

logger = logging.getLogger(__name__)

Base = declarative_base()

_chart_data_class_cache = {}


def orm_to_dict(obj):
  return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}


class ChartSimilarityRepository:
  def get_price_data_by_time_range(
    self, db: Session, symbol: str, start_time, end_time
  ):
    """
    ORM 방식으로 심볼별 5분봉 테이블에서 start_time ~ end_time 구간의 가격 데이터를 조회합니다.
    테이블명은 동적으로 주입합니다.
    """
    table_name = get_table_name_by_symbol(symbol)
    metadata = MetaData()
    table = Table(table_name, metadata, autoload_with=db.bind)

    if table_name in _chart_data_class_cache:
      ChartDataDynamic = _chart_data_class_cache[table_name]
    else:
      ChartDataDynamic = type(
        f"ChartData_{table_name}", (ChartData,), {"__table__": table}
      )
      _chart_data_class_cache[table_name] = ChartDataDynamic

    rows = (
      db.query(ChartDataDynamic)
      .filter(
        ChartDataDynamic.time >= start_time, ChartDataDynamic.time <= end_time
      )
      .order_by(ChartDataDynamic.time.asc())
      .all()
    )

    return [
      {
        "time": row.time,
        "open": row.open,
        "high": row.high,
        "low": row.low,
        "close": row.close,
        "volume": row.volume,
      }
      for row in rows
    ]

  def get_latest_by_symbol(
    self, db: Session, symbol: str
  ) -> ChartSimilarityList:
    try:
      latest_time = (
        db.query(ChartSimilarity.time)
        .filter(ChartSimilarity.symbol == symbol)
        .order_by(ChartSimilarity.time.desc())
        .first()
      )

      if not latest_time:
        return ChartSimilarityList(similarities=[])

      results = (
        db.query(ChartSimilarity)
        .filter(
          ChartSimilarity.symbol == symbol,
          ChartSimilarity.time == latest_time[0],
        )
        .all()
      )

      similarities = []
      for obj in results:
        base = ChartSimilarityBase.model_validate(orm_to_dict(obj))

        price_data = self.get_price_data_by_time_range(
          db, symbol, obj.start_time, obj.end_time
        )
        base_dict = base.model_dump()
        base_dict["price_data"] = price_data
        similarities.append(base_dict)

      return ChartSimilarityList(similarities=similarities)
    except Exception as e:
      logger.error(f"get_latest_by_symbol error: {e}")
      return ChartSimilarityList(similarities=[])
