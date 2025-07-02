from dotenv import load_dotenv
import os
# Absoluten Pfad zur .env angeben
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=dotenv_path)

print("DATABASE_URL:", os.getenv("DATABASE_URL"))
from fastapi import FastAPI, Depends, HTTPException, status, Query, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from models import Base, User, Video, Skill, LearningPath, UserProgress, LearningPathVideo
from database import engine, get_db
from auth import get_password_hash, authenticate_user, create_access_token, get_current_user
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Any
from datetime import datetime
from youtube import fetch_video_metadata
from sqlalchemy.exc import IntegrityError
import os

# Use Alembic migrations instead of direct schema creation
# Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkillCrawler API", 
              description="AI-powered skill learning aggregator that organizes video content into structured learning paths",
              version="0.1.0",
              docs_url="/docs",
              redoc_url="/redoc")

# Configure CORS
# For development, allow both localhost origins
origins = [
    "http://localhost:5173",  # Default Vite dev server
    "http://127.0.0.1:5173",  # Alternative localhost address
    "http://localhost:3000",   # Next.js default
    "http://127.0.0.1:3000",  # Next.js alternative
    os.getenv("FRONTEND_URL", "http://localhost:5173")  # From environment variable if set
]

# Remove duplicates and None values
origins = list(set(filter(None, origins)))
print(f"CORS enabled for origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Set the CORS origin based on the request's origin
    origin = request.headers.get("origin", "")
    
    # If the origin is in our allowed list, set it in the response header
    if origin in origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
    
    # Handle OPTIONS preflight requests
    if request.method == "OPTIONS":
        # Use the request's origin if it's in our allowed list
        if origin in origins:
            return Response(
                status_code=200,
                headers={
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Credentials": "true", 
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
                    "Access-Control-Max-Age": "86400",  # Cache preflight for 24 hours
                }
            )
    
    return response

class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: str
    name: Optional[str]
    class Config:
        orm_mode = True

class VideoIn(BaseModel):
    youtube_id: str

class VideoOut(BaseModel):
    id: int
    youtube_id: str
    title: str
    description: str
    duration_seconds: int | None = None
    published_at: str | None = None
    class Config:
        orm_mode = True

class SkillIn(BaseModel):
    name: str
    category: str | None = None
    description: str | None = None

class SkillOut(BaseModel):
    id: int
    name: str
    category: str | None = None
    description: str | None = None
    class Config:
        from_attributes = True

class LearningPathIn(BaseModel):
    name: str
    description: str | None = None
    skill_id: int

class LearningPathOut(BaseModel):
    id: int
    name: str
    description: str | None = None
    skill_id: int
    created_by: int
    created_at: str | datetime
    
    @field_validator('created_at')
    def validate_created_at(cls, v):
        if isinstance(v, datetime):
            return v.isoformat()
        return v
        
    class Config:
        from_attributes = True
        
class ProgressUpdate(BaseModel):
    video_id: int
    completed: bool = True
    
class UserProgressOut(BaseModel):
    id: int
    user_id: int
    learning_path_id: int
    video_id: int
    completed: bool
    completed_at: datetime | None = None
    class Config:
        from_attributes = True
        
class LearningPathVideoIn(BaseModel):
    video_id: int
    order: int
    
class LearningPathVideoOut(BaseModel):
    id: int
    learning_path_id: int
    video_id: int
    order: int
    video: VideoOut
    class Config:
        from_attributes = True

@app.post('/register', response_model=UserOut, tags=['Authentication'], summary="Register a new user")
def register(user: UserCreate, db: Session = Depends(get_db)):
    print(f"[DEBUG] Registration attempt with email: {user.email}")
    
    try:
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            print(f"[DEBUG] Registration failed: Email {user.email} already registered")
            raise HTTPException(status_code=400, detail='Email already registered')
        
        # Create new user
        hashed_pw = get_password_hash(user.password)
        db_user = User(email=user.email, password_hash=hashed_pw, name=user.name)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        print(f"[DEBUG] Registration successful for user: {db_user.id} ({db_user.email})")
        return db_user
    except Exception as e:
        print(f"[ERROR] Registration exception: {str(e)}")
        db.rollback()
        raise

@app.post('/token', tags=['Authentication'], summary="Login and get access token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail='Incorrect email or password')
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get('/me', response_model=UserOut, tags=['Authentication'], summary="Get current user profile")
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.post('/videos/fetch', response_model=VideoOut, tags=['Videos'], summary="Fetch and store video metadata from YouTube")
def fetch_and_store_video(video_in: VideoIn, db: Session = Depends(get_db)):
    # Check if video already exists
    db_video = db.query(Video).filter(Video.youtube_id == video_in.youtube_id).first()
    if db_video:
        return db_video
    # Fetch from YouTube
    meta = fetch_video_metadata(video_in.youtube_id)
    if not meta:
        raise HTTPException(status_code=404, detail='Video not found or API error')
    # Parse ISO 8601 duration to seconds
    import isodate
    try:
        duration_seconds = int(isodate.parse_duration(meta['duration']).total_seconds())
    except Exception:
        duration_seconds = None
    db_video = Video(
        youtube_id=meta['youtube_id'],
        title=meta['title'],
        description=meta['description'],
        duration_seconds=duration_seconds,
        published_at=meta['published_at']
    )
    db.add(db_video)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail='Video already exists')
    db.refresh(db_video)
    return db_video

@app.get('/skills', response_model=list[SkillOut], tags=['Skills'], summary="List all available skills")
def list_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()

@app.post('/skills', response_model=SkillOut, tags=['Skills'], summary="Create a new skill")
def create_skill(skill: SkillIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    db_skill = Skill(name=skill.name, category=skill.category, description=skill.description)
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@app.get('/learning-paths', response_model=list[LearningPathOut], tags=['Learning Paths'], summary="List all learning paths")
def list_learning_paths(db: Session = Depends(get_db)):
    return db.query(LearningPath).all()

@app.post('/learning-paths', response_model=LearningPathOut, tags=['Learning Paths'], summary="Create a new learning path")
def create_learning_path(lp: LearningPathIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    db_lp = LearningPath(name=lp.name, description=lp.description, skill_id=lp.skill_id, created_by=user.id)
    db.add(db_lp)
    db.commit()
    db.refresh(db_lp)
    return db_lp

@app.post('/learning-paths/{learning_path_id}/videos', response_model=LearningPathVideoOut, tags=['Learning Paths'], summary="Add video to learning path")
def add_video_to_learning_path(
    learning_path_id: int, 
    video_data: LearningPathVideoIn, 
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    # Check if learning path exists and belongs to user
    learning_path = db.query(LearningPath).filter(LearningPath.id == learning_path_id).first()
    if not learning_path:
        raise HTTPException(status_code=404, detail="Learning path not found")
    if learning_path.created_by != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this learning path")
    
    # Check if video exists
    video = db.query(Video).filter(Video.id == video_data.video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Add video to learning path
    db_lp_video = LearningPathVideo(
        learning_path_id=learning_path_id,
        video_id=video_data.video_id,
        order=video_data.order
    )
    db.add(db_lp_video)
    try:
        db.commit()
        db.refresh(db_lp_video)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Video already exists in this learning path")
    
    # Return with video data included
    return db_lp_video

@app.get('/learning-paths/{learning_path_id}/videos', response_model=List[LearningPathVideoOut], tags=['Learning Paths'], summary="Get videos in a learning path")
def get_learning_path_videos(learning_path_id: int, db: Session = Depends(get_db)):
    videos = db.query(LearningPathVideo).filter(LearningPathVideo.learning_path_id == learning_path_id).order_by(LearningPathVideo.order).all()
    return videos

@app.post('/progress', response_model=UserProgressOut, tags=['Progress'], summary="Update user progress on a video")
def update_progress(
    progress: ProgressUpdate, 
    learning_path_id: int = Query(..., description="ID of the learning path"),
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    # Check if learning path exists
    learning_path = db.query(LearningPath).filter(LearningPath.id == learning_path_id).first()
    if not learning_path:
        raise HTTPException(status_code=404, detail="Learning path not found")
        
    # Check if video exists and is part of learning path
    learning_path_video = db.query(LearningPathVideo).filter(
        LearningPathVideo.learning_path_id == learning_path_id,
        LearningPathVideo.video_id == progress.video_id
    ).first()
    if not learning_path_video:
        raise HTTPException(status_code=404, detail="Video not found in this learning path")
    
    # Update or create progress record
    user_progress = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.learning_path_id == learning_path_id,
        UserProgress.video_id == progress.video_id
    ).first()
    
    if user_progress:
        # Update existing progress
        user_progress.completed = progress.completed
        if progress.completed:
            user_progress.completed_at = datetime.utcnow()
        else:
            user_progress.completed_at = None
    else:
        # Create new progress record
        user_progress = UserProgress(
            user_id=user.id,
            learning_path_id=learning_path_id,
            video_id=progress.video_id,
            completed=progress.completed,
            completed_at=datetime.utcnow() if progress.completed else None
        )
        db.add(user_progress)
    
    db.commit()
    db.refresh(user_progress)
    return user_progress

@app.get('/progress/{learning_path_id}', response_model=List[UserProgressOut], tags=['Progress'], summary="Get user progress for a learning path")
def get_progress(
    learning_path_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Check if learning path exists
    learning_path = db.query(LearningPath).filter(LearningPath.id == learning_path_id).first()
    if not learning_path:
        raise HTTPException(status_code=404, detail="Learning path not found")
        
    # Get all progress records for this user and learning path
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.learning_path_id == learning_path_id
    ).all()
    
    return progress 