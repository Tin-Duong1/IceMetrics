import cv2 
import os
import datetime

from fastapi import APIRouter, HTTPException, Depends, Request, UploadFile, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm


from database.database_setup import SessionDep
from utilities.utilities import add_video_to_user, get_videos_by_user
from database.models import Video
from utilities.security import get_current_user, get_user_by_email 
from database.models import UserInfo


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post('/upload')
async def upload_video(
    session: SessionDep, 
    current_user: str = Depends(get_current_user),
    video: UploadFile = Form(...),
    name: str = Form(...)
):
    email = current_user
    print(f"Email: {email}, Video Name: {name}")

    temp_path = f"/tmp/{video.filename}"
    with open(temp_path, "wb") as temp_file:
        temp_file.write(await video.read())
        os.remove(temp_path)
        

@router.get('/videos')
async def get_user_videos(
    session: SessionDep, 
    current_user: str = Depends(get_current_user)
):
    email = current_user
    user = get_user_by_email(session, email)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    videos = get_videos_by_user(session, user.user_id)
    
    return videos

