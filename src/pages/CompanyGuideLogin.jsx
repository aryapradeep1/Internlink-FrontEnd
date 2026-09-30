import React, { useState } from "react";
import "../css/Login.css";

function CompanyGuideLogin({ onLogin, onBack, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     const response = await fetch(
  "http://localhost:5000/api/company-guides/login",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  }
);

      const data = await response.json();

      if (data.status === "success") {
        alert("Company Guide login successful!");
        onLogin(data.guide);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Company Guide Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="guide-login-page">

      {/* Background decorations */}
      <div className="guide-bg-shape guide-bg-one"></div>
      <div className="guide-bg-shape guide-bg-two"></div>
      <div className="guide-bg-shape guide-bg-three"></div>

      <div className="guide-login-wrapper">

        {/* Top Bar */}
        <div className="guide-topbar">
          <div className="guide-brand">
            <div className="guide-brand-icon">I</div>
            <span>InternLink</span>
          </div>

          <button
            type="button"
            className="guide-role-back"
            onClick={onBack}
          >
            ← Choose another role
          </button>
        </div>

        {/* Main Content */}
        <div className="guide-login-content">

          {/* LEFT STORY */}
          <div className="guide-story">

            <div className="guide-story-badge">
              <span className="guide-story-dot"></span>
              Workplace Internship Mentoring
            </div>

            <h1>
              Mentor the
              <br />
              <span>real experience.</span>
            </h1>

            <p className="guide-story-description">
              Guide interns through their workplace journey,
              monitor their progress and help them turn internship
              experience into meaningful professional growth.
            </p>

            {/* Illustration */}
            <div className="guide-illustration">

              {/* Desk */}
              <div className="guide-desk">
                <div className="guide-desk-top"></div>
                <div className="guide-desk-leg guide-desk-leg-one"></div>
                <div className="guide-desk-leg guide-desk-leg-two"></div>
              </div>

              {/* Laptop */}
              <div className="guide-laptop">
                <div className="guide-laptop-screen">
                  <div className="guide-screen-header"></div>
                  <div className="guide-screen-line guide-screen-line-one"></div>
                  <div className="guide-screen-line guide-screen-line-two"></div>
                  <div className="guide-screen-chart">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="guide-laptop-base"></div>
              </div>

              {/* Mentor */}
              <div className="guide-mentor">

                <div className="guide-mentor-head">
                  <div className="guide-mentor-hair"></div>

                  <div className="guide-mentor-face">
                    <span className="guide-eye guide-eye-one"></span>
                    <span className="guide-eye guide-eye-two"></span>
                    <span className="guide-smile"></span>
                  </div>
                </div>

                <div className="guide-mentor-body">
                  <div className="guide-body-logo">I</div>
                </div>

                <div className="guide-mentor-arm guide-mentor-arm-left"></div>
                <div className="guide-mentor-arm guide-mentor-arm-right"></div>

              </div>

              {/* Intern */}
              <div className="guide-intern">

                <div className="guide-intern-head">
                  <div className="guide-intern-hair"></div>
                </div>

                <div className="guide-intern-body">
                  <div className="guide-intern-logo">✓</div>
                </div>

              </div>

              {/* Connection */}
              <div className="guide-connection guide-connection-one"></div>
              <div className="guide-connection guide-connection-two"></div>

              {/* Progress Card */}
              <div className="guide-progress-card">

                <div className="guide-progress-title">
                  <span>Intern Progress</span>
                  <strong>82%</strong>
                </div>

                <div className="guide-progress-bar">
                  <div className="guide-progress-fill"></div>
                </div>

                <small>Journey on track</small>

              </div>

              {/* Task Card */}
              <div className="guide-task-card">

                <div className="guide-task-check">✓</div>

                <div>
                  <span>Today's task</span>
                  <strong>Completed</strong>
                </div>

              </div>

              {/* Floating dots */}
              <span className="guide-floating-dot guide-dot-one"></span>
              <span className="guide-floating-dot guide-dot-two"></span>
              <span className="guide-floating-dot guide-dot-three"></span>

            </div>

            {/* Features */}
            <div className="guide-story-features">

              <div>
                <strong>01</strong>
                <span>Mentor interns</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Track progress</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Guide success</span>
              </div>

            </div>

          </div>

          {/* RIGHT LOGIN */}
          <div className="guide-login-area">

            <div className="guide-login-card">

              <div className="guide-login-icon">
                🧑‍💼
              </div>

              <div className="guide-login-heading">

                <span>Company Guide Portal</span>

                <h2>Welcome back</h2>

                <p>
                  Sign in to supervise and mentor your assigned
                  internship students.
                </p>

              </div>

              <form onSubmit={handleSubmit}>

                <div className="guide-form-group">

                  <label>Email Address</label>

                  <div className="guide-input-wrapper">

                    <span className="guide-input-icon">✉</span>

                    <input
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />

                  </div>

                </div>

                <div className="guide-form-group">

                  <label>Password</label>

                  <div className="guide-input-wrapper">

                    <span className="guide-input-icon">🔒</span>

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
                  className="guide-login-button"
                >
                  Sign in to Guide Portal
                  <span>→</span>
                </button>

              </form>

              {/* Registration option */}
              <div className="guide-register-option">
                <span>New company guide?</span>

                <button
                  type="button"
                  onClick={onRegister}
                >
                  Create an account →
                </button>
              </div>

              <div className="guide-login-note">
                <span>✓</span>
                Assigned students are securely managed through InternLink.
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Back */}
        <button
          type="button"
          className="guide-bottom-back"
          onClick={onBack}
        >
          ← Back to role selection
        </button>

      </div>
    </div>
  );
}

export default CompanyGuideLogin;

