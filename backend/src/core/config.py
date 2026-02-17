import os
from dataclasses import dataclass, field
from typing import final

from dotenv import load_dotenv

load_dotenv()


@final
@dataclass
class Settings:
    DATABASE_URL: str = field(default_factory=lambda: os.getenv("DATABASE_URL", ""))
    SECRET_KEY: str = field(default_factory=lambda: os.getenv("SECRET_KEY", ""))
    SMTP_HOST: str = field(
        default_factory=lambda: os.getenv("SMTP_HOST", "smtp.gmail.com")
    )
    SMTP_PORT: int = field(default_factory=lambda: int(os.getenv("SMTP_PORT", "587")))
    SMTP_USER: str = field(default_factory=lambda: os.getenv("SMTP_USER", ""))
    SMTP_PASSWORD: str = field(default_factory=lambda: os.getenv("SMTP_PASSWORD", ""))
    SMTP_FROM: str = field(
        default_factory=lambda: os.getenv("SMTP_FROM", "noreply@optavtohim.ru")
    )

    VERIFICATION_CODE_EXPIRE_MINUTES: int = field(
        default_factory=lambda: int(os.getenv("VERIFICATION_CODE_EXPIRE_MINUTES", "15"))
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = field(
        default_factory=lambda: int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    )
    S3_ENDPOINT_URL: str = field(
        default_factory=lambda: os.getenv("S3_ENDPOINT_URL", "")
    )
    S3_BUCKET: str = field(default_factory=lambda: os.getenv("S3_BUCKET", ""))
    S3_ACCESS_KEY: str = field(default_factory=lambda: os.getenv("S3_ACCESS_KEY", ""))
    S3_SECRET_KEY: str = field(default_factory=lambda: os.getenv("S3_SECRET_KEY", ""))
    S3_REGION: str = field(default_factory=lambda: os.getenv("S3_REGION", "ru1"))
    S3_ADDRESSING_STYLE: str = field(
        default_factory=lambda: os.getenv("S3_ADDRESSING_STYLE", "path")
    )
    S3_PREFIX: str = field(default_factory=lambda: os.getenv("S3_PREFIX", "products"))

    def __post_init__(self):
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL не установлен в .env файле")
        if not self.SECRET_KEY:
            raise ValueError("SECRET_KEY не установлен в .env файле")
        if not self.SMTP_USER:
            raise ValueError("SMTP_USER не установлен в .env файле")
        if not self.SMTP_PASSWORD:
            raise ValueError("SMTP_PASSWORD не установлен в .env файле")
        if not self.S3_ENDPOINT_URL:
            raise ValueError("S3_ENDPOINT_URL не установлен в .env файле")
        if not self.S3_BUCKET:
            raise ValueError("S3_BUCKET не установлен в .env файле")
        if not self.S3_ACCESS_KEY:
            raise ValueError("S3_ACCESS_KEY не установлен в .env файле")
        if not self.S3_SECRET_KEY:
            raise ValueError("S3_SECRET_KEY не установлен в .env файле")


settings = Settings()
