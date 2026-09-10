import { useEffect, useState } from "react";

function FacultyDashboard({ faculty, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  // ======================================================
  // FETCH ASSIGNED STUDENTS
  // ======================================================

  const fetchAssignedStudents = async () => {
    try {
      const facultyId = faculty?.id || faculty?._id;

      if (!facultyId) {
        setMessage("Faculty information not found.");
        return;
      }

    const response = await fetch(
  `http://localhost:5000/api/internship-assignments/faculty/${facultyId}`
);

      const data = await response.json();

      if (data.status === "success") {
       setApplications(data.assignments);
      } else {
        setMessage(
          data.message || "Failed to load assigned students"
        );
      }
    } catch (error) {
      console.error("Fetch Assigned Students Error:", error);
      setMessage("Unable to connect to server");
    }
  };

  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {
    fetchAssignedStudents();
  }, [faculty]);

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="faculty-dashboard">

      {/* HEADER */}

      <h1>Faculty Dashboard</h1>

      <p>
        Welcome, <strong>{faculty?.name}</strong>
      </p>

      <p>
        <strong>Department:</strong>{" "}
        {faculty?.department || "N/A"}
      </p>

      <p>
        <strong>Designation:</strong>{" "}
        {faculty?.designation || "Faculty"}
      </p>

      <button onClick={onLogout}>
        Logout
      </button>

      <hr />

      {/* MESSAGE */}

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      {/* ASSIGNED STUDENTS */}

      <h2>
        Assigned Internship Students
      </h2>

      {applications.length === 0 ? (
        <p>
          No students have been assigned to you yet.
        </p>
      ) : (
        applications.map((application) => (
          <div
            className="application-card"
            key={application._id}
          >

            {/* STUDENT */}

            <h3>
              Student Information
            </h3>

            <p>
              <strong>Name:</strong>{" "}
              {application.student?.name || "N/A"}
            </p>

            <p>
              <strong>Register Number:</strong>{" "}
              {application.student?.registerNumber || "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {application.student?.email || "N/A"}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {application.student?.department || "N/A"}
            </p>

            <p>
              <strong>Semester:</strong>{" "}
              {application.student?.semester || "N/A"}
            </p>

            <hr />

            {/* COMPANY */}

            <h3>
              Company Information
            </h3>

            <p>
              <strong>Company:</strong>{" "}
              {application.company?.companyName || "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {application.company?.email || "N/A"}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {application.company?.location || "N/A"}
            </p>

            <hr />

            {/* INTERNSHIP */}

            <h3>
              Internship Information
            </h3>

            <p>
              <strong>Internship:</strong>{" "}
              {application.internship?.title || "N/A"}
            </p>

            <p>
              <strong>Position:</strong>{" "}
              {application.position || "N/A"}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {application.internship?.duration || "N/A"}
            </p>

            <hr />

            {/* APPLICATION STATUS */}

            <p>
              <strong>Application Status:</strong>{" "}
              {application.status}
            </p>

          </div>
        ))
      )}

    </div>
  );
}

export default FacultyDashboard;