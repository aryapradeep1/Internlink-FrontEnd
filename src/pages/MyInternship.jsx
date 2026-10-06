import { useEffect, useState } from "react";
import "../css/MyInternship.css";

function MyInternship({
  student,
  onBack,
  onGenerateCertificate,
}) {
  const [assignment, setAssignment] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH CURRENT INTERNSHIP
  // =====================================================

  useEffect(() => {
    const fetchMyInternship = async () => {
      try {
        setLoading(true);
        setError("");

        // -----------------------------------------------
        // FETCH ASSIGNED INTERNSHIP
        // -----------------------------------------------

        const assignmentResponse = await fetch(
          `http://localhost:5000/api/internship-assignments/student/${student.id}`
        );

        if (!assignmentResponse.ok) {
          throw new Error(
            "Unable to fetch internship assignment"
          );
        }

        const assignmentData =
          await assignmentResponse.json();

        console.log(
          "My internship assignment:",
          assignmentData.assignment
        );

        setAssignment(
          assignmentData.assignment || null
        );

        // -----------------------------------------------
        // FETCH LOGBOOK HOURS
        // -----------------------------------------------

        try {
          const logbookResponse = await fetch(
            `http://localhost:5000/api/logbook/student/${student.id}`
          );

          if (logbookResponse.ok) {
            const logbookData =
              await logbookResponse.json();

            console.log(
              "My internship logbooks:",
              logbookData.logbooks
            );

            const hours = (
              logbookData.logbooks || []
            ).reduce(
              (total, logbook) =>
                total +
                Number(logbook.hoursWorked || 0),
              0
            );

            setTotalHours(hours);
          }
        } catch (logbookError) {
          console.error(
            "Logbook fetch failed:",
            logbookError
          );

          setTotalHours(0);
        }
      } catch (error) {
        console.error(
          "My internship fetch failed:",
          error
        );

        setError(
          "Unable to load your internship details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (student?.id) {
      fetchMyInternship();
    }
  }, [student]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="my-internship-page">

        <div className="my-internship-loading">

          <div className="my-internship-loader"></div>

          <h2>
            Loading your internship...
          </h2>

          <p>
            Please wait while we load your internship
            details.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="my-internship-page">

        <div className="my-internship-message error">

          <div className="message-icon">
            !
          </div>

          <h2>
            Unable to Load Internship
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="my-internship-back-btn"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // NO CURRENT INTERNSHIP
  // =====================================================

  if (!assignment) {
    return (
      <div className="my-internship-page">

        <div className="my-internship-empty">

          <div className="empty-icon">
            ◆
          </div>

          <span className="my-internship-eyebrow">
            MY INTERNSHIP
          </span>

          <h1>
            No Current Internship
          </h1>

          <p>
            You do not have an assigned internship
            at the moment.
          </p>

          <button
            type="button"
            className="my-internship-back-btn"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const internship = assignment.internship;
  const company = assignment.company;
  const facultyGuide = assignment.facultyGuide;
  const companyGuide = assignment.companyGuide;

  const internshipDuration =
    internship?.duration || "Not specified";

  const status =
    assignment.status || "Assigned";

  const credits =
    assignment.credits ?? 0;

  const mark =
    assignment.mark !== null &&
    assignment.mark !== undefined
      ? assignment.mark
      : "Not assigned";

  const requiredHours = 60;

  const hoursProgress = Math.min(
    (totalHours / requiredHours) * 100,
    100
  );

  const certificateUrl =
    assignment.certificate
      ? `http://localhost:5000/${assignment.certificate}`
      : null;

  // =====================================================
  // CERTIFICATE
  // =====================================================

  const handleGenerateCertificate = () => {
    if (
      status === "Completed" &&
      assignment.mark !== null &&
      assignment.mark !== undefined &&
      onGenerateCertificate
    ) {
      onGenerateCertificate(
        assignment,
        totalHours
      );
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="my-internship-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="my-internship-header">

        <div>

          <span className="my-internship-eyebrow">
            MY INTERNSHIP
          </span>

          <h1>
            Current Internship
          </h1>

          <p>
            View the details and progress of your
            assigned internship.
          </p>

        </div>

      </div>


      {/* =================================================
          MAIN INTERNSHIP CARD
      ================================================= */}

      <section className="current-internship-card">

        {/* TOP */}
        <div className="current-internship-top">

          <div className="internship-title-area">

            <div className="internship-company-mark">
              {company?.companyName
                ? company.companyName
                    .charAt(0)
                    .toUpperCase()
                : "I"}
            </div>

            <div>

              <span className="card-small-label">
                INTERNSHIP
              </span>

              <h2>
                {internship?.title ||
                  "Internship"}
              </h2>

              <p>
                {company?.companyName ||
                  "Company not available"}
              </p>

            </div>

          </div>


          <div
            className={`internship-status-badge status-${status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {status}
          </div>

        </div>


        {/* DIVIDER */}
        <div className="internship-card-divider"></div>


        {/* =================================================
            DETAILS
        ================================================= */}

        <div className="internship-details-grid">

          <div className="internship-info">

            <span>
              Company
            </span>

            <strong>
              {company?.companyName ||
                "Not available"}
            </strong>

          </div>


          <div className="internship-info">

            <span>
              Location
            </span>

            <strong>
              {internship?.location ||
                "Not specified"}
            </strong>

          </div>


          <div className="internship-info">

            <span>
              Duration
            </span>

            <strong>
              {internshipDuration}
            </strong>

          </div>


          <div className="internship-info">

            <span>
              Credits
            </span>

            <strong>
              {credits}
            </strong>

          </div>


          <div className="internship-info">

            <span>
              Faculty Guide
            </span>

            <strong>
              {facultyGuide?.name ||
                "Not assigned"}
            </strong>

          </div>


          <div className="internship-info">

            <span>
              Company Guide
            </span>

            <strong>
              {companyGuide?.name ||
                "Not assigned"}
            </strong>

          </div>


          <div className="internship-info">

            <span>
              Mark
            </span>

            <strong>
              {mark}
            </strong>

          </div>


          <div className="internship-info">

            <span>
              Internship Status
            </span>

            <strong>
              {status}
            </strong>

          </div>

        </div>


        {/* =================================================
            INTERNSHIP DESCRIPTION
        ================================================= */}

        {internship?.description && (
          <div className="internship-description">

            <span className="section-label">
              ABOUT THE INTERNSHIP
            </span>

            <p>
              {internship.description}
            </p>

          </div>
        )}

      </section>


      {/* =================================================
          PROGRESS + HOURS
      ================================================= */}

      <section className="internship-progress-card">

        <div className="progress-heading">

          <div>

            <span className="section-label">
              INTERNSHIP PROGRESS
            </span>

            <h2>
              Logbook Hours
            </h2>

          </div>

          <div className="hours-number">

            <strong>
              {totalHours}
            </strong>

            <span>
              / {requiredHours} hrs
            </span>

          </div>

        </div>


        <div className="progress-track">

          <div
            className="progress-fill"
            style={{
              width: `${hoursProgress}%`,
            }}
          ></div>

        </div>


        <div className="progress-bottom">

          <span>
            {totalHours >= requiredHours
              ? "✓ Required hours completed"
              : `${requiredHours - totalHours} hours remaining`}
          </span>

          <span>
            {Math.round(hoursProgress)}%
          </span>

        </div>

      </section>


      {/* =================================================
          CERTIFICATE
      ================================================= */}

      {(certificateUrl ||
        (status === "Completed" &&
          assignment.mark !== null &&
          assignment.mark !== undefined)) && (
        <section className="internship-certificate-card">

          <div className="certificate-icon">
            ✦
          </div>

          <div className="certificate-content">

            <span className="section-label">
              CERTIFICATE
            </span>

            <h2>
              Internship Certificate
            </h2>

            <p>
              Your internship certificate is available
              through the options below.
            </p>

          </div>


          <div className="certificate-actions">

            {certificateUrl && (
              <>
                <a
                  href={certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="certificate-btn secondary"
                >
                  View Certificate
                </a>

                <a
                  href={certificateUrl}
                  download
                  className="certificate-btn secondary"
                >
                  Download
                </a>
              </>
            )}


            {!certificateUrl &&
              status === "Completed" &&
              assignment.mark !== null &&
              assignment.mark !== undefined && (
                <button
                  type="button"
                  className="certificate-btn primary"
                  onClick={
                    handleGenerateCertificate
                  }
                >
                  Generate Certificate
                </button>
              )}

          </div>

        </section>
      )}


      {/* =================================================
          BACK
      ================================================= */}

      <div className="my-internship-footer">

        <button
          type="button"
          className="my-internship-back-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default MyInternship;