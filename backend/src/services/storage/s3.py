import uuid
from dataclasses import dataclass

import boto3
from botocore.config import Config


@dataclass(frozen=True)
class S3Settings:
    endpoint_url: str
    bucket: str
    access_key: str
    secret_key: str
    region: str = "ru1"
    addressing_style: str = "path"
    public_base_url: str | None = None


class S3Service:
    def __init__(self, settings: S3Settings):
        self.settings = settings

        cfg = Config(
            region_name=settings.region,
            signature_version="s3v4",
            s3={"addressing_style": settings.addressing_style},
        )

        self.client = boto3.client(
            "s3",
            endpoint_url=settings.endpoint_url,
            aws_access_key_id=settings.access_key,
            aws_secret_access_key=settings.secret_key,
            config=cfg,
        )

    def make_key(self, *, prefix: str = "products", filename: str) -> str:
        ext = filename.split(".")[-1].lower() if "." in filename else "bin"
        return f"{prefix}/{uuid.uuid4().hex}.{ext}"

    def presign_put(self, *, key: str, expires: int = 300) -> str:
        return self.client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": self.settings.bucket,
                "Key": key,
            },
            ExpiresIn=expires,
        )

    def delete(self, *, key: str) -> None:
        self.client.delete_object(Bucket=self.settings.bucket, Key=key)

    def public_url(self, *, key: str) -> str:
        base = self.settings.endpoint_url.rstrip("/")

        if self.settings.addressing_style == "virtual":
            host = base.replace("https://", "").replace("http://", "")
            return f"https://{self.settings.bucket}.{host}/{key}"

        return f"{base}/{self.settings.bucket}/{key}"
