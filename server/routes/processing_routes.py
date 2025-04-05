from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import os
import cv2
import uuid
from typing import Optional

from utilities.security import get_current_user
from database.database_setup import *
from utilities.utilities import add_video_to_user, get_user_by_email, get_videos_by_user
from processing.processing import HockeyAnalytics
from dotenv import load_dotenv


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/analyze_video")
async def analyze_video(
    name: str = Form(...),
    video: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
    custom_prompt: Optional[str] = Form(None)
):
    temp_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "tmp_videos")
    os.makedirs(temp_dir, exist_ok=True)
    
    unique_filename = f"{uuid.uuid4()}_{video.filename}"
    temp_path = os.path.join(temp_dir, unique_filename)
    
    try:
        with open(temp_path, "wb") as temp_file:
            content = await video.read()
            temp_file.write(content)
        
        cap = cv2.VideoCapture(temp_path)
        if not cap.isOpened():
            raise HTTPException(status_code=400, detail="Could not open the video file")
        
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)
        duration = int(frame_count / fps) if fps > 0 else 0
        
        analytics = HockeyAnalytics()
        
        ret, first_frame = cap.read()
        if not ret:
            raise HTTPException(status_code=400, detail="Failed to read video frame")
        
        analytics.define_zones(first_frame.shape)
        
        frame_count = 0
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        
        sample_rate = 10
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            if frame_count % sample_rate == 0:
                analytics.process_frame(frame)
                
            frame_count += 1
            
        left_time = analytics.stats['left_side']['time']
        right_time = analytics.stats['right_side']['time']
        total_time = left_time + right_time
        
        left_percentage = round((left_time / total_time) * 100, 1) if total_time > 0 else 0
        right_percentage = round((right_time / total_time) * 100, 1) if total_time > 0 else 0
        
        # Save video info to the database
        with Session(engine) as session:
            user = get_user_by_email(session, current_user)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
                
            video_data = {
                "name": name,
                "duration": duration,
                "left_side_time": left_time,
                "right_side_time": right_time,
                "left_side_percentage": left_percentage,
                "right_side_percentage": right_percentage
            }
            
            new_video = add_video_to_user(session, current_user, video_data)
        
        return {
            "video_id": new_video.video_id,
            "duration": duration,
            "name": name,
            "stats": {
                "left_side": {
                    "time": int(left_time),
                    "percentage": left_percentage
                },
                "right_side": {
                    "time": int(right_time),
                    "percentage": right_percentage
                }
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")
    
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.get('/videos')
async def get_user_videos(
    session: SessionDep, 
    current_user: str = Depends(get_current_user)
):
    """Get all videos for the current user"""
    user = get_user_by_email(session, current_user)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    videos = get_videos_by_user(session, user.user_id)
    
    return videos
