from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient
from src.db.models.user.user import UserModel
from src.main import app
from src.repositories.users.users_repository import UserRepository
from src.routers.cart.router import get_cart_repo


@pytest.fixture
def client():
    mock_repo = AsyncMock()

    cart_item_mock = {
        "id": 1,
        "user_id": 1,
        "product_id": 1,
        "category_id": 1,
        "article": "ART-001",
        "name": "Test Product",
        "image_url": "http://example.com/image.jpg",
        "price": 100.0,
        "discount_percent": 10,
        "qty": 2,
    }

    mock_repo.get_cart_items.return_value = [cart_item_mock]
    mock_repo.add_to_cart.return_value = cart_item_mock
    mock_repo.remove_from_cart.return_value = None
    mock_repo.increment_qty.return_value = cart_item_mock
    mock_repo.decrement_qty.return_value = cart_item_mock
    mock_repo.get_total_price.return_value = 200.0

    mock_user = UserModel(id=1, email="user@test.com", role="user", user_type="person")

    app.dependency_overrides[get_cart_repo] = lambda: mock_repo
    app.dependency_overrides[UserRepository.get_current_user_dependency] = (
        lambda: mock_user
    )

    yield TestClient(app)

    app.dependency_overrides.clear()


def test_get_cart_items(client):
    response = client.get("/api/cart")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert data[0]["name"] == "Test Product"


def test_add_to_cart(client):
    payload = {"product_id": 1, "qty": 2}
    response = client.post("/api/cart", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Product"
    assert data["qty"] == 2


def test_remove_from_cart(client):
    response = client.delete("/api/cart/1")
    assert response.status_code == 204


def test_increment_cart_item_qty(client):
    response = client.patch("/api/cart/1/increment")
    assert response.status_code == 200
    data = response.json()
    assert data["qty"] == 2


def test_decrement_cart_item_qty(client):
    response = client.patch("/api/cart/1/decrement")
    assert response.status_code == 200
    data = response.json()
    assert data["qty"] == 2


def test_get_cart_total_price(client):
    response = client.get("/api/cart/total-price")
    assert response.status_code == 200
    data = response.json()
    assert data["total_price"] == 200.0
