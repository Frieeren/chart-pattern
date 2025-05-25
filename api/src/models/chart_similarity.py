from sqlalchemy import Column, DateTime, Float, Integer, String

from src.db.session import Base


class ChartSimilarity(Base):
  """차트 유사도 결과 모델"""

  __tablename__ = "chart_similarity"

  id = Column(Integer, primary_key=True, index=True)
  symbol = Column(String(20), index=True, nullable=False)
  time = Column(DateTime, index=True, nullable=False)
  start_time = Column(DateTime, index=True, nullable=False)
  end_time = Column(DateTime, index=True, nullable=False)
  similarity = Column(Float, nullable=False)


class ChartData(Base):
  """5분봉 테이블용 공통 ORM 모델"""

  __abstract__ = True

  id = Column(Integer, primary_key=True)
  time = Column(DateTime, nullable=False)
  open = Column(Float)
  high = Column(Float)
  low = Column(Float)
  close = Column(Float)
  volume = Column(Float)
