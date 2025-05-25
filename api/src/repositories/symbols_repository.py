from src.constants.symbol_table_map import get_usage_symbols
from src.schemas import Symbols


class SymbolsRepository:
  def get_all_symbols(self) -> Symbols:
    """
    사용 가능한 모든 심볼 정보를 가져옵니다.
    """
    return Symbols(symbols=get_usage_symbols())
