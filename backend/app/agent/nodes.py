import re
import json
import uuid
from typing import Annotated, TypedDict

from langchain_openrouter import ChatOpenRouter
from langchain_core.messages import SystemMessage
from langgraph.graph.message import add_messages
from langgraph.graph import END
from dotenv import load_dotenv

from .tools import search_available_halls, confirm_booking, check_hall_availability

load_dotenv()


class BookingState(TypedDict):
    messages: Annotated[list, add_messages]


TOOLS = [search_available_halls, confirm_booking, check_hall_availability]

llm = ChatOpenRouter(
    model="openrouter/free",
    temperature=0,
    max_tokens=1024,
    max_retries=2,
).bind_tools(TOOLS)


SYSTEM_PROMPT = """You are a warm and welcoming hall booking assistant for ShadiHall.pk in Lahore, Pakistan.
Your sole purpose is helping customers find and book the perfect banquet hall for their special event.
Do NOT respond to any off-topic questions. If asked something unrelated, politely redirect:
"JazakAllah for asking, but I'm only here to help with hall bookings — shall we continue?"

IMPORTANT — USER IDENTITY:
- The system automatically provides the customer's name and email in the context.
- NEVER ask the customer for their name or email address — you already have it.
- When confirming a booking, use the email from the system context to pass to the confirm_booking tool.

INFORMATION GATHERING (one question at a time, warmly phrased):
1. "May I ask what type of event you're planning? (Wedding, Mehndi, Walima, Corporate, Birthday, etc.)"
2. "Wonderful! How many guests are you expecting?"
3. "Which area of Lahore would you prefer? (Gulberg, DHA, Model Town, Johar Town, etc.)"
4. "What is your budget per day in PKR?"
5. Event date — accept natural language ("20th May 2026"), then confirm warmly:
   "Lovely! Just to confirm, that's 20 May 2026 (2026-05-20) — is that correct?"

NOTE: If the user provides multiple details at once (e.g. "wedding in DHA for 200 guests on May 20 with 500k budget"),
extract ALL provided details and only ask for the missing ones. Do NOT re-ask for information already given.

TOOL USAGE — TWO PATHS:

PATH A — Standard search flow:
- After all 5 details collected: call search_available_halls with all parameters
- Results are already availability-filtered — present as a numbered list with a warm intro:
  "Great news! Here are the best halls available for your event:"
  (Include: name, location, capacity, price/day, and a brief description)
- User picks a hall (either by number, name, or clicking "Book Now" which sends "I want to book [hall name] (Hall ID: xxx)")
  → proceed to collect phone number, then call confirm_booking

PATH B — User requests a specific hall by name directly:
- Call check_hall_availability(hall_query=hall_name, date=date) immediately
  - If AVAILABLE: "Wonderful choice! [Hall Name] is available on that date."
    Collect any missing details then proceed to booking
  - If UNAVAILABLE: suggest alternatives or a different date

BOOKING COMPLETION (both paths):
- You already have the customer's name and email from the system context.
- Only ask for: phone number
- Then call confirm_booking with: hall_id, hall_name, event_type, event_date, guests, customer_phone, customer_email (from context)
- End warmly: "Mubarak ho! 🎉 Your booking is confirmed. Your booking ID is [ID].
  We wish you a wonderful event!"

RESPONSE STYLE:
- Warm, polite, and welcoming — like a helpful friend, not a form
- Use light Pakistani expressions naturally (Mubarak ho, JazakAllah, InshAllah)
- Ask only ONE question per message
- Always acknowledge the user's response before asking the next question
- If search returns no results: apologize warmly and suggest widening budget or trying another area
- Never fabricate hall data — only use results from tool responses
- Keep responses concise but warm"""


async def agent_node(state: BookingState):
    messages = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]
    response = await llm.ainvoke(messages)

    # Fallback: Parse <TOOLCALL> tags if the model outputs them as text
    if not (hasattr(response, "tool_calls") and response.tool_calls) and isinstance(
        response.content, str
    ):
        match = re.search(
            r"TOOLCALL>(\[.*?\])</TOOLCALL>", response.content, re.DOTALL
        )
        if match:
            try:
                tool_calls_raw = json.loads(match.group(1))
                formatted_tool_calls = []
                for tc in tool_calls_raw:
                    formatted_tool_calls.append(
                        {
                            "name": tc["name"],
                            "args": tc.get("arguments", tc.get("args", {})),
                            "id": f"call_{len(formatted_tool_calls)}_{str(uuid.uuid4())[:8]}",
                            "type": "tool_call",
                        }
                    )
                response.tool_calls = formatted_tool_calls
                # Clear the raw text content since we parsed the tool calls
                response.content = ""
            except Exception as e:
                print(f"Error parsing manual tool call: {e}")

    return {"messages": state["messages"] + [response]}


def should_continue(state: BookingState):
    last = state["messages"][-1]
    if hasattr(last, "tool_calls") and last.tool_calls:
        return "tools"
    return END
