import { useEffect, useState } from "react";

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
        setMessage(
          data.message || "Registration failed"
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="faculty-register">

      <h1>Faculty Registration</h1>

      <form onSubmit={handleRegister}>

        {/* NAME */}

        <div>
          <label>Name</label>
          <br />

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />
        </div>

        <br />

        {/* EMAIL */}

        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>

        <br />

        {/* PASSWORD */}

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />
        </div>

        <br />

        {/* COLLEGE */}

        <div>
          <label>College</label>
          <br />

          <select
            value={college}
            onChange={(e) =>
              setCollege(e.target.value)
            }
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

        <br />

        {/* DEPARTMENT */}

        <div>
          <label>Department</label>
          <br />

          <input
            type="text"
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
            placeholder="Example: MCA"
            required
          />
        </div>

        <br />

        {/* PHONE */}

        <div>
          <label>Phone</label>
          <br />

          <input
            type="tel"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            required
          />
        </div>

        <br />

        {/* DESIGNATION */}

        <div>
          <label>Designation</label>
          <br />

          <input
            type="text"
            value={designation}
            onChange={(e) =>
              setDesignation(e.target.value)
            }
            placeholder="Example: Assistant Professor"
            required
          />
        </div>

        <br />

        <button type="submit">
          Register
        </button>

      </form>

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      <button onClick={onBackToLogin}>
        Back to Faculty Login
      </button>

    </div>
  );
}

export default FacultyRegister;