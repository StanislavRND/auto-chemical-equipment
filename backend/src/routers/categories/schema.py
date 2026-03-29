from datetime import datetime

from pydantic import BaseModel, ConfigDict
from src.routers.subcategories.schema import SubCategoryCreateSchema, SubCategorySchema, SubCategoryUpdateSchema


class CategoryBaseSchema(BaseModel):
    id: int
    name: str
    image_url: str | None = None
    rating: int | None = None

    model_config = ConfigDict(from_attributes=True)


class CategoryCreateSchema(BaseModel):
    name: str
    image_url: str | None = None
    subcategories: list[SubCategoryCreateSchema] = []


class CategoryUpdateSchema(BaseModel):
    name: str
    image_url: str | None = None
    subcategories: list[SubCategoryUpdateSchema] = []


class CategoryResponseSchema(CategoryBaseSchema):
    id: int
    created_at: datetime


class CategoryWithSubcategoriesSchema(CategoryResponseSchema):
    subcategories: list["SubCategorySchema"] = []


class CategoryIdsSchema(BaseModel):
    category_ids: list[int]
