import os
from typing import Optional

from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException

from database.models import Video
from database.database_setup import *
from utilities.security import get_current_user
from utilities.utilities import add_video_to_user, get_user_by_email, get_videos_by_user
from processing.processing import process_and_summarize_video

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/analyze_video")
async def analyze_video(
    name: str = Form(...),
    video: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
    custom_prompt: Optional[str] = Form(None),
    use_v2: bool = Form(True)
):
    temp_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "tmp_videos")
    
    try:
        result, temp_path = process_and_summarize_video(video, name, temp_dir)

        with Session(engine) as session:
            user = get_user_by_email(session, current_user)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            video_data = {
                "name": name,
                "duration": result["duration"],
                "summary": result["summary"],
                **result["stats"]
            }
            new_video = add_video_to_user(session, current_user, video_data)
        
        return {
            "video_id": new_video.video_id,
            "name": name,
            "summary": result["summary"],
            "stats": result["stats"]
        }
    
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
