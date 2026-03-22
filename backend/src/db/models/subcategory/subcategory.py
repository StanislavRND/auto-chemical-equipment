from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from src.db.base import Base

if TYPE_CHECKING:
    from src.db.models.category.category import CategoryModel


class SubCategoryModel(Base):
    __tablename__ = "subcategories"

    __table_args__ = (
        UniqueConstraint("name", "category_id", name="uq_subcategory_name_category"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    category_id: Mapped[int | None] = mapped_column(
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True,
    )
    category: Mapped[CategoryModel | None] = relationship(
        "CategoryModel", back_populates="subcategories"
    )
