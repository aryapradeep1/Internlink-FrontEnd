import React, { useEffect, useState } from "react";
import "../css/CompanyGuideDashboard.css";

function CompanyGuideDashboard({
  guide,
  onLogout,
  onGoToProfile,
  onGoToDashboard,
  onGoToAssignedStudents,
  onGoToLogbooks,
  onGoToEditProfile,
  onGoToChangePassword,
  activeSection,
  children,
}) {
  const [assignments, setAssignments] = useState([]);
  const [logbooks, setLogbooks] = useState([]);

  const [loadingAssignments, setLoadingAssignments] =
    useState(true);

  const [loadingLogbooks, setLoadingLogbooks] =
    useState(true);

  const [error, setError] = useState("");

  const [profile, setProfile] = useState(guide);
  const [loadingProfile, setLoadingProfile] =
    useState(false);
  const [profileError, setProfileError] =
    useState("");

  /* =========================================================
     ATTENDANCE STATE
  ========================================================= */

  const [attendance, setAttendance] = useState([]);

  const [loadingAttendance, setLoadingAttendance] =
    useState(false);

  const [
    selectedAttendanceAssignment,
    setSelectedAttendanceAssignment,
  ] = useState(null);

  const [attendanceForm, setAttendanceForm] =
    useState({
      date: new Date()
        .toISOString()
        .split("T")[0],
      status: "Present",
      checkIn: "",
      checkOut: "",
    });

  const [submittingAttendance, setSubmittingAttendance] =
    useState(false);

  const [attendanceError, setAttendanceError] =
    useState("");

  const [attendanceSuccess, setAttendanceSuccess] =
    useState("");

  /*
    Local navigation is used for Assigned Students,
    Attendance and Logbooks so these sections remain
    inside this dashboard.
  */
  const [localSection, setLocalSection] =
    useState(null);

  const currentSection =
    localSection || activeSection || "dashboard";

  const guideId = guide?.id || guide?._id;

  // ==========================================
  // FETCH COMPANY GUIDE PROFILE
  // ==========================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!guideId) {
          setProfileError(
            "Company Guide information not found"
          );
          return;
        }

        setLoadingProfile(true);
        setProfileError("");

        const response = await fetch(
          `http://localhost:5000/api/company-guides/profile/${guideId}`
        );

        const data = await response.json();

        if (data.status === "success") {
          setProfile(data.guide);
        } else {
          setProfileError(
            data.message ||
              "Failed to load profile"
          );
        }
      } catch (error) {
        console.error(
          "Company Guide Profile Error:",
          error
        );

        setProfileError(
          "Unable to load Company Guide profile"
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [guideId]);

  // ==========================================
  // FETCH ASSIGNED STUDENTS
  // ==========================================
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if (!guideId) {
          setLoadingAssignments(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/internship-assignments/company-guide/${guideId}`
        );

        const data = await response.json();

        if (response.ok) {
          setAssignments(data.assignments || []);
        } else {
          setError(
            data.message ||
              "Failed to load assigned students"
          );
        }
      } catch (error) {
        console.error(
          "Company Guide Assignments Error:",
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

  // ==========================================
  // FETCH LOGBOOKS
  // ==========================================
  useEffect(() => {
    const fetchLogbooks = async () => {
      try {
        if (!guideId) {
          setLoadingLogbooks(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/logbook/company-guide/${guideId}`
        );

        const data = await response.json();

        if (response.ok) {
          setLogbooks(data.logbooks || []);
        } else {
          setError(
            data.message ||
              "Failed to load logbooks"
          );
        }
      } catch (error) {
        console.error(
          "Company Guide Logbooks Error:",
          error
        );

        setError(
          "Unable to load logbooks"
        );
      } finally {
        setLoadingLogbooks(false);
      }
    };

    fetchLogbooks();
  }, [guideId]);

  // ==========================================
  // APPROVE LOGBOOK
  // ==========================================
  const handleApprove = async (logbookId) => {
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
        setLogbooks((prev) =>
          prev.map((logbook) =>
            (logbook._id || logbook.id) ===
            logbookId
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

      alert(
        "Unable to approve logbook"
      );
    }
  };

  // ==========================================
  // REJECT LOGBOOK
  // ==========================================
  const handleReject = async (logbookId) => {
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
        setLogbooks((prev) =>
          prev.map((logbook) =>
            (logbook._id || logbook.id) ===
            logbookId
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

      alert(
        "Unable to reject logbook"
      );
    }
  };

  // ==========================================
  // FETCH ATTENDANCE
  // ==========================================
  const fetchAttendance = async (
    assignmentId
  ) => {
    try {
      if (!assignmentId) return;

      setLoadingAttendance(true);
      setAttendanceError("");
      setAttendanceSuccess("");

      const response = await fetch(
        `http://localhost:5000/api/attendance/company-guide/${assignmentId}`
      );

      const data = await response.json();

      if (response.ok) {
        setAttendance(
          data.attendance || []
        );
      } else {
        setAttendanceError(
          data.message ||
            "Failed to load attendance"
        );
      }
    } catch (error) {
      console.error(
        "Company Guide Attendance Error:",
        error
      );

      setAttendanceError(
        "Unable to load attendance"
      );
    } finally {
      setLoadingAttendance(false);
    }
  };

  // ==========================================
  // OPEN ATTENDANCE
  // ==========================================
  const openAttendance = (
    assignment
  ) => {
    setSelectedAttendanceAssignment(
      assignment
    );

    setAttendanceForm({
      date: new Date()
        .toISOString()
        .split("T")[0],
      status: "Present",
      checkIn: "",
      checkOut: "",
    });

    setAttendanceError("");
    setAttendanceSuccess("");

    fetchAttendance(
      assignment._id ||
        assignment.id
    );
  };

  // ==========================================
  // HANDLE ATTENDANCE CHANGE
  // ==========================================
  const handleAttendanceChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setAttendanceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // MARK ATTENDANCE
  // ==========================================
  const handleMarkAttendance = async (
    event
  ) => {
    event.preventDefault();

    if (
      !selectedAttendanceAssignment
    ) {
      return;
    }

    try {
      setSubmittingAttendance(true);
      setAttendanceError("");
      setAttendanceSuccess("");

      const assignmentId =
        selectedAttendanceAssignment._id ||
        selectedAttendanceAssignment.id;

        console.log(
  "SELECTED ASSIGNMENT:",
  selectedAttendanceAssignment
);

console.log(
  "ASSIGNMENT ID:",
  assignmentId
);

console.log(
  "ASSIGNMENT STATUS:",
  selectedAttendanceAssignment.status
);

      const response = await fetch(
        "http://localhost:5000/api/attendance/company-guide/mark",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignmentId,
            companyGuideId: guideId,
            date: attendanceForm.date,
            status:
              attendanceForm.status,
            checkIn:
              attendanceForm.status ===
              "Absent"
                ? ""
                : attendanceForm.checkIn,
            checkOut:
              attendanceForm.status ===
              "Absent"
                ? ""
                : attendanceForm.checkOut,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to mark attendance"
        );
      }

      setAttendance((prev) => [
        data.attendance,
        ...prev,
      ]);

      setAttendanceSuccess(
        "Attendance marked successfully."
      );

      setAttendanceForm({
        date: new Date()
          .toISOString()
          .split("T")[0],
        status: "Present",
        checkIn: "",
        checkOut: "",
      });
    } catch (error) {
      console.error(
        "Mark Attendance Error:",
        error
      );

      setAttendanceError(
        error.message ||
          "Unable to mark attendance"
      );
    } finally {
      setSubmittingAttendance(false);
    }
  };

  // ==========================================
  // CALCULATE APPROVED HOURS
  // ==========================================
  const getApprovedHours = () => {
    return attendance
      .filter(
        (record) =>
          record.verificationStatus ===
          "Approved"
      )
      .reduce(
        (total, record) =>
          total +
          Number(
            record.totalHours || 0
          ),
        0
      );
  };

  // ==========================================
  // NAVIGATION
  // ==========================================
  const openSection = (
    section
  ) => {
    if (section === "dashboard") {
      setLocalSection(null);
      onGoToDashboard();
      return;
    }

    if (section === "profile") {
      setLocalSection(null);
      onGoToProfile();
      return;
    }

    if (
      section === "assignedStudents"
    ) {
      setLocalSection(
        "assignedStudents"
      );
      return;
    }

    if (section === "attendance") {
      setLocalSection("attendance");
      setSelectedAttendanceAssignment(
        null
      );
      setAttendanceError("");
      setAttendanceSuccess("");
      return;
    }

    if (section === "logbooks") {
      setLocalSection("logbooks");
      return;
    }

    if (section === "editProfile") {
      setLocalSection(null);
      onGoToEditProfile();
      return;
    }

    if (
      section === "changePassword"
    ) {
      setLocalSection(null);
      onGoToChangePassword();
      return;
    }
  };

  // ==========================================
  // DASHBOARD
  // ==========================================
  const renderDashboard = () => {
    const pendingReviews =
      logbooks.filter(
        (logbook) =>
          logbook.companyGuideStatus !==
            "Approved" &&
          logbook.companyGuideStatus !==
            "Rejected"
      ).length;

    const approvedLogbooks =
      logbooks.filter(
        (logbook) =>
          logbook.companyGuideStatus ===
          "Approved"
      ).length;

    const rejectedLogbooks =
      logbooks.filter(
        (logbook) =>
          logbook.companyGuideStatus ===
          "Rejected"
      ).length;

    return (
      <div className="cg-dashboard-home">

        {/* HERO */}
        <section className="cg-hero">

          <div className="cg-hero-content">

            <div className="cg-eyebrow">
              COMPANY GUIDE PORTAL
            </div>

            <h1>
              Welcome back{" "}
              <span>
                {guide?.name ||
                  "Company Guide"}
              </span>

              <span className="cg-wave">
                👋
              </span>
            </h1>

            <p>
              Guide your assigned students,
              monitor their internship
              progress, and review their
              daily logbook activities from
              one place.
            </p>

            <div className="cg-hero-actions">

              <button
                className="cg-primary-action"
                onClick={() =>
                  openSection(
                    "assignedStudents"
                  )
                }
              >
                <span>👨‍🎓</span>
                View Assigned Students
              </button>

              <button
                className="cg-secondary-action"
                onClick={() =>
                  openSection(
                    "logbooks"
                  )
                }
              >
                <span>📖</span>
                Review Logbooks
              </button>

            </div>

          </div>

          <div className="cg-hero-visual">

            <div className="cg-visual-circle circle-one"></div>
            <div className="cg-visual-circle circle-two"></div>

            <div className="cg-guide-illustration">

              <div className="cg-illustration-icon">
                👨‍💼
              </div>

              <div className="cg-illustration-lines">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="cg-mini-badge">
                ✓ Guide
              </div>

            </div>

          </div>

        </section>

        {/* STATS */}
        <section className="cg-stats-grid">

          <div
            className="cg-stat-card clickable"
            onClick={() =>
              openSection(
                "assignedStudents"
              )
            }
          >
            <div className="cg-stat-icon students">
              👨‍🎓
            </div>

            <div className="cg-stat-content">
              <span>
                Assigned Students
              </span>

              <strong>
                {assignments.length}
              </strong>

              <small>
                Students under your guidance
              </small>
            </div>

            <div className="cg-stat-arrow">
              →
            </div>
          </div>

          <div
            className="cg-stat-card clickable"
            onClick={() =>
              openSection("logbooks")
            }
          >
            <div className="cg-stat-icon logbooks">
              📖
            </div>

            <div className="cg-stat-content">
              <span>
                Total Logbooks
              </span>

              <strong>
                {logbooks.length}
              </strong>

              <small>
                Entries submitted by students
              </small>
            </div>

            <div className="cg-stat-arrow">
              →
            </div>
          </div>

          <div
            className="cg-stat-card clickable"
            onClick={() =>
              openSection("logbooks")
            }
          >
            <div className="cg-stat-icon pending">
              ⏳
            </div>

            <div className="cg-stat-content">
              <span>
                Pending Reviews
              </span>

              <strong>
                {pendingReviews}
              </strong>

              <small>
                Logbooks waiting for review
              </small>
            </div>

            <div className="cg-stat-arrow">
              →
            </div>
          </div>

        </section>

        {/* LOWER GRID */}
        <section className="cg-dashboard-grid">

          {/* QUICK ACTIONS */}
          <div className="cg-panel cg-quick-panel">

            <div className="cg-panel-heading">

              <div>

                <span>
                  QUICK ACCESS
                </span>

                <h2>
                  What would you like to do?
                </h2>

              </div>

            </div>

            <div className="cg-quick-actions">

              <button
                onClick={() =>
                  openSection(
                    "assignedStudents"
                  )
                }
              >

                <div className="cg-quick-icon green">
                  👨‍🎓
                </div>

                <div>
                  <strong>
                    Assigned Students
                  </strong>

                  <small>
                    View student details
                  </small>
                </div>

                <span>→</span>

              </button>

              <button
                onClick={() =>
                  openSection(
                    "attendance"
                  )
                }
              >

                <div className="cg-quick-icon green">
                  ✓
                </div>

                <div>
                  <strong>
                    Attendance
                  </strong>

                  <small>
                    Mark student attendance
                  </small>
                </div>

                <span>→</span>

              </button>

              <button
                onClick={() =>
                  openSection("logbooks")
                }
              >

                <div className="cg-quick-icon coral">
                  📖
                </div>

                <div>
                  <strong>
                    Review Logbooks
                  </strong>

                  <small>
                    Approve student entries
                  </small>
                </div>

                <span>→</span>

              </button>

              <button
                onClick={() =>
                  openSection("profile")
                }
              >

                <div className="cg-quick-icon blue">
                  👤
                </div>

                <div>
                  <strong>
                    My Profile
                  </strong>

                  <small>
                    View guide information
                  </small>
                </div>

                <span>→</span>

              </button>

            </div>

          </div>

          {/* REVIEW SUMMARY */}
          <div className="cg-panel">

            <div className="cg-panel-heading">

              <div>

                <span>
                  LOGBOOK OVERVIEW
                </span>

                <h2>
                  Review Status
                </h2>

              </div>

            </div>

            <div className="cg-review-summary">

              <div className="cg-review-row">

                <div className="cg-review-label">
                  <span className="status-dot pending-dot"></span>
                  Pending
                </div>

                <strong>
                  {pendingReviews}
                </strong>

              </div>

              <div className="cg-progress">

                <div
                  className="cg-progress-pending"
                  style={{
                    width: `${
                      logbooks.length
                        ? (pendingReviews /
                            logbooks.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>

              </div>

              <div className="cg-review-row">

                <div className="cg-review-label">
                  <span className="status-dot approved-dot"></span>
                  Approved
                </div>

                <strong>
                  {approvedLogbooks}
                </strong>

              </div>

              <div className="cg-review-row">

                <div className="cg-review-label">
                  <span className="status-dot rejected-dot"></span>
                  Rejected
                </div>

                <strong>
                  {rejectedLogbooks}
                </strong>

              </div>

            </div>

          </div>

        </section>

        {/* RESPONSIBILITIES */}
        <section className="cg-responsibility-panel">

          <div className="cg-responsibility-icon">
            💡
          </div>

          <div className="cg-responsibility-content">

            <span>
              YOUR ROLE IN INTERNLINK
            </span>

            <h2>
              Supporting students throughout
              their internship journey
            </h2>

            <p>
              As a Company Guide, you help
              students complete their
              internship successfully by
              monitoring their work and
              reviewing their daily progress.
            </p>

            <div className="cg-responsibility-items">

              <div>
                <span>01</span>
                <p>
                  Monitor assigned students
                </p>
              </div>

              <div>
                <span>02</span>
                <p>
                  Review internship activities
                </p>
              </div>

              <div>
                <span>03</span>
                <p>
                  Approve completed logbook
                  entries
                </p>
              </div>

            </div>

          </div>

        </section>

      </div>
    );
  };

  // ==========================================
  // MY PROFILE
  // ==========================================
  const renderProfile = () => {
    if (loadingProfile) {
      return (
        <div className="cg-profile-page">

          <div className="cg-section-header">

            <div>

              <span>
                ACCOUNT
              </span>

              <h1>
                My Profile
              </h1>

              <p>
                View your Company Guide
                information.
              </p>

            </div>

          </div>

          <div className="cg-profile-loading">

            <div className="cg-loader"></div>

            <p>
              Loading profile...
            </p>

          </div>

        </div>
      );
    }

    if (profileError) {
      return (
        <div className="cg-profile-page">

          <div className="cg-section-header">

            <div>

              <span>
                ACCOUNT
              </span>

              <h1>
                My Profile
              </h1>

              <p>
                View your Company Guide
                information.
              </p>

            </div>

          </div>

          <div className="cg-profile-error">
            {profileError}
          </div>

        </div>
      );
    }

    return (
      <div className="cg-profile-page">

        <div className="cg-section-header">

          <div>

            <span>
              ACCOUNT INFORMATION
            </span>

            <h1>
              My Profile
            </h1>

            <p>
              View your Company Guide account
              and company information.
            </p>

          </div>

        </div>

        <div className="cg-profile-hero">

          <div className="cg-profile-avatar">
            {profile?.name
              ?.charAt(0)
              ?.toUpperCase() ||
              "G"}
          </div>

          <div className="cg-profile-identity">

            <h2>
              {profile?.name ||
                "Company Guide"}
            </h2>

            <p>
              Company Guide
            </p>

            <span className="cg-profile-status">

              <span></span>

              {profile?.status ||
                "Approved"}

            </span>

          </div>

        </div>

        <div className="cg-profile-card">

          <div className="cg-profile-card-header">

            <div>

              <span>
                PERSONAL INFORMATION
              </span>

              <h2>
                Account Details
              </h2>

            </div>

            <div className="cg-profile-card-icon">
              👤
            </div>

          </div>

          <div className="cg-profile-grid">

            <div className="cg-profile-field">

              <span>
                FULL NAME
              </span>

              <strong>
                {profile?.name ||
                  "Not available"}
              </strong>

            </div>

            <div className="cg-profile-field">

              <span>
                EMAIL ADDRESS
              </span>

              <strong>
                {profile?.email ||
                  "Not available"}
              </strong>

            </div>

            <div className="cg-profile-field">

              <span>
                EMPLOYEE ID
              </span>

              <strong>
                {profile?.employeeId ||
                  "Not available"}
              </strong>

            </div>

            <div className="cg-profile-field">

              <span>
                COMPANY
              </span>

              <strong>
                {profile?.company
                  ?.companyName ||
                  "Not available"}
              </strong>

            </div>

          </div>

        </div>

        <div className="cg-profile-account-card">

          <div className="cg-profile-account-icon">
            ✓
          </div>

          <div>

            <span>
              ACCOUNT STATUS
            </span>

            <strong>
              {profile?.status ||
                "Approved"}
            </strong>

            <p>
              Your Company Guide account is
              currently active.
            </p>

          </div>

        </div>

      </div>
    );
  };

  // ==========================================
  // ASSIGNED STUDENTS
  // ==========================================
  const renderAssignedStudents = () => {
    return (
      <>
        <div className="cg-section-header">

          <div>

            <span>
              STUDENT MANAGEMENT
            </span>

            <h1>
              Assigned Students
            </h1>

            <p>
              Students currently assigned to
              you for internship guidance.
            </p>

          </div>

          <div className="cg-section-count">

            <strong>
              {assignments.length}
            </strong>

            <span>
              Assigned
            </span>

          </div>

        </div>

        {loadingAssignments ? (
          <div className="cg-empty-card">

            <div className="cg-loader"></div>

            <p>
              Loading assigned students...
            </p>

          </div>
        ) : assignments.length === 0 ? (
          <div className="cg-empty-card">

            <div className="cg-empty-icon">
              👨‍🎓
            </div>

            <h3>
              No Students Assigned
            </h3>

            <p>
              There are currently no students
              assigned to you.
            </p>

          </div>
        ) : (
          <div className="cg-students-grid">

            {assignments.map(
              (assignment, index) => (
                <div
                  className="cg-student-card"
                  key={
                    assignment._id ||
                    assignment.id ||
                    index
                  }
                >

                  <div className="cg-student-top">

                    <div className="cg-student-avatar">
                      {assignment.student?.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "S"}
                    </div>

                    <div>

                      <h3>
                        {assignment.student
                          ?.name ||
                          "Not available"}
                      </h3>

                      <span>
                        {assignment.student
                          ?.registerNumber ||
                          "No register number"}
                      </span>

                    </div>

                  </div>

                  <div className="cg-student-details">

                    <div>
                      <span>
                        Department
                      </span>

                      <strong>
                        {assignment.student
                          ?.department ||
                          "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Semester
                      </span>

                      <strong>
                        {assignment.student
                          ?.semester ||
                          "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Email
                      </span>

                      <strong>
                        {assignment.student
                          ?.email ||
                          "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Internship
                      </span>

                      <strong>
                        {assignment.internship
                          ?.position ||
                          assignment.internship
                            ?.title ||
                          "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Company
                      </span>

                      <strong>
                        {assignment.company
                          ?.companyName ||
                          "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Location
                      </span>

                      <strong>
                        {assignment.company
                          ?.location ||
                          "Not available"}
                      </strong>
                    </div>

                  </div>

                  <div className="cg-student-footer">

                    <span className="cg-assignment-status">
                      {assignment.status ||
                        "Not available"}
                    </span>

                  </div>

                  {assignment.facultyGuide && (
                    <div className="cg-faculty-box">

                      <span>
                        FACULTY GUIDE
                      </span>

                      <strong>
                        {assignment.facultyGuide
                          ?.name ||
                          "Not available"}
                      </strong>

                      <small>
                        {assignment.facultyGuide
                          ?.email ||
                          ""}
                      </small>

                    </div>
                  )}

                </div>
              )
            )}

          </div>
        )}

      </>
    );
  };

  // ==========================================
  // ATTENDANCE
  // ==========================================
  const renderAttendance = () => {

    /*
      First screen:
      Show all assigned students.
    */
    if (
      !selectedAttendanceAssignment
    ) {
      return (
        <div className="cg-attendance-page">

          <div className="cg-section-header">

            <div>

              <span>
                INTERNSHIP MONITORING
              </span>

              <h1>
                Attendance
              </h1>

              <p>
                Mark and monitor daily
                attendance for your assigned
                students.
              </p>

            </div>

            <div className="cg-section-count">

              <strong>
                {assignments.length}
              </strong>

              <span>
                Students
              </span>

            </div>

          </div>

          {assignments.length === 0 ? (
            <div className="cg-empty-card">

              <div className="cg-empty-icon">
                👨‍🎓
              </div>

              <h3>
                No Students Assigned
              </h3>

              <p>
                There are currently no students
                assigned to you.
              </p>

            </div>
          ) : (
            <div className="cg-attendance-student-grid">

              {assignments.map(
                (assignment, index) => (
                  <div
                    className="cg-attendance-student-card"
                    key={
                      assignment._id ||
                      assignment.id ||
                      index
                    }
                  >

                    <div className="cg-attendance-student-top">

                      <div className="cg-attendance-student-avatar">

                        {assignment.student?.name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "S"}

                      </div>

                      <div>

                        <h3>
                          {assignment.student
                            ?.name ||
                            "Student"}
                        </h3>

                        <span>
                          {assignment.student
                            ?.registerNumber ||
                            "Register number unavailable"}
                        </span>

                      </div>

                    </div>

                    <div className="cg-attendance-student-info">

                      <div>

                        <span>
                          DEPARTMENT
                        </span>

                        <strong>
                          {assignment.student
                            ?.department ||
                            "Not available"}
                        </strong>

                      </div>

                      <div>

                        <span>
                          INTERNSHIP
                        </span>

                        <strong>
                          {assignment.internship
                            ?.position ||
                            assignment.internship
                              ?.title ||
                            "Not available"}
                        </strong>

                      </div>

                      <div>

                        <span>
                          FACULTY GUIDE
                        </span>

                        <strong>
                          {assignment.facultyGuide
                            ?.name ||
                            "Not assigned"}
                        </strong>

                      </div>

                    </div>

                    <button
                      className="cg-manage-attendance-button"
                      onClick={() =>
                        openAttendance(
                          assignment
                        )
                      }
                    >
                      📋 Manage Attendance
                    </button>

                  </div>
                )
              )}

            </div>
          )}

        </div>
      );
    }

    /*
      Selected student attendance screen
    */

    const student =
      selectedAttendanceAssignment.student;

    const approvedHours =
      getApprovedHours();

    return (
      <div className="cg-attendance-page">

        {/* HEADER */}
        <div className="cg-attendance-detail-header">

          <button
            className="cg-attendance-back"
            onClick={() => {
              setSelectedAttendanceAssignment(
                null
              );

              setAttendance([]);
              setAttendanceError("");
              setAttendanceSuccess("");
            }}
          >
            ← Back to Students
          </button>

          <div className="cg-attendance-student-heading">

            <div className="cg-attendance-large-avatar">
              {student?.name
                ?.charAt(0)
                ?.toUpperCase() ||
                "S"}
            </div>

            <div>

              <span>
                ATTENDANCE MANAGEMENT
              </span>

              <h1>
                {student?.name ||
                  "Student"}
              </h1>

              <p>

                {student?.registerNumber ||
                  "Register number unavailable"}

                {" • "}

                {selectedAttendanceAssignment
                  .internship?.position ||
                  selectedAttendanceAssignment
                    .internship?.title ||
                  "Internship"}

              </p>

            </div>

          </div>

        </div>

        {/* SUMMARY */}
        <div className="cg-attendance-summary">

          <div className="cg-attendance-summary-card">

            <span>
              APPROVED HOURS
            </span>

            <strong>
              {approvedHours.toFixed(2)}
            </strong>

            <small>
              Hours verified by faculty
            </small>

          </div>

          <div className="cg-attendance-summary-card">

            <span>
              TOTAL RECORDS
            </span>

            <strong>
              {attendance.length}
            </strong>

            <small>
              Attendance entries
            </small>

          </div>

          <div className="cg-attendance-summary-card">

            <span>
              FACULTY GUIDE
            </span>

            <strong>
              {selectedAttendanceAssignment
                .facultyGuide?.name ||
                "Not assigned"}
            </strong>

            <small>
              Verification authority
            </small>

          </div>

        </div>

        {/* MARK ATTENDANCE */}
        <div className="cg-attendance-form-card">

          <div className="cg-attendance-card-heading">

            <div>

              <span>
                DAILY ATTENDANCE
              </span>

              <h2>
                Mark Attendance
              </h2>

              <p>
                Record the student's daily
                internship attendance.
              </p>

            </div>

            <div className="cg-attendance-heading-icon">
              ✓
            </div>

          </div>

          {attendanceError && (
            <div className="cg-attendance-error">
              {attendanceError}
            </div>
          )}

          {attendanceSuccess && (
            <div className="cg-attendance-success">
              {attendanceSuccess}
            </div>
          )}

          <form
            onSubmit={
              handleMarkAttendance
            }
          >

            <div className="cg-attendance-form-grid">

              <div className="cg-attendance-field">

                <label>
                  DATE
                </label>

                <input
                  type="date"
                  name="date"
                  value={
                    attendanceForm.date
                  }
                  onChange={
                    handleAttendanceChange
                  }
                  required
                />

              </div>

              <div className="cg-attendance-field">

                <label>
                  STATUS
                </label>

                <select
                  name="status"
                  value={
                    attendanceForm.status
                  }
                  onChange={
                    handleAttendanceChange
                  }
                >

                  <option value="Present">
                    Present
                  </option>

                  <option value="Half Day">
                    Half Day
                  </option>

                  <option value="Absent">
                    Absent
                  </option>

                </select>

              </div>

              <div className="cg-attendance-field">

                <label>
                  CHECK IN
                </label>

                <input
                  type="time"
                  name="checkIn"
                  value={
                    attendanceForm.checkIn
                  }
                  onChange={
                    handleAttendanceChange
                  }
                  disabled={
                    attendanceForm.status ===
                    "Absent"
                  }
                />

              </div>

              <div className="cg-attendance-field">

                <label>
                  CHECK OUT
                </label>

                <input
                  type="time"
                  name="checkOut"
                  value={
                    attendanceForm.checkOut
                  }
                  onChange={
                    handleAttendanceChange
                  }
                  disabled={
                    attendanceForm.status ===
                    "Absent"
                  }
                />

              </div>

            </div>

            <div className="cg-attendance-form-footer">

              <p>
                Faculty verification is required
                before these hours are counted.
              </p>

              <button
                type="submit"
                className="cg-mark-attendance-button"
                disabled={
                  submittingAttendance
                }
              >
                {submittingAttendance
                  ? "Marking..."
                  : "✓ Mark Attendance"}
              </button>

            </div>

          </form>

        </div>

        {/* ATTENDANCE HISTORY */}
        <div className="cg-attendance-history-card">

          <div className="cg-attendance-card-heading">

            <div>

              <span>
                ATTENDANCE HISTORY
              </span>

              <h2>
                Daily Records
              </h2>

              <p>
                Attendance records submitted
                for faculty verification.
              </p>

            </div>

          </div>

          {loadingAttendance ? (
            <div className="cg-empty-card">

              <div className="cg-loader"></div>

              <p>
                Loading attendance...
              </p>

            </div>
          ) : attendance.length === 0 ? (
            <div className="cg-attendance-empty">

              <div>
                📋
              </div>

              <h3>
                No Attendance Records
              </h3>

              <p>
                No attendance has been marked
                for this student yet.
              </p>

            </div>
          ) : (
            <div className="cg-attendance-table-wrapper">

              <table className="cg-attendance-table">

                <thead>

                  <tr>

                    <th>
                      DATE
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      CHECK IN
                    </th>

                    <th>
                      CHECK OUT
                    </th>

                    <th>
                      HOURS
                    </th>

                    <th>
                      VERIFICATION
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {attendance.map(
                    (record, index) => (
                      <tr
                        key={
                          record._id ||
                          record.id ||
                          index
                        }
                      >

                        <td>
                          {record.date
                            ? new Date(
                                record.date
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </td>

                        <td>

                          <span
                            className={`cg-attendance-status ${
                              record.status
                                ?.toLowerCase()
                                .replace(
                                  " ",
                                  "-"
                                )
                            }`}
                          >
                            {record.status ||
                              "Pending"}
                          </span>

                        </td>

                        <td>
                          {record.checkIn ||
                            "-"}
                        </td>

                        <td>
                          {record.checkOut ||
                            "-"}
                        </td>

                        <td>

                          <strong>
                            {Number(
                              record.totalHours ||
                                0
                            ).toFixed(2)}
                          </strong>

                        </td>

                        <td>

                          <span
                            className={`cg-verification-status ${
                              record.verificationStatus
                                ?.toLowerCase() ||
                              "pending"
                            }`}
                          >
                            {record.verificationStatus ||
                              "Pending"}
                          </span>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    );
  };

  // ==========================================
  // LOGBOOKS
  // ==========================================
  const renderLogbooks = () => {
    return (
      <>
        <div className="cg-section-header">

          <div>

            <span>
              INTERNSHIP MONITORING
            </span>

            <h1>
              Logbook Review
            </h1>

            <p>
              Review daily internship
              activities submitted by your
              assigned students.
            </p>

          </div>

          <div className="cg-section-count">

            <strong>
              {logbooks.length}
            </strong>

            <span>
              Entries
            </span>

          </div>

        </div>

        {loadingLogbooks ? (
          <div className="cg-empty-card">

            <div className="cg-loader"></div>

            <p>
              Loading logbooks...
            </p>

          </div>
        ) : logbooks.length === 0 ? (
          <div className="cg-empty-card">

            <div className="cg-empty-icon">
              📖
            </div>

            <h3>
              No Logbook Entries
            </h3>

            <p>
              There are currently no logbook
              entries available for review.
            </p>

          </div>
        ) : (
          <div className="cg-logbook-list-compact">

            {logbooks.map(
              (logbook, index) => {

                const logbookId =
                  logbook._id ||
                  logbook.id;

                const status =
                  logbook.companyGuideStatus ||
                  "Pending";

                return (
                  <div
                    className={`cg-compact-logbook-card ${status.toLowerCase()}`}
                    key={
                      logbookId ||
                      index
                    }
                  >

                    <div className="cg-compact-header">

                      <div className="cg-compact-student">

                        <div className="cg-compact-avatar">
                          {logbook.student?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "S"}
                        </div>

                        <div className="cg-compact-student-info">

                          <h3>
                            {logbook.student
                              ?.name ||
                              "Student"}
                          </h3>

                          <span>
                            {logbook.student
                              ?.registerNumber ||
                              "Register number unavailable"}

                            {logbook.student
                              ?.department
                              ? ` • ${logbook.student.department}`
                              : ""}
                          </span>

                        </div>

                      </div>

                      <div className="cg-compact-date">

                        <strong>
                          {logbook.date
                            ? new Date(
                                logbook.date
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "Date unavailable"}
                        </strong>

                        <span>
                          Logbook Entry
                        </span>

                      </div>

                      <span
                        className={`cg-compact-status ${status.toLowerCase()}`}
                      >
                        {status ===
                        "Approved"
                          ? "✓ Approved"
                          : status ===
                            "Rejected"
                          ? "✕ Rejected"
                          : "● Pending"}
                      </span>

                    </div>

                    <div className="cg-compact-body">

                      <div className="cg-compact-hours">

                        <div className="cg-hours-icon">
                          ⏱
                        </div>

                        <div>

                          <span>
                            HOURS WORKED
                          </span>

                          <strong>
                            {logbook.hoursWorked ??
                              "0"}

                            <small>
                              {" "}
                              hrs
                            </small>
                          </strong>

                        </div>

                      </div>

                      <div className="cg-compact-section">

                        <div className="cg-compact-section-title">

                          <span className="cg-section-icon">
                            📝
                          </span>

                          <span>
                            WORK COMPLETED
                          </span>

                        </div>

                        <p>
                          {logbook.workDone ||
                            "No work details provided."}
                        </p>

                      </div>

                      <div className="cg-compact-section">

                        <div className="cg-compact-section-title">

                          <span className="cg-section-icon">
                            💡
                          </span>

                          <span>
                            LEARNINGS
                          </span>

                        </div>

                        <p>
                          {logbook.learnings ||
                            "No learning details provided."}
                        </p>

                      </div>

                    </div>

                    <div className="cg-compact-footer">

                      <div className="cg-compact-statuses">

                        <div>

                          <span>
                            FACULTY
                          </span>

                          <strong>
                            {logbook.facultyStatus ||
                              "Pending"}
                          </strong>

                        </div>

                        <div>

                          <span>
                            COMPANY GUIDE
                          </span>

                          <strong>
                            {status}
                          </strong>

                        </div>

                      </div>

                      {status !==
                        "Approved" &&
                        status !==
                          "Rejected" && (
                          <div className="cg-compact-actions">

                            <button
                              className="cg-compact-reject"
                              onClick={() =>
                                handleReject(
                                  logbookId
                                )
                              }
                            >
                              ✕ Reject
                            </button>

                            <button
                              className="cg-compact-approve"
                              onClick={() =>
                                handleApprove(
                                  logbookId
                                )
                              }
                            >
                              ✓ Approve
                            </button>

                          </div>
                        )}

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </>
    );
  };

  // ==========================================
  // CONTENT SWITCH
  // ==========================================
  const renderContent = () => {

    if (error) {
      return (
        <div className="cg-error">
          {error}
        </div>
      );
    }

    if (
      currentSection ===
      "assignedStudents"
    ) {
      return renderAssignedStudents();
    }

    if (
      currentSection ===
      "attendance"
    ) {
      return renderAttendance();
    }

    if (
      currentSection ===
      "logbooks"
    ) {
      return renderLogbooks();
    }

    if (
      currentSection ===
      "profile"
    ) {
      return renderProfile();
    }

    return renderDashboard();
  };

  // ==========================================
  // MAIN LAYOUT
  // ==========================================
  return (
    <div className="cg-layout">

      {/* HEADER */}
      <header className="cg-header">

        <div className="cg-brand">

          <div className="cg-brand-mark">

            <span className="cg-mark-left"></span>

            <span className="cg-mark-right"></span>

          </div>

          <div className="cg-brand-text">

            <h2>
              InternLink
            </h2>

            <span>
              Internship Management Platform
            </span>

          </div>

        </div>

        <div className="cg-header-right">

          <div className="cg-header-user">

            <div className="cg-header-avatar">
              {guide?.name
                ?.charAt(0)
                ?.toUpperCase() ||
                "G"}
            </div>

            <div className="cg-header-user-info">

              <strong>
                {guide?.name ||
                  "Company Guide"}
              </strong>

              <span>
                Company Guide
              </span>

            </div>

          </div>

          <button
            className="cg-logout"
            onClick={onLogout}
          >

            <span>
              ↪
            </span>

            Logout

          </button>

        </div>

      </header>

      {/* MAIN */}
      <div className="cg-main">

        {/* SIDEBAR */}
        <aside className="cg-sidebar">

          <div className="cg-sidebar-profile">

            <div className="cg-sidebar-avatar">
              {guide?.name
                ?.charAt(0)
                ?.toUpperCase() ||
                "G"}
            </div>

            <div>

              <strong>
                {guide?.name ||
                  "Company Guide"}
              </strong>

              <span>
                Guide Portal
              </span>

            </div>

          </div>

          <div className="cg-menu-label">
            MAIN MENU
          </div>

          <nav className="cg-navigation">

            {/* DASHBOARD */}
            <button
              className={`cg-nav-item ${
                currentSection ===
                "dashboard"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                openSection(
                  "dashboard"
                )
              }
            >
              <span>
                ⌂
              </span>

              Dashboard
            </button>

            {/* PROFILE */}
            <button
              className={`cg-nav-item ${
                currentSection ===
                "profile"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                openSection(
                  "profile"
                )
              }
            >
              <span>
                ♙
              </span>

              My Profile
            </button>

            {/* ASSIGNED STUDENTS */}
            <button
              className={`cg-nav-item ${
                currentSection ===
                "assignedStudents"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                openSection(
                  "assignedStudents"
                )
              }
            >
              <span>
                ♙
              </span>

              Assigned Students

              {assignments.length >
                0 && (
                <em>
                  {assignments.length}
                </em>
              )}

            </button>

            {/* ATTENDANCE */}
            <button
              className={`cg-nav-item ${
                currentSection ===
                "attendance"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                openSection(
                  "attendance"
                )
              }
            >
              <span>
                ✓
              </span>

              Attendance
            </button>

            {/* LOGBOOKS */}
            <button
              className={`cg-nav-item ${
                currentSection ===
                "logbooks"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                openSection(
                  "logbooks"
                )
              }
            >
              <span>
                ▤
              </span>

              View Logbooks

              {logbooks.filter(
                (logbook) =>
                  logbook.companyGuideStatus !==
                    "Approved" &&
                  logbook.companyGuideStatus !==
                    "Rejected"
              ).length > 0 && (
                <em className="notification">

                  {
                    logbooks.filter(
                      (logbook) =>
                        logbook.companyGuideStatus !==
                          "Approved" &&
                        logbook.companyGuideStatus !==
                          "Rejected"
                    ).length
                  }

                </em>
              )}

            </button>

          </nav>

          <div className="cg-sidebar-divider"></div>

          <div className="cg-guide-info">

            <div className="cg-guide-info-icon">
              ✓
            </div>

            <div>

              <span>
                ACCOUNT STATUS
              </span>

              <strong>
                {guide?.status ||
                  "Approved"}
              </strong>

            </div>

          </div>

          <div className="cg-sidebar-footer">

            InternLink

            <span>
              •
            </span>

            Company Guide

          </div>

        </aside>

        {/* CONTENT */}
        <main className="cg-content">

          <div className="cg-content-inner">

            {currentSection ===
                "editProfile" ||
            currentSection ===
                "changePassword"
              ? children
              : renderContent()}

          </div>

        </main>

      </div>

    </div>
  );
}

export default CompanyGuideDashboard;