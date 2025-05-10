from fastapi import APIRouter

from .endpoints import (
  chart_matching_router,
  health_router,
  symbols_router,
  users_router,
)

api_router = APIRouter()

# Health Check 라우터는 prefix 없이 루트에 등록
api_router.include_router(health_router)

# 나머지 라우터들은 prefix와 함께 등록
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(symbols_router, prefix="/api/v1", tags=["Symbols"])
api_router.include_router(
  chart_matching_router, prefix="/api/v1", tags=["Chart Matching"]
)
