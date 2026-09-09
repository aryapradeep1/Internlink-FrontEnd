import { useEffect, useState } from "react";

function Companies({ onBack, onViewDetails }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/companies")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }
        return response.json();
      })
      .then((data) => {
        setCompanies(data.companies || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load companies");
        setLoading(false);
      });
  }, []);

  return (
    <div className="companies-container">
      <h1>Available Internships</h1>

      <p>
        Explore internship opportunities available for your department.
      </p>

      {loading && <p>Loading internships...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && companies.length === 0 && (
        <p>No internship companies available.</p>
      )}

      {companies.map((company) =>
        company.internships && company.internships.length > 0 ? (
          company.internships.map((internship) => (
            <div
              className="company-card"
              key={internship._id}
            >
              <h2>{company.companyName}</h2>

              <p>
                <strong>Position:</strong> {internship.position}
              </p>

              <p>
                <strong>Location:</strong> {company.location}
              </p>

              <p>
                <strong>Eligibility:</strong> {internship.eligibility}
              </p>

              <p>
                <strong>Skills:</strong> {internship.skillsRequired}
              </p>

              <p>
                <strong>Duration:</strong> {internship.duration}
              </p>

              <p>
                <strong>Application Deadline:</strong>{" "}
                {new Date(internship.deadline).toLocaleDateString()}
              </p>

              <button
                onClick={() =>
                  onViewDetails(company, internship)
                }
              >
                View Details
              </button>
            </div>
          ))
        ) : null
      )}

      <button onClick={onBack}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default Companies;