from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.db.models.users.users import UserModel
from src.repositories.users.users_repository import UserRepository

from .schema import UserResponse

user_router = APIRouter(tags=["Пользователи"])


async def get_user_repo(db: AsyncSession = Depends(get_db)) -> UserRepository:
    return UserRepository(session=db)


@user_router.get(
    "/users/me",
    response_model=UserResponse,
    status_code=200,
    summary="Получение информации о текущем пользователе",
)
async def get_current_user_info(
    current_user: UserModel = Depends(UserRepository.get_current_user_dependency),
    repo: UserRepository = Depends(get_user_repo),
):
    try:
        return await repo.get_current_user(current_user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
