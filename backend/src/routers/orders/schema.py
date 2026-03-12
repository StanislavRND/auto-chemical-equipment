from datetime import datetime

from pydantic import BaseModel, ConfigDict


class OrderResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    number_order: str
    user_id: int | None
    first_name: str
    last_name: str
    middle_name: str | None
    comment: str | None
    total_products_count: int
    total_price: float
    status: str
    created_at: datetime


class OrderProductSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: int
    name: str
    article: str
    image_url: str
    quantity: int
    price: float
    total_price: float


class OrderProductsResponseSchema(BaseModel):
    products: list[OrderProductSchema]


class CreateOrderSchema(BaseModel):
    first_name: str
    last_name: str
    middle_name: str | None = None
    comment: str | None = None
    products: list[OrderProductSchema]
