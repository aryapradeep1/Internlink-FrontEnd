import { useEffect, useState } from "react";
import "../css/MyApplications.css";

function MyApplications({ student, onBack }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/applications/student/${student.id || student._id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch applications"
          );
        }

        setApplications(data.applications || []);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [student.id]);

  if (loading) {
    return (
      <div className="my-applications-page">
        <div className="applications-container">
          <div className="applications-loading">
            <div className="loading-spinner"></div>

            <h2>Loading Applications</h2>

            <p>
              Please wait while we retrieve your internship
              applications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-applications-page">
      <div className="applications-container">

        {/* =========================
            PAGE HEADER
        ========================= */}
        <div className="applications-header">

          <div className="applications-title-area">
            <div className="applications-icon">
              📋
            </div>

            <div>
              <p className="applications-eyebrow">
                STUDENT PORTAL
              </p>

              <h1>My Applications</h1>

              <p className="applications-subtitle">
                Track the internships you have applied for
                and view your application status.
              </p>
            </div>
          </div>

          {applications.length > 0 && (
            <div className="application-count">
              <span>{applications.length}</span>
              <small>
                {applications.length === 1
                  ? "Application"
                  : "Applications"}
              </small>
            </div>
          )}

        </div>

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="applications-error">
            <div className="error-icon">!</div>

            <div>
              <h3>Unable to load applications</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* =========================
            EMPTY STATE
        ========================= */}
        {!error && applications.length === 0 && (
          <div className="empty-applications">

            <div className="empty-icon">
              📄
            </div>

            <h2>No Applications Yet</h2>

            <p>
              You have not applied for any internship yet.
              Once you apply for an internship, your
              application will appear here.
            </p>

            <div className="empty-decoration">
              <span></span>
              <span></span>
              <span></span>
            </div>

          </div>
        )}

        {/* =========================
            APPLICATIONS
        ========================= */}
        {!error && applications.length > 0 && (
          <div className="applications-list">

            {applications.map((application) => (
              <div
                className="application-card"
                key={application._id}
              >

                {/* Card top */}
                <div className="application-card-top">

                  <div className="company-icon">
                    🏢
                  </div>

                  <div className="company-info">
                    <p className="company-label">
                      COMPANY
                    </p>

                    <h2>
                      {application.company?.companyName ||
                        "Company"}
                    </h2>
                  </div>

                  <div
                    className={`status-badge ${application.status?.toLowerCase()}`}
                  >
                    <span className="status-dot"></span>

                    {application.status || "Pending"}
                  </div>

                </div>

                {/* Main information */}
                <div className="application-details">

                  <div className="detail-item">
                    <span className="detail-icon">
                      💼
                    </span>

                    <div>
                      <span className="detail-label">
                        Position
                      </span>

                      <strong>
                        {application.position}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">
                      📅
                    </span>

                    <div>
                      <span className="detail-label">
                        Applied On
                      </span>

                      <strong>
                        {new Date(
                          application.createdAt
                        ).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>

                </div>

                {/* Faculty Guide */}
                {application.faculty && (
                  <div className="faculty-section">

                    <div className="faculty-header">
                      <div className="faculty-title-icon">
                        👨‍🏫
                      </div>

                      <div>
                        <h3>Faculty Guide</h3>

                        <p>
                          Your assigned academic guide
                        </p>
                      </div>
                    </div>

                    <div className="faculty-content">

                      <div className="faculty-main">
                        <div className="faculty-avatar">
                          {application.faculty.name
                            ?.charAt(0)
                            ?.toUpperCase() || "F"}
                        </div>

                        <div>
                          <h4>
                            {application.faculty.name}
                          </h4>

                          <span>
                            {application.faculty.designation ||
                              "Faculty Guide"}
                          </span>
                        </div>
                      </div>

                      <div className="faculty-details">

                        <div className="faculty-detail">
                          <span>🎓</span>

                          <div>
                            <small>
                              Department
                            </small>

                            <strong>
                              {application.faculty.department}
                            </strong>
                          </div>
                        </div>

                        <div className="faculty-detail">
                          <span>✉️</span>

                          <div>
                            <small>
                              Email
                            </small>

                            <strong>
                              {application.faculty.email}
                            </strong>
                          </div>
                        </div>

                        <div className="faculty-detail">
                          <span>📞</span>

                          <div>
                            <small>
                              Phone
                            </small>

                            <strong>
                              {application.faculty.phone ||
                                "N/A"}
                            </strong>
                          </div>
                        </div>

                        <div className="faculty-detail">
                          <span>💼</span>

                          <div>
                            <small>
                              Designation
                            </small>

                            <strong>
                              {application.faculty.designation ||
                                "N/A"}
                            </strong>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            ))}

          </div>
        )}

        {/* =========================
            BACK BUTTON
        ========================= */}
        <div className="applications-footer">
          <button
            className="back-button"
            onClick={onBack}
          >
            <span>←</span>
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

export default MyApplications;