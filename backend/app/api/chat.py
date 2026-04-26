from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.agent.graph import create_graph
from langchain_core.messages import HumanMessage, AIMessage
import uuid

router = APIRouter()

# Simple in-memory session store (In production, use Redis or DB)
sessions = {}

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str

class ChatResponse(BaseModel):
    session_id: str
    response: str
    state: str
    halls: List[dict] = []
    booking_confirmed: bool = False
    booking_id: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())
    
    # Load or initialize state
    if session_id not in sessions:
        sessions[session_id] = {
            "messages": [],
            "event_type": None,
            "guest_count": None,
            "location": None,
            "budget": None,
            "event_date": None,
            "specific_hall": None,
            "search_results": None,
            "selected_hall": None,
            "customer_name": None,
            "customer_email": None,
            "customer_phone": None,
            "booking_confirmed": False,
            "booking_id": None,
            "current_node": "START"
        }
    
    state = sessions[session_id]
    state["messages"].append(HumanMessage(content=request.message))
    
    try:
        # Run LangGraph
        app = create_graph()
        result = app.invoke(state)
        
        # Update session store
        sessions[session_id] = result
        
        # Get latest AI response
        last_message = result["messages"][-1].content if result["messages"] else "I'm not sure how to respond."
        
        return ChatResponse(
            session_id=session_id,
            response=last_message,
            state=result.get("current_node", "END"),
            halls=result.get("search_results") or [],
            booking_confirmed=result.get("booking_confirmed", False),
            booking_id=result.get("booking_id")
        )
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
