from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..database import get_db
from ..models import Hall, Booking
from ..schemas import HallCreate, HallUpdate, HallResponse
from ..middleware.auth_middleware import get_admin_user
from uuid import UUID

router = APIRouter(prefix="/halls", tags=["halls"])

@router.get("/", response_model=List[HallResponse])
async def get_halls(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Hall).where(Hall.is_active == True))
    return result.scalars().all()

@router.get("/{id}", response_model=HallResponse)
async def get_hall(id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Hall).where(Hall.id == id))
    hall = result.scalars().first()
    if not hall:
        raise HTTPException(status_code=404, detail="Hall not found")
    return hall

@router.post("/", response_model=HallResponse)
async def create_hall(hall_data: HallCreate, db: AsyncSession = Depends(get_db), admin=Depends(get_admin_user)):
    new_hall = Hall(**hall_data.model_dump())
    db.add(new_hall)
    await db.commit()
    await db.refresh(new_hall)
    return new_hall

@router.patch("/{id}", response_model=HallResponse)
async def update_hall(id: UUID, hall_data: HallUpdate, db: AsyncSession = Depends(get_db), admin=Depends(get_admin_user)):
    result = await db.execute(select(Hall).where(Hall.id == id))
    hall = result.scalars().first()
    if not hall:
        raise HTTPException(status_code=404, detail="Hall not found")
    
    update_data = hall_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(hall, key, value)
    
    await db.commit()
    await db.refresh(hall)
    return hall

@router.delete("/{id}")
async def delete_hall(id: UUID, db: AsyncSession = Depends(get_db), admin=Depends(get_admin_user)):
    result = await db.execute(select(Hall).where(Hall.id == id))
    hall = result.scalars().first()
    if not hall:
        raise HTTPException(status_code=404, detail="Hall not found")
    
    hall.is_active = False # Soft delete
    await db.commit()
    return {"message": "Hall deactivated successfully"}
