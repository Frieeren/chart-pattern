from typing import List

from pydantic import BaseModel, Field


class Symbols(BaseModel):
  symbols: List[str] = Field(
    ..., description="종목 코드 리스트 (예: ['BTCUSDT', 'ETHUSDT'])"
  )

  class Config:
    json_schema_extra = {"example": {"symbols": ["BTCUSDT", "ETHUSDT"]}}
