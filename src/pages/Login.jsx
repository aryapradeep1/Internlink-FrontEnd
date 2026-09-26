import React, { useState } from "react";
import "../css/Login.css";

function Login({
  onLogin,
  onGoToRegister,
  onGoToCompanyLogin,
  onGoToAdminLogin,
  onGoToFacultyLogin,
  onGoToCompanyGuideLogin,
  onGoToCompanyGuideRegister,
  onGoToCollegeLogin,
  onGoToCollegeRegister,
  onGoToHome,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/students/login",
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
        setMessage(data.message || "Login successful!");

        setTimeout(() => {
          onLogin(data.student);
        }, 1000);
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  };

  const handleStudentClick = () => {
    setSelectedRole("student");
  };

  return (
    <div className="login-page">

      {/* Background decorations */}
      <div className="login-decoration login-decoration-one"></div>
      <div className="login-decoration login-decoration-two"></div>
      <div className="login-decoration login-decoration-three"></div>

      {/* =====================================================
          ROLE SELECTION
          ===================================================== */}

      {!selectedRole ? (
        <div className="login-wrapper">

          <div className="login-brand">
            <div className="brand-mark">I</div>
            <span>InternLink</span>
          </div>

          <div className="role-selection">

            <div className="login-heading">

              <span className="welcome-badge">
                Internship Management Platform
              </span>

              <h1>
                Welcome to <span>InternLink</span>
              </h1>

              <p>
                One platform connecting students, colleges,
                faculty and companies through the FYUGP internship journey.
              </p>

            </div>

            <div className="role-question">
              <h2>How would you like to continue?</h2>
              <p>Select your role to access your portal</p>
            </div>

            <div className="role-grid">

              <button
                type="button"
                className="role-card student-card"
                onClick={handleStudentClick}
              >
                <div className="role-icon">🎓</div>

                <div className="role-content">
                  <h3>Student</h3>
                  <p>
                    Find internships, apply, maintain your logbook
                    and manage your internship journey.
                  </p>
                </div>

                <span className="role-arrow">→</span>
              </button>

              <button
                type="button"
                className="role-card company-card"
                onClick={onGoToCompanyLogin}
              >
                <div className="role-icon">🏢</div>

                <div className="role-content">
                  <h3>Company</h3>
                  <p>
                    Post internship opportunities and manage
                    student applications.
                  </p>
                </div>

                <span className="role-arrow">→</span>
              </button>

              <button
                type="button"
                className="role-card faculty-card"
                onClick={onGoToFacultyLogin}
              >
                <div className="role-icon">👨‍🏫</div>

                <div className="role-content">
                  <h3>Faculty</h3>
                  <p>
                    Guide students, review logbooks and monitor
                    internship progress.
                  </p>
                </div>

                <span className="role-arrow">→</span>
              </button>

              <button
                type="button"
                className="role-card guide-card"
                onClick={onGoToCompanyGuideLogin}
              >
                <div className="role-icon">👤</div>

                <div className="role-content">
                  <h3>Company Guide</h3>
                  <p>
                    Supervise assigned interns and review
                    their internship activities.
                  </p>
                </div>

                <span className="role-arrow">→</span>
              </button>

              <button
                type="button"
                className="role-card college-card"
                onClick={onGoToCollegeLogin}
              >
                <div className="role-icon">🏫</div>

                <div className="role-content">
                  <h3>College</h3>
                  <p>
                    Manage college internship activities and
                    student coordination.
                  </p>
                </div>

                <span className="role-arrow">→</span>
              </button>

              <button
                type="button"
                className="role-card admin-card"
                onClick={onGoToAdminLogin}
              >
                <div className="role-icon">⚙️</div>

                <div className="role-content">
                  <h3>Administrator</h3>
                  <p>
                    Manage the platform, institutions, companies
                    and internship opportunities.
                  </p>
                </div>

                <span className="role-arrow">→</span>
              </button>

            </div>

            <div className="login-bottom-links">

              <p>
                New student?
                <span onClick={onGoToRegister}>
                  Create a student account
                </span>
              </p>

              <p>
                Company Guide?
                <span onClick={onGoToCompanyGuideRegister}>
                  Register as Company Guide
                </span>
              </p>

              <p>
                College?
                <span onClick={onGoToCollegeRegister}>
                  Register your college
                </span>
              </p>

            </div>

            <button
              type="button"
              className="back-home-button"
              onClick={onGoToHome}
            >
              ← Back
            </button>

          </div>
        </div>

      ) : (

        /* =====================================================
           STUDENT LOGIN
           ===================================================== */

        <div className="student-login-page">

          {/* Background */}
          <div className="student-bg student-bg-one"></div>
          <div className="student-bg student-bg-two"></div>
          <div className="student-bg student-bg-three"></div>

          <div className="student-login-wrapper">

            {/* Top bar */}
            <div className="student-topbar">

              <div className="student-brand">

                <div className="student-brand-icon">
                  I
                </div>

                <span>InternLink</span>

              </div>

              <button
                type="button"
                className="student-role-back"
                onClick={() => setSelectedRole(null)}
              >
                ← Choose another role
              </button>

            </div>

            {/* Main section */}
            <div className="student-login-content">

              {/* =================================================
                  LEFT SIDE — STUDENT JOURNEY
                  ================================================= */}

              <div className="student-story">

                <div className="student-story-badge">
                  <span></span>
                  FYUGP Student Network
                </div>

                <h1>
                  Your internship
                  <br />
                  <span>starts here.</span>
                </h1>

                <p className="student-story-description">
                  Discover opportunities, connect with companies,
                  build experience and complete your FYUGP internship
                  journey with InternLink.
                </p>

                {/* Student illustration */}
                <div className="student-illustration">

                  {/* Journey path */}
                  <div className="journey-path"></div>

                  <div className="journey-dot journey-dot-one">
                    01
                  </div>

                  <div className="journey-dot journey-dot-two">
                    02
                  </div>

                  <div className="journey-dot journey-dot-three">
                    03
                  </div>

                  {/* Student */}
                  <div className="main-student">

                    <div className="main-student-head"></div>

                    <div className="main-student-hair"></div>

                    <div className="main-student-body">

                      <div className="student-body-logo">
                        I
                      </div>

                    </div>

                    <div className="main-student-leg left-leg"></div>
                    <div className="main-student-leg right-leg"></div>

                  </div>

                  {/* Opportunity card */}
                  <div className="opportunity-card">

                    <div className="opportunity-icon">
                      ✦
                    </div>

                    <div>
                      <strong>New opportunity</strong>
                      <small>Software Development</small>
                    </div>

                  </div>

                  {/* Application card */}
                  <div className="application-card">

                    <div className="application-check">
                      ✓
                    </div>

                    <div>
                      <strong>Application sent</strong>
                      <small>Company received your profile</small>
                    </div>

                  </div>

                  {/* Certificate */}
                  <div className="certificate-card">

                    <div className="certificate-icon">
                      ◇
                    </div>

                    <span>Certificate</span>

                  </div>

                  {/* Floating elements */}
                  <span className="student-floating-star star-one">
                    ✦
                  </span>

                  <span className="student-floating-star star-two">
                    ·
                  </span>

                  <span className="student-floating-star star-three">
                    +
                  </span>

                </div>

                {/* Journey steps */}
                <div className="student-journey">

                  <div>
                    <span>01</span>
                    <p>Discover</p>
                  </div>

                  <div>
                    <span>02</span>
                    <p>Experience</p>
                  </div>

                  <div>
                    <span>03</span>
                    <p>Grow</p>
                  </div>

                </div>

              </div>

              {/* =================================================
                  RIGHT SIDE — LOGIN FORM
                  ================================================= */}

              <div className="student-login-area">

                <div className="student-login-card">

                  <div className="student-login-icon">
                    🎓
                  </div>

                  <div className="student-login-heading">

                    <span>Student Portal</span>

                    <h2>Welcome back</h2>

                    <p>
                      Continue your internship journey
                      with InternLink.
                    </p>

                  </div>

                  <form onSubmit={handleLogin}>

                    <div className="student-form-group">

                      <label>Email</label>

                      <div className="student-input-wrapper">

                        <span className="student-input-icon">
                          @
                        </span>

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

                    </div>

                    <div className="student-form-group">

                      <label>Password</label>

                      <div className="student-input-wrapper">

                        <span className="student-input-icon">
                          •
                        </span>

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

                    </div>

                    <button
                      type="submit"
                      className="student-login-button"
                    >
                      <span>Continue to Student Portal</span>
                      <strong>→</strong>
                    </button>

                  </form>

                  {message && (
                    <p className="student-success-message">
                      {message}
                    </p>
                  )}

                  {error && (
                    <p className="student-error-message">
                      {error}
                    </p>
                  )}

                  <div className="student-register-area">

                    <p>
                      New to InternLink?
                    </p>

                    <button
                      type="button"
                      className="student-register-button"
                      onClick={onGoToRegister}
                    >
                      Create your student account
                      <span>→</span>
                    </button>

                  </div>

                </div>

                <p className="student-security-note">
                  🔒 Your student information is securely handled
                  by InternLink.
                </p>

              </div>

            </div>

            <button
              type="button"
              className="student-bottom-back"
              onClick={() => setSelectedRole(null)}
            >
              ← Back to InternLink
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Login;

