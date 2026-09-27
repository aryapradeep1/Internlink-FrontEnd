import React, { useState } from "react";
import "../css/EditCollegeProfile.css";

function EditCollegeProfile({
  college,
  onBack,
  onProfileUpdated,
}) {
  const [collegeName, setCollegeName] = useState(
    college?.collegeName || ""
  );

  const [email, setEmail] = useState(
    college?.email || ""
  );

  const [phone, setPhone] = useState(
    college?.phone || ""
  );

  const [location, setLocation] = useState(
    college?.location || ""
  );

  const [website, setWebsite] = useState(
    college?.website || ""
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
      const collegeId = college?.id || college?._id;

      const response = await fetch(
        `http://localhost:5000/api/colleges/profile/${collegeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collegeName,
            email,
            phone,
            location,
            website,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(data.message);

        onProfileUpdated(data.college);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(
        "Edit college profile error:",
        error
      );

      setError("Unable to update college profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-college-page">

      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="edit-college-header">

        <div className="edit-college-header-icon">
          ✏️
        </div>

        <div>
          <div className="edit-college-eyebrow">
            COLLEGE ACCOUNT
          </div>

          <h1>Edit College Profile</h1>

          <p>
            Update your college information and contact details.
          </p>
        </div>

      </div>

      {/* ========================================
          MAIN WORKSPACE
      ======================================== */}

      <div className="edit-college-workspace">

        {/* ======================================
            LEFT INFORMATION PANEL
        ====================================== */}

        <div className="edit-college-info-panel">

          <div className="edit-college-info-badge">
            🏫
          </div>

          <h2>
            {college?.collegeName || "College"}
          </h2>

          <p>
            Keep your college profile information
            accurate and up to date.
          </p>

          <div className="edit-college-info-list">

            {/* College Code */}
            <div className="edit-college-info-item">
              <span>🏷️</span>

              <div>
                <strong>College Code</strong>

                <small>
                  {college?.collegeCode || "Not available"}
                </small>
              </div>
            </div>

            {/* Email */}
            <div className="edit-college-info-item">
              <span>✉️</span>

              <div>
                <strong>Email</strong>

                <small>
                  {college?.email || "Not available"}
                </small>
              </div>
            </div>

            {/* Location */}
            <div className="edit-college-info-item">
              <span>📍</span>

              <div>
                <strong>Location</strong>

                <small>
                  {college?.location || "Not available"}
                </small>
              </div>
            </div>

            {/* Status */}
            <div className="edit-college-info-item">
              <span>✓</span>

              <div>
                <strong>Account Status</strong>

                <small>
                  {college?.status || "Not available"}
                </small>
              </div>
            </div>

          </div>

        </div>

        {/* ======================================
            RIGHT FORM PANEL
        ====================================== */}

        <div className="edit-college-form-panel">

          <div className="edit-college-form-heading">

            <div>
              <span>PROFILE INFORMATION</span>

              <h2>Update Details</h2>
            </div>

            <div className="edit-college-secure-icon">
              🔐
            </div>

          </div>

          {/* ====================================
              SUCCESS MESSAGE
          ==================================== */}

          {message && (
            <div className="edit-college-message edit-college-success">

              <span>✓</span>

              <div>
                <strong>Profile Updated</strong>

                <p>{message}</p>
              </div>

            </div>
          )}

          {/* ====================================
              ERROR MESSAGE
          ==================================== */}

          {error && (
            <div className="edit-college-message edit-college-error">

              <span>!</span>

              <div>
                <strong>Update Failed</strong>

                <p>{error}</p>
              </div>

            </div>
          )}

          {/* ====================================
              FORM
          ==================================== */}

          <form onSubmit={handleSubmit}>

            {/* College Name */}
            <div className="edit-college-field">

              <label htmlFor="collegeName">
                College Name
              </label>

              <div className="edit-college-input-wrap">

                <span className="edit-college-input-icon">
                  🏫
                </span>

                <input
                  id="collegeName"
                  type="text"
                  value={collegeName}
                  onChange={(e) =>
                    setCollegeName(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* College Code */}
            <div className="edit-college-field">

              <label htmlFor="collegeCode">
                College Code
              </label>

              <div className="edit-college-input-wrap">

                <span className="edit-college-input-icon">
                  #
                </span>

                <input
                  id="collegeCode"
                  type="text"
                  value={college?.collegeCode || ""}
                  disabled
                />

              </div>

              <small className="edit-college-disabled-note">
                College code cannot be changed.
              </small>

            </div>

            {/* Email */}
            <div className="edit-college-field">

              <label htmlFor="collegeEmail">
                Email Address
              </label>

              <div className="edit-college-input-wrap">

                <span className="edit-college-input-icon">
                  @
                </span>

                <input
                  id="collegeEmail"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* Phone */}
            <div className="edit-college-field">

              <label htmlFor="collegePhone">
                Phone Number
              </label>

              <div className="edit-college-input-wrap">

                <span className="edit-college-input-icon">
                  ☎
                </span>

                <input
                  id="collegePhone"
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* Location */}
            <div className="edit-college-field">

              <label htmlFor="collegeLocation">
                Location
              </label>

              <div className="edit-college-input-wrap">

                <span className="edit-college-input-icon">
                  📍
                </span>

                <input
                  id="collegeLocation"
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* Website */}
            <div className="edit-college-field">

              <label htmlFor="collegeWebsite">
                Website
              </label>

              <div className="edit-college-input-wrap">

                <span className="edit-college-input-icon">
                  🌐
                </span>

                <input
                  id="collegeWebsite"
                  type="text"
                  value={website}
                  onChange={(e) =>
                    setWebsite(e.target.value)
                  }
                  placeholder="https://example.com"
                />

              </div>

            </div>

            {/* ==================================
                ACTIONS
            ================================== */}

            <div className="edit-college-actions">

              <button
                type="button"
                className="edit-college-cancel"
                onClick={onBack}
                disabled={loading}
              >
                ← Back to Profile
              </button>

              <button
                type="submit"
                className="edit-college-save"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="edit-college-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    💾 Save Changes
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

export default EditCollegeProfile;