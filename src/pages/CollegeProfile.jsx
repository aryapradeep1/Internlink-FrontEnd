import React, { useEffect, useState } from "react";
import "../css/CollegeProfile.css";

function CollegeProfile({
  college,
  onBack,
  onEdit,
  onChangePassword,
}) {
  const [profile, setProfile] = useState(college);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const collegeId = college?.id || college?._id;

        const response = await fetch(
          `http://localhost:5000/api/colleges/profile/${collegeId}`
        );

        const data = await response.json();

        if (data.status === "success") {
          setProfile(data.college);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error("College profile error:", error);
        setError("Unable to load college profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [college]);

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="college-profile-loading">
        <div className="college-profile-loading-card">
          <div className="college-profile-spinner"></div>

          <h3>Loading Profile</h3>

          <p>
            Please wait while we load your college information.
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================
     PROFILE
  ========================================== */

  return (
    <div className="college-profile-page">

      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="college-profile-heading">
        <div>
          <span className="college-profile-eyebrow">
            COLLEGE ACCOUNT
          </span>

          <h1>College Profile</h1>

          <p>
            View and manage your college information.
          </p>
        </div>
      </div>

      {/* ========================================
          ERROR MESSAGE
      ======================================== */}

      {error && (
        <div className="college-profile-error">
          <span className="college-profile-error-icon">
            !
          </span>

          <div>
            <strong>Unable to load profile</strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      {!error && (
        <>
          {/* ======================================
              PROFILE CARD
          ====================================== */}

          <div className="college-profile-card">

            <div className="college-profile-card-header">
              <div className="college-profile-card-icon">
                🏫
              </div>

              <div>
                <span>COLLEGE INFORMATION</span>

                <h2>
                  {profile?.collegeName || "College"}
                </h2>
              </div>
            </div>

            {/* ====================================
                PROFILE DETAILS
            ==================================== */}

            <div className="college-profile-details">

              {/* College Name */}
              <div className="college-profile-field">
                <span>College Name</span>

                <strong>
                  {profile?.collegeName || "Not available"}
                </strong>
              </div>

              {/* College Code */}
              <div className="college-profile-field">
                <span>College Code</span>

                <strong>
                  {profile?.collegeCode || "Not available"}
                </strong>
              </div>

              {/* Email */}
              <div className="college-profile-field">
                <span>Email Address</span>

                <strong>
                  {profile?.email || "Not available"}
                </strong>
              </div>

              {/* Phone */}
              <div className="college-profile-field">
                <span>Phone Number</span>

                <strong>
                  {profile?.phone || "Not available"}
                </strong>
              </div>

              {/* Location */}
              <div className="college-profile-field">
                <span>Location</span>

                <strong>
                  {profile?.location || "Not available"}
                </strong>
              </div>

              {/* Website */}
              <div className="college-profile-field">
                <span>Website</span>

                <strong>
                  {profile?.website || "Not available"}
                </strong>
              </div>

              {/* Status */}
              <div className="college-profile-field college-profile-status-field">
                <span>Account Status</span>

                <strong>
                  <span
                    className={`college-profile-status ${
                      profile?.status?.toLowerCase() || "neutral"
                    }`}
                  >
                    {profile?.status || "Not available"}
                  </span>
                </strong>
              </div>

            </div>
          </div>

          {/* ======================================
              ACTIONS
          ====================================== */}

          <div className="college-profile-actions">

            <button
              className="college-profile-edit-button"
              onClick={onEdit}
            >
              <span>✏️</span>
              Edit Profile
            </button>

            <button
              className="college-profile-password-button"
              onClick={onChangePassword}
            >
              <span>🔐</span>
              Change Password
            </button>

            <button
              className="college-profile-back-button"
              onClick={onBack}
            >
              <span>←</span>
              Back to Dashboard
            </button>

          </div>
        </>
      )}
    </div>
  );
}

export default CollegeProfile;