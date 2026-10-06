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

  const [expandedLogbookStudent, setExpandedLogbookStudent] =
  useState(null);

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

    const [studentCategory, setStudentCategory] =
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
    return (
      <div className="cg-dashboard-home">

        {/* =================================================
            WELCOME HOME CARD
        ================================================= */}
        <section className="cg-welcome-card">

          <div className="cg-welcome-content">

            <div className="cg-welcome-text">

              <span className="cg-welcome-eyebrow">
                WELCOME TO INTERNLINK
              </span>

              <h1>
                Welcome back,{" "}
                <span>
                  {guide?.name ||
                    "Company Guide"}
                </span>
                <span className="cg-welcome-wave">
                  👋
                </span>
              </h1>

              <p>
                Your workspace for guiding
                students, monitoring their
                internship progress, and
                supporting them throughout
                their internship journey.
              </p>

            </div>

            <div
              className="cg-welcome-visual"
              aria-hidden="true"
            >

              <div className="cg-welcome-circle circle-one"></div>

              <div className="cg-welcome-circle circle-two"></div>

              <div className="cg-welcome-person">

                <div className="cg-person-head">
                  👨‍💼
                </div>

                <div className="cg-person-body">
                  <span></span>
                  <span></span>
                </div>

              </div>

              <div className="cg-floating-check">
                ✓
              </div>

              <div className="cg-floating-star">
                ✦
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            RESPONSIBILITIES CARD
        ================================================= */}
        <section className="cg-responsibilities-card">

          <div className="cg-responsibilities-header">

            <div className="cg-responsibilities-icon">
              ✦
            </div>

            <div>
              <span>
                YOUR RESPONSIBILITIES
              </span>

              <h2>
                Supporting students at every step
              </h2>

              <p>
                As a Company Guide, you play an
                important role in helping students
                complete their internship successfully.
              </p>
            </div>

          </div>

          <div className="cg-responsibilities-list">

            <div className="cg-responsibility-item">

              <div className="cg-responsibility-number">
                01
              </div>

              <div className="cg-responsibility-icon-small">
                👨‍🎓
              </div>

              <div className="cg-responsibility-text">

                <h3>
                  Guide Assigned Students
                </h3>

                <p>
                  Support students during their
                  internship and help them stay on
                  the right path.
                </p>

              </div>

            </div>

            <div className="cg-responsibility-item">

              <div className="cg-responsibility-number">
                02
              </div>

              <div className="cg-responsibility-icon-small">
                ✓
              </div>

              <div className="cg-responsibility-text">

                <h3>
                  Monitor Attendance
                </h3>

                <p>
                  Keep track of daily attendance
                  and internship participation.
                </p>

              </div>

            </div>

            <div className="cg-responsibility-item">

              <div className="cg-responsibility-number">
                03
              </div>

              <div className="cg-responsibility-icon-small">
                📖
              </div>

              <div className="cg-responsibility-text">

                <h3>
                  Review Logbook Activities
                </h3>

                <p>
                  Review students' daily work and
                  approve their completed activities.
                </p>

              </div>

            </div>

          </div>

          <div className="cg-responsibilities-footer">

            <span className="cg-footer-dot"></span>

            <p>
              Your guidance helps students make
              their internship experience meaningful.
            </p>

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

  // Internship ongoing:
  // Includes students whose assignment is
  // Assigned or Active.
  const ongoingStudents = assignments.filter(
    (assignment) =>
      assignment.status !== "Completed"
  );

  // Internship completed
  const completedStudents = assignments.filter(
    (assignment) =>
      assignment.status === "Completed"
  );

  const displayedStudents =
    studentCategory === "ongoing"
      ? ongoingStudents
      : studentCategory === "completed"
      ? completedStudents
      : [];

  return (
    <div className="cg-assigned-students-page">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="cg-section-header">

        <div>

          <span>
            STUDENT MANAGEMENT
          </span>

          <h1>
            Assigned Students
          </h1>

          <p>
            Manage and monitor students assigned
            to you for internship guidance.
          </p>

        </div>

        <div className="cg-section-count">

          <strong>
            {assignments.length}
          </strong>

          <span>
            Total Students
          </span>

        </div>

      </div>


      {/* ==========================================
          LOADING
      ========================================== */}

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

        <>

          {/* ==========================================
              TWO CATEGORY BOXES
          ========================================== */}

          <div className="cg-student-category-grid">

            {/* ONGOING */}

            <button
              type="button"
              className={`cg-student-category-card ${
                studentCategory === "ongoing"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setStudentCategory("ongoing")
              }
            >

              <div className="cg-category-icon">
                👨‍💻
              </div>

              <div className="cg-category-content">

                <span>
                  INTERNSHIP ONGOING
                </span>

                <strong>
                  {ongoingStudents.length}
                </strong>

                <p>
                  Students currently doing
                  their internship
                </p>

              </div>

              <div className="cg-category-arrow">
                →
              </div>

            </button>


            {/* COMPLETED */}

            <button
              type="button"
              className={`cg-student-category-card completed ${
                studentCategory === "completed"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setStudentCategory("completed")
              }
            >

              <div className="cg-category-icon">
                ✓
              </div>

              <div className="cg-category-content">

                <span>
                  COMPLETED INTERNSHIP
                </span>

                <strong>
                  {completedStudents.length}
                </strong>

                <p>
                  Students who completed
                  their internship
                </p>

              </div>

              <div className="cg-category-arrow">
                →
              </div>

            </button>

          </div>


          {/* ==========================================
              STUDENT LIST
          ========================================== */}

          {studentCategory && (

            <div className="cg-selected-students-section">

              <div className="cg-selected-students-header">

                <div>

                  <span>
                    {studentCategory ===
                    "ongoing"
                      ? "CURRENT INTERNS"
                      : "COMPLETED INTERNS"}
                  </span>

                  <h2>
                    {studentCategory ===
                    "ongoing"
                      ? "Students Currently Doing Internship"
                      : "Students Who Completed Internship"}
                  </h2>

                  <p>
                    {studentCategory ===
                    "ongoing"
                      ? "View students currently assigned to you and monitor their internship progress."
                      : "View students who have completed their internship and their internship details."}
                  </p>

                </div>

                <button
                  type="button"
                  className="cg-close-student-list"
                  onClick={() =>
                    setStudentCategory(null)
                  }
                >
                  ×
                </button>

              </div>


              {/* NO STUDENTS IN SELECTED CATEGORY */}

              {displayedStudents.length === 0 ? (

                <div className="cg-empty-card">

                  <div className="cg-empty-icon">
                    {studentCategory ===
                    "ongoing"
                      ? "👨‍💻"
                      : "✓"}
                  </div>

                  <h3>
                    {studentCategory ===
                    "ongoing"
                      ? "No Ongoing Internships"
                      : "No Completed Internships"}
                  </h3>

                  <p>
                    There are currently no students
                    in this category.
                  </p>

                </div>

              ) : (

                <div className="cg-students-grid">

                  {displayedStudents.map(
                    (assignment, index) => (

                      <div
                        className="cg-student-card"
                        key={
                          assignment._id ||
                          assignment.id ||
                          index
                        }
                      >

                        {/* STUDENT HEADER */}

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


                        {/* STUDENT DETAILS */}

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


                        {/* STATUS */}

                        <div className="cg-student-footer">

                          <span className="cg-assignment-status">

                            {assignment.status ||
                              "Not available"}

                          </span>

                        </div>


                        {/* FACULTY GUIDE */}

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

            </div>

          )}

        </>

      )}

    </div>
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

  // ==========================================
  // GROUP LOGBOOKS BY STUDENT
  // ==========================================

  const studentLogbookGroups = {};

  logbooks.forEach((logbook) => {

    const studentId =
      logbook.student?._id ||
      logbook.student?.id ||
      logbook.student?.registerNumber ||
      logbook.student?.name ||
      "unknown";

    if (!studentLogbookGroups[studentId]) {
      studentLogbookGroups[studentId] = {
        student: logbook.student,
        logbooks: [],
      };
    }

    studentLogbookGroups[studentId].logbooks.push(
      logbook
    );
  });

  const studentGroups =
    Object.values(studentLogbookGroups);


  // ==========================================
  // TOGGLE STUDENT
  // ==========================================

  const toggleStudentLogbooks = (studentId) => {

    if (
      expandedLogbookStudent === studentId
    ) {
      setExpandedLogbookStudent(null);
    } else {
      setExpandedLogbookStudent(studentId);
    }
  };


  return (
    <div className="cg-logbooks-page">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="cg-section-header">

        <div>

          <span>
            INTERNSHIP MONITORING
          </span>

          <h1>
            Logbook Review
          </h1>

          <p>
            Select a student to view and review
            their internship logbook activities.
          </p>

        </div>

        <div className="cg-section-count">

          <strong>
            {studentGroups.length}
          </strong>

          <span>
            Students
          </span>

        </div>

      </div>


      {/* ==========================================
          LOADING
      ========================================== */}

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

        <div className="cg-logbook-student-list">

          {studentGroups.map(
            (group, index) => {

              const student =
                group.student;

              const studentId =
                student?._id ||
                student?.id ||
                student?.registerNumber ||
                student?.name ||
                `student-${index}`;

              const isExpanded =
                expandedLogbookStudent ===
                studentId;

              return (
                <div
                  className={`cg-logbook-student-group ${
                    isExpanded
                      ? "expanded"
                      : ""
                  }`}
                  key={studentId}
                >

                  {/* ==========================================
                      STUDENT HEADER
                  ========================================== */}

                  <button
                    type="button"
                    className="cg-logbook-student-header"
                    onClick={() =>
                      toggleStudentLogbooks(
                        studentId
                      )
                    }
                  >

                    <div className="cg-logbook-student-main">

                      <div className="cg-logbook-student-avatar">

                        {student?.name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "S"}

                      </div>

                      <div className="cg-logbook-student-info">

                        <h3>
                          {student?.name ||
                            "Student"}
                        </h3>

                        <span>

                          {student?.registerNumber ||
                            "Register number unavailable"}

                          {student?.department
                            ? ` • ${student.department}`
                            : ""}

                        </span>

                      </div>

                    </div>


                    <div className="cg-logbook-student-meta">

                      <div>

                        <strong>
                          {group.logbooks.length}
                        </strong>

                        <span>
                          {group.logbooks.length ===
                          1
                            ? "Logbook"
                            : "Logbooks"}
                        </span>

                      </div>

                      <span className="cg-logbook-dropdown-arrow">
                        {isExpanded
                          ? "▲"
                          : "▼"}
                      </span>

                    </div>

                  </button>


                  {/* ==========================================
                      STUDENT LOGBOOKS
                  ========================================== */}

                  {isExpanded && (

                    <div className="cg-logbook-student-content">

                      {group.logbooks.map(
                        (
                          logbook,
                          logbookIndex
                        ) => {

                          const logbookId =
                            logbook._id ||
                            logbook.id ||
                            logbookIndex;

                          const status =
                            logbook.companyGuideStatus ||
                            "Pending";

                          return (
                            <div
                              className={`cg-compact-logbook-card ${status.toLowerCase()}`}
                              key={
                                logbookId
                              }
                            >

                              {/* ==========================================
                                  LOGBOOK HEADER
                              ========================================== */}

                              <div className="cg-compact-header">

                                <div className="cg-compact-student">

                                  <div className="cg-compact-avatar">

                                    {student?.name
                                      ?.charAt(0)
                                      ?.toUpperCase() ||
                                      "S"}

                                  </div>

                                  <div className="cg-compact-student-info">

                                    <h3>
                                      {student?.name ||
                                        "Student"}
                                    </h3>

                                    <span>
                                      {student?.registerNumber ||
                                        "Register number unavailable"}
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
                                    Logbook Entry #
                                    {logbookIndex + 1}
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


                              {/* ==========================================
                                  LOGBOOK BODY
                              ========================================== */}

                              <div className="cg-compact-body">

                                {/* HOURS */}

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


                                {/* WORK */}

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


                                {/* LEARNINGS */}

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


                              {/* ==========================================
                                  LOGBOOK FOOTER
                              ========================================== */}

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

                </div>
              );
            }
          )}

        </div>

      )}

    </div>
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