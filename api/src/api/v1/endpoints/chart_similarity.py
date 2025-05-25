from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.schemas.chart_similarity import ChartSimilarityList
from src.services.chart_similarity_service import ChartSimilarityService

router = APIRouter()


@router.get(
  "/chart-similarity/{symbol}",
  response_model=ChartSimilarityList,
  tags=["Chart Similarity"],
  summary="차트 유사도 결과 조회",
  description="심볼별 최신 차트 유사도 결과 리스트를 반환합니다.",
  operation_id="chart_similarity_latest",
)
async def read_latest_chart_similarity(
  symbol: str = Path(..., description="심볼 (예: BTCUSDT, ETHUSDT, ..)"),
  db: Session = Depends(get_db),
):
  service = ChartSimilarityService()
  result = service.get_latest_similarity(db, symbol)

  if not result.similarities:
    raise HTTPException(status_code=404, detail="No similarity data found")
  return result
