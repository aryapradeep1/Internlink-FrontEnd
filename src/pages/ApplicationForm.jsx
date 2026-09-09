import { useState } from "react";

function ApplicationForm({
  student,
  company,
  internship,
  onBack,
  onSuccess,
}) {
  const [whyApply, setWhyApply] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!whyApply.trim()) {
      setError("Please explain why you want to apply.");
      return;
    }

    const studentId = student?.id || student?._id;
    const companyId = company?.id || company?._id;
    const internshipId =
      internship?.id || internship?._id;

    // Check IDs
    if (!studentId) {
      setError("Student information not found.");
      return;
    }

    if (!companyId) {
      setError("Company information not found.");
      return;
    }

    if (!internshipId) {
      setError("Internship information not found.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/applications/apply",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            student: studentId,
            company: companyId,
            internship: internshipId,
            position: internship.title,
            whyApply: whyApply,
            resume: resume,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit application"
        );
      }

      console.log(
        "Application submitted:",
        data.application
      );

      alert(
        "Internship application submitted successfully!"
      );

      onSuccess();
    } catch (error) {
      console.error(
        "Application submission error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-form-container">
      <div className="application-form-card">

        <h1>Apply for Internship</h1>

        <h2>
          {company?.companyName}
        </h2>

        <div className="internship-summary">

          <p>
            <strong>Position:</strong>{" "}
            {internship?.title}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {internship?.location}
          </p>

          <p>
            <strong>Duration:</strong>{" "}
            {internship?.duration}
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Why do you want to apply?
            </label>

            <textarea
              value={whyApply}
              onChange={(e) =>
                setWhyApply(e.target.value)
              }
              placeholder="Explain why you are interested in this internship..."
              rows="6"
            />

          </div>

          <div className="form-group">

            <label>Resume</label>

            <input
              type="text"
              value={resume}
              onChange={(e) =>
                setResume(e.target.value)
              }
              placeholder="Enter resume link (optional)"
            />

          </div>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <div className="application-buttons">

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Application"}
            </button>

            <button
              type="button"
              onClick={onBack}
            >
              ← Back
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default ApplicationForm;