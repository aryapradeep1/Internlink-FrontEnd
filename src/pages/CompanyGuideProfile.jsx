import React, { useEffect, useState } from "react";

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

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>👤 My Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      <h1>👤 My Profile</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!error && (
        <div className="student-info">

          <p>
            <strong>Name:</strong>{" "}
            {profile?.name || "Not available"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {profile?.email || "Not available"}
          </p>

          <p>
            <strong>Employee ID:</strong>{" "}
            {profile?.employeeId ||
              "Not available"}
          </p>

          <p>
            <strong>Company:</strong>{" "}
            {profile?.company?.companyName ||
              "Not available"}
          </p>

        </div>
      )}

      <div className="dashboard-menu">

        <button onClick={onEdit}>
          ✏️ Edit Profile
        </button>

        <button onClick={onChangePassword}>
          🔐 Change Password
        </button>

        <button onClick={onBack}>
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default CompanyGuideProfile;