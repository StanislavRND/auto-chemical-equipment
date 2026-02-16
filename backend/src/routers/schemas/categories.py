from datetime import datetime

from pydantic import BaseModel
from src.routers.schemas.subcategories import SubCategorySchema


class CategoryBaseSchema(BaseModel):
    name: str

    class Config:
        from_attributes = True


class CategoryCreateSchema(CategoryBaseSchema):
    pass


class CategoryResponseSchema(CategoryBaseSchema):
    id: int
    created_at: datetime


class CategoryWithSubcategoriesSchema(CategoryResponseSchema):
    subcategories: list["SubCategorySchema"] = []
