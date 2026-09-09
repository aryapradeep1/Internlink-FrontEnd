function CompanyDetails({
  company,
  internship,
  onBack,
  onApply,
}) {
  if (!company || !internship) {
    return (
      <div className="company-details-container">
        <p>Internship details not found.</p>

        <button onClick={onBack}>
          ← Back to Internships
        </button>
      </div>
    );
  }

  return (
    <div className="company-details-container">
      <h1>{company.companyName}</h1>

      <div className="company-details-card">
        <h2>Internship Details</h2>

        <p>
          <strong>Internship Role:</strong>{" "}
          {internship.title}
        </p>

        <p>
          <strong>Location:</strong>{" "}
          {internship.location}
        </p>

        <p>
          <strong>Description:</strong>{" "}
         {internship.description}
        </p>

        <p>
          <strong>Eligible Departments:</strong>{" "}
          {internship.eligibility}
        </p>

        <p>
          <strong>Skills Required:</strong>{" "}
          {internship.skillsRequired}
        </p>

        <p>
          <strong>Internship Duration:</strong>{" "}
          {internship.duration}
        </p>

        <p>
          <strong>Application Deadline:</strong>{" "}
          {new Date(internship.deadline).toLocaleDateString()}
        </p>

        <button
          onClick={() => onApply(company, internship)}
        >
          Apply Now
        </button>

        <button onClick={onBack}>
          ← Back to Internships
        </button>
      </div>
    </div>
  );
}

export default CompanyDetails;