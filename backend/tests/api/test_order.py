from datetime import datetime, timezone
from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient
from src.db.models.user.user import UserModel
from src.main import app
from src.repositories.users.users_repository import UserRepository
from src.routers.orders.router import get_order_repo


@pytest.fixture
def client():
    mock_repo = AsyncMock()

    order_mock = {
        "id": 1,
        "number_order": "ORD-001",
        "user_id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "middle_name": "M",
        "comment": "Test comment",
        "total_products_count": 2,
        "total_price": 200.0,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    order_product_mock = {
        "product_id": 1,
        "name": "Test Product",
        "article": "ART-001",
        "image_url": "http://example.com/image.jpg",
        "quantity": 2,
        "price": 100.0,
        "total_price": 200.0,
    }

    pagination_mock = {"page": 1, "per_page": 20, "has_next": False, "total": 1}

    mock_repo.get_orders.return_value = {
        "items": [order_mock],
        "pagination": pagination_mock,
    }
    mock_repo.get_user_orders.return_value = [order_mock]
    mock_repo.create_order.return_value = order_mock
    mock_repo.update_order_status.return_value = order_mock
    mock_repo.get_order_products_by_id.return_value = [order_product_mock]
    mock_repo.delete_order.return_value = None

    mock_admin_user = UserModel(
        id=2, email="admin@test.com", role="admin", user_type="person"
    )
    mock_user = UserModel(id=1, email="user@test.com", role="user", user_type="person")

    app.dependency_overrides[get_order_repo] = lambda: mock_repo
    app.dependency_overrides[UserRepository.get_admin_user_dependency] = (
        lambda: mock_admin_user
    )
    app.dependency_overrides[UserRepository.get_current_user_dependency] = (
        lambda: mock_user
    )

    yield TestClient(app)

    app.dependency_overrides.clear()


def test_get_filtered_orders(client):
    response = client.get("/api/orders/filter?page=1&per_page=20")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["items"][0]["number_order"] == "ORD-001"
    assert data["pagination"]["page"] == 1


def test_get_user_orders(client):
    response = client.get("/api/orders")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert data[0]["number_order"] == "ORD-001"


def test_create_order(client):
    payload = {
        "first_name": "John",
        "last_name": "Doe",
        "middle_name": "M",
        "comment": "Test comment",
        "products": [
            {
                "product_id": 1,
                "name": "Test Product",
                "article": "ART-001",
                "image_url": "http://example.com/image.jpg",
                "quantity": 2,
                "price": 100.0,
                "total_price": 200.0,
            }
        ],
    }
    response = client.post("/api/orders", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["number_order"] == "ORD-001"


def test_update_order_status(client):
    payload = {"status": "completed"}
    response = client.patch("/api/orders/1/status", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "pending"


def test_get_order_products(client):
    response = client.get("/api/orders/1/products")
    assert response.status_code == 200
    data = response.json()
    assert "products" in data
    assert data["products"][0]["name"] == "Test Product"


def test_delete_order(client):
    response = client.delete("/api/orders/1")
    assert response.status_code == 204
