import React, { useState } from "react";
import "../css/EditCompanyProfile.css";

function EditCompanyProfile({
  company,
  onBack,
  onProfileUpdated,
}) {
  const [companyName, setCompanyName] = useState(
    company?.companyName || ""
  );

  const [email, setEmail] = useState(
    company?.email || ""
  );

  const [description, setDescription] = useState(
    company?.description || ""
  );

  const [location, setLocation] = useState(
    company?.location || ""
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const companyId = company?.id || company?._id;

      const response = await fetch(
        `http://localhost:5000/api/companies/profile/${companyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName,
            email,
            description,
            location,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(data.message);

        onProfileUpdated(data.company);
      } else {
        setError(data.message);
      }
   } catch (error) {
  console.error("Edit company profile error:", error);
  console.error("Error details:", error.message);
  setError(error.message || "Unable to update company profile");
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-company-page">

      {/* PAGE HEADER */}
      <div className="edit-company-header">
        <div className="edit-company-header-icon">
          ✎
        </div>

        <div>
          <div className="edit-company-eyebrow">
            COMPANY ACCOUNT
          </div>

          <h1>Edit Company Profile</h1>

          <p>
            Update your organization's information
            displayed on InternLink.
          </p>
        </div>
      </div>

      {/* FORM WORKSPACE */}
      <div className="edit-company-workspace">

        {/* LEFT INFORMATION PANEL */}
        <div className="edit-company-info-panel">

          <div className="edit-company-info-badge">
            I
          </div>

          <h2>
            {company?.companyName || "Company"}
          </h2>

          <p>
            Keep your company information accurate so
            students and colleges can view the correct
            organization details.
          </p>

          <div className="edit-company-info-list">

            <div className="edit-company-info-item">
              <span>●</span>
              <div>
                <strong>Company Name</strong>
                <small>
                  Your registered organization name
                </small>
              </div>
            </div>

            <div className="edit-company-info-item">
              <span>@</span>
              <div>
                <strong>Email Address</strong>
                <small>
                  Your company contact email
                </small>
              </div>
            </div>

            <div className="edit-company-info-item">
              <span>⌖</span>
              <div>
                <strong>Location</strong>
                <small>
                  Where your organization is located
                </small>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="edit-company-form-panel">

          <div className="edit-company-form-heading">
            <div>
              <span>ORGANIZATION DETAILS</span>
              <h2>Company Information</h2>
            </div>

            <div className="edit-company-secure-icon">
              ✦
            </div>
          </div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="edit-company-message edit-company-success">
              <span>✓</span>
              <div>
                <strong>Profile updated</strong>
                <p>{message}</p>
              </div>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="edit-company-message edit-company-error">
              <span>!</span>
              <div>
                <strong>Unable to update profile</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* COMPANY NAME */}
            <div className="edit-company-field">
              <label htmlFor="companyName">
                Company Name
              </label>

              <div className="edit-company-input-wrap">
                <span className="edit-company-input-icon">
                  ●
                </span>

                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) =>
                    setCompanyName(e.target.value)
                  }
                  placeholder="Enter company name"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="edit-company-field">
              <label htmlFor="companyEmail">
                Email Address
              </label>

              <div className="edit-company-input-wrap">
                <span className="edit-company-input-icon">
                  @
                </span>

                <input
                  id="companyEmail"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter company email"
                  required
                />
              </div>
            </div>

            {/* LOCATION */}
            <div className="edit-company-field">
              <label htmlFor="companyLocation">
                Location
              </label>

              <div className="edit-company-input-wrap">
                <span className="edit-company-input-icon">
                  ⌖
                </span>

                <input
                  id="companyLocation"
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="Enter company location"
                 
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="edit-company-field">
              <div className="edit-company-label-row">
                <label htmlFor="companyDescription">
                  Company Description
                </label>

                <span>
                  About your organization
                </span>
              </div>

              <textarea
                id="companyDescription"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Tell students about your company..."
                rows="5"
               
              />
            </div>

            {/* ACTIONS */}
            <div className="edit-company-actions">

              <button
                type="button"
                className="edit-company-cancel"
                onClick={onBack}
                disabled={loading}
              >
                <span>←</span>
                Cancel
              </button>

              <button
                type="submit"
                className="edit-company-save"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="edit-company-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    Save Changes
                  </>
                )}
              </button>

            </div>

          </form>
        </div>
      </div>

    </div>
  );
}

export default EditCompanyProfile;