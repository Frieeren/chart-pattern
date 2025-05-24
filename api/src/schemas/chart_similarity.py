from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class PriceData(BaseModel):
  time: datetime
  open: float
  high: float
  low: float
  close: float
  volume: float | None = None


class ChartSimilarityBase(BaseModel):
  symbol: str = Field(..., description="심볼 (예: BTCUSDT, ETHUSDT 등)")
  time: datetime
  start_time: datetime
  end_time: datetime
  similarity: float
  price_data: list[PriceData] | None = None

  class Config:
    orm_mode = True


class ChartSimilarityList(BaseModel):
  similarities: List[ChartSimilarityBase] = Field(
    ..., description="차트 유사도 결과 리스트"
  )

  class Config:
    json_schema_extra = {
      "example": {
        "similarities": [
          {
            "symbol": "BTCUSDT",
            "time": "2024-06-01T00:00:00",
            "start_time": "2024-05-31T00:00:00",
            "end_time": "2024-06-01T00:00:00",
            "similarity": 0.1234,
            "price_data": [
              {
                "time": "2024-05-31T00:00:00",
                "open": 100.0,
                "high": 110.0,
                "low": 95.0,
                "close": 105.0,
                "volume": 1234.5,
              },
              {
                "time": "2024-05-31T00:05:00",
                "open": 105.0,
                "high": 112.0,
                "low": 104.0,
                "close": 110.0,
                "volume": 2345.6,
              },
            ],
          }
        ]
      }
    }
