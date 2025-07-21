# Event Tracker - Project Documentation

---

## Overview
This project is a full-stack web application for managing and displaying events. It uses FastAPI for the backend and React with Tailwind CSS for the frontend. The app is named **Event Tracker**.

---

## Technologies Used
- **Backend:** FastAPI (Python)
- **Frontend:** React (JavaScript)
- **Styling:** Tailwind CSS
- **API:** REST (GET/POST)
- **State Management:** React Hooks
- **Other:** CORS Middleware, Pydantic Models

---

## Features
- List events (name, description, date, time, organizer)
- Add new events via form
- Responsive UI with Tailwind
- Search filter for events
- Modal for event details
- Dark mode toggle
- Loading, error, and empty states

---

## Folder Structure
```text
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

---

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

---

## How It Works
- The backend exposes `/events` endpoints for GET (list events) and POST (add event).
- The frontend fetches events from the backend and displays them in cards.
- Users can add new events using the form.
- Search, modal, and dark mode features enhance usability.

---

## Deployment
- Backend: Deploy on Heroku, Render, or Railway.
- Frontend: Deploy on Vercel or Netlify.

---

## Author
Sebin GG

---

## GitHub Repository
https://github.com/sebin-gg/foccestask

---

## Screenshots
(Add screenshots of the running app here if required)

---

## License
MIT (or specify your license)

---

## Notes
- For any issues, open an issue on the GitHub repo.
- For PDF submission, convert this document to PDF using any Markdown-to-PDF tool or print as PDF.
