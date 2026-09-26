import { useState } from "react";
import "../css/Login.css";

function CollegeLogin({ onLogin, onGoToRegister, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/colleges/login",
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
        setMessage("Login successful!");

        setTimeout(() => {
          onLogin(data.college);
        }, 500);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="college-login-page">

      {/* Top Navigation */}
      <header className="college-topbar">
        <div className="college-brand">
          <div className="college-brand-mark">I</div>
          <span>InterLink</span>
        </div>

        <button
          type="button"
          className="college-role-back"
          onClick={onBack}
        >
          ← Choose another role
        </button>
      </header>

      <main className="college-login-wrapper">

        {/* LEFT SIDE */}
        <section className="college-story">

          <div className="college-story-content">
            <div className="college-eyebrow">
              <span className="college-eyebrow-dot"></span>
              COLLEGE PORTAL
            </div>

            <h1>
              Coordinate every
              <span> internship journey.</span>
            </h1>

            <p>
              Connect students, faculty, and companies through one
              organized internship management platform.
            </p>
          </div>

          {/* College Illustration */}
          <div className="college-illustration">

            {/* Building */}
            <div className="college-building">

              <div className="college-roof"></div>

              <div className="college-building-body">
                <div className="college-building-title">
                  COLLEGE
                </div>

                <div className="college-columns">
                  <div className="college-column"></div>
                  <div className="college-column"></div>
                  <div className="college-column"></div>
                  <div className="college-column"></div>
                </div>

                <div className="college-building-door"></div>
              </div>
            </div>

            {/* Connection Nodes */}
            <div className="college-network">

              <div className="college-network-line line-one"></div>
              <div className="college-network-line line-two"></div>
              <div className="college-network-line line-three"></div>

              <div className="college-node node-student">
                <span>🎓</span>
                <small>Students</small>
              </div>

              <div className="college-node node-faculty">
                <span>👨‍🏫</span>
                <small>Faculty</small>
              </div>

              <div className="college-node node-company">
                <span>🏢</span>
                <small>Companies</small>
              </div>

            </div>

            {/* Floating Approval Card */}
            <div className="college-floating-card approval-card">
              <div className="college-card-icon">✓</div>
              <div>
                <strong>Internship Approved</strong>
                <small>Workflow completed</small>
              </div>
            </div>

            {/* Floating Progress Card */}
            <div className="college-floating-card progress-card">
              <div className="college-progress-top">
                <span>Student Progress</span>
                <strong>82%</strong>
              </div>

              <div className="college-progress-bar">
                <span></span>
              </div>
            </div>

            {/* Decorative dots */}
            <div className="college-orbit orbit-one"></div>
            <div className="college-orbit orbit-two"></div>

          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="college-login-area">

          <div className="college-login-card">

            <div className="college-card-heading">
              <div className="college-icon-circle">
                🏫
              </div>

              <div>
                <p className="college-small-label">WELCOME BACK</p>
                <h2>College Login</h2>
              </div>
            </div>

            <p className="college-login-description">
              Sign in to manage your institution's internship activities.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="college-input-group">
                <label>College Email</label>

                <div className="college-input-wrapper">
                  <span className="college-input-icon">✉</span>

                  <input
                    type="email"
                    placeholder="Enter college email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="college-input-group">
                <label>Password</label>

                <div className="college-input-wrapper">
                  <span className="college-input-icon">🔒</span>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="college-login-button"
              >
                <span>Login to College Portal</span>
                <span className="college-button-arrow">→</span>
              </button>

            </form>

            {message && (
              <div
                className={`college-message ${
                  message === "Login successful!"
                    ? "college-success"
                    : "college-error"
                }`}
              >
                {message}
              </div>
            )}

            <div className="college-register-area">
              <span>Don't have a college account?</span>

              <button
                type="button"
                onClick={onGoToRegister}
              >
                Register your college
                <span>→</span>
              </button>
            </div>

            <button
              type="button"
              className="college-bottom-back"
              onClick={onBack}
            >
              ← Back to role selection
            </button>

          </div>

        </section>

      </main>

      <div className="college-footer">
        <span>InterLink</span>
        <span>•</span>
        <span>FYUGP Internship Management Platform</span>
      </div>

    </div>
  );
}

export default CollegeLogin;