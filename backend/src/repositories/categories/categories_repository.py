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
                .order_by(CategoryModel.id)
            )
            result = await self.session.execute(stmt)
            categories = result.scalars().all()

            category_list = list(categories) if categories else []

            logger.info(f"Found {len(category_list)} categories")
            return category_list or None
        except SQLAlchemyError as e:
            logger.critical(f"Failed to retrieve categories: {e}")
            raise RepositoryError(f"Failed to retrieve categories: {e}") from e

    async def create_category(self, category_data) -> CategoryModel:
        try:
            category = CategoryModel(name=category_data.name)
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
