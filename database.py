# database.py
#
# Sets up the connection to the SQLite database file and provides
# the tools SQLAlchemy needs to talk to it: an engine, a session
# factory, and a Base class that all models inherit from.

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./tutoring_crm.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    Provides a database session for each request, and makes sure it
    always gets closed afterward, even if an error happens.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
