import asyncio
import csv
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from decimal import Decimal

from app.config import settings
from app.models.models import User, Hall, Booking

async def seed_data():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    
    async with AsyncSessionLocal() as session:
        # Check if halls already exist to avoid duplicating data
        result = await session.execute(select(Hall).limit(1))
        if result.scalars().first():
            print("Halls table already has data. Skipping to avoid duplicates.")
            return

        # Fetch the dummy user we created earlier
        result = await session.execute(select(User).where(User.email == "user@example.com"))
        default_user = result.scalars().first()
        if not default_user:
            print("Default dummy user not found. Please run init_db.py first.")
            return

        halls_mapping = {}
        price_mapping = {}
        print("Reading halls.csv...")
        with open('app/data/halls.csv', mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    price = Decimal(row['price_per_day']) / 10
                except:
                    price = Decimal(10000)
                
                desc = row['description'] + f"\nRating: {row['rating']} | Parking: {row['parking']} | Catering: {row['catering']} | Events: {row['event_types']}"

                hall = Hall(
                    name=row['name'],
                    description=desc,
                    capacity=int(row['capacity_max']) if row['capacity_max'] else 500,
                    location=row['location'],
                    price_per_hour=price,
                    image_url=None,
                    is_active=True
                )
                session.add(hall)
                await session.flush()
                halls_mapping[row['id']] = hall.id
                price_mapping[hall.id] = price
        
        print(f"Seeded {len(halls_mapping)} halls.")

        print("Reading bookings.csv...")
        bookings_count = 0
        with open('app/data/bookings.csv', mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                hall_uuid = halls_mapping.get(row['hall_id'])
                if not hall_uuid:
                    continue
                
                event_date = datetime.strptime(row['event_date'], '%Y-%m-%d').replace(tzinfo=timezone.utc)
                start_time = event_date + timedelta(hours=18)
                end_time = event_date + timedelta(hours=23)
                duration_hours = Decimal(5)
                
                total_price = price_mapping[hall_uuid] * duration_hours

                notes = f"Customer: {row['customer_name']}, Phone: {row['customer_phone']}, Email: {row['customer_email']}, Guests: {row['guests']}"

                status = row['status'].lower()
                if status not in ['confirmed', 'cancelled', 'pending']:
                    status = 'confirmed'

                booking = Booking(
                    user_id=default_user.id,
                    hall_id=hall_uuid,
                    title=f"{row['event_type']} - {row['customer_name']}",
                    start_time=start_time,
                    end_time=end_time,
                    status=status,
                    total_price=total_price,
                    notes=notes
                )
                session.add(booking)
                bookings_count += 1
        
        await session.commit()
        print(f"Seeded {bookings_count} bookings.")

if __name__ == '__main__':
    asyncio.run(seed_data())
