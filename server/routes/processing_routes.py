from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import os
import tempfile
from typing import Optional

from utilities.security import get_current_user
from processing.cloud_vision import process_video
from dotenv import load_dotenv

load_dotenv()
BUCKET_NAME = os.getenv("BUCKET_NAME")

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/analyze_video")
async def analyze_video(
    video: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
    custom_prompt: Optional[str] = Form(None)
):
    if not video:
        raise HTTPException(status_code=400, detail="No video file provided")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(video.filename)[1]) as temp_file:
        contents = await video.read()
        temp_file.write(contents)
        temp_path = temp_file.name
    
    try:
        results = process_video(
            video_path=temp_path,
            bucket_name=BUCKET_NAME,
            custom_prompt=custom_prompt
        )
        
        return {
            "filename": video.filename,
            "analysis_results": results
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")
    
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)