from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBaseSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    password_confirm: str = Field(..., min_length=6)
    user_type: str = Field(..., pattern="^(legal|person)$")


class UserSchema(BaseModel):
    id: int
    inn: str | None = None
    kpp: str | None = None
    legal_name: str | None = None
    legal_address: str | None = None
    full_name: str | None = None
    phone: str | None = None
    email: EmailStr
    role: str
    user_type: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class UserLegalSchema(UserBaseSchema):
    inn: str = Field(..., pattern=r"^\d{10}$|^\d{12}$")
    kpp: str = Field(..., pattern=r"^\d{9}$")
    legal_name: str = Field(..., max_length=200)
    legal_address: str = Field(..., max_length=500)


class UserPersonSchema(UserBaseSchema):
    full_name: str = Field(..., max_length=200)
    phone: str = Field(..., pattern=r"^\+?\d{10,15}$")


class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=4, max_length=4)
    user_type: str = Field(..., pattern="^(legal|person)$")
    inn: str | None = None
    kpp: str | None = None
    legal_name: str | None = None
    legal_address: str | None = None
    full_name: str | None = None
    phone: str | None = None
    password: str = Field(..., min_length=6)
    password_confirm: str = Field(..., min_length=6)


class RegisterResponse(BaseModel):
    message: str
    email: str
    expires_in: int


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
