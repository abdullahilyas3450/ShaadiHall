from fastapi import APIRouter, HTTPException
import pandas as pd
import os

BOOKINGS_CSV = os.path.join(os.path.dirname(__file__), "..", "data", "bookings.csv")

router = APIRouter()

@router.get("/availability")
async def get_availability(hall_id: int, date: str):
    """Check if a specific hall is available on a specific date."""
    try:
        if not os.path.exists(BOOKINGS_CSV):
            return {"available": True}
            
        df = pd.read_csv(BOOKINGS_CSV)
        # Check if any non-cancelled booking exists for this hall and date
        conflict = df[
            (df['hall_id'] == hall_id) & 
            (df['event_date'] == date) & 
            (df['status'] != 'cancelled')
        ]
        
        return {"available": len(conflict) == 0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def list_bookings(customer_email: str):
    """List bookings for a specific customer."""
    try:
        if not os.path.exists(BOOKINGS_CSV):
            return []
            
        df = pd.read_csv(BOOKINGS_CSV)
        customer_bookings = df[df['customer_email'] == customer_email]
        return customer_bookings.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
