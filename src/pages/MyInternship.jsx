import React, { useEffect, useState } from "react";
import "../css/MyInternship.css";

function MyInternship({
  student,
  onBack,
  onGenerateCertificate,
}) {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch internship assignment
        const assignmentResponse = await fetch(
          `http://localhost:5000/api/internship-assignments/student/${student.id}`
        );

        const assignmentData =
          await assignmentResponse.json();

        if (assignmentData.status === "success") {
          setAssignment(assignmentData.assignment);
        }

        // Fetch student logbook
        const logbookResponse = await fetch(
          `http://localhost:5000/api/logbook/student/${student.id}`
        );

        const logbookData =
          await logbookResponse.json();

        if (logbookData.status === "success") {
          const total = (
            logbookData.logbooks || []
          ).reduce(
            (sum, logbook) =>
              sum + Number(logbook.hoursWorked || 0),
            0
          );

          setTotalHours(total);
        }
      } catch (error) {
        console.error(
          "Error fetching internship data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [student.id]);

  if (loading) {
    return (
      <div className="my-internship-page">
        <header className="internship-topbar">
          <div className="internship-brand">
            <strong>InterLink</strong>
            <span>INTERNSHIP MANAGEMENT</span>
          </div>

          <button
            className="internship-back-btn"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>
        </header>

        <main className="my-internship-content">
          <div className="internship-loading">
            <div className="loading-circle"></div>
            <h3>Loading internship...</h3>
            <p>Please wait while we load your internship details.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="my-internship-page">
        <header className="internship-topbar">
          <div className="internship-brand">
            <strong>InterLink</strong>
            <span>INTERNSHIP MANAGEMENT</span>
          </div>

          <button
            className="internship-back-btn"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>
        </header>

        <main className="my-internship-content">
          <div className="empty-internship">
            <div className="empty-icon">📋</div>
            <h2>No Internship Assigned Yet</h2>
            <p>
              You don't have an internship assignment at the
              moment.
            </p>

            <button
              className="empty-back-btn"
              onClick={onBack}
            >
              ← Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  const requiredHours = Number(
    assignment.internship.duration || 0
  );

  const progress =
    requiredHours > 0
      ? Math.min((totalHours / requiredHours) * 100, 100)
      : 0;

  return (
    <div className="my-internship-page">

      {/* TOP BAR */}
      <header className="internship-topbar">

        <div className="internship-brand">
          <strong>InterLink</strong>
          <span>INTERNSHIP MANAGEMENT</span>
        </div>

        <button
          className="internship-back-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

      </header>

      {/* MAIN PAGE */}
      <main className="my-internship-content">

        {/* PAGE HEADER */}
        <section className="internship-page-header">

          <div>
            <p className="page-eyebrow">
              STUDENT INTERNSHIP
            </p>

            <h1>My Internship</h1>

            <p className="page-description">
              View your internship details, progress,
              guides and certificates.
            </p>
          </div>

          <div className="internship-status">
            <span className="status-dot"></span>
            {assignment.status}
          </div>

        </section>

        {/* OVERVIEW CARD */}
        <section className="internship-overview">

          <div className="overview-heading">
            <div className="overview-icon">
              💼
            </div>

            <div>
              <span className="section-label">
                INTERNSHIP
              </span>

              <h2>
                {assignment.internship.title}
              </h2>

              <p>
                {assignment.company.companyName}
              </p>
            </div>
          </div>

          <div className="overview-details">

            <div className="detail-item">
              <span>📍</span>
              <div>
                <small>Location</small>
                <strong>
                  {assignment.internship.location || "Not specified"}
                </strong>
              </div>
            </div>

            <div className="detail-item">
              <span>⏱</span>
              <div>
                <small>Duration</small>
                <strong>
                  {assignment.internship.duration}
                </strong>
              </div>
            </div>

            <div className="detail-item">
              <span>🎓</span>
              <div>
                <small>Credits</small>
                <strong>
                  {totalHours > 60 ? "2 Credits" : "Not earned yet"}
                </strong>
              </div>
            </div>

          </div>

        </section>

        {/* INFORMATION */}
        <section className="information-section">

          <div className="section-title">
            <span className="title-icon">📑</span>
            <div>
              <h2>Internship Information</h2>
              <p>Details related to your assigned internship.</p>
            </div>
          </div>

          <div className="information-layout">

            <div className="info-card">
              <span className="info-label">
                Eligibility
              </span>

              <p>
                {assignment.internship.eligibility ||
                  "Not specified"}
              </p>
            </div>

            <div className="info-card">
              <span className="info-label">
                Skills Required
              </span>

              <p>
                {assignment.internship.skillsRequired ||
                  "Not specified"}
              </p>
            </div>

          </div>

        </section>

        {/* PROGRESS */}
        <section className="progress-section">

          <div className="progress-header">

            <div>
              <span className="section-label">
                LOGBOOK PROGRESS
              </span>

              <h2>Hours Worked</h2>
            </div>

            <div className="hours-value">
              <strong>{totalHours}</strong>
              <span>
                / {requiredHours}
              </span>
            </div>

          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>

          <div className="progress-footer">

            <span>
              {totalHours} hours completed
            </span>

            <span>
              {requiredHours > totalHours
                ? `${requiredHours - totalHours} hours remaining`
                : "Required hours completed"}
            </span>

          </div>

        </section>

        {/* GUIDES */}
        <section className="guides-section">

          <div className="section-title">
            <span className="title-icon">👥</span>

            <div>
              <h2>Internship Guides</h2>
              <p>
                Your assigned faculty and company guides.
              </p>
            </div>
          </div>

          <div className="guides-layout">

            <div className="guide-item">

              <div className="guide-icon faculty">
                🎓
              </div>

              <div>
                <span>Faculty Guide</span>

                <strong>
                  {assignment.facultyGuide
                    ? assignment.facultyGuide.name
                    : "Not Assigned"}
                </strong>
              </div>

            </div>

            <div className="guide-item">

              <div className="guide-icon company">
                🏢
              </div>

              <div>
                <span>Company Guide</span>

                <strong>
                  {assignment.companyGuide
                    ? assignment.companyGuide.name
                    : "Not Assigned"}
                </strong>
              </div>

            </div>

          </div>

        </section>

        {/* CERTIFICATES */}
        <section className="certificates-section">

          <div className="section-title">
            <span className="title-icon">📜</span>

            <div>
              <h2>Certificates</h2>
              <p>
                Your internship certificate information.
              </p>
            </div>
          </div>

          <div className="certificate-list">

            {/* COMPANY CERTIFICATE */}
            <div className="certificate-item">

              <div className="certificate-symbol">
                📄
              </div>

              <div className="certificate-information">

                <span className="certificate-type">
                  COMPANY CERTIFICATE
                </span>

                <h3>
                  Company Internship Certificate
                </h3>

                <p>
                  {assignment.certificate
                    ? "Certificate has been uploaded by the company."
                    : "Company certificate has not been uploaded yet."}
                </p>

              </div>

              <div className="certificate-action">

                {assignment.certificate ? (
                  <a
                    className="certificate-view-btn"
                    href={`http://localhost:5000/${assignment.certificate}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View / Download
                  </a>
                ) : (
                  <span className="certificate-pending">
                    Not Uploaded
                  </span>
                )}

              </div>

            </div>

            {/* INTERLINK CERTIFICATE */}
            {assignment.status === "Completed" &&
              assignment.mark !== null &&
              assignment.mark !== undefined &&
              onGenerateCertificate && (
                <div className="certificate-item generated-certificate">

                  <div className="certificate-symbol interlink-symbol">
                    🏆
                  </div>

                  <div className="certificate-information">

                    <span className="certificate-type">
                      INTERLINK CERTIFICATE
                    </span>

                    <h3>
                      InterLink Internship Certificate
                    </h3>

                    <p>
                      Your internship is completed and
                      your InterLink certificate can be generated.
                    </p>

                  </div>

                  <div className="certificate-action">

                    <button
                      className="generate-certificate"
                      onClick={() =>
                        onGenerateCertificate(
                          assignment,
                          totalHours
                        )
                      }
                    >
                      Generate Certificate
                    </button>

                  </div>

                </div>
              )}

          </div>

        </section>

        {/* MARK & CREDIT */}
        <section className="result-section">

          <div className="result-card">

            <span className="result-icon">
              ⭐
            </span>

            <div>
              <small>INTERNSHIP MARK</small>

              <strong>
                {assignment.mark !== null &&
                assignment.mark !== undefined
                  ? assignment.mark
                  : "Not given yet"}
              </strong>
            </div>

          </div>

          <div className="result-card">

            <span className="result-icon">
              🎓
            </span>

            <div>
              <small>FYUGP CREDIT</small>

              <strong>
                {totalHours > 60
                  ? "2 Credits"
                  : "Not earned yet"}
              </strong>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default MyInternship;