from agent.graph import graph
from langchain_core.messages import HumanMessage

configurable = {"configurable": {"thread_id": "thread-1"}}
while True:
     user_input = input("User: ")
     if user_input.lower() in ["exit", "quit"]:
         print("Exiting...")
         break
     response = graph.invoke(
         {"messages": [HumanMessage(content=user_input)]},
         config=configurable
     )
     print("Agent:", response['messages'][-1].content)
