from datetime import datetime
from typing import List, Literal

from pydantic import BaseModel, Field


class ChartMatchingRequest(BaseModel):
  symbol: str = Field(..., description="종목 코드 (예: BTCUSDT)")
  timeframe: Literal[
    "1", "3", "5", "15", "30", "60", "120", "180", "240", "D", "W"
  ] = Field(..., description="시간 단위 (예: 5m, 1h, 1d)")
  startDate: datetime = Field(..., description="시작 날짜 및 시간")
  endDate: datetime = Field(..., description="종료 날짜 및 시간")

  class Config:
    json_schema_extra = {
      "example": {
        "symbol": "BTCUSDT",
        "timeframe": "5",
        "startDate": "2024-03-01T12:00:00Z",
        "endDate": "2024-03-01T13:00:00Z",
      }
    }


class ChartData(BaseModel):
  x: str = Field(..., description="날짜 및 시간")
  y: List[float] = Field(..., description="[시가, 고가, 종가, 저가]")


class ChartMatchingResponse(BaseModel):
  symbol: str = Field(..., description="종목 코드")
  data: List[ChartData] = Field(..., description="차트 데이터")
  similarity: float = Field(..., description="유사도 점수 (0~1)")
