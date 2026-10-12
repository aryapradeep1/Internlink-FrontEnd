import React, { useState } from "react";
import "../css/ForgotPassword.css";

function ForgotPassword({ onBackToLogin, onResetLinkSent }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/password/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to process your request. Please try again."
        );
      }

      setMessage(
        data.message ||
          "If an account matches that email, a password-reset link will be sent."
      );

      if (onResetLinkSent) {
        onResetLinkSent();
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <div className="forgot-password-icon">🔐</div>

        <p className="forgot-password-eyebrow">INTERNLINK ACCOUNT</p>
        <h1>Forgot password?</h1>
        <p className="forgot-password-description">
          Enter your registered email address. If an account matches it,
          we’ll send you a link to reset your password.
        </p>

        {message && (
          <div className="forgot-password-success" role="status">
            {message}
          </div>
        )}

        {error && (
          <div className="forgot-password-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="forgot-email">Email address</label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            autoComplete="email"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <button
          type="button"
          className="forgot-password-back"
          onClick={onBackToLogin}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;