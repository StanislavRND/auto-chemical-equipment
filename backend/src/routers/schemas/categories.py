from datetime import datetime

from pydantic import BaseModel

from src.routers.schemas.subcategories import SubCategorySchema


class CategorySchema(BaseModel):
    id: int
    name: str
    created_at: datetime
    subcategories: list[SubCategorySchema] = []

    class Config:
        from_attributes = True


class CategoryCreateSchema(BaseModel):
    name: str
