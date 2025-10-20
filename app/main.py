from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import init_db

from app.routers import patients, plans, events, summary

app = FastAPI(title="Antiamyloid Therapy Tracker", version="0.1.0")

app.include_router(patients.router, prefix="/patients", tags=["patients"])
app.include_router(plans.router, prefix="/plans", tags=["plans"])
app.include_router(events.router, prefix="/events", tags=["events"])
app.include_router(summary.router, prefix="/summary", tags=["summary"])


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/")
def root():
    return {"status": "ok", "service": "antiamyloid-tracker"}


# Allow local dev frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
