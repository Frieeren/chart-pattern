from src.repositories.chart_similarity_repository import (
  ChartSimilarityRepository,
)


class ChartSimilarityService:
  def __init__(self):
    self.repository = ChartSimilarityRepository()

  def get_latest_similarity(self, db, symbol: str):
    return self.repository.get_latest_by_symbol(db, symbol)
