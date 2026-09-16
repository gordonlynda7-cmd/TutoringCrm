import { useState } from "react";
import StudentList from "./components/StudentList";
import SessionNotes from "./components/SessionNotes";
import ScheduleView from "./components/ScheduleView";
import ChatBox from "./components/ChatBox";

const TABS = ["Students", "Schedule", "Search notes"];

function App() {
  const [activeTab, setActiveTab] = useState("Students");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  return (
    <div style={{ fontFamily: "'Georgia', serif", color: "#2b2620", maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ marginBottom: "4px" }}>Tutoring CRM</h1>
      <p style={{ marginTop: 0, color: "#5f584c" }}>Students, sessions, and session-note search in one place.</p>

      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #ded7c9", marginBottom: "20px" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid #c96f4a" : "2px solid transparent",
              background: "none",
              fontFamily: "inherit",
              fontSize: "14px",
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? "#2b2620" : "#8a8272",
              cursor: "pointer"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Students" && (
        <div style={{ display: "flex", gap: "32px" }}>
          <div style={{ flex: 1 }}>
            <StudentList onSelectStudent={setSelectedStudentId} />
          </div>
          <div style={{ flex: 2 }}>
            <SessionNotes studentId={selectedStudentId} />
          </div>
        </div>
      )}

      {activeTab === "Schedule" && <ScheduleView />}

      {activeTab === "Search notes" && <ChatBox />}
    </div>
  );
}

export default App;
