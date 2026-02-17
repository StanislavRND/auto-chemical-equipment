from pydantic import BaseModel


class PresignInSchema(BaseModel):
    filename: str


class PresignOutSchema(BaseModel):
    upload_url: str
    image_url: str
