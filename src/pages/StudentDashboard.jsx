import React from "react";

function StudentDashboard({
  student,
  onLogout,
  onGoToInternships,
  onGoToMyApplications,
  onGoToMyInternship,
  onGoToLogbook,
}) {
  return (
    <div className="dashboard-container">
      <h1>Welcome to Interlink</h1>
      <h2>FYUGP Student Dashboard</h2>

      <div className="student-info">
        <h3>Welcome, {student.name} 👋</h3>

        <p>
          <strong>Email:</strong> {student.email}
        </p>

        <p>
          <strong>Register Number:</strong> {student.registerNumber}
        </p>

        <p>
          <strong>Department:</strong> {student.department}
        </p>

        <p>
          <strong>Semester:</strong> {student.semester}
        </p>
      </div>

      <div className="dashboard-menu">
        <button>👤 My Profile</button>

        <button onClick={onGoToInternships}>
          💼 Available Internships
        </button>

        <button onClick={onGoToMyApplications}>
          📋 My Applications
        </button>

        <button onClick={onGoToMyInternship}>
          🎓 My Internship
        </button>

        <button onClick={onGoToLogbook}>
          📖 Logbook
        </button>
      </div>

      <button onClick={onLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default StudentDashboard;
