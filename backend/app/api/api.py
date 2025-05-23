from fastapi import APIRouter

from app.api.endpoints import (
    auth,
    users,
    videos,
    notifications,
    user_history,
    ws_video_processing,
    ws_camera_processing
)

api_router = APIRouter()

# Đăng ký các endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(videos.router, prefix="/videos", tags=["videos"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(user_history.router, prefix="/history", tags=["user_history"])
api_router.include_router(ws_video_processing.router, prefix="/ws", tags=["websocket"])
api_router.include_router(ws_camera_processing.ws_router, prefix="/ws", tags=["websocket"]) 