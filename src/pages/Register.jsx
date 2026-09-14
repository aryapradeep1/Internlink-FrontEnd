import { useEffect, useState } from "react";

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
    <div>
      <h1>Student Registration</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="registerNumber"
          placeholder="Register Number"
          value={formData.registerNumber}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="semester"
          placeholder="Semester"
          value={formData.semester}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        {/* College Selection */}
        <select
          name="college"
          value={formData.college}
          onChange={handleChange}
          required
        >
          <option value="">
            Select College
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

        <button type="submit">
          Register
        </button>
      </form>

      <p className="login-link">
        Already have an account?{" "}
        <span onClick={onGoToLogin}>
          Login
        </span>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;