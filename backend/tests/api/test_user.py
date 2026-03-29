from datetime import datetime, timezone
from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient
from src.db.models.user.user import UserModel
from src.main import app
from src.repositories.users.users_repository import UserRepository
from src.routers.users.router import get_user_repo


@pytest.fixture
def client():
    mock_repo = AsyncMock()

    user_mock = {
        "id": 1,
        "email": "user@test.com",
        "role": "user",
        "inn": "1234567890",
        "kpp": "0987654321",
        "legal_name": "Test LLC",
        "legal_address": "Test Address",
        "full_name": "John Doe",
        "phone": "+70000000000",
        "user_type": "person",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    mock_repo.get_current_user.return_value = user_mock

    mock_user = UserModel(id=1, email="user@test.com", role="user", user_type="person")

    app.dependency_overrides[get_user_repo] = lambda: mock_repo
    app.dependency_overrides[UserRepository.get_current_user_dependency] = (
        lambda: mock_user
    )

    yield TestClient(app)

    app.dependency_overrides.clear()


def test_get_current_user_success(client):
    response = client.get("/api/users/me")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "user@test.com"
    assert data["full_name"] == "John Doe"


def test_get_current_user_failure(client):
    repo_mock = app.dependency_overrides[get_user_repo]()
    repo_mock.get_current_user.side_effect = Exception("DB error")

    response = client.get("/api/users/me")
    assert response.status_code == 500
    data = response.json()
    assert data["detail"] == "DB error"
