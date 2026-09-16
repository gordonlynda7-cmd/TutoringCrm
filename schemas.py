# schemas.py
#
# Pydantic models define what valid request/response data looks like.
# FastAPI uses these to validate incoming data and format outgoing data.

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class StudentCreate(BaseModel):
    name: str
    subject: str


class StudentOut(BaseModel):
    id: int
    name: str
    subject: str

    class Config:
        from_attributes = True


class SessionCreate(BaseModel):
    student_id: int
    notes: Optional[str] = None
    attended: bool = True


class SessionOut(BaseModel):
    id: int
    student_id: int
    notes: Optional[str]
    date: datetime
    attended: bool

    class Config:
        from_attributes = True


class SearchQuery(BaseModel):
    text: str
    top_k: int = 5


class SearchResult(BaseModel):
    session_id: int
    student_id: int
    notes: str
    similarity_score: float
