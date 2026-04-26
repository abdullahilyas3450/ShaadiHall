from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..middleware.auth_middleware import AuthService
from ..ws_manager import manager

router = APIRouter(prefix="/ws", tags=["websocket"])

@router.websocket("/admin/bookings")
async def websocket_admin_bookings(websocket: WebSocket, token: str = None):
    if not token:
        await websocket.close(code=1008)
        return

    payload = AuthService.decode_token(token)
    if not payload or payload.get("role") != "admin":
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, is_admin=True)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
