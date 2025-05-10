from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.models import User
from src.repositories.user_repository import UserRepository
from src.schemas import UserCreate


class UserService:
  def __init__(self, db: Session):
    self.repository = UserRepository(db)

  def create_user(self, user: UserCreate) -> User:
    # 이메일 중복 체크
    if self.repository.get_by_email(user.email):
      raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다.")

    # 사용자명 중복 체크
    if self.repository.get_by_username(user.username):
      raise HTTPException(
        status_code=400, detail="이미 사용 중인 사용자명입니다."
      )

    # 새 사용자 생성
    db_user = User(username=user.username, email=user.email)
    return self.repository.create(db_user)

  def get_users(self, skip: int = 0, limit: int = 100) -> list[User]:
    return self.repository.get_all(skip, limit)

  def get_user_by_id(self, user_id: int) -> User:
    user = self.repository.get_by_id(user_id)
    if user is None:
      raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    return user
