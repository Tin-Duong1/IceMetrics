from sqlmodel import select
from sqlalchemy.orm import Session
from database.models import UserInfo

def get_user_by_id(db: Session, user_id: int) -> UserInfo:
    return db.exec(select(UserInfo).where(UserInfo.id == user_id)).first()

def get_user_by_email(db: Session, email: str) -> UserInfo:
    return db.exec(select(UserInfo).where(UserInfo.email == email)).first()

