from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProductCreateSchema(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    compound: str = Field(min_length=1)
    method_of_application: str = Field(min_length=1)
    price: float = Field(gt=0)
    image_url: str = Field(min_length=1)

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
    image_url: str
    existence: bool

    category_id: int | None = None
    subcategory_id: int | None = None

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
