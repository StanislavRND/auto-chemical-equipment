from datetime import datetime

from pydantic import BaseModel


class SubCategorySchema(BaseModel):
    id: int
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


class SubCategoryCreateSchema(BaseModel):
    name: str


class SubCategoryUpdateSchema(BaseModel):
    name: str
