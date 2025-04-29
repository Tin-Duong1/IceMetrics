from fastapi import APIRouter, HTTPException, Depends
from utilities.security import get_current_user, verify_password, get_password_hash
from database.models import UserInfo
from utilities.utilities import get_user_by_email, remove_video_from_user, remove_user, get_user_stats
from database.database_setup import SessionDep

router = APIRouter()


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
    
    user_stats = get_user_stats(session, user.user_id)
    return user_stats

@router.post("/me/change_password")
async def change_password(
    password_data: dict,  # Changed to plain dictionary
    session: SessionDep,
    current_user: UserInfo = Depends(get_current_user)
):
    user = get_user_by_email(session, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(password_data["currentPassword"], user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if password_data["newPassword"] != password_data["confirmNewPassword"]:
        raise HTTPException(status_code=401, detail="Passwords do not match")
    user.password = get_password_hash(password_data["newPassword"])
    session.commit()
    session.refresh(user)
    return {"detail": "Password updated successfully"}

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