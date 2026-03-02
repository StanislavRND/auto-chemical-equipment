from dataclasses import dataclass
from typing import final

from logger import logger
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.db.models.categories.categories import CategoryModel
from src.repositories.exception import RepositoryError


class CategoryNotFoundError(Exception):
    pass


class CategoryAlreadyExistsError(Exception):
    pass


@final
@dataclass
class CategoriesRepository:
    session: AsyncSession

    async def get_categories_with_subcategories(self) -> list[CategoryModel] | None:
        try:
            stmt = (
                select(CategoryModel)
                .options(selectinload(CategoryModel.subcategories))
                .order_by(CategoryModel.name)
            )
            result = await self.session.execute(stmt)
            categories = result.scalars().all()

            category_list = list(categories) if categories else []

            logger.info(f"Found {len(category_list)} categories")
            return category_list or None
        except SQLAlchemyError as e:
            logger.critical(f"Failed to retrieve categories: {e}")
            raise RepositoryError(f"Failed to retrieve categories: {e}") from e

    async def get_category_by_id(self, category_id: int) -> CategoryModel:
        try:
            stmt = select(CategoryModel).where(CategoryModel.id == category_id)
            result = await self.session.execute(stmt)
            category = result.scalar_one_or_none()

            if category is None:
                raise ValueError("Категория не найдена")

            return category

        except SQLAlchemyError as e:
            logger.critical(f"Failed to retrieve category by id: {e}")
            raise RepositoryError(f"Failed to retrieve category by id: {e}") from e

    async def get_popularity_categories(self) -> list[CategoryModel] | None:
        try:
            stmt = (
                select(CategoryModel)
                .where(CategoryModel.rating.isnot(None))
                .order_by(CategoryModel.rating.desc())
                .limit(6)
                .options(selectinload(CategoryModel.subcategories))
            )
            result = await self.session.execute(stmt)
            categories = result.scalars().all()

            category_list = list(categories) if categories else []

            logger.info(f"Found {len(category_list)} popular categories")
            return category_list or None
        except SQLAlchemyError as e:
            logger.critical(f"Failed to retrieve popular categories: {e}")
            raise RepositoryError(f"Failed to retrieve popular categories: {e}") from e

    async def create_category(self, category_data) -> CategoryModel:
        try:
            category = CategoryModel(
                name=category_data.name,
                image_url=category_data.image_url,
                rating=category_data.rating,
            )
            self.session.add(category)
            await self.session.commit()
            await self.session.refresh(category)
            return category
        except IntegrityError as e:
            await self.session.rollback()
            logger.critical(f"Conflict while saving category: {e}")
            raise e
        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.error(f"Failed to create category: {e}")
            raise RepositoryError(f"Failed to create category: {e}") from e

    async def update_category(self, category_id: int, category_data) -> CategoryModel:
        try:
            stmt = select(CategoryModel).where(CategoryModel.id == category_id)
            result = await self.session.execute(stmt)
            category = result.scalar_one_or_none()

            if not category:
                raise CategoryNotFoundError(f"Category with id {category_id} not found")

            if category_data.name is not None:
                category.name = category_data.name
                category.rating = category_data.rating
                category.image_url = category_data.image_url

            await self.session.commit()
            await self.session.refresh(category)
            return category
        except IntegrityError as e:
            await self.session.rollback()
            logger.critical(f"Conflict while saving category: {e}")
            raise CategoryAlreadyExistsError(
                "Category with this name already exists"
            ) from e
        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.error(f"Failed to update category {category_id}: {e}")
            raise RepositoryError(f"Failed to update category: {e}") from e

    async def delete_category(self, category_id: int) -> None:
        try:
            stmt = select(CategoryModel).where(CategoryModel.id == category_id)
            result = await self.session.execute(stmt)
            category = result.scalar_one_or_none()

            if not category:
                raise CategoryNotFoundError(f"Category with id {category_id} not found")

            delete_stmt = delete(CategoryModel).where(CategoryModel.id == category_id)
            await self.session.execute(delete_stmt)
            await self.session.commit()
        except SQLAlchemyError as e:
            logger.critical(f"Failed to delete category '{category_id}': {e}")
            raise RepositoryError(
                f"Failed to delete category '{category_id}': {e}"
            ) from e
