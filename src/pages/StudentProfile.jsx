import React, { useEffect, useState } from "react";
import "../css/StudentProfile.css";

function StudentProfile({
  student,
  onBack,
  onEdit,
  onChangePassword,
}) {
  const [profile, setProfile] = useState(student);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/students/profile/${student.id}`
        );

        const data = await response.json();

        if (data.status === "success") {
          setProfile(data.student);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        setError("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [student.id]);

  /* ======================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <div className="student-profile-page">
        <div className="student-profile-loading">
          <div className="profile-loader"></div>

          <h2>Loading your profile</h2>

          <p>Please wait while we fetch your information.</p>
        </div>
      </div>
    );
  }

  /* ======================================================
     ERROR
  ====================================================== */

  if (error) {
    return (
      <div className="student-profile-page">
        <div className="student-profile-error">
          <div className="profile-error-icon">
            !
          </div>

          <h2>Unable to load profile</h2>

          <p>{error}</p>

          <button
            className="profile-back-btn"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ======================================================
     PROFILE
  ====================================================== */

  return (
    <div className="student-profile-page">

      {/* ==================================================
          PROFILE CARD
          ================================================== */}

      <div className="student-profile-card">

        {/* ==================================================
            PERSONAL INFORMATION
            ================================================== */}

        <section className="profile-section">

          <div className="profile-section-heading">

            <div className="profile-section-icon mint-icon">
              👤
            </div>

            <div>
              <h2>Personal Information</h2>
              <p>Your basic contact information</p>
            </div>

          </div>

          <div className="profile-details-grid">

            <div className="profile-detail">
              <span className="detail-label">
                Full Name
              </span>

              <span className="detail-value">
                {profile.name || "Not provided"}
              </span>
            </div>

            <div className="profile-detail">
              <span className="detail-label">
                Email Address
              </span>

              <span className="detail-value">
                {profile.email || "Not provided"}
              </span>
            </div>

            <div className="profile-detail">
              <span className="detail-label">
                Phone Number
              </span>

              <span className="detail-value">
                {profile.phone || "Not provided"}
              </span>
            </div>

          </div>

        </section>


        {/* ==================================================
            DIVIDER
            ================================================== */}

        <div className="profile-divider"></div>


        {/* ==================================================
            ACADEMIC INFORMATION
            ================================================== */}

        <section className="profile-section">

          <div className="profile-section-heading">

            <div className="profile-section-icon peach-icon">
              🎓
            </div>

            <div>
              <h2>Academic Information</h2>
              <p>Your FYUGP academic details</p>
            </div>

          </div>

          <div className="profile-details-grid">

            <div className="profile-detail">
              <span className="detail-label">
                Register Number
              </span>

              <span className="detail-value">
                {profile.registerNumber || "Not provided"}
              </span>
            </div>

            <div className="profile-detail">
              <span className="detail-label">
                Department
              </span>

              <span className="detail-value">
                {profile.department || "Not provided"}
              </span>
            </div>

            <div className="profile-detail">
              <span className="detail-label">
                Semester
              </span>

              <span className="detail-value">
                {profile.semester || "Not provided"}
              </span>
            </div>

          </div>

        </section>


        {/* ==================================================
            DIVIDER
            ================================================== */}

        <div className="profile-divider"></div>


        {/* ==================================================
            COLLEGE INFORMATION
            ================================================== */}

        <section className="profile-section">

          <div className="profile-section-heading">

            <div className="profile-section-icon lavender-icon">
              🏫
            </div>

            <div>
              <h2>College Information</h2>
              <p>Your registered institution</p>
            </div>

          </div>

          {profile.college ? (

            <div className="profile-details-grid">

              <div className="profile-detail">
                <span className="detail-label">
                  College
                </span>

                <span className="detail-value">
                  {profile.college.collegeName ||
                    "Not provided"}
                </span>
              </div>

              <div className="profile-detail">
                <span className="detail-label">
                  College Code
                </span>

                <span className="detail-value">
                  {profile.college.collegeCode ||
                    "Not provided"}
                </span>
              </div>

            </div>

          ) : (

            <div className="college-unavailable">
              College information not available
            </div>

          )}

        </section>

      </div>


      {/* ==================================================
          ACTIONS
          ================================================== */}

      <div className="student-profile-actions">

        <button
          className="profile-primary-action"
          onClick={onEdit}
        >
          <span>✏️</span>
          Edit Profile
        </button>

        <button
          className="profile-secondary-action"
          onClick={onChangePassword}
        >
          <span>🔐</span>
          Change Password
        </button>

      </div>

    </div>
  );
}

export default StudentProfile;