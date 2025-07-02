from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Text
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    learning_paths = relationship('LearningPath', back_populates='creator')
    progress = relationship('UserProgress', back_populates='user')

class Skill(Base):
    __tablename__ = 'skills'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    category = Column(String)
    description = Column(Text)
    videos = relationship('Video', back_populates='skill')
    learning_paths = relationship('LearningPath', back_populates='skill')

class Video(Base):
    __tablename__ = 'videos'
    id = Column(Integer, primary_key=True)
    youtube_id = Column(String, unique=True, nullable=False)
    title = Column(String)
    description = Column(Text)
    duration_seconds = Column(Integer)
    quality_score = Column(String)
    skill_id = Column(Integer, ForeignKey('skills.id'))
    difficulty = Column(String)
    published_at = Column(DateTime)
    skill = relationship('Skill', back_populates='videos')
    learning_path_videos = relationship('LearningPathVideo', back_populates='video')
    progress = relationship('UserProgress', back_populates='video')

class LearningPath(Base):
    __tablename__ = 'learning_paths'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    skill_id = Column(Integer, ForeignKey('skills.id'))
    created_by = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    skill = relationship('Skill', back_populates='learning_paths')
    creator = relationship('User', back_populates='learning_paths')
    videos = relationship('LearningPathVideo', back_populates='learning_path')
    progress = relationship('UserProgress', back_populates='learning_path')

class LearningPathVideo(Base):
    __tablename__ = 'learning_path_videos'
    id = Column(Integer, primary_key=True)
    learning_path_id = Column(Integer, ForeignKey('learning_paths.id'))
    video_id = Column(Integer, ForeignKey('videos.id'))
    order = Column(Integer)
    learning_path = relationship('LearningPath', back_populates='videos')
    video = relationship('Video', back_populates='learning_path_videos')

class UserProgress(Base):
    __tablename__ = 'user_progress'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    learning_path_id = Column(Integer, ForeignKey('learning_paths.id'))
    video_id = Column(Integer, ForeignKey('videos.id'))
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime)
    user = relationship('User', back_populates='progress')
    learning_path = relationship('LearningPath', back_populates='progress')
    video = relationship('Video', back_populates='progress') 