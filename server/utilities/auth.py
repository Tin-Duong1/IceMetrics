from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from pydantic import BaseModel
from database.database_setup import get_session
from database.models import UserInfo
from utilities.security import get_password_hash, verify_password, authenticate_user, create_access_token
from utilities.utilities import get_user_by_email
from datetime import timedelta

router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = 30


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
    authenticated_user = authenticate_user(session, user.email, user.password)
    if not authenticated_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": authenticated_user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

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