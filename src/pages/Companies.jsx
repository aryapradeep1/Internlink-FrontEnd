import { useEffect, useState } from "react";

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
    <div className="companies-container">
      <h1>Available Internships</h1>

      <p>
        Explore internship opportunities available for your department.
      </p>

      {loading && <p>Loading internships...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!loading && !error && internships.length === 0 && (
        <p>No internship opportunities available.</p>
      )}

      {!loading &&
        !error &&
        internships.map((internship) => (
          <div
            className="company-card"
            key={internship._id}
          >
            <h2>
              {internship.company?.companyName ||
                "Company"}
            </h2>

            <p>
              <strong>Position:</strong>{" "}
              {internship.title}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {internship.location}
            </p>

            <p>
              <strong>Eligibility:</strong>{" "}
              {internship.eligibility}
            </p>

            <p>
              <strong>Skills:</strong>{" "}
              {internship.skillsRequired}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {internship.duration}
            </p>

            <p>
              <strong>Application Deadline:</strong>{" "}
              {new Date(
                internship.deadline
              ).toLocaleDateString()}
            </p>

            <button
              onClick={() => {
                if (onViewDetails) {
                  onViewDetails(
                    internship.company,
                    internship
                  );
                }
              }}
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

export default Companies;