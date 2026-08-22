from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Event(BaseModel):
    name: str
    description: str
    date: str
    time: str
    organizer: str

# In-memory event list
EVENTS = [
    Event(name="Tech Talk", description="A talk on AI trends.", date="2025-08-10", time="10:00", organizer="FOCES"),
    Event(name="Workshop", description="React workshop.", date="2025-08-15", time="14:00", organizer="FOCES"),
    Event(name="Hackathon", description="24h coding event.", date="2025-09-01", time="09:00", organizer="FOCES"),
    Event(name="Seminar", description="Cybersecurity basics.", date="2025-09-10", time="11:00", organizer="FOCES"),
    Event(name="Meetup", description="Monthly meetup.", date="2025-09-20", time="16:00", organizer="FOCES"),
]

@app.get("/events", response_model=List[Event])
def get_events():
    return EVENTS

@app.post("/events", response_model=Event)
def add_event(event: Event):
    EVENTS.append(event)
    return event
