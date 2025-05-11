from fastapi import APIRouter

from .endpoints import (
  chart_matching_router,
  health_router,
  symbols_router,
  users_router,
)

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(symbols_router, prefix="/v1", tags=["Symbols"])
api_router.include_router(
  chart_matching_router, prefix="/v1", tags=["Chart Matching"]
)
