import React, { useState } from "react";

function EditStudentProfile({
  student,
  onBack,
  onProfileUpdated,
}) {
  const [name, setName] = useState(student.name || "");
  const [email, setEmail] = useState(student.email || "");
  const [department, setDepartment] = useState(
    student.department || ""
  );
  const [semester, setSemester] = useState(
    student.semester || ""
  );
  const [phone, setPhone] = useState(student.phone || "");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/profile/${student.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            department,
            semester: Number(semester),
            phone,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(data.message);

        // Update student information in App.jsx
        onProfileUpdated(data.student);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      setError("Unable to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">

      <h1>✏️ Edit Profile</h1>

      <form onSubmit={handleSubmit}>

        <div className="student-info">

          <label>
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>
            Register Number
          </label>

          <input
            type="text"
            value={student.registerNumber}
            disabled
          />

          <label>
            Department
          </label>

          <input
            type="text"
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
            required
          />

          <label>
            Semester
          </label>

          <input
            type="number"
            value={semester}
            onChange={(e) =>
              setSemester(e.target.value)
            }
            min="1"
            max="8"
            required
          />

          <label>
            Phone
          </label>

          <input
            type="text"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            required
          />

          <label>
            College
          </label>

          <input
            type="text"
            value={
              student.college?.collegeName || "Not available"
            }
            disabled
          />

        </div>

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

        <div className="dashboard-menu">

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "💾 Save Changes"}
          </button>

          <button
            type="button"
            onClick={onBack}
          >
            ← Back to Profile
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditStudentProfile;