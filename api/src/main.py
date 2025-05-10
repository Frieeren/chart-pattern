from fastapi import FastAPI

from src.api.v1.router import api_router

app = FastAPI(
  title="Chart Pattern API",
  description="차트 패턴 매칭을 위한 API 서버",
  version="1.0.0",
  root_path="/api",
)

# API 라우터 등록
app.include_router(api_router)
