from .nodes import TOOLS, BookingState, agent_node, should_continue
from langgraph.prebuilt import ToolNode
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import InMemorySaver
tool_node = ToolNode(TOOLS)
checkpointer_saver = InMemorySaver()
graph_builder = StateGraph(BookingState)
graph_builder.add_node("agent", agent_node)
graph_builder.add_node("tools", tool_node)
graph_builder.set_entry_point("agent")
graph_builder.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
graph_builder.add_edge("tools", "agent")

graph = graph_builder.compile( checkpointer = checkpointer_saver)
