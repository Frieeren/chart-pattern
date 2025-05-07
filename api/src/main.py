from datetime import datetime
from typing import List, Literal, Tuple

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from .database import User, get_db

app = FastAPI(root_path="/api")


# User 관련 Pydantic 모델
class UserBase(BaseModel):
  username: str
  email: EmailStr


class UserCreate(UserBase):
  pass


class UserResponse(UserBase):
  id: int
  created_at: datetime

  class Config:
    from_attributes = True


@app.get("/health", tags=["Health Check"])
async def health():
  """
  API 서버의 상태를 확인하는 엔드포인트
  """
  return {"health": "success"}


@app.post("/users/", response_model=UserResponse, tags=["Users"])
def create_user(user: UserCreate, db: Session = Depends(get_db)):
  """
  새로운 사용자를 생성합니다.
  """
  # 이메일 중복 체크
  db_user = db.query(User).filter(User.email == user.email).first()
  if db_user:
    raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다.")

  # 사용자명 중복 체크
  db_user = db.query(User).filter(User.username == user.username).first()
  if db_user:
    raise HTTPException(
      status_code=400, detail="이미 사용 중인 사용자명입니다."
    )

  db_user = User(username=user.username, email=user.email)
  db.add(db_user)
  db.commit()
  db.refresh(db_user)
  return db_user


@app.get("/users/", response_model=List[UserResponse], tags=["Users"])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
  """
  모든 사용자 목록을 조회합니다.
  """
  users = db.query(User).offset(skip).limit(limit).all()
  return users


@app.get("/users/{user_id}", response_model=UserResponse, tags=["Users"])
def read_user(user_id: int, db: Session = Depends(get_db)):
  """
  특정 ID의 사용자 정보를 조회합니다.
  """
  user = db.query(User).filter(User.id == user_id).first()
  if user is None:
    raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
  return user


class ChartMatchingRequest(BaseModel):
  symbol: str = Field(..., description="종목 코드 (예: BTCUSDT)")
  timeframe: Literal[
    "1", "3", "5", "15", "30", "60", "120", "180", "240", "D", "W"
  ] = Field(..., description="시간 단위 (예: 5m, 1h, 1d)")
  startDate: datetime = Field(..., description="시작 날짜 및 시간")
  endDate: datetime = Field(..., description="종료 날짜 및 시간")

  class Config:
    json_schema_extra = {
      "example": {
        "symbol": "BTCUSDT",
        "timeframe": "5",
        "startDate": "2024-03-01T12:00:00Z",
        "endDate": "2024-03-01T13:00:00Z",
      }
    }


class ChartData(BaseModel):
  x: str = Field(..., description="날짜 및 시간")
  y: List[float] = Field(..., description="[시가, 고가, 종가, 저가]")


class ChartMatchingResponse(BaseModel):
  symbol: str = Field(..., description="종목 코드")
  data: List[ChartData] = Field(..., description="차트 데이터")
  similarity: float = Field(..., description="유사도 점수 (0~1)")


@app.post(
  "/api/v1/chart_matching_list",
  response_model=List[ChartMatchingResponse],
  tags=["Chart Matching"],
  summary="차트 패턴 매칭 리스트 조회",
  description="주어진 기간 동안의 차트 패턴과 유사한 패턴을 찾아 반환합니다.",
  operation_id="chart_matching_list",
)
async def chart_matching_list(request: ChartMatchingRequest):
  """
  차트 패턴 매칭 리스트를 조회합니다.

  - **symbol**: 종목 코드
  - **timeframe**: 시간 단위
  - **startDate**: 시작 날짜 및 시간
  - **endDate**: 종료 날짜 및 시간

  Returns:
      List[ChartMatchingResponse]: 매칭된 차트 패턴 리스트
  """
  # 임시 데이터 예시
  return [
    {
      "symbol": "BTCUSDT",
      "data": [
        {"x": "2024-03-01 12:05:00", "y": [50000, 51000, 50500, 49500]},
        {"x": "2024-03-01 12:10:00", "y": [50500, 52000, 51500, 50000]},
        {"x": "2024-03-01 12:15:00", "y": [51500, 52500, 52000, 51000]},
      ],
      "similarity": 0.85,
    },
    {
      "symbol": "ETHUSDT",
      "data": [
        {"x": "2024-10-01 20:00:00", "y": [3000, 3100, 3050, 2950]},
        {"x": "2024-10-01 20:05:00", "y": [3050, 3200, 3150, 3000]},
        {"x": "2024-10-01 20:10:00", "y": [3150, 3250, 3200, 3100]},
      ],
      "similarity": 0.75,
    },
  ]
