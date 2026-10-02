import { useEffect, useState } from "react";
import "../css/Signup.css";

function Register({ onRegisterSuccess, onGoToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    registerNumber: "",
    semester: "",
    phone: "",
    college: "",
    verificationCode: "",
  });

  const [colleges, setColleges] = useState([]);

  const [message, setMessage] = useState("");

  const [isVerified, setIsVerified] = useState(false);

  const [verificationData, setVerificationData] = useState({
    department: "",
    assignedFacultyName: "",
  });

  const [isVerifying, setIsVerifying] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);

  // ======================================================
  // FETCH APPROVED COLLEGES
  // ======================================================

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
        console.error("Fetch colleges error:", error);
        setMessage("Unable to load colleges");
      }
    };

    fetchColleges();
  }, []);

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (
      isVerified &&
      (
        name === "name" ||
        name === "college" ||
        name === "registerNumber" ||
        name === "verificationCode"
      )
    ) {
      setIsVerified(false);

      setVerificationData({
        department: "",
        assignedFacultyName: "",
      });

      setMessage("");
    }
  };

  // ======================================================
  // VERIFY STUDENT
  // ======================================================

  const handleVerifyStudent = async () => {
    setMessage("");

    if (!formData.name.trim()) {
      setMessage("Please enter your full name");
      return;
    }

    if (!formData.college) {
      setMessage("Please select your college");
      return;
    }

    if (!formData.registerNumber.trim()) {
      setMessage("Please enter your register number");
      return;
    }

    if (!formData.verificationCode.trim()) {
      setMessage("Please enter your verification code");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/students/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            college: formData.college,
            registerNumber:
              formData.registerNumber.trim(),
            verificationCode:
              formData.verificationCode.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setIsVerified(true);

        setVerificationData({
          department: data.student.department,
          assignedFacultyName:
            data.student.assignedFacultyName,
        });

        setMessage(
          "Student verified successfully. You can now complete your registration."
        );
      } else {
        setIsVerified(false);

        setVerificationData({
          department: "",
          assignedFacultyName: "",
        });

        setMessage(
          data.message || "Student verification failed"
        );
      }
    } catch (error) {
      console.error("Student verification error:", error);

      setIsVerified(false);

      setMessage("Unable to connect to server");
    } finally {
      setIsVerifying(false);
    }
  };

  // ======================================================
  // STUDENT REGISTRATION
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!isVerified) {
      setMessage(
        "Please verify your student details first"
      );
      return;
    }

    if (!formData.email.trim()) {
      setMessage("Please enter your email");
      return;
    }

    if (!formData.password) {
      setMessage("Please enter your password");
      return;
    }

    if (!formData.semester) {
      setMessage("Please enter your semester");
      return;
    }

    if (!formData.phone.trim()) {
      setMessage("Please enter your phone number");
      return;
    }

    setIsRegistering(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/students/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            registerNumber:
              formData.registerNumber,
            semester: Number(formData.semester),
            phone: formData.phone,
            college: formData.college,
            verificationCode:
              formData.verificationCode,
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
          semester: "",
          phone: "",
          college: "",
          verificationCode: "",
        });

        setVerificationData({
          department: "",
          assignedFacultyName: "",
        });

        setIsVerified(false);

        setTimeout(() => {
          onRegisterSuccess();
        }, 1000);
      } else {
        setMessage(
          data.message || "Registration failed"
        );
      }
    } catch (error) {
      console.error("Student registration error:", error);

      setMessage("Unable to connect to server");
    } finally {
      setIsRegistering(false);
    }
  };

  // ======================================================
  // RESET VERIFICATION
  // ======================================================

  const handleChangeVerification = () => {
    setIsVerified(false);

    setVerificationData({
      department: "",
      assignedFacultyName: "",
    });

    setMessage("");
  };

  return (
    <div className="student-signup-page">

      <div className="signup-orb signup-orb-one"></div>
      <div className="signup-orb signup-orb-two"></div>
      <div className="signup-dots"></div>

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
            Create your InterLink account and take the
            first step toward discovering internship
            opportunities, gaining real-world experience,
            and building your future.
          </p>

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

        <section className="signup-form-area">

          <div className="signup-card">

            <div className="signup-card-header">

              <div>
                <p className="signup-small-label">
                  CREATE ACCOUNT
                </p>

                <h2>Welcome to InterLink</h2>

                <p>
                  Verify your college details and
                  create your student account.
                </p>
              </div>

              <div className="signup-student-icon">
                🎓
              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="student-signup-form"
            >

              <div className="signup-section-title">
                <span>1</span>

                <div>
                  <strong>Student Verification</strong>
                  <small>
                    Enter the details provided by your college
                  </small>
                </div>
              </div>

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
                    disabled={isVerified}
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
                    disabled={isVerified}
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
                    disabled={isVerified}
                    required
                  >
                    <option value="">
                      Select your college
                    </option>

                    {colleges.map((college) => (
                      <option
                        key={college._id}
                        value={college._id}
                      >
                        {college.collegeName} (
                        {college.collegeCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="signup-field">
                <label>Verification Code</label>

                <div className="signup-input-wrap">
                  <span>🔑</span>

                  <input
                    type="text"
                    name="verificationCode"
                    placeholder="Enter verification code"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    disabled={isVerified}
                    required
                  />
                </div>
              </div>

              {!isVerified ? (
                <button
                  type="button"
                  className="student-signup-button"
                  onClick={handleVerifyStudent}
                  disabled={isVerifying}
                >
                  <span>
                    {isVerifying
                      ? "Verifying..."
                      : "Verify Student"}
                  </span>

                  <span className="signup-button-arrow">
                    →
                  </span>
                </button>
              ) : (
                <div className="verification-success-box">

                  <div className="verification-success-icon">
                    ✓
                  </div>

                  <div>
                    <strong>
                      Student Verified
                    </strong>

                    <small>
                      Your college verification details
                      are valid.
                    </small>
                  </div>

                  <button
                    type="button"
                    onClick={handleChangeVerification}
                  >
                    Change
                  </button>

                </div>
              )}

              {isVerified && (
                <>
                  <div className="signup-section-title">
                    <span>2</span>

                    <div>
                      <strong>
                        College Information
                      </strong>

                      <small>
                        These details were provided by your college
                      </small>
                    </div>
                  </div>

                  <div className="signup-field">
                    <label>Department</label>

                    <div className="signup-input-wrap">
                      <span>◈</span>

                      <input
                        type="text"
                        value={
                          verificationData.department
                        }
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="signup-field">
                    <label>
                      Assigned Faculty
                    </label>

                    <div className="signup-input-wrap">
                      <span>👨‍🏫</span>

                      <input
                        type="text"
                        value={
                          verificationData.assignedFacultyName
                        }
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="signup-section-title">
                    <span>3</span>

                    <div>
                      <strong>
                        Account Details
                      </strong>

                      <small>
                        Complete your account information
                      </small>
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
                    <label>Semester</label>

                    <div className="signup-input-wrap">
                      <span>⌘</span>

                      <input
                        type="number"
                        name="semester"
                        placeholder="e.g. 3"
                        min="1"
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

                  <button
                    type="submit"
                    className="student-signup-button"
                    disabled={isRegistering}
                  >
                    <span>
                      {isRegistering
                        ? "Creating Account..."
                        : "Create Student Account"}
                    </span>

                    <span className="signup-button-arrow">
                      →
                    </span>
                  </button>
                </>
              )}

            </form>

            {message && (
              <div
                className={`signup-message ${
                  message
                    .toLowerCase()
                    .includes("success")
                    ? "signup-success"
                    : "signup-error"
                }`}
              >
                <span>
                  {message
                    .toLowerCase()
                    .includes("success")
                    ? "✓"
                    : "!"}
                </span>

                {message}
              </div>
            )}

            <div className="signup-login-footer">

              <span>
                Already have an account?
              </span>

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