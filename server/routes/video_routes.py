import cv2
from typing import Optional

from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException

from database.models import Video
from database.database_setup import *
from utilities.security import get_current_user
from utilities.utilities import add_video_to_user, get_user_by_email, get_videos_by_user

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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

@router.delete("/me/delete_video/{video_id}")
async def delete_video(
    video_id: int,
    session: SessionDep,
    current_user: UserInfo = Depends(get_current_user)
):
    user = get_user_by_email(session, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        remove_video_from_user(session, video_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return {"detail": "Video deleted successfully"}