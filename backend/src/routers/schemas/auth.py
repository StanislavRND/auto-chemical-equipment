from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


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


class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=4, max_length=4)
    inn: str = Field(..., pattern=r"^\d{10}$|^\d{12}$")
    kpp: str = Field(..., pattern=r"^\d{9}$")
    legal_address: str = Field(..., max_length=500)
    password: str = Field(..., min_length=6)
    password_confirm: str = Field(..., min_length=6)


class RegisterResponse(BaseModel):
    message: str
    email: str
    expires_in: int


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
