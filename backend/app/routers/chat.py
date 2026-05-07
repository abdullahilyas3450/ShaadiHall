from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..schemas import ChatRequest, ChatResponse
from ..services.chat_service import ChatService
from ..middleware.auth_middleware import get_current_user
from ..models import User
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat(
    request: Request,
    chat_data: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chat_service = ChatService(db)
    response_data = await chat_service.get_response(
        user_id=str(current_user.id),
        user_email=current_user.email,
        user_name=current_user.full_name,
        message=chat_data.message,
        history=chat_data.conversation_history
    )
    return response_data
