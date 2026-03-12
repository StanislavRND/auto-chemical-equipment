from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.db.models.user.user import UserModel
from src.repositories.orders.orders import (
    OrderNotFoundError,
    OrderRepository,
)
from src.repositories.users.users_repository import UserRepository
from src.routers.orders.schema import (
    CreateOrderSchema,
    OrderProductSchema,
    OrderProductsResponseSchema,
    OrderResponseSchema,
)

order_router = APIRouter(tags=["Заказы"])


async def get_order_repo(db: AsyncSession = Depends(get_db)) -> OrderRepository:
    return OrderRepository(session=db)


@order_router.get(
    "/orders",
    response_model=list[OrderResponseSchema],
    status_code=200,
    summary="Получение заказов пользователя",
)
async def get_user_orders(
    current_user: UserModel = Depends(UserRepository.get_current_user_dependency),
    repo: OrderRepository = Depends(get_order_repo),
):
    try:
        return await repo.get_user_orders(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@order_router.get(
    "/orders/{order_id}/products",
    response_model=OrderProductsResponseSchema,
    status_code=200,
    summary="Получение продуктов заказа по id",
)
async def get_order_products(
    order_id: int,
    current_user: UserModel = Depends(UserRepository.get_current_user_dependency),
    repo: OrderRepository = Depends(get_order_repo),
):
    try:
        products = await repo.get_order_products_by_id(order_id, current_user.id)
        return OrderProductsResponseSchema(
            products=[
                OrderProductSchema.model_validate(product) for product in products
            ]
        )
    except OrderNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@order_router.post(
    "/orders",
    response_model=OrderResponseSchema,
    status_code=201,
    summary="Создание заказа",
)
async def create_order(
    data: CreateOrderSchema,
    current_user: UserModel = Depends(UserRepository.get_current_user_dependency),
    repo: OrderRepository = Depends(get_order_repo),
):
    try:
        return await repo.create_order(
            user_id=current_user.id,
            first_name=data.first_name,
            last_name=data.last_name,
            middle_name=data.middle_name,
            comment=data.comment,
            products=[product.model_dump() for product in data.products],
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@order_router.delete(
    "/orders/{order_id}",
    status_code=204,
    summary="Удаление заказа",
)
async def delete_order(
    order_id: int,
    current_user: UserModel = Depends(UserRepository.get_current_user_dependency),
    repo: OrderRepository = Depends(get_order_repo),
):
    try:
        await repo.delete_order(order_id, current_user.id)
    except OrderNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
