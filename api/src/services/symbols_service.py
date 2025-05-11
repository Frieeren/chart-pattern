from src.repositories.symbols_repository import SymbolsRepository
from src.schemas import Symbols


class SymbolsService:
  def __init__(self):
    self.repository = SymbolsRepository()

  def get_symbols(self) -> Symbols:
    """
    바이낸스에서 USDT 종목 코드 리스트를 가져옵니다.
    """
    try:
      return self.repository.get_all_symbols()

    except Exception:
      # API 요청 실패 시 기본 심볼 리스트 반환
      return Symbols(
        symbols=[
          "BTCUSDT",
          "ETHUSDT",
          "XRPUSDT",
        ]
      )
