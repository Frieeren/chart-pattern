from typing import List, Optional

from sqlalchemy.orm import Session

from src.models import User


class UserRepository:
  def __init__(self, db: Session):
    self.db = db

  def create(self, user: User) -> User:
    self.db.add(user)
    self.db.commit()
    self.db.refresh(user)
    return user

  def get_by_id(self, user_id: int) -> Optional[User]:
    return self.db.query(User).filter(User.id == user_id).first()

  def get_by_email(self, email: str) -> Optional[User]:
    return self.db.query(User).filter(User.email == email).first()

  def get_by_username(self, username: str) -> Optional[User]:
    return self.db.query(User).filter(User.username == username).first()

  def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
    return self.db.query(User).offset(skip).limit(limit).all()
