from datetime import datetime
from typing import List, Literal, Tuple

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(root_path="/api")


@app.get("/health", tags=["Health Check"])
async def health():
  """
  API 서버의 상태를 확인하는 엔드포인트
  """
  return {"health": "success"}


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


@app.post(
  "/api/v1/chart_matching_list",
  response_model=List[ChartMatchingResponse],
  tags=["Chart Matching"],
  summary="차트 패턴 매칭 리스트 조회",
  description="주어진 기간 동안의 차트 패턴과 유사한 패턴을 찾아 반환합니다.",
)
async def chart_matching_list(request: ChartMatchingRequest):
  """
  차트 패턴 매칭 리스트를 조회합니다.

  - **symbol**: 종목 코드
  - **timeframe**: 시간 단위
  - **startDate**: 시작 날짜 및 시간
  - **endDate**: 종료 날짜 및 시간

  Returns:
      List[ChartMatchingResponse]: 매칭된 차트 패턴 리스트
  """
  # 임시 데이터 예시
  return [
    {
      "symbol": "BTCUSDT",
      "data": [
        {"x": "2024-03-01 12:05:00", "y": [50000, 51000, 50500, 49500]},
        {"x": "2024-03-01 12:10:00", "y": [50500, 52000, 51500, 50000]},
        {"x": "2024-03-01 12:15:00", "y": [51500, 52500, 52000, 51000]},
      ],
      "similarity": 0.85,
    },
    {
      "symbol": "ETHUSDT",
      "data": [
        {"x": "2024-10-01 20:00:00", "y": [3000, 3100, 3050, 2950]},
        {"x": "2024-10-01 20:05:00", "y": [3050, 3200, 3150, 3000]},
        {"x": "2024-10-01 20:10:00", "y": [3150, 3250, 3200, 3100]},
      ],
      "similarity": 0.75,
    },
  ]
