# Backend (FastAPI)

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # or pip install fastapi uvicorn[standard] sqlalchemy psycopg2-binary
```

## Running the API

```bash
uvicorn main:app --reload
```

> **Important:** Always run the FastAPI backend using Uvicorn as shown above. Running `python main.py` directly will not work correctly.

## Environment Variables
- Create a `.env` file for secrets (e.g., database URL, API keys)
- Required variables:
  - `DATABASE_URL`: Connection string to your PostgreSQL database
  - `SECRET_KEY`: For JWT token encryption (optional, defaults to a development key)
  - `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time (optional, defaults to 30)

## Database
- Default: PostgreSQL (update connection string in your .env)
- Example: `DATABASE_URL=postgresql://user:password@localhost:5432/skillcrawler`

### Seeding the Database

A comprehensive seed script is provided to populate the database with high-quality educational content:

```bash
python seed_data.py
```

The seed script provides:
- 10 well-researched skills (Data Science, Web Development, Machine Learning, etc.)
- Multiple learning paths for each skill
- 45+ high-quality YouTube videos across all skills
- A test user (Email: `test@example.com`, Password: `password`)

The script is idempotent and will clear existing data before seeding to avoid conflicts.

### Initial Schema (ER Diagram)

```mermaid
erDiagram
    users {
        int id PK
        string email
        string password_hash
        string name
        timestamp created_at
    }
    videos {
        int id PK
        string youtube_id
        string title
        string description
        int duration_seconds
        string quality_score
        int skill_id FK
        string difficulty
        timestamp published_at
    }
    skills {
        int id PK
        string name
        string category
        string description
    }
    learning_paths {
        int id PK
        string name
        string description
        int skill_id FK
        int created_by FK
        timestamp created_at
    }
    learning_path_videos {
        int id PK
        int learning_path_id FK
        int video_id FK
        int order
    }
    user_progress {
        int id PK
        int user_id FK
        int learning_path_id FK
        int video_id FK
        boolean completed
        timestamp completed_at
    }
    users ||--o{ learning_paths : creates
    users ||--o{ user_progress : tracks
    skills ||--o{ videos : contains
    skills ||--o{ learning_paths : organizes
    learning_paths ||--o{ learning_path_videos : sequences
    videos ||--o{ learning_path_videos : included_in
    learning_paths ||--o{ user_progress : progress
    videos ||--o{ user_progress : progress
```

### Table Descriptions
- **users**: Registered users
- **videos**: Video metadata and analysis
- **skills**: Skill categories/topics
- **learning_paths**: Curated learning journeys
- **learning_path_videos**: Sequence of videos in a path
- **user_progress**: Tracks user progress in paths/videos

## Linting
```bash
pip install flake8
flake8 .
```

## Testing
- (Add tests in `tests/` and run with pytest) 