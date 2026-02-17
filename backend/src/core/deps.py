from src.core.config import settings
from src.services.storage.s3 import S3Service, S3Settings


def get_s3_service() -> S3Service:
    s3_settings = S3Settings(
        endpoint_url=settings.S3_ENDPOINT_URL,
        bucket=settings.S3_BUCKET,
        access_key=settings.S3_ACCESS_KEY,
        secret_key=settings.S3_SECRET_KEY,
        region=settings.S3_REGION,
        addressing_style=settings.S3_ADDRESSING_STYLE,
    )
    return S3Service(s3_settings)
