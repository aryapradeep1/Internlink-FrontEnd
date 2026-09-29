import { useEffect, useState } from "react";
import "../css/Companies.css";

function Companies({ onBack, onViewDetails }) {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/internships"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch internships"
          );
        }

        console.log("AVAILABLE INTERNSHIPS:", data);

        setInternships(data.internships || []);
      } catch (error) {
        console.error("Fetch Internships Error:", error);
        setError("Unable to load internships");
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  return (
    <div className="companies-page">

      {/* =====================================================
          FIXED BACK TO DASHBOARD BUTTON
          ===================================================== */}
    


      <div className="companies-container">



        {/* =====================================================
            LOADING
            ===================================================== */}
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


        {/* =====================================================
            ERROR
            ===================================================== */}
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


        {/* =====================================================
            EMPTY STATE
            ===================================================== */}
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


        {/* =====================================================
            INTERNSHIP CARDS
            ===================================================== */}
        {!loading &&
          !error &&
          internships.length > 0 && (
            <div className="internships-grid">

              {internships.map((internship) => (
                <div
                  className="internship-card"
                  key={internship._id}
                >

                  <div className="internship-card-accent"></div>


                  {/* COMPANY */}
                  <div className="internship-company">

                    <div className="company-logo">
                      🏢
                    </div>

                    <div className="company-info">

                      <span className="company-label">
                        COMPANY
                      </span>

                      <h3>
                        {internship.company?.companyName ||
                          "Company"}
                      </h3>

                    </div>

                  </div>


                  {/* INTERNSHIP TITLE */}
                  <div className="internship-main">

                    <h2>
                      {internship.title}
                    </h2>

                    <p>
                      Internship Opportunity
                    </p>

                  </div>


                  {/* LOCATION + DURATION */}
                  <div className="internship-details">

                    <div className="internship-detail">

                      <div className="detail-icon mint">
                        📍
                      </div>

                      <div>

                        <span>
                          Location
                        </span>

                        <strong>
                          {internship.location}
                        </strong>

                      </div>

                    </div>


                    <div className="internship-detail">

                      <div className="detail-icon peach">
                        ⏱️
                      </div>

                      <div>

                        <span>
                          Duration
                        </span>

                        <strong>
                          {internship.duration}
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* ELIGIBILITY */}
                  <div className="eligibility-section">

                    <div className="eligibility-heading">

                      <span>
                        🎓
                      </span>

                      <strong>
                        Eligibility
                      </strong>

                    </div>

                    <p>
                      {internship.eligibility}
                    </p>

                  </div>


                  {/* SKILLS */}
                  <div className="skills-section">

                    <div className="skills-heading">

                      <span>
                        ✨
                      </span>

                      <strong>
                        Skills
                      </strong>

                    </div>

                    <p>
                      {internship.skillsRequired ||
                        "Not specified"}
                    </p>

                  </div>


                  {/* DEADLINE */}
                  <div className="deadline-section">

                    <div className="deadline-icon">
                      📅
                    </div>

                    <div>

                      <span>
                        Application Deadline
                      </span>

                      <strong>
                        {new Date(
                          internship.deadline
                        ).toLocaleDateString()}
                      </strong>

                    </div>

                  </div>


                  {/* VIEW DETAILS */}
                  <button
                    className="view-details-btn"
                    onClick={() => {
                      if (onViewDetails) {
                        onViewDetails(
                          internship.company,
                          internship
                        );
                      }
                    }}
                  >

                    <span>
                      View Details
                    </span>

                    <span className="view-details-arrow">
                      →
                    </span>

                  </button>

                </div>
              ))}

            </div>
          )}

      </div>
    </div>
  );
}

export default Companies;