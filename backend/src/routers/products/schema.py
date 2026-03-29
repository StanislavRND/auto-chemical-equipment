from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field
from src.routers.categories.schema import CategoryBaseSchema
from src.routers.subcategories.schema import SubCategorySchema


class ProductCreateSchema(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    compound: str = Field(min_length=1)
    method_of_application: str = Field(min_length=1)
    price: float = Field(gt=0)
    discount_percent: int | None = None
    image_url: str = Field(min_length=1)
    existence: bool = False
    category_id: int | None = None
    subcategory_id: int | None = None


class ProductResponseSchema(BaseModel):
    id: int
    article: str
    name: str
    description: str | None = None
    compound: str
    method_of_application: str
    price: float
    discount_percent: int | None = None
    image_url: str
    existence: bool

    category_id: int | None = None
    subcategory_id: int | None = None

    category: CategoryBaseSchema | None = None
    subcategory: SubCategorySchema | None = None

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductResponseIdsSchema(BaseModel):
    id: int
    article: str
    name: str
    description: str | None = None
    compound: str
    method_of_application: str
    price: float
    discount_percent: int | None = None
    image_url: str
    existence: bool

    category_id: int | None = None
    subcategory_id: int | None = None

    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PaginationSchema(BaseModel):
    page: int
    per_page: int
    has_next: bool
    total: int


class ProductSearchResponseSchema(BaseModel):
    items: list[ProductResponseIdsSchema]
    pagination: PaginationSchema


class PresignInSchema(BaseModel):
    filename: str


class PresignOutSchema(BaseModel):
    upload_url: str
    image_url: str
