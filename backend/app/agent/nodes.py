import os

from langchain_openrouter import ChatOpenRouter
from typing import Annotated, TypedDict, Optional

# from langchain_anthropic import ChatAnthropic

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from .tools import search_available_halls, confirm_booking
from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from dotenv import load_dotenv      
load_dotenv()  # Load environment variables from .env file


# from langchain_anthropic import ChatAnthropic
from dotenv import load_dotenv      
load_dotenv()  # Load environment variables from .env file


class BookingState(TypedDict):
    messages: Annotated[list, add_messages]


# ─────────────────────────────────────────────
# AGENT SETUP
# ─────────────────────────────────────────────

TOOLS = [search_available_halls, confirm_booking]

llm= ChatGoogleGenerativeAI(
    model="gemini-3-flash-preview",
    temperature=1.0,  # Gemini 3.0+ defaults to 1.0
    max_tokens=None,
    timeout=None,
    max_retries=2,
    api_key="AIzaSyBmSsSLIuOKoNMrntNqvjKNs_8gL5j2vNE"
    # other params...
).bind_tools(TOOLS)

SYSTEM_PROMPT = """You are a friendly and professional hall booking assistant for ShadiHall.pk in Lahore, Pakistan.
Your job is to help customers find and book banquet halls for their events.

CONVERSATION FLOW:
1. Ask what type of event (Wedding, Mehndi, Walima, Corporate Function, Birthday, etc.)
2. Ask expected number of guests
3. Ask preferred area in Lahore (Gulberg, DHA, Model Town, etc.)
4. Ask budget per day in PKR
5. Ask the event date (accept natural formats like "20th May 2025" and convert to YYYY-MM-DD)
6. Call search_available_halls tool with collected info
7. Present the top halls clearly (name, location, capacity, price, rating, parking, catering)
8. Ask which hall they want to book
9. Collect: full name, email address, phone number
10. Call confirm_booking tool
11. Confirm the booking with the booking ID

RULES:
- Be conversational and warm, using Pakistani hospitality tone
- If no halls match, suggest relaxing the budget or area preferences
- Always confirm date parsing: "I'll book for 20th May 2025 (2025-05-20), correct?"
- Present halls as a numbered list for easy selection
- After booking, mention the confirmation email has been sent
- Handle one step at a time — don't ask multiple questions at once"""


def agent_node(state: BookingState):
    messages = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]
    response = llm.invoke(messages)
    return {
        "messages": state["messages"] + [response]
    }

def should_continue(state: BookingState):
    last = state["messages"][-1]
    if hasattr(last, "tool_calls") and last.tool_calls:
        return "tools"
    return END
