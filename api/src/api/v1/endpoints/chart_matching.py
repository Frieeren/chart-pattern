from typing import List

from fastapi import APIRouter

from src.schemas.chart_matching import (
  ChartMatchingRequest,
  ChartMatchingResponse,
)
from src.services.chart_matching_service import ChartMatchingService

router = APIRouter()


@router.post(
  "/chart_matching_list",
  response_model=List[ChartMatchingResponse],
  tags=["Chart Matching"],
  summary="차트 패턴 매칭 리스트 조회",
  description="주어진 기간 동안의 차트 패턴과 유사한 패턴을 찾아 반환합니다.",
  operation_id="chart_matching_list",
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
  chart_matching_service = ChartMatchingService()
  return chart_matching_service.get_matching_patterns(request)
