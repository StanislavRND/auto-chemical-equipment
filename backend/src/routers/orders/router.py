from fastapi import APIRouter, Depends, HTTPException, Query
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
    UpdateOrderStatusSchema,
    OrdersFilterResponseSchema,
)

order_router = APIRouter(tags=["Заказы"])


async def get_order_repo(db: AsyncSession = Depends(get_db)) -> OrderRepository:
    return OrderRepository(session=db)


@order_router.get(
    "/orders/filter",
    status_code=200,
    response_model=OrdersFilterResponseSchema,
    summary="Получение заказов с фильтрацией и пагинацией",
)
async def get_filtered_orders(
    number_order: str | None = Query(None, description="Номер заказа"),
    full_name: str | None = Query(None, description="ФИО пользователя"),
    status: str | None = Query(None, description="Статус заказа"),
    page: int = Query(1, ge=1, description="Номер страницы"),
    per_page: int = Query(
        20, ge=1, le=100, description="Количество заказов на странице"
    ),
    repo: OrderRepository = Depends(get_order_repo),
    _: UserModel = Depends(UserRepository.get_admin_user_dependency),
):
    try:
        result = await repo.get_orders(
            number_order=number_order,
            full_name=full_name,
            status=status,
            page=page,
            per_page=per_page,
        )

        return {
            "items": result["items"],
            "pagination": result["pagination"],
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


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


@order_router.patch(
    "/orders/{order_id}/status",
    response_model=OrderResponseSchema,
    status_code=200,
    summary="Обновление статуса заказа (только для админа)",
)
async def update_order_status(
    order_id: int,
    data: UpdateOrderStatusSchema,
    _: UserModel = Depends(UserRepository.get_admin_user_dependency),
    repo: OrderRepository = Depends(get_order_repo),
):
    try:
        order = await repo.update_order_status(
            order_id=order_id,
            new_status=data.status,
        )
        return order
    except OrderNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


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
    _: UserModel = Depends(UserRepository.get_admin_user_dependency),
    repo: OrderRepository = Depends(get_order_repo),
):
    try:
        await repo.delete_order(order_id)
    except OrderNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
