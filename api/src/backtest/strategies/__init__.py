"""평가 전략 모듈"""

from src.backtest.strategies.evaluation_strategy import SimpleMajorityStrategy
from src.backtest.strategies.price_analysis_strategy import PriceAnalysisStrategy
from src.backtest.strategies.random_strategy import RandomStrategy
from src.backtest.strategies.time_based_average_strategy import (
  TimeBasedAverageStrategy,
)

__all__ = [
  "SimpleMajorityStrategy",
  "PriceAnalysisStrategy",
  "RandomStrategy",
  "TimeBasedAverageStrategy",
]

