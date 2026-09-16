# rag_search.py
#
# ASSUMPTIONS TO CHECK AGAINST YOUR REAL SCHEMA:
# - You have a SQLAlchemy model called "Session" (in models.py) with fields:
#     id (int), student_id (int), notes (str), date (date/datetime)
# - Rename SessionModel / field names below to match your actual models.py
#
# This uses OpenAI's embeddings API. Set OPENAI_API_KEY as an environment
# variable before running (never hardcode the key in this file).

import os
import numpy as np
from openai import OpenAI
from sqlalchemy.orm import Session as DBSession

EMBEDDING_MODEL = "text-embedding-3-small"

_client = None


def _get_client() -> OpenAI:
    """
    Creates the OpenAI client only the first time it's actually needed,
    instead of when this file is imported. This means the rest of the
    backend can start up fine even if OPENAI_API_KEY isn't set yet -
    you'll only get an error when a search is actually attempted.
    """
    global _client
    if _client is None:
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "OPENAI_API_KEY is not set. Set it as an environment "
                "variable before using the search feature."
            )
        _client = OpenAI(api_key=api_key)
    return _client


def get_embedding(text: str) -> list[float]:
    """
    Converts a piece of text into an embedding vector using OpenAI's API.
    Embeddings are numeric representations of meaning, so texts with
    similar meaning end up with similar vectors.
    """
    response = _get_client().embeddings.create(
        model=EMBEDDING_MODEL,
        input=text
    )
    return response.data[0].embedding


def cosine_similarity(vector_a: list[float], vector_b: list[float]) -> float:
    """
    Measures how similar two embedding vectors are, from -1 (opposite)
    to 1 (identical direction). This is the standard way to compare
    embeddings for semantic search.
    """
    a = np.array(vector_a)
    b = np.array(vector_b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def search_session_notes(query: str, db: DBSession, session_model, top_k: int = 5):
    """
    Searches all session notes in the database for the ones most
    semantically relevant to the given natural language query.

    Parameters:
        query: the natural language search text, e.g. "struggled with fractions"
        db: an active SQLAlchemy database session
        session_model: your SQLAlchemy Session model class (imported from models.py)
        top_k: how many top matching results to return

    Returns:
        A list of (session_record, similarity_score) tuples, sorted by
        relevance, most relevant first.
    """
    query_embedding = get_embedding(query)

    all_sessions = db.query(session_model).all()

    scored_sessions = []
    for session_record in all_sessions:
        # NOTE: change session_record.notes if your notes field is named differently
        if not session_record.notes:
            continue
        note_embedding = get_embedding(session_record.notes)
        similarity_score = cosine_similarity(query_embedding, note_embedding)
        scored_sessions.append((session_record, similarity_score))

    scored_sessions.sort(key=lambda pair: pair[1], reverse=True)
    return scored_sessions[:top_k]
