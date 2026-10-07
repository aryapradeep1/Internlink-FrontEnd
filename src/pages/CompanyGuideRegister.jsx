import React, { useEffect, useState } from "react";
import "../css/Signup.css";

function CompanyGuideRegister({
  onRegisterSuccess,
  onBack,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [company, setCompany] = useState("");

  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // ======================================================
  // LOAD APPROVED COMPANIES
  // ======================================================

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/companies"
        );

        const data = await response.json();

        if (response.ok) {
          // Only show approved companies
          const approvedCompanies = (
            data.companies || []
          ).filter(
            (item) => item.status === "Approved"
          );

          setCompanies(approvedCompanies);
        } else {
          setError(
            data.message ||
              "Failed to load companies"
          );
        }
      } catch (error) {
        console.error(
          "Fetch Companies Error:",
          error
        );

        setError(
          "Unable to load companies"
        );
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // ======================================================
  // HANDLE REGISTRATION
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !name ||
      !email ||
      !password ||
      !employeeId ||
      !company
    ) {
      setError("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/company-guides/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            employeeId,

            // This is now the Company's MongoDB _id
            company,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(
          data.message ||
            "Company Guide registration successful. Wait for company approval."
        );

        setName("");
        setEmail("");
        setPassword("");
        setEmployeeId("");
        setCompany("");

        setTimeout(() => {
          if (onRegisterSuccess) {
            onRegisterSuccess();
          }
        }, 1500);
      } else {
        setError(
          data.message ||
            "Company Guide registration failed"
        );
      }
    } catch (error) {
      console.error(
        "Company Guide Registration Error:",
        error
      );

      setError(
        "Unable to connect to the server"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="signup-page company-guide-signup">

      {/* Decorative background */}
      <div className="signup-orbit signup-orbit-one"></div>
      <div className="signup-orbit signup-orbit-two"></div>

      {/* Back button */}
      <button
        type="button"
        className="signup-back-button"
        onClick={onBack}
      >
        ← Back to Login
      </button>

      <div className="signup-shell">

        {/* LEFT SIDE */}
        <div className="signup-visual">

          <div className="signup-visual-badge">
            <span>✦</span>
            Company Guide Portal
          </div>

          <h1>
            Mentor the
            <br />
            <span>real experience.</span>
          </h1>

          <p className="signup-visual-text">
            Become a company guide and help students
            turn their internship experience into
            meaningful professional growth.
          </p>

          {/* Illustration */}
          <div className="guide-illustration">

            <div className="guide-window">

              <div className="guide-window-top">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="guide-window-body">

                <div className="guide-person">
                  <div className="guide-head"></div>
                  <div className="guide-body"></div>
                </div>

                <div className="guide-student">
                  <div className="student-head"></div>
                  <div className="student-body"></div>
                </div>

                <div className="guide-message">
                  <span>✓</span>
                  Student Progress
                </div>

                <div className="guide-message guide-message-two">
                  <span>✦</span>
                  Guidance
                </div>

              </div>
            </div>

            <div className="guide-floating-card guide-card-one">
              <strong>60+</strong>
              <small>Hours</small>
            </div>

            <div className="guide-floating-card guide-card-two">
              <strong>2</strong>
              <small>Credits</small>
            </div>

          </div>

          <div className="signup-visual-footer">
            <span>INTERLINK</span>
            <span>Internship Management Platform</span>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="signup-form-area">

          <div className="signup-form-header">
            <span className="signup-small-label">
              COMPANY GUIDE
            </span>

            <h2>Create your guide account</h2>

            <p>
              Register using your company details.
              Your account will be available after
              company approval.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="signup-form"
          >

            {/* NAME */}
            <div className="signup-field">
              <label>Name</label>

              <div className="signup-input-wrap">
                <span className="signup-input-icon">
                  ◯
                </span>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="signup-field">
              <label>Email</label>

              <div className="signup-input-wrap">
                <span className="signup-input-icon">
                  @
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your work email"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="signup-field">
              <label>Password</label>

              <div className="signup-input-wrap">
                <span className="signup-input-icon">
                  ◈
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Minimum 6 characters"
                  minLength="6"
                  required
                />
              </div>
            </div>

            {/* EMPLOYEE ID */}
            <div className="signup-field">
              <label>Employee ID</label>

              <div className="signup-input-wrap">
                <span className="signup-input-icon">
                  #
                </span>

                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) =>
                    setEmployeeId(e.target.value)
                  }
                  placeholder="Enter your employee ID"
                  required
                />
              </div>
            </div>

            {/* COMPANY */}
            <div className="signup-field">
              <label>Company</label>

              <div className="signup-input-wrap">
                <span className="signup-input-icon">
                  ◫
                </span>

                {loadingCompanies ? (
                  <div className="signup-loading">
                    Loading approved companies...
                  </div>
                ) : companies.length === 0 ? (
                  <div className="signup-error-inline">
                    No approved companies available.
                  </div>
                ) : (
                  <select
                    value={company}
                    onChange={(e) =>
                      setCompany(e.target.value)
                    }
                    required
                  >
                    <option value="">
                      Select your company
                    </option>

                    {companies.map((item) => (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {item.companyName}
                      </option>
                    ))}
                  </select>
                )}

              </div>
            </div>

            {/* SUCCESS MESSAGE */}
            {message && (
              <div className="signup-message signup-success">
                <span>✓</span>
                {message}
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="signup-message signup-error">
                <span>!</span>
                {error}
              </div>
            )}

            {/* REGISTER */}
            <button
              type="submit"
              className="signup-submit"
              disabled={
                loading ||
                loadingCompanies ||
                companies.length === 0
              }
            >
              <span>
                {loading
                  ? "Registering..."
                  : "Create Guide Account"}
              </span>

              {!loading && (
                <span className="signup-submit-arrow">
                  →
                </span>
              )}
            </button>

          </form>

          {/* BOTTOM BACK */}
          <div className="signup-login-footer">
            <span>
              Already have a guide account?
            </span>

            <button
              type="button"
              onClick={onBack}
            >
              Back to  Login →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CompanyGuideRegister;

