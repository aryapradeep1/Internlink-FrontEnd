import { useState } from "react";
import "../css/ApplicationForm.css";

function ApplicationForm({
  student,
  company,
  internship,
  onBack,
  onSuccess,
}) {
  const [resume, setResume] = useState(null);
  const [markList, setMarkList] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check documents
    if (!resume) {
      setError("Please upload your CV / Resume.");
      return;
    }

    if (!markList) {
      setError(
        "Please upload your mark list up to the current semester."
      );
      return;
    }

    // Allow PDF only
    if (resume.type !== "application/pdf") {
      setError("CV / Resume must be a PDF file.");
      return;
    }

    if (markList.type !== "application/pdf") {
      setError("Mark List must be a PDF file.");
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
      // Create FormData
      const formData = new FormData();

      formData.append("student", studentId);
      formData.append("company", companyId);
      formData.append("internship", internshipId);
      formData.append("position", internship.title);

      // Add files
      formData.append("resume", resume);
      formData.append("markList", markList);

      const response = await fetch(
        "http://localhost:5000/api/applications/apply",
        {
          method: "POST",
          body: formData,
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

        <section className="application-internship-overview">
          <p className="application-eyebrow">INTERNSHIP APPLICATION</p>
          <h1>Apply for Internship</h1>

          <p className="application-intro">
            Review the opportunity and attach the documents required for your application.
          </p>

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
        </section>

        <section className="application-form-panel">
          <div className="application-form-heading">
            <h2>Application documents</h2>
            <p>Submit your current CV and academic mark list as PDF files.</p>
          </div>

          <form onSubmit={handleSubmit}>

          {/* CV / Resume */}

          <div className="form-group">

            <label>
              CV / Resume <strong>*</strong>
            </label>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) =>
                setResume(e.target.files[0])
              }
            />

            <small>
              Upload your CV / Resume in PDF format.
            </small>

          </div>

          {/* Mark List */}

          <div className="form-group">

            <label>
              Mark List up to Current Semester{" "}
              <strong>*</strong>
            </label>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) =>
                setMarkList(e.target.files[0])
              }
            />

            <small>
              Upload one merged PDF containing your
              mark lists up to the current semester.
            </small>

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
        </section>

      </div>
    </div>
  );
}

export default ApplicationForm;
