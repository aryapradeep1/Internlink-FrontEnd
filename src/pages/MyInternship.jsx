import React, { useEffect, useState } from "react";

function MyInternship({
  student,
  onGenerateCertificate,
}) {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch internship assignment
        const assignmentResponse = await fetch(
          `http://localhost:5000/api/internship-assignments/student/${student.id}`
        );

        const assignmentData =
          await assignmentResponse.json();

        if (assignmentData.status === "success") {
          setAssignment(assignmentData.assignment);
        }

        // Fetch student logbook
        const logbookResponse = await fetch(
          `http://localhost:5000/api/logbook/student/${student.id}`
        );

        const logbookData =
          await logbookResponse.json();

        if (logbookData.status === "success") {
          const total = (
            logbookData.logbooks || []
          ).reduce(
            (sum, logbook) =>
              sum + Number(logbook.hoursWorked || 0),
            0
          );

          setTotalHours(total);
        }
      } catch (error) {
        console.error(
          "Error fetching internship data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [student.id]);

  if (loading) {
    return <h3>Loading internship...</h3>;
  }

  if (!assignment) {
    return <h3>No internship assigned yet.</h3>;
  }

  return (
    <div>
      <h2>My Internship</h2>

      <p>
        <strong>Internship:</strong>{" "}
        {assignment.internship.title}
      </p>

      <p>
        <strong>Company:</strong>{" "}
        {assignment.company.companyName}
      </p>

      <p>
        <strong>Location:</strong>{" "}
        {assignment.internship.location}
      </p>

      <p>
        <strong>Duration:</strong>{" "}
        {assignment.internship.duration}
      </p>

      <p>
        <strong>Eligibility:</strong>{" "}
        {assignment.internship.eligibility}
      </p>

      <p>
        <strong>Skills Required:</strong>{" "}
        {assignment.internship.skillsRequired}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {assignment.status}
      </p>

      <p>
        <strong>Total Hours Worked:</strong>{" "}
        {totalHours} / {assignment.internship.duration}
      </p>

      <p>
        <strong>Faculty Guide:</strong>{" "}
        {assignment.facultyGuide
          ? assignment.facultyGuide.name
          : "Not Assigned"}
      </p>

      <p>
        <strong>Company Guide:</strong>{" "}
        {assignment.companyGuide
          ? assignment.companyGuide.name
          : "Not Assigned"}
      </p>

      <p>
        <strong>Company Certificate:</strong>{" "}
        {assignment.certificate ? (
          <a
            href={`http://localhost:5000/${assignment.certificate}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View / Download Certificate
          </a>
        ) : (
          "Not uploaded yet"
        )}
      </p>

      <p>
        <strong>Credits:</strong>{" "}
        {totalHours > 60
          ? 2
          : "Not earned yet"}
      </p>

      <p>
        <strong>Mark:</strong>{" "}
        {assignment.mark !== null &&
        assignment.mark !== undefined
          ? assignment.mark
          : "Not given yet"}
      </p>

      {assignment.status === "Completed" &&
        assignment.mark !== null &&
        assignment.mark !== undefined &&
        onGenerateCertificate && (
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() =>
                onGenerateCertificate(
                  assignment,
                  totalHours
                )
              }
            >
              📜 Generate InterLink Certificate
            </button>
          </div>
        )}
    </div>
  );
}

export default MyInternship;