from fastapi import APIRouter, HTTPException, Depends
from utilities.security import get_current_user, verify_password, get_password_hash
from database.models import UserInfo
from utilities.utilities import get_user_by_email, remove_video_from_user, remove_user, get_user_stats
from database.database_setup import SessionDep
from pydantic import BaseModel

router = APIRouter()

class PasswordUpdate(BaseModel):
    currentPassword: str
    newPassword: str
    confirmNewPassword: str

class UserStats(BaseModel):
    number_of_videos: int
    total_duration: int

@router.get("/me/settings")
async def read_user_data(
    session: SessionDep, 
    current_user: UserInfo = Depends(get_current_user)
):
    user = get_user_by_email(session, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/me/stats")
async def read_user_stats(
    session: SessionDep, 
    current_user: UserInfo = Depends(get_current_user)
):
    user = get_user_by_email(session, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    userStats = get_user_stats(session, user.user_id)
    return userStats

@router.post("/me/change_password")
async def change_password(passwordData: PasswordUpdate,
    session: SessionDep,
    current_user: UserInfo = Depends(get_current_user)
):
    user = get_user_by_email(session, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(passwordData.currentPassword, user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if passwordData.newPassword != passwordData.confirmNewPassword:
        raise HTTPException(status_code=401, detail="Passwords do not match")
    user.password = get_password_hash(passwordData.newPassword)
    session.commit()
    session.refresh(user)
    return {"detail": "Password updated successfully"}

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

@router.delete("/me/delete_account")
async def delete_user(
    session: SessionDep,
    current_user: UserInfo = Depends(get_current_user)
):
    user = get_user_by_email(session, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        remove_user(session, user.user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return {"detail": "User account deleted successfully"}