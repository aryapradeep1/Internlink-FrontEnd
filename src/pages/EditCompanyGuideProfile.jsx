import React, { useState } from "react";
import "../css/EditCompanyGuideProfile.css";

function EditCompanyGuideProfile({
  guide,
  onBack,
  onProfileUpdated,
}) {
  const [name, setName] = useState(
    guide?.name || ""
  );

  const [email, setEmail] = useState(
    guide?.email || ""
  );

  const [employeeId, setEmployeeId] = useState(
    guide?.employeeId || ""
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name || !email || !employeeId) {
      setError("Please fill all required fields");
      return;
    }

    const guideId = guide?.id || guide?._id;

    if (!guideId) {
      setError("Company Guide information not found");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/company-guides/profile/${guideId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            employeeId,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(data.message);

        if (onProfileUpdated) {
          onProfileUpdated(data.guide);
        }
      } else {
        setError(
          data.message ||
            "Failed to update profile"
        );
      }
    } catch (error) {
      console.error(
        "Update Company Guide Profile Error:",
        error
      );

      setError(
        "Unable to update Company Guide profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cgp-edit-page">

      {/* PAGE HEADER */}
      <div className="cgp-edit-header">
        <div>
          <span className="cgp-edit-eyebrow">
            ACCOUNT SETTINGS
          </span>

          <h1>
            Edit Company Guide Profile
          </h1>

          <p>
            Update your personal and employee information.
          </p>
        </div>

        <div className="cgp-edit-icon">
          ✏️
        </div>
      </div>

      {/* FORM CARD */}
      <div className="cgp-edit-card">

        <div className="cgp-card-title">
          <div className="cgp-card-icon">
            👤
          </div>

          <div>
            <h2>Profile Information</h2>
            <p>
              Update the information associated with your
              Company Guide account.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="cgp-form-grid">

            {/* NAME */}
            <div className="cgp-form-group">
              <label htmlFor="guide-name">
                Full Name
              </label>

              <input
                id="guide-name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="cgp-form-group">
              <label htmlFor="guide-email">
                Email Address
              </label>

              <input
                id="guide-email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
              />
            </div>

            {/* EMPLOYEE ID */}
            <div className="cgp-form-group">
              <label htmlFor="guide-employee-id">
                Employee ID
              </label>

              <input
                id="guide-employee-id"
                type="text"
                value={employeeId}
                onChange={(e) =>
                  setEmployeeId(e.target.value)
                }
                placeholder="Enter employee ID"
                required
              />
            </div>

            {/* COMPANY */}
            <div className="cgp-form-group">
              <label htmlFor="guide-company">
                Company
              </label>

              <input
                id="guide-company"
                type="text"
                value={
                  guide?.company?.companyName ||
                  guide?.companyName ||
                  "Not available"
                }
                disabled
              />

              <span className="cgp-field-note">
                Company information cannot be edited here.
              </span>
            </div>

            {/* STATUS */}
            <div className="cgp-form-group">
              <label>
                Account Status
              </label>

              <div className="cgp-status-box">
                <span className="cgp-status-dot"></span>

                <span>
                  {guide?.status || "Approved"}
                </span>
              </div>
            </div>

          </div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="cgp-message success">
              <span>✓</span>
              <p>{message}</p>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="cgp-message error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="cgp-form-actions">

            <button
              type="button"
              className="cgp-back-button"
              onClick={onBack}
            >
              <span>←</span>
              Back to Profile
            </button>

            <button
              type="submit"
              className="cgp-save-button"
              disabled={loading}
            >
              <span>
                {loading ? "⏳" : "✓"}
              </span>

              {loading
                ? "Updating..."
                : "Save Changes"}
            </button>

          </div>

        </form>
      </div>

      {/* INFORMATION NOTE */}
      <div className="cgp-edit-note">
        <span>💡</span>

        <div>
          <strong>Profile information</strong>

          <p>
            Keep your name, email address and employee ID
            up to date so students and the institution can
            identify you correctly.
          </p>
        </div>
      </div>

    </div>
  );
}

export default EditCompanyGuideProfile;