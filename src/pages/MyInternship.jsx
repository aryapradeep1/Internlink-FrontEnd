import { useEffect, useState } from "react";
import "../css/Internships.css";

function Internships({
  onBack,
  onViewDetails,
}) {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedInternship, setExpandedInternship] =
    useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/internships")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch internships");
        }

        return response.json();
      })
      .then((data) => {
        console.log(
          "Available internships:",
          data.internships
        );

        setInternships(data.internships || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);

        setError("Unable to load internships");
        setLoading(false);
      });
  }, []);

  const handleExpand = (internshipId) => {
    setExpandedInternship((current) =>
      current === internshipId ? null : internshipId
    );
  };

  const handleApply = (internship) => {
    onViewDetails(
      internship.company,
      internship
    );
  };

  return (
    <div className="internships-page">

      {/* HEADER */}
      <div className="internships-header">

        <div>
          <p className="internships-eyebrow">
            INTERNSHIPS
          </p>

          <h1>
            Available Internships
          </h1>

          <p className="internships-subtitle">
            Explore internship opportunities posted
            by approved companies.
          </p>
        </div>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="internships-status">
          <div className="internships-loader"></div>

          <p>
            Loading internships...
          </p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="internships-status error-status">

          <div className="status-icon">
            !
          </div>

          <p>
            {error}
          </p>

        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        internships.length === 0 && (
          <div className="internships-status empty-status">

            <div className="status-icon">
              📭
            </div>

            <h2>
              No Internships Available
            </h2>

            <p>
              No internship opportunities are
              currently available.
            </p>

          </div>
        )}

      {/* SCROLLABLE INTERNSHIP LIST */}
      {!loading &&
        !error &&
        internships.length > 0 && (
          <div className="internships-list">

            {internships.map((internship) => {

              const isExpanded =
                expandedInternship ===
                internship._id;

              return (
                <div
                  className={`internship-item ${
                    isExpanded
                      ? "expanded"
                      : ""
                  }`}
                  key={internship._id}
                >

                  {/* COLLAPSED ROW */}
                  <button
                    type="button"
                    className="internship-summary"
                    onClick={() =>
                      handleExpand(
                        internship._id
                      )
                    }
                  >

                    <div className="internship-summary-text">

                      <h2>
                        {internship.title}
                      </h2>

                      <p>
                        <span>
                          Company
                        </span>

                        {internship.company?.companyName ||
                          "Company not available"}
                      </p>

                    </div>

                    <div
                      className={`expand-icon ${
                        isExpanded
                          ? "rotated"
                          : ""
                      }`}
                    >
                      ▼
                    </div>

                  </button>

                  {/* EXPANDED AREA */}
                  {isExpanded && (
                    <div className="internship-expanded">

                      <div className="internship-details-grid">

                        <div className="internship-detail">
                          <span className="detail-label">
                            Location
                          </span>

                          <span className="detail-value">
                            {internship.location ||
                              "Not specified"}
                          </span>
                        </div>

                        <div className="internship-detail">
                          <span className="detail-label">
                            Duration
                          </span>

                          <span className="detail-value">
                            {internship.duration ||
                              "Not specified"}
                          </span>
                        </div>

                        <div className="internship-detail full-detail">
                          <span className="detail-label">
                            Eligibility
                          </span>

                          <span className="detail-value">
                            {internship.eligibility ||
                              "Not specified"}
                          </span>
                        </div>

                      </div>

                      <div className="internship-action">

                        <button
                          type="button"
                          className="apply-internship-btn"
                          onClick={() =>
                            handleApply(
                              internship
                            )
                          }
                        >
                          Apply Internship
                          <span>→</span>
                        </button>

                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      {/* BACK BUTTON */}
      <div className="internships-footer">

        <button
          type="button"
          className="back-dashboard-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default Internships;