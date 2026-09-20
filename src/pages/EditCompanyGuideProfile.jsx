import React, { useState } from "react";

function EditCompanyGuideProfile({
  guide,
  onBack,
  onProfileUpdated,
}) {
  const [name, setName] = useState(
    guide?.name || ""
  );

  const [email, setEmail] = useState(
    guide?.email || ""
  );

  const [employeeId, setEmployeeId] = useState(
    guide?.employeeId || ""
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name || !email || !employeeId) {
      setError("Please fill all required fields");
      return;
    }

    const guideId = guide?.id || guide?._id;

    if (!guideId) {
      setError("Company Guide information not found");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/company-guides/profile/${guideId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            employeeId,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(data.message);

        if (onProfileUpdated) {
          onProfileUpdated(data.guide);
        }
      } else {
        setError(
          data.message ||
            "Failed to update profile"
        );
      }
    } catch (error) {
      console.error(
        "Update Company Guide Profile Error:",
        error
      );

      setError(
        "Unable to update Company Guide profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">

      <h1>✏️ Edit Company Guide Profile</h1>

      <form onSubmit={handleSubmit}>

        <div className="student-info">

          <label>
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>
            Employee ID
          </label>

          <input
            type="text"
            value={employeeId}
            onChange={(e) =>
              setEmployeeId(e.target.value)
            }
            required
          />

          <label>
            Company
          </label>

          <input
            type="text"
            value={
              guide?.company?.companyName ||
              guide?.companyName ||
              "Not available"
            }
            disabled
          />

          <label>
            Status
          </label>

         

        </div>

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

        <div className="dashboard-menu">

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Updating..."
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

export default EditCompanyGuideProfile;