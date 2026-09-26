import React, { useState } from "react";
import "../css/EditStudentProfile.css";

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
    <div className="edit-profile-page">
      <div className="edit-profile-container">

        {/* Header */}
        <div className="edit-profile-header">
          <div className="edit-profile-icon">✏️</div>

          <div>
            <p className="edit-profile-eyebrow">
              STUDENT ACCOUNT
            </p>

            <h1>Edit Profile</h1>

            <p className="edit-profile-subtitle">
              Update your personal and academic information.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="edit-profile-form"
        >
          <div className="form-section">
            <div className="section-heading">
              <span className="section-dot"></span>

              <div>
                <h2>Personal Information</h2>
                <p>
                  Keep your contact details up to date.
                </p>
              </div>
            </div>

            <div className="form-grid">

              {/* Name */}
              <div className="form-field">
                <label htmlFor="student-name">
                  Name
                </label>

                <input
                  id="student-name"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />
              </div>

              {/* Email */}
              <div className="form-field">
                <label htmlFor="student-email">
                  Email
                </label>

                <input
                  id="student-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              {/* Phone */}
              <div className="form-field">
                <label htmlFor="student-phone">
                  Phone
                </label>

                <input
                  id="student-phone"
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  required
                />
              </div>

            </div>
          </div>

          {/* Academic Information */}
          <div className="form-section">
            <div className="section-heading">
              <span className="section-dot lavender-dot"></span>

              <div>
                <h2>Academic Information</h2>
                <p>
                  Update your current academic details.
                </p>
              </div>
            </div>

            <div className="form-grid">

              {/* Register Number */}
              <div className="form-field">
                <label htmlFor="register-number">
                  Register Number
                </label>

                <div className="disabled-input-wrapper">
                  <input
                    id="register-number"
                    type="text"
                    value={student.registerNumber}
                    disabled
                  />

                  <span className="locked-icon">
                    🔒
                  </span>
                </div>

                <small>
                  Register number cannot be changed.
                </small>
              </div>

              {/* Department */}
              <div className="form-field">
                <label htmlFor="student-department">
                  Department
                </label>

                <input
                  id="student-department"
                  type="text"
                  value={department}
                  onChange={(e) =>
                    setDepartment(e.target.value)
                  }
                  required
                />
              </div>

              {/* Semester */}
              <div className="form-field">
                <label htmlFor="student-semester">
                  Semester
                </label>

                <input
                  id="student-semester"
                  type="number"
                  value={semester}
                  onChange={(e) =>
                    setSemester(e.target.value)
                  }
                  min="1"
                  max="8"
                  required
                />
              </div>

            </div>
          </div>

          {/* College Information */}
          <div className="form-section college-section">
            <div className="section-heading">
              <span className="section-dot peach-dot"></span>

              <div>
                <h2>College Information</h2>
                <p>
                  Your college information is managed by the
                  system.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field full-width">
                <label htmlFor="student-college">
                  College
                </label>

                <div className="disabled-input-wrapper">
                  <input
                    id="student-college"
                    type="text"
                    value={
                      student.college?.collegeName ||
                      "Not available"
                    }
                    disabled
                  />

                  <span className="locked-icon">
                    🔒
                  </span>
                </div>

                <small>
                  College information cannot be edited.
                </small>
              </div>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className="profile-message success-message">
              <span>✓</span>
              <p>{message}</p>
            </div>
          )}

          {error && (
            <div className="profile-message error-message">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="edit-profile-actions">

            <button
              type="button"
              onClick={onBack}
              className="back-profile-btn"
            >
              <span>←</span>
              Back to Profile
            </button>

            <button
              type="submit"
              disabled={loading}
              className="save-profile-btn"
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Updating...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Save Changes
                </>
              )}
            </button>

          </div>
        </form>

      </div>
    </div>
  );
}

export default EditStudentProfile;