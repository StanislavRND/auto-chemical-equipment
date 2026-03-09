from dataclasses import dataclass
from typing import final

from logger import logger
from sqlalchemy import delete, exists, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.models.categories.categories import CategoryModel
from src.db.models.subcategories.subcategories import SubCategoryModel
from src.repositories.exception import RepositoryError


class CategoryNotFoundError(Exception):
    pass


class SubCategoryNotFoundError(Exception):
    pass


class SubCategoryAlreadyExistsError(Exception):
    pass


@final
@dataclass
class SubCategoriesRepository:
    session: AsyncSession

    async def create_subcategory(self, subcategory_data) -> SubCategoryModel:
        try:
            category_exists = await self.session.execute(
                select(exists().where(CategoryModel.id == subcategory_data.category_id))
            )
            if not category_exists.scalar():
                raise CategoryNotFoundError(
                    f"Category with id {subcategory_data.category_id} not found"
                )

            subcategory = SubCategoryModel(
                name=subcategory_data.name, category_id=subcategory_data.category_id
            )
            self.session.add(subcategory)
            await self.session.commit()
            await self.session.refresh(subcategory)
            return subcategory
        except IntegrityError as e:
            await self.session.rollback()
            logger.critical(f"Conflict while saving subcategory: {e}")
            raise e
        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.error(f"Failed to create subcategory: {e}")
            raise RepositoryError(f"Failed to create subcategory: {e}") from e

    async def update_subcategory(
        self, subcategory_id: int, subcategory_data
    ) -> SubCategoryModel:
        try:
            stmt = select(SubCategoryModel).where(SubCategoryModel.id == subcategory_id)
            result = await self.session.execute(stmt)
            subcategory = result.scalar_one_or_none()

            if not subcategory:
                raise SubCategoryNotFoundError(
                    f"Subcategory with id {subcategory_id} not found"
                )

            if subcategory_data.name is not None:
                subcategory.name = subcategory_data.name

            await self.session.commit()
            await self.session.refresh(subcategory)
            return subcategory
        except IntegrityError as e:
            await self.session.rollback()
            logger.critical(f"Conflict while saving subcategory: {e}")
            raise SubCategoryAlreadyExistsError(
                "subcategory with this name already exists"
            ) from e
        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.error(f"Failed to update subcategory {subcategory_id}: {e}")
            raise RepositoryError(f"Failed to update subcategory: {e}") from e

    async def delete_subcategory(self, subcategory_id: int) -> None:
        try:
            stmt = select(SubCategoryModel).where(SubCategoryModel.id == subcategory_id)
            result = await self.session.execute(stmt)
            subcategory = result.scalar_one_or_none()

            if not subcategory:
                raise SubCategoryNotFoundError(
                    f"Subcategory with id {subcategory_id} not found"
                )

            delete_stmt = delete(SubCategoryModel).where(
                SubCategoryModel.id == subcategory_id
            )
            await self.session.execute(delete_stmt)
            await self.session.commit()
        except SQLAlchemyError as e:
            logger.critical(f"Failed to delete subcategory '{subcategory_id}': {e}")
            raise RepositoryError(
                f"Failed to delete subcategory '{subcategory_id}': {e}"
            ) from e
