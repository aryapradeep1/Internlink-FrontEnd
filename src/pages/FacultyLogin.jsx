import React, { useState } from "react";
import "../css/Login.css";

function FacultyLogin({ onLogin, onBack, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/faculty/login",
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

      if (data.status === "success") {
        alert("Faculty login successful!");
        onLogin(data.faculty);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Faculty Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="faculty-login-page">
      {/* Background decorations */}
      <div className="faculty-bg-shape faculty-bg-one"></div>
      <div className="faculty-bg-shape faculty-bg-two"></div>
      <div className="faculty-bg-shape faculty-bg-three"></div>

      <div className="faculty-login-wrapper">

        {/* Top Bar */}
        <div className="faculty-topbar">
          <div className="faculty-brand">
            <div className="faculty-brand-icon">I</div>
            <span>InternLink</span>
          </div>

          <button
            type="button"
            className="faculty-role-back"
            onClick={onBack}
          >
            ← Choose another role
          </button>
        </div>

        {/* Main Content */}
        <div className="faculty-login-content">

          {/* LEFT SIDE */}
          <div className="faculty-story">

            <div className="faculty-story-badge">
              <span className="faculty-story-dot"></span>
              Faculty Internship Guidance
            </div>

            <h1>
              Guide the
              <br />
              <span>journey forward.</span>
            </h1>

            <p className="faculty-story-description">
              Support students throughout their internship journey,
              monitor progress, review logbooks and help them earn
              meaningful FYUGP internship experience.
            </p>

            {/* Illustration */}
            <div className="faculty-illustration">

              {/* Decorative circles */}
              <div className="faculty-orbit faculty-orbit-one"></div>
              <div className="faculty-orbit faculty-orbit-two"></div>

              {/* Faculty person */}
              <div className="faculty-person">

                <div className="faculty-head">
                  <div className="faculty-hair"></div>
                  <div className="faculty-face">
                    <span className="faculty-eye faculty-eye-one"></span>
                    <span className="faculty-eye faculty-eye-two"></span>
                    <span className="faculty-smile"></span>
                  </div>
                </div>

                <div className="faculty-body">
                  <div className="faculty-collar faculty-collar-left"></div>
                  <div className="faculty-collar faculty-collar-right"></div>
                  <div className="faculty-body-logo">I</div>
                </div>

                <div className="faculty-arm faculty-arm-left"></div>
                <div className="faculty-arm faculty-arm-right"></div>

              </div>

              {/* Student */}
              <div className="faculty-student">

                <div className="faculty-student-head">
                  <div className="faculty-student-hair"></div>
                </div>

                <div className="faculty-student-body">
                  <div className="faculty-student-logo">✓</div>
                </div>

              </div>

              {/* Connection */}
              <div className="faculty-connection-line faculty-line-one"></div>
              <div className="faculty-connection-line faculty-line-two"></div>

              {/* Guidance card */}
              <div className="faculty-guidance-card">
                <div className="faculty-guidance-icon">✓</div>

                <div>
                  <span>Internship Progress</span>
                  <strong>On Track</strong>
                </div>
              </div>

              {/* Logbook card */}
              <div className="faculty-logbook-card">
                <div className="faculty-logbook-top">
                  <span>Logbook</span>
                  <span className="faculty-check">✓</span>
                </div>

                <div className="faculty-progress">
                  <div className="faculty-progress-fill"></div>
                </div>

                <small>60+ hours completed</small>
              </div>

              {/* Floating dots */}
              <span className="faculty-floating-dot faculty-dot-one"></span>
              <span className="faculty-floating-dot faculty-dot-two"></span>
              <span className="faculty-floating-dot faculty-dot-three"></span>

            </div>

            {/* Story features */}
            <div className="faculty-story-features">
              <div>
                <strong>01</strong>
                <span>Guide students</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Review progress</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Support success</span>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="faculty-login-area">

            <div className="faculty-login-card">

              <div className="faculty-login-icon">
                👨‍🏫
              </div>

              <div className="faculty-login-heading">
                <span>Faculty Portal</span>

                <h2>Welcome back</h2>

                <p>
                  Sign in to guide and monitor your students'
                  internship progress.
                </p>
              </div>

              <form onSubmit={handleSubmit}>

                <div className="faculty-form-group">
                  <label>Email Address</label>

                  <div className="faculty-input-wrapper">
                    <span className="faculty-input-icon">✉</span>

                    <input
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="faculty-form-group">
                  <label>Password</label>

                  <div className="faculty-input-wrapper">
                    <span className="faculty-input-icon">🔒</span>

                    <input
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="faculty-login-button"
                >
                  Sign in to Faculty Portal
                  <span>→</span>
                </button>

              </form>

              {/* Registration */}
              <div className="faculty-register-area">
                <p>Are you a new faculty member?</p>

                <button
                  type="button"
                  onClick={onRegister}
                  className="faculty-register-button"
                >
                  Register as Faculty
                  <span>→</span>
                </button>
              </div>

            </div>

            <p className="faculty-security-note">
              🔒 Your faculty account is securely handled by InternLink.
            </p>

          </div>

        </div>

        {/* Bottom Back */}
        <button
          type="button"
          className="faculty-bottom-back"
          onClick={onBack}
        >
          ← Back to role selection
        </button>

      </div>
    </div>
  );
}

export default FacultyLogin;