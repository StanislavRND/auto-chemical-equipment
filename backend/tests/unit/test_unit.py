from unittest.mock import AsyncMock

import jwt
from src.core.config import settings
from src.core.security import (
    create_refresh_token,
    get_password_hash,
    hash_code,
    verify_code,
    verify_password,
    verify_token,
)
from src.services.email_verification.verification import VerificationService


def test_hash_and_verify_code():
    code = "1234"
    hashed = hash_code(code)

    assert hashed != code
    assert verify_code(code, hashed) is True
    assert verify_code("0000", hashed) is False


def test_password_hash_and_verify():
    password = "secure_password"
    hashed = get_password_hash(password)

    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False


def test_create_refresh_token():
    data = {"user_id": 1}
    token = create_refresh_token(data)

    assert isinstance(token, str)

    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    assert payload["user_id"] == 1
    assert payload["type"] == "refresh"
    assert "exp" in payload
    assert "iat" in payload


def test_generate_code():
    mock_session = AsyncMock()

    gen = VerificationService(session=mock_session)

    code = gen.generate_code(4)
    assert isinstance(code, str)
    assert len(code) == 4
    assert code.isdigit()

    code6 = gen.generate_code(6)
    assert len(code6) == 6
    assert code6.isdigit()


def test_verify_token_success():
    data = {"user_id": 1}
    token = create_refresh_token(data)

    payload = verify_token(token)
    assert payload["user_id"] == 1
    assert payload["type"] == "refresh"
    assert "exp" in payload
    assert "iat" in payload
