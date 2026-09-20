import React, { useState } from "react";

function EditCompanyProfile({
  company,
  onBack,
  onProfileUpdated,
}) {
  const [companyName, setCompanyName] = useState(
    company?.companyName || ""
  );

  const [email, setEmail] = useState(
    company?.email || ""
  );

  const [description, setDescription] = useState(
    company?.description || ""
  );

  const [location, setLocation] = useState(
    company?.location || ""
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const companyId = company?.id || company?._id;

      const response = await fetch(
        `http://localhost:5000/api/companies/profile/${companyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName,
            email,
            description,
            location,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(data.message);

        onProfileUpdated(data.company);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Edit company profile error:", error);
      setError("Unable to update company profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>✏️ Edit Company Profile</h1>

      {message && (
        <p style={{ color: "green" }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="student-info">

          <label>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) =>
              setCompanyName(e.target.value)
            }
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            required
          />

          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            required
          />

        </div>

        <div className="dashboard-menu">

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "💾 Save Changes"}
          </button>

          <button
            type="button"
            onClick={onBack}
          >
            ← Back to Profile
          </button>

        </div>
      </form>
    </div>
  );
}

export default EditCompanyProfile;
