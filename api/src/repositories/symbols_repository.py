import requests

from src.schemas import Symbols


class SymbolsRepository:
  BASE_URL = "https://api.binance.com/api/v3"
  EXCHANGE_INFO_URL = f"{BASE_URL}/exchangeInfo"

  def get_all_symbols(self) -> Symbols:
    """
    바이낸스에서 모든 심볼 정보를 가져옵니다.
    """
    response = requests.get(self.EXCHANGE_INFO_URL)
    response.raise_for_status()
    result = response.json()

    symbols = [
      symbol["symbol"]
      for symbol in result.get("symbols", [])
      if symbol["symbol"].endswith("USDT") and symbol["status"] == "TRADING"
    ]

    return Symbols(symbols=symbols)
