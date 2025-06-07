import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# OpenTelemetry imports
from opentelemetry import metrics, trace
from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import OTLPLogExporter
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import (
  OTLPMetricExporter,
)
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import (
  OTLPSpanExporter,
)
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.logging import LoggingInstrumentor

# SDK imports
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
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
  }
)

# 트레이싱 설정
tracer_provider = TracerProvider(resource=resource)
trace.set_tracer_provider(tracer_provider)

otlp_span_exporter = OTLPSpanExporter(
  endpoint="http://localhost:4317", insecure=True
)
span_processor = BatchSpanProcessor(otlp_span_exporter)
tracer_provider.add_span_processor(span_processor)

# 메트릭 설정
metric_exporter = OTLPMetricExporter(
  endpoint="http://localhost:4317", insecure=True, timeout=30
)

metric_reader = PeriodicExportingMetricReader(
  exporter=metric_exporter, export_interval_millis=5000
)

meter_provider = MeterProvider(
  resource=resource, metric_readers=[metric_reader]
)
metrics.set_meter_provider(meter_provider)

# 로깅 설정
logger_provider = LoggerProvider(resource=resource)
set_logger_provider(logger_provider)

log_processor = BatchLogRecordProcessor(
  OTLPLogExporter(endpoint="http://localhost:4317")
)
logger_provider.add_log_record_processor(log_processor)

# OpenTelemetry 로깅 핸들러를 루트 로거에 추가
handler = LoggingHandler(logger_provider=logger_provider)
logging.getLogger().addHandler(handler)

# 로그-트레이스 상관관계 설정
LoggingInstrumentor().instrument(set_logging_format=True)

# FastAPI 앱 생성
app = FastAPI(
  title="Chart Pattern API",
  description="차트 패턴 매칭을 위한 API 서버",
  version="1.0.0",
  root_path="/api",
)

# FastAPI 자동 계측 (모든 provider 포함)
FastAPIInstrumentor.instrument_app(
  app, tracer_provider=tracer_provider, meter_provider=meter_provider
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
