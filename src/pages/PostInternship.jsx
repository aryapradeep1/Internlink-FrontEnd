import { useState } from "react";

function PostInternship({ company, onBack, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [duration, setDuration] = useState("");
  const [deadline, setDeadline] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/internships",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company: company.id,
            title,
            description,
            location,
            eligibility,
            skillsRequired,
            duration,
            deadline,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Internship posted successfully!");

        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        setError(data.message || "Failed to post internship");
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="post-internship-container">
      <h1>Post Internship Opportunity</h1>

      <p>
        Company: <strong>{company?.companyName}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Internship Position"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Internship Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Eligibility"
          value={eligibility}
          onChange={(e) => setEligibility(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Skills Required"
          value={skillsRequired}
          onChange={(e) => setSkillsRequired(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

        <label>Application Deadline</label>

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />

        <button type="submit">
          Post Internship
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <button onClick={onBack}>
        ← Back to Company Dashboard
      </button>
    </div>
  );
}

export default PostInternship;