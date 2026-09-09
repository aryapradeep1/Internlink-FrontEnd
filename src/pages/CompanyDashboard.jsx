import { useEffect, useState } from "react";

function CompanyDashboard({
  company,
  onLogout,
  onPostInternship,
}) {
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH APPLICATIONS FOR THIS COMPANY
  // =====================================================

  useEffect(() => {
    const companyId =
      company?.id || company?._id;

    console.log(
      "COMPANY OBJECT:",
      company
    );

    console.log(
      "COMPANY ID:",
      companyId
    );

    if (!companyId) {
      console.log(
        "Company ID not found"
      );

      setError(
        "Company information not found"
      );

      setLoading(false);

      return;
    }

    console.log(
      "Fetching applications for company:",
      companyId
    );

    fetch(
      `http://localhost:5000/api/applications/company/${companyId}`
    )
      .then((response) => {

        console.log(
          "Application response status:",
          response.status
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch applications"
          );
        }

        return response.json();
      })
      .then((data) => {

        console.log(
          "APPLICATIONS RECEIVED:",
          data
        );

        setApplications(
          data.applications || []
        );

        setLoading(false);
      })
      .catch((error) => {

        console.error(
          "Application fetch error:",
          error
        );

        setError(
          "Unable to load applications"
        );

        setLoading(false);
      });
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
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update status"
        );
      }

      // Update application in frontend
      setApplications(
        (previousApplications) =>
          previousApplications.map(
            (application) =>
              application._id ===
              applicationId
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

  return (
    <div className="company-dashboard-container">

      <h1>
        Welcome,{" "}
        {company?.companyName}!
      </h1>

      <p>
        Manage internship applications
        received from students.
      </p>

      <button
        onClick={onPostInternship}
      >
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
              {/* APPLICATION DETAILS */}
              {/* ============================= */}

              <p>
                <strong>
                  Why Apply:
                </strong>{" "}
                {application.whyApply}
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {application.status}
              </p>

              {application.resume && (
                <p>
                  <strong>
                    Resume:
                  </strong>{" "}
                  {application.resume}
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
              {/* AFTER COMPANY APPROVAL */}
              {/* ============================= */}

              {application.status ===
                "CompanyApproved" && (
                <p>
                  <strong>
                    Waiting for college
                    verification.
                  </strong>
                </p>
              )}

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