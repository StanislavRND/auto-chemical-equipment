from dataclasses import dataclass
from typing import final

from logger import logger
from sqlalchemy import delete, desc, select, update
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.db.models.product.product import ProductModel
from src.repositories.exception import RepositoryError


@final
@dataclass
class ProductRepository:
    session: AsyncSession

    async def get_products(
        self,
        sort: str = "name",
        limit: int = 30,
    ) -> list[ProductModel]:
        try:
            stmt = select(ProductModel)

            match sort:
                case "name":
                    stmt = stmt.order_by(
                        ProductModel.existence.desc(),  # 👈 сначала в наличии
                        ProductModel.name.asc(),
                        ProductModel.id.desc()
                    )
                case "price_desc":
                    stmt = stmt.order_by(
                        ProductModel.existence.desc(),
                        ProductModel.price.desc(),
                        ProductModel.id.desc()
                    )
                case "price_asc":
                    stmt = stmt.order_by(
                        ProductModel.existence.desc(),
                        ProductModel.price.asc(),
                        ProductModel.id.desc()
                    )
                case _:
                    stmt = stmt.order_by(
                        ProductModel.existence.desc(),
                        ProductModel.name.asc(),
                        ProductModel.id.desc()
                    )

            stmt = stmt.limit(limit)

            result = await self.session.execute(stmt)
            return list(result.scalars().all())

        except SQLAlchemyError as e:
            logger.critical(f"Failed to retrieve products: {e}")
            raise RepositoryError(f"Failed to retrieve products: {e}") from e

    async def get_product_by_id(self, product_id: int) -> ProductModel:
        try:
            stmt = (
                select(ProductModel)
                .where(ProductModel.id == product_id)
                .options(
                    selectinload(ProductModel.category),
                    selectinload(ProductModel.subcategory),
                )
            )
            result = await self.session.execute(stmt)
            product = result.scalar_one_or_none()

            if product is None:
                raise ValueError("Товар не найден")

            return product

        except SQLAlchemyError as e:
            logger.critical(f"Failed to retrieve product by id: {e}")
            raise RepositoryError(f"Failed to retrieve product by id: {e}") from e

    async def create_product(
        self,
        *,
        name: str,
        description: str | None,
        compound: str,
        method_of_application: str,
        price: float,
        discount_percent: int,
        existence: bool,
        image_url: str,
        category_id: int | None,
        subcategory_id: int | None,
    ) -> ProductModel:
        try:
            stmt = select(ProductModel.article).order_by(desc(ProductModel.id)).limit(1)

            result = await self.session.execute(stmt)
            last_article = result.scalar_one_or_none()

            if last_article:
                next_number = int(last_article) + 1
            else:
                next_number = 1

            article = str(next_number).zfill(6)

            product = ProductModel(
                name=name,
                description=description,
                compound=compound,
                method_of_application=method_of_application,
                price=price,
                discount_percent=discount_percent,
                image_url=image_url,
                article=article,
                category_id=category_id,
                subcategory_id=subcategory_id,
                existence=existence,
            )

            self.session.add(product)
            await self.session.commit()
            await self.session.refresh(product)

            return product
        except IntegrityError:
            raise
        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.critical(f"Failed to create product: {e}")
            raise RepositoryError(f"Failed to create product: {e}") from e

    async def delete_product(self, product_id: int) -> None:
        try:
            stmt = (
                delete(ProductModel)
                .where(ProductModel.id == product_id)
                .returning(ProductModel.id)
            )

            result = await self.session.execute(stmt)
            deleted_id = result.scalar_one_or_none()

            if deleted_id is None:
                raise ValueError("Товар не найден")

            await self.session.commit()

        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.critical(f"Failed to delete product: {e}")
            raise RepositoryError(f"Failed to delete product: {e}") from e

    async def update_product(
        self,
        product_id: int,
        **values,
    ) -> ProductModel:
        try:
            stmt = (
                update(ProductModel)
                .where(ProductModel.id == product_id)
                .values(**values)
                .returning(ProductModel)
            )

            product = (await self.session.execute(stmt)).scalar_one_or_none()
            if product is None:
                raise ValueError("Товар не найден")

            await self.session.commit()
            return product

        except IntegrityError:
            raise
        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.critical(f"Failed to update product: {e}")
            raise RepositoryError(f"Failed to update product: {e}") from e
