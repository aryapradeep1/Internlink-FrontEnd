import React, { useState } from "react";

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
    <div className="dashboard-container">

      <h1>🔐 Change Password</h1>

      <form onSubmit={handleSubmit}>

        <div className="student-info">

          <label>
            Current Password
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            required
          />

          <label>
            New Password
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            minLength="6"
            required
          />

          <label>
            Confirm New Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            minLength="6"
            required
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

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Changing..."
              : "🔐 Change Password"}
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

export default ChangePassword;