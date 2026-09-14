import React, { useState } from "react";

function CollegeAdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/college-admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          data.message || "Login successful!"
        );

        setTimeout(() => {
          onLogin(data.collegeAdmin);
        }, 1000);
      } else {
        setError(
          data.message || "Invalid email or password"
        );
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Interlink</h1>

        <h2>College Admin Login</h2>

        <p className="subtitle">
          Login to manage your college internship activities
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button type="submit">
            Login
          </button>
        </form>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <p className="register-link">
          <span onClick={onBack}>
            ← Back to Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default CollegeAdminLogin;