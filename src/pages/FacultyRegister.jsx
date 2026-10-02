import { useEffect, useState } from "react";
import "../css/Signup.css";

function FacultyRegister({ onRegisterSuccess, onBackToLogin }) {
  // ==========================================
  // BASIC FACULTY DETAILS
  // ==========================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [college, setCollege] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // ==========================================
  // COLLEGES
  // ==========================================

  const [colleges, setColleges] = useState([]);

  // ==========================================
  // VERIFICATION STATE
  // ==========================================

  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [registering, setRegistering] = useState(false);

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
  // VERIFY FACULTY
  // ==========================================

  const handleVerifyFaculty = async () => {
    setMessage("");

    if (!name.trim()) {
      setMessage("Please enter your name");
      return;
    }

    if (!college) {
      setMessage("Please select your college");
      return;
    }

    if (!department.trim()) {
      setMessage("Please enter your department");
      return;
    }

    if (!verificationCode.trim()) {
      setMessage("Please enter your verification code");
      return;
    }

    try {
      setVerifying(true);

      const response = await fetch(
        "http://localhost:5000/api/faculty/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            college,
            department,
            verificationCode,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setVerified(true);

        // Use verified information returned by backend
        if (data.faculty) {
          if (data.faculty.name) {
            setName(data.faculty.name);
          }

          if (data.faculty.department) {
            setDepartment(data.faculty.department);
          }

          if (data.faculty.college) {
            setCollege(data.faculty.college);
          }
        }

        setMessage(
          "✓ Faculty verified successfully. You can now complete your registration."
        );
      } else {
        setVerified(false);

        setMessage(
          data.message || "Faculty verification failed"
        );
      }
    } catch (error) {
      console.error("Faculty verification error:", error);

      setVerified(false);
      setMessage("Unable to connect to server");
    } finally {
      setVerifying(false);
    }
  };

  // ==========================================
  // FACULTY REGISTRATION
  // ==========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!verified) {
      setMessage("Please verify your faculty details first");
      return;
    }

    if (!email.trim()) {
      setMessage("Please enter your email");
      return;
    }

    if (!phone.trim()) {
      setMessage("Please enter your phone number");
      return;
    }

    if (!designation.trim()) {
      setMessage("Please enter your designation");
      return;
    }

    if (!password.trim()) {
      setMessage("Please enter your password");
      return;
    }

    try {
      setRegistering(true);

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
            verificationCode,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(
          "Registration successful! Your faculty account has been approved."
        );

        setTimeout(() => {
          onRegisterSuccess();
        }, 1500);
      } else {
        setMessage(
          data.message || "Registration failed"
        );
      }
    } catch (error) {
      console.error("Faculty registration error:", error);

      setMessage("Unable to connect to server");
    } finally {
      setRegistering(false);
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
                Verify your faculty details and create your
                account to support students throughout their
                internship journey.
              </p>

            </div>

          </div>

          <form onSubmit={handleRegister}>

            {/* ==========================================
                VERIFICATION SECTION
                ========================================== */}

            <div className="signup-section-title">
              <span>1</span>
              <div>
                <strong>Faculty Verification</strong>
                <small>
                  Verify your details using the college verification code.
                </small>
              </div>
            </div>

            {/* NAME */}

            <div className="signup-field">

              <label>Name</label>

              <div className="signup-input-wrapper">

                <span>👤</span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setVerified(false);
                  }}
                  disabled={verified}
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
                  onChange={(e) => {
                    setCollege(e.target.value);
                    setVerified(false);
                  }}
                  disabled={verified}
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
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setVerified(false);
                  }}
                  disabled={verified}
                  required
                />

              </div>

            </div>

            {/* VERIFICATION CODE */}

            <div className="signup-field">

              <label>Verification Code</label>

              <div className="signup-input-wrapper">

                <span>🔑</span>

                <input
                  type="text"
                  placeholder="Enter your college verification code"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    setVerified(false);
                  }}
                  disabled={verified}
                  required
                />

              </div>

            </div>

            {/* VERIFY BUTTON */}

            {!verified && (

              <button
                type="button"
                className="signup-submit-button"
                onClick={handleVerifyFaculty}
                disabled={verifying}
              >

                <span>
                  {verifying
                    ? "Verifying..."
                    : "Verify Faculty"}
                </span>

                <span>✓</span>

              </button>

            )}

            {/* VERIFIED MESSAGE */}

            {verified && (

              <div className="signup-verification-success">

                <span>✓</span>

                <div>

                  <strong>
                    Faculty verified successfully
                  </strong>

                  <small>
                    Your college verification is complete.
                    You can now create your faculty account.
                  </small>

                </div>

              </div>

            )}

            {/* ==========================================
                REGISTRATION SECTION
                ========================================== */}

            {verified && (

              <>

                <div className="signup-section-title">

                  <span>2</span>

                  <div>

                    <strong>
                      Complete Registration
                    </strong>

                    <small>
                      Enter your account details below.
                    </small>

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
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
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
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
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
                      onChange={(e) =>
                        setDesignation(e.target.value)
                      }
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
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                    />

                  </div>

                </div>

                {/* REGISTER */}

                <button
                  type="submit"
                  className="signup-submit-button"
                  disabled={registering}
                >

                  <span>
                    {registering
                      ? "Creating Account..."
                      : "Register as Faculty"}
                  </span>

                  <span>→</span>

                </button>

              </>

            )}

          </form>

          {/* MESSAGE */}

          {message && (

            <div
              className={
                verified
                  ? "signup-message signup-success-message"
                  : "signup-message"
              }
            >
              {message}
            </div>

          )}

          {/* LOGIN FOOTER */}

          <div className="signup-login-footer">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={onBackToLogin}
            >
              Back to Faculty Login →
            </button>

          </div>

          {/* APPROVAL NOTE */}

          <div className="signup-approval-note">

            <span>✓</span>

            <p>
              Faculty accounts are automatically approved after
              successful verification using the college-provided
              verification code.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default FacultyRegister;