import logging
from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI

from src.scheduler.binance_job import collect_latest_data_job
from src.scheduler.chart_similarity_job import run_chart_similarity_jobs

# 로거 설정
logger = logging.getLogger(__name__)

# 스케줄러 인스턴스 생성
scheduler = BackgroundScheduler()


def init_scheduler(app: FastAPI) -> None:
  """FastAPI 애플리케이션 시작 시 스케줄러를 초기화합니다."""

  @app.on_event("startup")
  async def start_scheduler():
    logger.info("스케줄러 시작")
    register_jobs()
    scheduler.start()

  @app.on_event("shutdown")
  async def shutdown_scheduler():
    logger.info("스케줄러 종료")
    scheduler.shutdown()


def add_job(
  func,
  trigger_type: str = "interval",
  args: tuple = None,
  kwargs: dict = None,
  **trigger_args,
) -> None:
  """
  스케줄러에 새로운 작업을 추가합니다.

  Args:
      func: 실행할 함수
      trigger_type: 트리거 타입 ('interval' 또는 'cron')
      args: 함수에 전달할 위치 인자들
      kwargs: 함수에 전달할 키워드 인자들
      **trigger_args: 트리거에 전달할 인자들
  """
  # 이미 등록된 작업이 있는지 확인
  job_id = f"{func.__name__}_{trigger_type}"
  if scheduler.get_job(job_id):
    logger.info(f"작업 {job_id}가 이미 등록되어 있습니다.")
    return

  scheduler.add_job(
    func, trigger_type, args=args, kwargs=kwargs, id=job_id, **trigger_args
  )


# 스케줄러 작업 등록
TARGET_TABLES = [
  {"symbol": "BTCUSDT", "table": "chart_data_btc_usdt_5m"},
  {"symbol": "ETHUSDT", "table": "chart_data_eth_usdt_5m"},
]


# 최신 데이터 수집 및 유사도 분석 작업
def collect_and_similarity_job(targets):
  collect_latest_data_job(targets)
  run_chart_similarity_jobs(targets)


def register_jobs():
  """스케줄러 작업을 등록합니다."""

  add_job(
    collect_and_similarity_job,
    "cron",
    minute="0,30",
    args=(TARGET_TABLES,),
    next_run_time=datetime.now(),
  )
