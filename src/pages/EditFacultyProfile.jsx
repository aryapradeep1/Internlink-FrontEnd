import React, { useState } from "react";

function EditFacultyProfile({
  faculty,
  onBack,
  onProfileUpdated,
}) {
  const [name, setName] = useState(faculty?.name || "");
  const [email, setEmail] = useState(faculty?.email || "");
  const [department, setDepartment] = useState(
    faculty?.department || ""
  );
  const [phone, setPhone] = useState(faculty?.phone || "");
  const [designation, setDesignation] = useState(
    faculty?.designation || ""
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
      const facultyId = faculty?.id || faculty?._id;

      const response = await fetch(
        `http://localhost:5000/api/faculty/profile/${facultyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            department,
            phone,
            designation,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(data.message);

        onProfileUpdated(data.faculty);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Edit faculty profile error:", error);
      setError("Unable to update faculty profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>✏️ Edit Faculty Profile</h1>

      {message && (
        <p style={{ color: "green" }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="student-info">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />

          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label>Designation</label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
          />
        </div>

        <div className="dashboard-menu">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "💾 Save Changes"}
          </button>

          <button type="button" onClick={onBack}>
            ← Back to Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditFacultyProfile;