from datetime import datetime, timezone
from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.routers.subcategories.router import get_auth_repo


@pytest.fixture
def client():
    mock_repo = AsyncMock()

    subcategory_mock = {
        "id": 1,
        "name": "Test Subcategory",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    mock_repo.create_subcategory.return_value = subcategory_mock
    mock_repo.update_subcategory.return_value = subcategory_mock
    mock_repo.delete_subcategory.return_value = None

    app.dependency_overrides[get_auth_repo] = lambda: mock_repo

    yield TestClient(app)

    app.dependency_overrides.clear()


def test_create_subcategory(client):
    payload = {"name": "New Subcategory"}
    response = client.post("/api/subcategories", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Subcategory"


def test_update_subcategory(client):
    payload = {"id": 1, "name": "Updated Subcategory"}
    response = client.patch("/api/subcategories/1", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Subcategory"


def test_delete_subcategory(client):
    response = client.delete("/api/subcategories/1")
    assert response.status_code == 200
