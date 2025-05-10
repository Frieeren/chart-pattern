from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from src.db.session import Base


class User(Base):
  __tablename__ = "users"

  id = Column(Integer, primary_key=True, autoincrement=True)
  username = Column(String(50), nullable=False, unique=True)
  email = Column(String(100), nullable=False, unique=True)
  created_at = Column(DateTime, default=datetime.utcnow)
