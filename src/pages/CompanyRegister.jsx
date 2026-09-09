import { useState } from "react";

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
    <div className="login-container">
      <h1>Company Registration</h1>

      <p>
        Register your company. Your registration must be approved by the
        admin before you can log in.
      </p>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Official Company Email"
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

        <textarea
          name="description"
          placeholder="Company Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Company Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <button type="submit">Register Company</button>
      </form>

      {message && <p>{message}</p>}

      <button onClick={onBack}>
        ← Back to Company Login
      </button>
    </div>
  );
}

export default CompanyRegister;