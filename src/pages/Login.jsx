import React, { useState } from "react";

function Login({
  onLogin,
  onGoToRegister,
  onGoToCompanyLogin,
  onGoToAdminLogin,
    onGoToFacultyLogin,
     onGoToCompanyGuideLogin,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/students/login",
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

      if (response.ok) {
        setMessage(data.message || "Login successful!");

        setTimeout(() => {
          onLogin(data.student);
        }, 1000);
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Interlink</h1>
        <h2>FYUGP Student Login</h2>

        <p className="subtitle">
          Login to access your internship portal
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="register-link">
          Don't have an account?{" "}
          <span onClick={onGoToRegister}>
            Register
          </span>
        </p>

        <p className="register-link">
          Are you a company?{" "}
          <span onClick={onGoToCompanyLogin}>
            Login as Company
          </span>
        </p>

        <p className="register-link">
          Are you an admin?{" "}
          <span onClick={onGoToAdminLogin}>
            Login as Admin
          </span>
        </p>
    <p className="register-link">
  Are you a faculty?{" "}
  <span onClick={onGoToFacultyLogin}>
    Login as Faculty
  </span>
</p>

<button onClick={() => onGoToCompanyGuideLogin()}>
  Company Guide Login
</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Login;