import { useEffect, useState } from "react";
import "../css/Signup.css";

function Register({ onRegisterSuccess, onGoToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    registerNumber: "",
    department: "",
    semester: "",
    phone: "",
    college: "",
  });

  const [colleges, setColleges] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch approved colleges
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/colleges"
        );

        const data = await response.json();

        if (response.ok && data.status === "success") {
          const approvedColleges = data.colleges.filter(
            (college) => college.status === "Approved"
          );

          setColleges(approvedColleges);
        } else {
          setMessage("Failed to load colleges");
        }
      } catch (error) {
        console.error(error);
        setMessage("Unable to load colleges");
      }
    };

    fetchColleges();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/students/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            semester: Number(formData.semester),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");

        setFormData({
          name: "",
          email: "",
          password: "",
          registerNumber: "",
          department: "",
          semester: "",
          phone: "",
          college: "",
        });

        setTimeout(() => {
          onRegisterSuccess();
        }, 1000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="student-signup-page">

      {/* Decorative background elements */}
      <div className="signup-orb signup-orb-one"></div>
      <div className="signup-orb signup-orb-two"></div>
      <div className="signup-dots"></div>

      {/* Top bar */}
      <header className="signup-topbar">
        <div className="signup-brand">
          <span className="signup-brand-mark">I</span>
          <span>InterLink</span>
        </div>

        <button
          type="button"
          className="signup-back-button"
          onClick={onGoToLogin}
        >
          ← Back to Login
        </button>
      </header>

      <main className="signup-main">

        {/* LEFT SIDE */}
        <section className="signup-intro">

          <div className="signup-intro-badge">
            <span>✦</span>
            Student Registration
          </div>

          <h1>
            Start your
            <span> internship journey.</span>
          </h1>

          <p className="signup-intro-text">
            Create your InterLink account and take the first step toward
            discovering internship opportunities, gaining real-world
            experience, and building your future.
          </p>

          {/* Journey illustration */}
          <div className="journey-visual">

            <div className="journey-line"></div>

            <div className="journey-step journey-step-one">
              <div className="journey-icon">👤</div>
              <div className="journey-card">
                <strong>Build Profile</strong>
                <small>Tell us about you</small>
              </div>
            </div>

            <div className="journey-step journey-step-two">
              <div className="journey-icon">🔎</div>
              <div className="journey-card">
                <strong>Find Opportunities</strong>
                <small>Explore internships</small>
              </div>
            </div>

            <div className="journey-step journey-step-three">
              <div className="journey-icon">🎓</div>
              <div className="journey-card">
                <strong>Gain Experience</strong>
                <small>Start your journey</small>
              </div>
            </div>

            <div className="journey-floating-card">
              <span className="floating-star">✦</span>
              <div>
                <strong>2 Credits</strong>
                <small>FYUGP Internship</small>
              </div>
            </div>

          </div>

          <div className="signup-benefits">
            <div>
              <span>✓</span>
              <p>Discover internships</p>
            </div>

            <div>
              <span>✓</span>
              <p>Track your progress</p>
            </div>

            <div>
              <span>✓</span>
              <p>Earn your certificate</p>
            </div>
          </div>

        </section>

        {/* RIGHT SIDE */}
        <section className="signup-form-area">

          <div className="signup-card">

            <div className="signup-card-header">
              <div>
                <p className="signup-small-label">CREATE ACCOUNT</p>
                <h2>Welcome to InterLink</h2>
                <p>
                  Enter your details to create your student account.
                </p>
              </div>

              <div className="signup-student-icon">
                🎓
              </div>
            </div>

            <form onSubmit={handleSubmit} className="student-signup-form">

              <div className="signup-field full-field">
                <label>Full Name</label>
                <div className="signup-input-wrap">
                  <span>👤</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="signup-field">
                <label>Email Address</label>
                <div className="signup-input-wrap">
                  <span>✉</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="signup-field">
                <label>Password</label>
                <div className="signup-input-wrap">
                  <span>🔒</span>
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

              <div className="signup-field">
                <label>Register Number</label>
                <div className="signup-input-wrap">
                  <span>▣</span>
                  <input
                    type="text"
                    name="registerNumber"
                    placeholder="Your register number"
                    value={formData.registerNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="signup-field">
                <label>Department</label>
                <div className="signup-input-wrap">
                  <span>◈</span>
                  <input
                    type="text"
                    name="department"
                    placeholder="e.g. Computer Science"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="signup-field">
                <label>Semester</label>
                <div className="signup-input-wrap">
                  <span>⌘</span>
                  <input
                    type="number"
                    name="semester"
                    placeholder="e.g. 3"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="signup-field">
                <label>Phone Number</label>
                <div className="signup-input-wrap">
                  <span>☎</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="signup-field">
                <label>College</label>
                <div className="signup-input-wrap select-wrap">
                  <span>🏫</span>

                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select your college</option>

                    {colleges.map((college) => (
                      <option
                        key={college._id}
                        value={college._id}
                      >
                        {college.collegeName} ({college.collegeCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="student-signup-button"
              >
                <span>Create Student Account</span>
                <span className="signup-button-arrow">→</span>
              </button>

            </form>

            {message && (
              <div
                className={`signup-message ${
                  message.toLowerCase().includes("successful")
                    ? "signup-success"
                    : "signup-error"
                }`}
              >
                <span>
                  {message.toLowerCase().includes("successful")
                    ? "✓"
                    : "!"}
                </span>
                {message}
              </div>
            )}

            <div className="signup-login-footer">
              <span>Already have an account?</span>

              <button
                type="button"
                onClick={onGoToLogin}
              >
                Login here →
              </button>
            </div>

          </div>

          <p className="signup-footer-note">
            Your internship journey starts with one step.
          </p>

        </section>

      </main>
    </div>
  );
}

export default Register;