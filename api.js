// api.js
//
// ASSUMPTION: your FastAPI backend runs at http://localhost:8000
// and has endpoints like /students, /sessions, /sessions/search
// Rename these paths to match your actual main.py routes.

const BASE_URL = "http://localhost:8000";

export async function getStudents() {
  const response = await fetch(`${BASE_URL}/students`);
  if (!response.ok) throw new Error("Failed to fetch students");
  return response.json();
}

export async function getSessionsForStudent(studentId) {
  const response = await fetch(`${BASE_URL}/students/${studentId}/sessions`);
  if (!response.ok) throw new Error("Failed to fetch sessions");
  return response.json();
}

export async function createSession(sessionData) {
  const response = await fetch(`${BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sessionData)
  });
  if (!response.ok) throw new Error("Failed to create session");
  return response.json();
}

export async function searchSessionNotes(queryText, topK = 5) {
  const response = await fetch(`${BASE_URL}/sessions/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: queryText, top_k: topK })
  });
  if (!response.ok) throw new Error("Search request failed");
  return response.json();
}
