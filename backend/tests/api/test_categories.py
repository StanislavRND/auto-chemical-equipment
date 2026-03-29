from datetime import datetime, timezone
from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.routers.categories.router import get_auth_repo


@pytest.fixture
def client():
    mock_repo = AsyncMock()

    category_mock = {
        "id": 1,
        "name": "Test Category",
        "image_url": "http://example.com/image.jpg",
        "rating": 10,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "subcategories": [],
    }

    mock_repo.get_categories_with_subcategories.return_value = [category_mock]
    mock_repo.get_popularity_categories.return_value = [category_mock]
    mock_repo.create_category.return_value = category_mock
    mock_repo.update_category.return_value = category_mock
    mock_repo.delete_category.return_value = None

    app.dependency_overrides[get_auth_repo] = lambda: mock_repo

    yield TestClient(app)

    app.dependency_overrides.clear()


def test_get_all_categories(client):
    response = client.get("/api/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert data[0]["name"] == "Test Category"


def test_get_popularity_categories(client):
    response = client.get("/api/categories/popularity")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert data[0]["name"] == "Test Category"


def test_create_category(client):
    payload = {
        "name": "New Category",
        "image_url": "http://example.com/new_image.jpg",
        "subcategories": [],
    }
    response = client.post("/api/categories", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Category"


def test_update_category(client):
    payload = {
        "name": "Updated Category",
        "image_url": "http://example.com/updated_image.jpg",
        "subcategories": [],
    }
    response = client.patch("/api/categories/1", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Category"


def test_delete_category(client):
    response = client.delete("/api/categories/1")
    assert response.status_code == 200
