from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class User(BaseModel):
    email: str
    password: str

class UserInfo(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str

# Array of fake users
users = [
    {"email": "jake81morgan@gmail.com", "password": "Jackson1"},
    {"email": "user2@example.com", "password": "password2"},
    {"email": "user3@example.com", "password": "password3"},
]

codes = ["123123", "888888", "123456", "654321"]


# sign in route
@router.post("/signin")
async def root(user: User):
    for u in users:
        if u["email"] == user.email and u["password"] == user.password:
            return {"message": "Logged in"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# sign up route
@router.post("/signup")
async def root(user: UserInfo):
    email = user.email
    for u in users:
        if u["email"] == email:
            raise HTTPException(status_code=400, detail="Email already registered")
    return {"message": "User created"}
