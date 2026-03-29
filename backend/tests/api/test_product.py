from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient
from src.db.models.user.user import UserModel
from src.main import app
from src.repositories.users.users_repository import UserRepository
from src.routers.products.router import get_auth_repo, get_product_query_repo


@pytest.fixture
def client():
    mock_repo = AsyncMock()
    mock_query_repo = AsyncMock()

    product_mock = {
        "id": 1,
        "article": "ART-001",
        "name": "Test Product",
        "description": "Description",
        "compound": "Compound",
        "method_of_application": "Method",
        "price": 100.0,
        "discount_percent": 10,
        "image_url": "http://example.com/image.jpg",
        "existence": True,
        "category_id": 1,
        "subcategory_id": 1,
        "created_at": "2024-01-01T00:00:00",
    }

    mock_repo.create_product.return_value = product_mock
    mock_repo.delete_product.return_value = None
    mock_repo.update_product.return_value = product_mock
    mock_repo.get_product_by_id.return_value = product_mock

    mock_query_repo.get_catalog_products.return_value = [product_mock]
    mock_query_repo.search_products.return_value = {
        "items": [product_mock],
        "pagination": {"page": 1, "per_page": 20, "has_next": False, "total": 1},
    }

    mock_admin_user = UserModel(
        id=1, email="admin@test.com", role="admin", user_type="person"
    )

    app.dependency_overrides[get_auth_repo] = lambda: mock_repo
    app.dependency_overrides[get_product_query_repo] = lambda: mock_query_repo
    app.dependency_overrides[UserRepository.get_admin_user_dependency] = (
        lambda: mock_admin_user
    )

    yield TestClient(app)

    app.dependency_overrides.clear()


def test_get_catalog_products(client):
    response = client.get("/api/products/catalog?category_id=1&subcategory_id=1")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert data[0]["name"] == "Test Product"


def test_search_products(client):
    response = client.get("/api/products/search?query=Test&page=1&per_page=20")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["items"][0]["name"] == "Test Product"
    assert data["pagination"]["page"] == 1


def test_create_product(client):
    payload = {
        "name": "Test Product",
        "description": "Description",
        "compound": "Compound",
        "method_of_application": "Method",
        "price": 100.0,
        "discount_percent": 10,
        "image_url": "http://example.com/image.jpg",
        "existence": True,
        "category_id": 1,
        "subcategory_id": 1,
    }
    response = client.post("/api/products", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Product"


def test_delete_product(client):
    response = client.delete("/api/products/1")
    assert response.status_code == 204


def test_update_product(client):
    payload = {
        "name": "Updated Product",
        "description": "Updated Description",
        "compound": "Updated Compound",
        "method_of_application": "Updated Method",
        "price": 150.0,
        "discount_percent": 5,
        "image_url": "http://example.com/updated_image.jpg",
        "existence": True,
        "category_id": 1,
        "subcategory_id": 1,
    }
    response = client.put("/api/products/1", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Product"
