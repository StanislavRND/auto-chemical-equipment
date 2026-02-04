from dataclasses import dataclass, field
import os
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
        default_factory=lambda: int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
    )

    def __post_init__(self):
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL не установлен в .env файле")
        if not self.SECRET_KEY:
            raise ValueError("SECRET_KEY не установлен в .env файле")
        if not self.SMTP_USER:
            raise ValueError("SMTP_USER не установлен в .env файле")
        if not self.SMTP_PASSWORD:
            raise ValueError("SMTP_PASSWORD не установлен в .env файле")


settings = Settings()
