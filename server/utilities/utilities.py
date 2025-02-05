from sqlmodel import select
from sqlalchemy.orm import Session
from database.models import User, UserVideos, VideoData

def get_user_by_id(db: Session, user_id: int) -> User:
    return db.exec(select(User).where(User.id == user_id)).first()

def get_video_by_id(db: Session, video_id: int) -> VideoData:
    return db.exec(select(UserVideos).where(UserVideos.id == video_id)).first()

def get_all_videos_by_user_id(db: Session, user_id: int) -> list[UserVideos]:
    return db.exec(select(UserVideos).where(UserVideos.id == user_id)).first()

