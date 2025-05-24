from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.v1.router import api_router
from src.scheduler.scheduler import init_scheduler

app = FastAPI(
  title="Chart Pattern API",
  description="차트 패턴 매칭을 위한 API 서버",
  version="1.0.0",
  root_path="/api",
)

# CORS 미들웨어 설정
app.add_middleware(
  CORSMiddleware,
  allow_origins=[
    "http://localhost:3000",  # 로컬 개발 환경
    "http://localhost:8000",  # nginx
    "http://127.0.0.1:3000",  # 로컬 개발 환경 (IP)
    "http://127.0.0.1:8000",  # nginx (IP)
  ],
  allow_credentials=True,
  allow_methods=["*"],  # 모든 HTTP 메서드 허용
  allow_headers=["*"],  # 모든 헤더 허용
)

# API 라우터 등록
app.include_router(api_router)

# 스케줄러 초기화
init_scheduler(app)
