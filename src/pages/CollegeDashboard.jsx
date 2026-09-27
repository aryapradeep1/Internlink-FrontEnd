import React, { useEffect, useState } from "react";
import "../css/CollegeDashboard.css";

function CollegeDashboard({
  college,
  onLogout,
  onGoToProfile,
  onGoToDashboard,
  onGoToStudents,
  onGoToFaculty,
  onGoToApplications,
  onGoToWorkload,
  onGoToEditProfile,
  onGoToChangePassword,
  activeSection,
  children,
}) {
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD COLLEGE DATA
  // ==========================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [studentsRes, facultyRes, applicationsRes] =
        await Promise.all([
          fetch(
            `http://localhost:5000/api/colleges/${college.id}/students`
          ),
          fetch(
            `http://localhost:5000/api/colleges/${college.id}/faculty`
          ),
          fetch(
            `http://localhost:5000/api/colleges/${college.id}/applications`
          ),
        ]);

      const studentsData = await studentsRes.json();
      const facultyData = await facultyRes.json();
      const applicationsData = await applicationsRes.json();

      if (studentsData.status === "success") {
        setStudents(studentsData.students);
      }

      if (facultyData.status === "success") {
        setFaculty(facultyData.faculty);
      }

      if (applicationsData.status === "success") {
        setApplications(applicationsData.applications);
      }
    } catch (error) {
      console.error("College dashboard error:", error);
      setMessage("Failed to load college data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // APPROVE FACULTY
  // ==========================================

  const approveFaculty = async (facultyId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/colleges/${college.id}/faculty/${facultyId}/approve`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Faculty approved successfully");
        loadData();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to approve faculty");
    }
  };

  // ==========================================
  // REJECT FACULTY
  // ==========================================

  const rejectFaculty = async (facultyId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/colleges/${college.id}/faculty/${facultyId}/reject`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Faculty rejected successfully");
        loadData();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to reject faculty");
    }
  };

  // ==========================================
  // APPROVE INTERNSHIP
  // ==========================================

  const approveApplication = async (applicationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/colleges/${college.id}/applications/${applicationId}/approve`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(
          `Internship approved. Faculty assigned: ${data.assignedFaculty.name}`
        );

        loadData();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to approve internship");
    }
  };

  // ==========================================
  // REJECT INTERNSHIP
  // ==========================================

  const rejectApplication = async (applicationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/colleges/${college.id}/applications/${applicationId}/reject`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Internship rejected");
        loadData();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to reject internship");
    }
  };

  // ==========================================
  // COUNTS
  // ==========================================

  const pendingFaculty = faculty.filter(
    (f) => f.status === "Pending"
  );

  const approvedFaculty = faculty.filter(
    (f) => f.status === "Approved"
  );

  const pendingApplications = applications.filter(
    (app) => app.status === "CompanyApproved"
  );

  const approvedApplications = applications.filter(
    (app) => app.status === "CollegeApproved"
  );

  // ==========================================
  // FACULTY WORKLOAD
  // ==========================================

  const getFacultyWorkload = (facultyId) => {
    return applications.filter(
      (app) =>
        app.faculty &&
        app.faculty._id === facultyId &&
        app.status === "CollegeApproved"
    ).length;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="college-loading">
        <div className="college-loading-card">
          <div className="college-loading-spinner"></div>
          <h2>Loading College Dashboard...</h2>
          <p>Please wait while your college data is loaded.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD CONTENT
  // ==========================================

  const renderDashboardContent = () => {
    // ========================================
    // OVERVIEW
    // ========================================

    if (activeSection === "dashboard") {
      return (
        <div className="college-page">
          <div className="college-page-heading">
            <div>
              <span className="college-eyebrow">
                COLLEGE PORTAL
              </span>

              <h1>Dashboard Overview</h1>

              <p>
                Manage students, faculty, and internship
                activities from one place.
              </p>
            </div>
          </div>

          <div className="college-stat-grid">
            <div className="college-stat-card">
              <div className="college-stat-icon">🎓</div>

              <div>
                <span className="college-stat-label">
                  Total Students
                </span>

                <strong>{students.length}</strong>
              </div>
            </div>

            <div className="college-stat-card">
              <div className="college-stat-icon">👨‍🏫</div>

              <div>
                <span className="college-stat-label">
                  Approved Faculty
                </span>

                <strong>{approvedFaculty.length}</strong>

                <small>
                  {pendingFaculty.length} pending requests
                </small>
              </div>
            </div>

            <div className="college-stat-card">
              <div className="college-stat-icon">📄</div>

              <div>
                <span className="college-stat-label">
                  Applications
                </span>

                <strong>{applications.length}</strong>
              </div>
            </div>

            <div className="college-stat-card">
              <div className="college-stat-icon">✓</div>

              <div>
                <span className="college-stat-label">
                  Approved Internships
                </span>

                <strong>
                  {approvedApplications.length}
                </strong>
              </div>
            </div>
          </div>

          <div className="college-section-card">
            <div className="college-section-header">
              <div>
                <span className="college-eyebrow">
                  COLLEGE INFORMATION
                </span>

                <h2>College Details</h2>
              </div>
            </div>

            <div className="college-details-grid">
              <div className="college-detail-item">
                <span>College Name</span>
                <strong>{college.collegeName}</strong>
              </div>

              <div className="college-detail-item">
                <span>College Code</span>
                <strong>{college.collegeCode}</strong>
              </div>

              <div className="college-detail-item">
                <span>Email</span>
                <strong>{college.email}</strong>
              </div>

              <div className="college-detail-item">
                <span>Phone</span>
                <strong>
                  {college.phone || "Not available"}
                </strong>
              </div>

              <div className="college-detail-item">
                <span>Location</span>
                <strong>
                  {college.location || "Not available"}
                </strong>
              </div>

              <div className="college-detail-item">
                <span>Status</span>

                <span className="college-status-badge approved">
                  {college.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ========================================
    // STUDENTS
    // ========================================

    if (activeSection === "students") {
      return (
        <div className="college-page">
          <div className="college-page-heading">
            <div>
              <span className="college-eyebrow">
                STUDENT MANAGEMENT
              </span>

              <h1>College Students</h1>

              <p>
                View students registered under your college.
              </p>
            </div>
          </div>

          <div className="college-section-card">
            {students.length === 0 ? (
              <div className="college-empty-state">
                <div>🎓</div>
                <h3>No students registered yet</h3>
                <p>
                  Student records will appear here once
                  students register under this college.
                </p>
              </div>
            ) : (
              <div className="college-table-wrapper">
                <table className="college-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Register No.</th>
                      <th>Department</th>
                      <th>Semester</th>
                      <th>Email</th>
                      <th>Phone</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td>
                          <strong>{student.name}</strong>
                        </td>

                        <td>
                          {student.registerNumber}
                        </td>

                        <td>{student.department}</td>

                        <td>{student.semester}</td>

                        <td>{student.email}</td>

                        <td>
                          {student.phone || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ========================================
    // FACULTY
    // ========================================

    if (activeSection === "faculty") {
      return (
        <div className="college-page">
          <div className="college-page-heading">
            <div>
              <span className="college-eyebrow">
                FACULTY MANAGEMENT
              </span>

              <h1>Faculty Management</h1>

              <p>
                Review faculty registration requests and
                manage approved faculty members.
              </p>
            </div>
          </div>

          <div className="college-section-card">
            <div className="college-section-header">
              <div>
                <h2>Pending Faculty Requests</h2>
                <p>
                  Faculty members waiting for approval.
                </p>
              </div>

              <span className="college-count-badge">
                {pendingFaculty.length}
              </span>
            </div>

            {pendingFaculty.length === 0 ? (
              <div className="college-small-empty">
                No pending faculty requests.
              </div>
            ) : (
              <div className="college-table-wrapper">
                <table className="college-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pendingFaculty.map((f) => (
                      <tr key={f._id}>
                        <td>
                          <strong>{f.name}</strong>
                        </td>

                        <td>{f.department}</td>

                        <td>{f.designation}</td>

                        <td>{f.email}</td>

                        <td>
                          <div className="college-action-group">
                            <button
                              onClick={() =>
                                approveFaculty(f._id)
                              }
                              className="college-approve-button"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                rejectFaculty(f._id)
                              }
                              className="college-reject-button"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="college-section-card">
            <div className="college-section-header">
              <div>
                <h2>Approved Faculty</h2>
                <p>
                  Faculty members currently approved by
                  the college.
                </p>
              </div>

              <span className="college-count-badge">
                {approvedFaculty.length}
              </span>
            </div>

            {approvedFaculty.length === 0 ? (
              <div className="college-small-empty">
                No approved faculty.
              </div>
            ) : (
              <div className="college-table-wrapper">
                <table className="college-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Email</th>
                      <th>Assigned Students</th>
                    </tr>
                  </thead>

                  <tbody>
                    {approvedFaculty.map((f) => (
                      <tr key={f._id}>
                        <td>
                          <strong>{f.name}</strong>
                        </td>

                        <td>{f.department}</td>

                        <td>{f.designation}</td>

                        <td>{f.email}</td>

                        <td>
                          <span className="college-number-pill">
                            {getFacultyWorkload(f._id)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ========================================
    // INTERNSHIP APPLICATIONS
    // ========================================

    if (activeSection === "applications") {
      return (
        <div className="college-page">
          <div className="college-page-heading">
            <div>
              <span className="college-eyebrow">
                INTERNSHIP MANAGEMENT
              </span>

              <h1>Internship Applications</h1>

              <p>
                Review applications approved by companies
                and manage college approval.
              </p>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="college-section-card">
              <div className="college-empty-state">
                <div>📄</div>
                <h3>No internship applications</h3>
                <p>
                  Applications will appear here when
                  students apply for internships.
                </p>
              </div>
            </div>
          ) : (
            <div className="college-application-list">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="college-application-card"
                >
                  <div className="college-application-top">
                    <div>
                      <span className="college-application-label">
                        INTERNSHIP APPLICATION
                      </span>

                      <h2>
                        {app.student?.name}
                      </h2>

                      <p>
                        {app.internship?.title ||
                          "Internship"}
                        {" · "}
                        {app.company?.companyName ||
                          "Company"}
                      </p>
                    </div>

                    <span
                      className={`college-status-badge ${getStatusClass(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="college-application-details">
                    <div>
                      <span>Register Number</span>
                      <strong>
                        {app.student?.registerNumber ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Department</span>
                      <strong>
                        {app.student?.department ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Company</span>
                      <strong>
                        {app.company?.companyName ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Applied On</span>
                      <strong>
                        {app.createdAt
                          ? new Date(
                              app.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </strong>
                    </div>
                  </div>

                  {app.faculty && (
                    <div className="college-faculty-assignment">
                      <span>Faculty Guide</span>
                      <strong>
                        {app.faculty.name}
                      </strong>
                    </div>
                  )}

                  {app.status === "CompanyApproved" && (
                    <div className="college-application-actions">
                      <button
                        onClick={() =>
                          approveApplication(app._id)
                        }
                        className="college-approve-button"
                      >
                        Approve & Assign Faculty
                      </button>

                      <button
                        onClick={() =>
                          rejectApplication(app._id)
                        }
                        className="college-reject-button"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {app.status === "Pending" && (
                    <p className="college-application-note waiting">
                      Waiting for company approval
                    </p>
                  )}

                  {app.status === "CompanyRejected" && (
                    <p className="college-application-note rejected">
                      Rejected by company
                    </p>
                  )}

                  {app.status === "CollegeApproved" && (
                    <p className="college-application-note approved">
                      Internship approved and faculty
                      assigned
                    </p>
                  )}

                  {app.status === "CollegeRejected" && (
                    <p className="college-application-note rejected">
                      Rejected by college
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // ========================================
    // FACULTY WORKLOAD
    // ========================================

    if (activeSection === "workload") {
      return (
        <div className="college-page">
          <div className="college-page-heading">
            <div>
              <span className="college-eyebrow">
                FACULTY ASSIGNMENT
              </span>

              <h1>Faculty Workload</h1>

              <p>
                Faculty assignment is automatically based
                on department and current student workload.
              </p>
            </div>
          </div>

          <div className="college-section-card">
            {approvedFaculty.length === 0 ? (
              <div className="college-empty-state">
                <div>👨‍🏫</div>
                <h3>No approved faculty available</h3>
                <p>
                  Approved faculty will appear here when
                  they are available for assignments.
                </p>
              </div>
            ) : (
              <div className="college-table-wrapper">
                <table className="college-table">
                  <thead>
                    <tr>
                      <th>Faculty</th>
                      <th>Department</th>
                      <th>Assigned Students</th>
                    </tr>
                  </thead>

                  <tbody>
                    {approvedFaculty.map((f) => (
                      <tr key={f._id}>
                        <td>
                          <strong>{f.name}</strong>
                        </td>

                        <td>{f.department}</td>

                        <td>
                          <span className="college-number-pill">
                            {getFacultyWorkload(f._id)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ========================================
    // PROFILE / EDIT / PASSWORD
    // ========================================

    if (
      activeSection === "profile" ||
      activeSection === "editProfile" ||
      activeSection === "changePassword"
    ) {
      return children;
    }

    return null;
  };

  return (
    <div className="college-dashboard">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside className="college-sidebar">

        <div className="college-brand">
          <div className="college-brand-logo">
            IL
          </div>

          <div>
            <h2>Intern<span>Link</span></h2>
            <p>College Portal</p>
          </div>
        </div>

        <div className="college-sidebar-divider"></div>

        <nav className="college-sidebar-nav">

          <button
            className={`college-nav-item ${
              activeSection === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={onGoToDashboard}
          >
            <span className="college-nav-icon">⌂</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`college-nav-item ${
              activeSection === "students"
                ? "active"
                : ""
            }`}
            onClick={onGoToStudents}
          >
            <span className="college-nav-icon">🎓</span>
            <span>Students</span>
          </button>

          <button
            className={`college-nav-item ${
              activeSection === "faculty"
                ? "active"
                : ""
            }`}
            onClick={onGoToFaculty}
          >
            <span className="college-nav-icon">👨‍🏫</span>
            <span>Faculty</span>
          </button>

          <button
            className={`college-nav-item ${
              activeSection === "applications"
                ? "active"
                : ""
            }`}
            onClick={onGoToApplications}
          >
            <span className="college-nav-icon">📄</span>
            <span>Applications</span>
          </button>

          <button
            className={`college-nav-item ${
              activeSection === "workload"
                ? "active"
                : ""
            }`}
            onClick={onGoToWorkload}
          >
            <span className="college-nav-icon">◉</span>
            <span>Faculty Workload</span>
          </button>

        </nav>

        <div className="college-sidebar-bottom">

          <button
            className={`college-nav-item ${
              activeSection === "profile" ||
              activeSection === "editProfile" ||
              activeSection === "changePassword"
                ? "active"
                : ""
            }`}
            onClick={onGoToProfile}
          >
            <span className="college-nav-icon">👤</span>
            <span>My Profile</span>
          </button>

          <button
            className="college-logout-button"
            onClick={onLogout}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* ======================================
          MAIN AREA
      ====================================== */}

      <div className="college-main">

        <header className="college-header">

          <div>
            <span className="college-header-label">
              COLLEGE PORTAL
            </span>

            <h1>{college.collegeName}</h1>
          </div>

          <div className="college-header-profile">

            <div className="college-avatar">
              {college.collegeName
                ? college.collegeName
                    .charAt(0)
                    .toUpperCase()
                : "C"}
            </div>

            <div>
              <strong>
                {college.collegeName}
              </strong>

              <span>College Administrator</span>
            </div>

          </div>

        </header>

        {message && (
          <div className="college-message">
            <div>
              <strong>Notice</strong>
              <span>{message}</span>
            </div>

            <button
              onClick={() => setMessage("")}
              className="college-message-close"
            >
              ×
            </button>
          </div>
        )}

        {/* ======================================
            CONTENT
        ====================================== */}

        <main className="college-content">
          <div className="college-content-inner">
            {renderDashboardContent()}
          </div>
        </main>

      </div>
    </div>
  );
}

// ==========================================
// STATUS CLASS
// ==========================================

const getStatusClass = (status) => {
  if (status === "CollegeApproved") {
    return "approved";
  }

  if (status === "CompanyApproved") {
    return "pending";
  }

  if (
    status === "CompanyRejected" ||
    status === "CollegeRejected"
  ) {
    return "rejected";
  }

  return "neutral";
};

export default CollegeDashboard;