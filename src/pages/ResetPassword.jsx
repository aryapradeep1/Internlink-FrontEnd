
import React, { useState } from "react";
import { useEffect } from "react";
import "../css/ResetPassword.css";

function ResetPassword({ onBackToLogin }) {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("This reset link is invalid or missing its token.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/password/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            token,
            newPassword: password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reset your password. Please request a new link."
        );
      }

      setMessage("Your password has been reset successfully. You can now sign in.");

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <div className="reset-password-icon">🔐</div>

        <p className="reset-password-eyebrow">INTERNLINK ACCOUNT SECURITY</p>
        <h1>Reset your password</h1>
        <p className="reset-password-description">
          Create a new password to securely access your account.
        </p>

        {error && (
          <div className="reset-password-error">{error}</div>
        )}

        {message && (
          <div className="reset-password-success">{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="reset-password">New password</label>
          <input
            id="reset-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            autoComplete="new-password"
            required
          />

          <label htmlFor="reset-confirm-password">Confirm new password</label>
          <input
            id="reset-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            autoComplete="new-password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Resetting password..." : "Reset Password"}
          </button>
        </form>

        <button
          type="button"
          className="reset-password-back"
          onClick={onBackToLogin}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
