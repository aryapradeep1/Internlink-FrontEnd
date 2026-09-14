import { useState } from "react";

function CollegeLogin({ onLogin, onGoToRegister, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/colleges/login",
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
        setMessage("Login successful!");

        setTimeout(() => {
          onLogin(data.college);
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
    <div>
      <h1>Interlink</h1>

      <h2>College Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="College Email"
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

        <button type="submit">
          Login
        </button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Don't have a college account?{" "}
        <span onClick={onGoToRegister}>
          Register your college
        </span>
      </p>

      <p>
        <span onClick={onBack}>
          ← Back
        </span>
      </p>
    </div>
  );
}

export default CollegeLogin;