import { useState } from "react";
import "../css/PostInternship.css";

function PostInternship({ company, onBack, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [duration, setDuration] = useState("");
  const [deadline, setDeadline] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/internships",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company: company.id,
            title,
            description,
            location,
            eligibility,
            skillsRequired,
            duration,
            deadline,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Internship posted successfully!");

        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        setError(data.message || "Failed to post internship");
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="post-internship-page">

      {/* PAGE HEADER */}
      <section className="post-internship-header">
        <div>
          <span className="post-internship-eyebrow">
            INTERNSHIP MANAGEMENT
          </span>

          <h1>Post Internship</h1>

          <p>
            Create a new internship opportunity for eligible
            students through InternLink.
          </p>
        </div>

        <div className="post-internship-header-mark">
          +
        </div>
      </section>

      {/* COMPANY INFO */}
      <section className="post-internship-company-card">
        <div className="post-internship-company-icon">
          {company?.companyName?.charAt(0)?.toUpperCase() || "C"}
        </div>

        <div>
          <span>POSTING AS</span>
          <strong>{company?.companyName || "Company"}</strong>
          <p>
            This internship will be published under your company account.
          </p>
        </div>

        <div className="post-internship-company-status">
          <span></span>
          Company Account
        </div>
      </section>

      {/* FORM */}
      <form
        className="post-internship-form"
        onSubmit={handleSubmit}
      >

        {/* BASIC INFORMATION */}
        <section className="post-internship-form-card">

          <div className="post-internship-section-heading">
            <div className="post-internship-section-number">
              01
            </div>

            <div>
              <span>OPPORTUNITY DETAILS</span>
              <h2>Internship Information</h2>
              <p>
                Provide the basic details students need to understand
                the internship opportunity.
              </p>
            </div>
          </div>

          <div className="post-internship-fields">

            <div className="post-internship-field post-internship-field-full">
              <label>
                Internship Position
                <span>*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. Software Development Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="post-internship-field">
              <label>
                Location
                <span>*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. Kochi, Kerala"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="post-internship-field">
              <label>
                Duration
                <span>*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. 2 Months"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <div className="post-internship-field post-internship-field-full">
              <label>
                Internship Description
                <span>*</span>
              </label>

              <textarea
                placeholder="Describe the internship role, responsibilities, learning opportunities and expectations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="5"
              />
            </div>

          </div>
        </section>

        {/* ELIGIBILITY */}
        <section className="post-internship-form-card">

          <div className="post-internship-section-heading">
            <div className="post-internship-section-number">
              02
            </div>

            <div>
              <span>STUDENT REQUIREMENTS</span>
              <h2>Eligibility & Skills</h2>
              <p>
                Define the academic eligibility and skills expected
                from applicants.
              </p>
            </div>
          </div>

          <div className="post-internship-fields">

            <div className="post-internship-field post-internship-field-full">
              <label>
                Eligibility
                <span>*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. MCA / BCA students with programming knowledge"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                required
              />
            </div>

            <div className="post-internship-field post-internship-field-full">
              <label>
                Skills Required
                <span>*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. React, Node.js, MongoDB"
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
                required
              />

              <small>
                Separate multiple skills using commas.
              </small>
            </div>

          </div>
        </section>

        {/* DEADLINE */}
        <section className="post-internship-form-card">

          <div className="post-internship-section-heading">
            <div className="post-internship-section-number">
              03
            </div>

            <div>
              <span>APPLICATION WINDOW</span>
              <h2>Application Deadline</h2>
              <p>
                Set the final date on which students can apply.
              </p>
            </div>
          </div>

          <div className="post-internship-deadline-area">

            <div className="post-internship-field">
              <label>
                Application Deadline
                <span>*</span>
              </label>

              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div className="post-internship-deadline-note">
              <div className="post-internship-note-icon">
                !
              </div>

              <div>
                <strong>Before publishing</strong>
                <p>
                  Make sure the position, eligibility, skills and
                  deadline are accurate before posting the opportunity.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* STATUS MESSAGE */}
        {message && (
          <div className="post-internship-message post-internship-success">
            <div>✓</div>

            <div>
              <strong>Profile updated</strong>
              <span>{message}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="post-internship-message post-internship-error">
            <div>!</div>

            <div>
              <strong>Unable to post internship</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* ACTION BAR */}
        <div className="post-internship-actions">

          <button
            type="button"
            className="post-internship-cancel-button"
            onClick={onBack}
          >
            ← Back
          </button>

          <div className="post-internship-action-info">
            <span>Ready to publish?</span>
            <small>
              The opportunity will be available to eligible students.
            </small>
          </div>

          <button
            type="submit"
            className="post-internship-submit-button"
          >
            <span>Post Internship</span>
            <strong>→</strong>
          </button>

        </div>

      </form>
    </div>
  );
}

export default PostInternship;