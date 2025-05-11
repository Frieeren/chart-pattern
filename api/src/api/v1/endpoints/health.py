from fastapi import APIRouter

router = APIRouter()


@router.get(
  "/health",
  tags=["Health Check"],
  summary="API 서버 상태 확인",
  description="API 서버의 상태를 확인하는 엔드포인트",
  operation_id="health_check",
)
async def health():
  """
  API 서버의 상태를 확인하는 엔드포인트
  """
  return {"health": "success"}
