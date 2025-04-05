from typing import Annotated, Optional, List  # Import List for type hinting
from datetime import datetime
from sqlalchemy import JSON  # Add this import

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
    name: str = Field(max_length=255)
    datetime_uploaded: datetime = Field(default_factory=datetime.utcnow)
    duration: int = Field()  # Duration in seconds
    left_side_time: Optional[float] = Field(default=0.0)  # Time spent on left side in seconds
    right_side_time: Optional[float] = Field(default=0.0)  # Time spent on right side in seconds
    left_side_percentage: Optional[float] = Field(default=0.0)  # Percentage of time on left side
    right_side_percentage: Optional[float] = Field(default=0.0)  # Percentage of time on right side
    summary: Optional[str] = Field(default=None)  # Summary of the video
    average_players_per_second: Optional[List[float]] = Field(default=None, sa_column=Column(JSON))
    user_id: int = Field(foreign_key="userinfo.user_id")
    user: UserInfo = Relationship(back_populates="videos")
