from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..database import get_db
from ..models import Booking, User
from ..schemas import BookingCreate, BookingResponse
from ..services.booking_service import BookingService
from ..middleware.auth_middleware import get_current_user
from uuid import UUID

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/", response_model=BookingResponse)
async def create_booking(booking_data: BookingCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await BookingService.create_booking(db, str(current_user.id), booking_data)

@router.get("/me", response_model=List[BookingResponse])
async def get_my_bookings(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Booking).where(Booking.user_id == current_user.id).order_by(Booking.start_time.desc()))
    return result.scalars().all()

@router.patch("/{id}/cancel", response_model=BookingResponse)
async def cancel_booking(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Booking).where(Booking.id == id, Booking.user_id == current_user.id))
    booking = result.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found or not owned by user")
    
    booking.status = "cancelled"
    await db.commit()
    await db.refresh(booking)
    return booking
