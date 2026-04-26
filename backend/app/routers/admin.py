from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import date, datetime, timedelta
from ..database import get_db
from ..models import Booking, Hall, User
from ..schemas import BookingWithDetails, AdminStats
from ..middleware.auth_middleware import get_admin_user
from uuid import UUID
from decimal import Decimal

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/bookings", response_model=List[BookingWithDetails])
async def get_all_bookings(
    status: Optional[str] = None,
    hall_id: Optional[UUID] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    page: int = 1,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user)
):
    query = select(Booking).options(
        selectinload(Booking.user),
        selectinload(Booking.hall)
    )
    
    if status:
        query = query.where(Booking.status == status)
    if hall_id:
        query = query.where(Booking.hall_id == hall_id)
    if date_from:
        query = query.where(Booking.start_time >= datetime.combine(date_from, datetime.min.time()))
    if date_to:
        query = query.where(Booking.end_time <= datetime.combine(date_to, datetime.max.time()))
    
    query = query.order_by(Booking.created_at.desc()).offset((page - 1) * limit).limit(limit)
    
    result = await db.execute(query)
    bookings = result.scalars().all()
    return bookings

@router.patch("/bookings/{id}/cancel")
async def admin_cancel_booking(id: UUID, db: AsyncSession = Depends(get_db), admin=Depends(get_admin_user)):
    result = await db.execute(select(Booking).where(Booking.id == id))
    booking = result.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking.status = "cancelled"
    await db.commit()
    return {"message": "Booking cancelled by admin"}

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(db: AsyncSession = Depends(get_db), admin=Depends(get_admin_user)):
    total_bookings = await db.scalar(select(func.count(Booking.id)))
    total_revenue = await db.scalar(select(func.sum(Booking.total_price)).where(Booking.status == "confirmed")) or Decimal(0)
    
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())
    bookings_today = await db.scalar(select(func.count(Booking.id)).where(and_(Booking.created_at >= today_start, Booking.created_at <= today_end)))
    
    active_halls = await db.scalar(select(func.count(Hall.id)).where(Hall.is_active == True))
    
    return {
        "total_bookings": total_bookings,
        "total_revenue": total_revenue,
        "bookings_today": bookings_today,
        "active_halls": active_halls
    }
