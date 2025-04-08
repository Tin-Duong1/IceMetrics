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
from processing.open_ai_summary import summarize_stats
from dotenv import load_dotenv
from database.models import Video  # Add this import for the Video model

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
        
        fps = cap.get(cv2.CAP_PROP_FPS)  # Get frames per second
        frames_per_second = int(fps) if fps > 0 else 1  # Ensure valid FPS
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Process every frame
            analytics.process_frame(frame)
            frame_count += 1

        # Ensure the average_players_per_second has one data point per 50 frames
        total_points = frame_count // 50
        if len(analytics.average_players_per_second) < total_points:
            analytics.average_players_per_second.extend(
                [0] * (total_points - len(analytics.average_players_per_second))
            )
            
        left_time = analytics.stats['left_side']['time']
        right_time = analytics.stats['right_side']['time']
        total_time = left_time + right_time
        
        left_percentage = round((left_time / total_time) * 100, 1) if total_time > 0 else 0
        right_percentage = round((right_time / total_time) * 100, 1) if total_time > 0 else 0
        
        # Retrieve average players per second
        average_players_per_second = analytics.get_average_players_per_second()
        
        # Save video info to the database
        with Session(engine) as session:
            user = get_user_by_email(session, current_user)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            stats = {
                "left_side_time": left_time,
                "right_side_time": right_time,
                "left_side_percentage": left_percentage,
                "right_side_percentage": right_percentage,
                "average_players_per_second": average_players_per_second  # Add this to stats
            }
            
            summary = summarize_stats(stats)
            print(f"Summary: {summary}")
            
            video_data = {
                "name": name,
                "duration": duration,
                "left_side_time": left_time,
                "right_side_time": right_time,
                "left_side_percentage": left_percentage,
                "right_side_percentage": right_percentage,
                "average_players_per_second": average_players_per_second,  # Add this to video data
                "summary": summary
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
                },
                "average_players_per_second": average_players_per_second  # Include in response
            },
            "summary": summary
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

@router.get('/video/{video_id}/analysis')
async def get_video_analysis(
    video_id: int,
    session: SessionDep,
    current_user: str = Depends(get_current_user)
):
    """Get analysis details for a specific video by ID"""
    user = get_user_by_email(session, current_user)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    video = session.query(Video).filter(Video.video_id == video_id, Video.user_id == user.user_id).first()
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return {
        "video_id": video.video_id,
        "name": video.name,
        "duration": video.duration,
        "summary": video.summary,
        "stats": {
            "left_side": {
                "time": video.left_side_time,
                "percentage": video.left_side_percentage
            },
            "right_side": {
                "time": video.right_side_time,
                "percentage": video.right_side_percentage
            },
            "average_players_per_second": video.average_players_per_second
        }
    }
