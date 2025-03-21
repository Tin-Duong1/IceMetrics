from typing import Annotated, Optional, List  # Import List for type hinting
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select, Column, Relationship

class UserInfo(SQLModel, table=True):
    user_id: int = Field(primary_key=True)
    name : str = Field(max_length=255)
    email: str = Field(max_length=255)
    password: str = Field(max_length=255)
    videos: List["Video"] = Relationship(back_populates="user")

class Video(SQLModel, table=True):
    video_id: int = Field(primary_key=True)
    name: str = Field(max_length=255)  # Add the name field
    datetime_uploaded: datetime = Field(default_factory=datetime.utcnow)
    duration: int = Field()  # Duration in seconds
    user_id: int = Field(foreign_key="userinfo.user_id")
    user: UserInfo = Relationship(back_populates="videos")

