import { useState } from "react";
import "../css/Signup.css";

function CollegeRegister({ onSuccess, onBack }) {
  const [formData, setFormData] = useState({
    collegeName: "",
    collegeCode: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    website: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/colleges/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          data.message ||
            "College registration submitted successfully!"
        );

        setFormData({
          collegeName: "",
          collegeCode: "",
          email: "",
          password: "",
          phone: "",
          location: "",
          website: "",
        });

        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(
          data.message || "College registration failed"
        );
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="signup-page college-signup">

      {/* Decorative background */}
      <div className="signup-orbit signup-orbit-one"></div>
      <div className="signup-orbit signup-orbit-two"></div>

      {/* Top Back Button */}
      <button
        type="button"
        className="signup-back-button"
        onClick={onBack}
      >
        ← Back to Login
      </button>

      <div className="signup-shell">

        {/* =================================================
            LEFT SIDE
            ================================================= */}

        <div className="signup-visual">

          <div className="signup-visual-badge">
            <span>✦</span>
            FYUGP College Network
          </div>

          <h1>
            Connect your
            <br />
            <span>college to opportunity.</span>
          </h1>

          <p className="signup-visual-text">
            Bring your institution into the InterLink
            internship ecosystem and help students
            discover structured workplace experiences.
          </p>

          {/* College Illustration */}
          <div className="college-illustration">

            {/* Building */}
            <div className="college-building">

              <div className="college-roof">
                <span></span>
              </div>

              <div className="college-main-building">

                <div className="college-name-board">
                  <span>INTERLINK</span>
                  <strong>COLLEGE</strong>
                </div>

                <div className="college-columns">

                  <div className="college-column">
                    <span></span>
                    <span></span>
                  </div>

                  <div className="college-column">
                    <span></span>
                    <span></span>
                  </div>

                  <div className="college-column">
                    <span></span>
                    <span></span>
                  </div>

                  <div className="college-column">
                    <span></span>
                    <span></span>
                  </div>

                </div>

                <div className="college-entrance">
                  <div></div>
                </div>

              </div>

            </div>

            {/* Floating cards */}
            <div className="college-floating-card college-card-one">
              <span>🎓</span>
              <div>
                <strong>Students</strong>
                <small>Connected</small>
              </div>
            </div>

            <div className="college-floating-card college-card-two">
              <span>✓</span>
              <div>
                <strong>FYUGP</strong>
                <small>Internships</small>
              </div>
            </div>

            <div className="college-floating-card college-card-three">
              <span>✦</span>
              <div>
                <strong>2 Credits</strong>
                <small>Internship</small>
              </div>
            </div>

            {/* Decorative dots */}
            <span className="college-dot college-dot-one"></span>
            <span className="college-dot college-dot-two"></span>
            <span className="college-dot college-dot-three"></span>

          </div>

          <div className="signup-visual-footer">
            <span>INTERLINK</span>
            <span>FYUGP Internship Management Platform</span>
          </div>

        </div>

        {/* =================================================
            RIGHT SIDE
            ================================================= */}

        <div className="signup-form-area">

          <div className="signup-form-header">

            <span className="signup-small-label">
              COLLEGE REGISTRATION
            </span>

            <h2>Register your institution</h2>

            <p>
              Create your college account to participate
              in the InterLink internship network.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="signup-form"
          >

            {/* College Name */}
            <div className="signup-field">

              <label>College Name</label>

              <div className="signup-input-wrap">

                <span className="signup-input-icon">
                  🏫
                </span>

                <input
                  type="text"
                  name="collegeName"
                  placeholder="Enter college name"
                  value={formData.collegeName}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* College Code */}
            <div className="signup-field">

              <label>College Code</label>

              <div className="signup-input-wrap">

                <span className="signup-input-icon">
                  #
                </span>

                <input
                  type="text"
                  name="collegeCode"
                  placeholder="Enter college code"
                  value={formData.collegeCode}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Email */}
            <div className="signup-field">

              <label>College Email</label>

              <div className="signup-input-wrap">

                <span className="signup-input-icon">
                  @
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter college email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Password */}
            <div className="signup-field">

              <label>Password</label>

              <div className="signup-input-wrap">

                <span className="signup-input-icon">
                  ◈
                </span>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Phone */}
            <div className="signup-field">

              <label>Phone Number</label>

              <div className="signup-input-wrap">

                <span className="signup-input-icon">
                  ☎
                </span>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter college phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Location */}
            <div className="signup-field">

              <label>College Location</label>

              <div className="signup-input-wrap">

                <span className="signup-input-icon">
                  ◉
                </span>

                <input
                  type="text"
                  name="location"
                  placeholder="Enter college location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Website */}
            <div className="signup-field signup-full-field">

              <label>
                College Website
                <span className="signup-optional">
                  Optional
                </span>
              </label>

              <div className="signup-input-wrap">

                <span className="signup-input-icon">
                  ↗
                </span>

                <input
                  type="url"
                  name="website"
                  placeholder="https://yourcollege.edu"
                  value={formData.website}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* Messages */}

            {message && (
              <div className="signup-message signup-success">
                <span>✓</span>
                {message}
              </div>
            )}

            {error && (
              <div className="signup-message signup-error">
                <span>!</span>
                {error}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              className="signup-submit"
            >
              <span>Register College</span>
              <span className="signup-submit-arrow">
                →
              </span>
            </button>

          </form>

          {/* Bottom Back */}

          <div className="signup-login-footer">

            <span>Already have a college account?</span>

            <button
              type="button"
              onClick={onBack}
            >
              Back to Login →
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default CollegeRegister;

