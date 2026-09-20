import { useEffect, useState } from "react";

function CompanyDashboard({
  company,
  onLogout,
  onPostInternship,
  onGoToProfile,
}) {
  const [applications, setApplications] = useState([]);
  const [guides, setGuides] = useState([]);

  const [loading, setLoading] = useState(true);
  const [guidesLoading, setGuidesLoading] = useState(true);

  const [error, setError] = useState("");
  const [guideError, setGuideError] = useState("");

  // =====================================================
  // GET COMPANY ID
  // =====================================================

  const getCompanyId = () => {
    return company?.id || company?._id;
  };

  // =====================================================
  // FETCH APPLICATIONS
  // =====================================================

  const fetchApplications = async () => {
    try {
      const companyId = getCompanyId();

      if (!companyId) {
        setError("Company information not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/applications/company/${companyId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch applications"
        );
      }

      setApplications(data.applications || []);
      setError("");
    } catch (error) {
      console.error("Application fetch error:", error);
      setError("Unable to load applications");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH COMPANY GUIDES
  // =====================================================

  const fetchGuides = async () => {
    try {
      const companyId = getCompanyId();

      if (!companyId) {
        setGuideError("Company information not found");
        setGuidesLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/company-guides/company/${companyId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch Company Guides"
        );
      }

      setGuides(data.guides || []);
      setGuideError("");
    } catch (error) {
      console.error(
        "Company Guide fetch error:",
        error
      );

      setGuideError(
        "Unable to load Company Guides"
      );
    } finally {
      setGuidesLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchApplications();
    fetchGuides();
  }, [company]);

  // =====================================================
  // UPDATE APPLICATION STATUS
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
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update status"
        );
      }

      setApplications(
        (previousApplications) =>
          previousApplications.map(
            (application) =>
              application._id === applicationId
                ? {
                    ...application,
                    status,
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
  // UPDATE COMPANY GUIDE STATUS
  // =====================================================

  const updateGuideStatus = async (
    guideId,
    status
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/company-guides/status/${guideId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update Company Guide status"
        );
      }

      setGuides(
        (previousGuides) =>
          previousGuides.map(
            (guide) =>
              guide._id === guideId
                ? {
                    ...guide,
                    status,
                  }
                : guide
          )
      );

      alert(data.message);
    } catch (error) {
      console.error(
        "Company Guide status error:",
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

    if (!assignmentId) {
      alert(
        "Internship assignment not found"
      );
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
            companyGuideId,
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

      fetchApplications();
    } catch (error) {
      console.error(
        "Assign Company Guide Error:",
        error
      );

      alert(error.message);
    }
  };

  // =====================================================
  // FILTER GUIDES
  // =====================================================

  const pendingGuides = guides.filter(
    (guide) =>
      guide.status === "Pending"
  );

  const approvedGuides = guides.filter(
    (guide) =>
      guide.status === "Approved"
  );

  const rejectedGuides = guides.filter(
    (guide) =>
      guide.status === "Rejected"
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="company-dashboard-container">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <h1>
        Welcome, {company?.companyName}!
      </h1>

      <p>
        Manage internship applications
        and Company Guides.
      </p>

      {/* ================================================= */}
      {/* DASHBOARD BUTTONS */}
      {/* ================================================= */}

      <button onClick={onGoToProfile}>
        👤 My Profile
      </button>

      <button onClick={onPostInternship}>
        + Post Internship Opportunity
      </button>

      <hr />

      {/* ================================================= */}
      {/* COMPANY GUIDES */}
      {/* ================================================= */}

      <h2>
        👨‍💼 Company Guides / Employees
      </h2>

      <p>
        Manage employees registered as
        Company Guides for your company.
      </p>

      {guidesLoading && (
        <p>
          Loading Company Guides...
        </p>
      )}

      {guideError && (
        <p style={{ color: "red" }}>
          {guideError}
        </p>
      )}

      {!guidesLoading &&
        !guideError &&
        guides.length === 0 && (
          <p>
            No Company Guides registered
            for your company.
          </p>
        )}

      {/* ================================================= */}
      {/* PENDING GUIDES */}
      {/* ================================================= */}

      {!guidesLoading &&
        pendingGuides.length > 0 && (
          <div>

            <h3>
              Pending Company Guides
            </h3>

            {pendingGuides.map(
              (guide) => (
                <div
                  className="application-card"
                  key={guide._id}
                >

                  <h4>
                    {guide.name}
                  </h4>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {guide.email}
                  </p>

                  <p>
                    <strong>
                      Employee ID:
                    </strong>{" "}
                    {guide.employeeId}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {guide.status}
                  </p>

                  <button
                    onClick={() =>
                      updateGuideStatus(
                        guide._id,
                        "Approved"
                      )
                    }
                  >
                    ✅ Approve
                  </button>

                  <button
                    onClick={() =>
                      updateGuideStatus(
                        guide._id,
                        "Rejected"
                      )
                    }
                  >
                    ❌ Reject
                  </button>

                </div>
              )
            )}

          </div>
        )}

      {/* ================================================= */}
      {/* APPROVED GUIDES */}
      {/* ================================================= */}

      {!guidesLoading &&
        approvedGuides.length > 0 && (
          <div>

            <h3>
              Approved Company Guides
            </h3>

            {approvedGuides.map(
              (guide) => (
                <div
                  className="application-card"
                  key={guide._id}
                >

                  <h4>
                    {guide.name}
                  </h4>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {guide.email}
                  </p>

                  <p>
                    <strong>
                      Employee ID:
                    </strong>{" "}
                    {guide.employeeId}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {guide.status}
                  </p>

                </div>
              )
            )}

          </div>
        )}

      {/* ================================================= */}
      {/* REJECTED GUIDES */}
      {/* ================================================= */}

      {!guidesLoading &&
        rejectedGuides.length > 0 && (
          <div>

            <h3>
              Rejected Company Guides
            </h3>

            {rejectedGuides.map(
              (guide) => (
                <div
                  className="application-card"
                  key={guide._id}
                >

                  <h4>
                    {guide.name}
                  </h4>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {guide.email}
                  </p>

                  <p>
                    <strong>
                      Employee ID:
                    </strong>{" "}
                    {guide.employeeId}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {guide.status}
                  </p>

                </div>
              )
            )}

          </div>
        )}

      <hr />

      {/* ================================================= */}
      {/* APPLICATIONS */}
      {/* ================================================= */}

      <h2>
        Applications Received
      </h2>

      {loading && (
        <p>
          Loading applications...
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
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

              {/* ========================================= */}
              {/* STUDENT DETAILS */}
              {/* ========================================= */}

              <h3>
                {application.student?.name}
              </h3>

              <p>
                <strong>
                  Email:
                </strong>{" "}
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

              {/* ========================================= */}
              {/* INTERNSHIP DETAILS */}
              {/* ========================================= */}

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

              {/* ========================================= */}
              {/* APPLICATION STATUS */}
              {/* ========================================= */}

              <hr />

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {application.status}
              </p>

              {/* ========================================= */}
              {/* STUDENT DOCUMENTS */}
              {/* ========================================= */}

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

              {/* ========================================= */}
              {/* COMPANY ACTIONS */}
              {/* ========================================= */}

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

              {/* ========================================= */}
              {/* COMPANY APPROVED */}
              {/* ========================================= */}

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

              {/* ========================================= */}
              {/* COLLEGE APPROVED */}
              {/* ========================================= */}

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

                        {approvedGuides.map(
                          (guide) => (
                            <option
                              key={guide._id}
                              value={guide._id}
                            >
                              {guide.name} -{" "}
                              {
                                guide.employeeId
                              }
                            </option>
                          )
                        )}

                      </select>

                      {approvedGuides.length ===
                        0 && (
                        <p>
                          No approved Company
                          Guides available.
                        </p>
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* ========================================= */}
              {/* COMPANY REJECTED */}
              {/* ========================================= */}

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

      {/* ================================================= */}
      {/* LOGOUT */}
      {/* ================================================= */}

      <button onClick={onLogout}>
        Logout
      </button>

    </div>
  );
}

export default CompanyDashboard;