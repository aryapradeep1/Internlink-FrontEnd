import React, { useState } from "react";
import "../css/EditFacultyProfile.css";

function EditFacultyProfile({
 faculty,
  onBack,
  onUpdated,
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

       onUpdated(data.faculty);
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
    <div className="edit-faculty-page">

      {/* Page Header */}
      <div className="edit-faculty-header">
        <div>
          <span className="edit-faculty-label">
            FACULTY PROFILE
          </span>

          <h1>Edit Profile</h1>

          <p>
            Update your personal and professional information
          </p>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="edit-profile-message success-message">
          <span className="message-icon">✓</span>
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="edit-profile-message error-message">
          <span className="message-icon">!</span>
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="edit-faculty-card">

        <div className="edit-card-heading">
          <div className="edit-card-icon">
            ✏️
          </div>

          <div>
            <h2>Personal Information</h2>
            <p>
              Make changes to your faculty profile below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="edit-form-grid">

            {/* Name */}
            <div className="edit-form-group">
              <label htmlFor="faculty-name">
                Full Name
              </label>

              <input
                id="faculty-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="edit-form-group">
              <label htmlFor="faculty-email">
                Email Address
              </label>

              <input
                id="faculty-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
              />
            </div>

            {/* Department */}
            <div className="edit-form-group">
              <label htmlFor="faculty-department">
                Department
              </label>

              <input
                id="faculty-department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                placeholder="Enter your department"
              />
            </div>

            {/* Phone */}
            <div className="edit-form-group">
              <label htmlFor="faculty-phone">
                Phone Number
              </label>

              <input
                id="faculty-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Enter your phone number"
              />
            </div>

            {/* Designation */}
            <div className="edit-form-group edit-full-width">
              <label htmlFor="faculty-designation">
                Designation
              </label>

              <input
                id="faculty-designation"
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
                placeholder="Enter your designation"
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="edit-profile-actions">

            <button
              type="button"
              className="edit-back-btn"
              onClick={onBack}
            >
              ← Back to Profile
            </button>

            <button
              type="submit"
              className="edit-save-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="save-spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  ✓ Save Changes
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default EditFacultyProfile;