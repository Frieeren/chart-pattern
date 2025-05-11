from fastapi import APIRouter

from src.schemas.symbols import Symbols
from src.services.symbols_service import SymbolsService

router = APIRouter()


@router.get(
  "/symbols",
  response_model=Symbols,
  tags=["Symbols"],
  summary="종목 코드 리스트 조회",
  description="종목 코드 리스트를 반환합니다.",
  operation_id="symbols",
)
async def symbols():
  symbols_service = SymbolsService()
  return symbols_service.get_symbols()
