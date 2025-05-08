from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, create_engine, SQLModel
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

connect_args = {}
engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args)

from .models import UserInfo, Video

# Create the database and tables
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Get a session for database operations
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

