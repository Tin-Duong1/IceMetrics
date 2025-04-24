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
from processing.processing_v2 import process_video  # Import the process_video function
from processing.open_ai_summary import summarize_stats  # Import the summarize_stats function
from dotenv import load_dotenv
from database.models import Video

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/analyze_video")
async def analyze_video(
    name: str = Form(...),
    video: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
    custom_prompt: Optional[str] = Form(None),
    use_v2: bool = Form(True)  # Default to using the new V2 analytics
):
    """
    Process and analyze hockey video.
    Now uses the improved HockeyAnalyticsV2 engine by default for three-zone analysis.
    """
    temp_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "tmp_videos")
    os.makedirs(temp_dir, exist_ok=True)
    
    unique_filename = f"{uuid.uuid4()}_{video.filename}"
    temp_path = os.path.join(temp_dir, unique_filename)
    
    try:
        with open(temp_path, "wb") as temp_file:
            content = await video.read()
            temp_file.write(content)
        
        # Use the process_video function for analysis
        zone_time, average_players_per_interval = process_video(temp_path)

        # Calculate total time and percentages
        total_time = sum(zone_time.values())
        left_percentage = round((zone_time["left"] / total_time) * 100, 1) if total_time > 0 else 0
        middle_percentage = round((zone_time["middle"] / total_time) * 100, 1) if total_time > 0 else 0
        right_percentage = round((zone_time["right"] / total_time) * 100, 1) if total_time > 0 else 0

        stats = {
            "left_side_time": zone_time["left"],
            "middle_zone_time": zone_time["middle"],
            "right_side_time": zone_time["right"],
            "left_side_percentage": left_percentage,
            "middle_zone_percentage": middle_percentage,
            "right_side_percentage": right_percentage,
            "average_players_per_second": average_players_per_interval  # Add average players data
        }

        # Generate AI summary
        summary = summarize_stats(stats)

        # Save video info to the database
        with Session(engine) as session:
            user = get_user_by_email(session, current_user)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            video_data = {
                "name": name,
                "duration": int(total_time),
                "summary": summary,
                **stats
            }
            
            new_video = add_video_to_user(session, current_user, video_data)
        
        return {
            "video_id": new_video.video_id,
            "name": name,
            "summary": summary,
            "stats": stats
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
    
    # Create the response with all possible fields
    response = {
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
    
    # Add middle zone data if it exists
    if hasattr(video, 'middle_zone_time') and video.middle_zone_time is not None:
        response["stats"]["middle_zone"] = {
            "time": video.middle_zone_time,
            "percentage": video.middle_zone_percentage
        }
    
    return response
