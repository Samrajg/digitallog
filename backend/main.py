from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, auth, database
from .database import engine, get_db

from .routes import auth as auth_routes, entries, qr

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Digital Log API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(entries.router)
app.include_router(qr.router)

@app.get("/")
def read_root():
    return {"message": "Digital Log API is running"}

# TODO: Add authentication and log routes
