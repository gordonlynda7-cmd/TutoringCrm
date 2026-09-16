# models.py
#
# Defines the actual database tables: Student and Session.
# Rename/add fields here if your real project needs more detail
# (e.g. a separate LessonProgress table).

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    subject = Column(String, nullable=False)

    sessions = relationship("Session", back_populates="student")


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    notes = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    attended = Column(Boolean, default=True)

    student = relationship("Student", back_populates="sessions")
