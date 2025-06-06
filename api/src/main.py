import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from opentelemetry import trace
from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import OTLPLogExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import (
  OTLPSpanExporter,
)
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.logging import LoggingInstrumentor

# 로깅 설정을 위한 추가 import
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from src.api.v1.router import api_router
from src.scheduler.scheduler import init_scheduler

# 기본 로깅 설정
logging.basicConfig(level=logging.INFO)

# 리소스 정보 설정 (서비스 식별을 위한 중요한 메타데이터)
resource = Resource.create(
  {
    "service.name": "api-service",
    "service.version": "1.0.0",
    "environment": "development",
    "deployment.environment": "local",
  }
)

# 기존 트레이싱 설정 유지
tracer_provider = TracerProvider(resource=resource)
trace.set_tracer_provider(tracer_provider)

otlp_exporter = OTLPSpanExporter(endpoint="http://lgtm:4317", insecure=True)
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

# 로깅 설정 추가
logger_provider = LoggerProvider(resource=resource)
set_logger_provider(logger_provider)

# 로그 프로세서 추가 (배치 처리로 성능 최적화)
log_processor = BatchLogRecordProcessor(
  OTLPLogExporter(endpoint="http://lgtm:4317")
)
logger_provider.add_log_record_processor(log_processor)

# OpenTelemetry 로깅 핸들러를 루트 로거에 추가
handler = LoggingHandler(logger_provider=logger_provider)
logging.getLogger().addHandler(handler)

# 로그-트레이스 상관관계 설정 (중요!)
LoggingInstrumentor().instrument(set_logging_format=True)

app = FastAPI(
  title="Chart Pattern API",
  description="차트 패턴 매칭을 위한 API 서버",
  version="1.0.0",
  root_path="/api",
)
FastAPIInstrumentor.instrument_app(app, tracer_provider=tracer_provider)

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
