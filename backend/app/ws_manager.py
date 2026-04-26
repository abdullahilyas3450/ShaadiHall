from fastapi import WebSocket
from typing import List
import json

class ConnectionManager:
    def __init__(self):
        self.active_admin_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket, is_admin: bool):
        await websocket.accept()
        if is_admin:
            self.active_admin_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_admin_connections:
            self.active_admin_connections.remove(websocket)

    async def broadcast_to_admins(self, message: dict):
        for connection in self.active_admin_connections:
            try:
                await connection.send_text(json.dumps(message))
            except:
                pass

manager = ConnectionManager()
