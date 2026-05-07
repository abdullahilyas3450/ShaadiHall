"""initial_schema

Revision ID: 001
Revises: 
Create Date: 2024-04-24 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Enable extension for gist overlap check
    op.execute("CREATE EXTENSION IF NOT EXISTS btree_gist")

    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('email', sa.Text(), nullable=False),
        sa.Column('hashed_password', sa.Text(), nullable=False),
        sa.Column('full_name', sa.Text(), nullable=False),
        sa.Column('role', sa.Text(), server_default='user', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='TRUE', nullable=True),
        sa.Column('created_at', sa.TIMESTAMPTZ(), server_default=sa.text('NOW()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.CheckConstraint("role IN ('user', 'admin')", name='check_user_role')
    )
    
    op.create_table('admins',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.TIMESTAMPTZ(), server_default=sa.text('NOW()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )

    op.create_table('halls',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('name', sa.Text(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('capacity', sa.Integer(), nullable=False),
        sa.Column('location', sa.Text(), nullable=False),
        sa.Column('price_per_hour', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('image_url', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='TRUE', nullable=True),
        sa.Column('created_at', sa.TIMESTAMPTZ(), server_default=sa.text('NOW()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('bookings',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('hall_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.Text(), nullable=False),
        sa.Column('start_time', sa.TIMESTAMPTZ(), nullable=False),
        sa.Column('end_time', sa.TIMESTAMPTZ(), nullable=False),
        sa.Column('status', sa.Text(), server_default='confirmed', nullable=False),
        sa.Column('total_price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMPTZ(), server_default=sa.text('NOW()'), nullable=True),
        sa.ForeignKeyConstraint(['hall_id'], ['halls.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint("status IN ('confirmed', 'cancelled', 'pending')", name='check_booking_status')
    )

    # ADD GIST overlap constraint
    op.execute("""
        ALTER TABLE bookings
        ADD CONSTRAINT no_overlap EXCLUDE USING gist (
            hall_id WITH =,
            tstzrange(start_time, end_time) WITH &&
        ) WHERE (status != 'cancelled')
    """)

def downgrade():
    op.drop_table('bookings')
    op.drop_table('halls')
    op.drop_table('admins')
    op.drop_table('users')
    op.execute("DROP EXTENSION IF EXISTS btree_gist")
