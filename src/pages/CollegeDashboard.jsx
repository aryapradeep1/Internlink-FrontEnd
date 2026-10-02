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
  // EXCEL UPLOAD STATES
  // ==========================================

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

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
      const applicationsData =
        await applicationsRes.json();

      if (studentsData.status === "success") {
        setStudents(studentsData.students || []);
      }

      if (facultyData.status === "success") {
        setFaculty(facultyData.faculty || []);
      }

      if (applicationsData.status === "success") {
        setApplications(
          applicationsData.applications || []
        );
      }
    } catch (error) {
      console.error(
        "College dashboard error:",
        error
      );

      setMessage("Failed to load college data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // UPLOAD STUDENT EXCEL
  // ==========================================

  const handleExcelUpload = async () => {
    if (!selectedFile) {
      setMessage(
        "Please select an Excel file first."
      );
      return;
    }

    const fileName =
      selectedFile.name.toLowerCase();

    if (
      !fileName.endsWith(".xlsx") &&
      !fileName.endsWith(".xls")
    ) {
      setMessage(
        "Please select a valid Excel file (.xlsx or .xls)."
      );
      return;
    }

    try {
      setUploadingExcel(true);
      setMessage("");
      setUploadResult(null);

      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        `http://localhost:5000/api/colleges/${college.id}/upload-student-excel`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setUploadResult(data.summary);

        setMessage(
          "Student Excel file processed successfully."
        );

        setSelectedFile(null);

        loadData();
      } else {
        setMessage(
          data.message ||
            "Failed to upload Excel file."
        );

        if (data.summary) {
          setUploadResult(data.summary);
        }
      }
    } catch (error) {
      console.error(
        "Student Excel upload error:",
        error
      );

      setMessage(
        "Failed to upload student Excel file."
      );
    } finally {
      setUploadingExcel(false);
    }
  };

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
        setMessage(
          "Faculty approved successfully"
        );

        loadData();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to approve faculty"
      );
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
        setMessage(
          "Faculty rejected successfully"
        );

        loadData();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to reject faculty"
      );
    }
  };

  // ==========================================
  // APPROVE INTERNSHIP
  // ==========================================

  const approveApplication = async (
    applicationId
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/colleges/${college.id}/applications/${applicationId}/approve`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        const facultyName =
          data.assignedFaculty?.name ||
          data.faculty?.name ||
          "";

        if (facultyName) {
          setMessage(
            `Internship approved. Predefined faculty: ${facultyName}`
          );
        } else {
          setMessage(
            "Internship approved successfully."
          );
        }

        loadData();
      } else {
        setMessage(
          data.message ||
            "Failed to approve internship"
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to approve internship"
      );
    }
  };

  // ==========================================
  // REJECT INTERNSHIP
  // ==========================================

  const rejectApplication = async (
    applicationId
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/colleges/${college.id}/applications/${applicationId}/reject`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(
          "Internship rejected"
        );

        loadData();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to reject internship"
      );
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

  // Company-approved applications waiting
  // for college approval.
  const pendingApplications =
    applications.filter(
      (app) =>
        app.status === "CompanyApproved"
    );

  // Applications already approved
  // by the college.
  const approvedApplications =
    applications.filter(
      (app) =>
        app.status === "CollegeApproved"
    );

  // Other applications that are not yet
  // ready for college approval.
  const otherApplications =
    applications.filter(
      (app) =>
        app.status !== "CompanyApproved" &&
        app.status !== "CollegeApproved"
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

          <h2>
            Loading College Dashboard...
          </h2>

          <p>
            Please wait while your college
            data is loaded.
          </p>

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

              <h1>
                Dashboard Overview
              </h1>

              <p>
                Manage students, faculty,
                and internship activities
                from one place.
              </p>

            </div>
          </div>

          <div className="college-stat-grid">

            <div className="college-stat-card">

              <div className="college-stat-icon">
                🎓
              </div>

              <div>

                <span className="college-stat-label">
                  Total Students
                </span>

                <strong>
                  {students.length}
                </strong>

              </div>

            </div>

            <div className="college-stat-card">

              <div className="college-stat-icon">
                👨‍🏫
              </div>

              <div>

                <span className="college-stat-label">
                  Approved Faculty
                </span>

                <strong>
                  {approvedFaculty.length}
                </strong>

                <small>
                  {pendingFaculty.length}{" "}
                  pending requests
                </small>

              </div>

            </div>

            <div className="college-stat-card">

              <div className="college-stat-icon">
                📄
              </div>

              <div>

                <span className="college-stat-label">
                  Applications
                </span>

                <strong>
                  {applications.length}
                </strong>

              </div>

            </div>

            <div className="college-stat-card">

              <div className="college-stat-icon">
                ✓
              </div>

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

                <h2>
                  College Details
                </h2>

              </div>

            </div>

            <div className="college-details-grid">

              <div className="college-detail-item">
                <span>College Name</span>

                <strong>
                  {college.collegeName}
                </strong>
              </div>

              <div className="college-detail-item">
                <span>College Code</span>

                <strong>
                  {college.collegeCode}
                </strong>
              </div>

              <div className="college-detail-item">
                <span>Email</span>

                <strong>
                  {college.email}
                </strong>
              </div>

              <div className="college-detail-item">
                <span>Phone</span>

                <strong>
                  {college.phone ||
                    "Not available"}
                </strong>
              </div>

              <div className="college-detail-item">
                <span>Location</span>

                <strong>
                  {college.location ||
                    "Not available"}
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

              <h1>
                College Students
              </h1>

              <p>
                Upload the college student
                verification list and view
                students registered under
                your college.
              </p>

            </div>

          </div>

          {/* STUDENT EXCEL UPLOAD */}

          <div className="college-section-card college-excel-upload-card">

            <div className="college-section-header">

              <div>

                <span className="college-eyebrow">
                  STUDENT VERIFICATION
                </span>

                <h2>
                  Upload Student Excel
                </h2>

                <p>
                  Upload the Excel file
                  containing the authorized
                  student verification records.
                </p>

              </div>

            </div>

            <div className="college-excel-format-box">

              <strong>
                Required Excel columns:
              </strong>

              <span>
                Name, College, Register Number,
                Department, Assigned Faculty
                Name, Verification Code
              </span>

            </div>

            <div className="college-excel-upload-area">

              <div className="college-file-input-wrapper">

                <input
                  type="file"
                  accept=".xlsx,.xls"
                  id="studentExcelFile"
                  onChange={(e) => {

                    const file =
                      e.target.files[0];

                    setSelectedFile(
                      file || null
                    );

                    setUploadResult(null);
                  }}
                />

                <label htmlFor="studentExcelFile">

                  {selectedFile
                    ? selectedFile.name
                    : "Choose Excel File"}

                </label>

              </div>

              <button
                type="button"
                className="college-excel-upload-button"
                onClick={
                  handleExcelUpload
                }
                disabled={
                  uploadingExcel
                }
              >
                {uploadingExcel
                  ? "Uploading..."
                  : "Upload Excel"}
              </button>

            </div>

            {selectedFile && (
              <div className="college-selected-file">

                <span>📄</span>

                <div>

                  <strong>
                    {selectedFile.name}
                  </strong>

                  <small>
                    {(
                      selectedFile.size /
                      1024
                    ).toFixed(1)}{" "}
                    KB
                  </small>

                </div>

              </div>
            )}

            {uploadResult && (
              <div className="college-excel-result">

                <h3>
                  Upload Summary
                </h3>

                <div className="college-excel-summary-grid">

                  <div>
                    <span>
                      Total Rows
                    </span>

                    <strong>
                      {
                        uploadResult.totalRows
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Imported
                    </span>

                    <strong>
                      {
                        uploadResult.imported
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Updated
                    </span>

                    <strong>
                      {
                        uploadResult.updated
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Skipped
                    </span>

                    <strong>
                      {
                        uploadResult.skipped
                      }
                    </strong>
                  </div>

                </div>

                {uploadResult.errors &&
                  uploadResult.errors.length > 0 && (
                    <div className="college-excel-errors">

                      <strong>
                        Rows with errors:
                      </strong>

                      <ul>

                        {uploadResult.errors.map(
                          (
                            error,
                            index
                          ) => (
                            <li
                              key={index}
                            >
                              {error}
                            </li>
                          )
                        )}

                      </ul>

                    </div>
                  )}

              </div>
            )}

          </div>

          {/* STUDENT LIST */}

          <div className="college-section-card">

            <div className="college-section-header">

              <div>

                <span className="college-eyebrow">
                  REGISTERED STUDENTS
                </span>

                <h2>
                  Student Accounts
                </h2>

                <p>
                  Students who have
                  completed registration
                  using the college
                  verification list.
                </p>

              </div>

              <span className="college-count-badge">
                {students.length}
              </span>

            </div>

            {students.length === 0 ? (

              <div className="college-empty-state">

                <div>🎓</div>

                <h3>
                  No students registered
                  yet
                </h3>

                <p>
                  Upload the student
                  Excel file above.
                  Students will appear
                  here after they
                  complete registration.
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

                    {students.map(
                      (student) => (
                        <tr
                          key={
                            student._id
                          }
                        >

                          <td>
                            <strong>
                              {
                                student.name
                              }
                            </strong>
                          </td>

                          <td>
                            {
                              student.registerNumber
                            }
                          </td>

                          <td>
                            {
                              student.department
                            }
                          </td>

                          <td>
                            {
                              student.semester
                            }
                          </td>

                          <td>
                            {
                              student.email
                            }
                          </td>

                          <td>
                            {
                              student.phone ||
                              "—"
                            }
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

              <h1>
                Faculty Management
              </h1>

              <p>
                Review faculty registration
                requests and manage approved
                faculty members.
              </p>

            </div>

          </div>

          {/* PENDING FACULTY */}

          <div className="college-section-card">

            <div className="college-section-header">

              <div>

                <h2>
                  Pending Faculty Requests
                </h2>

                <p>
                  Faculty members waiting
                  for approval.
                </p>

              </div>

              <span className="college-count-badge">
                {pendingFaculty.length}
              </span>

            </div>

            {pendingFaculty.length === 0 ? (

              <div className="college-small-empty">
                No pending faculty
                requests.
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

                    {pendingFaculty.map(
                      (f) => (
                        <tr key={f._id}>

                          <td>
                            <strong>
                              {f.name}
                            </strong>
                          </td>

                          <td>
                            {f.department}
                          </td>

                          <td>
                            {f.designation}
                          </td>

                          <td>
                            {f.email}
                          </td>

                          <td>

                            <div className="college-action-group">

                              <button
                                onClick={() =>
                                  approveFaculty(
                                    f._id
                                  )
                                }
                                className="college-approve-button"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  rejectFaculty(
                                    f._id
                                  )
                                }
                                className="college-reject-button"
                              >
                                Reject
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

          {/* APPROVED FACULTY */}

          <div className="college-section-card">

            <div className="college-section-header">

              <div>

                <h2>
                  Approved Faculty
                </h2>

                <p>
                  Faculty members currently
                  approved by the college.
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
                      <th>
                        Assigned Students
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {approvedFaculty.map(
                      (f) => (
                        <tr key={f._id}>

                          <td>
                            <strong>
                              {f.name}
                            </strong>
                          </td>

                          <td>
                            {f.department}
                          </td>

                          <td>
                            {f.designation}
                          </td>

                          <td>
                            {f.email}
                          </td>

                          <td>

                            <span className="college-number-pill">
                              {getFacultyWorkload(
                                f._id
                              )}
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

              <h1>
                Internship Applications
              </h1>

              <p>
                Review company-approved
                applications and manage
                college-approved internships.
              </p>

            </div>

          </div>

          {/* ==================================
              PENDING APPLICATIONS
          =================================== */}

          <div className="college-application-section">

            <div className="college-application-section-header">

              <div>

                <span className="college-eyebrow">
                  NEEDS REVIEW
                </span>

                <h2>
                  Pending Applications
                </h2>

                <p>
                  Company-approved applications
                  waiting for college verification
                  and approval.
                </p>

              </div>

              <span className="college-count-badge">
                {pendingApplications.length}
              </span>

            </div>

            {pendingApplications.length === 0 ? (

              <div className="college-small-empty">
                No applications are waiting
                for college approval.
              </div>

            ) : (

              <div className="college-application-list">

                {pendingApplications.map(
                  (app) => (
                    <div
                      key={app._id}
                      className="college-application-card"
                    >

                      {/* HEADER */}

                      <div className="college-application-top">

                        <div>

                          <span className="college-application-label">
                            INTERNSHIP APPLICATION
                          </span>

                          <h2>
                            {app.student?.name ||
                              "Student"}
                          </h2>

                          <p>
                            {app.internship
                              ?.title ||
                              "Internship"}

                            {" · "}

                            {app.company
                              ?.companyName ||
                              "Company"}
                          </p>

                        </div>

                        <span className="college-status-badge pending">
                          Company Approved
                        </span>

                      </div>

                      {/* DETAILS */}

                      <div className="college-application-details">

                        <div>
                          <span>
                            Register Number
                          </span>

                          <strong>
                            {app.student
                              ?.registerNumber ||
                              "—"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Department
                          </span>

                          <strong>
                            {app.student
                              ?.department ||
                              "—"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Company
                          </span>

                          <strong>
                            {app.company
                              ?.companyName ||
                              "—"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Applied On
                          </span>

                          <strong>
                            {app.createdAt
                              ? new Date(
                                  app.createdAt
                                ).toLocaleDateString()
                              : "—"}
                          </strong>
                        </div>

                      </div>

                      {/* CONFIRMATION LETTER */}

                      {app.confirmationLetter
                        ?.message && (
                        <div className="college-confirmation-letter">

                          <div className="college-confirmation-header">

                            <div className="college-confirmation-icon">
                              📩
                            </div>

                            <div>

                              <h3>
                                Company Confirmation Letter
                              </h3>

                              <p>
                                Confirmation received
                                from the company
                              </p>

                            </div>

                          </div>

                          <div className="college-confirmation-paper">

                            <div className="college-letter-subject">

                              <strong>
                                Subject:
                              </strong>{" "}

                              {app.confirmationLetter
                                .subject ||
                                "Internship Application Confirmation"}

                            </div>

                            <div className="college-letter-message">

                              {app.confirmationLetter
                                .message
                                .split("\n")
                                .map(
                                  (
                                    line,
                                    index
                                  ) => (
                                    <p
                                      key={
                                        index
                                      }
                                    >
                                      {line ||
                                        "\u00A0"}
                                    </p>
                                  )
                                )}

                            </div>

                            {app.confirmationLetter
                              .sentAt && (
                              <div className="college-letter-date">

                                Sent on:{" "}

                                {new Date(
                                  app.confirmationLetter
                                    .sentAt
                                ).toLocaleString()}

                              </div>
                            )}

                          </div>

                          {/* FORWARD STATUS */}

                          {app.forwardedToCollege ? (

                            <div className="college-forwarded-letter">

                              <div className="college-forwarded-icon">
                                ✓
                              </div>

                              <div>

                                <strong>
                                  Forwarded by Student
                                </strong>

                                <span>
                                  The student has
                                  forwarded this
                                  confirmation letter
                                  to the college.
                                </span>

                                {app.forwardedAt && (
                                  <small>
                                    Forwarded on{" "}
                                    {new Date(
                                      app.forwardedAt
                                    ).toLocaleString()}
                                  </small>
                                )}

                              </div>

                            </div>

                          ) : (

                            <div className="college-waiting-forward">

                              <span>
                                📨
                              </span>

                              <div>

                                <strong>
                                  Waiting for Student
                                </strong>

                                <p>
                                  The student must
                                  forward this
                                  confirmation letter
                                  to the college before
                                  the internship can be
                                  approved.
                                </p>

                              </div>

                            </div>

                          )}

                        </div>
                      )}

                      {/* APPROVE / REJECT */}

                      {app.forwardedToCollege ? (

                        <div className="college-application-actions">

                          <button
                            onClick={() =>
                              approveApplication(
                                app._id
                              )
                            }
                            className="college-approve-button"
                          >
                            ✓ Approve Internship
                          </button>

                          <button
                            onClick={() =>
                              rejectApplication(
                                app._id
                              )
                            }
                            className="college-reject-button"
                          >
                            Reject
                          </button>

                        </div>

                      ) : (

                        <div className="college-application-note waiting">
                          📨 Waiting for the student
                          to forward the confirmation
                          letter.
                        </div>

                      )}

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* ==================================
              APPROVED INTERNSHIPS
          =================================== */}

          <div className="college-application-section approved-internships-section">

            <div className="college-application-section-header">

              <div>

                <span className="college-eyebrow">
                  COLLEGE APPROVED
                </span>

                <h2>
                  Approved Internships
                </h2>

                <p>
                  Students whose internships
                  have been approved by the college.
                </p>

              </div>

              <span className="college-count-badge">
                {approvedApplications.length}
              </span>

            </div>

            {approvedApplications.length === 0 ? (

              <div className="college-approved-empty">

                <div className="college-approved-empty-icon">
                  ✓
                </div>

                <h3>
                  No approved internships yet
                </h3>

                <p>
                  Once you approve an internship,
                  the student and internship details
                  will appear here.
                </p>

              </div>

            ) : (

              <div className="college-approved-list">

                {approvedApplications.map(
                  (app) => (
                    <div
                      key={app._id}
                      className="college-approved-card"
                    >

                      {/* APPROVED HEADER */}

                      <div className="college-approved-card-header">

                        <div className="college-approved-student">

                          <div className="college-approved-avatar">
                            {app.student?.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "S"}
                          </div>

                          <div>

                            <span>
                              APPROVED STUDENT
                            </span>

                            <h3>
                              {app.student?.name ||
                                "Student"}
                            </h3>

                            <p>
                              {app.student
                                ?.registerNumber ||
                                "Register number unavailable"}
                            </p>

                          </div>

                        </div>

                        <div className="college-approved-status">
                          <span>
                            ✓
                          </span>

                          College Approved
                        </div>

                      </div>

                      {/* APPROVED DETAILS */}

                      <div className="college-approved-details">

                        <div className="college-approved-detail">

                          <span>
                            Department
                          </span>

                          <strong>
                            {app.student
                              ?.department ||
                              "—"}
                          </strong>

                        </div>

                        <div className="college-approved-detail">

                          <span>
                            Semester
                          </span>

                          <strong>
                            {app.student
                              ?.semester ||
                              "—"}
                          </strong>

                        </div>

                        <div className="college-approved-detail">

                          <span>
                            Email
                          </span>

                          <strong>
                            {app.student
                              ?.email ||
                              "—"}
                          </strong>

                        </div>

                        <div className="college-approved-detail">

                          <span>
                            Phone
                          </span>

                          <strong>
                            {app.student
                              ?.phone ||
                              "—"}
                          </strong>

                        </div>

                        <div className="college-approved-detail">

                          <span>
                            Company
                          </span>

                          <strong>
                            {app.company
                              ?.companyName ||
                              "—"}
                          </strong>

                        </div>

                        <div className="college-approved-detail">

                          <span>
                            Internship
                          </span>

                          <strong>
                            {app.internship
                              ?.title ||
                              "—"}
                          </strong>

                        </div>

                        <div className="college-approved-detail">

                          <span>
                            Position
                          </span>

                          <strong>
                            {app.position ||
                              "—"}
                          </strong>

                        </div>

                        <div className="college-approved-detail">

                          <span>
                            Applied On
                          </span>

                          <strong>
                            {app.createdAt
                              ? new Date(
                                  app.createdAt
                                ).toLocaleDateString()
                              : "—"}
                          </strong>

                        </div>

                      </div>

                      {/* FACULTY GUIDE */}

                      <div className="college-approved-footer">

                        <div className="college-approved-faculty">

                          <span>
                            FACULTY GUIDE
                          </span>

                          <strong>
                            {app.faculty?.name ||
                              "Predefined faculty"}
                          </strong>

                          {app.faculty?.department && (
                            <small>
                              {
                                app.faculty
                                  .department
                              }
                            </small>
                          )}

                        </div>

                        <div className="college-approved-internship">

                          <span>
                            INTERNSHIP
                          </span>

                          <strong>
                            {app.internship
                              ?.duration ||
                              "Duration not available"}
                          </strong>

                        </div>

                      </div>

                      {/* APPROVAL NOTE */}

                      <div className="college-approved-note">

                        <span>
                          ✓
                        </span>

                        <div>

                          <strong>
                            Internship Approved
                          </strong>

                          <p>
                            This internship has
                            been verified and approved
                            by the college.
                          </p>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* ==================================
              OTHER APPLICATIONS
          =================================== */}

          {otherApplications.length > 0 && (

            <div className="college-application-section college-other-applications">

              <div className="college-application-section-header">

                <div>

                  <span className="college-eyebrow">
                    OTHER APPLICATIONS
                  </span>

                  <h2>
                    Application Status
                  </h2>

                  <p>
                    Applications that are not
                    currently waiting for college
                    approval.
                  </p>

                </div>

                <span className="college-count-badge">
                  {otherApplications.length}
                </span>

              </div>

              <div className="college-other-status-list">

                {otherApplications.map(
                  (app) => (
                    <div
                      key={app._id}
                      className="college-other-status-card"
                    >

                      <div>

                        <strong>
                          {app.student?.name ||
                            "Student"}
                        </strong>

                        <span>
                          {app.internship?.title ||
                            "Internship"}
                          {" · "}
                          {app.company?.companyName ||
                            "Company"}
                        </span>

                      </div>

                      <span
                        className={`college-status-badge ${getStatusClass(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>

                    </div>
                  )
                )}

              </div>

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

              <h1>
                Faculty Workload
              </h1>

              <p>
                View the current number of
                approved internship assignments
                for each faculty member.
              </p>

            </div>

          </div>

          <div className="college-section-card">

            {approvedFaculty.length === 0 ? (

              <div className="college-empty-state">

                <div>👨‍🏫</div>

                <h3>
                  No approved faculty
                  available
                </h3>

                <p>
                  Approved faculty will
                  appear here when they
                  are available.
                </p>

              </div>

            ) : (

              <div className="college-table-wrapper">

                <table className="college-table">

                  <thead>

                    <tr>

                      <th>
                        Faculty
                      </th>

                      <th>
                        Department
                      </th>

                      <th>
                        Assigned Students
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {approvedFaculty.map(
                      (f) => (
                        <tr
                          key={f._id}
                        >

                          <td>
                            <strong>
                              {f.name}
                            </strong>
                          </td>

                          <td>
                            {f.department}
                          </td>

                          <td>

                            <span className="college-number-pill">
                              {getFacultyWorkload(
                                f._id
                              )}
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

  // ==========================================
  // MAIN LAYOUT
  // ==========================================

  return (
    <div className="college-dashboard">

      {/* SIDEBAR */}

      <aside className="college-sidebar">

        <div className="college-brand">

          <div className="college-brand-logo">
            IL
          </div>

          <div>

            <h2>
              Intern<span>Link</span>
            </h2>

            <p>
              College Portal
            </p>

          </div>

        </div>

        <div className="college-sidebar-divider"></div>

        <nav className="college-sidebar-nav">

          <button
            className={`college-nav-item ${
              activeSection ===
              "dashboard"
                ? "active"
                : ""
            }`}
            onClick={onGoToDashboard}
          >
            <span className="college-nav-icon">
              ⌂
            </span>

            <span>
              Dashboard
            </span>
          </button>

          <button
            className={`college-nav-item ${
              activeSection ===
              "students"
                ? "active"
                : ""
            }`}
            onClick={onGoToStudents}
          >
            <span className="college-nav-icon">
              🎓
            </span>

            <span>
              Students
            </span>
          </button>

          <button
            className={`college-nav-item ${
              activeSection ===
              "faculty"
                ? "active"
                : ""
            }`}
            onClick={onGoToFaculty}
          >
            <span className="college-nav-icon">
              👨‍🏫
            </span>

            <span>
              Faculty
            </span>
          </button>

          <button
            className={`college-nav-item ${
              activeSection ===
              "applications"
                ? "active"
                : ""
            }`}
            onClick={
              onGoToApplications
            }
          >
            <span className="college-nav-icon">
              📄
            </span>

            <span>
              Applications
            </span>
          </button>

          <button
            className={`college-nav-item ${
              activeSection ===
              "workload"
                ? "active"
                : ""
            }`}
            onClick={onGoToWorkload}
          >
            <span className="college-nav-icon">
              ◉
            </span>

            <span>
              Faculty Workload
            </span>
          </button>

        </nav>

        <div className="college-sidebar-bottom">

          <button
            className={`college-nav-item ${
              activeSection ===
                "profile" ||
              activeSection ===
                "editProfile" ||
              activeSection ===
                "changePassword"
                ? "active"
                : ""
            }`}
            onClick={
              onGoToProfile
            }
          >
            <span className="college-nav-icon">
              👤
            </span>

            <span>
              My Profile
            </span>
          </button>

          <button
            className="college-logout-button"
            onClick={onLogout}
          >
            <span>
              ↪
            </span>

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* MAIN AREA */}

      <div className="college-main">

        <header className="college-header">

          <div>

            <span className="college-header-label">
              COLLEGE PORTAL
            </span>

            <h1>
              {college.collegeName}
            </h1>

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

              <span>
                College Portal
              </span>

            </div>

          </div>

        </header>

        {/* MESSAGE */}

        {message && (
          <div className="college-message">

            <div>

              <strong>
                Notice
              </strong>

              <span>
                {message}
              </span>

            </div>

            <button
              onClick={() =>
                setMessage("")
              }
              className="college-message-close"
            >
              ×
            </button>

          </div>
        )}

        {/* CONTENT */}

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