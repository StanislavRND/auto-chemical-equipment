from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Response
from passlib.context import CryptContext
from src.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"])


def hash_code(code: str) -> str:
    return bcrypt.hashpw(code.encode(), bcrypt.gensalt()).decode()


def verify_code(plain_code: str, hashed_code: str) -> bool:
    return bcrypt.checkpw(plain_code.encode(), hashed_code.encode())


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password.encode()[:72])


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password.encode()[:72], hashed_password)


def create_access_token(data: dict) -> str:
    now = datetime.now(timezone.utc)

    payload = {**data, "iat": now, "type": "access"}
    return jwt.encode(payload, settings.SECRET_KEY)


def create_refresh_token(data: dict) -> str:
    now = datetime.now(timezone.utc)

    payload = {**data, "exp": now + timedelta(days=7), "iat": now, "type": "refresh"}
    return jwt.encode(payload, settings.SECRET_KEY)


def verify_token(token: str) -> dict:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])


def set_auth_cookie(
    response: Response, access_token: str, refresh_token: str, max_age: int = 3600
) -> None:
    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=max_age,
        httponly=True,
        secure=False,
        samesite="lax",
    )

    if refresh_token:
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            max_age=7 * 24 * 3600,
            httponly=True,
            secure=False,
            samesite="lax",
        )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
