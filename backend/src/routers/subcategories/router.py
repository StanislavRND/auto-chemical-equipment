from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.repositories.subcategories.subcategories_repository import (
    CategoryNotFoundError,
    SubCategoriesRepository,
    SubCategoryAlreadyExistsError,
    SubCategoryNotFoundError,
)

from .schema import (
    SubCategoryCreateSchema,
    SubCategoryUpdateSchema,
)

sub_category_router = APIRouter(tags=["Подкатегории"])


async def get_auth_repo(db: AsyncSession = Depends(get_db)) -> SubCategoriesRepository:
    return SubCategoriesRepository(session=db)


@sub_category_router.post(
    "/subcategories",
    response_model=SubCategoryCreateSchema,
    status_code=200,
    summary="Создание подкатегории",
)
async def create_subcategory(
    subcategory_data: SubCategoryCreateSchema,
    repo: SubCategoriesRepository = Depends(get_auth_repo),
):
    try:
        subcategory = await repo.create_subcategory(subcategory_data)
        return subcategory
    except CategoryNotFoundError as e:  #
        raise HTTPException(status_code=404, detail=str(e)) from e
    except IntegrityError as e:
        raise HTTPException(
            status_code=409,
            detail="Subcategory with this name already exists",
        ) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@sub_category_router.patch(
    "/subcategories/{subcategory_id}",
    response_model=SubCategoryUpdateSchema,
    status_code=200,
    summary="Обновление подкатегории",
)
async def update_subcategory(
    subcategory_id: int,
    subcategory_data: SubCategoryUpdateSchema,
    repo: SubCategoriesRepository = Depends(get_auth_repo),
):
    try:
        subcategory = await repo.update_subcategory(subcategory_id, subcategory_data)
        return subcategory
    except SubCategoryNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except SubCategoryAlreadyExistsError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@sub_category_router.delete(
    "/subcategories/{subcategory_id}",
    status_code=200,
    summary="Удалении подкатегории",
)
async def delete_subcategory(
    subcategory_id: int,
    repo: SubCategoriesRepository = Depends(get_auth_repo),
):
    try:
        await repo.delete_subcategory(subcategory_id)
    except SubCategoryNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
