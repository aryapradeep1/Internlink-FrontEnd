import React, { useEffect, useState } from "react";

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

  if (loading) {
    return (
      <div className="dashboard-container">
        <p>Loading college profile...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>👤 College Profile</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!error && (
        <div className="student-info">
          <p>
            <strong>College Name:</strong>{" "}
            {profile?.collegeName}
          </p>

          <p>
            <strong>College Code:</strong>{" "}
            {profile?.collegeCode}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {profile?.email}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {profile?.phone || "Not available"}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {profile?.location || "Not available"}
          </p>

          <p>
            <strong>Website:</strong>{" "}
            {profile?.website || "Not available"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {profile?.status}
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

export default CollegeProfile;