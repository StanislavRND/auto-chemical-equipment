from dataclasses import dataclass
from typing import final

from logger import logger
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.db.models.category.category import CategoryModel
from src.db.models.subcategory.subcategory import SubCategoryModel
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
            )

            self.session.add(category)
            await self.session.flush()

            for sub in category_data.subcategories:
                subcategory = SubCategoryModel(name=sub.name, category_id=category.id)
                self.session.add(subcategory)

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
            stmt = (
                select(CategoryModel)
                .options(selectinload(CategoryModel.subcategories))
                .where(CategoryModel.id == category_id)
            )
            result = await self.session.execute(stmt)
            category = result.scalar_one_or_none()

            if not category:
                raise CategoryNotFoundError(f"Category with id {category_id} not found")

            if category_data.name is not None:
                category.name = category_data.name
                category.image_url = category_data.image_url

            if category_data.subcategories is not None:
                existing_subs = {sub.id: sub for sub in category.subcategories}
                new_subs = category_data.subcategories

                new_ids = set()
                for sub in new_subs:
                    if hasattr(sub, "id") and sub.id in existing_subs:

                        existing_subs[sub.id].name = sub.name
                        new_ids.add(sub.id)
                    else:
                        new_sub = SubCategoryModel(
                            name=sub.name, category_id=category.id
                        )
                        self.session.add(new_sub)

                for sub_id in existing_subs:
                    if sub_id not in new_ids:
                        await self.session.execute(
                            delete(SubCategoryModel).where(
                                SubCategoryModel.id == sub_id
                            )
                        )

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

    async def increment_categories_rating(self, category_ids: list[int]) -> None:
        try:
            for category_id in category_ids:
                stmt = select(CategoryModel).where(CategoryModel.id == category_id)
                result = await self.session.execute(stmt)
                category = result.scalar_one_or_none()

                if category:
                    if category.rating is None:
                        category.rating = 1
                    else:
                        category.rating += 1

            await self.session.commit()
            logger.info(f"Incremented rating for {len(category_ids)} categories")
        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.critical(f"Failed to increment categories rating: {e}")
            raise RepositoryError(f"Failed to increment categories rating: {e}") from e

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
