from typing import List

from src.schemas.chart_matching import (
  ChartData,
  ChartMatchingRequest,
  ChartMatchingResponse,
)


class ChartMatchingService:
  def get_matching_patterns(
    self, request: ChartMatchingRequest
  ) -> List[ChartMatchingResponse]:
    # TODO: 실제 차트 매칭 로직 구현
    # 현재는 임시 데이터 반환
    return [
      ChartMatchingResponse(
        symbol="BTCUSDT",
        data=[
          ChartData(x="2024-03-01 12:05:00", y=[50000, 51000, 50500, 49500]),
          ChartData(x="2024-03-01 12:10:00", y=[50500, 52000, 51500, 50000]),
          ChartData(x="2024-03-01 12:15:00", y=[51500, 52500, 52000, 51000]),
        ],
        similarity=0.85,
      ),
      ChartMatchingResponse(
        symbol="ETHUSDT",
        data=[
          ChartData(x="2024-10-01 20:00:00", y=[3000, 3100, 3050, 2950]),
          ChartData(x="2024-10-01 20:05:00", y=[3050, 3200, 3150, 3000]),
          ChartData(x="2024-10-01 20:10:00", y=[3150, 3250, 3200, 3100]),
        ],
        similarity=0.75,
      ),
    ]
