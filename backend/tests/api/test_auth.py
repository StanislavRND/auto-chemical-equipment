from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.routers.auth.router import get_auth_repo


@pytest.fixture
def client():
    mock_repo = AsyncMock()

    mock_repo.request_registration.return_value = {
        "message": "code sent",
        "email": "test@test.com",
        "expires_in": 300,
    }

    mock_repo.verify_and_create_user.return_value = {
        "id": 1,
        "email": "test@test.com",
        "role": "user",
        "user_type": "person",
        "created_at": "2024-01-01T00:00:00",
    }

    async def login_user_side_effect(email, password, response=None):
        if email == "test@test.com" and password == "12345678":
            return {
                "user": {
                    "id": 1,
                    "email": "test@test.com",
                    "role": "user",
                    "user_type": "person",
                    "created_at": "2024-01-01T00:00:00",
                    "full_name": "Test User",
                    "phone": "+123456789",
                    "inn": None,
                    "kpp": None,
                    "legal_name": None,
                    "legal_address": None,
                }
            }
        raise ValueError("invalid credentials")

    mock_repo.login_user.side_effect = login_user_side_effect

    mock_repo.refresh_tokens.return_value = {"access_token": "new_token"}

    mock_repo.logout = AsyncMock(return_value={"message": "logged out"})

    app.dependency_overrides[get_auth_repo] = lambda: mock_repo

    yield TestClient(app)

    app.dependency_overrides.clear()


def test_request_registration_success(client):
    response = client.post(
        "/api/register/request",
        json={
            "email": "test@test.com",
            "password": "12345678",
            "password_confirm": "12345678",
            "user_type": "person",
        },
    )

    assert response.status_code == 200
    assert response.json()["message"] == "code sent"


def test_request_registration_validation_error(client):
    response = client.post(
        "/api/register/request",
        json={
            "email": "bad",
            "password": "123",
            "password_confirm": "123",
            "user_type": "person",
        },
    )

    assert response.status_code == 422


def test_verify_registration_person(client):
    response = client.post(
        "/api/register/verify",
        json={
            "email": "test@test.com",
            "code": "1234",
            "user_type": "person",
            "password": "12345678",
            "password_confirm": "12345678",
            "full_name": "Test User",
            "phone": "+123456789",
        },
    )

    assert response.status_code == 201
    assert response.json()["email"] == "test@test.com"


def test_verify_registration_invalid_code(client):
    client.app.dependency_overrides[get_auth_repo] = lambda: AsyncMock(
        verify_and_create_user=AsyncMock(side_effect=ValueError("invalid code"))
    )

    response = client.post(
        "/api/register/verify",
        json={
            "email": "test@test.com",
            "code": "0000",
            "user_type": "person",
            "password": "12345678",
            "password_confirm": "12345678",
            "full_name": "Test User",
            "phone": "+123456789",
        },
    )

    assert response.status_code == 400


def test_login_success(client):
    response = client.post(
        "/api/login",
        json={"email": "test@test.com", "password": "12345678"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test@test.com"


def test_login_fail(client):
    response = client.post(
        "/api/login",
        json={"email": "wrong@test.com", "password": "12345678"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "invalid credentials"


def test_refresh_token(client):
    response = client.post("/api/refresh")

    assert response.status_code == 200
    assert response.json()["access_token"] == "new_token"


def test_logout(client):
    response = client.post("/api/logout")

    assert response.status_code == 200
