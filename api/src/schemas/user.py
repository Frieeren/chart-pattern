from datetime import datetime

from pydantic import BaseModel, EmailStr


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
