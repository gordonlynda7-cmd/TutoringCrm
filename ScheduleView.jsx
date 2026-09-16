// ScheduleView.jsx
//
// A weekly calendar view of tutoring sessions, modeled after the
// iD Tech admin schedule but restyled for this CRM. Click a session
// block to see its details in a modal.
//
// ASSUMPTION: each session object looks like:
// { id, studentName, subject, startTime, endTime, day, notes }
// Replace the SAMPLE_SESSIONS data below with a real fetch from your
// backend (e.g. getSessionsForWeek() in api.js) once that endpoint exists.

import { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 9); // 9am - 8pm

const SAMPLE_SESSIONS = [
  { id: 1, studentName: "Student A", subject: "Algebra II", day: 1, startHour: 16, endHour: 17, notes: "Reviewed quadratic equations, needs more practice with factoring." },
  { id: 2, studentName: "Student B", subject: "Python Basics", day: 2, startHour: 18, endHour: 19, notes: "Covered loops and conditionals. Confident with syntax." },
  { id: 3, studentName: "Student C", subject: "Chemistry", day: 4, startHour: 15, endHour: 16, notes: "Struggled with stoichiometry, plan to revisit next session." }
];

function ScheduleView({ sessions = SAMPLE_SESSIONS }) {
  const [selectedSession, setSelectedSession] = useState(null);

  function getSessionsFor(dayIndex, hour) {
    return sessions.filter((s) => s.day === dayIndex && s.startHour === hour);
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", color: "#2b2620" }}>
      <h2 style={{ fontWeight: 500, marginBottom: "0.5rem" }}>This week's sessions</h2>

      <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", border: "1px solid #ded7c9" }}>
        <div style={{ background: "#f4f1ea" }}></div>
        {DAYS.map((day) => (
          <div key={day} style={{ background: "#f4f1ea", padding: "8px", textAlign: "center", fontSize: "13px", fontWeight: 500, borderLeft: "1px solid #ded7c9" }}>
            {day}
          </div>
        ))}

        {HOURS.map((hour) => (
          <>
            <div key={`label-${hour}`} style={{ fontSize: "12px", color: "#8a8272", padding: "6px 4px", borderTop: "1px solid #ede8dc" }}>
              {hour > 12 ? hour - 12 : hour}{hour >= 12 ? "pm" : "am"}
            </div>
            {DAYS.map((_, dayIndex) => {
              const cellSessions = getSessionsFor(dayIndex, hour);
              return (
                <div
                  key={`${dayIndex}-${hour}`}
                  style={{ minHeight: "44px", borderTop: "1px solid #ede8dc", borderLeft: "1px solid #ede8dc", padding: "2px" }}
                >
                  {cellSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      style={{
                        width: "100%",
                        background: "#c96f4a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 6px",
                        fontSize: "12px",
                        textAlign: "left",
                        cursor: "pointer"
                      }}
                    >
                      {session.studentName} — {session.subject}
                    </button>
                  ))}
                </div>
              );
            })}
          </>
        ))}
      </div>

      {selectedSession && (
        <div
          role="dialog"
          aria-label="Session detail"
          style={{
            position: "fixed", inset: 0, background: "rgba(43,38,32,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
          onClick={() => setSelectedSession(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: "8px", padding: "24px", width: "360px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
          >
            <h3 style={{ marginTop: 0 }}>{selectedSession.studentName}</h3>
            <p style={{ margin: "4px 0", color: "#5f584c" }}>{selectedSession.subject}</p>
            <p style={{ margin: "4px 0", fontSize: "14px" }}>
              {selectedSession.startHour}:00 – {selectedSession.endHour}:00
            </p>
            <hr style={{ border: "none", borderTop: "1px solid #ede8dc", margin: "12px 0" }} />
            <p style={{ fontSize: "14px", lineHeight: 1.6 }}>{selectedSession.notes}</p>
            <button
              onClick={() => setSelectedSession(null)}
              style={{ marginTop: "12px", background: "none", border: "1px solid #ded7c9", borderRadius: "4px", padding: "6px 14px", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleView;
