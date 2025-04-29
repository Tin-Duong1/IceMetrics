from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from database.database_setup import get_session
from database.models import UserInfo
from utilities.security import get_password_hash, authenticate_user, create_access_token
from utilities.utilities import get_user_by_email
from datetime import timedelta

router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = 3000

# sign in route
@router.post("/signin")
async def signin(user: dict, session: Session = Depends(get_session)):
    email = user.get("email")
    password = user.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    authenticated_user = authenticate_user(session, email, password)
    if not authenticated_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": authenticated_user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "xtoken_type": "bearer"}

# sign up route
@router.post("/signup")
async def signup(user: dict, session: Session = Depends(get_session)):
    email = user.get("email")
    password = user.get("password")
    name = user.get("name")

    if not email or not password or not name:
        raise HTTPException(status_code=400, detail="Name, email, and password are required")

    existing_user = get_user_by_email(session, email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = UserInfo(
        name=name,
        email=email,
        password=get_password_hash(password)
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"id": new_user.id, "name": new_user.name, "email": new_user.email}