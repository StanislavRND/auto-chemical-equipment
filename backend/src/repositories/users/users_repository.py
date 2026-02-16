from dataclasses import dataclass
from typing import final

import jwt
from fastapi import Depends, HTTPException, Request, status
from jwt import PyJWTError
from logger import logger
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.config import settings
from src.db.database import get_db
from src.db.models.users.users import UserModel
from src.repositories.exception import RepositoryError
from src.routers.schemas.user import UserResponse


@final
@dataclass
class UserRepository:
    session: AsyncSession

    async def get_user_by_id(self, email: str) -> UserModel | None:
        try:
            stmt = select(UserModel).where(UserModel.email == email)
            result = await self.session.execute(stmt)
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            logger.error(f"Error getting user with {email}: {e}")
            raise RepositoryError(f"Failed to get user: {e}") from e

    async def get_current_user(self, current_user: UserModel) -> UserResponse:
        try:
            return UserResponse.model_validate(current_user)
        except SQLAlchemyError as e:
            logger.critical(f"Failed to retrieve user {current_user.id}: {e}")
            raise RepositoryError(f"Failed to retrieve user: {e}") from e

    @classmethod
    async def get_current_user_dependency(
        cls, request: Request, db: AsyncSession = Depends(get_db)
    ) -> UserModel:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не авторизован",
            headers={"WWW-Authenticate": "Bearer"},
        )

        access_token = request.cookies.get("access_token")
        if not access_token:
            raise credentials_exception

        try:
            payload = jwt.decode(
                access_token, settings.SECRET_KEY, algorithms=["HS256"]
            )
            email: str | None = payload.get("sub")

            if email is None:
                raise credentials_exception

        except PyJWTError as e:
            logger.error(f"JWT decode error: {e}")
            raise credentials_exception from e

        repo = cls(session=db)
        user = await repo.get_user_by_id(email)

        if user is None:
            raise credentials_exception

        return user
