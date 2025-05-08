from typing import Annotated, Optional, List  # Import List for type hinting
from datetime import datetime
from sqlalchemy import JSON  # Add this import

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select, Column, Relationship

# Define the UserInfo model
class UserInfo(SQLModel, table=True):
    user_id: int = Field(primary_key=True)
    name : str = Field(max_length=255)
    email: str = Field(max_length=255)
    password: str = Field(max_length=255)
    videos: List["Video"] = Relationship(back_populates="user")

# Define the Video model
class Video(SQLModel, table=True):
    
    # Basic video information
    video_id: int = Field(primary_key=True)
    name: str = Field(max_length=255)
    datetime_uploaded: datetime = Field(default_factory=datetime.utcnow)
    duration: int = Field()

    # Time in seconds in each zone
    left_side_time: Optional[float] = Field(default=0.0)
    right_side_time: Optional[float] = Field(default=0.0)
    middle_zone_time: Optional[float] = Field(default=0.0)

    # Percentage of time spent in each zone
    left_side_percentage: Optional[float] = Field(default=0.0)
    right_side_percentage: Optional[float] = Field(default=0.0)
    middle_zone_percentage: Optional[float] = Field(default=0.0)

    # OpenAI summary of the video
    summary: Optional[str] = Field(default=None)

    # Average number of players per second
    average_players_per_second: Optional[List[float]] = Field(default=None, sa_column=Column(JSON))

    # Foreign key to userinfo table
    user_id: int = Field(foreign_key="userinfo.user_id")
    user: UserInfo = Relationship(back_populates="videos")
