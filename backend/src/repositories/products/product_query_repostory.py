from dataclasses import dataclass
from typing import final

from logger import logger
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.db.models.products.products import ProductModel
from src.repositories.exception import RepositoryError


@final
@dataclass
class ProductQueryRepository:
    session: AsyncSession

    async def get_catalog_products(
        self,
        *,
        category_id: int | None = None,
        subcategory_id: int | None = None,
        sort: str = "name",
    ) -> list[ProductModel]:
        try:
            stmt = select(ProductModel).options(
                selectinload(ProductModel.category),
                selectinload(ProductModel.subcategory),
            )

            if subcategory_id is not None:
                stmt = stmt.where(ProductModel.subcategory_id == subcategory_id)

            elif category_id is not None:
                stmt = stmt.where(ProductModel.category_id == category_id)

            match sort:
                case "name":
                    stmt = stmt.order_by(
                        ProductModel.name.asc(),
                        ProductModel.id.desc(),
                    )
                case "price_desc":
                    stmt = stmt.order_by(
                        ProductModel.price.desc(),
                        ProductModel.id.desc(),
                    )
                case "price_asc":
                    stmt = stmt.order_by(
                        ProductModel.price.asc(),
                        ProductModel.id.desc(),
                    )
                case _:
                    stmt = stmt.order_by(
                        ProductModel.name.asc(),
                        ProductModel.id.desc(),
                    )

            result = await self.session.execute(stmt)
            return list(result.scalars().all())

        except SQLAlchemyError as e:
            logger.critical(f"Failed to retrieve catalog products: {e}")
            raise RepositoryError(f"Failed to retrieve catalog products: {e}") from e
