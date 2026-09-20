import React, { useEffect, useState } from "react";

function AdminDashboard({
  admin,
  onLogout,
  onChangePassword,
}) {
  const [pendingCompanies, setPendingCompanies] =
    useState([]);

  const [approvedCompanies, setApprovedCompanies] =
    useState([]);

  const [pendingColleges, setPendingColleges] =
    useState([]);

  const [approvedColleges, setApprovedColleges] =
    useState([]);

  const [searchCompany, setSearchCompany] =
    useState("");

  const [searchCollege, setSearchCollege] =
    useState("");

  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH ADMIN DATA
  // ======================================================

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [
        pendingCompanyResponse,
        approvedCompanyResponse,
        pendingCollegeResponse,
        approvedCollegeResponse,
      ] = await Promise.all([
        fetch(
          "http://localhost:5000/api/admin/pending-companies"
        ),

        fetch(
          "http://localhost:5000/api/admin/approved-companies"
        ),

        fetch(
          "http://localhost:5000/api/admin/pending-colleges"
        ),

        fetch(
          "http://localhost:5000/api/admin/approved-colleges"
        ),
      ]);

      const pendingCompanyData =
        await pendingCompanyResponse.json();

      const approvedCompanyData =
        await approvedCompanyResponse.json();

      const pendingCollegeData =
        await pendingCollegeResponse.json();

      const approvedCollegeData =
        await approvedCollegeResponse.json();

      if (
        pendingCompanyData.status === "success"
      ) {
        setPendingCompanies(
          pendingCompanyData.companies || []
        );
      }

      if (
        approvedCompanyData.status === "success"
      ) {
        setApprovedCompanies(
          approvedCompanyData.companies || []
        );
      }

      if (
        pendingCollegeData.status === "success"
      ) {
        setPendingColleges(
          pendingCollegeData.colleges || []
        );
      }

      if (
        approvedCollegeData.status === "success"
      ) {
        setApprovedColleges(
          approvedCollegeData.colleges || []
        );
      }
    } catch (error) {
      console.error(
        "Admin Dashboard Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // ======================================================
  // APPROVE COMPANY
  // ======================================================

  const handleApproveCompany = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/approve-company/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        alert("Company approved successfully");

        fetchAdminData();
      } else {
        alert(
          data.message ||
            "Failed to approve company"
        );
      }
    } catch (error) {
      console.error(
        "Approve Company Error:",
        error
      );

      alert("Unable to approve company");
    }
  };

  // ======================================================
  // REJECT COMPANY
  // ======================================================

  const handleRejectCompany = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/reject-company/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        alert("Company rejected successfully");

        fetchAdminData();
      } else {
        alert(
          data.message ||
            "Failed to reject company"
        );
      }
    } catch (error) {
      console.error(
        "Reject Company Error:",
        error
      );

      alert("Unable to reject company");
    }
  };

  // ======================================================
  // APPROVE COLLEGE
  // ======================================================

  const handleApproveCollege = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/approve-college/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        alert("College approved successfully");

        fetchAdminData();
      } else {
        alert(
          data.message ||
            "Failed to approve college"
        );
      }
    } catch (error) {
      console.error(
        "Approve College Error:",
        error
      );

      alert("Unable to approve college");
    }
  };

  // ======================================================
  // REJECT COLLEGE
  // ======================================================

  const handleRejectCollege = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/reject-college/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        alert("College rejected successfully");

        fetchAdminData();
      } else {
        alert(
          data.message ||
            "Failed to reject college"
        );
      }
    } catch (error) {
      console.error(
        "Reject College Error:",
        error
      );

      alert("Unable to reject college");
    }
  };

  // ======================================================
  // SEARCH FILTERS
  // ======================================================

  const filteredPendingCompanies =
    pendingCompanies.filter((company) =>
      company.companyName
        ?.toLowerCase()
        .includes(
          searchCompany.toLowerCase()
        )
    );

  const filteredApprovedCompanies =
    approvedCompanies.filter((company) =>
      company.companyName
        ?.toLowerCase()
        .includes(
          searchCompany.toLowerCase()
        )
    );

  const filteredPendingColleges =
    pendingColleges.filter((college) =>
      college.collegeName
        ?.toLowerCase()
        .includes(
          searchCollege.toLowerCase()
        )
    );

  const filteredApprovedColleges =
    approvedColleges.filter((college) =>
      college.collegeName
        ?.toLowerCase()
        .includes(
          searchCollege.toLowerCase()
        )
    );

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // ======================================================
  // DASHBOARD
  // ======================================================

  return (
    <div className="dashboard-container">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="dashboard-header">

        <div>
          <h1>Admin Dashboard</h1>

          {admin?.name && (
            <p>
              Welcome,{" "}
              <strong>{admin.name}</strong>
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <button
            onClick={onChangePassword}
          >
            🔐 Change Password
          </button>

          <button onClick={onLogout}>
            🚪 Logout
          </button>
        </div>

      </div>

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="dashboard-menu">

        <div className="student-info">
          <h3>Pending Companies</h3>
          <h2>{pendingCompanies.length}</h2>
        </div>

        <div className="student-info">
          <h3>Approved Companies</h3>
          <h2>{approvedCompanies.length}</h2>
        </div>

        <div className="student-info">
          <h3>Pending Colleges</h3>
          <h2>{pendingColleges.length}</h2>
        </div>

        <div className="student-info">
          <h3>Approved Colleges</h3>
          <h2>{approvedColleges.length}</h2>
        </div>

      </div>

      {/* ==================================================
          COMPANY SECTION
      ================================================== */}

      <h2>🏢 Company Management</h2>

      <input
        type="text"
        placeholder="Search company..."
        value={searchCompany}
        onChange={(e) =>
          setSearchCompany(e.target.value)
        }
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      {/* ==================================================
          PENDING COMPANIES
      ================================================== */}

      <h3>
        ⏳ Pending Company Registrations
      </h3>

      {filteredPendingCompanies.length === 0 ? (
        <p>No pending companies.</p>
      ) : (
        <div>
          {filteredPendingCompanies.map(
            (company) => (
              <div
                className="student-info"
                key={company._id}
                style={{
                  marginBottom: "15px",
                }}
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
                  {company.location ||
                    "Not provided"}
                </p>

                <p>
                  <strong>Description:</strong>{" "}
                  {company.description ||
                    "Not provided"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {company.status}
                </p>

                <div className="dashboard-menu">

                  <button
                    onClick={() =>
                      handleApproveCompany(
                        company._id
                      )
                    }
                  >
                    ✅ Approve
                  </button>

                  <button
                    onClick={() =>
                      handleRejectCompany(
                        company._id
                      )
                    }
                  >
                    ❌ Reject
                  </button>

                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ==================================================
          APPROVED COMPANIES
      ================================================== */}

      <h3>
        ✅ Approved Companies
      </h3>

      {filteredApprovedCompanies.length === 0 ? (
        <p>No approved companies.</p>
      ) : (
        <div>
          {filteredApprovedCompanies.map(
            (company) => (
              <div
                className="student-info"
                key={company._id}
                style={{
                  marginBottom: "15px",
                }}
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
                  {company.location ||
                    "Not provided"}
                </p>

                <p>
                  <strong>Description:</strong>{" "}
                  {company.description ||
                    "Not provided"}
                </p>

                <p>
                  <strong>Internships Posted:</strong>{" "}
                  {company.internships?.length || 0}
                </p>

                {company.internships &&
                  company.internships.length >
                    0 && (
                    <div>
                      <h4>
                        Posted Internships
                      </h4>

                      {company.internships.map(
                        (internship, index) => (
                          <div
                            key={
                              internship._id ||
                              index
                            }
                            style={{
                              border:
                                "1px solid #ddd",
                              padding: "10px",
                              marginBottom:
                                "10px",
                              borderRadius:
                                "6px",
                            }}
                          >
                            <p>
                              <strong>
                                Position:
                              </strong>{" "}
                              {internship.position ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Eligibility:
                              </strong>{" "}
                              {internship.eligibility ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Skills Required:
                              </strong>{" "}
                              {internship.skillsRequired ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Duration:
                              </strong>{" "}
                              {internship.duration ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Deadline:
                              </strong>{" "}
                              {internship.deadline ||
                                "Not provided"}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}

              </div>
            )
          )}
        </div>
      )}

      {/* ==================================================
          COLLEGE SECTION
      ================================================== */}

      <h2>🎓 College Management</h2>

      <input
        type="text"
        placeholder="Search college..."
        value={searchCollege}
        onChange={(e) =>
          setSearchCollege(e.target.value)
        }
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      {/* ==================================================
          PENDING COLLEGES
      ================================================== */}

      <h3>
        ⏳ Pending College Registrations
      </h3>

      {filteredPendingColleges.length === 0 ? (
        <p>No pending colleges.</p>
      ) : (
        <div>
          {filteredPendingColleges.map(
            (college) => (
              <div
                className="student-info"
                key={college._id}
                style={{
                  marginBottom: "15px",
                }}
              >
                <h3>
                  {college.collegeName}
                </h3>

                <p>
                  <strong>College Code:</strong>{" "}
                  {college.collegeCode}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {college.email}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {college.phone ||
                    "Not provided"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {college.location ||
                    "Not provided"}
                </p>

                <p>
                  <strong>Website:</strong>{" "}
                  {college.website ||
                    "Not provided"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {college.status}
                </p>

                <div className="dashboard-menu">

                  <button
                    onClick={() =>
                      handleApproveCollege(
                        college._id
                      )
                    }
                  >
                    ✅ Approve
                  </button>

                  <button
                    onClick={() =>
                      handleRejectCollege(
                        college._id
                      )
                    }
                  >
                    ❌ Reject
                  </button>

                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ==================================================
          APPROVED COLLEGES
      ================================================== */}

      <h3>
        ✅ Approved Colleges
      </h3>

      {filteredApprovedColleges.length === 0 ? (
        <p>No approved colleges.</p>
      ) : (
        <div>
          {filteredApprovedColleges.map(
            (college) => (
              <div
                className="student-info"
                key={college._id}
                style={{
                  marginBottom: "15px",
                }}
              >
                <h3>
                  {college.collegeName}
                </h3>

                <p>
                  <strong>College Code:</strong>{" "}
                  {college.collegeCode}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {college.email}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {college.phone ||
                    "Not provided"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {college.location ||
                    "Not provided"}
                </p>

                <p>
                  <strong>Website:</strong>{" "}
                  {college.website ||
                    "Not provided"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {college.status}
                </p>

                <p>
                  <strong>
                    Registered:
                  </strong>{" "}
                  {college.createdAt
                    ? new Date(
                        college.createdAt
                      ).toLocaleDateString()
                    : "Not available"}
                </p>

              </div>
            )
          )}
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;