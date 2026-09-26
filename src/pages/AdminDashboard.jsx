import React, { useEffect, useState } from "react";
import "../css/AdminDashboard.css";

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
      <div className="admin-loading-screen">

        <div className="admin-loading-logo">
          <span className="logo-i">I</span>
          <span className="logo-arrow">↗</span>
        </div>

        <h2>InterLink</h2>

        <p>
          Loading Admin Dashboard...
        </p>

      </div>
    );
  }

  // ======================================================
  // DASHBOARD
  // ======================================================

  return (
    <div className="admin-dashboard">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="admin-sidebar">

        {/* LOGO */}

        <div className="admin-brand">

          <div className="admin-brand-logo">
            <span className="logo-i">I</span>
            <span className="logo-arrow">↗</span>
          </div>

          <div className="admin-brand-text">

            <div className="admin-brand-name">
              InternLink
            </div>

            <div className="admin-brand-tagline">
              FYUGP INTERNSHIP PLATFORM
            </div>

          </div>

        </div>

        {/* WORKSPACE */}

        <div className="sidebar-label">
          WORKSPACE
        </div>

        <nav className="admin-navigation">

          <a
            href="#admin-overview"
            className="admin-nav-item active"
          >
            <span className="admin-nav-icon">
              ◇
            </span>

            <span>
              Dashboard
            </span>
          </a>

          <a
            href="#company-management"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ◉
            </span>

            <span>
              Companies
            </span>

            <span className="nav-count">
              {pendingCompanies.length}
            </span>
          </a>

          <a
            href="#college-management"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ◈
            </span>

            <span>
              Colleges
            </span>

            <span className="nav-count college-count">
              {pendingColleges.length}
            </span>
          </a>

          <a
            href="#company-management"
            className="admin-nav-item"
          >
            

          </a>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="admin-user">

            <div className="admin-avatar">
              {admin?.name
                ? admin.name
                    .charAt(0)
                    .toUpperCase()
                : "A"}
            </div>

            <div className="admin-user-info">

              <strong>
                {admin?.name || "Admin"}
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

          <div className="sidebar-divider"></div>

          <button
            className="sidebar-action"
            onClick={onChangePassword}
          >
            🔐
            <span>
              Change Password
            </span>
          </button>

          <button
            className="sidebar-action logout-action"
            onClick={onLogout}
          >
            ↪
            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="admin-main">

        {/* ==================================================
            OVERVIEW
        ================================================== */}

        <section
          id="admin-overview"
          className="admin-overview"
        >

          <div className="overview-heading">

            <div>

              <span className="section-eyebrow">
                ADMINISTRATION
              </span>

              <h1>
                Admin Dashboard
              </h1>

              {admin?.name && (
                <p>
                  Welcome,{" "}
                  <strong>
                    {admin.name}
                  </strong>
                  . Manage the InterLink
                  platform from one place.
                </p>
              )}

            </div>

          </div>

          {/* SUMMARY CARDS */}

          <div className="admin-summary">

            <div className="summary-card pending-summary">

              <div className="summary-icon">
                ⏳
              </div>

              <div>
                <span>
                  Pending Companies
                </span>

                <strong>
                  {pendingCompanies.length}
                </strong>
              </div>

            </div>

            <div className="summary-card approved-summary">

              <div className="summary-icon">
                ✓
              </div>

              <div>
                <span>
                  Approved Companies
                </span>

                <strong>
                  {approvedCompanies.length}
                </strong>
              </div>

            </div>

            <div className="summary-card college-summary">

              <div className="summary-icon">
                ◈
              </div>

              <div>
                <span>
                  Pending Colleges
                </span>

                <strong>
                  {pendingColleges.length}
                </strong>
              </div>

            </div>

            <div className="summary-card approved-college-summary">

              <div className="summary-icon">
                ✓
              </div>

              <div>
                <span>
                  Approved Colleges
                </span>

                <strong>
                  {approvedColleges.length}
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            COMPANY MANAGEMENT
        ================================================== */}

        <section
          id="company-management"
          className="management-section"
        >

          <details
            className="management-details"
            open
          >

            <summary className="management-summary">

              <div>

                <span className="section-eyebrow">
                  ORGANIZATIONS
                </span>

                <h2>
                  Company Management
                </h2>

                <p>
                  Review and manage companies
                  registered on InterLink.
                </p>

              </div>

              <div className="summary-open-icon">
                +
              </div>

            </summary>


            <div className="management-content">

              {/* ==================================================
                  PENDING COMPANIES
              ================================================== */}

              <div className="subsection-block">

                <div className="subsection-title">

                  <div className="subsection-title-left">

                    <span className="status-dot pending"></span>

                    <h3>
                      Pending Company Registrations
                    </h3>

                    <span className="section-number pending-number">
                      {filteredPendingCompanies.length}
                    </span>

                  </div>

                </div>


                {filteredPendingCompanies.length === 0 ? (

                  <div className="empty-state">

                    <div className="empty-icon">
                      ✓
                    </div>

                    <h4>
                      No pending companies
                    </h4>

                    <p>
                      There are no company
                      registrations waiting
                      for approval.
                    </p>

                  </div>

                ) : (

                  <div className="company-grid">

                    {filteredPendingCompanies.map(
                      (company) => (

                        <div
                          className="organization-card"
                          key={company._id}
                        >

                          <div className="organization-card-top">

                            <div className="organization-avatar company-avatar">
                              {company.companyName
                                ?.charAt(0)
                                ?.toUpperCase() || "C"}
                            </div>

                            <div>

                              <h3>
                                {company.companyName}
                              </h3>

                              <span className="pending-badge">
                                Pending
                              </span>

                            </div>

                          </div>


                          <div className="organization-details">

                            <p>
                              <strong>
                                Email:
                              </strong>{" "}
                              {company.email}
                            </p>

                            <p>
                              <strong>
                                Location:
                              </strong>{" "}
                              {company.location ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Description:
                              </strong>{" "}
                              {company.description ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Status:
                              </strong>{" "}
                              {company.status}
                            </p>

                          </div>


                          <div className="organization-actions">

                            <button
                              className="approve-button"
                              onClick={() =>
                                handleApproveCompany(
                                  company._id
                                )
                              }
                            >
                              ✓ Approve
                            </button>

                            <button
                              className="reject-button"
                              onClick={() =>
                                handleRejectCompany(
                                  company._id
                                )
                              }
                            >
                              × Reject
                            </button>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>


              {/* ==================================================
                  APPROVED COMPANIES
              ================================================== */}

              <div className="subsection-block approved-block">

                <div className="subsection-title approved-heading">

                  <div className="subsection-title-left">

                    <span className="status-dot approved"></span>

                    <h3>
                      Approved Companies
                    </h3>

                    <span className="section-number approved-number">
                      {filteredApprovedCompanies.length}
                    </span>

                  </div>


                  {/* SEARCH BESIDE APPROVED COMPANIES */}

                  <div className="admin-search-wrapper">

                    <span>
                      ⌕
                    </span>

                    <input
                      type="text"
                      placeholder="Search companies..."
                      value={searchCompany}
                      onChange={(e) =>
                        setSearchCompany(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>


                {filteredApprovedCompanies.length === 0 ? (

                  <div className="empty-state">

                    <div className="empty-icon green-empty">
                      ◉
                    </div>

                    <h4>
                      No approved companies
                    </h4>

                    <p>
                      There are currently no
                      approved companies.
                    </p>

                  </div>

                ) : (

                  <div className="company-grid">

                    {filteredApprovedCompanies.map(
                      (company) => (

                        <div
                          className="organization-card approved-card"
                          key={company._id}
                        >

                          <div className="organization-card-top">

                            <div className="organization-avatar company-avatar">
                              {company.companyName
                                ?.charAt(0)
                                ?.toUpperCase() || "C"}
                            </div>

                            <div>

                              <h3>
                                {company.companyName}
                              </h3>

                              <span className="approved-badge">
                                Approved
                              </span>

                            </div>

                          </div>


                          <div className="organization-details">

                            <p>
                              <strong>
                                Email:
                              </strong>{" "}
                              {company.email}
                            </p>

                            <p>
                              <strong>
                                Location:
                              </strong>{" "}
                              {company.location ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Description:
                              </strong>{" "}
                              {company.description ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Internships Posted:
                              </strong>{" "}
                              {company.internships?.length ||
                                0}
                            </p>

                          </div>


                          {/* ==================================================
                              POSTED INTERNSHIPS
                          ================================================== */}

                          {company.internships &&
                            company.internships.length >
                              0 && (

                              <div className="internship-section">

                                <div className="internship-section-header">

                                  <h4>
                                    Posted Internships
                                  </h4>

                                  <span>
                                    {company.internships.length}
                                  </span>

                                </div>


                                <div className="internship-list">

                                  {company.internships.map(
                                    (
                                      internship,
                                      index
                                    ) => (

                                      <div
                                        className="internship-card"
                                        key={
                                          internship._id ||
                                          index
                                        }
                                      >

                                        <div className="internship-card-heading">

                                          <div className="internship-icon">
                                            ✦
                                          </div>

                                          <div>

                                            <strong>
                                              {internship.position ||
                                                "Not provided"}
                                            </strong>

                                            <span>
                                              Internship
                                            </span>

                                          </div>

                                        </div>


                                        <div className="internship-info-grid">

                                          <div>
                                            <label>
                                              Eligibility
                                            </label>

                                            <p>
                                              {internship.eligibility ||
                                                "Not provided"}
                                            </p>
                                          </div>

                                          <div>
                                            <label>
                                              Skills Required
                                            </label>

                                            <p>
                                              {internship.skillsRequired ||
                                                "Not provided"}
                                            </p>
                                          </div>

                                          <div>
                                            <label>
                                              Duration
                                            </label>

                                            <p>
                                              {internship.duration ||
                                                "Not provided"}
                                            </p>
                                          </div>

                                          <div>
                                            <label>
                                              Deadline
                                            </label>

                                            <p>
                                              {internship.deadline ||
                                                "Not provided"}
                                            </p>
                                          </div>

                                        </div>

                                      </div>

                                    )
                                  )}

                                </div>

                              </div>

                            )}

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>

          </details>

        </section>


        {/* ==================================================
            COLLEGE MANAGEMENT
        ================================================== */}

        <section
          id="college-management"
          className="management-section"
        >

          <details
            className="management-details"
          >

            <summary className="management-summary">

              <div>

                <span className="section-eyebrow">
                  EDUCATION
                </span>

                <h2>
                  College Management
                </h2>

                <p>
                  Review and manage registered
                  FYUGP colleges.
                </p>

              </div>

              <div className="summary-open-icon">
                +
              </div>

            </summary>


            <div className="management-content">

              {/* ==================================================
                  PENDING COLLEGES
              ================================================== */}

              <div className="subsection-block">

                <div className="subsection-title">

                  <div className="subsection-title-left">

                    <span className="status-dot pending"></span>

                    <h3>
                      Pending College Registrations
                    </h3>

                    <span className="section-number pending-number">
                      {filteredPendingColleges.length}
                    </span>

                  </div>

                </div>


                {filteredPendingColleges.length === 0 ? (

                  <div className="empty-state">

                    <div className="empty-icon">
                      ✓
                    </div>

                    <h4>
                      No pending colleges
                    </h4>

                    <p>
                      There are no college
                      registrations waiting
                      for approval.
                    </p>

                  </div>

                ) : (

                  <div className="college-grid">

                    {filteredPendingColleges.map(
                      (college) => (

                        <div
                          className="organization-card"
                          key={college._id}
                        >

                          <div className="organization-card-top">

                            <div className="organization-avatar college-avatar">
                              {college.collegeName
                                ?.charAt(0)
                                ?.toUpperCase() || "C"}
                            </div>

                            <div>

                              <h3>
                                {college.collegeName}
                              </h3>

                              <span className="pending-badge">
                                Pending
                              </span>

                            </div>

                          </div>


                          <div className="organization-details">

                            <p>
                              <strong>
                                College Code:
                              </strong>{" "}
                              {college.collegeCode}
                            </p>

                            <p>
                              <strong>
                                Email:
                              </strong>{" "}
                              {college.email}
                            </p>

                            <p>
                              <strong>
                                Phone:
                              </strong>{" "}
                              {college.phone ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Location:
                              </strong>{" "}
                              {college.location ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Website:
                              </strong>{" "}
                              {college.website ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Status:
                              </strong>{" "}
                              {college.status}
                            </p>

                          </div>


                          <div className="organization-actions">

                            <button
                              className="approve-button"
                              onClick={() =>
                                handleApproveCollege(
                                  college._id
                                )
                              }
                            >
                              ✓ Approve
                            </button>

                            <button
                              className="reject-button"
                              onClick={() =>
                                handleRejectCollege(
                                  college._id
                                )
                              }
                            >
                              × Reject
                            </button>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>


              {/* ==================================================
                  APPROVED COLLEGES
              ================================================== */}

              <div className="subsection-block approved-block">

                <div className="subsection-title approved-heading">

                  <div className="subsection-title-left">

                    <span className="status-dot approved"></span>

                    <h3>
                      Approved Colleges
                    </h3>

                    <span className="section-number approved-number">
                      {filteredApprovedColleges.length}
                    </span>

                  </div>


                  {/* SEARCH BESIDE APPROVED COLLEGES */}

                  <div className="admin-search-wrapper">

                    <span>
                      ⌕
                    </span>

                    <input
                      type="text"
                      placeholder="Search colleges..."
                      value={searchCollege}
                      onChange={(e) =>
                        setSearchCollege(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>


                {filteredApprovedColleges.length === 0 ? (

                  <div className="empty-state">

                    <div className="empty-icon green-empty">
                      ◉
                    </div>

                    <h4>
                      No approved colleges
                    </h4>

                    <p>
                      There are currently no
                      approved colleges.
                    </p>

                  </div>

                ) : (

                  <div className="college-grid">

                    {filteredApprovedColleges.map(
                      (college) => (

                        <div
                          className="organization-card approved-card"
                          key={college._id}
                        >

                          <div className="organization-card-top">

                            <div className="organization-avatar college-avatar">
                              {college.collegeName
                                ?.charAt(0)
                                ?.toUpperCase() || "C"}
                            </div>

                            <div>

                              <h3>
                                {college.collegeName}
                              </h3>

                              <span className="approved-badge">
                                Approved
                              </span>

                            </div>

                          </div>


                          <div className="organization-details">

                            <p>
                              <strong>
                                College Code:
                              </strong>{" "}
                              {college.collegeCode}
                            </p>

                            <p>
                              <strong>
                                Email:
                              </strong>{" "}
                              {college.email}
                            </p>

                            <p>
                              <strong>
                                Phone:
                              </strong>{" "}
                              {college.phone ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Location:
                              </strong>{" "}
                              {college.location ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Website:
                              </strong>{" "}
                              {college.website ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Status:
                              </strong>{" "}
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

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>

          </details>

        </section>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="admin-footer">

          <div className="footer-brand-small">

            <div className="footer-mini-logo">
              <span className="logo-i">I</span>
              <span className="logo-arrow">↗</span>
            </div>

            <strong>
              InterLink
            </strong>

          </div>

          <span>
            FYUGP Internship Management Platform
          </span>

        </footer>

      </main>

    </div>
  );
}

export default AdminDashboard;