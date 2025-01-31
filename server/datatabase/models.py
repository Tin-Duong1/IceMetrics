from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select, Column, LargeBinary

class User(SQLModel, table=True):
    user_id: int = Field(primary_key=True)
    name : str = Field(max_length=255)
    email: str = Field(max_length=255)
    hashed_password: str = Field(max_length=255)
    
    
class UserVideos(SQLModel, table=True):
    img_id: int = Field(primary_key=True)
    video: bytes = Field(sa_column=Column(LargeBinary))
    user_id: int = Field(foreign_key="user.id")