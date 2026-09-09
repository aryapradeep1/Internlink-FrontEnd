import { useEffect, useState } from "react";

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
    <div className="companies-container">

      <h1>
        Available Internship Opportunities
      </h1>

      <p>
        Explore internship opportunities posted
        by approved companies.
      </p>

      {loading && (
        <p>Loading internships...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!loading &&
        !error &&
        internships.length === 0 && (
          <p>
            No internship opportunities available.
          </p>
        )}

      {!loading &&
        !error &&
        internships.map((internship) => (
          <div
            className="company-card"
            key={internship._id}
          >

            <h2>
              {internship.title}
            </h2>

            <p>
              <strong>Company:</strong>{" "}
              {internship.company?.companyName}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {internship.location}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {internship.duration}
            </p>

            <p>
              <strong>Eligibility:</strong>{" "}
              {internship.eligibility}
            </p>

            <button
              onClick={() =>
                onViewDetails(
                  internship.company,
                  internship
                )
              }
            >
              View Details
            </button>

          </div>
        ))}

      <button onClick={onBack}>
        ← Back to Dashboard
      </button>

    </div>
  );
}

export default Internships;