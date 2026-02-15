from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.repositories.categories.categories_repository import (
    CategoriesRepository,
    CategoryAlreadyExistsError,
    CategoryNotFoundError,
)
from src.routers.schemas.categories import CategoryCreateSchema, CategorySchema

category_router = APIRouter(tags=["Категории"])


async def get_auth_repo(db: AsyncSession = Depends(get_db)) -> CategoriesRepository:
    return CategoriesRepository(session=db)


@category_router.get(
    "/categories",
    response_model=list[CategorySchema],
    status_code=200,
    summary="Получение категорий с их подкатегориями",
)
async def get_all_categories(repo: CategoriesRepository = Depends(get_auth_repo)):
    try:
        return await repo.get_categories_with_subcategories()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@category_router.post(
    "/categories",
    response_model=CategorySchema,
    status_code=200,
    summary="Создание категории",
)
async def create_category(
    category_data: CategoryCreateSchema,
    repo: CategoriesRepository = Depends(get_auth_repo),
):
    try:
        category = await repo.create_category(category_data)
        return category
    except IntegrityError as e:
        raise HTTPException(
            status_code=409,
            detail="Category with this name already exists",
        ) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@category_router.patch(
    "/categories/{id}",
    response_model=CategorySchema,
    status_code=200,
    summary="Обновление категории",
)
async def update_category(
    category_id: int,
    category_data: CategoryCreateSchema,
    repo: CategoriesRepository = Depends(get_auth_repo),
):
    try:
        category = await repo.update_category(category_id, category_data)
        return category
    except CategoryNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except CategoryAlreadyExistsError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@category_router.delete(
    "/categories/{id}",
    status_code=200,
    summary="Удалении категории",
)
async def delete_category(
    category_id: int,
    repo: CategoriesRepository = Depends(get_auth_repo),
):
    try:
        await repo.delete_category(category_id)
    except CategoryNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
