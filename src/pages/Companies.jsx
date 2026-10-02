
import { useEffect, useState } from "react";
import "../css/Companies.css";

function Companies({ onBack, onViewDetails }) {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedInternship, setExpandedInternship] = useState(null);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/internships"
        );

        const data = await response.json();

        console.log("AVAILABLE INTERNSHIPS:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch internships"
          );
        }

        if (Array.isArray(data)) {
          setInternships(data);
        } else if (Array.isArray(data.internships)) {
          setInternships(data.internships);
        } else {
          setInternships([]);
        }
      } catch (error) {
        console.error("Fetch Internships Error:", error);
        setError("Unable to load internships");
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const handleExpand = (internshipId) => {
    setExpandedInternship((current) =>
      current === internshipId ? null : internshipId
    );
  };

  const handleApply = (internship) => {
    if (onViewDetails) {
      onViewDetails(
        internship.company,
        internship
      );
    }
  };

  return (
    <div className="companies-page">
      <div className="companies-container">

        {/* PAGE INTRO */}
        <div className="companies-header">
          <div className="companies-header-icon">
            ◇
          </div>

          <div>
            <span className="companies-eyebrow">
              INTERNSHIP OPPORTUNITIES
            </span>

            <h2>
              Explore Internships
            </h2>

            <p>
              Choose an opportunity that matches
              your interests and career goals.
            </p>
          </div>
        </div>


        {/* LOADING */}
        {loading && (
          <div className="internships-loading">
            <div className="internship-spinner"></div>

            <h2>
              Finding opportunities
            </h2>

            <p>
              Please wait while we load the latest
              internships.
            </p>
          </div>
        )}


        {/* ERROR */}
        {error && (
          <div className="internships-error">
            <div className="error-icon">
              !
            </div>

            <div>
              <h3>
                Unable to load internships
              </h3>

              <p>
                {error}
              </p>
            </div>
          </div>
        )}


        {/* EMPTY STATE */}
        {!loading &&
          !error &&
          internships.length === 0 && (
            <div className="no-internships">
              <div className="no-internships-icon">
                💼
              </div>

              <h2>
                No Internship Opportunities
              </h2>

              <p>
                There are currently no internship
                opportunities available. Please check
                again later for new postings.
              </p>

              <div className="empty-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}


        {/* INTERNSHIP LIST */}
        {!loading &&
          !error &&
          internships.length > 0 && (
            <div className="internships-list">

              {internships.map((internship) => {
                const isExpanded =
                  expandedInternship === internship._id;

                return (
                  <div
                    key={internship._id}
                    className={`internship-item ${
                      isExpanded ? "expanded" : ""
                    }`}
                  >

                    {/* SUMMARY ROW */}
                    <button
                      type="button"
                      className="internship-summary"
                      onClick={() =>
                        handleExpand(internship._id)
                      }
                    >

                      <div className="internship-summary-left">

                        <div className="internship-summary-icon">
                          ◇
                        </div>

                        <div className="internship-summary-text">

                          <h2>
                            {internship.title}
                          </h2>

                          <div className="internship-company-name">

                            <span className="company-small-icon">
                              🏢
                            </span>

                            <span>
                              {internship.company?.companyName ||
                                "Company"}
                            </span>

                          </div>

                        </div>

                      </div>


                      <div className="internship-expand-icon">
                        {isExpanded ? "−" : "+"}
                      </div>

                    </button>


                    {/* EXPANDED DETAILS */}
                    {isExpanded && (
                      <div className="internship-expanded">

                        <div className="expanded-divider"></div>


                        {/* LOCATION + DURATION */}
                        <div className="expanded-detail-grid">

                          <div className="expanded-detail-card mint">

                            <div className="expanded-detail-icon">
                              📍
                            </div>

                            <div>
                              <span>
                                Location
                              </span>

                              <strong>
                                {internship.location ||
                                  "Not specified"}
                              </strong>
                            </div>

                          </div>


                          <div className="expanded-detail-card peach">

                            <div className="expanded-detail-icon">
                              ⏱️
                            </div>

                            <div>
                              <span>
                                Duration
                              </span>

                              <strong>
                                {internship.duration ||
                                  "Not specified"}
                              </strong>
                            </div>

                          </div>

                        </div>


                        {/* ELIGIBILITY */}
                        <div className="expanded-info-card eligibility">

                          <div className="expanded-info-title">

                            <span>
                              🎓
                            </span>

                            <strong>
                              Eligibility
                            </strong>

                          </div>

                          <p>
                            {internship.eligibility ||
                              "No specific eligibility criteria provided."}
                          </p>

                        </div>


                        {/* SKILLS */}
                        <div className="expanded-info-card skills">

                          <div className="expanded-info-title">

                            <span>
                              ✨
                            </span>

                            <strong>
                              Skills Required
                            </strong>

                          </div>

                          <p>
                            {internship.skillsRequired &&
                            internship.skillsRequired !== "None"
                              ? internship.skillsRequired
                              : "No specific skills required"}
                          </p>

                        </div>


                        {/* DEADLINE */}
                        <div className="expanded-deadline">

                          <div className="deadline-left">

                            <div className="deadline-icon">
                              📅
                            </div>

                            <div>

                              <span>
                                Application Deadline
                              </span>

                              <strong>
                                {internship.deadline
                                  ? new Date(
                                      internship.deadline
                                    ).toLocaleDateString()
                                  : "Not specified"}
                              </strong>

                            </div>

                          </div>

                        </div>


                        {/* APPLY */}
                        <div className="expanded-actions">

                          <button
                            type="button"
                            className="apply-internship-btn"
                            onClick={() =>
                              handleApply(internship)
                            }
                          >

                            <span>
                              Apply Internship
                            </span>

                            <span className="apply-arrow">
                              →
                            </span>

                          </button>

                        </div>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

      </div>
    </div>
  );
}

export default Companies;
