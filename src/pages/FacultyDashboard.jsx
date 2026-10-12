import { useEffect, useState } from "react";
import "../css/FacultyDashboard.css";
import BrandLogo from "../components/BrandLogo.jsx";
import ChangePassword from "./ChangePassword";
import NotificationCenter from "../components/NotificationCenter.jsx";

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
  const [studentListFilter, setStudentListFilter] = useState("all");

  // =========================
  // ATTENDANCE STATE
  // =========================

  const [selectedAttendanceAssignment, setSelectedAttendanceAssignment] =
    useState(null);
  const [expandedAttendanceByAssignment, setExpandedAttendanceByAssignment] =
    useState({});
  const [attendanceRecordsByAssignment, setAttendanceRecordsByAssignment] =
    useState({});
  const [attendanceLoadingByAssignment, setAttendanceLoadingByAssignment] =
    useState({});

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // Always start the Logbook Review page with the student list.
  useEffect(() => {
    if (activeSection !== "logbooks") {
      setSelectedLogbookStudent(null);
    }
    if (activeSection !== "attendance") {
      setExpandedAttendanceByAssignment({});
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
        fetchAssignedStudents();
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
        fetchAssignedStudents();
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
      setAttendanceLoadingByAssignment((previous) => ({
        ...previous,
        [assignmentId]: true,
      }));

      const response = await fetch(
        `http://localhost:5000/api/attendance/faculty/${assignmentId}`
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        const records = data.attendance || data.records || [];
        setAttendanceRecords(records);
        setAttendanceRecordsByAssignment((previous) => ({
          ...previous,
          [assignmentId]: records,
        }));
      } else {
        setAttendanceRecords([]);
        setAttendanceRecordsByAssignment((previous) => ({
          ...previous,
          [assignmentId]: [],
        }));
        setMessage(
          data.message || "Unable to load attendance."
        );
      }
    } catch (error) {
      console.error("Fetch attendance error:", error);
      setAttendanceRecords([]);
      setAttendanceRecordsByAssignment((previous) => ({
        ...previous,
        [assignmentId]: [],
      }));
      setMessage("Unable to load attendance.");
    } finally {
      setAttendanceLoading(false);
      setAttendanceLoadingByAssignment((previous) => ({
        ...previous,
        [assignmentId]: false,
      }));
    }
  };

  const openAttendance = async (assignment) => {
    setSelectedAttendanceAssignment(assignment);
    setExpandedAttendanceByAssignment((previous) => ({
      ...previous,
      [assignment._id]: true,
    }));
    setMessage("");

    if (!Object.prototype.hasOwnProperty.call(attendanceRecordsByAssignment, assignment._id)) {
      setAttendanceRecords([]);
      await fetchAttendance(assignment._id);
    }
  };

  const closeAttendance = (assignmentId) => {
    setExpandedAttendanceByAssignment((previous) => ({
      ...previous,
      [assignmentId]: false,
    }));
    setMessage("");
  };

  const verifyAttendance = async (
    attendanceId,
    verificationStatus,
    assignmentId = selectedAttendanceAssignment?._id
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

        if (assignmentId) {
          await fetchAttendance(assignmentId);
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

  const filteredStudents = studentsWithAssignments.filter(
    ({ assignment }) => {
      if (studentListFilter === "completed") {
        return assignment?.status === "Completed";
      }

      if (studentListFilter === "marksPending") {
        return marksPendingAssignments.includes(assignment);
      }

      return true;
    }
  );




  return (
    <div className="faculty-layout">
      <aside className="faculty-sidebar">
        <div className="faculty-student-brand">
          <BrandLogo className="faculty-brand-logo" />
          <div className="faculty-brand-copy">
            <strong>InternLink</strong>
            <small>FYUGP INTERNSHIP PLATFORM</small>
          </div>
        </div>
        <div className="faculty-sidebar-divider" />
        <div className="faculty-sidebar-title">WORKSPACE</div>
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

            <NotificationCenter onNavigate={(target) => {
              if (target === "logbooks") onGoToLogbooks();
              if (target === "attendance") onGoToAttendance();
            }} />

        </nav>
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
            <button type="button" className="faculty-bottom-action" onClick={onGoToChangePassword}>🔐 <span>Change Password</span></button>
            <button type="button" className="faculty-bottom-action faculty-bottom-logout" onClick={onLogout}>↪ <span>Logout</span></button>
          </div>
      </aside>

      <main className="faculty-main">
        <header className="faculty-header">
          <div>
            <div className="faculty-page-label">FYUGP FACULTY WORKSPACE</div>
            <h1>{activeSection === "students" ? "Assigned Students" : activeSection === "attendance" ? "Attendance" : activeSection === "logbooks" ? "Logbook Review" : activeSection === "profile" ? "My Profile" : activeSection === "editProfile" ? "Edit Profile" : activeSection === "changePassword" ? "Change Password" : "Home"}</h1>
          </div>
          <div className="faculty-header-right">
            <div className="faculty-header-welcome">Welcome back</div>
            <div className="faculty-avatar">{getInitials()}</div>
          </div>
        </header>
        <div className="faculty-content">

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
          Manage student guidance, internship progress, applications,
          and academic supervision from one place.
        </p>

        <div className="faculty-dashboard-home-accent">
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>


      <div className="faculty-dashboard-home-visual">
        <img
          src="/internlink-student-career.svg"
          alt="Academic guidance connecting a student’s internship experience with career growth"
        />
      </div>

    </div>

  </section>
)}
{activeSection === "dashboard" && (
  <section className="faculty-dashboard-landing" aria-label="Faculty welcome">
    <div className="faculty-landing-feature-grid">
      <article className="faculty-landing-feature">
        <span className="faculty-landing-feature-icon">♙</span>
        <h2>Student guidance</h2>
        <p>Help students stay focused and supported throughout their internship journey.</p>
      </article>
      <article className="faculty-landing-feature">
        <span className="faculty-landing-feature-icon coral">▣</span>
        <h2>Internship monitoring</h2>
        <p>Encourage steady progress through regular academic supervision.</p>
      </article>
      <article className="faculty-landing-feature">
        <span className="faculty-landing-feature-icon mint">✦</span>
        <h2>Academic supervision</h2>
        <p>Support meaningful learning and successful internship completion.</p>
      </article>
    </div>

    <aside className="faculty-landing-guidance">
      <span className="faculty-landing-guidance-mark">i</span>
      <div>
        <p className="faculty-eyebrow">FACULTY WORKSPACE</p>
        <h2>Your work, all in one place</h2>
        <p>Use the navigation menu to manage students, review applications, monitor internship activities, and track student progress.</p>
      </div>
    </aside>
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
                    View and manage students assigned to you for internship guidance and supervision.
                  </p>

                </div>

              </div>

              {message && (
                <div className="faculty-message">
                  {message}
                </div>
              )}

              {/* ================= SUMMARY ================= */}

              <div className="student-summary-grid faculty-student-summary-clean">

                <button
                  type="button"
                  className={`student-summary-card ${studentListFilter === "all" ? "active" : ""}`}
                  onClick={() => setStudentListFilter("all")}
                  aria-pressed={studentListFilter === "all"}
                >

                  <div className="summary-icon">
                    👨‍🎓
                  </div>

                  <div>
                    <span>All Students</span>
                    <strong>
                      {studentsWithAssignments.length}
                    </strong>
                  </div>

                </button>

                <button
                  type="button"
                  className={`student-summary-card ${studentListFilter === "completed" ? "active" : ""}`}
                  onClick={() => setStudentListFilter("completed")}
                  aria-pressed={studentListFilter === "completed"}
                >

                  <div className="summary-icon">
                    🎓
                  </div>

                  <div>

                    <span>Completed Students</span>

                    <strong>
                      {studentsWithAssignments.filter(
                        ({ assignment }) =>
                          assignment?.status === "Completed"
                      ).length}
                    </strong>

                  </div>

                </button>

                <button
                  type="button"
                  className={`student-summary-card ${studentListFilter === "marksPending" ? "active" : ""}`}
                  onClick={() => setStudentListFilter("marksPending")}
                  aria-pressed={studentListFilter === "marksPending"}
                >

                  <div className="summary-icon">
                    📝
                  </div>

                  <div>

                    <span>Mark Pending</span>

                    <strong>
                      {studentsWithAssignments.filter(
                        ({ assignment }) =>
                          marksPendingAssignments.includes(assignment)
                      ).length}
                    </strong>

                  </div>

                </button>

              </div>

              {/* ================= ALL ASSIGNED STUDENTS ================= */}

              <div className="assigned-students-section faculty-student-directory-section">

                <div className="section-title-row">

                  <div>

                    <h2>{studentListFilter === "all" ? "Your Students" : studentListFilter === "completed" ? "Completed Students" : "Students with Marks Pending"}</h2>

                    <p>
                      Showing {filteredStudents.length} {filteredStudents.length === 1 ? "student" : "students"}.
                    </p>

                  </div>

                </div>

                {filteredStudents.length === 0 ? (

                  <div className="faculty-empty students-empty">

                    <div className="empty-icon">
                      👨‍🎓
                    </div>

                    <h3>
                      {studentListFilter === "completed"
                        ? "No Completed Students"
                        : studentListFilter === "marksPending"
                        ? "No Pending Marks"
                        : "No Students Assigned"}
                    </h3>

                    <p>
                      {studentListFilter === "completed"
                        ? "There are currently no students who have completed their internship."
                        : studentListFilter === "marksPending"
                        ? "All completed student marks have been updated."
                        : "Students assigned to you by your college will appear here."}
                    </p>

                  </div>

                ) : (

                  <div className="faculty-card-list faculty-student-directory-list">

                    {filteredStudents.map(
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
            <section className="faculty-attendance-page">
              <div className="faculty-page-heading">
                <div>
                  <p className="faculty-eyebrow">INTERNSHIP MONITORING</p>
                  <h1>Attendance Sheet</h1>
                  <p>Select an assigned student to review their daily attendance register.</p>
                </div>
              </div>

              {message && <div className="faculty-message">{message}</div>}

              {applications.length === 0 ? (
                <div className="faculty-empty">
                  <div>◷</div>
                  <h3>No Assigned Internships</h3>
                  <p>Assigned internship attendance will appear here.</p>
                </div>
              ) : (
                <div className="faculty-attendance-list">
                  {applications.map((application) => {
                    const isExpanded = Boolean(
                      expandedAttendanceByAssignment[application._id]
                    );
                    const records = attendanceRecordsByAssignment[application._id] ?? (
                      selectedAttendanceAssignment?._id === application._id
                        ? attendanceRecords
                        : []
                    );
                    const isLoading = Boolean(
                      attendanceLoadingByAssignment[application._id] ||
                      (selectedAttendanceAssignment?._id === application._id && attendanceLoading)
                    );

                    return (
                      <article
                        className={`faculty-student-card attendance-card ${isExpanded ? "expanded" : ""}`}
                        key={application._id}
                      >
                        <div className="student-card-header">
                          <div className="student-identity">
                            <div className="student-avatar">
                              {(application.student?.name || "S").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3>{application.student?.name || "Student"}</h3>
                              <span>Register No: {application.student?.registerNumber || "Not available"}</span>
                            </div>
                          </div>
                          <span className={`status-pill status-${(application.status || "Assigned").toLowerCase()}`}>
                            {application.status || "Assigned"}
                          </span>
                        </div>

                        <div className="student-details-grid attendance-summary-details">
                          <div className="student-detail-item">
                            <span>Company</span>
                            <strong>{application.company?.companyName || "Not available"}</strong>
                          </div>
                          <div className="student-detail-item">
                            <span>Internship</span>
                            <strong>{application.internship?.title || application.internship?.position || "Not available"}</strong>
                          </div>
                          <div className="student-detail-item">
                            <span>Department</span>
                            <strong>{application.student?.department || "Not available"}</strong>
                          </div>
                        </div>

                        {!isExpanded && (
                          <div className="attendance-card-action">
                            <button
                              type="button"
                              className="save-mark-button"
                              aria-expanded="false"
                              onClick={() => openAttendance(application)}
                            >
                              View Attendance
                            </button>
                          </div>
                        )}

                        {isExpanded && (
                          <section className="attendance-inline-details" aria-label={`Attendance details for ${application.student?.name || "student"}`}>
                            <div className="attendance-inline-heading">
                              <h2>Attendance Sheet</h2>
                              <button
                                type="button"
                                className="attendance-minimize-button"
                                onClick={() => closeAttendance(application._id)}
                                aria-label={`Minimize attendance details for ${application.student?.name || "student"}`}
                              >
                                Minimize
                              </button>
                            </div>

                            <div className="attendance-sheet-summary" aria-label="Selected student and internship">
                              <div><span>Student Name</span><strong>{application.student?.name || "Student"}</strong></div>
                              <div><span>Register Number</span><strong>{application.student?.registerNumber || "Not available"}</strong></div>
                              <div><span>Internship Title</span><strong>{application.internship?.title || application.internship?.position || "Not available"}</strong></div>
                              <div><span>Company Name</span><strong>{application.company?.companyName || "Not available"}</strong></div>
                              <div><span>Faculty Guide</span><strong>{application.facultyGuide?.name || "You"}</strong></div>
                            </div>

                            {isLoading ? (
                              <div className="faculty-empty attendance-inline-empty">
                                <h3>Loading Attendance...</h3>
                              </div>
                            ) : records.length === 0 ? (
                              <div className="faculty-empty attendance-inline-empty">
                                <h3>No Attendance Records</h3>
                                <p>The company guide has not marked attendance yet.</p>
                              </div>
                            ) : (
                              <div className="attendance-sheet-scroll" role="region" aria-label={`Daily attendance register for ${application.student?.name || "student"}`} tabIndex="0">
                                <table className="attendance-sheet-table">
                                  <thead>
                                    <tr>
                                      <th scope="col">Date</th>
                                      <th scope="col">Day</th>
                                      <th scope="col">Check In</th>
                                      <th scope="col">Check Out</th>
                                      <th scope="col">Hours</th>
                                      <th scope="col">Status</th>
                                      <th scope="col">Review</th>
                                      <th scope="col">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {records.map((record) => {
                                      const date = record.date ? new Date(record.date) : null;
                                      const validDate = date && !Number.isNaN(date.getTime());
                                      return (
                                        <tr key={record._id}>
                                          <td>{validDate ? date.toLocaleDateString() : "Date unavailable"}</td>
                                          <td>{validDate ? date.toLocaleDateString(undefined, { weekday: "long" }) : "—"}</td>
                                          <td>{record.checkIn || "—"}</td>
                                          <td>{record.checkOut || "—"}</td>
                                          <td>{record.totalHours ?? "—"}</td>
                                          <td><span className="attendance-sheet-status">{record.status || "Present"}</span></td>
                                          <td>
                                            <span className={`attendance-verification-status ${String(record.verificationStatus || "Pending").toLowerCase()}`}>
                                              {record.verificationStatus || "Pending"}
                                            </span>
                                          </td>
                                          <td>
                                            {record.verificationStatus === "Pending" ? (
                                              <div className="attendance-verification-actions">
                                                <button type="button" className="approve-btn" onClick={() => verifyAttendance(record._id, "Approved", application._id)}>
                                                  ✓ Approve
                                                </button>
                                                <button type="button" className="reject-btn" onClick={() => verifyAttendance(record._id, "Rejected", application._id)}>
                                                  ✕ Reject
                                                </button>
                                              </div>
                                            ) : (
                                              <span className="attendance-reviewed-message">
                                                {record.verificationStatus === "Approved" ? "✓ Approved" : "Rejected"}
                                              </span>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </section>
                        )}
                      </article>
                    );
                  })}
                </div>
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
                                      className="faculty-logbook-card logbook-book-page"
                                      key={
                                        logbook._id ||
                                        `logbook-${studentId}-${index}`
                                      }
                                    >

                                      <div className="logbook-header">

                                        <div>

                                          <div className="logbook-entry-title-row">
                                            <h2>Internship Log Book</h2>
                                            <span className="logbook-page-number">Page {index + 1}</span>
                                          </div>

                                        </div>

                                        <div className="logbook-date-block">
                                          <span className="logbook-date-label">Logbook Date</span>
                                          <span className="date-pill">
                                            {logbook.date
                                              ? new Date(logbook.date).toLocaleDateString()
                                              : "Date unavailable"}
                                          </span>
                                          {logbook.date && !Number.isNaN(new Date(logbook.date).getTime()) && (
                                            <span className="logbook-day-label">
                                              {new Date(logbook.date).toLocaleDateString(undefined, { weekday: "long" })}
                                            </span>
                                          )}
                                        </div>

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

        </div>
        <footer className="faculty-footer"><span>© InternLink</span><span>FYUGP Internship Management Platform</span></footer>
      </main>
    </div>
  );
}

export default FacultyDashboard;
