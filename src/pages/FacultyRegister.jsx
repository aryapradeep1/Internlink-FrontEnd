import { useEffect, useState } from "react";
import "../css/Signup.css";

function FacultyRegister({ onRegisterSuccess, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [college, setCollege] = useState("");

  const [colleges, setColleges] = useState([]);
  const [message, setMessage] = useState("");

  // ==========================================
  // GET APPROVED COLLEGES
  // ==========================================

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/colleges"
        );

        const data = await response.json();

        if (response.ok) {
          const approvedColleges = data.colleges.filter(
            (college) => college.status === "Approved"
          );

          setColleges(approvedColleges);
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };

    fetchColleges();
  }, []);

  // ==========================================
  // FACULTY REGISTRATION
  // ==========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!college) {
      setMessage("Please select your college");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/faculty/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            department,
            phone,
            designation,
            college,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(
          "Registration successful! Your account is waiting for college approval."
        );

        setTimeout(() => {
          onRegisterSuccess();
        }, 1500);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="signup-page faculty-signup-page">

      {/* ==========================================
          LEFT SIDE
          ========================================== */}

      <div className="signup-visual faculty-signup-visual">

        <button
          type="button"
          className="signup-back-button"
          onClick={onBackToLogin}
        >
          ← Back to Faculty Login
        </button>

        <div className="signup-visual-content">

          <div className="signup-badge">
            👨‍🏫 <span>FACULTY GUIDE</span>
          </div>

          <h1>
            Guide students
            <br />
            <span>towards experience.</span>
          </h1>

          <p>
            Join InterLink as a faculty guide and help students
            navigate their internship journey from application
            to completion.
          </p>

          {/* Faculty Illustration */}

          <div className="faculty-illustration">

            <div className="faculty-board">
              <div className="board-heading">
                INTERNSHIP JOURNEY
              </div>

              <div className="board-line">
                <span>✓</span>
                Application
              </div>

              <div className="board-line">
                <span>✓</span>
                Approval
              </div>

              <div className="board-line active">
                <span>●</span>
                Guidance
              </div>

              <div className="board-line">
                <span>○</span>
                Completion
              </div>
            </div>

            <div className="faculty-person">
              <div className="faculty-head">
                <div className="faculty-hair"></div>
              </div>

              <div className="faculty-body"></div>

              <div className="faculty-arm"></div>
            </div>

            <div className="faculty-student student-left">
              <div className="student-head"></div>
              <div className="student-body"></div>
            </div>

            <div className="faculty-student student-right">
              <div className="student-head"></div>
              <div className="student-body"></div>
            </div>

            <div className="faculty-floating-card">
              <span>🎓</span>

              <div>
                <strong>Student Progress</strong>
                <small>Guidance in progress</small>
              </div>
            </div>

          </div>

          <div className="faculty-guide-points">

            <div>
              <span>01</span>
              <strong>Guide</strong>
              <small>Support students</small>
            </div>

            <div>
              <span>02</span>
              <strong>Monitor</strong>
              <small>Review progress</small>
            </div>

            <div>
              <span>03</span>
              <strong>Approve</strong>
              <small>Complete the journey</small>
            </div>

          </div>

        </div>
      </div>

      {/* ==========================================
          RIGHT SIDE
          ========================================== */}

      <div className="signup-form-section">

        <div className="signup-form-card">

          <div className="signup-form-header">

            <div className="signup-form-icon">
              👨‍🏫
            </div>

            <div>
              <span className="signup-form-label">
                FACULTY REGISTRATION
              </span>

              <h2>Become a Faculty Guide</h2>

              <p>
                Create your faculty account and support students
                throughout their internship journey.
              </p>
            </div>

          </div>

          <form onSubmit={handleRegister}>

            {/* NAME */}

            <div className="signup-field">
              <label>Name</label>

              <div className="signup-input-wrapper">
                <span>👤</span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="signup-field">
              <label>Email</label>

              <div className="signup-input-wrapper">
                <span>✉️</span>

                <input
                  type="email"
                  placeholder="faculty@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="signup-field">
              <label>Password</label>

              <div className="signup-input-wrapper">
                <span>🔒</span>

                <input
                  type="password"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* COLLEGE */}

            <div className="signup-field">
              <label>College</label>

              <div className="signup-input-wrapper">
                <span>🏫</span>

                <select
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  required
                >
                  <option value="">
                    Select your college
                  </option>

                  {colleges.map((collegeItem) => (
                    <option
                      key={collegeItem._id}
                      value={collegeItem._id}
                    >
                      {collegeItem.collegeName} (
                      {collegeItem.collegeCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DEPARTMENT */}

            <div className="signup-field">
              <label>Department</label>

              <div className="signup-input-wrapper">
                <span>📚</span>

                <input
                  type="text"
                  placeholder="Example: MCA"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PHONE */}

            <div className="signup-field">
              <label>Phone</label>

              <div className="signup-input-wrapper">
                <span>📱</span>

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* DESIGNATION */}

            <div className="signup-field">
              <label>Designation</label>

              <div className="signup-input-wrapper">
                <span>💼</span>

                <input
                  type="text"
                  placeholder="Example: Assistant Professor"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="signup-submit-button"
            >
              <span>Register as Faculty</span>
              <span>→</span>
            </button>

          </form>

          {message && (
            <div className="signup-message">
              {message}
            </div>
          )}

          <div className="signup-login-footer">

            <span>Already have an account?</span>

            <button
              type="button"
              onClick={onBackToLogin}
            >
              Back to Faculty Login →
            </button>

          </div>

          <div className="signup-approval-note">
            <span>✓</span>

            <p>
              Your account will remain pending until your college
              approves your faculty registration.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default FacultyRegister;