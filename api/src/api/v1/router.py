from fastapi import APIRouter

from .endpoints import (
  chart_similarity_router,
  health_router,
  symbols_router,
)

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(symbols_router, prefix="/v1", tags=["Symbols"])
api_router.include_router(
  chart_similarity_router, prefix="/v1", tags=["Chart Similarity"]
)
