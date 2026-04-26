import asyncio
from app.services.chat_service import ChatService
from app.database import async_session_maker

async def test_chat():
    async with async_session_maker() as db:
        chat_service = ChatService(db)
        print("Chat service initialized")
        try:
            response = await chat_service.get_response(
                user_id="dummy_uuid", 
                message="hello, i want to book a hall", 
                history=[]
            )
            print("Response:", response)
        except Exception as e:
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_chat())
