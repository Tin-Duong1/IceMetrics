from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import os
import tempfile
from typing import Optional

from utilities.security import get_current_user
from processing.cloud_vision import process_video
from database.database_setup import *
from dotenv import load_dotenv


load_dotenv()
BUCKET_NAME = os.getenv("BUCKET_NAME")

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/analyze_video")
async def analyze_video(
    name: str = Form(...),
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
        # Set a hockey-specific prompt if none provided
        if not custom_prompt:
            custom_prompt = """
            Analyze these labels from a hockey video:
            {labels}
            
            Focus on:
            1. What specific hockey plays or situations are happening?
            2. What valuable metrics should be tracked based on what's visible?
            3. Any tactical observations about positioning or strategy?
            
            Provide your analysis in a clear, professional format.
            """
        
        # Process the video using cloud_vision.py functions
        results = process_video(
            video_path=temp_path,
            bucket_name=BUCKET_NAME,
            custom_prompt=custom_prompt
        )
        
        # Add the video name to the results
        results["video_name"] = name
        
        return {
            "filename": video.filename,
            "analysis_results": results
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")
    
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)