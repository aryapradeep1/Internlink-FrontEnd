import React, { useEffect, useState } from "react";

function MyInternship({ student }) {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/internship-assignments/student/${student.id}`
        );

        const data = await response.json();

        if (data.status === "success") {
          setAssignment(data.assignment);
        }
      } catch (error) {
        console.error("Error fetching internship:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
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
        <strong>Faculty Guide:</strong>{" "}
        {assignment.facultyGuide
          ? assignment.facultyGuide.name
          : "Not Assigned"}
      </p>

      <p>
        <strong>Credits:</strong>{" "}
        {assignment.credits}
      </p>

      <p>
        <strong>Mark:</strong>{" "}
        {assignment.mark !== null
          ? assignment.mark
          : "Not given yet"}
      </p>
    </div>
  );
}

export default MyInternship;