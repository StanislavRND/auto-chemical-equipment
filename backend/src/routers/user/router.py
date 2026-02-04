from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.routers.schemas.user import UserCreateSchema, UserSchema
from src.repositories.user.user_repository import UserRepository
from src.db.database import get_db


user_router = APIRouter(prefix="", tags=["users"])


@user_router.post(
    "/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED
)
async def register_user(
    user_data: UserCreateSchema, db: AsyncSession = Depends(get_db)
):

    repo = UserRepository(session=db)

    try:
        user = await repo.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
