import React, { useEffect, useState } from "react";
import "../css/CompanyGuideProfile.css";

function CompanyGuideProfile({
  guide,
  onBack,
  onEdit,
  onChangePassword,
}) {
  const [profile, setProfile] = useState(guide);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const guideId = guide?.id || guide?._id;

        if (!guideId) {
          setError(
            "Company Guide information not found"
          );
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/company-guides/profile/${guideId}`
        );

        const data = await response.json();

        if (data.status === "success") {
          setProfile(data.guide);
        } else {
          setError(
            data.message ||
              "Failed to load profile"
          );
        }
      } catch (error) {
        console.error(
          "Company Guide Profile Error:",
          error
        );

        setError(
          "Unable to load Company Guide profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [guide]);

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="cgp-page">
        <div className="cgp-page-heading">
          <span>ACCOUNT</span>

          <h1>My Profile</h1>

          <p>
            View and manage your Company Guide
            profile information.
          </p>
        </div>

        <div className="cgp-loading-card">
          <div className="cgp-loader"></div>

          <h3>Loading profile...</h3>

          <p>
            Please wait while we retrieve your
            account information.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN PROFILE
     ===================================================== */

  return (
    <div className="cgp-page">

      {/* =================================================
          PAGE HEADING
          ================================================= */}

      <div className="cgp-page-heading">
        <div>
          <span>ACCOUNT INFORMATION</span>

          <h1>My Profile</h1>

          <p>
            View and manage your Company Guide
            profile information.
          </p>
        </div>
      </div>

      {/* =================================================
          ERROR
          ================================================= */}

      {error && (
        <div className="cgp-error">
          <div className="cgp-error-icon">
            !
          </div>

          <div>
            <strong>
              Unable to load profile
            </strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      {!error && (
        <>
          {/* =============================================
              PROFILE HEADER
              ============================================= */}

          <div className="cgp-profile-hero">

            <div className="cgp-avatar">
              {profile?.name
                ?.charAt(0)
                ?.toUpperCase() || "G"}
            </div>

            <div className="cgp-identity">

              <h2>
                {profile?.name ||
                  "Company Guide"}
              </h2>

              <p>Company Guide</p>

              <div className="cgp-status">
                <span className="cgp-status-dot"></span>

                {profile?.status ||
                  "Approved"}
              </div>

            </div>
          </div>

          {/* =============================================
              ACCOUNT DETAILS
              ============================================= */}

          <div className="cgp-information-card">

            <div className="cgp-card-heading">

              <div>
                <span>PERSONAL INFORMATION</span>

                <h2>Account Details</h2>
              </div>

              <div className="cgp-card-icon">
                👤
              </div>

            </div>

            <div className="cgp-information-grid">

              <div className="cgp-information-item">

                <div className="cgp-information-icon">
                  👤
                </div>

                <div>
                  <span>FULL NAME</span>

                  <strong>
                    {profile?.name ||
                      "Not available"}
                  </strong>
                </div>

              </div>

              <div className="cgp-information-item">

                <div className="cgp-information-icon">
                  ✉️
                </div>

                <div>
                  <span>EMAIL ADDRESS</span>

                  <strong>
                    {profile?.email ||
                      "Not available"}
                  </strong>
                </div>

              </div>

              <div className="cgp-information-item">

                <div className="cgp-information-icon">
                  🪪
                </div>

                <div>
                  <span>EMPLOYEE ID</span>

                  <strong>
                    {profile?.employeeId ||
                      "Not available"}
                  </strong>
                </div>

              </div>

              <div className="cgp-information-item">

                <div className="cgp-information-icon">
                  🏢
                </div>

                <div>
                  <span>COMPANY</span>

                  <strong>
                    {profile?.company
                      ?.companyName ||
                      "Not available"}
                  </strong>
                </div>

              </div>

            </div>
          </div>

          {/* =============================================
              ACCOUNT ACTIONS
              EDIT PROFILE + CHANGE PASSWORD
              ============================================= */}

          <div className="cgp-actions-card">

            <div className="cgp-actions-heading">

              <div>
                <span>ACCOUNT SETTINGS</span>

                <h2>Manage Your Account</h2>

                <p>
                  Update your profile information
                  or secure your account.
                </p>
              </div>

            </div>

            <div className="cgp-actions">

              {/* EDIT PROFILE */}

              <button
                className="cgp-action-button edit"
                onClick={onEdit}
              >

                <div className="cgp-action-icon">
                  ✏️
                </div>

                <div className="cgp-action-text">

                  <strong>
                    Edit Profile
                  </strong>

                  <span>
                    Update your personal and
                    account information
                  </span>

                </div>

                <span className="cgp-action-arrow">
                  →
                </span>

              </button>

              {/* CHANGE PASSWORD */}

              <button
                className="cgp-action-button password"
                onClick={onChangePassword}
              >

                <div className="cgp-action-icon">
                  🔐
                </div>

                <div className="cgp-action-text">

                  <strong>
                    Change Password
                  </strong>

                  <span>
                    Update your account password
                    for security
                  </span>

                </div>

                <span className="cgp-action-arrow">
                  →
                </span>

              </button>

            </div>
          </div>

          {/* =============================================
              ACCOUNT STATUS
              ============================================= */}

          <div className="cgp-account-status">

            <div className="cgp-account-status-icon">
              ✓
            </div>

            <div className="cgp-account-status-content">

              <span>ACCOUNT STATUS</span>

              <strong>
                {profile?.status ||
                  "Approved"}
              </strong>

              <p>
                Your Company Guide account is
                currently active and approved.
              </p>

            </div>

          </div>

          {/* =============================================
              BACK TO DASHBOARD
              ============================================= */}

          <div className="cgp-back-area">

            <button
              className="cgp-back-button"
              onClick={onBack}
            >
              ← Back to Dashboard
            </button>

          </div>
        </>
      )}
    </div>
  );
}

export default CompanyGuideProfile;