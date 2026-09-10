import React from "react";

function CompanyGuideDashboard({ guide, onLogout }) {
  return (
    <div className="dashboard-container">
      <h2>Company Guide Dashboard</h2>

      <h3>Welcome, {guide?.name}</h3>

      <p>
        <strong>Email:</strong> {guide?.email}
      </p>

      <p>
        <strong>Employee ID:</strong> {guide?.employeeId}
      </p>

      <p>
        <strong>Status:</strong> {guide?.status}
      </p>

      <button onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default CompanyGuideDashboard;