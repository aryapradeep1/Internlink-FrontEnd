import React, { useEffect, useState } from "react";

function StudentLogbook({ student, onBack }) {
  const [assignment, setAssignment] = useState(null);
  const [logbooks, setLogbooks] = useState([]);

  const [date, setDate] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [workDone, setWorkDone] = useState("");
  const [learnings, setLearnings] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const REQUIRED_HOURS = 60;

  // =====================================================
  // FETCH STUDENT INTERNSHIP ASSIGNMENT
  // =====================================================

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/internship-assignments/student/${student.id}`
        );

        const data = await response.json();

        if (data.status === "success") {
          setAssignment(data.assignment);
        } else {
          setError("No internship assigned yet.");
        }
      } catch (error) {
        console.error(
          "Error fetching internship:",
          error
        );

        setError(
          "Failed to load internship details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (student?.id) {
      fetchAssignment();
    }
  }, [student?.id]);

  // =====================================================
  // FETCH EXISTING LOGBOOK ENTRIES
  // =====================================================

  useEffect(() => {
    const fetchLogbooks = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/logbook/student/${student.id}`
        );

        const data = await response.json();

        if (data.status === "success") {
          setLogbooks(data.logbooks);
        }
      } catch (error) {
        console.error(
          "Error fetching logbook entries:",
          error
        );
      }
    };

    if (student?.id) {
      fetchLogbooks();
    }
  }, [student?.id]);

  // =====================================================
  // CALCULATE TOTAL INTERNSHIP HOURS
  // =====================================================

  const totalHours = logbooks.reduce(
    (total, entry) =>
      total + Number(entry.hoursWorked || 0),
    0
  );

  const remainingHours = Math.max(
    REQUIRED_HOURS - totalHours,
    0
  );


const progressPercentage =
  (totalHours / REQUIRED_HOURS) * 100;
  // =====================================================
  // SUBMIT LOGBOOK ENTRY
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!assignment) {
      setError(
        "You do not have an internship assigned yet."
      );
      return;
    }

    const internshipId =
      assignment.internship?._id ||
      assignment.internship?.id;

    if (!internshipId) {
      setError(
        "Internship information is missing."
      );
      return;
    }

    if (!hoursWorked || Number(hoursWorked) <= 0) {
      setError(
        "Please enter the number of hours worked."
      );
      return;
    }

    if (Number(hoursWorked) > 24) {
      setError(
        "Hours worked cannot be more than 24 hours."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "http://localhost:5000/api/logbook/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student: student.id,
            internship: internshipId,
            date,
            hoursWorked: Number(hoursWorked),
            workDone,
            learnings,
          }),
        }
      );

      const data = await response.json();

      if (data.status !== "success") {
        setError(
          data.message ||
            "Failed to add logbook entry."
        );
        return;
      }

      setMessage(
        "Logbook entry added successfully!"
      );

      setDate("");
      setHoursWorked("");
      setWorkDone("");
      setLearnings("");

      // Add newly created entry to the list
      setLogbooks((previousEntries) => [
        data.logbook,
        ...previousEntries,
      ]);
    } catch (error) {
      console.error(
        "Add Logbook Error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Loading internship...</h2>
      </div>
    );
  }

  // =====================================================
  // NO INTERNSHIP
  // =====================================================

  if (!assignment) {
    return (
      <div className="dashboard-container">
        <h1>📖 Internship Logbook</h1>

        <h3>
          {error || "No internship assigned yet."}
        </h3>

        <button onClick={onBack}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="dashboard-container">
      <h1>📖 Internship Logbook</h1>

      <h2>
        Welcome, {student?.name}
      </h2>

      {/* =================================================
          STUDENT DETAILS
      ================================================= */}

      <div className="student-info">
        <p>
          <strong>Register Number:</strong>{" "}
          {student?.registerNumber}
        </p>

        <p>
          <strong>Department:</strong>{" "}
          {student?.department}
        </p>
      </div>

      <hr />

      {/* =================================================
          INTERNSHIP DETAILS
      ================================================= */}

      <h3>My Internship</h3>

      <div className="student-info">
        <p>
          <strong>Internship:</strong>{" "}
          {assignment.internship?.title}
        </p>

        <p>
          <strong>Company:</strong>{" "}
          {assignment.company?.companyName}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {assignment.status}
        </p>

        <p>
          <strong>Faculty Guide:</strong>{" "}
          {assignment.facultyGuide
            ? assignment.facultyGuide.name
            : "Not Assigned"}
        </p>
      </div>

      <hr />

      {/* =================================================
          INTERNSHIP HOURS SUMMARY
      ================================================= */}
<h3>⏱️ Internship Hours</h3>

<div className="student-info">
  <p>
    <strong>Minimum Required:</strong>{" "}
    {REQUIRED_HOURS} hours
  </p>

  <p>
    <strong>Completed Hours:</strong>{" "}
    {totalHours} hours
  </p>

  {totalHours >= REQUIRED_HOURS ? (
    <>
      <p style={{ color: "green" }}>
        <strong>Status:</strong>{" "}
        ✅ Minimum Requirement Completed
      </p>

      <p>
        <strong>Extra Hours:</strong>{" "}
        {totalHours - REQUIRED_HOURS} hours
      </p>
    </>
  ) : (
    <p>
      <strong>Remaining Hours:</strong>{" "}
      {remainingHours} hours
    </p>
  )}

  <p>
    <strong>Progress:</strong>{" "}
    {progressPercentage.toFixed(1)}%
  </p>

  <progress
    value={progressPercentage}
    max={progressPercentage > 100 ? progressPercentage : 100}
    style={{
      width: "100%",
      height: "20px",
    }}
  />
</div>
     
      <hr />

      {/* =================================================
          ADD DAILY LOGBOOK ENTRY
      ================================================= */}

      <h3>Add Daily Logbook Entry</h3>

      {message && (
        <p style={{ color: "green" }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* DATE */}

        <div>
          <label>
            <strong>Date</strong>
          </label>

          <br />

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            required
          />
        </div>

        <br />

        {/* HOURS WORKED */}

        <div>
          <label>
            <strong>Hours Worked</strong>
          </label>

          <br />

          <input
            type="number"
            min="0.5"
            max="24"
            step="0.5"
            placeholder="Example: 6"
            value={hoursWorked}
            onChange={(e) =>
              setHoursWorked(e.target.value)
            }
            required
          />

          <p>
            <small>
              Enter the number of hours you worked today.
            </small>
          </p>
        </div>

        <br />

        {/* WORK DONE */}

        <div>
          <label>
            <strong>Work Done</strong>
          </label>

          <br />

          <textarea
            placeholder="Describe the work you completed today..."
            value={workDone}
            onChange={(e) =>
              setWorkDone(e.target.value)
            }
            rows="5"
            required
          />
        </div>

        <br />

        {/* WHAT I LEARNED */}

        <div>
          <label>
            <strong>What I Learned</strong>
          </label>

          <br />

          <textarea
            placeholder="Describe what you learned today..."
            value={learnings}
            onChange={(e) =>
              setLearnings(e.target.value)
            }
            rows="5"
            required
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Submitting..."
            : "➕ Add Logbook Entry"}
        </button>
      </form>

      <hr />

      {/* =================================================
          PREVIOUS LOGBOOK ENTRIES
      ================================================= */}

      <h3>My Previous Entries</h3>

      {logbooks.length === 0 ? (
        <p>
          No logbook entries yet.
        </p>
      ) : (
        logbooks.map((entry) => (
          <div
            key={entry._id}
            className="student-info"
            style={{
              marginBottom: "15px",
            }}
          >
            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                entry.date
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>Hours Worked:</strong>{" "}
              {entry.hoursWorked} hours
            </p>

            <p>
              <strong>Work Done:</strong>{" "}
              {entry.workDone}
            </p>

            <p>
              <strong>What I Learned:</strong>{" "}
              {entry.learnings}
            </p>

            <p>
              <strong>Faculty Status:</strong>{" "}
              {entry.facultyStatus}
            </p>

            <p>
              <strong>Company Guide Status:</strong>{" "}
              {entry.companyGuideStatus}
            </p>
          </div>
        ))
      )}

      <br />

      <button onClick={onBack}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default StudentLogbook;

