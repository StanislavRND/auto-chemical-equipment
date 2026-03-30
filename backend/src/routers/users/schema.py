from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    inn: str | None
    kpp: str | None
    legal_name: str | None
    legal_address: str | None
    full_name: str | None
    phone: str | None
    user_type: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str
    confirm_password: str
