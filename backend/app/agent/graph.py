from .nodes import TOOLS, BookingState, agent_node, should_continue
from langgraph.prebuilt import ToolNode
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
import aiosqlite

tool_node = ToolNode(TOOLS)

# We define a function to provide the compiled graph with the checkpointer
def get_graph(conn):
    checkpointer = AsyncSqliteSaver(conn)
    graph_builder = StateGraph(BookingState)
    graph_builder.add_node("agent", agent_node)
    graph_builder.add_node("tools", tool_node)
    graph_builder.set_entry_point("agent")
    graph_builder.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
    graph_builder.add_edge("tools", "agent")
    return graph_builder.compile(checkpointer=checkpointer)
