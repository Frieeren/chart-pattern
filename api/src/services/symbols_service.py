from typing import List

import requests

from src.schemas import Symbols


class SymbolsService:
  BASE_URL = "https://api.binance.com/api/v3"
  EXCHANGE_INFO_URL = f"{BASE_URL}/exchangeInfo"

  def get_symbols(self) -> Symbols:
    """
    바이낸스에서 USDT 종목 코드 리스트를 가져옵니다.
    """
    try:
      response = requests.get(self.EXCHANGE_INFO_URL)
      response.raise_for_status()
      result = response.json()

      # USDT로 끝나는 심볼만 필터링
      usdt_symbols = [
        symbol["symbol"]
        for symbol in result.get("symbols", [])
        if symbol["symbol"].endswith("USDT") and symbol["status"] == "TRADING"
      ]

      return Symbols(symbols=usdt_symbols)

    except Exception:
      # API 요청 실패 시 기본 심볼 리스트 반환
      return Symbols(
        symbols=[
          "BTCUSDT",
          "ETHUSDT",
          "XRPUSDT",
          "BCHUSDT",
          "LTCUSDT",
          "ADAUSDT",
          "DOTUSDT",
        ]
      )
