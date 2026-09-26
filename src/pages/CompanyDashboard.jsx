import { useEffect, useState } from "react";
import "../css/CompanyDashboard.css";

function CompanyDashboard({
  company,
  onLogout,
  onPostInternship,
  onGoToProfile,
  onGoToDashboard,
  onGoToApplications,
  onGoToCompanyGuides,
  onGoToAccountSettings,
  activeSection = "dashboard",
  children,
}) {
  const [applications, setApplications] = useState([]);
  const [guides, setGuides] = useState([]);
  const [certificateFiles, setCertificateFiles] = useState({});

  const [loading, setLoading] = useState(true);
  const [guidesLoading, setGuidesLoading] = useState(true);

  const [error, setError] = useState("");
  const [guideError, setGuideError] = useState("");

  // =====================================================
  // GET COMPANY ID
  // =====================================================

  const getCompanyId = () => {
    const companyId = company?.id || company?._id;

    console.log("LOGGED IN COMPANY:", company);
    console.log("COMPANY ID USED:", companyId);

    return companyId;
  };

  // =====================================================
  // FETCH APPLICATIONS
  // =====================================================

  const fetchApplications = async () => {
    try {
      const companyId = getCompanyId();

      if (!companyId) {
        setError("Company information not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/applications/company/${companyId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch applications"
        );
      }

      setApplications(data.applications || []);
      setError("");
    } catch (error) {
      console.error("Application fetch error:", error);
      setError("Unable to load applications");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH COMPANY GUIDES
  // =====================================================

  const fetchGuides = async () => {
    try {
      const companyId = getCompanyId();

      if (!companyId) {
        setGuideError("Company information not found");
        setGuidesLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/company-guides/company/${companyId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch Company Guides"
        );
      }

      console.log("COMPANY ID REQUESTED:", companyId);
      console.log("GUIDES RECEIVED FROM BACKEND:", data.guides);

      setGuides(data.guides || []);
      setGuideError("");
    } catch (error) {
      console.error("Company Guide fetch error:", error);

      setGuideError(
        "Unable to load Company Guides"
      );
    } finally {
      setGuidesLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchApplications();
    fetchGuides();
  }, [company]);

  // =====================================================
  // UPDATE APPLICATION STATUS
  // =====================================================

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/status/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update status"
        );
      }

      setApplications(
        (previousApplications) =>
          previousApplications.map(
            (application) =>
              application._id === applicationId
                ? {
                    ...application,
                    status,
                  }
                : application
          )
      );

      alert(data.message);
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      alert(error.message);
    }
  };

  // =====================================================
  // UPDATE COMPANY GUIDE STATUS
  // =====================================================

  const updateGuideStatus = async (
    guideId,
    status
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/company-guides/status/${guideId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update Company Guide status"
        );
      }

      setGuides(
        (previousGuides) =>
          previousGuides.map(
            (guide) =>
              guide._id === guideId
                ? {
                    ...guide,
                    status,
                  }
                : guide
          )
      );

      alert(data.message);
    } catch (error) {
      console.error(
        "Company Guide status error:",
        error
      );

      alert(error.message);
    }
  };

  // =====================================================
  // ASSIGN COMPANY GUIDE
  // =====================================================

  const assignCompanyGuide = async (
    assignmentId,
    companyGuideId
  ) => {
    if (!companyGuideId) {
      alert("Please select a Company Guide");
      return;
    }

    if (!assignmentId) {
      alert(
        "Internship assignment not found"
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/internship-assignments/company-guide/${assignmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyGuideId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to assign Company Guide"
        );
      }

      alert(data.message);

      fetchApplications();
    } catch (error) {
      console.error(
        "Assign Company Guide Error:",
        error
      );

      alert(error.message);
    }
  };

  // =====================================================
  // UPLOAD INTERNSHIP CERTIFICATE
  // =====================================================

  const uploadCertificate = async (
    assignmentId
  ) => {
    const file =
      certificateFiles[assignmentId];

    if (!file) {
      alert(
        "Please select a certificate PDF"
      );
      return;
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      alert(
        "Certificate must be a PDF file"
      );
      return;
    }

    const companyId =
      getCompanyId();

    if (!companyId) {
      alert(
        "Company information not found"
      );
      return;
    }

    if (!assignmentId) {
      alert(
        "Internship assignment not found"
      );
      return;
    }

    try {
      const formData =
        new FormData();

      formData.append(
        "certificate",
        file
      );

      formData.append(
        "companyId",
        companyId
      );

      const response =
        await fetch(
          `http://localhost:5000/api/internship-assignments/certificate/${assignmentId}`,
          {
            method: "PUT",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to upload certificate"
        );
      }

      alert(data.message);

      setCertificateFiles(
        (previousFiles) => ({
          ...previousFiles,
          [assignmentId]: null,
        })
      );

      fetchApplications();
    } catch (error) {
      console.error(
        "Certificate Upload Error:",
        error
      );

      alert(error.message);
    }
  };

  // =====================================================
  // FILTER GUIDES
  // =====================================================

  const pendingGuides =
    guides.filter(
      (guide) =>
        guide.status === "Pending"
    );

  const approvedGuides =
    guides.filter(
      (guide) =>
        guide.status === "Approved"
    );

  const rejectedGuides =
    guides.filter(
      (guide) =>
        guide.status === "Rejected"
    );

  // =====================================================
  // APPLICATION COUNTS
  // =====================================================

  const totalApplications =
    applications.length;

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status === "Pending"
    ).length;

  const approvedApplications =
    applications.filter(
      (application) =>
        application.status ===
          "CompanyApproved" ||
        application.status ===
          "CollegeApproved"
    ).length;

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";

      case "CompanyApproved":
        return "status-company-approved";

      case "CollegeApproved":
        return "status-college-approved";

      case "CompanyRejected":
        return "status-rejected";

      default:
        return "status-default";
    }
  };

  // =====================================================
  // DASHBOARD CONTENT
  // =====================================================

  const renderDashboard = () => (
    <>
      {/* HERO */}

      <section className="company-welcome-card">
        <div className="company-welcome-content">
          <div className="company-welcome-badge">
            Company Workspace
          </div>

          <h1>
            Welcome,{" "}
            {company?.companyName || "Company"}
          </h1>

          <p>
            Manage internship opportunities,
            applications, and Company Guides
            from one place.
          </p>

          <div className="company-hero-actions">
            <button
              className="company-primary-button"
              onClick={onPostInternship}
            >
              + Post Internship
            </button>

            <button
              className="company-secondary-button"
              onClick={onGoToApplications}
            >
              View Applications
            </button>
          </div>
        </div>

        <div className="company-welcome-visual">
          <div className="company-visual-circle">
            <span>IL</span>
          </div>

          <div className="company-visual-small-card">
            <strong>
              {totalApplications}
            </strong>
            <span>Applications</span>
          </div>
        </div>
      </section>

      {/* STATISTICS */}

      <section className="company-stat-grid">
        <div className="company-stat-card">
          <div className="company-stat-icon">
            ◫
          </div>

          <div>
            <span className="company-stat-label">
              Applications
            </span>

            <strong>
              {totalApplications}
            </strong>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="company-stat-icon">
            ◷
          </div>

          <div>
            <span className="company-stat-label">
              Pending
            </span>

            <strong>
              {pendingApplications}
            </strong>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="company-stat-icon">
            ✓
          </div>

          <div>
            <span className="company-stat-label">
              Approved
            </span>

            <strong>
              {approvedApplications}
            </strong>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="company-stat-icon">
            ◌
          </div>

          <div>
            <span className="company-stat-label">
              Company Guides
            </span>

            <strong>
              {approvedGuides.length}
            </strong>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}

      <section className="company-section">
        <div className="company-section-heading">
          <div>
            <span className="company-section-eyebrow">
              QUICK ACCESS
            </span>

            <h2>
              Manage your workspace
            </h2>

            <p>
              Access the most important company
              activities quickly.
            </p>
          </div>
        </div>

        <div className="company-quick-grid">
          <button
            className="company-quick-card"
            onClick={onPostInternship}
          >
            <span className="company-quick-icon">
              +
            </span>

            <span>
              <strong>
                Post Internship
              </strong>

              <small>
                Create a new internship
                opportunity
              </small>
            </span>

            <b>→</b>
          </button>

          <button
            className="company-quick-card"
            onClick={onGoToApplications}
          >
            <span className="company-quick-icon">
              ▣
            </span>

            <span>
              <strong>
                Applications
              </strong>

              <small>
                Review student applications
              </small>
            </span>

            <b>→</b>
          </button>

          <button
            className="company-quick-card"
            onClick={onGoToCompanyGuides}
          >
            <span className="company-quick-icon">
              ◌
            </span>

            <span>
              <strong>
                Company Guides
              </strong>

              <small>
                Manage your internship guides
              </small>
            </span>

            <b>→</b>
          </button>

          <button
            className="company-quick-card"
            onClick={onGoToProfile}
          >
            <span className="company-quick-icon">
              ◉
            </span>

            <span>
              <strong>
                My Profile
              </strong>

              <small>
                View company information
              </small>
            </span>

            <b>→</b>
          </button>
        </div>
      </section>

      {/* RECENT APPLICATIONS */}

      <section className="company-section">
        <div className="company-section-heading company-heading-with-action">
          <div>
            <span className="company-section-eyebrow">
              RECENT ACTIVITY
            </span>

            <h2>
              Recent Applications
            </h2>

            <p>
              Latest internship applications
              received by your company.
            </p>
          </div>

          <button
            className="company-outline-button"
            onClick={onGoToApplications}
          >
            View All
          </button>
        </div>

        {loading ? (
          <div className="company-empty-card">
            <div className="company-loader" />
            <p>
              Loading applications...
            </p>
          </div>
        ) : error ? (
          <div className="company-error-card">
            {error}
          </div>
        ) : applications.length === 0 ? (
          <div className="company-empty-card">
            <div className="company-empty-icon">
              ▣
            </div>

            <h3>
              No applications yet
            </h3>

            <p>
              Student applications will
              appear here when they apply
              to your internships.
            </p>
          </div>
        ) : (
          <div className="company-recent-list">
            {applications
              .slice(0, 5)
              .map((application) => (
                <div
                  className="company-recent-item"
                  key={application._id}
                >
                  <div className="company-student-avatar">
                    {(
                      application.student?.name ||
                      "S"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="company-recent-info">
                    <strong>
                      {
                        application.student
                          ?.name
                      }
                    </strong>

                    <span>
                      {
                        application.internship
                          ?.title
                      }
                    </span>
                  </div>

                  <span
                    className={`company-status-badge ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>
                </div>
              ))}
          </div>
        )}
      </section>
    </>
  );

  // =====================================================
  // APPLICATIONS PAGE
  // =====================================================

  const renderApplications = () => (
    <div className="company-inner-page">
      <div className="company-page-header">
        <div>
          <span className="company-section-eyebrow">
            COMPANY WORKSPACE
          </span>

          <h1>
            Applications Received
          </h1>

          <p>
            Review student applications,
            documents, approval status and
            internship assignments.
          </p>
        </div>

        <div className="company-page-count">
          <strong>
            {totalApplications}
          </strong>

          <span>
            Total Applications
          </span>
        </div>
      </div>

      {loading ? (
        <div className="company-empty-card">
          <div className="company-loader" />
          <p>
            Loading applications...
          </p>
        </div>
      ) : error ? (
        <div className="company-error-card">
          {error}
        </div>
      ) : applications.length === 0 ? (
        <div className="company-empty-card">
          <div className="company-empty-icon">
            ▣
          </div>

          <h3>
            No applications received
          </h3>

          <p>
            Applications from students will
            appear here.
          </p>
        </div>
      ) : (
        <div className="company-applications-list">
          {applications.map(
            (application) => (
              <div
                className="company-application-card"
                key={application._id}
              >
                {/* APPLICATION HEADER */}

                <div className="company-application-header">
                  <div className="company-student-main">
                    <div className="company-large-avatar">
                      {(
                        application.student
                          ?.name || "S"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h2>
                        {
                          application.student
                            ?.name
                        }
                      </h2>

                      <p>
                        Register No:{" "}
                        {
                          application.student
                            ?.registerNumber
                        }
                      </p>
                    </div>
                  </div>

                  <span
                    className={`company-status-badge ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>
                </div>

                {/* STUDENT INFORMATION */}

                <div className="company-info-section">
                  <div className="company-info-section-title">
                    Student Information
                  </div>

                  <div className="company-info-grid">
                    <div>
                      <span>Email</span>
                      <strong>
                        {
                          application.student
                            ?.email
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>
                        {
                          application.student
                            ?.phone
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Department</span>
                      <strong>
                        {
                          application.student
                            ?.department
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Semester</span>
                      <strong>
                        {
                          application.student
                            ?.semester
                        }
                      </strong>
                    </div>
                  </div>
                </div>

                {/* INTERNSHIP INFORMATION */}

                <div className="company-info-section">
                  <div className="company-info-section-title">
                    Internship Information
                  </div>

                  <div className="company-info-grid">
                    <div>
                      <span>Position</span>
                      <strong>
                        {
                          application.position
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Internship</span>
                      <strong>
                        {
                          application.internship
                            ?.title
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Location</span>
                      <strong>
                        {
                          application.internship
                            ?.location
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Duration</span>
                      <strong>
                        {
                          application.internship
                            ?.duration
                        }
                      </strong>
                    </div>
                  </div>
                </div>

                {/* DOCUMENTS */}

                <div className="company-info-section">
                  <div className="company-info-section-title">
                    Application Documents
                  </div>

                  <div className="company-document-grid">
                    {application.resume && (
                      <a
                        className="company-document-card"
                        href={`http://localhost:5000/${application.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="company-document-icon">
                          PDF
                        </span>

                        <span>
                          <strong>
                            CV / Resume
                          </strong>

                          <small>
                            Open document
                          </small>
                        </span>

                        <b>↗</b>
                      </a>
                    )}

                    {application.markList && (
                      <a
                        className="company-document-card"
                        href={`http://localhost:5000/${application.markList}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="company-document-icon">
                          PDF
                        </span>

                        <span>
                          <strong>
                            Mark List
                          </strong>

                          <small>
                            Open document
                          </small>
                        </span>

                        <b>↗</b>
                      </a>
                    )}
                  </div>
                </div>

                {/* PENDING */}

                {application.status ===
                  "Pending" && (
                  <div className="company-action-panel">
                    <div>
                      <strong>
                        Review Application
                      </strong>

                      <p>
                        Approve the application
                        to send it for college
                        verification.
                      </p>
                    </div>

                    <div className="company-action-buttons">
                      <button
                        className="company-approve-button"
                        onClick={() =>
                          updateStatus(
                            application._id,
                            "CompanyApproved"
                          )
                        }
                      >
                        ✓ Approve
                      </button>

                      <button
                        className="company-reject-button"
                        onClick={() =>
                          updateStatus(
                            application._id,
                            "CompanyRejected"
                          )
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                {/* COMPANY APPROVED */}

                {application.status ===
                  "CompanyApproved" && (
                  <div className="company-info-message">
                    <span>✓</span>

                    <div>
                      <strong>
                        Application approved
                      </strong>

                      <p>
                        Waiting for college
                        verification.
                      </p>
                    </div>
                  </div>
                )}

                {/* COLLEGE APPROVED */}

                {application.status ===
                  "CollegeApproved" && (
                  <div className="company-guide-assignment">
                    <div className="company-info-section-title">
                      Company Guide Assignment
                    </div>

                    {application.companyGuide ? (
                      <div className="assigned-guide-card">
                        <div className="company-large-avatar">
                          {(
                            application
                              .companyGuide
                              ?.name ||
                            "G"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {
                              application
                                .companyGuide
                                ?.name
                            }
                          </strong>

                          <span>
                            {
                              application
                                .companyGuide
                                ?.email
                            }
                          </span>

                          <small>
                            Employee ID:{" "}
                            {
                              application
                                .companyGuide
                                ?.employeeId
                            }
                          </small>
                        </div>

                        <span className="assigned-label">
                          Assigned
                        </span>
                      </div>
                    ) : (
                      <div className="guide-select-area">
                        <div>
                          <strong>
                            Assign a Company
                            Guide
                          </strong>

                          <p>
                            Select an approved
                            Company Guide for
                            this internship.
                          </p>
                        </div>

                        {approvedGuides.length >
                        0 ? (
                          <select
                            defaultValue=""
                            onChange={(
                              event
                            ) =>
                              assignCompanyGuide(
                                application.assignmentId,
                                event.target
                                  .value
                              )
                            }
                          >
                            <option value="">
                              Select Company Guide
                            </option>

                            {approvedGuides.map(
                              (guide) => (
                                <option
                                  key={
                                    guide._id
                                  }
                                  value={
                                    guide._id
                                  }
                                >
                                  {
                                    guide.name
                                  }{" "}
                                  -{" "}
                                  {
                                    guide.employeeId
                                  }
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          <div className="company-warning-box">
                            No approved Company
                            Guides available.
                          </div>
                        )}
                      </div>
                    )}

                    {/* CERTIFICATE */}

                    {application.assignmentStatus ===
                      "Completed" && (
                      <div className="certificate-area">
                        <div className="company-info-section-title">
                          Internship Certificate
                        </div>

                        {application.certificate ? (
                          <div className="certificate-success">
                            <span>✓</span>

                            <div>
                              <strong>
                                Certificate
                                uploaded
                              </strong>

                              <p>
                                The official
                                internship
                                completion
                                certificate
                                has already
                                been uploaded.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="certificate-upload-box">
                            <p>
                              Upload the official
                              internship completion
                              certificate.
                            </p>

                            <div className="certificate-upload-row">
                              <input
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={(
                                  event
                                ) =>
                                  setCertificateFiles(
                                    (
                                      previousFiles
                                    ) => ({
                                      ...previousFiles,
                                      [application.assignmentId]:
                                        event.target
                                          .files[0],
                                    })
                                  )
                                }
                              />

                              <button
                                className="company-primary-button"
                                onClick={() =>
                                  uploadCertificate(
                                    application.assignmentId
                                  )
                                }
                              >
                                Upload Certificate
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* COMPANY REJECTED */}

                {application.status ===
                  "CompanyRejected" && (
                  <div className="company-rejected-message">
                    <span>!</span>

                    <div>
                      <strong>
                        Application rejected
                      </strong>

                      <p>
                        This application was
                        rejected by the company.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );

  // =====================================================
  // COMPANY GUIDES PAGE
  // =====================================================

  const renderCompanyGuides = () => (
    <div className="company-inner-page">
      <div className="company-page-header">
        <div>
          <span className="company-section-eyebrow">
            COMPANY WORKSPACE
          </span>

          <h1>
            Company Guides
          </h1>

          <p>
            Manage employees who supervise
            students during their internships.
          </p>
        </div>

        <div className="company-page-count">
          <strong>
            {approvedGuides.length}
          </strong>

          <span>
            Approved Guides
          </span>
        </div>
      </div>

      {guidesLoading ? (
        <div className="company-empty-card">
          <div className="company-loader" />

          <p>
            Loading Company Guides...
          </p>
        </div>
      ) : guideError ? (
        <div className="company-error-card">
          {guideError}
        </div>
      ) : guides.length === 0 ? (
        <div className="company-empty-card">
          <div className="company-empty-icon">
            ◌
          </div>

          <h3>
            No Company Guides registered
          </h3>

          <p>
            Registered Company Guides will
            appear here.
          </p>
        </div>
      ) : (
        <>
          {/* SUMMARY */}

          <div className="guide-summary-grid">
            <div className="guide-summary-card">
              <span className="guide-summary-icon pending">
                ◷
              </span>

              <div>
                <span>
                  Pending
                </span>

                <strong>
                  {pendingGuides.length}
                </strong>
              </div>
            </div>

            <div className="guide-summary-card">
              <span className="guide-summary-icon approved">
                ✓
              </span>

              <div>
                <span>
                  Approved
                </span>

                <strong>
                  {approvedGuides.length}
                </strong>
              </div>
            </div>

            <div className="guide-summary-card">
              <span className="guide-summary-icon rejected">
                ×
              </span>

              <div>
                <span>
                  Rejected
                </span>

                <strong>
                  {rejectedGuides.length}
                </strong>
              </div>
            </div>
          </div>

          {/* PENDING */}

          {pendingGuides.length > 0 && (
            <section className="guide-section">
              <div className="guide-section-heading">
                <div>
                  <span className="company-section-eyebrow">
                    ACTION REQUIRED
                  </span>

                  <h2>
                    Pending Guides
                  </h2>

                  <p>
                    Review these registrations
                    before they can supervise
                    internship students.
                  </p>
                </div>

                <span className="guide-section-count pending-count">
                  {pendingGuides.length}
                </span>
              </div>

              <div className="guide-card-grid">
                {pendingGuides.map(
                  (guide) => (
                    <div
                      className="company-guide-card pending-guide-card"
                      key={guide._id}
                    >
                      <div className="guide-card-top">
                        <div className="guide-avatar">
                          {(
                            guide.name ||
                            "G"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="guide-status pending">
                          Pending
                        </span>
                      </div>

                      <div className="guide-card-main">
                        <h3>
                          {guide.name}
                        </h3>

                        <p>
                          Company Guide
                        </p>
                      </div>

                      <div className="guide-details">
                        <div>
                          <span>
                            Email
                          </span>

                          <strong>
                            {guide.email}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Employee ID
                          </span>

                          <strong>
                            {
                              guide.employeeId
                            }
                          </strong>
                        </div>
                      </div>

                      <div className="guide-actions">
                        <button
                          className="guide-approve-button"
                          onClick={() =>
                            updateGuideStatus(
                              guide._id,
                              "Approved"
                            )
                          }
                        >
                          ✓ Approve Guide
                        </button>

                        <button
                          className="guide-reject-button"
                          onClick={() =>
                            updateGuideStatus(
                              guide._id,
                              "Rejected"
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* APPROVED */}

          {approvedGuides.length > 0 && (
            <section className="guide-section">
              <div className="guide-section-heading">
                <div>
                  <span className="company-section-eyebrow">
                    ACTIVE GUIDES
                  </span>

                  <h2>
                    Approved Guides
                  </h2>

                  <p>
                    These employees are
                    available for internship
                    guide assignment.
                  </p>
                </div>

                <span className="guide-section-count approved-count">
                  {approvedGuides.length}
                </span>
              </div>

              <div className="guide-card-grid">
                {approvedGuides.map(
                  (guide) => (
                    <div
                      className="company-guide-card approved-guide-card"
                      key={guide._id}
                    >
                      <div className="guide-card-top">
                        <div className="guide-avatar">
                          {(
                            guide.name ||
                            "G"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="guide-status approved">
                          Approved
                        </span>
                      </div>

                      <div className="guide-card-main">
                        <h3>
                          {guide.name}
                        </h3>

                        <p>
                          Company Guide
                        </p>
                      </div>

                      <div className="guide-details">
                        <div>
                          <span>
                            Email
                          </span>

                          <strong>
                            {guide.email}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Employee ID
                          </span>

                          <strong>
                            {
                              guide.employeeId
                            }
                          </strong>
                        </div>
                      </div>

                      <div className="guide-active-footer">
                        <span className="guide-active-dot" />
                        Available for assignment
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* REJECTED */}

          {rejectedGuides.length > 0 && (
            <section className="guide-section">
              <div className="guide-section-heading">
                <div>
                  <span className="company-section-eyebrow">
                    REGISTRATION HISTORY
                  </span>

                  <h2>
                    Rejected Guides
                  </h2>

                  <p>
                    Previous guide registrations
                    that were rejected.
                  </p>
                </div>

                <span className="guide-section-count rejected-count">
                  {rejectedGuides.length}
                </span>
              </div>

              <div className="guide-card-grid">
                {rejectedGuides.map(
                  (guide) => (
                    <div
                      className="company-guide-card rejected-guide-card"
                      key={guide._id}
                    >
                      <div className="guide-card-top">
                        <div className="guide-avatar">
                          {(
                            guide.name ||
                            "G"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="guide-status rejected">
                          Rejected
                        </span>
                      </div>

                      <div className="guide-card-main">
                        <h3>
                          {guide.name}
                        </h3>

                        <p>
                          Company Guide
                        </p>
                      </div>

                      <div className="guide-details">
                        <div>
                          <span>
                            Email
                          </span>

                          <strong>
                            {guide.email}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Employee ID
                          </span>

                          <strong>
                            {
                              guide.employeeId
                            }
                          </strong>
                        </div>
                      </div>

                      <div className="guide-rejected-footer">
                        Registration rejected
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="company-dashboard-container">

      {/* =================================================
          TOP HEADER
      ================================================= */}

      <header className="company-topbar">
        <div className="company-brand">
          <div className="company-brand-mark">
            IL
          </div>

          <div>
            <strong>
              InternLink
            </strong>

            <span>
              Company Portal
            </span>
          </div>
        </div>

        <div className="company-topbar-right">
          <div className="company-user-chip">
            <div className="company-user-avatar">
              {(
                company?.companyName ||
                "C"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {company?.companyName}
              </strong>

              <span>
                Company Account
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =================================================
          MAIN WORKSPACE
      ================================================= */}

      <div className="company-workspace">

        {/* SIDEBAR */}

        <aside className="company-sidebar">

          <div className="company-sidebar-heading">
            <span>
              WORKSPACE
            </span>
          </div>

          <nav className="company-navigation">

            <button
              className={`company-nav-item ${
                activeSection === "dashboard"
                  ? "company-nav-active"
                  : ""
              }`}
              onClick={onGoToDashboard}
            >
              <span className="company-nav-icon">
                ⌂
              </span>

              <span>
                Dashboard
              </span>
            </button>

            <button
              className={`company-nav-item ${
                activeSection === "profile"
                  ? "company-nav-active"
                  : ""
              }`}
              onClick={onGoToProfile}
            >
              <span className="company-nav-icon">
                ◉
              </span>

              <span>
                My Profile
              </span>
            </button>

            <button
              className={`company-nav-item ${
                activeSection ===
                "postInternship"
                  ? "company-nav-active"
                  : ""
              }`}
              onClick={onPostInternship}
            >
              <span className="company-nav-icon">
                +
              </span>

              <span>
                Post Internship
              </span>
            </button>

            <button
              className={`company-nav-item ${
                activeSection ===
                "applications"
                  ? "company-nav-active"
                  : ""
              }`}
              onClick={onGoToApplications}
            >
              <span className="company-nav-icon">
                ▣
              </span>

              <span>
                Applications
              </span>

              {totalApplications > 0 && (
                <span className="company-nav-count">
                  {totalApplications}
                </span>
              )}
            </button>

            <button
              className={`company-nav-item ${
                activeSection ===
                "guides"
                  ? "company-nav-active"
                  : ""
              }`}
              onClick={
                onGoToCompanyGuides
              }
            >
              <span className="company-nav-icon">
                ◌
              </span>

              <span>
                Company Guides
              </span>

              {pendingGuides.length >
                0 && (
                <span className="company-nav-count company-nav-count-alert">
                  {pendingGuides.length}
                </span>
              )}
            </button>

            <button
              className={`company-nav-item ${
                activeSection ===
                "settings"
                  ? "company-nav-active"
                  : ""
              }`}
              onClick={
                onGoToAccountSettings
              }
            >
              <span className="company-nav-icon">
                ⚙
              </span>

              <span>
                Account Settings
              </span>
            </button>

          </nav>

          <div className="company-sidebar-bottom">
            <button
              className="company-logout-button"
              onClick={onLogout}
            >
              <span>
                ↪
              </span>

              Logout
            </button>
          </div>
        </aside>

        {/* CONTENT */}

        <main className="company-dashboard-content">

          {activeSection ===
            "dashboard" && (
            <div className="company-content-inner">
              {renderDashboard()}
            </div>
          )}

          {activeSection ===
            "applications" && (
            <div className="company-content-inner">
              {renderApplications()}
            </div>
          )}

          {activeSection ===
            "guides" && (
            <div className="company-content-inner">
              {renderCompanyGuides()}
            </div>
          )}

          {activeSection !==
            "dashboard" &&
            activeSection !==
              "applications" &&
            activeSection !==
              "guides" && (
            <div className="company-content-inner company-child-page">
              {children}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default CompanyDashboard;