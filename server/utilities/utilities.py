from sqlmodel import select
from sqlalchemy.orm import Session
from database.models import UserInfo, Video

# Get user by ID
def get_user_by_id(db: Session, user_id: int) -> UserInfo:
    return db.exec(select(UserInfo).where(UserInfo.user_id == user_id)).first()

# Get user by email
def get_user_by_email(db: Session, email: str) -> UserInfo:
    return db.exec(select(UserInfo).where(UserInfo.email == email)).first()

# Add a new video to a user
def add_video_to_user(db: Session, email: str, video_data: dict) -> Video:
    user = get_user_by_email(db, email)
    if not user:
        raise ValueError("User not found")

    video = Video(user_id=user.user_id, **video_data)
    db.add(video)
    db.commit()
    db.refresh(video)
    return video

# Get all videos for a user
def get_videos_by_user(db: Session, user_id: int):
    return db.exec(select(Video).where(Video.user_id == user_id)).all()

# Get user statistics
def get_user_stats(db: Session, user_id: int) -> dict:
    user = get_user_by_id(db, user_id)
    if not user:
        raise ValueError("User not found")

    videos = get_videos_by_user(db, user.user_id)
    num_of_videos = len(videos)
    total_duration = sum(video.duration for video in videos)

    return {"number_of_videos": num_of_videos, "total_duration": total_duration}

# Remove a user and their videos
def remove_user(db: Session, user_id: int) -> None:
    user = get_user_by_id(db, user_id)
    if not user:
        raise ValueError("User not found")
    
    videos = get_videos_by_user(db, user_id)
    for video in videos:
        db.delete(video)
    
    db.delete(user)
    db.commit()

# Remove a video from a user
def remove_video_from_user(db: Session, video_id: int) -> None:
    video = db.exec(select(Video).where(Video.video_id == video_id)).first()
    if not video:
        raise ValueError("Video not found")
    db.delete(video)
    db.commit()

