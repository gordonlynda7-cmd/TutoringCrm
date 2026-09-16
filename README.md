# Tutoring CRM

A full-stack CRM for tracking tutoring students, sessions, and session notes, with a natural-language search feature over past notes.

## Stack
- Backend: FastAPI + SQLAlchemy + SQLite
- Frontend: React (Vite)
- Search: OpenAI embeddings when `OPENAI_API_KEY` is set, otherwise a keyword-overlap fallback so the feature still works without an API key

## Running the backend

```
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Runs at http://localhost:8000. Interactive API docs at http://localhost:8000/docs.

To enable semantic search instead of the keyword fallback:

```
export OPENAI_API_KEY=your-key-here
```

## Running the frontend

```
npm install
npm run dev
```

Runs at http://localhost:5173 and talks to the backend at localhost:8000.

## Features
- Add students and view them in a list
- Log session notes per student and view session history
- Weekly schedule view (currently sample data, not yet wired to a backend endpoint)
- Search past session notes by natural language query, in a chat-style interface
