import { useEffect, useState } from "react";
import "../css/MyApplications.css";

function MyApplications({ student, onBack }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [forwardingApplicationId, setForwardingApplicationId] =
    useState(null);

  // =====================================================
  // FETCH APPLICATIONS
  // =====================================================

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const studentId =
          student?.id || student?._id;

        if (!studentId) {
          throw new Error(
            "Student information not found"
          );
        }

        const response = await fetch(
          `http://localhost:5000/api/applications/student/${studentId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch applications"
          );
        }

        setApplications(
          data.applications || []
        );
      } catch (error) {
        console.error(
          "Fetch applications error:",
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [student?.id, student?._id]);

  // =====================================================
  // FORWARD CONFIRMATION LETTER TO COLLEGE
  // =====================================================

  const forwardToCollege = async (
    applicationId
  ) => {
    try {
      setForwardingApplicationId(
        applicationId
      );

      setError("");

      const response = await fetch(
        `http://localhost:5000/api/applications/forward-to-college/${applicationId}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to forward confirmation letter"
        );
      }

      setApplications(
        (currentApplications) =>
          currentApplications.map(
            (application) =>
              application._id === applicationId
                ? {
                    ...application,
                    forwardedToCollege: true,
                    forwardedAt:
                      data.application
                        ?.forwardedAt ||
                      new Date().toISOString(),
                  }
                : application
          )
      );
    } catch (error) {
      console.error(
        "Forward to college error:",
        error
      );

      setError(error.message);
    } finally {
      setForwardingApplicationId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="my-applications-page">
        <div className="applications-content">
          <div className="applications-loading">
            <div className="loading-spinner"></div>

            <h2>
              Loading Applications
            </h2>

            <p>
              Please wait while we retrieve
              your internship applications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-applications-page">
      <div className="applications-content">

        {/* ERROR */}

        {error && (
          <div className="applications-error">
            <div className="error-icon">
              !
            </div>

            <div>
              <h3>
                Unable to load applications
              </h3>

              <p>{error}</p>
            </div>
          </div>
        )}

        {/* NO APPLICATIONS */}

        {!error &&
          applications.length === 0 && (
            <div className="empty-applications">
              <div className="empty-icon">
                📄
              </div>

              <h2>
                No Applications Yet
              </h2>

              <p>
                You have not applied for any
                internship yet. Once you apply
                for an internship, your
                application will appear here.
              </p>

              <div className="empty-decoration">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

        {/* APPLICATIONS */}

        {!error &&
          applications.length > 0 && (
            <div className="applications-list">

              {applications.map(
                (application) => (
                  <div
                    className="application-card"
                    key={application._id}
                  >

                    {/* APPLICATION HEADER */}

                    <div className="application-card-top">

                      <div className="company-icon">
                        🏢
                      </div>

                      <div className="company-info">

                        <span className="company-label">
                          COMPANY
                        </span>

                        <h2>
                          {application
                            .company
                            ?.companyName ||
                            "Company"}
                        </h2>

                      </div>

                      <div
                        className={`status-badge ${
                          application.status
                            ?.toLowerCase() ||
                          "pending"
                        }`}
                      >
                        <span className="status-dot"></span>

                        {application.status ||
                          "Pending"}
                      </div>

                    </div>

                    {/* APPLICATION DETAILS */}

                    <div className="application-details">

                      <div className="detail-item">

                        <div className="detail-icon">
                          💼
                        </div>

                        <div className="detail-content">

                          <span className="detail-label">
                            Position
                          </span>

                          <strong>
                            {application.position}
                          </strong>

                        </div>

                      </div>

                      <div className="detail-item">

                        <div className="detail-icon">
                          📅
                        </div>

                        <div className="detail-content">

                          <span className="detail-label">
                            Applied On
                          </span>

                          <strong>
                            {application.createdAt
                              ? new Date(
                                  application.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </strong>

                        </div>

                      </div>

                    </div>

                    {/* =====================================
                        COMPANY CONFIRMATION LETTER
                    ====================================== */}

                    {application.status ===
                      "CompanyApproved" &&
                      application.confirmationLetter
                        ?.message && (
                        <div className="confirmation-letter">

                          <div className="confirmation-letter-header">

                            <div className="confirmation-letter-icon">
                              📩
                            </div>

                            <div>
                              <h3>
                                Confirmation Letter
                              </h3>

                              <p>
                                Reply from the company
                              </p>
                            </div>

                          </div>

                          <div className="confirmation-letter-paper">

                            <div className="letter-subject">

                              <strong>
                                Subject:
                              </strong>{" "}

                              {application
                                .confirmationLetter
                                .subject ||
                                "Internship Application Confirmation"}

                            </div>

                            <div className="letter-message">

                              {application
                                .confirmationLetter
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

                            {application
                              .confirmationLetter
                              .sentAt && (
                              <div className="letter-date">

                                Sent on:{" "}

                                {new Date(
                                  application
                                    .confirmationLetter
                                    .sentAt
                                ).toLocaleString()}

                              </div>
                            )}

                          </div>

                          {/* =================================
                              FORWARD TO COLLEGE
                          ================================== */}

                          {!application.forwardedToCollege ? (
                            <>
                              <div className="forward-letter-info">

                                <span>
                                  📨
                                </span>

                                <p>
                                  Forward this
                                  confirmation
                                  letter to your
                                  college for
                                  verification and
                                  approval.
                                </p>

                              </div>

                              <button
                                type="button"
                                className="forward-college-button"
                                onClick={() =>
                                  forwardToCollege(
                                    application._id
                                  )
                                }
                                disabled={
                                  forwardingApplicationId ===
                                  application._id
                                }
                              >
                                {forwardingApplicationId ===
                                application._id
                                  ? "Forwarding..."
                                  : "📨 Forward to College"}
                              </button>
                            </>
                          ) : (
                            <div className="forwarded-to-college-badge">

                              <span>
                                ✓
                              </span>

                              <div>
                                <strong>
                                  Forwarded to College
                                </strong>

                                {application.forwardedAt && (
                                  <small>
                                    Forwarded on{" "}
                                    {new Date(
                                      application.forwardedAt
                                    ).toLocaleString()}
                                  </small>
                                )}
                              </div>

                            </div>
                          )}

                        </div>
                      )}

                    {/* =====================================
                        FACULTY GUIDE
                    ====================================== */}

                    {application.faculty && (
                      <div className="faculty-section">

                        <div className="faculty-header">

                          <div className="faculty-title-icon">
                            👨‍🏫
                          </div>

                          <div>

                            <h3>
                              Faculty Guide
                            </h3>

                            <p>
                              Your assigned academic
                              guide
                            </p>

                          </div>

                        </div>

                        <div className="faculty-content">

                          <div className="faculty-main">

                            <div className="faculty-avatar">
                              {application.faculty.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "F"}
                            </div>

                            <div>

                              <h4>
                                {application
                                  .faculty
                                  .name}
                              </h4>

                              <span>
                                {application
                                  .faculty
                                  .designation ||
                                  "Faculty Guide"}
                              </span>

                            </div>

                          </div>

                          <div className="faculty-details">

                            <div className="faculty-detail">

                              <span>
                                🎓
                              </span>

                              <div>

                                <small>
                                  Department
                                </small>

                                <strong>
                                  {application
                                    .faculty
                                    .department}
                                </strong>

                              </div>

                            </div>

                            <div className="faculty-detail">

                              <span>
                                ✉️
                              </span>

                              <div>

                                <small>
                                  Email
                                </small>

                                <strong>
                                  {application
                                    .faculty
                                    .email}
                                </strong>

                              </div>

                            </div>

                            <div className="faculty-detail">

                              <span>
                                📞
                              </span>

                              <div>

                                <small>
                                  Phone
                                </small>

                                <strong>
                                  {application
                                    .faculty
                                    .phone ||
                                    "N/A"}
                                </strong>

                              </div>

                            </div>

                            <div className="faculty-detail">

                              <span>
                                💼
                              </span>

                              <div>

                                <small>
                                  Designation
                                </small>

                                <strong>
                                  {application
                                    .faculty
                                    .designation ||
                                    "N/A"}
                                </strong>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>
                    )}

                  </div>
                )
              )}

            </div>
          )}

      </div>
    </div>
  );
}

export default MyApplications;