from dataclasses import dataclass
from typing import final

from logger import logger
from sqlalchemy import Enum, delete, func, or_, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.models.order.order import OrderModel
from src.repositories.exception import RepositoryError


class OrderNotFoundError(Exception):
    pass


class OrderStatus(str, Enum):
    SUCCESS = "success"
    PENDING = "pending"
    READY_FOR_PICKUP = "ready"


@final
@dataclass
class OrderRepository:
    session: AsyncSession

    async def get_orders(
        self,
        *,
        user_id: int | None = None,
        number_order: str | None = None,
        full_name: str | None = None,
        status: str | None = None,
        page: int = 1,
        per_page: int = 20,
    ) -> dict:
        try:
            filters = []

            if user_id is not None:
                filters.append(OrderModel.user_id == user_id)

            if number_order:
                filters.append(OrderModel.number_order.ilike(f"%{number_order}%"))

            if full_name:
                parts = full_name.split()
                name_filters = [
                    f
                    for part in parts
                    for f in (
                        OrderModel.first_name.ilike(f"%{part}%"),
                        OrderModel.last_name.ilike(f"%{part}%"),
                        OrderModel.middle_name.ilike(f"%{part}%"),
                    )
                ]
                filters.append(or_(*name_filters))

            if status:
                filters.append(OrderModel.status.ilike(f"%{status}%"))

            total_stmt = select(func.count()).select_from(OrderModel)
            if filters:
                total_stmt = total_stmt.where(*filters)
            total_result = await self.session.execute(total_stmt)
            total = total_result.scalar_one()

            stmt = select(OrderModel).order_by(OrderModel.created_at.desc())
            if filters:
                stmt = stmt.where(*filters)
            stmt = stmt.offset((page - 1) * per_page).limit(per_page)

            result = await self.session.execute(stmt)
            orders = result.scalars().all()

            return {
                "items": orders,
                "pagination": {
                    "page": page,
                    "per_page": per_page,
                    "has_next": page * per_page < total,
                    "total": total,
                },
            }

        except SQLAlchemyError as e:
            logger.error(f"Failed to get filtered orders: {e}")
            raise RepositoryError(f"Failed to get filtered orders: {e}") from e

    async def update_order_status(self, order_id: int, new_status: str) -> OrderModel:
        try:
            status_enum = OrderStatus(new_status)
        except ValueError:
            raise ValueError(f"Недопустимый статус заказа: {new_status}") from None

        try:
            stmt = select(OrderModel).where(OrderModel.id == order_id)

            result = await self.session.execute(stmt)
            order = result.scalar_one_or_none()

            if not order:
                raise OrderNotFoundError(f"Заказ с id {order_id} не найден")

            order.status = str(status_enum)
            self.session.add(order)
            await self.session.commit()
            await self.session.refresh(order)
            return order

        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.error(f"Failed to update status for order {order_id}: {e}")
            raise RepositoryError(
                f"Failed to update status for order {order_id}: {e}"
            ) from e

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

    async def get_order_products_by_id(
        self,
        order_id: int,
    ) -> list[dict]:
        try:
            stmt = select(OrderModel).where(OrderModel.id == order_id)
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
                status="pending",
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

    async def delete_order(self, order_id: int) -> None:
        try:
            stmt = select(OrderModel).where(
                OrderModel.id == order_id,
            )
            result = await self.session.execute(stmt)
            order = result.scalar_one_or_none()

            if not order:
                raise OrderNotFoundError(f"Заказ с id {order_id} не найден")

            delete_stmt = delete(OrderModel).where(
                OrderModel.id == order_id,
            )
            await self.session.execute(delete_stmt)
            await self.session.commit()
        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.critical(f"Failed to delete order '{order_id}': {e}")
            raise RepositoryError(f"Failed to delete order '{order_id}': {e}") from e
