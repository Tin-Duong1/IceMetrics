"""add_middle_zone_fields

Revision ID: 7b8c9d0e1f2a
Revises: 318a630c8019
Create Date: 2025-04-23 12:00:00.000000

"""
from typing import Sequence, Union

import sqlmodel
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7b8c9d0e1f2a'
down_revision: Union[str, None] = '318a630c8019'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add the middle zone columns to the video table
    op.add_column('video', sa.Column('middle_zone_time', sa.Float(), nullable=True))
    op.add_column('video', sa.Column('middle_zone_percentage', sa.Float(), nullable=True))


def downgrade() -> None:
    # Remove the columns if downgrading
    op.drop_column('video', 'middle_zone_percentage')
    op.drop_column('video', 'middle_zone_time')