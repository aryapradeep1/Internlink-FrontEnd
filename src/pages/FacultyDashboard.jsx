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
  const [selectedLogbookStudent, setSelectedLogbookStudent] = useState(null);
  const [expandedLogbooks, setExpandedLogbooks] = useState({});
  const [markInputs, setMarkInputs] = useState({});
  const [message, setMessage] = useState("");

  const [marksPendingOpen, setMarksPendingOpen] = useState(false);

  // =========================
  // ATTENDANCE STATE
  // =========================

  const [selectedAttendanceAssignment, setSelectedAttendanceAssignment] =
    useState(null);

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // Always start the Logbook Review page with the student list.
  useEffect(() => {
    if (activeSection !== "logbooks") {
      setSelectedLogbookStudent(null);
    }
  }, [activeSection]);

  const toggleLogbook = (logbookId) => {
    setExpandedLogbooks((prev) => ({
      ...prev,
      [logbookId]: !prev[logbookId],
    }));
  };

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

        console.log(
          "ALL FACULTY LOGBOOKS:",
          receivedLogbooks
        );

        console.log(
          "TOTAL LOGBOOKS:",
          receivedLogbooks.length
        );
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
        setAttendanceRecords(
          data.attendance || data.records || []
        );
      } else {
        setAttendanceRecords([]);
        setMessage(
          data.message || "Unable to load attendance."
        );
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

  const verifyAttendance = async (
    attendanceId,
    verificationStatus
  ) => {
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
          await fetchAttendance(
            selectedAttendanceAssignment._id
          );
        }
      } else {
        setMessage(
          data.message || "Unable to update attendance."
        );
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

  // =====================================================
  // COMBINED STUDENT VIEW
  // =====================================================

  const studentsWithAssignments = assignedStudents.map(
    (student) => {
      const assignment = applications.find(
        (item) =>
          String(
            item.student?.registerNumber || ""
          )
            .trim()
            .toLowerCase() ===
          String(
            student.registerNumber || ""
          )
            .trim()
            .toLowerCase()
      );

      return {
        student,
        assignment: assignment || null,
      };
    }
  );

  applications.forEach((assignment) => {
    const registerNumber = String(
      assignment.student?.registerNumber || ""
    )
      .trim()
      .toLowerCase();

    const alreadyIncluded =
      studentsWithAssignments.some(
        (item) =>
          String(
            item.student?.registerNumber || ""
          )
            .trim()
            .toLowerCase() === registerNumber &&
          registerNumber !== ""
      );

    if (!alreadyIncluded) {
      studentsWithAssignments.push({
        student: assignment.student || null,
        assignment,
      });
    }
  });

  // =====================================================
  // MARKS PENDING
  // IMPORTANT:
  // Only one declaration is kept here.
  // =====================================================

  const marksPendingAssignments = applications.filter(
    (application) =>
      application.status === "Completed" &&
      (application.mark === undefined ||
        application.mark === null)
  );

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
  <section className="faculty-dashboard-home">

    <div className="faculty-dashboard-home-inner">

      {/* ================= LEFT TEXT ================= */}

      <div className="faculty-dashboard-home-text">

        <p className="faculty-dashboard-home-eyebrow">
          WELCOME TO INTERNLINK
        </p>

        <h1>
          Welcome back,
          <br />
          <span>{faculty?.name || "Faculty"}</span>
        </h1>

        <p className="faculty-dashboard-home-description">
          Your dedicated workspace for guiding students
          through their internship journey.
        </p>

        <div className="faculty-dashboard-home-accent">
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>


      {/* ================= RIGHT ANIMATED ILLUSTRATION ================= */}

      <div
        className="faculty-dashboard-home-visual"
        aria-hidden="true"
      >

        {/* Soft background glow */}

        <div className="faculty-dashboard-glow glow-main"></div>
        <div className="faculty-dashboard-glow glow-coral"></div>


        {/* Animated orbit rings */}

        <div className="faculty-dashboard-orbit orbit-one"></div>
        <div className="faculty-dashboard-orbit orbit-two"></div>
        <div className="faculty-dashboard-orbit orbit-three"></div>


        {/* Decorative floating dots */}

        <span className="faculty-dashboard-dot dot-a"></span>
        <span className="faculty-dashboard-dot dot-b"></span>
        <span className="faculty-dashboard-dot dot-c"></span>
        <span className="faculty-dashboard-dot dot-d"></span>


        {/* Floating check icon */}

        <div className="faculty-dashboard-float-icon float-check">
          ✓
        </div>


        {/* Floating sparkle */}

        <div className="faculty-dashboard-float-icon float-star">
          ✦
        </div>


        {/* ================= MAIN PERSON ================= */}

        <div className="faculty-dashboard-person">

          {/* Head */}

          <div className="dashboard-person-head">

            <div className="dashboard-person-hair"></div>

            <div className="dashboard-person-face"></div>

          </div>


          {/* Neck */}

          <div className="dashboard-person-neck"></div>


          {/* Body */}

          <div className="dashboard-person-body">

            <div className="dashboard-person-shirt"></div>


            {/* Book */}

            <div className="dashboard-person-book">
              <span>IL</span>
            </div>

          </div>


          {/* Arm */}

          <div className="dashboard-person-arm"></div>

        </div>


        {/* ================= DESK ================= */}

        <div className="faculty-dashboard-desk">

          <div className="dashboard-desk-top"></div>

          <div className="dashboard-desk-leg left"></div>
          <div className="dashboard-desk-leg right"></div>

        </div>


        {/* ================= LAPTOP ================= */}

        <div className="faculty-dashboard-laptop">

          <div className="dashboard-laptop-screen">

            <div className="dashboard-laptop-logo">
              IL
            </div>

            <div className="dashboard-laptop-line line-one"></div>
            <div className="dashboard-laptop-line line-two"></div>
            <div className="dashboard-laptop-line line-three"></div>

          </div>

          <div className="dashboard-laptop-base"></div>

        </div>


        {/* ================= SMALL PLANT ================= */}

        <div className="faculty-dashboard-plant">

          <div className="dashboard-plant-leaf leaf-one"></div>
          <div className="dashboard-plant-leaf leaf-two"></div>
          <div className="dashboard-plant-leaf leaf-three"></div>

          <div className="dashboard-plant-pot"></div>

        </div>

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
                    View students assigned to you and manage final
                    internship evaluation.
                  </p>

                </div>

                <div className="students-count-card">

                  <span>Total Assigned</span>

                  <strong>
                    {assignedStudents.length}
                  </strong>

                </div>

              </div>

              {message && (
                <div className="faculty-message">
                  {message}
                </div>
              )}

              {/* ================= SUMMARY ================= */}

              <div className="student-summary-grid faculty-student-summary-clean">

                <div className="student-summary-card">

                  <div className="summary-icon">
                    👨‍🎓
                  </div>

                  <div>
                    <span>Assigned Students</span>
                    <strong>
                      {assignedStudents.length}
                    </strong>
                  </div>

                </div>

                <div className="student-summary-card">

                  <div className="summary-icon">
                    🎓
                  </div>

                  <div>

                    <span>Completed</span>

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

                    <span>Marks Pending</span>

                    <strong>
                      {marksPendingAssignments.length}
                    </strong>

                  </div>

                </div>

              </div>

              {/* ================= ALL ASSIGNED STUDENTS ================= */}

              <div className="assigned-students-section faculty-student-directory-section">

                <div className="section-title-row">

                  <div>

                    <h2>Your Students</h2>

                    <p>
                      Each student appears once. Internship information
                      is shown only when an assignment exists.
                    </p>

                  </div>

                </div>

                {studentsWithAssignments.length === 0 ? (

                  <div className="faculty-empty students-empty">

                    <div className="empty-icon">
                      👨‍🎓
                    </div>

                    <h3>
                      No Students Assigned
                    </h3>

                    <p>
                      Students assigned to you by your college
                      will appear here.
                    </p>

                  </div>

                ) : (

                  <div className="faculty-card-list faculty-student-directory-list">

                    {studentsWithAssignments.map(
                      ({ student, assignment }) => {

                        const studentName =
                          student?.name ||
                          assignment?.student?.name ||
                          "Student";

                        const registerNumber =
                          student?.registerNumber ||
                          assignment?.student?.registerNumber ||
                          "Not available";

                        const hasAssignment =
                          Boolean(assignment);

                        const hasMark =
                          assignment?.mark !== undefined &&
                          assignment?.mark !== null;

                        return (

                          <div
                            className="faculty-student-card student-directory-card"
                            key={
                              student?._id ||
                              assignment?._id ||
                              registerNumber
                            }
                          >

                            <div className="student-card-header">

                              <div className="student-identity">

                                <div className="student-avatar">
                                  {studentName
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>

                                  <h2>
                                    {studentName}
                                  </h2>

                                  <span>
                                    Register No: {registerNumber}
                                  </span>

                                </div>

                              </div>

                              <span
                                className={`status-pill ${
                                  hasAssignment
                                    ? assignment.status
                                        ?.toLowerCase()
                                        .replace(/\s+/g, "-")
                                    : "not-assigned"
                                }`}
                              >
                                {hasAssignment
                                  ? assignment.status
                                  : "Internship Not Assigned"}
                              </span>

                            </div>

                            <div className="student-details-grid student-directory-details">

                              <div className="student-detail-item">

                                <span>
                                  Department
                                </span>

                                <strong>
                                  {student?.department ||
                                    assignment?.student?.department ||
                                    "Not available"}
                                </strong>

                              </div>

                              <div className="student-detail-item">

                                <span>
                                  Company
                                </span>

                                <strong>
                                  {assignment?.company?.companyName ||
                                    "Internship not assigned"}
                                </strong>

                              </div>

                              <div className="student-detail-item">

                                <span>
                                  Internship
                                </span>

                                <strong>
                                  {assignment?.internship?.title ||
                                    "Internship not assigned"}
                                </strong>

                              </div>

                              <div className="student-detail-item">

                                <span>
                                  Evaluation
                                </span>

                                <strong>
                                  {!hasAssignment
                                    ? "Not started"
                                    : hasMark
                                    ? `Mark: ${assignment.mark}`
                                    : assignment.status === "Completed"
                                    ? "Mark pending"
                                    : "Waiting for completion"}
                                </strong>

                              </div>

                            </div>

                            {student && (
                              <div className="student-directory-action">

                                <button
                                  type="button"
                                  className="view-student-details-btn"
                                  onClick={() =>
                                    setSelectedStudent(student)
                                  }
                                >
                                  View Details
                                </button>

                              </div>
                            )}

                          </div>

                        );
                      }
                    )}

                  </div>

                )}

              </div>

              {/* ================= MARKS PENDING ================= */}

              <div className="marks-pending-box">

                {/* CLICKABLE HEADER */}

                <button
                  type="button"
                  className="marks-pending-header"
                  onClick={() =>
                    setMarksPendingOpen(
                      (previous) => !previous
                    )
                  }
                >

                  <div className="marks-pending-header-left">

                    <div className="marks-pending-icon">
                      📝
                    </div>

                    <div>

                      <span className="marks-pending-label">
                        INTERNSHIP EVALUATION
                      </span>

                      <h3>
                        Marks Pending
                      </h3>

                      <p>
                        Students waiting for the final faculty mark
                      </p>

                    </div>

                  </div>

                  <div className="marks-pending-header-right">

                    <span className="marks-pending-number">
                      {marksPendingAssignments.length}
                    </span>

                    <span
                      className={`marks-pending-arrow ${
                        marksPendingOpen ? "open" : ""
                      }`}
                    >
                      ▼
                    </span>

                  </div>

                </button>

                {/* DROPDOWN CONTENT */}

                {marksPendingOpen && (

                  <div className="marks-pending-dropdown">

                    {marksPendingAssignments.length === 0 ? (

                      <div className="marks-pending-empty">

                        <div className="marks-pending-empty-icon">
                          ✓
                        </div>

                        <h3>
                          No Marks Pending
                        </h3>

                        <p>
                          All completed internships have been evaluated.
                        </p>

                      </div>

                    ) : (

                      <div className="marks-pending-list">

                        {marksPendingAssignments.map(
                          (application) => (

                            <div
                              className="marks-pending-card"
                              key={application._id}
                            >

                              {/* STUDENT */}

                              <div className="marks-pending-student">

                                <div className="student-avatar">

                                  {(application.student?.name ||
                                    "S")
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>

                                <div>

                                  <h3>
                                    {application.student?.name ||
                                      "Student"}
                                  </h3>

                                  <span>
                                    Register No:{" "}
                                    {application.student
                                      ?.registerNumber ||
                                      "Not available"}
                                  </span>

                                </div>

                              </div>

                              {/* DETAILS */}

                              <div className="marks-pending-details">

                                <div>

                                  <span>
                                    Company
                                  </span>

                                  <strong>
                                    {application.company
                                      ?.companyName ||
                                      "Not available"}
                                  </strong>

                                </div>

                                <div>

                                  <span>
                                    Internship
                                  </span>

                                  <strong>
                                    {application.internship
                                      ?.title ||
                                      "Not available"}
                                  </strong>

                                </div>

                                <div>

                                  <span>
                                    Department
                                  </span>

                                  <strong>
                                    {application.student
                                      ?.department ||
                                      "Not available"}
                                  </strong>

                                </div>

                                <div>

                                  <span>
                                    Credits
                                  </span>

                                  <strong>
                                    {application.credits || 2}
                                  </strong>

                                </div>

                              </div>

                              {/* MARK ENTRY */}

                              <div className="marks-pending-evaluation">

                                <div>

                                  <span className="evaluation-label">
                                    FINAL ASSESSMENT
                                  </span>

                                  <h4>
                                    Enter Final Mark
                                  </h4>

                                </div>

                                <div className="marks-pending-input-area">

                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="0 - 100"
                                    value={
                                      markInputs[
                                        application._id
                                      ] || ""
                                    }
                                    onChange={(event) =>
                                      setMarkInputs(
                                        (previous) => ({
                                          ...previous,
                                          [application._id]:
                                            event.target.value,
                                        })
                                      )
                                    }
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      saveMark(
                                        application._id
                                      )
                                    }
                                  >
                                    Save Mark
                                  </button>

                                </div>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                )}

              </div>

              {/* ================= STUDENT DETAILS MODAL ================= */}

              {selectedStudent && (

                <div
                  className="student-details-overlay"
                  onClick={() =>
                    setSelectedStudent(null)
                  }
                >

                  <div
                    className="student-details-modal"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >

                    <div className="student-details-modal-header">

                      <div>

                        <p className="faculty-eyebrow">
                          STUDENT PROFILE
                        </p>

                        <h2>
                          {selectedStudent.name}
                        </h2>

                        <p>
                          {selectedStudent.department}
                        </p>

                      </div>

                      <button
                        type="button"
                        className="student-details-close-btn"
                        onClick={() =>
                          setSelectedStudent(null)
                        }
                        aria-label="Close student details"
                      >
                        ×
                      </button>

                    </div>

                    <div className="student-details-modal-grid">

                      <div>
                        <span>Name</span>

                        <strong>
                          {selectedStudent.name ||
                            "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>Register Number</span>

                        <strong>
                          {selectedStudent.registerNumber ||
                            "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>Email</span>

                        <strong>
                          {selectedStudent.email ||
                            "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>Department</span>

                        <strong>
                          {selectedStudent.department ||
                            "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>Semester</span>

                        <strong>
                          {selectedStudent.semester ??
                            "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>Phone</span>

                        <strong>
                          {selectedStudent.phone ||
                            "Not available"}
                        </strong>
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
                        onClick={() =>
                          setSelectedStudent(null)
                        }
                      >
                        Close
                      </button>

                    </div>

                  </div>

                </div>

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

                      <h1>
                        Attendance Verification
                      </h1>

                      <p>
                        Review attendance marked by the company guide.
                      </p>

                    </div>

                  </div>

                  {message && (
                    <div className="faculty-message">
                      {message}
                    </div>
                  )}

                  {applications.length === 0 ? (

                    <div className="faculty-empty">

                      <div>🕒</div>

                      <h3>
                        No Assigned Internships
                      </h3>

                      <p>
                        Assigned internship attendance will appear here.
                      </p>

                    </div>

                  ) : (

                    <div className="faculty-attendance-list">

                      {applications.map(
                        (application) => (

                          <div
                            className="faculty-student-card attendance-card"
                            key={application._id}
                          >

                            <div className="student-card-header">

                              <div className="student-identity">

                                <div className="student-avatar">
                                  {(application.student?.name ||
                                    "S")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>

                                  <h3>
                                    {application.student?.name ||
                                      "Student"}
                                  </h3>

                                  <span>
                                    Register No:{" "}
                                    {application.student
                                      ?.registerNumber ||
                                      "Not available"}
                                  </span>

                                </div>

                              </div>

                              <span
                                className={`status-pill status-${(
                                  application.status ||
                                  "Assigned"
                                ).toLowerCase()}`}
                              >
                                {application.status ||
                                  "Assigned"}
                              </span>

                            </div>

                            <div className="student-details-grid">

                              <div className="student-detail-item">

                                <span>
                                  Company
                                </span>

                                <strong>
                                  {application.company
                                    ?.companyName ||
                                    "Not available"}
                                </strong>

                              </div>

                              <div className="student-detail-item">

                                <span>
                                  Internship
                                </span>

                                <strong>
                                  {application.internship?.title ||
                                    application.internship?.position ||
                                    "Not available"}
                                </strong>

                              </div>

                              <div className="student-detail-item">

                                <span>
                                  Faculty Guide
                                </span>

                                <strong>
                                  {application.facultyGuide?.name ||
                                    "You"}
                                </strong>

                              </div>

                              <div className="student-detail-item">

                                <span>
                                  Credits
                                </span>

                                <strong>
                                  {application.credits ?? 0}
                                </strong>

                              </div>

                            </div>

                            <div className="attendance-card-action">

                              <button
                                type="button"
                                className="save-mark-button"
                                onClick={() =>
                                  openAttendance(application)
                                }
                              >
                                View Attendance →
                              </button>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </>

              ) : (

                <>

                  <div className="faculty-page-heading attendance-detail-heading">

                    <div>

                      <button
                        type="button"
                        className="attendance-back-button"
                        onClick={closeAttendance}
                      >
                        ← Back to Attendance
                      </button>

                      <p className="faculty-eyebrow">
                        ATTENDANCE VERIFICATION
                      </p>

                      <h1>
                        {selectedAttendanceAssignment
                          .student?.name ||
                          "Student"}
                      </h1>

                      <p>
                        Review and verify company guide attendance records.
                      </p>

                    </div>

                  </div>

                  {message && (
                    <div className="faculty-message">
                      {message}
                    </div>
                  )}

                  <div className="faculty-profile-card attendance-profile-card">

                    <div className="profile-header">

                      <div className="profile-avatar-large">

                        {(
                          selectedAttendanceAssignment
                            .student?.name ||
                          "S"
                        )
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                      <div className="profile-header-info">

                        <h2>
                          {selectedAttendanceAssignment
                            .student?.name ||
                            "Student"}
                        </h2>

                        <p>
                          Register No:{" "}
                          {selectedAttendanceAssignment
                            .student?.registerNumber ||
                            "Not available"}
                        </p>

                        <span className="profile-status">
                          {selectedAttendanceAssignment.status ||
                            "Assigned"}
                        </span>

                      </div>

                    </div>

                    <div className="profile-details">

                      <div className="profile-field">

                        <span>
                          Company
                        </span>

                        <strong>
                          {selectedAttendanceAssignment
                            .company?.companyName ||
                            "Not available"}
                        </strong>

                      </div>

                      <div className="profile-field">

                        <span>
                          Internship
                        </span>

                        <strong>
                          {selectedAttendanceAssignment
                            .internship?.title ||
                            selectedAttendanceAssignment
                              .internship?.position ||
                            "Not available"}
                        </strong>

                      </div>

                      <div className="profile-field">

                        <span>
                          Department
                        </span>

                        <strong>
                          {selectedAttendanceAssignment
                            .student?.department ||
                            "Not available"}
                        </strong>

                      </div>

                    </div>

                  </div>

                  {attendanceLoading ? (

                    <div className="faculty-empty">

                      <div>⏳</div>

                      <h3>
                        Loading Attendance...
                      </h3>

                    </div>

                  ) : attendanceRecords.length === 0 ? (

                    <div className="faculty-empty">

                      <div>🕒</div>

                      <h3>
                        No Attendance Records
                      </h3>

                      <p>
                        The company guide has not marked attendance yet.
                      </p>

                    </div>

                  ) : (

                    <div className="faculty-attendance-records">

                      {attendanceRecords.map(
                        (record) => (

                          <div
                            className="faculty-student-card attendance-record-card"
                            key={record._id}
                          >

                            <div className="attendance-record-header">

                              <div>

                                <h3>
                                  {record.date
                                    ? new Date(
                                        record.date
                                      ).toLocaleDateString()
                                    : "Date unavailable"}
                                </h3>

                                <span>
                                  {record.status ||
                                    "Present"}
                                </span>

                              </div>

                              <span
                                className={`attendance-verification-status ${String(
                                  record.verificationStatus ||
                                    "Pending"
                                ).toLowerCase()}`}
                              >
                                {record.verificationStatus ||
                                  "Pending"}
                              </span>

                            </div>

                            <div className="student-details-grid">

                              <div className="student-detail-item">

                                <span>
                                  Check In
                                </span>

                                <strong>
                                  {record.checkIn || "—"}
                                </strong>

                              </div>

                              <div className="student-detail-item">

                                <span>
                                  Check Out
                                </span>

                                <strong>
                                  {record.checkOut || "—"}
                                </strong>

                              </div>

                              <div className="student-detail-item">

                                <span>
                                  Total Hours
                                </span>

                                <strong>
                                  {record.totalHours || 0} hours
                                </strong>

                              </div>

                              <div className="student-detail-item">

                                <span>
                                  Status
                                </span>

                                <strong>
                                  {record.status ||
                                    "Present"}
                                </strong>

                              </div>

                            </div>

                            {record.verificationStatus ===
                            "Pending" ? (

                              <div className="attendance-verification-actions">

                                <button
                                  type="button"
                                  className="approve-btn"
                                  onClick={() =>
                                    verifyAttendance(
                                      record._id,
                                      "Approved"
                                    )
                                  }
                                >
                                  ✓ Approve Attendance
                                </button>

                                <button
                                  type="button"
                                  className="reject-btn"
                                  onClick={() =>
                                    verifyAttendance(
                                      record._id,
                                      "Rejected"
                                    )
                                  }
                                >
                                  ✕ Reject Attendance
                                </button>

                              </div>

                            ) : (

                              <div className="attendance-reviewed-message">

                                {record.verificationStatus ===
                                "Approved"
                                  ? "✓ Attendance approved"
                                  : "Attendance rejected"}

                              </div>

                            )}

                          </div>

                        )
                      )}

                    </div>

                  )}

                </>

              )}

            </section>

          )}

          {/* ================= LOGBOOKS ================= */}

          {activeSection === "logbooks" && (

            <section className="faculty-logbook-page">

              <div className="faculty-page-heading">

                <div>

                  <p className="faculty-eyebrow">
                    INTERNSHIP MONITORING
                  </p>

                  <h1>
                    Logbook Review
                  </h1>

                  <p>
                    Select a student to view and review their internship
                    logbook entries.
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

                  <div>📖</div>

                  <h3>
                    No Logbooks Available
                  </h3>

                  <p>
                    Student logbook entries will appear here after
                    they are submitted and verified by the company guide.
                  </p>

                </div>

              ) : (

                <div className="logbook-student-accordion-list">

                  {Array.from(
                    new Map(
                      logbooks
                        .filter(
                          (logbook) =>
                            logbook.student?._id ||
                            logbook.student?.id
                        )
                        .map((logbook) => [
                          String(
                            logbook.student?._id ||
                              logbook.student?.id
                          ),
                          logbook.student,
                        ])
                    ).values()
                  ).map((student) => {

                    const studentId = String(
                      student?._id ||
                        student?.id ||
                        ""
                    );

                    const studentRegister = String(
                      student?.registerNumber || ""
                    )
                      .trim()
                      .toLowerCase();

                    const studentName = String(
                      student?.name || ""
                    )
                      .trim()
                      .toLowerCase();

                    const studentLogbooks =
                      logbooks.filter((logbook) => {

                        const logbookStudent =
                          logbook.student;

                        const logbookStudentId =
                          String(
                            logbookStudent?._id ||
                              logbookStudent?.id ||
                              (typeof logbookStudent ===
                              "string"
                                ? logbookStudent
                                : "")
                          );

                        const logbookRegister =
                          String(
                            logbookStudent
                              ?.registerNumber || ""
                          )
                            .trim()
                            .toLowerCase();

                        const logbookName =
                          String(
                            logbookStudent?.name || ""
                          )
                            .trim()
                            .toLowerCase();

                        if (
                          studentId &&
                          logbookStudentId &&
                          logbookStudentId ===
                            studentId
                        ) {
                          return true;
                        }

                        if (
                          studentRegister &&
                          logbookRegister &&
                          logbookRegister ===
                            studentRegister
                        ) {
                          return true;
                        }

                        if (
                          studentName &&
                          logbookName &&
                          logbookName ===
                            studentName
                        ) {
                          return true;
                        }

                        return false;
                      });

                    const isExpanded =
                      !!expandedLogbooks[
                        studentId
                      ];

                    return (

                      <div
                        className="logbook-student-accordion"
                        key={studentId}
                      >

                        <button
                          type="button"
                          className="logbook-student-accordion-header"
                          onClick={() =>
                            setExpandedLogbooks(
                              (prev) => ({
                                ...prev,
                                [studentId]:
                                  !prev[studentId],
                              })
                            )
                          }
                        >

                          <div className="logbook-student-box-avatar">
                            {(student?.name ||
                              "S")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="logbook-student-accordion-info">

                            <h3>
                              {student?.name ||
                                "Student"}
                            </h3>

                            <p>
                              {student?.department ||
                                "Department not available"}
                            </p>

                            <span>
                              Register No:{" "}
                              {student?.registerNumber ||
                                "Not available"}
                            </span>

                          </div>

                          <div className="logbook-student-accordion-right">

                            <span className="logbook-entry-count-small">
                              {studentLogbooks.length}{" "}
                              {studentLogbooks.length === 1
                                ? "Entry"
                                : "Entries"}
                            </span>

                            <span className="logbook-dropdown-icon">
                              {isExpanded
                                ? "▲"
                                : "▼"}
                            </span>

                          </div>

                        </button>

                        {isExpanded && (

                          <div className="logbook-student-accordion-content">

                            {studentLogbooks.length ===
                            0 ? (

                              <div className="faculty-empty">

                                <div>📖</div>

                                <h3>
                                  No Logbook Entries
                                </h3>

                                <p>
                                  This student does not
                                  have any logbook entries
                                  available for review.
                                </p>

                              </div>

                            ) : (

                              <div className="faculty-logbook-list">

                                {studentLogbooks.map(
                                  (
                                    logbook,
                                    index
                                  ) => (

                                    <div
                                      className="faculty-logbook-card"
                                      key={
                                        logbook._id ||
                                        `logbook-${studentId}-${index}`
                                      }
                                    >

                                      <div className="logbook-header">

                                        <div>

                                          <h2>
                                            {logbook
                                              .student
                                              ?.name ||
                                              student?.name ||
                                              "Student"}
                                          </h2>

                                          <span>
                                            Register No:{" "}
                                            {logbook
                                              .student
                                              ?.registerNumber ||
                                              student?.registerNumber ||
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
                                            {logbook
                                              .internship
                                              ?.title ||
                                              logbook
                                                .internship
                                                ?.position ||
                                              "Not available"}
                                          </strong>

                                        </div>

                                        <div>

                                          <span>
                                            Hours Worked
                                          </span>

                                          <strong>
                                            {logbook.hoursWorked ||
                                              0}{" "}
                                            hours
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
                                      logbook.facultyStatus ===
                                        "Pending" ? (

                                        <div className="logbook-actions">

                                          <button
                                            type="button"
                                            className="approve-btn"
                                            onClick={() =>
                                              approveLogbook(
                                                logbook._id
                                              )
                                            }
                                          >
                                            ✓ Approve
                                          </button>

                                          <button
                                            type="button"
                                            className="reject-btn"
                                            onClick={() =>
                                              rejectLogbook(
                                                logbook._id
                                              )
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

                                  )
                                )}

                              </div>

                            )}

                          </div>

                        )}

                      </div>

                    );
                  })}

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
                      {faculty?.name ||
                        "Not available"}
                    </strong>

                  </div>

                  <div className="profile-field">

                    <span>
                      Email Address
                    </span>

                    <strong>
                      {faculty?.email ||
                        "Not available"}
                    </strong>

                  </div>

                  <div className="profile-field">

                    <span>
                      Department
                    </span>

                    <strong>
                      {faculty?.department ||
                        "Not available"}
                    </strong>

                  </div>

                  <div className="profile-field">

                    <span>
                      Phone Number
                    </span>

                    <strong>
                      {faculty?.phone ||
                        "Not available"}
                    </strong>

                  </div>

                  <div className="profile-field">

                    <span>
                      Designation
                    </span>

                    <strong>
                      {faculty?.designation ||
                        "Faculty"}
                    </strong>

                  </div>

                </div>

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