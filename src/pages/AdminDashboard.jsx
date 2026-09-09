import { useEffect, useState } from "react";

function AdminDashboard({ admin, onLogout }) {
  // ======================================================
  // STATE
  // ======================================================

  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [message, setMessage] = useState("");
  const [pendingFaculty, setPendingFaculty] = useState([]);
  // ======================================================
  // FETCH PENDING COMPANIES
  // ======================================================

  const fetchPendingCompanies = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/pending-companies"
      );

      const data = await response.json();

      if (data.status === "success") {
        setCompanies(data.companies);
      } else {
        setMessage(data.message || "Failed to load companies");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  // ======================================================
  // FETCH APPLICATIONS WAITING FOR FACULTY ASSIGNMENT
  // ======================================================

  const fetchCollegeApplications = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/college-pending-applications"
      );

      const data = await response.json();

      if (data.status === "success") {
        setApplications(data.applications);
      } else {
        setMessage(
          data.message || "Failed to load applications"
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  // ======================================================
  // FETCH ALL FACULTY
  // ======================================================

  const fetchFaculty = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/faculty"
      );

      const data = await response.json();

      if (data.status === "success") {
        setFaculty(data.faculty);
      } else {
        setMessage(
          data.message || "Failed to load faculty"
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };


// ======================================================
// FETCH PENDING FACULTY
// ======================================================

const fetchPendingFaculty = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/admin/pending-faculty"
    );

    const data = await response.json();

    if (data.status === "success") {
      setPendingFaculty(data.faculty);
    } else {
      setMessage(
        data.message || "Failed to load pending faculty"
      );
    }
  } catch (error) {
    console.error(error);
    setMessage("Unable to connect to server");
  }
};

  // ======================================================
  // LOAD DATA WHEN DASHBOARD OPENS
  // ======================================================

  useEffect(() => {
    fetchPendingCompanies();
    fetchCollegeApplications();
    fetchFaculty();
     fetchPendingFaculty();
  }, []);

  // ======================================================
  // APPROVE COMPANY
  // ======================================================

  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/approve-company/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Company approved successfully!");
        fetchPendingCompanies();
      } else {
        setMessage(
          data.message || "Failed to approve company"
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  // ======================================================
  // REJECT COMPANY
  // ======================================================

  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/reject-company/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Company rejected successfully!");
        fetchPendingCompanies();
      } else {
        setMessage(
          data.message || "Failed to reject company"
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };


// ======================================================
// APPROVE FACULTY
// ======================================================

const handleApproveFaculty = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/approve-faculty/${id}`,
      {
        method: "PUT",
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      setMessage("Faculty approved successfully!");
      fetchPendingFaculty();
      fetchFaculty();
    } else {
      setMessage(
        data.message || "Failed to approve faculty"
      );
    }
  } catch (error) {
    console.error(error);
    setMessage("Unable to connect to server");
  }
};

// ======================================================
// REJECT FACULTY
// ======================================================

const handleRejectFaculty = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/reject-faculty/${id}`,
      {
        method: "PUT",
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      setMessage("Faculty rejected successfully!");
      fetchPendingFaculty();
      fetchFaculty();
    } else {
      setMessage(
        data.message || "Failed to reject faculty"
      );
    }
  } catch (error) {
    console.error(error);
    setMessage("Unable to connect to server");
  }
};

 
// ======================================================
// APPROVE APPLICATION - AUTOMATIC FACULTY ASSIGNMENT
// ======================================================

const handleApproveApplication = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/verify-application/${id}`,
      {
        method: "PUT",
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      setMessage(data.message);

      // Refresh applications
      fetchCollegeApplications();
    } else {
      setMessage(
        data.message || "Failed to approve application"
      );
    }
  } catch (error) {
    console.error(error);
    setMessage("Unable to connect to server");
  }
};
  

  // ======================================================
  // REJECT APPLICATION
  // ======================================================

  const handleRejectApplication = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/reject-application/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Application rejected by college.");
        fetchCollegeApplications();
      } else {
        setMessage(
          data.message ||
            "Failed to reject application"
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="admin-dashboard">

      {/* ==================================================
          ADMIN HEADER
      ================================================== */}

      <h1>Admin Dashboard</h1>

      <p>
        Welcome, <strong>{admin?.name}</strong>
      </p>

      <button onClick={onLogout}>
        Logout
      </button>

      <hr />

      {/* ==================================================
          MESSAGE
      ================================================== */}

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      {/* ==================================================
          PENDING COMPANY REGISTRATIONS
      ================================================== */}

      <h2>
        Pending Company Registrations
      </h2>

      {companies.length === 0 ? (
        <p>No pending companies.</p>
      ) : (
        companies.map((company) => (
          <div
            className="company-card"
            key={company._id}
          >
            <h3>
              {company.companyName}
            </h3>

            <p>
              <strong>Email:</strong>{" "}
              {company.email}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {company.location}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {company.description}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {company.status}
            </p>

            <button
              onClick={() =>
                handleApprove(company._id)
              }
            >
              Approve
            </button>

            <button
              onClick={() =>
                handleReject(company._id)
              }
            >
              Reject
            </button>
          </div>
        ))
      )}

      {/* ==================================================
          FACULTY MANAGEMENT
      ================================================== */}

      <hr />

      <h2>
        Pending Faculty Registrations
      </h2>

      {pendingFaculty.length === 0 ? (
        <p>No pending faculty registrations.</p>
      ) : (
        pendingFaculty.map((member) => (
          <div
            className="faculty-card"
            key={member._id}
          >
            <h3>
              {member.name}
            </h3>

            <p>
              <strong>Email:</strong>{" "}
              {member.email}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {member.department}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {member.phone || "N/A"}
            </p>

            <p>
              <strong>Designation:</strong>{" "}
              {member.designation || "N/A"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {member.status}
            </p>

            <button
              onClick={() =>
                handleApproveFaculty(member._id)
              }
            >
              Approve
            </button>

            <button
              onClick={() =>
                handleRejectFaculty(member._id)
              }
            >
              Reject
            </button>
          </div>
        ))
      )}

      <hr />

      {/* ==================================================
          FACULTY ASSIGNMENT
      ================================================== */}

      <h2>
        Applications Waiting for Faculty Assignment
      </h2>

      {applications.length === 0 ? (
        <p>
          No applications waiting for faculty assignment.
        </p>
      ) : (
        applications.map((application) => (
          <div
            className="application-card"
            key={application._id}
          >

            {/* STUDENT INFORMATION */}

            <h3>
              Student:{" "}
              {application.student?.name ||
                "Unknown Student"}
            </h3>

            <p>
              <strong>Register Number:</strong>{" "}
              {application.student?.registerNumber ||
                "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {application.student?.email ||
                "N/A"}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {application.student?.department ||
                "N/A"}
            </p>

            <p>
              <strong>Semester:</strong>{" "}
              {application.student?.semester ||
                "N/A"}
            </p>

            <hr />

            {/* COMPANY INFORMATION */}

            <h3>
              Company Information
            </h3>

            <p>
              <strong>Company:</strong>{" "}
              {application.company?.companyName ||
                "Unknown Company"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {application.company?.email ||
                "N/A"}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {application.company?.location ||
                "N/A"}
            </p>

            <hr />

            {/* INTERNSHIP INFORMATION */}

            <h3>
              Internship Information
            </h3>

            <p>
              <strong>Internship:</strong>{" "}
              {application.internship?.title ||
                "N/A"}
            </p>

            <p>
              <strong>Position:</strong>{" "}
              {application.position ||
                "N/A"}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {application.internship?.duration ||
                "N/A"}
            </p>

            <p>
              <strong>Eligibility:</strong>{" "}
              {application.internship?.eligibility ||
                "N/A"}
            </p>

            <p>
              <strong>Why Applied:</strong>{" "}
              {application.whyApply ||
                "N/A"}
            </p>

            <hr />

            {/* APPLICATION STATUS */}

            <p>
              <strong>Status:</strong>{" "}
              {application.status}
            </p>

            {/* ==================================================
                FACULTY ASSIGNMENT
            ================================================== */}
<h3>
  College Verification
</h3>

<p>
  Faculty will be assigned automatically based on the
  student's department and faculty workload.
</p>

<button
  onClick={() =>
    handleApproveApplication(
      application._id
    )
  }
>
  Approve & Assign Faculty
</button>
           
            <button
              onClick={() =>
                handleRejectApplication(
                  application._id
                )
              }
            >
              Reject Application
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default AdminDashboard;