// SessionNotes.jsx
//
// ASSUMPTION: each session object has { id, date, notes, attendance }.
// Rename fields to match your actual models.py Session fields.

import { useEffect, useState } from "react";
import { getSessionsForStudent, createSession } from "../api";

function SessionNotes({ studentId }) {
  const [sessions, setSessions] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    getSessionsForStudent(studentId)
      .then(setSessions)
      .catch((error) => setErrorMessage(error.message));
  }, [studentId]);

  async function handleAddSession() {
    if (!newNote.trim()) {
      setErrorMessage("Enter a note before saving.");
      return;
    }
    try {
      const created = await createSession({
        student_id: studentId,
        notes: newNote,
        date: new Date().toISOString()
      });
      setSessions((previous) => [...previous, created]);
      setNewNote("");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  if (!studentId) return <p>Select a student to see their sessions.</p>;

  return (
    <div>
      <h2>Session history</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
            {session.date} — {session.notes}
          </li>
        ))}
      </ul>

      <textarea
        value={newNote}
        onChange={(event) => setNewNote(event.target.value)}
        placeholder="Write today's session notes..."
      />
      <button onClick={handleAddSession}>Add session</button>
    </div>
  );
}

export default SessionNotes;
