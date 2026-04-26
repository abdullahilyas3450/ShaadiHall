import json
import pandas as pd
from datetime import datetime
from langchain_core.tools import tool
from .utility import _send_confirmation_email
import json
import pandas as pd


HALLS_CSV    = "/home/abdullah/Desktop/antigravity/ShaadiHall/backend/app/data/halls.csv"
BOOKINGS_CSV = "/home/abdullah/Desktop/antigravity/ShaadiHall/backend/app/data/bookings.csv"


@tool
def search_available_halls(
    event_type: str,
    guests: int,
    area: str,
    budget: float,
    date: str
) -> str:
    """
    Search halls.csv filtered by event_type, guest capacity, area,
    budget, and availability on the given date (cross-checked with bookings.csv).

    Args:
        event_type: e.g. 'Wedding', 'Corporate Function', 'Birthday'
        guests: expected number of guests
        area: preferred area in Lahore, e.g. 'Gulberg', 'DHA'
        budget: max price per day in PKR
        date: event date in YYYY-MM-DD format

    Returns:
        JSON string with list of matching available halls (top 5)
    """
    halls_df    = pd.read_csv("/home/abdullah/Desktop/antigravity/ShaadiHall/backend/app/data/halls.csv")
    bookings_df = pd.read_csv("/home/abdullah/Desktop/antigravity/ShaadiHall/backend/app/data/bookings.csv")

    # Halls booked on that specific date
    booked_hall_ids = set(
        bookings_df[
            (bookings_df["event_date"] == date) &
            (bookings_df["status"] == "confirmed")
        ]["hall_id"].tolist()
    )

    # Filter by capacity
    halls_df = halls_df[
        (halls_df["capacity_min"] <= guests) &
        (halls_df["capacity_max"] >= guests)
    ]

    # Filter by budget (with 20% flexibility to surface near-budget options)
    halls_df = halls_df[halls_df["price_per_day"] <= budget * 1.2]

    # Filter by area (partial, case-insensitive; handles "Gulberg or DHA", "Gulberg/DHA", etc.)
    area_clean = area.replace(" or ", "|").replace("/", "|").replace(",", "|")
    area_keywords = [a.strip() for a in area_clean.split("|") if a.strip()]
    area_pattern = "|".join(area_keywords)
    halls_df = halls_df[halls_df["location"].str.contains(area_pattern, case=False, na=False)]

    # Filter by event type (handles semicolon-separated values like "Wedding;Mehndi;Walima")
    event_lower = event_type.lower()
    halls_df = halls_df[
        halls_df["event_types"].str.lower().str.contains(event_lower, na=False)
    ]

    # Remove booked halls
    halls_df = halls_df[~halls_df["id"].isin(booked_hall_ids)]

    if halls_df.empty:
        return json.dumps({"error": "No available halls found matching your criteria. Try a higher budget, different area, or different date."})

    # Sort by rating descending, take top 5
    halls_df = halls_df.sort_values("rating", ascending=False).head(5)

    results = halls_df[[
        "id", "name", "location", "capacity_max", "price_per_day",
        "rating", "parking", "catering", "contact_email", "contact_phone", "description"
    ]].to_dict(orient="records")

    return json.dumps({"halls": results}, ensure_ascii=False)


@tool
def confirm_booking(
    hall_id: int,
    hall_name: str,
    customer_name: str,
    customer_email: str,
    customer_phone: str,
    event_type: str,
    event_date: str,
    guests: int
) -> str:
    """
    Confirm a hall booking: appends a new record to bookings.csv
    and sends a confirmation email to the customer.

    Args:
        hall_id: numeric ID of the hall
        hall_name: name of the hall
        customer_name: full name of the customer
        customer_email: customer email address
        customer_phone: customer phone number
        event_type: type of event
        event_date: YYYY-MM-DD
        guests: number of guests

    Returns:
        JSON with booking_id and status message
    """
    # Generate booking ID
    bookings_df = pd.read_csv(BOOKINGS_CSV)
    last_id     = bookings_df["booking_id"].str.replace("B", "").astype(int).max()
    new_id      = f"B{last_id + 1:03d}"
    booked_at   = datetime.now().strftime("%Y-%m-%d")

    # Append to CSV
    new_row = {
        "booking_id":     new_id,
        "hall_id":        hall_id,
        "customer_name":  customer_name,
        "customer_email": customer_email,
        "customer_phone": customer_phone,
        "event_type":     event_type,
        "event_date":     event_date,
        "guests":         guests,
        "status":         "confirmed",
        "booked_at":      booked_at,
    }
    bookings_df = pd.concat([bookings_df, pd.DataFrame([new_row])], ignore_index=True)
    bookings_df.to_csv(BOOKINGS_CSV, index=False)

    # Send confirmation email
    email_status = _send_confirmation_email(
        to_email=customer_email,
        customer_name=customer_name,
        booking_id=new_id,
        hall_name=hall_name,
        event_date=event_date,
        event_type=event_type,
        guests=guests,
    )

    return json.dumps({
        "booking_id": new_id,
        "status":     "confirmed",
        "email_sent": email_status,
        "message":    f"Booking {new_id} confirmed for {hall_name} on {event_date}!"
    })


@tool
def check_hall_availability(
    hall_id: int,
    date: str
) -> str:
    """
    Check whether a specific hall is available on a given date.

    Args:
        hall_id: numeric ID of the hall to check
        date: event date in YYYY-MM-DD format

    Returns:
        JSON string indicating availability status
    """

    halls_df    = pd.read_csv("/home/abdullah/Desktop/antigravity/ShaadiHall/backend/app/data/halls.csv")
    bookings_df = pd.read_csv("/home/abdullah/Desktop/antigravity/ShaadiHall/backend/app/data/bookings.csv")

    # Verify the hall exists
    hall_row = halls_df[halls_df["id"] == hall_id]
    if hall_row.empty:
        return json.dumps({
            "available": False,
            "error": f"No hall found with ID {hall_id}."
        })

    hall_name = hall_row.iloc[0]["name"]

    # Check for a confirmed booking on that date for this hall
    conflict = bookings_df[
        (bookings_df["hall_id"] == hall_id) &
        (bookings_df["event_date"] == date) &
        (bookings_df["status"] == "confirmed")
    ]

    if not conflict.empty:
        booking = conflict.iloc[0]
        return json.dumps({
            "available": False,
            "hall_id": hall_id,
            "hall_name": hall_name,
            "date": date,
            "message": (
                f"Sorry, {hall_name} is not available on {date}. "
                f"It is already booked for a {booking['event_type']} event."
            )
        })

    return json.dumps({
        "available": True,
        "hall_id": hall_id,
        "hall_name": hall_name,
        "date": date,
        "message": f"Great news! {hall_name} is available on {date}."
    })