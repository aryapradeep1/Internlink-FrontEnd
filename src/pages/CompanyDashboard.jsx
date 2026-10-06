import { useEffect, useState } from "react";
import "../css/CompanyDashboard.css";
import "../css/CompanyDashboardHome.css";

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
  const [applicationView, setApplicationView] = useState("pending");

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
      console.log(
        "GUIDES RECEIVED FROM BACKEND:",
        data.guides
      );

      setGuides(data.guides || []);
      setGuideError("");
    } catch (error) {
      console.error(
        "Company Guide fetch error:",
        error
      );

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
  // APPLICATION GROUPS
  // =====================================================

  const waitingCompanyApproval =
    applications.filter(
      (application) =>
        application.status === "Pending"
    );

  const waitingCollegeApproval =
    applications.filter(
      (application) =>
        application.status ===
        "CompanyApproved"
    );

  const approvedInternships =
    applications.filter(
      (application) =>
        application.status ===
        "CollegeApproved"
    );

  const rejectedApplications =
    applications.filter(
      (application) =>
        application.status ===
          "CompanyRejected" ||
        application.status ===
          "CollegeRejected"
    );

  // =====================================================
  // APPLICATION VIEW GROUPS
  // Rejected applications are intentionally hidden
  // =====================================================

  const pendingApplicationsList =
    applications.filter(
      (application) =>
        application.status === "Pending"
    );

  const collegeApprovalApplicationsList =
    applications.filter(
      (application) =>
        application.status ===
        "CompanyApproved"
    );

  const approvedApplicationsList =
    applications.filter(
      (application) =>
        application.status ===
          "CollegeApproved" &&
        application.assignmentStatus !==
          "Completed"
    );

  const completedInternshipsList =
    applications.filter(
      (application) =>
        application.assignmentStatus ===
        "Completed"
    );

  // =====================================================
  // APPLICATION COUNTS
  // =====================================================

  const totalApplications =
    applications.length;

  const pendingApplications =
    waitingCompanyApproval.length;

  const approvedApplications =
    approvedInternships.length;

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
      case "CollegeRejected":
        return "status-rejected";

      default:
        return "status-default";
    }
  };

  // =====================================================
  // APPLICATION CARD
  // =====================================================

  const renderApplicationCard = (
    application
  ) => (
    <div
      className="company-application-card"
      key={application._id}
    >
      {/* APPLICATION HEADER */}

      <div className="company-application-header">
        <div className="company-student-main">
          <div className="company-large-avatar">
            {(
              application.student?.name ||
              "S"
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
              {application.position}
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

      {/* =================================================
          WAITING FOR COMPANY APPROVAL
      ================================================= */}

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

      {/* =================================================
          WAITING FOR COLLEGE APPROVAL
      ================================================= */}

      {application.status ===
        "CompanyApproved" && (
        <div className="company-info-message company-college-waiting-message">
          <span>✓</span>

          <div>
            <strong>
              Company approved
            </strong>

            <p>
              Confirmation letter has
              been sent to the student.
              Waiting for college approval.
            </p>

            <small>
              Faculty assignment will be
              available after college approval.
            </small>
          </div>
        </div>
      )}

      {/* =================================================
          COLLEGE APPROVED / INTERNSHIP ACTIVE
      ================================================= */}

      {application.status ===
        "CollegeApproved" && (
        <div className="company-approved-internship-area">

          <div className="company-college-approved-banner">
            <span>✓</span>

            <div>
              <strong>
                College Approved
              </strong>

              <p>
                This internship has been
                approved by the college and
                can proceed.
              </p>
            </div>
          </div>

          {/* COMPANY GUIDE ASSIGNMENT */}

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
        </div>
      )}

      {/* =================================================
          REJECTED
      ================================================= */}

      {(application.status ===
        "CompanyRejected" ||
        application.status ===
          "CollegeRejected") && (
        <div className="company-rejected-message">
          <span>!</span>

          <div>
            <strong>
              Application rejected
            </strong>

            <p>
              {application.status ===
              "CollegeRejected"
                ? "This internship application was rejected by the college."
                : "This application was rejected by the company."}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // =====================================================
  // APPLICATION SECTION
  // =====================================================

  const renderApplicationSection = (
    eyebrow,
    title,
    description,
    applicationList,
    sectionClass
  ) => (
    <section
      className={`company-application-section ${sectionClass}`}
    >
      <div className="company-application-section-heading">
        <div>
          <span className="company-section-eyebrow">
            {eyebrow}
          </span>

          <h2>{title}</h2>

          <p>{description}</p>
        </div>

        <div className="company-application-section-count">
          {applicationList.length}
        </div>
      </div>

      {applicationList.length > 0 ? (
        <div className="company-applications-list">
          {applicationList.map(
            renderApplicationCard
          )}
        </div>
      ) : (
        <div className="company-section-empty">
          <span>✓</span>

          <div>
            <strong>
              No applications here
            </strong>

            <p>
              There are currently no
              applications in this section.
            </p>
          </div>
        </div>
      )}
    </section>
  );

  // =====================================================
  // DASHBOARD CONTENT
  // =====================================================

  const renderDashboard = () => (
    <div className="company-home-dashboard">

      <section className="company-home-hero">
        <div className="company-home-copy">
          <span className="company-home-kicker">COMPANY WORKSPACE</span>

          <h1>
            Welcome to <strong>{company?.companyName || "InternLink"}</strong>
          </h1>

          <p>
            Your space to create meaningful internship opportunities,
            connect with talented FYUGP students, and support the next
            generation of professionals.
          </p>

          <div className="company-home-line">
            <span></span>
            <small>BUILD • CONNECT • GROW</small>
          </div>
        </div>

        <div className="company-home-visual" aria-hidden="true">
          <div className="company-orbit company-orbit-one"></div>
          <div className="company-orbit company-orbit-two"></div>

          <div className="company-illustration-card">
            <div className="illustration-window">
              <div className="illustration-window-top">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="illustration-content">
                <div className="illustration-person">
                  <div className="person-head"></div>
                  <div className="person-body"></div>
                </div>

                <div className="illustration-document">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>

            <div className="floating-chip chip-one">
              <span>✓</span> Internship
            </div>

            <div className="floating-chip chip-two">
              <span>✦</span> Students
            </div>
          </div>
        </div>
      </section>

      <section className="company-home-intro">
        <div className="company-home-intro-icon">✦</div>
        <div>
          <span className="company-home-section-label">WELCOME TO YOUR COMPANY SPACE</span>
          <h2>Make internships more meaningful.</h2>
          <p>
            InternLink brings companies and FYUGP students together in one
            simple workspace. Offer real-world learning opportunities, guide
            students during their internship, and help them take their first
            steps into the professional world.
          </p>
        </div>
      </section>

      <section className="company-home-feature-grid">
        <article className="company-home-feature feature-green">
          <div className="company-feature-icon">↗</div>
          <div>
            <span>OPPORTUNITIES</span>
            <h3>Create real learning experiences</h3>
            <p>
              Share internship opportunities that allow students to learn,
              practice their skills, and experience a professional environment.
            </p>
          </div>
        </article>

        <article className="company-home-feature feature-pink">
          <div className="company-feature-icon">♡</div>
          <div>
            <span>STUDENT CONNECTION</span>
            <h3>Meet the next generation</h3>
            <p>
              Discover motivated FYUGP students and give them an opportunity
              to turn their academic knowledge into practical experience.
            </p>
          </div>
        </article>

        <article className="company-home-feature feature-mint">
          <div className="company-feature-icon">✓</div>
          <div>
            <span>MENTORSHIP</span>
            <h3>Support students along the way</h3>
            <p>
              Company Guides can help interns stay connected, learn from real
              projects, and complete their internship journey successfully.
            </p>
          </div>
        </article>
      </section>

      <section className="company-home-how">
        <div className="company-how-heading">
          <span className="company-home-section-label">YOUR JOURNEY WITH INTERNLINK</span>
          <h2>A simple way to work with students.</h2>
          <p>
            Everything is organized through the workspace, so your team can
            focus on creating a valuable internship experience.
          </p>
        </div>

        <div className="company-home-steps">
          <div className="company-home-step">
            <span>01</span>
            <div>
              <strong>Share</strong>
              <p>Publish an internship opportunity for eligible students.</p>
            </div>
          </div>

          <div className="company-home-step">
            <span>02</span>
            <div>
              <strong>Connect</strong>
              <p>Review applications and select students for your opportunity.</p>
            </div>
          </div>

          <div className="company-home-step">
            <span>03</span>
            <div>
              <strong>Guide</strong>
              <p>Support the intern through their practical learning journey.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="company-home-bottom-message">
        <div>
          <span>READY WHEN YOU ARE</span>
          <h2>Your next internship opportunity can start here.</h2>
        </div>
        <div className="company-home-bottom-mark">IL</div>
      </section>

    </div>
  );

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
            Review student applications and manage
            each internship stage from one place.
          </p>
        </div>

        <div className="company-page-count">
          <strong>
            {pendingApplicationsList.length +
              collegeApprovalApplicationsList.length +
              approvedApplicationsList.length +
              completedInternshipsList.length}
          </strong>

          <span>
            Active Applications
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
      ) : (
        <>
          {/* =================================================
              APPLICATION STATUS BOXES
          ================================================= */}

          <div className="company-application-status-grid">

            {/* PENDING */}

            <button
              type="button"
              className={`company-application-status-box ${
                applicationView === "pending"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setApplicationView("pending")
              }
            >
              <div className="company-status-box-icon">
                ◷
              </div>

              <div className="company-status-box-number">
                {pendingApplicationsList.length}
              </div>

              <h3>
                Pending Applications
              </h3>

              <p>
                Waiting for company approval
              </p>

              <span className="company-status-box-arrow">
                →
              </span>
            </button>


            {/* COLLEGE APPROVAL */}

            <button
              type="button"
              className={`company-application-status-box ${
                applicationView === "college"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setApplicationView("college")
              }
            >
              <div className="company-status-box-icon college">
                ✓
              </div>

              <div className="company-status-box-number">
                {collegeApprovalApplicationsList.length}
              </div>

              <h3>
                College Approval
              </h3>

              <p>
                Waiting for college verification
              </p>

              <span className="company-status-box-arrow">
                →
              </span>
            </button>


            {/* APPROVED */}

            <button
              type="button"
              className={`company-application-status-box ${
                applicationView === "approved"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setApplicationView("approved")
              }
            >
              <div className="company-status-box-icon approved">
                ◆
              </div>

              <div className="company-status-box-number">
                {approvedApplicationsList.length}
              </div>

              <h3>
                Approved Applications
              </h3>

              <p>
                Currently active internships
              </p>

              <span className="company-status-box-arrow">
                →
              </span>
            </button>


            {/* COMPLETED */}

            <button
              type="button"
              className={`company-application-status-box ${
                applicationView === "completed"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setApplicationView("completed")
              }
            >
              <div className="company-status-box-icon completed">
                ★
              </div>

              <div className="company-status-box-number">
                {completedInternshipsList.length}
              </div>

              <h3>
                Completed Internships
              </h3>

              <p>
                Successfully completed
              </p>

              <span className="company-status-box-arrow">
                →
              </span>
            </button>

          </div>


          {/* =================================================
              SELECTED APPLICATION SECTION
          ================================================= */}

          {applicationView === "pending" &&
            renderApplicationSection(
              "PENDING APPLICATIONS",
              "Pending Applications",
              "Applications waiting for your approval.",
              pendingApplicationsList,
              "company-section-waiting-company"
            )}

          {applicationView === "college" &&
            renderApplicationSection(
              "COLLEGE VERIFICATION",
              "Waiting for College Approval",
              "Applications approved by your company and waiting for college verification.",
              collegeApprovalApplicationsList,
              "company-section-waiting-college"
            )}

          {applicationView === "approved" &&
            renderApplicationSection(
              "ACTIVE INTERNSHIPS",
              "Approved Applications",
              "Internships that have received college approval and are currently active.",
              approvedApplicationsList,
              "company-section-approved"
            )}

          {applicationView === "completed" &&
            renderApplicationSection(
              "COMPLETED INTERNSHIPS",
              "Completed Internships",
              "Internships successfully completed by students.",
              completedInternshipsList,
              "company-section-completed"
            )}
        </>
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

      {/* TOP HEADER */}

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

      {/* MAIN WORKSPACE */}

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