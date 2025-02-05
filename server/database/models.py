from typing import Annotated, Optional
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select, Column, LargeBinary

class UserInfo(SQLModel, table=True):
    user_id: int = Field(primary_key=True)
    name : str = Field(max_length=255)
    email: str = Field(max_length=255)
    hashed_password: str = Field(max_length=255)
