import { useEffect, useState } from "react";
import "../css/FacultyDashboard.css";
import ChangePassword from "./ChangePassword";

function FacultyDashboard({
  faculty,
  onLogout,
  onGoToProfile,
  onGoToEditProfile,
  onGoToDashboard,
  onGoToStudents,
  onGoToLogbooks,
  onGoToAttendance,
  onGoToChangePassword,
  activeSection,
  children,
}) {
  const [applications, setApplications] = useState([]);
  const [logbooks, setLogbooks] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [markInputs, setMarkInputs] = useState({});
  const [message, setMessage] = useState("");

  // =========================
  // ATTENDANCE STATE
  // =========================
  const [selectedAttendanceAssignment, setSelectedAttendanceAssignment] =
    useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // =========================
  // EXISTING FUNCTIONAL LOGIC
  // =========================

  const fetchAssignedStudents = async () => {
    try {
      const facultyId = faculty?.id || faculty?._id;

      const response = await fetch(
        `http://localhost:5000/api/internship-assignments/faculty/${facultyId}`
      );

      const data = await response.json();

      if (data.status === "success") {
        setApplications(data.assignments || []);
      }
    } catch (error) {
      console.error("Error fetching assigned students:", error);
    }
  };

  const fetchExcelAssignedStudents = async () => {
    try {
      const facultyId = faculty?.id || faculty?._id;

      if (!facultyId) return;

      const response = await fetch(
        `http://localhost:5000/api/faculty/students/${facultyId}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setAssignedStudents(data.students || []);
      } else {
        console.error(
          data.message || "Failed to fetch assigned students"
        );
      }
    } catch (error) {
      console.error("Excel assigned students error:", error);
    }
  };

  const fetchLogbooks = async () => {
    try {
      const facultyId = faculty?.id || faculty?._id;

      const response = await fetch(
        `http://localhost:5000/api/logbook/faculty/${facultyId}`
      );

      const data = await response.json();

      if (response.ok) {
        const receivedLogbooks = Array.isArray(data)
          ? data
          : Array.isArray(data.logbooks)
          ? data.logbooks
          : [];

        setLogbooks(receivedLogbooks);
        console.log("ALL FACULTY LOGBOOKS:", receivedLogbooks);
console.log("TOTAL LOGBOOKS:", receivedLogbooks.length);
      } else {
        setLogbooks([]);
        setMessage(data.message || "Failed to load logbooks");
      }
    } catch (error) {
      console.error("Error fetching logbooks:", error);
      setLogbooks([]);
    }
  };

  const approveLogbook = async (logbookId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/logbook/faculty/approve/${logbookId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Logbook approved successfully.");
        fetchLogbooks();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Approve logbook error:", error);
      setMessage("Unable to approve logbook.");
    }
  };

  const rejectLogbook = async (logbookId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/logbook/faculty/reject/${logbookId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Logbook rejected.");
        fetchLogbooks();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Reject logbook error:", error);
      setMessage("Unable to reject logbook.");
    }
  };

  const saveMark = async (assignmentId) => {
    try {
      const facultyId = faculty?.id || faculty?._id;

      const response = await fetch(
        `http://localhost:5000/api/internship-assignments/faculty/mark/${assignmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            facultyId,
            mark: markInputs[assignmentId],
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Mark saved successfully.");
        fetchAssignedStudents();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Save mark error:", error);
      setMessage("Unable to save mark.");
    }
  };

  // =========================
  // ATTENDANCE FUNCTIONS
  // =========================

  const fetchAttendance = async (assignmentId) => {
    try {
      setAttendanceLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/attendance/faculty/${assignmentId}`
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setAttendanceRecords(data.attendance || data.records || []);
      } else {
        setAttendanceRecords([]);
        setMessage(data.message || "Unable to load attendance.");
      }
    } catch (error) {
      console.error("Fetch attendance error:", error);
      setAttendanceRecords([]);
      setMessage("Unable to load attendance.");
    } finally {
      setAttendanceLoading(false);
    }
  };

  const openAttendance = async (assignment) => {
    setSelectedAttendanceAssignment(assignment);
    setAttendanceRecords([]);
    setMessage("");
    await fetchAttendance(assignment._id);
  };

  const closeAttendance = () => {
    setSelectedAttendanceAssignment(null);
    setAttendanceRecords([]);
    setMessage("");
  };

  const verifyAttendance = async (attendanceId, verificationStatus) => {
    try {
      const facultyId = faculty?.id || faculty?._id;

      const response = await fetch(
        `http://localhost:5000/api/attendance/faculty/${attendanceId}/verify`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            facultyId,
            verificationStatus,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setMessage(
          verificationStatus === "Approved"
            ? "Attendance approved successfully."
            : "Attendance rejected."
        );

        if (selectedAttendanceAssignment?._id) {
          await fetchAttendance(selectedAttendanceAssignment._id);
        }
      } else {
        setMessage(data.message || "Unable to update attendance.");
      }
    } catch (error) {
      console.error("Verify attendance error:", error);
      setMessage("Unable to update attendance.");
    }
  };

  useEffect(() => {
    if (faculty) {
      fetchAssignedStudents();
      fetchExcelAssignedStudents();
      fetchLogbooks();
    }
  }, [faculty]);

  // =========================
  // UI
  // =========================

  const getInitials = () => {
    if (!faculty?.name) return "F";

    return faculty.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="faculty-layout">

      {/* ================= HEADER ================= */}

      <header className="faculty-header">

      <div className="faculty-brand">

  <button
    type="button"
    className="faculty-logo"
    onClick={onGoToDashboard}
  >
    <span className="faculty-logo-mark">
      IL
    </span>

    <span className="faculty-logo-text">
      InternLink
    </span>
  </button>

  <span className="faculty-role">
    Faculty Portal
  </span>

</div>

        <div className="faculty-header-right">

          <div className="faculty-user">

            <div className="faculty-avatar">
              {getInitials()}
            </div>

            <div className="faculty-user-info">

              <strong>
                {faculty?.name || "Faculty"}
              </strong>

              <span>
                {faculty?.designation || "Faculty"}
              </span>

            </div>

          </div>

          <button
            className="faculty-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* ================= MAIN AREA ================= */}

      <div className="faculty-main">

        {/* ================= SIDEBAR ================= */}

        <aside className="faculty-sidebar">

          <div className="faculty-sidebar-title">
            Faculty Dashboard
          </div>

          <nav className="faculty-nav">

            {/* Dashboard */}

            <button
              type="button"
              className={
                activeSection === "dashboard"
                  ? "faculty-nav-item active"
                  : "faculty-nav-item"
              }
              onClick={onGoToDashboard}
            >
              <span>⌂</span>
              Dashboard
            </button>

            {/* Assigned Students */}

            <button
              type="button"
              className={
                activeSection === "students"
                  ? "faculty-nav-item active"
                  : "faculty-nav-item"
              }
              onClick={onGoToStudents}
            >
              <span>👨‍🎓</span>
              Assigned Students
            </button>

            {/* Attendance */}

            <button
              type="button"
              className={
                activeSection === "attendance"
                  ? "faculty-nav-item active"
                  : "faculty-nav-item"
              }
              onClick={onGoToAttendance}
            >
              <span>🕒</span>
              Attendance
            </button>

            {/* Logbook Review */}

            <button
              type="button"
              className={
                activeSection === "logbooks"
                  ? "faculty-nav-item active"
                  : "faculty-nav-item"
              }
              onClick={onGoToLogbooks}
            >
              <span>📖</span>
              Logbook Review
            </button>

            {/* My Profile */}

            <button
              type="button"
              className={
                activeSection === "profile"
                  ? "faculty-nav-item active"
                  : "faculty-nav-item"
              }
              onClick={onGoToProfile}
            >
              <span>👤</span>
              My Profile
            </button>

            {/* Change Password */}

            <button
              type="button"
              className={
                activeSection === "changePassword"
                  ? "faculty-nav-item active"
                  : "faculty-nav-item"
              }
              onClick={onGoToChangePassword}
            >
              <span>🔐</span>
              <span>Change Password</span>
            </button>

          </nav>

          {/* ================= SIDEBAR PROFILE ================= */}

          <div className="faculty-sidebar-bottom">

            <button
              type="button"
              className="faculty-profile-mini"
              onClick={onGoToProfile}
            >

              <div className="faculty-avatar small">
                {getInitials()}
              </div>

              <div>
                <strong>
                  {faculty?.name || "Faculty"}
                </strong>

                <span>
                  View Profile
                </span>
              </div>

            </button>

          </div>

        </aside>

        {/* ================= CONTENT ================= */}

        <main className="faculty-content">

          {/* ================= DASHBOARD ================= */}

          {activeSection === "dashboard" && (
            <section>

              <div className="faculty-page-heading">

                <div>

                  <p className="faculty-eyebrow">
                    FACULTY PORTAL
                  </p>

                  <h1>
                    Welcome, {faculty?.name || "Faculty"} 👋
                  </h1>

                  <p>
                    Manage your assigned internship students and
                    review their internship logbooks.
                  </p>

                </div>

              </div>

              {message && (
                <div className="faculty-message">
                  {message}
                </div>
              )}

              <div className="faculty-info-grid">

                <div className="faculty-info-card">

                  <div className="info-card-icon">
                    👨‍🎓
                  </div>

                  <div>
                    <span>
                      Assigned Students
                    </span>

                    <strong>
                      {applications.length}
                    </strong>
                  </div>

                </div>

                <div className="faculty-info-card">

                  <div className="info-card-icon">
                    📖
                  </div>

                  <div>
                    <span>
                      Logbooks
                    </span>

                    <strong>
                      {logbooks.length}
                    </strong>
                  </div>

                </div>

                <div className="faculty-info-card">

                  <div className="info-card-icon">
                    🏫
                  </div>

                  <div>

                    <span>
                      Department
                    </span>

                    <strong>
                      {faculty?.department || "Not available"}
                    </strong>

                  </div>

                </div>

              </div>

              <div className="faculty-welcome-card">

                <div>

                  <span className="welcome-label">
                    YOUR RESPONSIBILITIES
                  </span>

                  <h2>
                    Guide students through their internship journey.
                  </h2>

                  <p>
                    Review assigned students, monitor internship
                    progress, and approve completed logbooks after
                    company guide verification.
                  </p>

                </div>

                <div className="welcome-actions">

                  <button
                    type="button"
                    onClick={onGoToStudents}
                  >
                    View Students →
                  </button>

                  <button
                    type="button"
                    className="secondary"
                    onClick={onGoToLogbooks}
                  >
                    Review Logbooks
                  </button>

                </div>

              </div>

            </section>
          )}

          {/* ================= STUDENTS ================= */}

          {activeSection === "students" && (
            <section className="faculty-students-page">

              <div className="faculty-page-heading students-heading">

                <div>

                  <p className="faculty-eyebrow">
                    INTERNSHIP MANAGEMENT
                  </p>

                  <h1>
                    Assigned Students
                  </h1>

                  <p>
                    View college-assigned students and manage their
                    internship evaluation.
                  </p>

                </div>

                {applications.length > 0 && (
                  <div className="students-count-card">

                    <span>
                      Total Assigned
                    </span>

                    <strong>
                      {applications.length}
                    </strong>

                  </div>
                )}

              </div>

              {message && (
                <div className="faculty-message">
                  {message}
                </div>
              )}

              {/* ================= EXCEL ASSIGNED STUDENTS ================= */}

              <div className="excel-assigned-students-section">

                <div className="excel-assigned-header">
                  <div>
                    <p className="faculty-eyebrow">
                      COLLEGE ASSIGNMENT
                    </p>
                    <h2>
                      Students Assigned to You
                    </h2>
                    <p>
                      Students assigned to you by your college through the
                      student verification list.
                    </p>
                  </div>

                  <div className="excel-student-count">
                    <span>Total Students</span>
                    <strong>{assignedStudents.length}</strong>
                  </div>
                </div>

                {assignedStudents.length === 0 ? (
                  <div className="excel-students-empty">
                    <div className="excel-empty-icon">👨‍🎓</div>
                    <h3>No students assigned yet</h3>
                    <p>
                      Students assigned to you by your college will appear
                      here.
                    </p>
                  </div>
                ) : (
                  <div className="excel-assigned-students-list">
                    {assignedStudents.map((student) => (
                      <div
                        className="excel-assigned-student-card"
                        key={student._id}
                      >
                        <div className="excel-student-info">
                          <div className="excel-student-avatar">
                            {student.name?.charAt(0)?.toUpperCase() || "S"}
                          </div>

                          <div>
                            <h3>{student.name}</h3>
                            <p>{student.department}</p>
                            <span>
                              Register No: {student.registerNumber}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="view-student-details-btn"
                          onClick={() => setSelectedStudent(student)}
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* ================= STUDENT DETAILS MODAL ================= */}

              {selectedStudent && (
                <div
                  className="student-details-overlay"
                  onClick={() => setSelectedStudent(null)}
                >
                  <div
                    className="student-details-modal"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="student-details-modal-header">
                      <div>
                        <p className="faculty-eyebrow">
                          STUDENT PROFILE
                        </p>
                        <h2>{selectedStudent.name}</h2>
                        <p>{selectedStudent.department}</p>
                      </div>

                      <button
                        type="button"
                        className="student-details-close-btn"
                        onClick={() => setSelectedStudent(null)}
                        aria-label="Close student details"
                      >
                        ×
                      </button>
                    </div>

                    <div className="student-details-modal-grid">
                      <div>
                        <span>Name</span>
                        <strong>{selectedStudent.name || "Not available"}</strong>
                      </div>

                      <div>
                        <span>Register Number</span>
                        <strong>
                          {selectedStudent.registerNumber || "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>Email</span>
                        <strong>{selectedStudent.email || "Not available"}</strong>
                      </div>

                      <div>
                        <span>Department</span>
                        <strong>
                          {selectedStudent.department || "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>Semester</span>
                        <strong>
                          {selectedStudent.semester ?? "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>Phone</span>
                        <strong>{selectedStudent.phone || "Not available"}</strong>
                      </div>

                      <div>
                        <span>College</span>
                        <strong>
                          {selectedStudent.college?.collegeName ||
                            "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>Assigned Faculty</span>
                        <strong>
                          {selectedStudent.assignedFacultyName ||
                            "Not available"}
                        </strong>
                      </div>
                    </div>

                    <div className="student-details-modal-footer">
                      <button
                        type="button"
                        className="view-student-details-btn"
                        onClick={() => setSelectedStudent(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= EXISTING INTERNSHIP ASSIGNMENTS ================= */}

              <div className="internship-assignment-section">
                <div className="section-title-row">
                  <div>
                    <h2>Internship Assignments</h2>
                    <p>
                      Internship assignments and final evaluation remain
                      available below.
                    </p>
                  </div>
                </div>
              </div>

              {applications.length === 0 ? (

                <div className="faculty-empty students-empty">

                  <div className="empty-icon">
                    👨‍🎓
                  </div>

                  <h3>
                    No Internship Assignments
                  </h3>

                  <p>
                    Internship assignments will appear here after a student
                    receives an internship assignment.
                  </p>

                </div>

              ) : (

                <>

                  {/* ================= SUMMARY ================= */}

                  <div className="student-summary-grid">

                    <div className="student-summary-card">

                      <div className="summary-icon">
                        👨‍🎓
                      </div>

                      <div>

                        <span>
                          Assigned Students
                        </span>

                        <strong>
                          {applications.length}
                        </strong>

                      </div>

                    </div>

                    <div className="student-summary-card">

                      <div className="summary-icon">
                        🎓
                      </div>

                      <div>

                        <span>
                          Completed
                        </span>

                        <strong>
                          {
                            applications.filter(
                              (application) =>
                                application.status === "Completed"
                            ).length
                          }
                        </strong>

                      </div>

                    </div>

                    <div className="student-summary-card">

                      <div className="summary-icon">
                        📝
                      </div>

                      <div>

                        <span>
                          Marks Pending
                        </span>

                        <strong>
                          {
                            applications.filter(
                              (application) =>
                                application.status === "Completed" &&
                                (
                                  application.mark === undefined ||
                                  application.mark === null
                                )
                            ).length
                          }
                        </strong>

                      </div>

                    </div>

                  </div>

                  {/* ================= STUDENT LIST ================= */}

                  <div className="assigned-students-section">

                    <div className="section-title-row">

                      <div>

                        <h2>
                          Your Students
                        </h2>

                        <p>
                          Students currently under your internship supervision.
                        </p>

                      </div>

                    </div>

                    <div className="faculty-card-list">

                      {applications.map((application) => (

                        <div
                          className="faculty-student-card"
                          key={application._id}
                        >

                          {/* ================= STUDENT HEADER ================= */}

                          <div className="student-card-header">

                            <div className="student-identity">

                              <div className="student-avatar">

                                {(application.student?.name || "S")
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <div>

                                <h2>
                                  {application.student?.name ||
                                    "Student"}
                                </h2>

                                <span>
                                  Register No:{" "}
                                  {application.student?.registerNumber ||
                                    "Not available"}
                                </span>

                              </div>

                            </div>

                            <span
                              className={`status-pill ${
                                application.status
                                  ? application.status
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")
                                  : ""
                              }`}
                            >
                              {application.status}
                            </span>

                          </div>

                          {/* ================= STUDENT DETAILS ================= */}

                          <div className="student-details-grid">

                            <div className="student-detail-item">

                              <span>
                                Company
                              </span>

                              <strong>
                                {application.company?.name ||
                                  "Not available"}
                              </strong>

                            </div>

                            <div className="student-detail-item">

                              <span>
                                Internship Position
                              </span>

                              <strong>
                                {application.internship?.position ||
                                  "Not available"}
                              </strong>

                            </div>

                            <div className="student-detail-item">

                              <span>
                                Department
                              </span>

                              <strong>
                                {application.student?.department ||
                                  "Not available"}
                              </strong>

                            </div>

                            <div className="student-detail-item">

                              <span>
                                Credits
                              </span>

                              <strong>
                                {application.credits || 2}
                              </strong>

                            </div>

                          </div>

                          {/* ================= EVALUATION ================= */}

                          <div className="evaluation-box">

                            <div className="evaluation-header">

                              <div>

                                <span className="evaluation-label">
                                  INTERNSHIP EVALUATION
                                </span>

                                <h3>
                                  Final Assessment
                                </h3>

                              </div>

                              {application.mark !== undefined &&
                              application.mark !== null ? (

                                <div className="current-mark">

                                  <span>
                                    Current Mark
                                  </span>

                                  <strong>
                                    {application.mark}
                                  </strong>

                                </div>

                              ) : (

                                <div className="mark-pending">
                                  Mark Pending
                                </div>

                              )}

                            </div>

                            {application.status === "Completed" ? (

                              <div className="mark-entry">

                                <div className="mark-input-wrapper">

                                  <label>
                                    Enter final mark
                                  </label>

                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="0 - 100"
                                    value={
                                      markInputs[application._id] || ""
                                    }
                                    onChange={(e) =>
                                      setMarkInputs({
                                        ...markInputs,
                                        [application._id]:
                                          e.target.value,
                                      })
                                    }
                                  />

                                </div>

                                <button
                                  type="button"
                                  className="save-mark-button"
                                  onClick={() =>
                                    saveMark(application._id)
                                  }
                                >
                                  Save Mark
                                </button>

                              </div>

                            ) : (

                              <div className="waiting-text">

                                <span>
                                  ⏳
                                </span>

                                Waiting for internship completion
                                before evaluation.

                              </div>

                            )}

                          </div>

                        </div>

                      ))}

                    </div>

                  </div>

                </>

              )}

            </section>
          )}

          {/* ================= ATTENDANCE ================= */}

          {activeSection === "attendance" && (
            <section>

              {!selectedAttendanceAssignment ? (
                <>
                  <div className="faculty-page-heading">
                    <div>
                      <p className="faculty-eyebrow">
                        INTERNSHIP MONITORING
                      </p>
                      <h1>Attendance Verification</h1>
                      <p>
                        Review attendance marked by the company guide.
                      </p>
                    </div>
                  </div>

                  {message && (
                    <div className="faculty-message">{message}</div>
                  )}

                  {applications.length === 0 ? (
                    <div className="faculty-empty">
                      <div>🕒</div>
                      <h3>No Assigned Internships</h3>
                      <p>Assigned internship attendance will appear here.</p>
                    </div>
                  ) : (
                    <div className="faculty-attendance-list">
                      {applications.map((application) => (
                        <div className="faculty-student-card attendance-card" key={application._id}>
                          <div className="student-card-header">
                            <div className="student-identity">
                              <div className="student-avatar">
                                {(application.student?.name || "S").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3>{application.student?.name || "Student"}</h3>
                                <span>
                                  Register No: {application.student?.registerNumber || "Not available"}
                                </span>
                              </div>
                            </div>
                            <span className={`status-pill status-${(application.status || "Assigned").toLowerCase()}`}>
                              {application.status || "Assigned"}
                            </span>
                          </div>

                          <div className="student-details-grid">
                            <div className="student-detail-item">
                              <span>Company</span>
                              <strong>{application.company?.companyName || "Not available"}</strong>
                            </div>
                            <div className="student-detail-item">
                              <span>Internship</span>
                              <strong>{application.internship?.title || application.internship?.position || "Not available"}</strong>
                            </div>
                            <div className="student-detail-item">
                              <span>Faculty Guide</span>
                              <strong>{application.facultyGuide?.name || "You"}</strong>
                            </div>
                            <div className="student-detail-item">
                              <span>Credits</span>
                              <strong>{application.credits ?? 0}</strong>
                            </div>
                          </div>

                          <div className="attendance-card-action">
                            <button
                              type="button"
                              className="save-mark-button"
                              onClick={() => openAttendance(application)}
                            >
                              View Attendance →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="faculty-page-heading attendance-detail-heading">
                    <div>
                      <button type="button" className="attendance-back-button" onClick={closeAttendance}>
                        ← Back to Attendance
                      </button>
                      <p className="faculty-eyebrow">
                        ATTENDANCE VERIFICATION
                      </p>
                      <h1>
                        {selectedAttendanceAssignment.student?.name || "Student"}
                      </h1>
                      <p>Review and verify company guide attendance records.</p>
                    </div>
                  </div>

                  {message && (
                    <div className="faculty-message">{message}</div>
                  )}

                  <div className="faculty-profile-card attendance-profile-card">
                    <div className="profile-header">
                      <div className="profile-avatar-large">
                        {(selectedAttendanceAssignment.student?.name || "S").charAt(0).toUpperCase()}
                      </div>
                      <div className="profile-header-info">
                        <h2>{selectedAttendanceAssignment.student?.name || "Student"}</h2>
                        <p>
                          Register No: {selectedAttendanceAssignment.student?.registerNumber || "Not available"}
                        </p>
                        <span className="profile-status">
                          {selectedAttendanceAssignment.status || "Assigned"}
                        </span>
                      </div>
                    </div>

                    <div className="profile-details">
                      <div className="profile-field">
                        <span>Company</span>
                        <strong>{selectedAttendanceAssignment.company?.companyName || "Not available"}</strong>
                      </div>
                      <div className="profile-field">
                        <span>Internship</span>
                        <strong>{selectedAttendanceAssignment.internship?.title || selectedAttendanceAssignment.internship?.position || "Not available"}</strong>
                      </div>
                      <div className="profile-field">
                        <span>Department</span>
                        <strong>{selectedAttendanceAssignment.student?.department || "Not available"}</strong>
                      </div>
                    </div>
                  </div>

                  {attendanceLoading ? (
                    <div className="faculty-empty"><div>⏳</div><h3>Loading Attendance...</h3></div>
                  ) : attendanceRecords.length === 0 ? (
                    <div className="faculty-empty"><div>🕒</div><h3>No Attendance Records</h3><p>The company guide has not marked attendance yet.</p></div>
                  ) : (
                    <div className="faculty-attendance-records">
                      {attendanceRecords.map((record) => (
                        <div className="faculty-student-card attendance-record-card" key={record._id}>
                          <div className="attendance-record-header">
                            <div>
                              <h3>{record.date ? new Date(record.date).toLocaleDateString() : "Date unavailable"}</h3>
                              <span>{record.status || "Present"}</span>
                            </div>
                            <span className={`attendance-verification-status ${String(record.verificationStatus || "Pending").toLowerCase()}`}>
                              {record.verificationStatus || "Pending"}
                            </span>
                          </div>

                          <div className="student-details-grid">
                            <div className="student-detail-item">
                              <span>Check In</span>
                              <strong>{record.checkIn || "—"}</strong>
                            </div>
                            <div className="student-detail-item">
                              <span>Check Out</span>
                              <strong>{record.checkOut || "—"}</strong>
                            </div>
                            <div className="student-detail-item">
                              <span>Total Hours</span>
                              <strong>{record.totalHours || 0} hours</strong>
                            </div>
                            <div className="student-detail-item">
                              <span>Status</span>
                              <strong>{record.status || "Present"}</strong>
                            </div>
                          </div>

                          {record.verificationStatus === "Pending" ? (
                            <div className="attendance-verification-actions">
                              <button type="button" className="approve-btn" onClick={() => verifyAttendance(record._id, "Approved")}>
                                ✓ Approve Attendance
                              </button>
                              <button type="button" className="reject-btn" onClick={() => verifyAttendance(record._id, "Rejected")}>
                                ✕ Reject Attendance
                              </button>
                            </div>
                          ) : (
                            <div className="attendance-reviewed-message">
                              {record.verificationStatus === "Approved" ? "✓ Attendance approved" : "Attendance rejected"}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {/* ================= LOGBOOKS ================= */}

          {activeSection === "logbooks" && (
            <section>

              <div className="faculty-page-heading">

                <div>

                  <p className="faculty-eyebrow">
                    INTERNSHIP MONITORING
                  </p>

                  <h1>
                    Logbook Review
                  </h1>

                  <p>
                    Review student internship entries after company
                    guide verification.
                  </p>

                </div>

              </div>

              {message && (
                <div className="faculty-message">
                  {message}
                </div>
              )}

              {logbooks.length === 0 ? (

                <div className="faculty-empty">

                  <div>
                    📖
                  </div>

                  <h3>
                    No Logbooks Available
                  </h3>

                  <p>
                    Student logbook entries will appear here.
                  </p>

                </div>

              ) : (

                <div className="faculty-logbook-list">

                  {logbooks.map((logbook) => (

                   <div
  className="faculty-logbook-list"
  style={{
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflowY: "visible",
    maxHeight: "none",
    height: "auto",
  }}
>

                      <div className="logbook-header">

                        <div>

                          <h2>
                            {logbook.student?.name ||
                              "Student"}
                          </h2>

                          <span>
                            Register No:{" "}
                            {logbook.student?.registerNumber ||
                              "Not available"}
                          </span>

                        </div>

                        <span className="date-pill">

                          {logbook.date
                            ? new Date(
                                logbook.date
                              ).toLocaleDateString()
                            : "Date unavailable"}

                        </span>

                      </div>

                      <div className="logbook-info">

                        <div>

                          <span>
                            Internship
                          </span>

                          <strong>
                            {logbook.internship?.position ||
                              "Not available"}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Hours Worked
                          </span>

                          <strong>
                            {logbook.hoursWorked || 0} hours
                          </strong>

                        </div>

                      </div>

                      <div className="logbook-section">

                        <h3>
                          Work Done
                        </h3>

                        <p>
                          {logbook.workDone ||
                            "No description provided."}
                        </p>

                      </div>

                      <div className="logbook-section">

                        <h3>
                          Learnings
                        </h3>

                        <p>
                          {logbook.learnings ||
                            "No learning details provided."}
                        </p>

                      </div>

                      <div className="approval-status">

                        <div>

                          <span>
                            Company Guide Status
                          </span>

                          <strong>
                            {logbook.companyGuideStatus ||
                              "Pending"}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Faculty Status
                          </span>

                          <strong>
                            {logbook.facultyStatus ||
                              "Pending"}
                          </strong>

                        </div>

                      </div>

                      {logbook.companyGuideStatus ===
                        "Approved" &&
                      logbook.facultyStatus === "Pending" ? (

                        <div className="logbook-actions">

                          <button
                            type="button"
                            className="approve-btn"
                            onClick={() =>
                              approveLogbook(logbook._id)
                            }
                          >
                            ✓ Approve
                          </button>

                          <button
                            type="button"
                            className="reject-btn"
                            onClick={() =>
                              rejectLogbook(logbook._id)
                            }
                          >
                            ✕ Reject
                          </button>

                        </div>

                      ) : logbook.facultyStatus ===
                        "Approved" ? (

                        <div className="approved-message">
                          ✓ This logbook has been approved.
                        </div>

                      ) : logbook.facultyStatus ===
                        "Rejected" ? (

                        <div className="rejected-message">
                          This logbook has been rejected.
                        </div>

                      ) : (

                        <div className="waiting-message">
                          Waiting for company guide approval.
                        </div>

                      )}

                    </div>

                  ))}

                </div>

              )}

            </section>
          )}

          {/* ================= PROFILE ================= */}

          {activeSection === "profile" && (
            <section className="faculty-profile-page">

              <div className="faculty-page-heading">

                <div>

                  <p className="faculty-eyebrow">
                    ACCOUNT
                  </p>

                  <h1>
                    My Profile
                  </h1>

                  <p>
                    View and manage your faculty account information.
                  </p>

                </div>

              </div>

              <div className="faculty-profile-card">

                {/* PROFILE HEADER */}

                <div className="profile-header">

                  <div className="profile-avatar-large">
                    {getInitials()}
                  </div>

                  <div className="profile-header-info">

                    <h2>
                      {faculty?.name || "Faculty"}
                    </h2>

                    <p>
                      {faculty?.designation || "Faculty"}
                    </p>

                    <span className="profile-status">
                      Faculty Account
                    </span>

                  </div>

                </div>

                {/* PROFILE INFORMATION */}

                <div className="profile-section-title">

                  <div>

                    <span>
                      PERSONAL INFORMATION
                    </span>

                    <h3>
                      Account Details
                    </h3>

                  </div>

                </div>

                <div className="profile-details">

                  <div className="profile-field">

                    <span>
                      Name
                    </span>

                    <strong>
                      {faculty?.name || "Not available"}
                    </strong>

                  </div>

                  <div className="profile-field">

                    <span>
                      Email Address
                    </span>

                    <strong>
                      {faculty?.email || "Not available"}
                    </strong>

                  </div>

                  <div className="profile-field">

                    <span>
                      Department
                    </span>

                    <strong>
                      {faculty?.department || "Not available"}
                    </strong>

                  </div>

                  <div className="profile-field">

                    <span>
                      Phone Number
                    </span>

                    <strong>
                      {faculty?.phone || "Not available"}
                    </strong>

                  </div>

                  <div className="profile-field">

                    <span>
                      Designation
                    </span>

                    <strong>
                      {faculty?.designation || "Faculty"}
                    </strong>

                  </div>

                </div>

                {/* EDIT PROFILE BUTTON */}

                <div className="profile-actions">

                  <button
                    type="button"
                    className="profile-edit-btn"
                    onClick={onGoToEditProfile}
                  >
                    ✏️ Edit Profile
                  </button>

                </div>

              </div>

            </section>
          )}

          {/* ================= EDIT PROFILE ================= */}

          {activeSection === "editProfile" && (
            <>
              {children}
            </>
          )}

          {/* ================= CHANGE PASSWORD ================= */}

          {activeSection === "changePassword" && (
            <>
              {children}
            </>
          )}

        </main>
      </div>
    </div>
  );
}

export default FacultyDashboard;