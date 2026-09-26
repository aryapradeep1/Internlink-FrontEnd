import { useState } from "react";
import "../css/Signup.css";

function CompanyRegister({ onBack, onLogin }) {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    description: "",
    location: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/companies/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(
          "Registration submitted successfully! Please wait for admin approval."
        );

        setFormData({
          companyName: "",
          email: "",
          password: "",
          description: "",
          location: "",
        });
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="signup-page company-signup-page">

      {/* LEFT SIDE */}
      <div className="signup-visual company-signup-visual">

        <button
          type="button"
          className="signup-back-button"
          onClick={onBack}
        >
          ← Back to Company Login
        </button>

        <div className="signup-visual-content">

          <div className="signup-badge">
            🏢 <span>COMPANY PARTNER</span>
          </div>

          <h1>
            Build the next
            <br />
            <span>generation of talent.</span>
          </h1>

          <p>
            Connect your organization with talented FYUGP students
            and create meaningful internship opportunities through
            InterLink.
          </p>

          {/* Company Illustration */}
          <div className="company-illustration">

            <div className="company-building">
              <div className="building-top"></div>

              <div className="building-body">
                <div className="building-window"></div>
                <div className="building-window"></div>
                <div className="building-window"></div>
                <div className="building-window"></div>

                <div className="building-door"></div>
              </div>

              <div className="building-sign">
                INTERLINK
              </div>
            </div>

            <div className="company-person person-one">
              <div className="person-head"></div>
              <div className="person-body"></div>
            </div>

            <div className="company-person person-two">
              <div className="person-head"></div>
              <div className="person-body"></div>
            </div>

            <div className="floating-company-card card-opportunity">
              <span>✨</span>
              <div>
                <strong>New Talent</strong>
                <small>Internship opportunity</small>
              </div>
            </div>

            <div className="floating-company-card card-student">
              <span>🎓</span>
              <div>
                <strong>FYUGP Students</strong>
                <small>Ready to learn</small>
              </div>
            </div>

          </div>

          <div className="signup-benefits">

            <div className="signup-benefit">
              <span>01</span>
              <div>
                <strong>Create Opportunities</strong>
                <small>Post internships for students</small>
              </div>
            </div>

            <div className="signup-benefit">
              <span>02</span>
              <div>
                <strong>Discover Talent</strong>
                <small>Connect with suitable students</small>
              </div>
            </div>

            <div className="signup-benefit">
              <span>03</span>
              <div>
                <strong>Build Futures</strong>
                <small>Support practical learning</small>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="signup-form-section">

        <div className="signup-form-card">

          <div className="signup-form-header">

            <div className="signup-form-icon">
              🏢
            </div>

            <div>
              <span className="signup-form-label">
                COMPANY REGISTRATION
              </span>

              <h2>Join InterLink</h2>

              <p>
                Register your organization to offer internship
                opportunities to students.
              </p>
            </div>

          </div>

          <form onSubmit={handleRegister}>

            <div className="signup-field">
              <label>Company Name</label>

              <div className="signup-input-wrapper">
                <span>🏢</span>

                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="signup-field">
              <label>Official Company Email</label>

              <div className="signup-input-wrapper">
                <span>✉️</span>

                <input
                  type="email"
                  name="email"
                  placeholder="company@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="signup-field">
              <label>Password</label>

              <div className="signup-input-wrapper">
                <span>🔒</span>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="signup-field">
              <label>Company Description</label>

              <div className="signup-input-wrapper signup-textarea-wrapper">
                <span>📝</span>

                <textarea
                  name="description"
                  placeholder="Tell students about your organization..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="signup-field">
              <label>Company Location</label>

              <div className="signup-input-wrapper">
                <span>📍</span>

                <input
                  type="text"
                  name="location"
                  placeholder="City, Kerala"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="signup-submit-button"
            >
              <span>Register Company</span>
              <span>→</span>
            </button>

          </form>

          {message && (
            <div className="signup-message">
              {message}
            </div>
          )}

          <div className="signup-login-footer">

            <span>Already registered?</span>

            <button
              type="button"
              onClick={onLogin}
            >
              Back to Company Login →
            </button>

          </div>

          <div className="signup-approval-note">
            <span>✓</span>
            <p>
              Your company account will be reviewed by an administrator
              before you can log in.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default CompanyRegister;