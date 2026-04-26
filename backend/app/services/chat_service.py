import json
from typing import List, Dict, Any
from ..config import settings
from ..schemas import ChatMessage
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from ..models import Hall, Booking
from .booking_service import BookingService
from datetime import datetime

import os
from dotenv import load_dotenv

from langchain_openrouter import ChatOpenRouter
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage

load_dotenv()

import json
from typing import List, Dict, Any
from ..schemas import ChatMessage
from sqlalchemy.ext.asyncio import AsyncSession
from langchain_core.messages import HumanMessage, AIMessage

class ChatService:
    def __init__(self, db: AsyncSession):
        from app.agent.graph import graph
        self.graph = graph
        self.db = db

    async def get_response(self, user_id: str, message: str, history: List[ChatMessage]):
        config = {"configurable": {"thread_id": user_id}}
        input_state = {"messages": [HumanMessage(content=message)]}
        
        response_state = await self.graph.ainvoke(input_state, config=config)
        
        ai_message = response_state["messages"][-1]
        if isinstance(ai_message.content, str):
            return ai_message.content
        elif isinstance(ai_message.content, list):
            return " ".join([str(c.get("text", c)) for c in ai_message.content if isinstance(c, dict)])
        return str(ai_message.content)
