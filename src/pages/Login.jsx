import React, { useState } from "react";
import "../css/Login.css";

function Login({
  onLogin,
  onGoToRegister,
  onGoToCompanyRegister,
  onGoToFacultyRegister,
  onGoToCompanyGuideRegister,
  onGoToCollegeRegister,
  onGoToHome,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginEndpoints = [
    {
      role: "student",
      endpoint: "http://localhost:5000/api/students/login",
      userKey: "student",
    },
    {
      role: "company",
      endpoint: "http://localhost:5000/api/companies/login",
      userKey: "company",
    },
    {
      role: "faculty",
      endpoint: "http://localhost:5000/api/faculty/login",
      userKey: "faculty",
    },
    {
      role: "companyGuide",
      endpoint: "http://localhost:5000/api/company-guides/login",
      userKey: "guide",
    },
    {
      role: "collegeAdmin",
      endpoint: "http://localhost:5000/api/colleges/login",
      userKey: "college",
    },
    {
      role: "admin",
      endpoint: "http://localhost:5000/api/admin-login/login",
      userKey: "admin",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let loggedIn = false;

      for (const loginInfo of loginEndpoints) {
        try {
          const response = await fetch(loginInfo.endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: email.trim(),
              password,
            }),
          });

          let data = {};

          try {
            data = await response.json();
          } catch {
            data = {};
          }

          if (response.ok) {
            const userData = data[loginInfo.userKey];

            if (userData) {
              loggedIn = true;

              onLogin(loginInfo.role, userData);

              break;
            }
          }
        } catch (endpointError) {
          console.log(
            `Login check failed for ${loginInfo.role}:`,
            endpointError
          );
        }
      }

      if (!loggedIn) {
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="single-login-page">
      {/* Background decoration */}
      <div className="single-login-glow single-login-glow-left"></div>
      <div className="single-login-glow single-login-glow-right"></div>

      {/* Top navigation */}
      <header className="single-login-navbar">
        <button
          type="button"
          className="single-login-brand"
          onClick={onGoToHome}
        >
          <span className="single-login-logo">I</span>
          <span className="single-login-arrow">↗</span>
          <span className="single-login-brand-text">InternLink</span>
        </button>

        <span className="single-login-platform">
          FYUGP INTERNSHIP PLATFORM
        </span>
      </header>

      {/* Main */}
      <main className="single-login-main">
        <section className="single-login-layout">

          {/* Left side */}
          <div className="single-login-introduction">
            <button
              type="button"
              className="single-login-back"
              onClick={onGoToHome}
            >
              ← Back to Home
            </button>

            <div className="single-login-label">
              INTERNLINK ACCESS
            </div>

            <h1>
              Welcome back
              <br />
              <span>to InternLink.</span>
            </h1>

            <p>
              Sign in to access your internship workspace and continue
              your FYUGP internship journey.
            </p>

            <div className="single-login-info">
              <div className="single-login-info-item">
                <div className="single-login-info-icon">
                  ✓
                </div>

                <div>
                  <strong>One secure login</strong>
                  <span>
                    Use the same login page for every InternLink role.
                  </span>
                </div>
              </div>

              <div className="single-login-info-item">
                <div className="single-login-info-icon">
                  →
                </div>

                <div>
                  <strong>Automatic access</strong>
                  <span>
                    InternLink identifies your account and opens the
                    appropriate workspace.
                  </span>
                </div>
              </div>

              <div className="single-login-info-item">
                <div className="single-login-info-icon">
                  ✦
                </div>

                <div>
                  <strong>Everything connected</strong>
                  <span>
                    Students, colleges, faculty and companies work
                    together on one platform.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login card */}
          <div className="single-login-card-wrapper">
            <div className="single-login-card">

              <div className="single-login-card-header">
                <div className="single-login-card-icon">
                  ↗
                </div>

                <div>
                  <span>WELCOME BACK</span>
                  <h2>Sign in</h2>
                </div>
              </div>

              <p className="single-login-card-description">
                Enter your account details to continue.
              </p>

              {error && (
                <div className="single-login-error">
                  <span>!</span>
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Email */}
                <div className="single-login-field">
                  <label htmlFor="login-email">
                    Email address
                  </label>

                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div className="single-login-field">
                  <label htmlFor="login-password">
                    Password
                  </label>

                  <div className="single-login-password">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="single-login-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="single-login-spinner"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>

              {/* Registration */}
              <div className="single-login-register">
                <span>Don't have an account?</span>
                <button
                  type="button"
                  onClick={onGoToRegister}
                >
                  Register as Student
                </button>
              </div>

              <div className="single-login-other-registers">
                <span>Register as</span>

                <button
                  type="button"
                  onClick={onGoToCompanyRegister}
                >
                  Company
                </button>

                <button
                  type="button"
                  onClick={onGoToFacultyRegister}
                >
                  Faculty
                </button>

                <button
                  type="button"
                  onClick={onGoToCompanyGuideRegister}
                >
                  Company Guide
                </button>

                <button
                  type="button"
                  onClick={onGoToCollegeRegister}
                >
                  College
                </button>
              </div>

              <div className="single-login-security">
                <span>●</span>
                Secure InternLink account access
              </div>

            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

export default Login;