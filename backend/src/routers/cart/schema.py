from pydantic import BaseModel, ConfigDict


class CartItemResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    product_id: int
    article: str
    name: str
    image_url: str
    price: float
    discount_percent: float | None
    qty: int


class CartAddSchema(BaseModel):
    product_id: int
    qty: int = 1


class CartTotalPriceSchema(BaseModel):
    total_price: float
