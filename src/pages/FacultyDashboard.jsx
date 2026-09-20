import { useEffect, useState } from "react";

function FacultyDashboard({ faculty, onLogout,  onGoToProfile, }) {
  const [applications, setApplications] = useState([]);
  const [logbooks, setLogbooks] = useState([]);
  const [message, setMessage] = useState("");

  // ======================================================
  // FETCH ASSIGNED STUDENTS
  // ======================================================

  const fetchAssignedStudents = async () => {
    try {
      const facultyId = faculty?.id || faculty?._id;

      if (!facultyId) {
        setMessage("Faculty information not found.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/internship-assignments/faculty/${facultyId}`
      );

      const data = await response.json();

      if (data.status === "success") {
        setApplications(data.assignments);
      } else {
        setMessage(
          data.message || "Failed to load assigned students"
        );
      }
    } catch (error) {
      console.error("Fetch Assigned Students Error:", error);
      setMessage("Unable to connect to server");
    }
  };

  // ======================================================
  // FETCH FACULTY LOGBOOKS
  // ======================================================

  const fetchLogbooks = async () => {
    try {
      const facultyId = faculty?.id || faculty?._id;

      if (!facultyId) {
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/logbook/faculty/${facultyId}`
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
      console.error("Fetch Logbooks Error:", error);
      setMessage("Unable to load logbooks");
    }
  };

  // ======================================================
  // APPROVE LOGBOOK
  // ======================================================

  const approveLogbook = async (logbookId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/logbook/faculty/approve/${logbookId}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Logbook approved successfully.");
        fetchLogbooks();
      } else {
        setMessage(
          data.message || "Failed to approve logbook"
        );
      }
    } catch (error) {
      console.error("Approve Logbook Error:", error);
      setMessage("Unable to approve logbook");
    }
  };

  // ======================================================
  // REJECT LOGBOOK
  // ======================================================

  const rejectLogbook = async (logbookId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/logbook/faculty/reject/${logbookId}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Logbook rejected successfully.");
        fetchLogbooks();
      } else {
        setMessage(
          data.message || "Failed to reject logbook"
        );
      }
    } catch (error) {
      console.error("Reject Logbook Error:", error);
      setMessage("Unable to reject logbook");
    }
  };

  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {
    fetchAssignedStudents();
    fetchLogbooks();
  }, [faculty]);

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="faculty-dashboard">

      {/* HEADER */}

      <h1>Faculty Dashboard</h1>

      <p>
        Welcome, <strong>{faculty?.name}</strong>
      </p>

      <p>
        <strong>Department:</strong>{" "}
        {faculty?.department || "N/A"}
      </p>

      <p>
        <strong>Designation:</strong>{" "}
        {faculty?.designation || "Faculty"}
      </p>

      <button onClick={onGoToProfile}>
  👤 My Profile
</button>

<button onClick={onLogout}>
  Logout
</button>

      <hr />

      {/* MESSAGE */}

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      {/* ======================================================
          ASSIGNED STUDENTS
          ====================================================== */}

      <h2>
        Assigned Internship Students
      </h2>

      {applications.length === 0 ? (
        <p>
          No students have been assigned to you yet.
        </p>
      ) : (
        applications.map((application) => (
          <div
            className="application-card"
            key={application._id}
          >

            {/* STUDENT */}

            <h3>
              Student Information
            </h3>

            <p>
              <strong>Name:</strong>{" "}
              {application.student?.name || "N/A"}
            </p>

            <p>
              <strong>Register Number:</strong>{" "}
              {application.student?.registerNumber || "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {application.student?.email || "N/A"}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {application.student?.department || "N/A"}
            </p>

            <p>
              <strong>Semester:</strong>{" "}
              {application.student?.semester || "N/A"}
            </p>

            <hr />

            {/* COMPANY */}

            <h3>
              Company Information
            </h3>

            <p>
              <strong>Company:</strong>{" "}
              {application.company?.companyName || "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {application.company?.email || "N/A"}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {application.company?.location || "N/A"}
            </p>

            <hr />

            {/* INTERNSHIP */}

            <h3>
              Internship Information
            </h3>

            <p>
              <strong>Internship:</strong>{" "}
              {application.internship?.title || "N/A"}
            </p>

            <p>
              <strong>Position:</strong>{" "}
              {application.position || "N/A"}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {application.internship?.duration || "N/A"}
            </p>

            <hr />

            {/* APPLICATION STATUS */}

            <p>
              <strong>Application Status:</strong>{" "}
              {application.status}
            </p>

          </div>
        ))
      )}

      <hr />

      {/* ======================================================
          LOGBOOK REVIEW
          ====================================================== */}

      <h2>
        📖 Logbook Review
      </h2>

      {logbooks.length === 0 ? (
        <p>
          No logbook entries available.
        </p>
      ) : (
        logbooks.map((logbook) => (
          <div
            className="application-card"
            key={logbook._id}
          >

            <h3>
              Student Logbook Entry
            </h3>

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
              {new Date(logbook.date).toLocaleDateString()}
            </p>

            <p>
              <strong>Hours Worked:</strong>{" "}
              {logbook.hoursWorked} hours
            </p>

            <p>
              <strong>Work Done:</strong>{" "}
              {logbook.workDone}
            </p>

            <p>
              <strong>What I Learned:</strong>{" "}
              {logbook.learnings}
            </p>

            {/* COMPANY GUIDE STATUS */}

            <p>
              <strong>Company Guide Status:</strong>{" "}
              {logbook.companyGuideStatus || "Pending"}
            </p>

            {/* FACULTY STATUS */}

            <p>
              <strong>Faculty Status:</strong>{" "}
              {logbook.facultyStatus || "Pending"}
            </p>

            {/* WAITING FOR COMPANY GUIDE */}

            {logbook.companyGuideStatus === "Pending" && (
              <p>
                ⏳ Waiting for Company Guide approval
              </p>
            )}

            {/* REJECTED BY COMPANY GUIDE */}

            {logbook.companyGuideStatus === "Rejected" && (
              <p>
                ❌ Rejected by Company Guide
              </p>
            )}

            {/* FACULTY APPROVAL/REJECTION */}

            {logbook.companyGuideStatus === "Approved" &&
              logbook.facultyStatus === "Pending" && (
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

          </div>
        ))
      )}

    </div>
  );
}

export default FacultyDashboard;

