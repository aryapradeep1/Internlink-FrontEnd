import { useEffect, useState } from "react";
import "../css/Internships.css";

function Internships({
  onBack,
  onViewDetails,
}) {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      "http://localhost:5000/api/internships"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch internships"
          );
        }

        return response.json();
      })
      .then((data) => {
        console.log(
          "Available internships:",
          data.internships
        );

        setInternships(
          data.internships || []
        );

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);

        setError(
          "Unable to load internships"
        );

        setLoading(false);
      });
  }, []);

  return (
    <div className="internships-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="internships-header">

        <p className="internships-eyebrow">
          INTERNSHIP OPPORTUNITIES
        </p>

        <h1>
          Available Internships
        </h1>

        <p className="internships-subtitle">
          Explore internship opportunities posted
          by approved companies.
        </p>

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="internships-status">

          <div className="internships-loader"></div>

          <p>
            Loading internships...
          </p>

        </div>
      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

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


      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        !error &&
        internships.length === 0 && (
          <div className="internships-status empty-status">

            <div className="status-icon">
              ◇
            </div>

            <h2>
              No internships available
            </h2>

            <p>
              There are currently no internship
              opportunities available.
            </p>

          </div>
        )}


      {/* =====================================================
          INTERNSHIP LIST
      ===================================================== */}

      {!loading &&
        !error &&
        internships.length > 0 && (

          <div className="internships-list">

            {internships.map((internship) => (

              <div
                className="internship-item"
                key={internship._id}
              >

                <div className="internship-content">

                  {/* TITLE */}

                  <div className="internship-main">

                    <div className="internship-title-row">

                      <div className="internship-icon">
                        ◇
                      </div>

                      <div className="internship-title-content">

                        <h2>
                          {internship.title}
                        </h2>

                        <p className="internship-company">
                          {internship.company?.companyName}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="internship-details-grid">

                    <div className="internship-detail">

                      <span className="detail-label">
                        COMPANY
                      </span>

                      <span className="detail-value">
                        {internship.company?.companyName ||
                          "Not specified"}
                      </span>

                    </div>


                    <div className="internship-detail">

                      <span className="detail-label">
                        LOCATION
                      </span>

                      <span className="detail-value">
                        {internship.location ||
                          "Not specified"}
                      </span>

                    </div>


                    <div className="internship-detail">

                      <span className="detail-label">
                        DURATION
                      </span>

                      <span className="detail-value">
                        {internship.duration ||
                          "Not specified"}
                      </span>

                    </div>


                    <div className="internship-detail">

                      <span className="detail-label">
                        ELIGIBILITY
                      </span>

                      <span className="detail-value">
                        {internship.eligibility ||
                          "Not specified"}
                      </span>

                    </div>

                  </div>


                  {/* ACTION */}

                  <div className="internship-action">

                    <button
                      className="apply-internship-btn"
                      onClick={() =>
                        onViewDetails(
                          internship.company,
                          internship
                        )
                      }
                    >
                      View Details
                      <span>
                        →
                      </span>
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="internships-footer">

        <button
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