import React, { useEffect, useState } from "react";

function FacultyProfile({
  faculty,
  onBack,
  onEdit,
  onChangePassword,
}) {
  const [profile, setProfile] = useState(faculty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const facultyId = faculty?.id || faculty?._id;

        const response = await fetch(
          `http://localhost:5000/api/faculty/profile/${facultyId}`
        );

        const data = await response.json();

        if (data.status === "success") {
          setProfile(data.faculty);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error("Faculty profile error:", error);
        setError("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [faculty]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>👤 Faculty Profile</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!error && (
        <div className="student-info">
          <p>
            <strong>Name:</strong>{" "}
            {profile?.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {profile?.email}
          </p>

          <p>
            <strong>Department:</strong>{" "}
            {profile?.department || "Not available"}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {profile?.phone || "Not available"}
          </p>

          <p>
            <strong>Designation:</strong>{" "}
            {profile?.designation || "Faculty"}
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

export default FacultyProfile;
