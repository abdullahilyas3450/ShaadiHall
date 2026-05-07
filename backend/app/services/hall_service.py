import pandas as pd
import os
from typing import List, Optional

# Constants
HALLS_CSV = os.path.join(os.path.dirname(__file__), "..", "data", "halls.csv")
BOOKINGS_CSV = os.path.join(os.path.dirname(__file__), "..", "data", "bookings.csv")

def search_halls(state: dict) -> List[dict]:
    """
    Search for halls based on state criteria.
    Criteria: event_type, guest_count, location, budget, event_date availability.
    """
    try:
        halls_df = pd.read_csv(HALLS_CSV)
        bookings_df = pd.read_csv(BOOKINGS_CSV)
        
        # 1. Filter by event_type (case-insensitive)
        if state.get("event_type"):
            halls_df = halls_df[halls_df['event_types'].str.contains(state["event_type"], case=False, na=False)]
            
        # 2. Filter by guest_count (capacity_min <= guest_count <= capacity_max)
        if state.get("guest_count"):
            halls_df = halls_df[
                (halls_df['capacity_min'] <= state["guest_count"]) & 
                (halls_df['capacity_max'] >= state["guest_count"])
            ]
            
        # 3. Filter by location (substring match, case-insensitive)
        if state.get("location"):
            halls_df = halls_df[halls_df['location'].str.contains(state["location"], case=False, na=False)]
            
        # 4. Filter by budget (price_per_day <= budget)
        if state.get("budget"):
            halls_df = halls_df[halls_df['price_per_day'] <= state["budget"]]
            
        # 5. Filter by availability (hall_id NOT in bookings.csv for event_date)
        if state.get("event_date"):
            booked_hall_ids = bookings_df[
                (bookings_df['event_date'] == state["event_date"]) & 
                (bookings_df['status'] != 'cancelled')
            ]['hall_id'].tolist()
            halls_df = halls_df[~halls_df['id'].isin(booked_hall_ids)]
            
        # Sort by rating descending
        halls_df = halls_df.sort_values(by='rating', ascending=False)
        
        # Return top 3
        return halls_df.head(3).to_dict(orient='records')
        
    except Exception as e:
        print(f"Error in search_halls: {e}")
        return []

def check_availability(hall_id: int, date: str) -> bool:
    """Check if a specific hall is available on a specific date."""
    try:
        bookings_df = pd.read_csv(BOOKINGS_CSV)
        is_booked = bookings_df[
            (bookings_df['hall_id'] == hall_id) & 
            (bookings_df['event_date'] == date) & 
            (bookings_df['status'] != 'cancelled')
        ].any().any()
        return not is_booked
    except Exception as e:
        print(f"Error checking availability: {e}")
        return False

def get_nearby_free_dates(hall_id: int, date: str, n: int = 3) -> List[str]:
    """Find next n available dates for a hall starting from date."""
    from datetime import datetime, timedelta
    free_dates = []
    current_date = datetime.strptime(date, "%Y-%m-%d")
    
    try:
        bookings_df = pd.read_csv(BOOKINGS_CSV)
        while len(free_dates) < n:
            current_date += timedelta(days=1)
            date_str = current_date.strftime("%Y-%m-%d")
            is_booked = bookings_df[
                (bookings_df['hall_id'] == hall_id) & 
                (bookings_df['event_date'] == date_str) & 
                (bookings_df['status'] != 'cancelled')
            ].any().any()
            if not is_booked:
                free_dates.append(date_str)
        return free_dates
    except Exception as e:
        print(f"Error getting nearby free dates: {e}")
        return []
