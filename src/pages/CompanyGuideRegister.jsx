import React, { useEffect, useState } from "react";

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
    <div className="dashboard-container">

      <h1>🧑‍💼 Company Guide Registration</h1>

      <form onSubmit={handleSubmit}>

        <div className="student-info">

          {/* NAME */}

          <label>Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter your name"
            required
          />

          {/* EMAIL */}

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            required
          />

          {/* PASSWORD */}

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter password"
            minLength="6"
            required
          />

          {/* EMPLOYEE ID */}

          <label>Employee ID</label>

          <input
            type="text"
            value={employeeId}
            onChange={(e) =>
              setEmployeeId(e.target.value)
            }
            placeholder="Enter employee ID"
            required
          />

          {/* COMPANY */}

          <label>Company</label>

          {loadingCompanies ? (
            <p>Loading approved companies...</p>
          ) : companies.length === 0 ? (
            <p style={{ color: "red" }}>
              No approved companies available.
            </p>
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

        {/* SUCCESS MESSAGE */}

        {message && (
          <p style={{ color: "green" }}>
            {message}
          </p>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {/* BUTTONS */}

        <div className="dashboard-menu">

          <button
            type="submit"
            disabled={
              loading ||
              loadingCompanies ||
              companies.length === 0
            }
          >
            {loading
              ? "Registering..."
              : "📝 Register"}
          </button>

          <button
            type="button"
            onClick={onBack}
          >
            ← Back to Login
          </button>

        </div>

      </form>

    </div>
  );
}

export default CompanyGuideRegister;