import { useState } from "react";

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
    <div>
      <h1>Interlink</h1>

      <h2>College Registration</h2>

      <p>
        Register your college for the FYUGP Internship
        Management Platform.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="collegeName"
          placeholder="College Name"
          value={formData.collegeName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="collegeCode"
          placeholder="College Code"
          value={formData.collegeCode}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="College Email"
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
          type="tel"
          name="phone"
          placeholder="College Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="College Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <input
          type="url"
          name="website"
          placeholder="College Website (optional)"
          value={formData.website}
          onChange={handleChange}
        />

        <button type="submit">
          Register College
        </button>
      </form>

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <p className="login-link">
        <span onClick={onBack}>
          ← Back to Login
        </span>
      </p>
    </div>
  );
}

export default CollegeRegister;