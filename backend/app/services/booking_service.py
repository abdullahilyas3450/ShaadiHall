from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from ..models import Booking, Hall
from ..schemas import BookingCreate
from datetime import datetime
from fastapi import HTTPException, status
from decimal import Decimal
from ..ws_manager import manager

class BookingService:
    @staticmethod
    async def check_overlap(db: AsyncSession, hall_id: str, start_time: datetime, end_time: datetime, exclude_booking_id: str = None):
        # Overlap logic: (StartA < EndB) AND (EndA > StartB)
        query = select(Booking).where(
            and_(
                Booking.hall_id == hall_id,
                Booking.status != "cancelled",
                Booking.start_time < end_time,
                Booking.end_time > start_time
            )
        )
        if exclude_booking_id:
            query = query.where(Booking.id != exclude_booking_id)
            
        result = await db.execute(query)
        return result.scalars().first() is not None

    @staticmethod
    async def calculate_price(db: AsyncSession, hall_id: str, start_time: datetime, end_time: datetime) -> Decimal:
        hall_result = await db.execute(select(Hall).where(Hall.id == hall_id))
        hall = hall_result.scalars().first()
        if not hall:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hall not found")
        
        duration = end_time - start_time
        hours = duration.total_seconds() / 3600
        return Decimal(hours) * hall.price_per_hour

    @staticmethod
    async def create_booking(db: AsyncSession, user_id: str, booking_data: BookingCreate):
        if booking_data.end_time <= booking_data.start_time:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="End time must be after start time")
        
        # Check if hall is active
        hall_result = await db.execute(select(Hall).where(Hall.id == booking_data.hall_id))
        hall = hall_result.scalars().first()
        if not hall or not hall.is_active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Hall is not active or not found")

        # Check overlap
        if await BookingService.check_overlap(db, str(booking_data.hall_id), booking_data.start_time, booking_data.end_time):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Hall is already booked for this time period")

        total_price = await BookingService.calculate_price(db, str(booking_data.hall_id), booking_data.start_time, booking_data.end_time)
        
        new_booking = Booking(
            user_id=user_id,
            hall_id=booking_data.hall_id,
            title=booking_data.title,
            start_time=booking_data.start_time,
            end_time=booking_data.end_time,
            notes=booking_data.notes,
            total_price=total_price,
            status="confirmed"
        )
        
        db.add(new_booking)
        await db.commit()
        await db.refresh(new_booking)
        
        # Broadcast to admins
        await manager.broadcast_to_admins({
            "type": "NEW_BOOKING",
            "booking": {
                "id": str(new_booking.id),
                "title": new_booking.title,
                "hall_name": hall.name,
                "start_time": new_booking.start_time.isoformat(),
                "total_price": str(new_booking.total_price)
            }
        })
        
        return new_booking
