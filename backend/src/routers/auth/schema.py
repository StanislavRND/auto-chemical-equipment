from datetime import datetime
from typing import Literal, Union

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


class UserLegalSchema(BaseModel):
    user_type: Literal["legal"]
    email: EmailStr
    password: str
    password_confirm: str
    inn: str
    kpp: str
    legal_name: str
    legal_address: str

class UserPersonSchema(BaseModel):
    user_type: Literal["person"]
    email: EmailStr
    password: str
    password_confirm: str
    full_name: str
    phone: str

RegisterRequestSchema = Union[UserLegalSchema, UserPersonSchema]


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
