import React, { useEffect, useState } from "react";

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

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>My Profile</h2>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h2>My Profile</h2>
        <p>{error}</p>

        <button onClick={onBack}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>👤 My Profile</h1>

      <div className="student-info">

        <h3>Personal Information</h3>

        <p>
          <strong>Name:</strong> {profile.name}
        </p>

        <p>
          <strong>Email:</strong> {profile.email}
        </p>

        <p>
          <strong>Phone:</strong> {profile.phone}
        </p>

        <h3>Academic Information</h3>

        <p>
          <strong>Register Number:</strong>{" "}
          {profile.registerNumber}
        </p>

        <p>
          <strong>Department:</strong>{" "}
          {profile.department}
        </p>

        <p>
          <strong>Semester:</strong>{" "}
          {profile.semester}
        </p>

        <h3>College Information</h3>

        {profile.college ? (
          <>
            <p>
              <strong>College:</strong>{" "}
              {profile.college.collegeName}
            </p>

            <p>
              <strong>College Code:</strong>{" "}
              {profile.college.collegeCode}
            </p>

        
          </>
        ) : (
          <p>College information not available</p>
        )}

      </div>

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

export default StudentProfile;