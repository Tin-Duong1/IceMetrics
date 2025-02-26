from typing import Annotated, Optional
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select, Column, Relationship

class UserInfo(SQLModel, table=True):
    user_id: int = Field(primary_key=True)
    name : str = Field(max_length=255)
    email: str = Field(max_length=255)
    password: str = Field(max_length=255)
    videos: list["VideoStatistics"] = Relationship(back_populates="user")

class VideoStatistics(SQLModel, table=True):
    video_id: int = Field(primary_key=True)
    title: str = Field(max_length=255)
    description: str = Field(max_length=255)
    user_id : int = Field(foreign_key="userinfo.user_id")
    user : UserInfo = Relationship(back_populates="videos")
    
    