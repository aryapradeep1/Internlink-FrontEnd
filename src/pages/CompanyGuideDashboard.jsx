import React, { useEffect, useState } from "react";

function CompanyGuideDashboard({
  guide,
  onLogout,
  onGoToProfile,
}) {
  const [assignments, setAssignments] = useState([]);
  const [logbooks, setLogbooks] = useState([]);

  const [loadingAssignments, setLoadingAssignments] =
    useState(true);

  const [loadingLogbooks, setLoadingLogbooks] =
    useState(true);

  const [error, setError] = useState("");

  const guideId = guide?.id || guide?._id;

  // ==============================
  // FETCH ASSIGNED STUDENTS
  // ==============================

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!guideId) {
        setError("Company Guide information not found");
        setLoadingAssignments(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/internship-assignments/company-guide/${guideId}`
        );

        const data = await response.json();

        if (response.ok) {
          setAssignments(
            data.assignments || []
          );
        } else {
          setError(
            data.message ||
              "Failed to load assigned students"
          );
        }
      } catch (error) {
        console.error(
          "Fetch Company Guide Assignments Error:",
          error
        );

        setError(
          "Unable to load assigned students"
        );
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, [guideId]);

  // ==============================
  // FETCH LOGBOOKS
  // ==============================

  useEffect(() => {
    const fetchLogbooks = async () => {
      if (!guideId) {
        setLoadingLogbooks(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/logbook/company-guide/${guideId}`
        );

        const data = await response.json();

        if (response.ok) {
          setLogbooks(
            data.logbooks || []
          );
        } else {
          console.error(
            data.message ||
              "Failed to load logbooks"
          );
        }
      } catch (error) {
        console.error(
          "Fetch Company Guide Logbooks Error:",
          error
        );
      } finally {
        setLoadingLogbooks(false);
      }
    };

    fetchLogbooks();
  }, [guideId]);

  // ==============================
  // APPROVE LOGBOOK
  // ==============================

  const approveLogbook = async (logbookId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/logbook/company-guide/approve/${logbookId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setLogbooks((previousLogbooks) =>
          previousLogbooks.map((logbook) =>
            logbook._id === logbookId
              ? {
                  ...logbook,
                  companyGuideStatus:
                    "Approved",
                }
              : logbook
          )
        );
      } else {
        alert(
          data.message ||
            "Failed to approve logbook"
        );
      }
    } catch (error) {
      console.error(
        "Approve Logbook Error:",
        error
      );

      alert("Unable to approve logbook");
    }
  };

  // ==============================
  // REJECT LOGBOOK
  // ==============================

  const rejectLogbook = async (logbookId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/logbook/company-guide/reject/${logbookId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setLogbooks((previousLogbooks) =>
          previousLogbooks.map((logbook) =>
            logbook._id === logbookId
              ? {
                  ...logbook,
                  companyGuideStatus:
                    "Rejected",
                }
              : logbook
          )
        );
      } else {
        alert(
          data.message ||
            "Failed to reject logbook"
        );
      }
    } catch (error) {
      console.error(
        "Reject Logbook Error:",
        error
      );

      alert("Unable to reject logbook");
    }
  };

  return (
    <div className="dashboard-container">

      {/* ==============================
          HEADER
      ============================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <h1>Company Guide Dashboard</h1>

          <h3>
            Welcome, {guide?.name || "Company Guide"}
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
 <button
  onClick={() => {
    alert("Profile button clicked");
    console.log("onGoToProfile:", onGoToProfile);
    onGoToProfile();
  }}
>
  👤 My Profile
</button>

          <button onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ==============================
          GUIDE DETAILS
      ============================== */}

      <div className="student-info">

        <p>
          <strong>Name:</strong>{" "}
          {guide?.name || "Not available"}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {guide?.email || "Not available"}
        </p>

        <p>
          <strong>Employee ID:</strong>{" "}
          {guide?.employeeId ||
            "Not available"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {guide?.status || "Approved"}
        </p>

      </div>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* ==============================
          ASSIGNED STUDENTS
      ============================== */}

      <h2 style={{ marginTop: "30px" }}>
        👨‍🎓 Assigned Students
      </h2>

      {loadingAssignments ? (
        <p>Loading assigned students...</p>
      ) : assignments.length === 0 ? (
        <p>
          No students have been assigned yet.
        </p>
      ) : (
        assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="student-info"
            style={{
              marginBottom: "20px",
            }}
          >

            <h3>
              Student Details
            </h3>

            <p>
              <strong>Name:</strong>{" "}
              {assignment.student?.name ||
                "Not available"}
            </p>

            <p>
              <strong>Register Number:</strong>{" "}
              {assignment.student
                ?.registerNumber ||
                "Not available"}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {assignment.student
                ?.department ||
                "Not available"}
            </p>

            <p>
              <strong>Semester:</strong>{" "}
              {assignment.student?.semester ||
                "Not available"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {assignment.student?.email ||
                "Not available"}
            </p>

            <hr />

            <h3>
              Internship Details
            </h3>

            <p>
              <strong>Position:</strong>{" "}
              {assignment.internship?.position ||
                assignment.internship?.title ||
                "Not available"}
            </p>

            <p>
              <strong>Company:</strong>{" "}
              {assignment.company
                ?.companyName ||
                "Not available"}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {assignment.company?.location ||
                "Not available"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {assignment.status ||
                "Not available"}
            </p>

            <hr />

            <h3>
              Faculty Guide
            </h3>

            <p>
              <strong>Name:</strong>{" "}
              {assignment.facultyGuide
                ?.name ||
                "Not assigned"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {assignment.facultyGuide
                ?.email ||
                "Not available"}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {assignment.facultyGuide
                ?.department ||
                "Not available"}
            </p>

          </div>
        ))
      )}

      {/* ==============================
          LOGBOOKS
      ============================== */}

      <h2 style={{ marginTop: "30px" }}>
        📖 Student Logbooks
      </h2>

      {loadingLogbooks ? (
        <p>Loading logbooks...</p>
      ) : logbooks.length === 0 ? (
        <p>
          No logbook entries available.
        </p>
      ) : (
        logbooks.map((logbook) => (
          <div
            key={logbook._id}
            className="student-info"
            style={{
              marginBottom: "20px",
            }}
          >

            <h3>
              {logbook.student?.name ||
                "Student"}
            </h3>

            <p>
              <strong>Date:</strong>{" "}
              {logbook.date
                ? new Date(
                    logbook.date
                  ).toLocaleDateString()
                : "Not available"}
            </p>

            <p>
              <strong>Hours Worked:</strong>{" "}
              {logbook.hoursWorked || 0} hours
            </p>

            <p>
              <strong>Work Done:</strong>{" "}
              {logbook.workDone ||
                "Not available"}
            </p>

            <p>
              <strong>What I Learned:</strong>{" "}
              {logbook.learnings ||
                "Not available"}
            </p>

            <p>
              <strong>Company Guide Status:</strong>{" "}
              {logbook.companyGuideStatus ||
                "Pending"}
            </p>

            <p>
              <strong>Faculty Status:</strong>{" "}
              {logbook.facultyStatus ||
                "Pending"}
            </p>

            {/* ==============================
                LOGBOOK ACTIONS
            ============================== */}

            {logbook.companyGuideStatus !==
              "Approved" &&
              logbook.companyGuideStatus !==
                "Rejected" && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    flexWrap: "wrap",
                  }}
                >

                  <button
                    onClick={() =>
                      approveLogbook(
                        logbook._id
                      )
                    }
                  >
                    ✅ Approve Logbook
                  </button>

                  <button
                    onClick={() =>
                      rejectLogbook(
                        logbook._id
                      )
                    }
                  >
                    ❌ Reject Logbook
                  </button>

                </div>
              )}

          </div>
        ))
      )}

    </div>
  );
}

export default CompanyGuideDashboard;