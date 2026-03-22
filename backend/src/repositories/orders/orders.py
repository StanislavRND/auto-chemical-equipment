from dataclasses import dataclass
from typing import final

from logger import logger
from sqlalchemy import delete, func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.models.order.order import OrderModel
from src.repositories.exception import RepositoryError


class OrderNotFoundError(Exception):
    pass


@final
@dataclass
class OrderRepository:
    session: AsyncSession

    async def get_user_orders(self, user_id: int) -> list[OrderModel]:
        try:
            stmt = (
                select(OrderModel)
                .where(OrderModel.user_id == user_id)
                .order_by(OrderModel.created_at.desc())
            )
            result = await self.session.execute(stmt)
            orders = result.scalars().all()
            return list(orders)
        except SQLAlchemyError as e:
            logger.error(f"Failed to get orders for user {user_id}: {e}")
            raise RepositoryError(
                f"Failed to get orders for user {user_id}: {e}"
            ) from e

    async def get_order_products_by_id(self, order_id: int, user_id: int) -> list[dict]:
        try:
            stmt = select(OrderModel).where(
                OrderModel.id == order_id,
                OrderModel.user_id == user_id,
            )
            result = await self.session.execute(stmt)
            order = result.scalar_one_or_none()

            if not order:
                raise OrderNotFoundError(f"Заказ с id {order_id} не найден")

            return order.products
        except SQLAlchemyError as e:
            logger.error(f"Failed to get products for order {order_id}: {e}")
            raise RepositoryError(
                f"Failed to get products for order {order_id}: {e}"
            ) from e

    async def create_order(
        self,
        user_id: int,
        first_name: str,
        last_name: str,
        middle_name: str | None,
        comment: str | None,
        products: list[dict],
    ) -> OrderModel:
        try:
            total_products_count = sum(product["quantity"] for product in products)
            total_price = sum(product["total_price"] for product in products)

            stmt = select(func.max(OrderModel.number_order))
            result = await self.session.execute(stmt)
            last_number = result.scalar()

            if last_number is None:
                new_number = "100"
            else:
                new_number = str(int(last_number) + 1)

            order = OrderModel(
                number_order=new_number,
                user_id=user_id,
                first_name=first_name,
                last_name=last_name,
                middle_name=middle_name,
                comment=comment,
                products=products,
                total_products_count=total_products_count,
                total_price=total_price,
                status="success",
            )

            self.session.add(order)
            await self.session.commit()
            await self.session.refresh(order)
            return order

        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.error(f"Failed to create order for user {user_id}: {e}")
            raise RepositoryError(
                f"Failed to create order for user {user_id}: {e}"
            ) from e

    async def delete_order(self, order_id: int, user_id: int) -> None:
        try:
            stmt = select(OrderModel).where(
                OrderModel.id == order_id,
                OrderModel.user_id == user_id,
            )
            result = await self.session.execute(stmt)
            order = result.scalar_one_or_none()

            if not order:
                raise OrderNotFoundError(f"Заказ с id {order_id} не найден")

            delete_stmt = delete(OrderModel).where(
                OrderModel.id == order_id,
                OrderModel.user_id == user_id,
            )
            await self.session.execute(delete_stmt)
            await self.session.commit()
        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.critical(f"Failed to delete order '{order_id}': {e}")
            raise RepositoryError(f"Failed to delete order '{order_id}': {e}") from e
