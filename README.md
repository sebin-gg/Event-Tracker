# Event Tracker

This is a full-stack event management app built for tracking and managing events. It was originally created for the FOCES Volunteer Project 2025-26, but is now named Event Tracker.

## Tech Stack
- **Backend:** FastAPI (Python)
- **Frontend:** React + Tailwind CSS

## Features
- List events (name, description, date, time, organizer)
- Add new events (form)
- Responsive UI with Tailwind
- Search filter
- Modal for event details
- Dark mode toggle
- Loading, error, and empty states

## How to Run

### Backend (FastAPI)
1. Open terminal in `backend` folder
2. Create and activate virtual environment:
   ```pwsh
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```
3. Start server:
   ```pwsh
   uvicorn main:app --reload
   ```
   - API available at `http://localhost:8000/events`

### Frontend (React)
1. Open terminal in `frontend` folder
2. Install dependencies:
   ```pwsh
   npm install
   ```
3. Start React app:
   ```pwsh
   npm start
   ```
   - App available at `http://localhost:3000`

## Project Structure
```
focess/
├── backend/
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── tailwind.config.js
```

## Deployment
You can deploy the backend on platforms like Heroku, Render, or Railway. The frontend can be deployed on Vercel or Netlify.

## Author
- Sebin GG

---

For any issues, open an issue on the GitHub repo.
