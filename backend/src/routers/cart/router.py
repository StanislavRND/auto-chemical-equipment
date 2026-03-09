from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.db.models.users.users import UserModel
from src.repositories.cart.cart_repository import CartRepository
from src.repositories.users.users_repository import UserRepository
from src.routers.cart.schema import (
    CartAddSchema,
    CartItemResponseSchema,
    CartTotalPriceSchema,
)

cart_router = APIRouter(tags=["Корзина"])


async def get_cart_repo(db: AsyncSession = Depends(get_db)) -> CartRepository:
    return CartRepository(session=db)


@cart_router.get(
    "/cart",
    response_model=list[CartItemResponseSchema],
    status_code=200,
    summary="Получение корзины пользователя",
)
async def get_cart_items(
    current_user: UserModel = Depends(UserRepository.get_current_user_dependency),
    repo: CartRepository = Depends(get_cart_repo),
):
    try:
        return await repo.get_cart_items(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@cart_router.post(
    "/cart",
    response_model=CartItemResponseSchema,
    status_code=200,
    summary="Добавление товара в корзину",
)
async def add_to_cart(
    data: CartAddSchema,
    current_user: UserModel = Depends(UserRepository.get_current_user_dependency),
    repo: CartRepository = Depends(get_cart_repo),
):
    try:
        return await repo.add_to_cart(
            user_id=current_user.id,
            product_id=data.product_id,
            qty=data.qty,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@cart_router.delete(
    "/cart/{product_id}",
    status_code=204,
    summary="Удаление товара из корзины",
)
async def remove_from_cart(
    product_id: int,
    current_user: UserModel = Depends(UserRepository.get_current_user_dependency),
    repo: CartRepository = Depends(get_cart_repo),
):
    try:
        await repo.remove_from_cart(
            user_id=current_user.id,
            product_id=product_id,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e


@cart_router.patch(
    "/cart/{product_id}/increment",
    response_model=CartItemResponseSchema,
    status_code=200,
    summary="Увеличение количества товара в корзине",
)
async def increment_cart_item_qty(
    product_id: int,
    current_user: UserModel = Depends(UserRepository.get_current_user_dependency),
    repo: CartRepository = Depends(get_cart_repo),
):
    try:
        return await repo.increment_qty(
            user_id=current_user.id,
            product_id=product_id,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@cart_router.patch(
    "/cart/{product_id}/decrement",
    status_code=200,
    summary="Уменьшение количества товара в корзине",
)
async def decrement_cart_item_qty(
    product_id: int,
    current_user: UserModel = Depends(UserRepository.get_current_user_dependency),
    repo: CartRepository = Depends(get_cart_repo),
):
    try:
        item = await repo.decrement_qty(
            user_id=current_user.id,
            product_id=product_id,
        )

        if item is None:
            return {"detail": "Товар удален из корзины"}

        return item

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@cart_router.get(
    "/cart/total-price",
    response_model=CartTotalPriceSchema,
    status_code=200,
    summary="Получение общей суммы корзины",
)
async def get_cart_total_price(
    current_user: UserModel = Depends(UserRepository.get_current_user_dependency),
    repo: CartRepository = Depends(get_cart_repo),
):
    try:
        total_price = await repo.get_total_price(current_user.id)
        return CartTotalPriceSchema(total_price=total_price)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
