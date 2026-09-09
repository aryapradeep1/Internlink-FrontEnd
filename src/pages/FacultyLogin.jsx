import React, { useState } from "react";

function FacultyLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/faculty/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        alert("Faculty login successful!");
        onLogin(data.faculty);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Faculty Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Faculty Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Login
        </button>
      </form>

      <button onClick={onBack}>
        Back
      </button>
    </div>
  );
}

export default FacultyLogin;