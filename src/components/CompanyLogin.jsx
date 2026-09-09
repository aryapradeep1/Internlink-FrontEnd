import { useState } from "react";

function CompanyLogin({ onLogin, onBack , onRegister})  {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/companies/login",
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
        setMessage("Login successful!");
        
        // Send company details to App.jsx
        setTimeout(() => {
          onLogin(data.company);
        }, 500);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="login-container">
      <h1>Company Login</h1>
      <p>Login to manage internship applications.</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Company Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}

      <button onClick={onRegister}>
       Register Your Company
    </button>

      <button onClick={onBack}>
        ← Back
      </button>
    </div>
  );
}

export default CompanyLogin;