from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from src.db.base import Base

if TYPE_CHECKING:
    from src.db.models.categories.categories import CategoryModel
    from src.db.models.subcategories.subcategories import SubCategoryModel


class ProductModel(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    category_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("categories.id"), nullable=True
    )
    subcategory_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("subcategories.id"), nullable=True
    )
    article: Mapped[str] = mapped_column(
        String(6), unique=True, index=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    image_url: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    compound: Mapped[str] = mapped_column(Text, nullable=False)
    method_of_application: Mapped[str] = mapped_column(Text, nullable=False)
    existence: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    category: Mapped[CategoryModel] = relationship(
        "CategoryModel", foreign_keys=[category_id]
    )
    subcategory: Mapped[SubCategoryModel] = relationship(
        "SubCategoryModel",
        foreign_keys=[subcategory_id],
    )
