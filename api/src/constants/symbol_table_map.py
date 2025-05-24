TARGET_TABLES = [
  {"symbol": "BTCUSDT", "table": "chart_data_btc_usdt_5m"},
  {"symbol": "ETHUSDT", "table": "chart_data_eth_usdt_5m"},
]


def get_table_name_by_symbol(symbol: str) -> str:
  for item in TARGET_TABLES:
    if item["symbol"] == symbol:
      return item["table"]
  raise ValueError(f"Unknown symbol: {symbol}")


def get_usage_symbols() -> list[str]:
  return [item["symbol"] for item in TARGET_TABLES]
