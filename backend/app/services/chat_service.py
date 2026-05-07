import json
import aiosqlite
from typing import List
from ..schemas import ChatMessage
from sqlalchemy.ext.asyncio import AsyncSession
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage, SystemMessage
import logging

logger = logging.getLogger(__name__)

DB_PATH = "checkpoints.db"


class ChatService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_response(
        self,
        user_id: str,
        user_email: str,
        user_name: str,
        message: str,
        history: List[ChatMessage],
    ):
        from app.agent.graph import get_graph

        config = {"configurable": {"thread_id": user_id}}

        # Inject user context so the agent knows who it's talking to.
        # This is prepended as a system message before the user's actual message.
        user_context = (
            f"[SYSTEM CONTEXT] The logged-in customer is: "
            f"Name: {user_name}, Email: {user_email}, User ID: {user_id}. "
            f"Use this information for bookings automatically. "
            f"Do NOT ask the customer for their name or email — you already have it."
        )

        input_state = {
            "messages": [
                SystemMessage(content=user_context),
                HumanMessage(content=message),
            ]
        }

        try:
            async with aiosqlite.connect(DB_PATH) as conn:
                app = get_graph(conn)

                # Get current state to know how many messages existed BEFORE this turn
                current_state = await app.aget_state(config)
                prev_count = (
                    len(current_state.values.get("messages", []))
                    if current_state.values
                    else 0
                )

                response_state = await app.ainvoke(input_state, config=config)
                all_messages = response_state["messages"]

                # Only look at NEW messages from this turn
                new_messages = all_messages[prev_count:]

                # Extract halls ONLY from new ToolMessages in this turn
                halls = []
                for msg in new_messages:
                    if isinstance(msg, ToolMessage):
                        try:
                            data = json.loads(msg.content)
                            if "halls" in data:
                                halls = data["halls"]
                        except Exception:
                            continue

                # Extract booking confirmation from this turn
                booking = None
                for msg in new_messages:
                    if isinstance(msg, ToolMessage):
                        try:
                            data = json.loads(msg.content)
                            if data.get("status") == "confirmed" and "booking_id" in data:
                                booking = data
                        except Exception:
                            continue

                # Find the latest AI text response from this turn
                final_message = None
                for msg in reversed(new_messages):
                    if isinstance(msg, AIMessage) and msg.content:
                        if isinstance(msg.content, list):
                            text_bits = [
                                c.get("text", "") if isinstance(c, dict) else str(c)
                                for c in msg.content
                            ]
                            content = " ".join(text_bits).strip()
                            if content and not content.startswith("[{"):
                                final_message = content
                                break
                        elif isinstance(msg.content, str):
                            content = msg.content.strip()
                            # Skip raw JSON / tool call outputs
                            if content and not (
                                content.startswith("{") and content.endswith("}")
                            ):
                                final_message = content
                                break

                if not final_message:
                    for msg in reversed(new_messages):
                        if (
                            isinstance(msg, AIMessage)
                            and hasattr(msg, "tool_calls")
                            and msg.tool_calls
                        ):
                            final_message = (
                                "I'm looking into that for you right now..."
                            )
                            break

                if not final_message:
                    final_message = "I've processed your request. Is there anything else I can help with?"

                return {
                    "message": final_message,
                    "halls": halls if halls else None,
                    "booking": booking,
                }

        except Exception as e:
            logger.error(f"Error in ChatService: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            return {
                "message": "I'm sorry, I encountered a temporary technical issue. Please try again in a moment.",
                "halls": None,
                "booking": None,
            }
