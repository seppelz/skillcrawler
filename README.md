# SkillCrawler Monorepo

SkillCrawler is an AI-powered skill learning aggregator that organizes and sequences video content into structured learning paths.

## Project Structure

```
skillcrawler/
├── backend/   # FastAPI backend (Python)
├── frontend/  # Vite + React + Tailwind CSS frontend
└── ...        # CI/CD, docs, configs
```

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 20.x (recommended)
- npm 9.x or 10.x
- (Optional) nvm for Node version management

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # or pip install fastapi uvicorn[standard] sqlalchemy psycopg2-binary
uvicorn main:app --reload  # Important: Always run using uvicorn, not python main.py
```

### Database Setup
```bash
cd backend
python seed_data.py  # Seeds database with 10 skills, learning paths, and videos
```

After running the seed script, you can login with:
- Email: `test@example.com`
- Password: `password`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Running Both
- Start backend and frontend in separate terminals for local development.

## Features

- **10 Comprehensive Skills**: Data Science, Web Development, Machine Learning, UX Design, Digital Marketing, Project Management, Cloud Computing, Cybersecurity, Data Visualization, and DevOps
- **Multiple Learning Paths**: Each skill has various learning paths for different aspects and difficulty levels
- **High-Quality Videos**: 45+ carefully selected educational YouTube videos with quality scoring
- **User Progress Tracking**: Track completion of videos across learning paths
- **Responsive UI**: Modern React frontend with Tailwind CSS

## CI/CD
- GitHub Actions runs lint/build for both frontend and backend on push/PR to main.

## Contribution
- Please open issues or pull requests for improvements or bug fixes.

--- 