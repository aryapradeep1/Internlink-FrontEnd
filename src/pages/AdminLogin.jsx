import { useState } from "react";
import "../css/Login.css";

function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin-login/login",
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
        onLogin(data.admin);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="admin-login-page">

      {/* TOP BAR */}
      <header className="admin-topbar">
        <div className="admin-brand">
          <div className="admin-brand-mark">I</div>
          <span>InterLink</span>
        </div>

        <button
          type="button"
          className="admin-role-back"
          onClick={onBack}
        >
          ← Choose another role
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="admin-login-wrapper">

        {/* LEFT ADMIN CONTROL CENTER */}
        <section className="admin-story">

          <div className="admin-story-content">

            <div className="admin-eyebrow">
              <span className="admin-eyebrow-dot"></span>
              PLATFORM ADMINISTRATION
            </div>

            <h1>
              Keep every
              <span> journey on track.</span>
            </h1>

            <p>
              Manage the InterLink ecosystem from one central platform,
              keeping colleges, companies, faculty, guides and students
              connected.
            </p>

          </div>

          {/* ADMIN CONTROL ILLUSTRATION */}
          <div className="admin-illustration">

            {/* Main dashboard */}
            <div className="admin-dashboard-window">

              <div className="admin-window-top">
                <div className="admin-window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="admin-window-title">
                  InterLink Control Center
                </div>
              </div>

              <div className="admin-dashboard-content">

                {/* Sidebar */}
                <div className="admin-mini-sidebar">

                  <div className="admin-sidebar-logo">
                    I
                  </div>

                  <div className="admin-sidebar-item active">
                    <span>⌂</span>
                  </div>

                  <div className="admin-sidebar-item">
                    <span>♙</span>
                  </div>

                  <div className="admin-sidebar-item">
                    <span>▣</span>
                  </div>

                  <div className="admin-sidebar-item">
                    <span>✓</span>
                  </div>

                </div>

                {/* Dashboard area */}
                <div className="admin-mini-main">

                  <div className="admin-mini-heading">
                    <div>
                      <small>OVERVIEW</small>
                      <strong>Platform Activity</strong>
                    </div>

                    <div className="admin-status-pill">
                      ● System active
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="admin-mini-stats">

                    <div className="admin-mini-stat">
                      <span>Students</span>
                      <strong>248</strong>
                      <i>↗</i>
                    </div>

                    <div className="admin-mini-stat">
                      <span>Companies</span>
                      <strong>36</strong>
                      <i>↗</i>
                    </div>

                    <div className="admin-mini-stat">
                      <span>Internships</span>
                      <strong>84</strong>
                      <i>↗</i>
                    </div>

                  </div>

                  {/* Activity chart */}
                  <div className="admin-chart-card">

                    <div className="admin-chart-header">
                      <span>Internship Activity</span>
                      <small>2026</small>
                    </div>

                    <div className="admin-chart">

                      <div className="admin-chart-grid">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>

                      <svg
                        viewBox="0 0 400 120"
                        preserveAspectRatio="none"
                        className="admin-chart-line"
                      >
                        <path
                          d="M0,92 C35,84 40,95 70,76 C100,57 112,78 140,60 C166,43 180,58 205,47 C235,34 244,52 270,39 C300,24 310,42 335,25 C360,11 377,27 400,12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>

                    </div>

                  </div>

                </div>

              </div>
            </div>

            {/* Floating verification card */}
            <div className="admin-floating-card verification-card">

              <div className="admin-floating-icon">
                ✓
              </div>

              <div>
                <strong>Verification complete</strong>
                <small>Platform activity synced</small>
              </div>

            </div>

            {/* Floating security card */}
            <div className="admin-floating-card security-card">

              <div className="admin-security-icon">
                ◈
              </div>

              <div>
                <strong>Admin access</strong>
                <small>Secure control center</small>
              </div>

            </div>

            {/* Decorative circles */}
            <div className="admin-decoration decoration-one"></div>
            <div className="admin-decoration decoration-two"></div>

          </div>

        </section>

        {/* RIGHT LOGIN AREA */}
        <section className="admin-login-area">

          <div className="admin-login-card">

            <div className="admin-card-heading">

              <div className="admin-icon-circle">
                ⚙
              </div>

              <div>
                <p className="admin-small-label">
                  SECURE ACCESS
                </p>

                <h2>
                  Administrator
                </h2>
              </div>

            </div>

            <p className="admin-login-description">
              Sign in to access the InterLink administration center.
            </p>

            <form onSubmit={handleLogin}>

              <div className="admin-input-group">

                <label>
                  Admin Email
                </label>

                <div className="admin-input-wrapper">

                  <span className="admin-input-icon">
                    ✉
                  </span>

                  <input
                    type="email"
                    placeholder="Enter administrator email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                </div>

              </div>

              <div className="admin-input-group">

                <label>
                  Password
                </label>

                <div className="admin-input-wrapper">

                  <span className="admin-input-icon">
                    🔒
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
                className="admin-login-button"
              >
                <span>
                  Enter Control Center
                </span>

                <span className="admin-button-arrow">
                  →
                </span>
              </button>

            </form>

            {message && (
              <div className="admin-message">
                {message}
              </div>
            )}

            <div className="admin-security-note">

              <span className="admin-lock-icon">
                ◈
              </span>

              <div>
                <strong>Protected administration area</strong>
                <small>
                  Authorized administrators only
                </small>
              </div>

            </div>

            <button
              type="button"
              className="admin-bottom-back"
              onClick={onBack}
            >
              ← Back to role selection
            </button>

          </div>

        </section>

      </main>

      <div className="admin-footer">
        <span>InterLink</span>
        <span>•</span>
        <span>FYUGP Internship Management Platform</span>
      </div>

    </div>
  );
}

export default AdminLogin;