from dataclasses import dataclass
import os
from typing import final
from dotenv import load_dotenv

load_dotenv()


@final
@dataclass
class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL")
    SECRET_KEY = os.getenv("SECRET_KEY")

    def __init__(self):
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL не установлен в .env файле")
        if not self.SECRET_KEY:
            raise ValueError("SECRET_KEY не установлен в .env файле")

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


settings = Settings()
