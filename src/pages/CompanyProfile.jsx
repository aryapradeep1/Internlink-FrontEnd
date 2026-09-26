import React, { useEffect, useState } from "react";

function CompanyProfile({
  company,
  onBack,
  onEdit,
  onChangePassword,
}) {
  const [profile, setProfile] = useState(company);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const companyId = company?.id || company?._id;

        const response = await fetch(
          `http://localhost:5000/api/companies/profile/${companyId}`
        );

        const data = await response.json();

        if (data.status === "success") {
          setProfile(data.company);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error("Company profile error:", error);
        setError("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [company]);

  if (loading) {
    return (
      <div className="company-profile-page">
        <div className="company-profile-loading">
          <div className="company-profile-loader"></div>

          <div>
            <strong>Loading company profile</strong>
            <span>Getting your company information...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="company-profile-page">

      {/* =====================================================
          PROFILE HERO
      ===================================================== */}

      <section className="company-profile-hero">

        <div className="company-profile-hero-decoration company-profile-decoration-one"></div>
        <div className="company-profile-hero-decoration company-profile-decoration-two"></div>

        <div className="company-profile-hero-content">

          <div className="company-profile-identity">

            <div className="company-profile-large-logo">
              {profile?.companyName
                ?.charAt(0)
                ?.toUpperCase() || "C"}
            </div>

            <div className="company-profile-title-area">

              <span className="company-profile-eyebrow">
                COMPANY PROFILE
              </span>

              <h1>
                {profile?.companyName || "Company"}
              </h1>

              <p>
                Your organization information on the
                InternLink internship platform.
              </p>

            </div>

          </div>

          <div className="company-profile-account-badge">
            <span className="company-profile-online-dot"></span>
            Company Account
          </div>

        </div>

      </section>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="company-profile-error">
          <span>!</span>
          {error}
        </div>
      )}


      {!error && (
        <>

          {/* =====================================================
              PROFILE CONTENT
          ===================================================== */}

          <section className="company-profile-content">

            {/* MAIN INFORMATION */}

            <div className="company-profile-main-card">

              <div className="company-profile-card-heading">

                <div>
                  <span className="company-profile-card-kicker">
                    ORGANIZATION
                  </span>

                  <h2>
                    Company Information
                  </h2>

                  <p>
                    Information associated with your
                    registered company account.
                  </p>
                </div>

                <div className="company-profile-card-icon">
                  ◈
                </div>

              </div>


              <div className="company-profile-information-grid">

                {/* COMPANY NAME */}

                <div className="company-profile-information-item company-profile-information-wide">

                  <div className="company-profile-information-icon">
                    ◉
                  </div>

                  <div>
                    <span>
                      Company Name
                    </span>

                    <strong>
                      {profile?.companyName ||
                        "Not available"}
                    </strong>
                  </div>

                </div>


                {/* EMAIL */}

                <div className="company-profile-information-item">

                  <div className="company-profile-information-icon company-profile-icon-coral">
                    @
                  </div>

                  <div>
                    <span>
                      Email Address
                    </span>

                    <strong>
                      {profile?.email ||
                        "Not available"}
                    </strong>
                  </div>

                </div>


                {/* LOCATION */}

                <div className="company-profile-information-item">

                  <div className="company-profile-information-icon company-profile-icon-purple">
                    ⌖
                  </div>

                  <div>
                    <span>
                      Location
                    </span>

                    <strong>
                      {profile?.location ||
                        "Not available"}
                    </strong>
                  </div>

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="company-profile-description">

                <div className="company-profile-description-heading">
                  <span className="company-profile-description-icon">
                    ≋
                  </span>

                  <div>
                    <span>
                      ABOUT THE COMPANY
                    </span>

                    <strong>
                      Company Description
                    </strong>
                  </div>
                </div>

                <p>
                  {profile?.description ||
                    "No company description has been added yet."}
                </p>

              </div>

            </div>


            {/* RIGHT SIDE */}

            <aside className="company-profile-side-panel">

              {/* PROFILE STATUS */}

              <div className="company-profile-status-card">

                <div className="company-profile-status-icon">
                  ✓
                </div>

                <div>

                  <span>
                    ACCOUNT STATUS
                  </span>

                  <strong>
                    Active
                  </strong>

                  <p>
                    Your company account is ready
                    to manage internship activities.
                  </p>

                </div>

              </div>


              {/* ACCOUNT ACTIONS */}

              <div className="company-profile-actions-card">

                <div className="company-profile-actions-heading">

                  <span>
                    ACCOUNT
                  </span>

                  <h3>
                    Manage Profile
                  </h3>

                </div>


                <button
                  className="company-profile-edit-button"
                  onClick={onEdit}
                >

                  <span className="company-profile-action-icon">
                    ✎
                  </span>

                  <span className="company-profile-action-text">
                    <strong>
                      Edit Profile
                    </strong>

                    <small>
                      Update your company information
                    </small>
                  </span>

                  <span className="company-profile-action-arrow">
                    →
                  </span>

                </button>


                <button
                  className="company-profile-password-button"
                  onClick={onChangePassword}
                >

                  <span className="company-profile-action-icon">
                    ◈
                  </span>

                  <span className="company-profile-action-text">
                    <strong>
                      Change Password
                    </strong>

                    <small>
                      Update your account password
                    </small>
                  </span>

                  <span className="company-profile-action-arrow">
                    →
                  </span>

                </button>

              </div>


              {/* PLATFORM NOTE */}

              <div className="company-profile-platform-card">

                <div className="company-profile-platform-mark">
                  IL
                </div>

                <div>
                  <strong>
                    InternLink
                  </strong>

                  <p>
                    Connected internship management
                    for companies and students.
                  </p>
                </div>

              </div>

            </aside>

          </section>


          {/* =====================================================
              FOOTER INFORMATION
          ===================================================== */}

          <section className="company-profile-bottom-strip">

            <div>
              <span className="company-profile-bottom-number">
                01
              </span>

              <div>
                <strong>
                  Company Account
                </strong>

                <small>
                  Organization information
                </small>
              </div>
            </div>

            <div>
              <span className="company-profile-bottom-number">
                02
              </span>

              <div>
                <strong>
                  Internship Management
                </strong>

                <small>
                  Opportunities and applications
                </small>
              </div>
            </div>

            <div>
              <span className="company-profile-bottom-number">
                03
              </span>

              <div>
                <strong>
                  Connected Workspace
                </strong>

                <small>
                  Students, colleges and guides
                </small>
              </div>
            </div>

          </section>

        </>
      )}

    </div>
  );
}

export default CompanyProfile;