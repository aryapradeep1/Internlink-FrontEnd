import React, { useState } from "react";

function CompanyGuideLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/company-guides/login",
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
        alert("Company Guide login successful!");
        onLogin(data.guide);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Company Guide Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Company Guide Login</h2>

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

export default CompanyGuideLogin;