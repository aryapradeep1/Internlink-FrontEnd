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
      <div className="dashboard-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>👤 Company Profile</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && (
        <div className="student-info">
          <p>
            <strong>Company Name:</strong>{" "}
            {profile?.companyName}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {profile?.email}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {profile?.description || "Not available"}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {profile?.location || "Not available"}
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

export default CompanyProfile;