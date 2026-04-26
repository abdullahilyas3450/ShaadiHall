from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models import User, Admin
from ..schemas import UserCreate, UserResponse, Token, TokenRefresh, LoginRequest
from ..services.auth_service import AuthService
from ..middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = AuthService.get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        role="user"
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    access_token = AuthService.create_access_token(data={"sub": new_user.email, "role": new_user.role})
    refresh_token = AuthService.create_refresh_token(data={"sub": new_user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": new_user
    }

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalars().first()
    
    if not user or not AuthService.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = AuthService.create_access_token(data={"sub": user.email, "role": user.role})
    refresh_token = AuthService.create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user
    }

@router.post("/refresh")
async def refresh(refresh_data: TokenRefresh, db: AsyncSession = Depends(get_db)):
    payload = AuthService.decode_token(refresh_data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    email = payload.get("sub")
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access_token = AuthService.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": new_access_token}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
