import asyncio
from app.services.chat_service import ChatService
from app.database import AsyncSessionLocal
from app.models.models import User
from sqlalchemy import select


async def test_chat():
    async with AsyncSessionLocal() as db:
        # Fetch a real user
        result = await db.execute(
            select(User).where(User.email == "user@example.com")
        )
        user = result.scalars().first()
        if not user:
            print("User user@example.com not found. Run init_db.py first.")
            return

        chat_service = ChatService(db)
        print(f"Testing with user: {user.full_name} ({user.email})")
        print("-" * 50)

        try:
            # Test 1: Multi-detail message
            response = await chat_service.get_response(
                user_id=str(user.id),
                user_email=user.email,
                user_name=user.full_name,
                message="I want to book a wedding hall in DHA for 200 guests with budget 500000 on 2026-06-15",
                history=[],
            )
            print(f"AI: {response['message']}")
            if response.get("halls"):
                print(f"   → {len(response['halls'])} halls returned")
                for h in response["halls"]:
                    print(f"     • {h['name']} - PKR {h['price_per_day']:,.0f}/day")
            if response.get("booking"):
                print(f"   → Booking: {response['booking']}")
            print("-" * 50)

        except Exception as e:
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_chat())
