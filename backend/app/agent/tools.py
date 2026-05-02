import json
from datetime import datetime
from langchain_core.tools import tool
from .utility import _send_confirmation_email
from ..database import AsyncSessionLocal
from ..models.models import Hall, Booking, User
from sqlalchemy import select, and_
from decimal import Decimal


async def _is_hall_available(session, hall_id, date_str):
    """Check if a hall is available on a specific date."""
    try:
        event_date = datetime.strptime(date_str, "%Y-%m-%d")
        start_of_day = event_date.replace(hour=0, minute=0, second=0)
        end_of_day = event_date.replace(hour=23, minute=59, second=59)

        query = select(Booking).where(
            and_(
                Booking.hall_id == hall_id,
                Booking.status == "confirmed",
                Booking.start_time < end_of_day,
                Booking.end_time > start_of_day,
            )
        )
        result = await session.execute(query)
        bookings = result.scalars().all()
        return len(bookings) == 0
    except Exception as e:
        print(f"Error checking availability: {e}")
        return False


@tool
async def search_available_halls(
    event_type: str,
    guests: int,
    area: str,
    budget: float,
    date: str,
) -> str:
    """
    Search halls from database filtered by capacity, area, and budget.
    Cross-checks availability for the given date.

    Args:
        event_type: e.g. 'Wedding', 'Corporate Function', 'Birthday'
        guests: expected number of guests
        area: preferred area in Lahore, e.g. 'Gulberg', 'DHA'
        budget: max price per day in PKR
        date: event date in YYYY-MM-DD format

    Returns:
        JSON string with list of matching available halls
    """
    try:
        async with AsyncSessionLocal() as session:
            query = select(Hall).where(
                and_(Hall.is_active == True, Hall.capacity >= guests)
            )

            result = await session.execute(query)
            halls = result.scalars().all()

            # Area filtering — handle multi-area queries like "DHA or Gulberg"
            area_clean = area.replace(" or ", "|").replace("/", "|").replace(",", "|")
            area_keywords = [
                a.strip().lower() for a in area_clean.split("|") if a.strip()
            ]

            filtered_halls = []
            for h in halls:
                # Area match
                location_match = any(
                    kw in h.location.lower() for kw in area_keywords
                )
                if not location_match:
                    continue

                # Price match (DB stores per-hour, budget is per-day, assume 10h event)
                estimated_day_price = float(h.price_per_hour) * 10
                if estimated_day_price > budget * 1.2:
                    continue

                # Availability check
                if await _is_hall_available(session, h.id, date):
                    filtered_halls.append(
                        {
                            "id": str(h.id),
                            "name": h.name,
                            "location": h.location,
                            "capacity": h.capacity,
                            "price_per_day": estimated_day_price,
                            "description": h.description or "",
                            "image_url": h.image_url or "",
                        }
                    )

            if not filtered_halls:
                return json.dumps(
                    {
                        "error": "No available halls found matching your criteria. "
                        "Try a higher budget, different area, or different date."
                    }
                )

            # Return top 5
            filtered_halls = filtered_halls[:5]
            return json.dumps({"halls": filtered_halls}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"error": f"Search failed: {str(e)}"})


@tool
async def confirm_booking(
    hall_id: str,
    hall_name: str,
    customer_email: str,
    customer_phone: str,
    event_type: str,
    event_date: str,
    guests: int,
) -> str:
    """
    Confirm a hall booking in the database. The customer_email is provided by the
    system context (the logged-in user). Do NOT ask the user for their email.

    Args:
        hall_id: UUID of the hall to book
        hall_name: display name of the hall
        customer_email: email of the logged-in customer (from system context)
        customer_phone: customer phone number
        event_type: type of event (Wedding, Corporate, etc.)
        event_date: event date in YYYY-MM-DD format
        guests: number of expected guests

    Returns:
        JSON with booking confirmation status
    """
    try:
        async with AsyncSessionLocal() as session:
            # Look up user by their email (injected from session)
            user_query = select(User).where(User.email == customer_email)
            user_result = await session.execute(user_query)
            user = user_result.scalars().first()

            if not user:
                return json.dumps(
                    {
                        "error": f"No user found with email {customer_email}. "
                        "Please ensure you are registered."
                    }
                )

            # Get Hall details for price calculation
            hall_query = select(Hall).where(Hall.id == hall_id)
            hall_result = await session.execute(hall_query)
            hall = hall_result.scalars().first()

            if not hall:
                return json.dumps({"error": "Hall not found."})

            # Calculate pricing (10-hour event day)
            duration_hours = 10
            total_price = float(hall.price_per_hour * duration_hours)

            # Create Booking
            event_dt = datetime.strptime(event_date, "%Y-%m-%d")
            start_time = event_dt.replace(hour=9, minute=0)
            end_time = event_dt.replace(hour=19, minute=0)

            new_booking = Booking(
                user_id=user.id,
                hall_id=hall.id,
                title=f"{event_type} for {user.full_name}",
                start_time=start_time,
                end_time=end_time,
                status="confirmed",
                total_price=total_price,
                notes=f"Phone: {customer_phone}, Guests: {guests}",
            )

            session.add(new_booking)
            await session.commit()
            await session.refresh(new_booking)

            booking_id_short = str(new_booking.id)[:8]

            # Send confirmation email
            email_status = _send_confirmation_email(
                to_email=customer_email,
                customer_name=user.full_name,
                booking_id=booking_id_short,
                hall_name=hall_name,
                event_date=event_date,
                event_type=event_type,
                guests=guests,
            )

            return json.dumps(
                {
                    "booking_id": str(new_booking.id),
                    "status": "confirmed",
                    "hall_name": hall_name,
                    "event_date": event_date,
                    "total_price": total_price,
                    "email_sent": email_status,
                    "message": f"Mubarak ho! 🎉 Booking confirmed for {hall_name} on {event_date}!",
                }
            )
    except Exception as e:
        return json.dumps({"error": f"Booking failed: {str(e)}"})


@tool
async def check_hall_availability(hall_query: str, date: str) -> str:
    """
    Check whether a specific hall is available on a given date.

    Args:
        hall_query: UUID or Name of the hall
        date: event date in YYYY-MM-DD format

    Returns:
        JSON string indicating availability status
    """
    try:
        async with AsyncSessionLocal() as session:
            hall = None

            # Try finding by UUID first
            try:
                from uuid import UUID

                hall_id_uuid = UUID(hall_query)
                hall_q = select(Hall).where(Hall.id == hall_id_uuid)
                result = await session.execute(hall_q)
                hall = result.scalars().first()
            except Exception:
                pass

            # Fallback: search by name
            if not hall:
                hall_q = select(Hall).where(Hall.name.ilike(f"%{hall_query}%"))
                result = await session.execute(hall_q)
                hall = result.scalars().first()

            if not hall:
                return json.dumps(
                    {
                        "available": False,
                        "error": f"No hall found matching '{hall_query}'.",
                    }
                )

            is_available = await _is_hall_available(session, hall.id, date)

            return json.dumps(
                {
                    "available": is_available,
                    "hall_id": str(hall.id),
                    "hall_name": hall.name,
                    "date": date,
                    "capacity": hall.capacity,
                    "price_per_day": float(hall.price_per_hour) * 10,
                    "message": (
                        f"Great news! {hall.name} is available on {date}."
                        if is_available
                        else f"Sorry, {hall.name} is already booked on {date}."
                    ),
                }
            )
    except Exception as e:
        return json.dumps({"error": f"Availability check failed: {str(e)}"})