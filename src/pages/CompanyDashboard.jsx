import { useEffect, useState } from "react";

function CompanyDashboard({
  company,
  onLogout,
  onPostInternship,
}) {
  const [applications, setApplications] = useState([]);
  const [guides, setGuides] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH APPLICATIONS FOR THIS COMPANY
  // =====================================================

  const fetchApplications = async () => {
    try {
      const companyId = company?.id || company?._id;

      if (!companyId) {
        setError("Company information not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/applications/company/${companyId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();

      setApplications(data.applications || []);
      setLoading(false);
    } catch (error) {
      console.error("Application fetch error:", error);

      setError("Unable to load applications");
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH APPROVED COMPANY GUIDES
  // =====================================================

  const fetchGuides = async () => {
    try {
      const companyId = company?.id || company?._id;

      if (!companyId) {
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/company-guides/company/${companyId}`
      );

      const data = await response.json();

      if (data.status === "success") {
        setGuides(data.guides || []);
      }
    } catch (error) {
      console.error("Company Guide fetch error:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchGuides();
  }, [company]);

  // =====================================================
  // COMPANY APPROVE / REJECT APPLICATION
  // =====================================================

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/status/${applicationId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      setApplications(
        (previousApplications) =>
          previousApplications.map(
            (application) =>
              application._id === applicationId
                ? {
                    ...application,
                    status: status,
                  }
                : application
          )
      );

      alert(data.message);
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      alert(error.message);
    }
  };

  // =====================================================
  // ASSIGN COMPANY GUIDE
  // =====================================================

  const assignCompanyGuide = async (
    assignmentId,
    companyGuideId
  ) => {
    if (!companyGuideId) {
      alert("Please select a Company Guide");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/internship-assignments/company-guide/${assignmentId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            companyGuideId: companyGuideId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to assign Company Guide"
        );
      }

      alert(data.message);

      // Refresh applications after assignment
      fetchApplications();
    } catch (error) {
      console.error(
        "Assign Company Guide Error:",
        error
      );

      alert(error.message);
    }
  };

  return (
    <div className="company-dashboard-container">

      <h1>
        Welcome, {company?.companyName}!
      </h1>

      <p>
        Manage internship applications
        received from students.
      </p>

      <button onClick={onPostInternship}>
        + Post Internship Opportunity
      </button>

      <hr />

      <h2>
        Applications Received
      </h2>

      {loading && (
        <p>
          Loading applications...
        </p>
      )}

      {error && (
        <p>
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        applications.length === 0 && (
          <p>
            No applications received yet.
          </p>
        )}

      {!loading &&
        !error &&
        applications.map(
          (application) => (
            <div
              className="application-card"
              key={application._id}
            >

              {/* ============================= */}
              {/* STUDENT DETAILS */}
              {/* ============================= */}

              <h3>
                {application.student?.name}
              </h3>

              <p>
                <strong>Email:</strong>{" "}
                {application.student?.email}
              </p>

              <p>
                <strong>
                  Register Number:
                </strong>{" "}
                {
                  application.student
                    ?.registerNumber
                }
              </p>

              <p>
                <strong>
                  Department:
                </strong>{" "}
                {
                  application.student
                    ?.department
                }
              </p>

              <p>
                <strong>
                  Semester:
                </strong>{" "}
                {
                  application.student
                    ?.semester
                }
              </p>

              <p>
                <strong>
                  Phone:
                </strong>{" "}
                {
                  application.student
                    ?.phone
                }
              </p>

              {/* ============================= */}
              {/* INTERNSHIP DETAILS */}
              {/* ============================= */}

              <hr />

              <h4>
                Internship Details
              </h4>

              <p>
                <strong>
                  Position:
                </strong>{" "}
                {application.position}
              </p>

              <p>
                <strong>
                  Internship:
                </strong>{" "}
                {
                  application.internship
                    ?.title
                }
              </p>

              <p>
                <strong>
                  Location:
                </strong>{" "}
                {
                  application.internship
                    ?.location
                }
              </p>

              <p>
                <strong>
                  Duration:
                </strong>{" "}
                {
                  application.internship
                    ?.duration
                }
              </p>

              {/* ============================= */}
              {/* APPLICATION STATUS */}
              {/* ============================= */}

              <hr />

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {application.status}
              </p>

              {/* ============================= */}
              {/* STUDENT DOCUMENTS */}
              {/* ============================= */}

              {application.resume && (
                <p>
                  <strong>
                    CV / Resume:
                  </strong>{" "}
                  <a
                    href={`http://localhost:5000/${application.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View CV
                  </a>
                </p>
              )}

              {application.markList && (
                <p>
                  <strong>
                    Mark List:
                  </strong>{" "}
                  <a
                    href={`http://localhost:5000/${application.markList}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Mark List
                  </a>
                </p>
              )}

              {/* ============================= */}
              {/* COMPANY ACTIONS */}
              {/* ============================= */}

              {application.status ===
                "Pending" && (
                <div>

                  <button
                    onClick={() =>
                      updateStatus(
                        application._id,
                        "CompanyApproved"
                      )
                    }
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        application._id,
                        "CompanyRejected"
                      )
                    }
                  >
                    Reject
                  </button>

                </div>
              )}

              {/* ============================= */}
              {/* COMPANY APPROVED */}
              {/* ============================= */}

              {application.status ===
                "CompanyApproved" && (
                <div>

                  <p>
                    <strong>
                      Application approved by
                      company.
                    </strong>
                  </p>

                  <p>
                    Waiting for college
                    verification.
                  </p>

                </div>
              )}

              {/* ============================= */}
              {/* COLLEGE APPROVED */}
              {/* ============================= */}

              {application.status ===
                "CollegeApproved" && (
                <div>

                  <hr />

                  <h4>
                    Company Guide
                  </h4>

                  {application.companyGuide ? (
                    <div>

                      <p>
                        <strong>
                          Name:
                        </strong>{" "}
                        {
                          application
                            .companyGuide
                            ?.name
                        }
                      </p>

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {
                          application
                            .companyGuide
                            ?.email
                        }
                      </p>

                      <p>
                        <strong>
                          Employee ID:
                        </strong>{" "}
                        {
                          application
                            .companyGuide
                            ?.employeeId
                        }
                      </p>

                      <p>
                        Company Guide already
                        assigned.
                      </p>

                    </div>
                  ) : (
                    <div>

                      <p>
                        <strong>
                          Assign a Company Guide
                        </strong>
                      </p>

                      <select
                        defaultValue=""
                        onChange={(event) =>
                          assignCompanyGuide(
                            application
                              .assignmentId,
                            event.target.value
                          )
                        }
                      >
                        <option value="">
                          Select Company Guide
                        </option>

                        {guides.map(
                          (guide) => (
                            <option
                              key={guide._id}
                              value={guide._id}
                            >
                              {guide.name} -{" "}
                              {guide.employeeId}
                            </option>
                          )
                        )}

                      </select>

                      {guides.length === 0 && (
                        <p>
                          No approved Company
                          Guides available.
                        </p>
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* ============================= */}
              {/* COMPANY REJECTED */}
              {/* ============================= */}

              {application.status ===
                "CompanyRejected" && (
                <p>
                  Company rejected this
                  application.
                </p>
              )}

            </div>
          )
        )}

      <br />

      <button onClick={onLogout}>
        Logout
      </button>

    </div>
  );
}

export default CompanyDashboard;