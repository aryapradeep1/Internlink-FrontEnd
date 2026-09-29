import React, { useState } from "react";
import "../css/ChangePassword.css";

function ChangePassword({
  user,
  role,
  onBack,
}) {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getApiUrl = () => {
    const routes = {
      student: "students",
      company: "companies",
      faculty: "faculty",
      college: "colleges",
      companyGuide: "company-guides",
      admin: "admin",
    };

    const userId = user?.id || user?._id;

    return `http://localhost:5000/api/${routes[role]}/change-password/${userId}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Check empty fields
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError("Please fill all password fields");
      return;
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    // Check minimum length
    if (newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters"
      );
      return;
    }

    // Check user ID
    if (!user?.id && !user?._id) {
      setError("User information not found");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getApiUrl(), {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setMessage(data.message);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(
          data.message ||
            "Failed to change password"
        );
      }
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setError("Unable to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">

      <div className="change-password-card">

        {/* HEADER */}
        <div className="change-password-header">

          <div className="change-password-icon">
            🔐
          </div>

          <div>
            <span className="change-password-label">
              ACCOUNT SECURITY
            </span>

            <h2>
              Change Password
            </h2>

            <p>
              Update your password to keep your
              account secure.
            </p>
          </div>

        </div>


        {/* FORM */}
        <form
          className="change-password-form"
          onSubmit={handleSubmit}
        >

          {/* CURRENT PASSWORD */}
          <div className="password-field">

            <label>
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              placeholder="Enter your current password"
              required
            />

          </div>


          {/* NEW PASSWORD */}
          <div className="password-field">

            <label>
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              placeholder="Enter your new password"
              minLength="6"
              required
            />

            <small>
              Password must be at least 6 characters.
            </small>

          </div>


          {/* CONFIRM PASSWORD */}
          <div className="password-field">

            <label>
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Re-enter your new password"
              minLength="6"
              required
            />

          </div>


          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="change-password-message success">
              <span>✓</span>
              <p>{message}</p>
            </div>
          )}


          {/* ERROR MESSAGE */}
          {error && (
            <div className="change-password-message error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}


          {/* ACTIONS */}
          <div className="change-password-actions">

            <button
              type="submit"
              className="change-password-submit"
              disabled={loading}
            >
              {loading
                ? "Changing..."
                : "🔐 Change Password"}
            </button>

            <button
              type="button"
              className="change-password-back"
              onClick={onBack}
            >
              ← Back to Profile
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ChangePassword;