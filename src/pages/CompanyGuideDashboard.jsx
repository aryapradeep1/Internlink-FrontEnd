import { useEffect, useState } from "react";

function CompanyGuideDashboard({ guide, onLogout }) {
  const [assignments, setAssignments] = useState([]);
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ==========================================
  // FETCH ASSIGNED STUDENTS
  // ==========================================

  const fetchAssignments = async () => {
    try {
      const guideId = guide?.id || guide?._id;

      if (!guideId) {
        setMessage("Company Guide information not found.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/internship-assignments/company-guide/${guideId}`
      );

      const data = await response.json();

      if (data.status === "success") {
        setAssignments(data.assignments || []);
      } else {
        setMessage(
          data.message || "Failed to load assigned internships"
        );
      }

      setLoading(false);
    } catch (error) {
      console.error(
        "Fetch Company Guide Assignments Error:",
        error
      );

      setMessage("Unable to connect to server");
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH LOGBOOKS
  // ==========================================

  const fetchLogbooks = async () => {
    try {
      const guideId = guide?.id || guide?._id;

      if (!guideId) {
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/logbook/company-guide/${guideId}`
      );

      const data = await response.json();

      if (response.ok) {
        setLogbooks(data);
      } else {
        setMessage(
          data.message || "Failed to load logbooks"
        );
      }
    } catch (error) {
      console.error(
        "Fetch Company Guide Logbooks Error:",
        error
      );

      setMessage("Unable to load logbooks");
    }
  };

  // ==========================================
  // COMPANY GUIDE APPROVE LOGBOOK
  // ==========================================

  const approveLogbook = async (logbookId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/logbook/company-guide/approve/${logbookId}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Logbook approved successfully.");

        await fetchLogbooks();
      } else {
        setMessage(
          data.message || "Failed to approve logbook."
        );
      }
    } catch (error) {
      console.error(
        "Approve Logbook Error:",
        error
      );

      setMessage("Unable to approve logbook.");
    }
  };

  // ==========================================
  // COMPANY GUIDE REJECT LOGBOOK
  // ==========================================

  const rejectLogbook = async (logbookId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/logbook/company-guide/reject/${logbookId}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Logbook rejected.");

        await fetchLogbooks();
      } else {
        setMessage(
          data.message || "Failed to reject logbook."
        );
      }
    } catch (error) {
      console.error(
        "Reject Logbook Error:",
        error
      );

      setMessage("Unable to reject logbook.");
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    fetchAssignments();
    fetchLogbooks();
  }, [guide]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="company-guide-dashboard">
        <h2>Company Guide Dashboard</h2>
        <p>Loading...</p>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="company-guide-dashboard">

      {/* ======================================
          HEADER
      ====================================== */}

      <h1>Company Guide Dashboard</h1>

      <h2>
        Welcome, {guide?.name || "Company Guide"}
      </h2>

      <p>
        <strong>Email:</strong>{" "}
        {guide?.email || "N/A"}
      </p>

      <p>
        <strong>Employee ID:</strong>{" "}
        {guide?.employeeId || "N/A"}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {guide?.status || "Approved"}
      </p>

      <button onClick={onLogout}>
        Logout
      </button>

      {/* ======================================
          MESSAGE
      ====================================== */}

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      <hr />

      {/* ======================================
          ASSIGNED INTERNSHIP STUDENTS
      ====================================== */}

      <h2>Assigned Internship Students</h2>

      {assignments.length === 0 ? (
        <p>No students assigned yet.</p>
      ) : (
        assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="assignment-card"
          >

            {/* ================================
                STUDENT INFORMATION
            ================================= */}

            <h3>Student Information</h3>

            <p>
              <strong>Name:</strong>{" "}
              {assignment.student?.name || "N/A"}
            </p>

            <p>
              <strong>Register Number:</strong>{" "}
              {assignment.student?.registerNumber || "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {assignment.student?.email || "N/A"}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {assignment.student?.department || "N/A"}
            </p>

            <p>
              <strong>Semester:</strong>{" "}
              {assignment.student?.semester || "N/A"}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {assignment.student?.phone || "N/A"}
            </p>

            {/* ================================
                INTERNSHIP INFORMATION
            ================================= */}

            <h3>Internship Information</h3>

            <p>
              <strong>Internship:</strong>{" "}
              {assignment.internship?.title || "N/A"}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {assignment.internship?.duration || "N/A"}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {assignment.internship?.location || "N/A"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {assignment.status || "N/A"}
            </p>

            <p>
              <strong>Credits:</strong>{" "}
              {assignment.credits || 2}
            </p>

            {/* ================================
                COMPANY INFORMATION
            ================================= */}

            <h3>Company Information</h3>

            <p>
              <strong>Company:</strong>{" "}
              {assignment.company?.companyName || "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {assignment.company?.email || "N/A"}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {assignment.company?.location || "N/A"}
            </p>

            {/* ================================
                FACULTY GUIDE
            ================================= */}

            <h3>Faculty Guide</h3>

            <p>
              <strong>Name:</strong>{" "}
              {assignment.facultyGuide?.name || "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {assignment.facultyGuide?.email || "N/A"}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {assignment.facultyGuide?.department || "N/A"}
            </p>

          </div>
        ))
      )}

      <hr />

      {/* ======================================
          LOGBOOK REVIEW
      ====================================== */}

      <h2>📖 Logbook Review</h2>

      {logbooks.length === 0 ? (
        <p>No logbook entries available.</p>
      ) : (
        logbooks.map((logbook) => (
          <div
            key={logbook._id}
            className="assignment-card"
          >

            <h3>Student Logbook Entry</h3>

            <p>
              <strong>Student:</strong>{" "}
              {logbook.student?.name || "N/A"}
            </p>

            <p>
              <strong>Register Number:</strong>{" "}
              {logbook.student?.registerNumber || "N/A"}
            </p>

            <p>
              <strong>Internship:</strong>{" "}
              {logbook.internship?.title || "N/A"}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {logbook.date
                ? new Date(
                    logbook.date
                  ).toLocaleDateString()
                : "N/A"}
            </p>

            <p>
              <strong>Hours Worked:</strong>{" "}
              {logbook.hoursWorked || 0} hours
            </p>

            <p>
              <strong>Work Done:</strong>{" "}
              {logbook.workDone || "N/A"}
            </p>

            <p>
              <strong>What I Learned:</strong>{" "}
              {logbook.learnings || "N/A"}
            </p>

            <p>
              <strong>Company Guide Status:</strong>{" "}
              {logbook.companyGuideStatus || "Pending"}
            </p>

            {/* =================================
                COMPANY GUIDE BUTTONS
            ================================= */}

            {logbook.companyGuideStatus ===
              "Pending" && (
              <div>

                <button
                  onClick={() =>
                    approveLogbook(logbook._id)
                  }
                >
                  ✅ Approve
                </button>

                <button
                  onClick={() =>
                    rejectLogbook(logbook._id)
                  }
                >
                  ❌ Reject
                </button>

              </div>
            )}

            <p>
              <strong>Faculty Status:</strong>{" "}
              {logbook.facultyStatus || "Pending"}
            </p>

          </div>
        ))
      )}

    </div>
  );
}

export default CompanyGuideDashboard;