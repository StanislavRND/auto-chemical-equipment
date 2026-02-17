from fastapi import APIRouter, Depends
from src.core.config import settings
from src.core.deps import get_s3_service
from src.routers.schemas.s3 import PresignInSchema, PresignOutSchema
from src.services.storage.s3 import S3Service

s3_router = APIRouter(tags=["Товары"])


@s3_router.post("/products/upload", response_model=PresignOutSchema)
def presign_product_image(
    data: PresignInSchema,
    s3: S3Service = Depends(get_s3_service),
):
    key = s3.make_key(prefix=settings.S3_PREFIX, filename=data.filename)
    upload_url = s3.presign_put(key=key, expires=300)
    image_url = s3.public_url(key=key)
    return PresignOutSchema(upload_url=upload_url, image_url=image_url)
