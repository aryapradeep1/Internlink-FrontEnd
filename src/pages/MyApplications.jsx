import { useEffect, useState } from "react";

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
      <div className="my-applications-container">
        <h1>My Applications</h1>
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="my-applications-container">
      <h1>My Applications</h1>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!error && applications.length === 0 && (
        <div className="no-applications">
          <h2>No Applications Yet</h2>
          <p>
            You have not applied for any internship yet.
          </p>
        </div>
      )}

      <div className="applications-list">
        {applications.map((application) => (
          <div
            className="application-card"
            key={application._id}
          >
            <h2>
              {application.company?.companyName ||
                "Company"}
            </h2>

            <p>
              <strong>Position:</strong>{" "}
              {application.position}
            </p>

            <p>
              <strong>Applied On:</strong>{" "}
              {new Date(
                application.createdAt
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status ${application.status?.toLowerCase()}`}
              >
                {application.status || "Pending"}
              </span>
            </p>
            {application.faculty && (
  <>
    <hr />

    <h3>Faculty Guide</h3>

    <p>
      <strong>Name:</strong>{" "}
      {application.faculty.name}
    </p>

    <p>
      <strong>Department:</strong>{" "}
      {application.faculty.department}
    </p>

    <p>
      <strong>Email:</strong>{" "}
      {application.faculty.email}
    </p>

    <p>
      <strong>Phone:</strong>{" "}
      {application.faculty.phone || "N/A"}
    </p>

    <p>
      <strong>Designation:</strong>{" "}
      {application.faculty.designation || "N/A"}
    </p>
  </>
)}
          </div>
        ))}
      </div>

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default MyApplications;