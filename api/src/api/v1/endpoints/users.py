from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.schemas.user import UserCreate, UserResponse
from src.services.user_service import UserService

router = APIRouter()


@router.post("/", response_model=UserResponse, tags=["Users"])
def create_user(user: UserCreate, db: Session = Depends(get_db)):
  """
  새로운 사용자를 생성합니다.
  """
  user_service = UserService(db)
  return user_service.create_user(user)


@router.get("/", response_model=List[UserResponse], tags=["Users"])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
  """
  모든 사용자 목록을 조회합니다.
  """
  user_service = UserService(db)
  return user_service.get_users(skip, limit)


@router.get("/{user_id}", response_model=UserResponse, tags=["Users"])
def read_user(user_id: int, db: Session = Depends(get_db)):
  """
  특정 ID의 사용자 정보를 조회합니다.
  """
  user_service = UserService(db)
  return user_service.get_user_by_id(user_id)
