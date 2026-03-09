from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    inn: str | None
    kpp: str | None
    legal_name: str | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
