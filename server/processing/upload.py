import cv2  # Python OpenCV
import os
import datetime

from fastapi import APIRouter, HTTPException, Depends, Request, UploadFile, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated


from database.database_setup import SessionDep
from utilities.utilities import add_video_to_user, get_videos_by_user
from database.models import Video
from utilities.security import get_current_user, get_user_by_email  # Assuming these dependencies exist
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

    # Save the file temporarily
    temp_path = f"/tmp/{video.filename}"
    with open(temp_path, "wb") as temp_file:
        temp_file.write(await video.read())

    try:
        # Calculate video duration using OpenCV
        cap = cv2.VideoCapture(temp_path)
        if not cap.isOpened():
            raise Exception("Could not open video file")
        
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = frame_count / fps if fps > 0 else 0
        cap.release()

        # Add video to the user's account
        video_data = {
            "name": name,
            "datetime_uploaded": datetime.datetime.utcnow(),
            "duration": int(duration),
        }
        added_video = add_video_to_user(session, email, video_data)

        # Delete the temporary file
        os.remove(temp_path)

        return {
            "message": "Video uploaded successfully",
            "video_id": added_video.video_id,
            "name": added_video.name,
            "duration": added_video.duration,
        }
    except Exception as e:
        # Ensure the temporary file is deleted even if an error occurs
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=f"Error processing video: {e}")

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

