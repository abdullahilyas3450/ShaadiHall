import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

from app.config import settings
from app.database import Base
from app.models.models import User, Admin
from app.services.auth_service import AuthService

async def init_db():
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        print("Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created.")
        
    AsyncSessionLocal = sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    
    async with AsyncSessionLocal() as session:
        # Check if users already exist
        result = await session.execute(select(User))
        if result.scalars().first():
            print("Users already exist. Skipping seed.")
            return

        print("Seeding dummy users...")
        
        # Admin user
        admin_pass = AuthService.get_password_hash("admin123")
        admin_user = User(
            email="admin@example.com",
            full_name="System Admin",
            hashed_password=admin_pass,
            role="admin"
        )
        session.add(admin_user)
        
        # Standard user
        user_pass = AuthService.get_password_hash("user123")
        standard_user = User(
            email="user@example.com",
            full_name="Standard User",
            hashed_password=user_pass,
            role="user"
        )
        session.add(standard_user)
        await session.flush() # flush to get IDs
        
        # Admin profile for the admin user
        admin_profile = Admin(user_id=admin_user.id)
        session.add(admin_profile)
        
        await session.commit()
        print("Successfully created: admin@example.com / admin123 (Role: admin)")
        print("Successfully created: user@example.com  / user123 (Role: user)")

if __name__ == "__main__":
    asyncio.run(init_db())
