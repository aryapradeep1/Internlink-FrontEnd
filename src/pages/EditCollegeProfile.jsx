import React, { useState } from "react";

function EditCollegeProfile({
  college,
  onBack,
  onProfileUpdated,
}) {
  const [collegeName, setCollegeName] = useState(
    college?.collegeName || ""
  );

  const [email, setEmail] = useState(
    college?.email || ""
  );

  const [phone, setPhone] = useState(
    college?.phone || ""
  );

  const [location, setLocation] = useState(
    college?.location || ""
  );

  const [website, setWebsite] = useState(
    college?.website || ""
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
      const collegeId = college?.id || college?._id;

      const response = await fetch(
        `http://localhost:5000/api/colleges/profile/${collegeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collegeName,
            email,
            phone,
            location,
            website,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(data.message);

        onProfileUpdated(data.college);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(
        "Edit college profile error:",
        error
      );

      setError("Unable to update college profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>✏️ Edit College Profile</h1>

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

          <label>College Name</label>

          <input
            type="text"
            value={collegeName}
            onChange={(e) =>
              setCollegeName(e.target.value)
            }
            required
          />


          <label>College Code</label>

          <input
            type="text"
            value={college?.collegeCode || ""}
            disabled
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


          <label>Phone</label>

          <input
            type="text"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
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


          <label>Website</label>

          <input
            type="text"
            value={website}
            onChange={(e) =>
              setWebsite(e.target.value)
            }
            placeholder="https://example.com"
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

export default EditCollegeProfile;