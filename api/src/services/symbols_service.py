from src.repositories.symbols_repository import SymbolsRepository
from src.schemas import Symbols


class SymbolsService:
  def __init__(self):
    self.repository = SymbolsRepository()

  def get_symbols(self) -> Symbols:
    """
    사용 가능한 모든 심볼 정보를 가져옵니다.
    """
    try:
      return self.repository.get_all_symbols()

    except Exception:
      return Symbols(symbols=["BTCUSDT", "ETHUSDT"])
