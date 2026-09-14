import React, { useEffect, useState } from "react";

function CollegeDashboard({ college, onLogout }) {
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [applications, setApplications] = useState([]);

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD COLLEGE DATA
  // ==========================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [studentsRes, facultyRes, applicationsRes] =
        await Promise.all([
          fetch(
            `http://localhost:5000/api/colleges/${college.id}/students`
          ),
          fetch(
            `http://localhost:5000/api/colleges/${college.id}/faculty`
          ),
          fetch(
            `http://localhost:5000/api/colleges/${college.id}/applications`
          ),
        ]);

      const studentsData = await studentsRes.json();
      const facultyData = await facultyRes.json();
      const applicationsData = await applicationsRes.json();

      if (studentsData.status === "success") {
        setStudents(studentsData.students);
      }

      if (facultyData.status === "success") {
        setFaculty(facultyData.faculty);
      }

      if (applicationsData.status === "success") {
        setApplications(applicationsData.applications);
      }
    } catch (error) {
      console.error("College dashboard error:", error);
      setMessage("Failed to load college data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // APPROVE FACULTY
  // ==========================================

  const approveFaculty = async (facultyId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/colleges/${college.id}/faculty/${facultyId}/approve`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Faculty approved successfully");
        loadData();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to approve faculty");
    }
  };

  // ==========================================
  // REJECT FACULTY
  // ==========================================

  const rejectFaculty = async (facultyId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/colleges/${college.id}/faculty/${facultyId}/reject`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Faculty rejected successfully");
        loadData();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to reject faculty");
    }
  };

  // ==========================================
  // APPROVE INTERNSHIP
  // ==========================================

  const approveApplication = async (applicationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/colleges/${college.id}/applications/${applicationId}/approve`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(
          `Internship approved. Faculty assigned: ${data.assignedFaculty.name}`
        );

        loadData();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to approve internship");
    }
  };

  // ==========================================
  // REJECT INTERNSHIP
  // ==========================================

  const rejectApplication = async (applicationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/colleges/${college.id}/applications/${applicationId}/reject`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage("Internship rejected");
        loadData();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to reject internship");
    }
  };

  // ==========================================
  // COUNTS
  // ==========================================

  const pendingFaculty = faculty.filter(
    (f) => f.status === "Pending"
  );

  const approvedFaculty = faculty.filter(
    (f) => f.status === "Approved"
  );

  const pendingApplications = applications.filter(
    (app) => app.status === "CompanyApproved"
  );

  const approvedApplications = applications.filter(
    (app) => app.status === "CollegeApproved"
  );

  // ==========================================
  // FACULTY WORKLOAD
  // ==========================================

  const getFacultyWorkload = (facultyId) => {
    return applications.filter(
      (app) =>
        app.faculty &&
        app.faculty._id === facultyId &&
        app.status === "CollegeApproved"
    ).length;
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Loading College Dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* ======================================
          HEADER
      ====================================== */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            {college.collegeName}
          </h1>

          <p style={styles.subtitle}>
            College Dashboard
          </p>
        </div>

        <button
          onClick={onLogout}
          style={styles.logoutButton}
        >
          Logout
        </button>
      </div>

      {/* ======================================
          MESSAGE
      ====================================== */}

      {message && (
        <div style={styles.message}>
          {message}

          <button
            onClick={() => setMessage("")}
            style={styles.closeMessage}
          >
            ×
          </button>
        </div>
      )}

      {/* ======================================
          NAVIGATION
      ====================================== */}

      <div style={styles.nav}>
        <button
          onClick={() => setActiveTab("overview")}
          style={
            activeTab === "overview"
              ? styles.activeTab
              : styles.tab
          }
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab("students")}
          style={
            activeTab === "students"
              ? styles.activeTab
              : styles.tab
          }
        >
          Students
        </button>

        <button
          onClick={() => setActiveTab("faculty")}
          style={
            activeTab === "faculty"
              ? styles.activeTab
              : styles.tab
          }
        >
          Faculty
        </button>

        <button
          onClick={() => setActiveTab("applications")}
          style={
            activeTab === "applications"
              ? styles.activeTab
              : styles.tab
          }
        >
          Internship Applications
        </button>

        <button
          onClick={() => setActiveTab("workload")}
          style={
            activeTab === "workload"
              ? styles.activeTab
              : styles.tab
          }
        >
          Faculty Workload
        </button>
      </div>

      {/* ======================================
          OVERVIEW
      ====================================== */}

      {activeTab === "overview" && (
        <div>
          <h2>Dashboard Overview</h2>

          <div style={styles.cards}>
            <div style={styles.card}>
              <h3>Students</h3>
              <p style={styles.number}>
                {students.length}
              </p>
            </div>

            <div style={styles.card}>
              <h3>Faculty</h3>
              <p style={styles.number}>
                {approvedFaculty.length}
              </p>
              <small>
                {pendingFaculty.length} pending requests
              </small>
            </div>

            <div style={styles.card}>
              <h3>Applications</h3>
              <p style={styles.number}>
                {applications.length}
              </p>
            </div>

            <div style={styles.card}>
              <h3>Approved Internships</h3>
              <p style={styles.number}>
                {approvedApplications.length}
              </p>
            </div>
          </div>

          <div style={styles.details}>
            <h2>College Details</h2>

            <p>
              <strong>College Name:</strong>{" "}
              {college.collegeName}
            </p>

            <p>
              <strong>College Code:</strong>{" "}
              {college.collegeCode}
            </p>

            <p>
              <strong>Email:</strong> {college.email}
            </p>

            <p>
              <strong>Phone:</strong> {college.phone}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {college.location}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {college.status}
            </p>
          </div>
        </div>
      )}

      {/* ======================================
          STUDENTS
      ====================================== */}

      {activeTab === "students" && (
        <div>
          <h2>College Students</h2>

          {students.length === 0 ? (
            <p>No students registered yet.</p>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Register No.</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Semester</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Phone</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td style={styles.td}>
                        {student.name}
                      </td>

                      <td style={styles.td}>
                        {student.registerNumber}
                      </td>

                      <td style={styles.td}>
                        {student.department}
                      </td>

                      <td style={styles.td}>
                        {student.semester}
                      </td>

                      <td style={styles.td}>
                        {student.email}
                      </td>

                      <td style={styles.td}>
                        {student.phone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ======================================
          FACULTY
      ====================================== */}

      {activeTab === "faculty" && (
        <div>
          <h2>Faculty Management</h2>

          {/* Pending Faculty */}

          <h3 style={styles.sectionTitle}>
            Pending Faculty Requests
          </h3>

          {pendingFaculty.length === 0 ? (
            <p>No pending faculty requests.</p>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Designation</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pendingFaculty.map((f) => (
                    <tr key={f._id}>
                      <td style={styles.td}>{f.name}</td>

                      <td style={styles.td}>
                        {f.department}
                      </td>

                      <td style={styles.td}>
                        {f.designation}
                      </td>

                      <td style={styles.td}>
                        {f.email}
                      </td>

                      <td style={styles.td}>
                        <button
                          onClick={() =>
                            approveFaculty(f._id)
                          }
                          style={styles.approveButton}
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            rejectFaculty(f._id)
                          }
                          style={styles.rejectButton}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Approved Faculty */}

          <h3 style={styles.sectionTitle}>
            Approved Faculty
          </h3>

          {approvedFaculty.length === 0 ? (
            <p>No approved faculty.</p>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Designation</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>
                      Assigned Students
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {approvedFaculty.map((f) => (
                    <tr key={f._id}>
                      <td style={styles.td}>{f.name}</td>

                      <td style={styles.td}>
                        {f.department}
                      </td>

                      <td style={styles.td}>
                        {f.designation}
                      </td>

                      <td style={styles.td}>
                        {f.email}
                      </td>

                      <td style={styles.td}>
                        {getFacultyWorkload(f._id)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ======================================
          INTERNSHIP APPLICATIONS
      ====================================== */}

      {activeTab === "applications" && (
        <div>
          <h2>Internship Applications</h2>

          {applications.length === 0 ? (
            <p>No internship applications.</p>
          ) : (
            <div style={styles.applicationList}>
              {applications.map((app) => (
                <div
                  key={app._id}
                  style={styles.applicationCard}
                >
                  <h3>
                    {app.student?.name}
                  </h3>

                  <p>
                    <strong>Register Number:</strong>{" "}
                    {app.student?.registerNumber}
                  </p>

                  <p>
                    <strong>Department:</strong>{" "}
                    {app.student?.department}
                  </p>

                  <p>
                    <strong>Company:</strong>{" "}
                    {app.company?.companyName}
                  </p>

                  <p>
                    <strong>Internship:</strong>{" "}
                    {app.internship?.title}
                  </p>

                  <p>
                    <strong>Applied On:</strong>{" "}
                    {new Date(
                      app.createdAt
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={getStatusStyle(
                        app.status
                      )}
                    >
                      {app.status}
                    </span>
                  </p>

                  {app.faculty && (
                    <p>
                      <strong>Faculty Guide:</strong>{" "}
                      {app.faculty.name}
                    </p>
                  )}

                  {/* College Actions */}

                  {app.status === "CompanyApproved" && (
                    <div>
                      <button
                        onClick={() =>
                          approveApplication(
                            app._id
                          )
                        }
                        style={styles.approveButton}
                      >
                        Approve & Assign Faculty
                      </button>

                      <button
                        onClick={() =>
                          rejectApplication(
                            app._id
                          )
                        }
                        style={styles.rejectButton}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {app.status === "Pending" && (
                    <p style={styles.waiting}>
                      Waiting for company approval
                    </p>
                  )}

                  {app.status === "CompanyRejected" && (
                    <p style={styles.rejected}>
                      Rejected by company
                    </p>
                  )}

                  {app.status === "CollegeApproved" && (
                    <p style={styles.approved}>
                      Internship approved and faculty assigned
                    </p>
                  )}

                  {app.status === "CollegeRejected" && (
                    <p style={styles.rejected}>
                      Rejected by college
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================
          FACULTY WORKLOAD
      ====================================== */}

      {activeTab === "workload" && (
        <div>
          <h2>Faculty Workload</h2>

          <p>
            Faculty assignment is automatically based on
            department and current student workload.
          </p>

          {approvedFaculty.length === 0 ? (
            <p>No approved faculty available.</p>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Faculty</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>
                      Assigned Students
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {approvedFaculty.map((f) => (
                    <tr key={f._id}>
                      <td style={styles.td}>
                        {f.name}
                      </td>

                      <td style={styles.td}>
                        {f.department}
                      </td>

                      <td style={styles.td}>
                        {getFacultyWorkload(f._id)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// STATUS STYLE
// ==========================================

const getStatusStyle = (status) => {
  if (status === "CollegeApproved") {
    return {
      color: "green",
      fontWeight: "bold",
    };
  }

  if (status === "CompanyApproved") {
    return {
      color: "orange",
      fontWeight: "bold",
    };
  }

  if (
    status === "CompanyRejected" ||
    status === "CollegeRejected"
  ) {
    return {
      color: "red",
      fontWeight: "bold",
    };
  }

  return {
    color: "gray",
    fontWeight: "bold",
  };
};

// ==========================================
// STYLES
// ==========================================

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1400px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },

  loading: {
    textAlign: "center",
    padding: "50px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "20px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
  },

  subtitle: {
    marginTop: "5px",
    color: "#666",
  },

  logoutButton: {
    padding: "10px 20px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  message: {
    padding: "12px",
    marginBottom: "20px",
    background: "#e8f5e9",
    border: "1px solid #b7dfb9",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "space-between",
  },

  closeMessage: {
    border: "none",
    background: "transparent",
    fontSize: "20px",
    cursor: "pointer",
  },

  nav: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  tab: {
    padding: "10px 16px",
    border: "1px solid #ccc",
    background: "#f5f5f5",
    borderRadius: "5px",
    cursor: "pointer",
  },

  activeTab: {
    padding: "10px 16px",
    border: "1px solid #333",
    background: "#333",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fafafa",
  },

  number: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "10px 0",
  },

  details: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },

  sectionTitle: {
    marginTop: "35px",
  },

  tableContainer: {
    overflowX: "auto",
    marginTop: "15px",
    marginBottom: "30px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    border: "1px solid #ddd",
    padding: "12px",
    background: "#f5f5f5",
    textAlign: "left",
  },

  td: {
    border: "1px solid #ddd",
    padding: "12px",
  },

  approveButton: {
    padding: "8px 12px",
    marginRight: "8px",
    background: "#198754",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  rejectButton: {
    padding: "8px 12px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  applicationList: {
    display: "grid",
    gap: "20px",
  },

  applicationCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
  },

  waiting: {
    color: "#777",
    fontWeight: "bold",
  },

  approved: {
    color: "green",
    fontWeight: "bold",
  },

  rejected: {
    color: "red",
    fontWeight: "bold",
  },
};

export default CollegeDashboard;