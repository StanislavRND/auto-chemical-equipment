from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.deps import get_s3_service
from src.db.database import get_db
from src.repositories.categories.categories_repository import (
    CategoriesRepository,
    CategoryAlreadyExistsError,
    CategoryNotFoundError,
)
from src.routers.schemas.categories import (
    CategoryBaseSchema,
    CategoryCreateSchema,
    CategoryResponseSchema,
    CategoryWithSubcategoriesSchema,
)
from src.routers.schemas.s3 import PresignInSchema, PresignOutSchema
from src.services.storage.s3 import S3Service

category_router = APIRouter(tags=["Категории"])


async def get_auth_repo(db: AsyncSession = Depends(get_db)) -> CategoriesRepository:
    return CategoriesRepository(session=db)


@category_router.get(
    "/categories",
    response_model=list[CategoryWithSubcategoriesSchema],
    status_code=200,
    summary="Получение категорий с их подкатегориями",
)
async def get_all_categories(repo: CategoriesRepository = Depends(get_auth_repo)):
    try:
        return await repo.get_categories_with_subcategories()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@category_router.get(
    "/categories/popularity",
    response_model=list[CategoryBaseSchema],
    status_code=200,
    summary="Получение популярных категорий",
)
async def get_popularity_categories(
    repo: CategoriesRepository = Depends(get_auth_repo),
):
    try:
        return await repo.get_popularity_categories()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@category_router.get(
    "/categories/{category_id}",
    response_model=CategoryBaseSchema,
    status_code=200,
    summary="Получение конкретной категории",
)
async def get_category_by_id(
    category_id: int, repo: CategoriesRepository = Depends(get_auth_repo)
):
    try:
        return await repo.get_category_by_id(category_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@category_router.post("/categories/upload", response_model=PresignOutSchema)
def presign_product_image(
    data: PresignInSchema,
    s3: S3Service = Depends(get_s3_service),
):
    key = s3.make_key_categories(prefix="categories", filename=data.filename)
    upload_url = s3.presign_put(key=key, expires=300)
    image_url = s3.public_url(key=key)
    return PresignOutSchema(upload_url=upload_url, image_url=image_url)


@category_router.post(
    "/categories",
    response_model=CategoryResponseSchema,
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
    response_model=CategoryResponseSchema,
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
