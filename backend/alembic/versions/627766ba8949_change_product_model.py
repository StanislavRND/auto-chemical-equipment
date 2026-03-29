"""change product model

Revision ID: 627766ba8949
Revises: f070b029ea4c
Create Date: 2026-03-29 12:40:32.406507

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "627766ba8949"
down_revision: Union[str, Sequence[str], None] = "f070b029ea4c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Убираем default для поля existence
    op.alter_column(
        "products",
        "existence",
        server_default=None,
        existing_type=sa.Boolean(),
        existing_nullable=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Возвращаем default обратно, если откат
    op.alter_column(
        "products",
        "existence",
        server_default=sa.false(),
        existing_type=sa.Boolean(),
        existing_nullable=False,
    )
