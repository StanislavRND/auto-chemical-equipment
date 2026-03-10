from dataclasses import dataclass
from typing import final

from logger import logger
from sqlalchemy import func, or_, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.db.models.products.products import ProductModel
from src.repositories.exception import RepositoryError


@final
@dataclass
class ProductQueryRepository:
    session: AsyncSession

    def _base_products_stmt(self):
        return select(ProductModel).options(
            selectinload(ProductModel.category),
            selectinload(ProductModel.subcategory),
        )

    def _apply_sort(self, stmt, sort: str):
        match sort:
            case "name":
                return stmt.order_by(
                    ProductModel.name.asc(),
                    ProductModel.id.desc(),
                )
            case "price_desc":
                return stmt.order_by(
                    ProductModel.price.desc(),
                    ProductModel.id.desc(),
                )
            case "price_asc":
                return stmt.order_by(
                    ProductModel.price.asc(),
                    ProductModel.id.desc(),
                )
            case _:
                return stmt.order_by(
                    ProductModel.name.asc(),
                    ProductModel.id.desc(),
                )

    async def get_catalog_products(
        self,
        *,
        category_id: int | None = None,
        subcategory_id: int | None = None,
        sort: str = "name",
    ) -> list[ProductModel]:
        try:
            stmt = self._base_products_stmt()

            if subcategory_id is not None:
                stmt = stmt.where(ProductModel.subcategory_id == subcategory_id)
            elif category_id is not None:
                stmt = stmt.where(ProductModel.category_id == category_id)

            stmt = self._apply_sort(stmt, sort)

            result = await self.session.execute(stmt)
            return list(result.scalars().all())

        except SQLAlchemyError as e:
            logger.critical(f"Failed to retrieve catalog products: {e}")
            raise RepositoryError(f"Failed to retrieve catalog products: {e}") from e

    async def search_products(
        self,
        *,
        query: str,
        page: int = 1,
        per_page: int = 20,
    ) -> dict:
        try:
            search_value = query.strip()
            if not search_value:
                return {
                    "items": [],
                    "pagination": {
                        "page": page,
                        "per_page": per_page,
                        "has_next": False,
                        "total": 0,
                    },
                }

            pattern = f"%{search_value}%"

            filters = or_(
                ProductModel.article.ilike(pattern),
                ProductModel.name.ilike(pattern),
            )

            total_stmt = select(func.count()).select_from(ProductModel).where(filters)
            total_result = await self.session.execute(total_stmt)
            total = total_result.scalar_one()

            stmt = (
                self._base_products_stmt()
                .where(filters)
                .offset((page - 1) * per_page)
                .limit(per_page)
            )

            result = await self.session.execute(stmt)
            items = list(result.scalars().all())

            return {
                "items": items,
                "pagination": {
                    "page": page,
                    "per_page": per_page,
                    "has_next": page * per_page < total,
                    "total": total,
                },
            }

        except SQLAlchemyError as e:
            logger.critical(f"Failed to search products: {e}")
            raise RepositoryError(f"Failed to search products: {e}") from e
