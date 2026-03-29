from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SubCategorySchema(BaseModel):
    id: int
    name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SubCategoryCreateSchema(BaseModel):
    name: str


class SubCategoryUpdateSchema(BaseModel):
    id: int
    name: str
