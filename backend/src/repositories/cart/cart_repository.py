from dataclasses import dataclass
from typing import final

from logger import logger
from sqlalchemy import delete, func, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.models.cart.cart import CartModel
from src.db.models.product.product import ProductModel
from src.repositories.exception import RepositoryError


@final
@dataclass
class CartRepository:
    session: AsyncSession

    async def get_cart_items(self, user_id: int) -> list[CartModel]:
        try:
            stmt = (
                select(CartModel)
                .where(CartModel.user_id == user_id)
                .order_by(CartModel.created_at.desc(), CartModel.id.desc())
            )
            result = await self.session.execute(stmt)
            return list(result.scalars().all())

        except SQLAlchemyError as e:
            logger.critical(f"Failed to retrieve cart items: {e}")
            raise RepositoryError(f"Failed to retrieve cart items: {e}") from e

    async def add_to_cart(
        self,
        *,
        user_id: int,
        product_id: int,
        qty: int = 1,
    ) -> CartModel:
        try:
            if qty <= 0:
                raise ValueError("Количество должно быть больше 0")

            product_stmt = select(ProductModel).where(ProductModel.id == product_id)
            product_result = await self.session.execute(product_stmt)
            product = product_result.scalar_one_or_none()

            if product is None:
                raise ValueError("Товар не найден")

            existing_stmt = select(CartModel).where(
                CartModel.user_id == user_id,
                CartModel.product_id == product_id,
            )
            existing_result = await self.session.execute(existing_stmt)
            cart_item = existing_result.scalar_one_or_none()

            if cart_item is not None:
                cart_item.qty += qty
            else:
                cart_item = CartModel(
                    user_id=user_id,
                    product_id=product.id,
                    article=product.article,
                    name=product.name,
                    image_url=product.image_url,
                    price=product.price,
                    discount_percent=product.discount_percent,
                    qty=qty,
                )
            self.session.add(cart_item)
            self.session.add(cart_item)

            await self.session.commit()
            await self.session.refresh(cart_item)
            return cart_item

        except IntegrityError:
            await self.session.rollback()
            raise
        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.critical(f"Failed to add product to cart: {e}")
            raise RepositoryError(f"Failed to add product to cart: {e}") from e

    async def remove_from_cart(
        self,
        *,
        user_id: int,
        product_id: int,
    ) -> None:
        try:
            stmt = (
                delete(CartModel)
                .where(
                    CartModel.user_id == user_id,
                    CartModel.product_id == product_id,
                )
                .returning(CartModel.id)
            )

            result = await self.session.execute(stmt)
            deleted_id = result.scalar_one_or_none()

            if deleted_id is None:
                raise ValueError("Товар в корзине не найден")

            await self.session.commit()

        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.critical(f"Failed to remove product from cart: {e}")
            raise RepositoryError(f"Failed to remove product from cart: {e}") from e

    async def increment_qty(
        self,
        *,
        user_id: int,
        product_id: int,
        step: int = 1,
    ) -> CartModel:
        try:
            if step <= 0:
                raise ValueError("step должен быть больше 0")

            stmt = select(CartModel).where(
                CartModel.user_id == user_id,
                CartModel.product_id == product_id,
            )
            result = await self.session.execute(stmt)
            cart_item = result.scalar_one_or_none()

            if cart_item is None:
                raise ValueError("Товар в корзине не найден")

            cart_item.qty += step

            await self.session.commit()
            await self.session.refresh(cart_item)
            return cart_item

        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.critical(f"Failed to increment cart item qty: {e}")
            raise RepositoryError(f"Failed to increment cart item qty: {e}") from e

    async def decrement_qty(
        self,
        *,
        user_id: int,
        product_id: int,
        step: int = 1,
    ) -> CartModel | None:
        try:
            if step <= 0:
                raise ValueError("step должен быть больше 0")

            stmt = select(CartModel).where(
                CartModel.user_id == user_id,
                CartModel.product_id == product_id,
            )
            result = await self.session.execute(stmt)
            cart_item = result.scalar_one_or_none()

            if cart_item is None:
                raise ValueError("Товар в корзине не найден")

            cart_item.qty -= step

            if cart_item.qty <= 0:
                await self.session.delete(cart_item)
                await self.session.commit()
                return None

            await self.session.commit()
            await self.session.refresh(cart_item)
            return cart_item

        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.critical(f"Failed to decrement cart item qty: {e}")
            raise RepositoryError(f"Failed to decrement cart item qty: {e}") from e

    async def get_total_price(self, user_id: int) -> float:
        try:
            stmt = select(
                func.coalesce(func.sum(CartModel.price * CartModel.qty), 0.0)
            ).where(CartModel.user_id == user_id)

            result = await self.session.execute(stmt)
            total = result.scalar_one()
            return float(total)

        except SQLAlchemyError as e:
            logger.critical(f"Failed to calculate total price: {e}")
            raise RepositoryError(f"Failed to calculate total price: {e}") from e
