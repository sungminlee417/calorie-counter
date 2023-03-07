"""empty message

Revision ID: 1ab759973bb7
Revises: 
Create Date: 2023-03-07 13:04:05.158828

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1ab759973bb7'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('foods',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('brand_name', sa.String(length=255), nullable=True),
    sa.Column('description', sa.String(length=255), nullable=False),
    sa.Column('serving_size', sa.String(length=255), nullable=False),
    sa.Column('calories', sa.Integer(), nullable=False),
    sa.Column('total_fat', sa.Integer(), nullable=True),
    sa.Column('saturated_fat', sa.Integer(), nullable=True),
    sa.Column('polysaturated_fat', sa.Integer(), nullable=True),
    sa.Column('monounsaturated_fat', sa.Integer(), nullable=True),
    sa.Column('trans_fat', sa.Integer(), nullable=True),
    sa.Column('cholesterol', sa.Integer(), nullable=True),
    sa.Column('sodium', sa.Integer(), nullable=True),
    sa.Column('potassium', sa.Integer(), nullable=True),
    sa.Column('total_carbohydrates', sa.Integer(), nullable=True),
    sa.Column('dietary_fiber', sa.Integer(), nullable=True),
    sa.Column('sugars', sa.Integer(), nullable=True),
    sa.Column('added_sugars', sa.Integer(), nullable=True),
    sa.Column('sugar_alcohols', sa.Integer(), nullable=True),
    sa.Column('protein', sa.Integer(), nullable=True),
    sa.Column('vitamin_a', sa.Integer(), nullable=True),
    sa.Column('vitamin_c', sa.Integer(), nullable=True),
    sa.Column('calcium', sa.Integer(), nullable=True),
    sa.Column('iron', sa.Integer(), nullable=True),
    sa.Column('vitamin_d', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    op.drop_table('foods')
    # ### end Alembic commands ###