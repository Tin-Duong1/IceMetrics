from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from contextlib import asynccontextmanager

from utilities.auth import router as auth_router
from routes.user_routes import router as user_router
from routes.video_routes import router as video_router
from routes.vision_routes import router as vision_router

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(vision_router)
app.include_router(video_router)

@app.get("/")
async def root():
    return RedirectResponse(url="/docs")


