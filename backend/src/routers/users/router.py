from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.security import get_password_hash, verify_password
from src.db.database import get_db
from src.db.models.user.user import UserModel
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


@user_router.post("/users/change-password", summary="Смена пароля")
async def change_password(
    old_password: str,
    new_password: str,
    confirm_password: str,
    current_user: UserModel = Depends(UserRepository.get_current_user_dependency),
    repo: UserRepository = Depends(get_user_repo),
):
    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="Пароли не совпадают")

    if not verify_password(old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Неверный старый пароль")

    current_user.hashed_password = get_password_hash(new_password)

    try:
        repo.session.add(current_user)
        await repo.session.commit()
        return {"message": "Пароль успешно изменен"}
    except Exception as e:
        await repo.session.rollback()
        raise HTTPException(status_code=500, detail=str(e)) from e
