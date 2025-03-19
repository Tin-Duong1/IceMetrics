from fastapi import APIRouter, HTTPException, Depends
from utilities.security import get_current_user, verify_password, get_password_hash
from database.models import UserInfo
from utilities.utilities import get_user_by_email
from database.database_setup import SessionDep
from pydantic import BaseModel

router = APIRouter()

class PasswordUpdate(BaseModel):
    currentPassword: str
    newPassword: str
    confirmNewPassword: str

@router.get("/me/settings")
async def read_user_data(
    session: SessionDep, 
    current_user: UserInfo = Depends(get_current_user)
):
    user = get_user_by_email(session, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

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