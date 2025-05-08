import os
from datetime import datetime

from dotenv import load_dotenv
from sqlalchemy import Column, DateTime, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

user = os.getenv("DB_USER")
passwd = os.getenv("DB_PASSWD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
db = os.getenv("DB_NAME")

SQLALCHEMY_DATABASE_URL = (
  f"mysql+pymysql://{user}:{passwd}@{host}:{port}/{db}?charset=utf8mb4"
)

# 데이터베이스 URL 설정
if not all([user, passwd, host, port, db]):
  raise ValueError("데이터베이스 환경 변수가 올바르게 설정되지 않았습니다.")

# 데이터베이스 엔진 생성
engine = create_engine(
  SQLALCHEMY_DATABASE_URL,
  pool_size=5,
  max_overflow=10,
  pool_timeout=30,
  pool_recycle=1800,
)

# 세션 로컬 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 베이스 모델 생성
Base = declarative_base()


# User 모델 정의
class User(Base):
  __tablename__ = "users"

  id = Column(Integer, primary_key=True, autoincrement=True)
  username = Column(String(50), nullable=False, unique=True)
  email = Column(String(100), nullable=False, unique=True)
  created_at = Column(DateTime, default=datetime.utcnow)


# 모델과 데이터베이스 테이블을 동기화하는 함수
def init_db():
  Base.metadata.create_all(bind=engine)


# 데이터베이스 세션 의존성 설정하는 함수
def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()
