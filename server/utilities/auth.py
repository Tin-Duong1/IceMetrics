from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from pydantic import BaseModel
from database.database_setup import get_session
from database.models import UserInfo
from utilities.security import get_password_hash, verify_password

from utilities.utilities import *

router = APIRouter()

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# sign in route
@router.post("/signin")
async def signin(user: UserLogin, session: Session = Depends(get_session)):
    existing_user = get_user_by_email(session, user.email)
    if not existing_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(user.password, existing_user.password):
        raise HTTPException(status_code=400, detail="Invalid password")

    return existing_user

# sign up route
@router.post("/signup")
async def signup(user: UserCreate, session: Session = Depends(get_session)):
    existing_user = get_user_by_email(session, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = UserInfo(
        name=user.name,
        email=user.email,
        password=get_password_hash(user.password)
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user