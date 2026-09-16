# main.py
#
# The entry point of the backend. Defines every API route the
# frontend talks to: creating/listing students, creating/listing
# sessions, and the natural-language search over session notes.

import os

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session as DBSession

import models
import schemas
from database import engine, get_db
from rag_search import search_session_notes, keyword_search_session_notes

# Creates all tables defined in models.py if they don't already exist.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tutoring CRM")

# Allows the React frontend (running on a different port) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/students", response_model=list[schemas.StudentOut])
def list_students(db: DBSession = Depends(get_db)):
    """Returns every student in the database."""
    return db.query(models.Student).all()


@app.post("/students", response_model=schemas.StudentOut)
def create_student(student: schemas.StudentCreate, db: DBSession = Depends(get_db)):
    """Adds a new student to the database."""
    new_student = models.Student(name=student.name, subject=student.subject)
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student


@app.get("/students/{student_id}/sessions", response_model=list[schemas.SessionOut])
def get_sessions_for_student(student_id: int, db: DBSession = Depends(get_db)):
    """Returns every session logged for a specific student."""
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return db.query(models.Session).filter(models.Session.student_id == student_id).all()


@app.post("/sessions", response_model=schemas.SessionOut)
def create_session(session: schemas.SessionCreate, db: DBSession = Depends(get_db)):
    """Logs a new tutoring session for a student."""
    new_session = models.Session(
        student_id=session.student_id,
        notes=session.notes,
        attended=session.attended,
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session


@app.post("/sessions/search", response_model=list[schemas.SearchResult])
def search_notes(query: schemas.SearchQuery, db: DBSession = Depends(get_db)):
    """
    Searches all session notes for the ones most relevant to a natural
    language query. Uses OpenAI embeddings when OPENAI_API_KEY is set;
    otherwise falls back to simple keyword overlap scoring so the demo
    keeps working without an API key.
    """
    if os.environ.get("OPENAI_API_KEY"):
        results = search_session_notes(query.text, db, models.Session, top_k=query.top_k)
    else:
        results = keyword_search_session_notes(query.text, db, models.Session, top_k=query.top_k)

    return [
        schemas.SearchResult(
            session_id=session_record.id,
            student_id=session_record.student_id,
            notes=session_record.notes or "",
            similarity_score=round(score, 4),
        )
        for session_record, score in results
    ]
