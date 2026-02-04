from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime


class UserSchema(BaseModel):
    id: int
    inn: str
    kpp: str
    legal_address: str
    email: EmailStr
    role: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class UserCreateSchema(BaseModel):
    inn: str = Field(..., pattern=r"^\d{10}$|^\d{12}$")
    kpp: str = Field(..., pattern=r"^\d{9}$")
    legal_address: str = Field(..., max_length=500)
    email: EmailStr
    password: str = Field(..., min_length=6)
    password_confirm: str = Field(..., min_length=6)
