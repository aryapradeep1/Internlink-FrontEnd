import { useState } from "react";
import "../css/Login.css";

function CompanyLogin({ onLogin, onBack, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
     const response = await fetch(
  "http://localhost:5000/api/companies/login",
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
        setMessage("Login successful!");

        // Send company details to App.jsx
        setTimeout(() => {
          onLogin(data.company);
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
    <div className="company-login-page">

      {/* Animated background */}
      <div className="company-bg-shape company-bg-one"></div>
      <div className="company-bg-shape company-bg-two"></div>
      <div className="company-bg-shape company-bg-three"></div>

      <div className="company-login-wrapper">

        {/* Top bar */}
        <div className="company-topbar">

          <div className="company-brand">
            <div className="company-brand-icon">I</div>
            <span>InternLink</span>
          </div>

          <button
            type="button"
            className="company-role-back"
            onClick={onBack}
          >
            ← Choose another role
          </button>

        </div>

        {/* Main content */}
        <div className="company-login-content">

          {/* =================================================
              LEFT — COMPANY STORY
              ================================================= */}

          <div className="company-story">

            <div className="story-badge">
              <span className="story-dot"></span>
              Company Internship Network
            </div>

            <h1>
              Build the
              <br />
              <span>next generation.</span>
            </h1>

            <p className="story-description">
              Connect your company with talented FYUGP students
              and create meaningful internship opportunities.
            </p>

            {/* Illustration */}
            <div className="company-illustration">

              {/* Connection line */}
              <div className="connection-line line-one">
                <span></span>
              </div>

              <div className="connection-line line-two">
                <span></span>
              </div>

              {/* Company building */}
              <div className="building">

                <div className="building-roof"></div>

                <div className="building-body">

                  <div className="building-window"></div>
                  <div className="building-window"></div>
                  <div className="building-window"></div>

                  <div className="building-door"></div>

                </div>

              </div>

              {/* Student */}
              <div className="student-figure">

                <div className="student-head"></div>

                <div className="student-body">
                  <div className="student-badge">🎓</div>
                </div>

                <div className="student-leg student-leg-one"></div>
                <div className="student-leg student-leg-two"></div>

              </div>

              {/* Internship card */}
              <div className="floating-internship-card">

                <div className="mini-icon">✦</div>

                <div>
                  <strong>Internship</strong>
                  <small>Opportunity</small>
                </div>

              </div>

              {/* Connection card */}
              <div className="floating-connect-card">

                <div className="connect-icon">↗</div>

                <div>
                  <strong>Connected</strong>
                  <small>Student network</small>
                </div>

              </div>

              {/* Floating dots */}
              <span className="floating-dot dot-one"></span>
              <span className="floating-dot dot-two"></span>
              <span className="floating-dot dot-three"></span>

            </div>

            {/* Bottom features */}
            <div className="story-features">

              <div>
                <span>01</span>
                <p>Discover talent</p>
              </div>

              <div>
                <span>02</span>
                <p>Post opportunities</p>
              </div>

              <div>
                <span>03</span>
                <p>Manage interns</p>
              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT — LOGIN
              ================================================= */}

          <div className="company-login-area">

            <div className="company-login-card">

              <div className="company-login-icon">
                🏢
              </div>

              <div className="company-login-heading">

                <span>Company Portal</span>

                <h2>Welcome back</h2>

                <p>
                  Sign in to manage your internship opportunities
                  and applications.
                </p>

              </div>

              <form onSubmit={handleLogin}>

                <div className="company-form-group">

                  <label>Company Email</label>

                  <div className="company-input-wrapper">

                    <span className="input-icon">
                      @
                    </span>

                    <input
                      type="email"
                      placeholder="Enter company email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />

                  </div>

                </div>

                <div className="company-form-group">

                  <label>Password</label>

                  <div className="company-input-wrapper">

                    <span className="input-icon">
                      •
                    </span>

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
                  className="company-login-button"
                >
                  <span>Login to Company Portal</span>
                  <strong>→</strong>
                </button>

              </form>

              {message && (
                <p className="company-login-message">
                  {message}
                </p>
              )}

              <div className="company-register-area">

                <p>
                  New to InternLink?
                </p>

                <button
                  type="button"
                  onClick={onRegister}
                  className="company-register-button"
                >
                  Register your company
                  <span>→</span>
                </button>

              </div>

            </div>

            <p className="company-security-note">
              🔒 Your company information is securely handled
              by InternLink.
            </p>

          </div>

        </div>

        {/* Bottom back */}
        <button
          type="button"
          className="company-bottom-back"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>
    </div>
  );
}

export default CompanyLogin;