from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, create_engine, SQLModel
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

connect_args = {}
engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args)

# Import your models here
from .models import UserInfo

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    

def get_session():
    with Session(engine) as session:
        yield session
        
def get_user_by_email(email: str):
    with Session(engine) as session:
        return UserInfo.get_user_by_email(session, email)

SessionDep = Annotated[Session, Depends(get_session)]

