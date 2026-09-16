// StudentList.jsx
//
// ASSUMPTION: each student object has { id, name, subject } fields.
// Rename these to match your actual models.py / schemas.py Student fields.

import { useEffect, useState } from "react";
import { getStudents } from "../api";

function StudentList({ onSelectStudent }) {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    getStudents()
      .then(setStudents)
      .catch((error) => setErrorMessage(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p>Loading students...</p>;
  if (errorMessage) return <p>Error: {errorMessage}</p>;

  return (
    <div>
      <h2>Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <button onClick={() => onSelectStudent(student.id)}>
              {student.name} — {student.subject}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentList;
