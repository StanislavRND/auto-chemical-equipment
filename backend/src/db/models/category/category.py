from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from src.db.base import Base

if TYPE_CHECKING:
    from src.db.models.subcategory.subcategory import SubCategoryModel


class CategoryModel(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String, nullable=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=True, default=0)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    subcategories: Mapped[list[SubCategoryModel]] = relationship(
        "SubCategoryModel",
        back_populates="category",
        cascade="all, delete-orphan",
    )
