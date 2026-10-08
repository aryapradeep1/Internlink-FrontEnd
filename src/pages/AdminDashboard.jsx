import React, { useEffect, useRef, useState } from "react";
import "../css/AdminDashboard.css";

function AdminDashboard({
  admin,
  onLogout,
  onChangePassword,
  children,
}) {
  const adminContentRef = useRef(null);

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

  const resetAdminContentScroll = () => {
    const content = adminContentRef.current;
    if (!content) return;

    const { overflowY } = window.getComputedStyle(content);
    if (overflowY === "auto" || overflowY === "scroll") {
      content.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

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

  useEffect(() => {
    if (!loading || children) {
      resetAdminContentScroll();
    }
  }, [loading, children]);

  useEffect(() => {
    const resetAfterSectionNavigation = () => {
      window.setTimeout(resetAdminContentScroll, 0);
    };

    window.addEventListener("hashchange", resetAfterSectionNavigation);
    return () => {
      window.removeEventListener("hashchange", resetAfterSectionNavigation);
    };
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

  if (loading && !children) {
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
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ◇
            </span>

            <span>
              Dashboard
            </span>
          </a>

          <a
            href="#admin-companies"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ◉
            </span>

            <span>
              Companies
            </span>

          </a>

          <a
            href="#admin-colleges"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ◈
            </span>

            <span>
              Colleges
            </span>

          </a>

          <a href="#admin-requests" className="admin-nav-item">
            <span className="admin-nav-icon">◷</span>
            <span>Pending Requests</span>
          </a>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="sidebar-label account-label">ACCOUNT</div>

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

          <a
            href="#admin-change-password"
            className="sidebar-action"
            onClick={onChangePassword}
          >
            🔐
            <span>
              Change Password
            </span>
          </a>

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

      <main className="admin-main" ref={adminContentRef}>
        <header className="admin-topbar">
          <div className="admin-topbar-heading"><span>INTERNLINK / ADMIN</span><strong>Administration workspace</strong></div>
          <div className="admin-topbar-user"><span className="topbar-avatar">{admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}</span><span><strong>{admin?.name || "Admin"}</strong><small>Administrator</small></span></div>
        </header>
        {children && <section id="admin-change-password" className="admin-integrated-page">{children}</section>}

        {/* ==================================================
            OVERVIEW
        ================================================== */}

        <section
          id="admin-overview"
          className="admin-overview"
        >
          <div className="admin-welcome-hero">
            <div className="hero-copy">
              <span className="hero-kicker"><span></span> INTERNLINK · ADMIN WORKSPACE</span>
              <p className="hero-greeting">Welcome back{admin?.name ? `, ${admin.name}` : ", Admin"}</p>
              <h1>Building a <em>trusted internship ecosystem.</em></h1>
              <p className="hero-description">Manage the institutions and organizations that make a structured FYUGP internship experience possible.</p>
              <div className="hero-signature"><span className="signature-mark">✦</span><span>One connected platform for students, colleges, faculty and employers.</span></div>
            </div>

            <div className="ecosystem-art" aria-hidden="true">
              <div className="art-glow art-glow-one"></div>
              <div className="art-glow art-glow-two"></div>
              <div className="art-ring ring-outer"></div>
              <div className="art-ring ring-inner"></div>
              <span className="art-connection connection-a"></span>
              <span className="art-connection connection-b"></span>
              <span className="art-connection connection-c"></span>
              <span className="art-connection connection-d"></span>
              <div className="ecosystem-hub"><span className="hub-logo">IL</span><small>INTERNLINK</small><strong>Where opportunity<br />finds direction</strong></div>
              <div className="ecosystem-node node-campus"><span className="node-symbol">⌂</span><span><strong>Campus</strong><small>Institutions</small></span></div>
              <div className="ecosystem-node node-industry"><span className="node-symbol">▦</span><span><strong>Industry</strong><small>Organizations</small></span></div>
              <div className="ecosystem-node node-students"><span className="node-symbol">✧</span><span><strong>Students</strong><small>Future talent</small></span></div>
              <div className="ecosystem-node node-faculty"><span className="node-symbol">◌</span><span><strong>Faculty</strong><small>Guidance</small></span></div>
              <div className="art-caption"><span></span> A connected learning journey</div>
            </div>
          </div>

          <section className="admin-role-section">
            <div className="role-heading"><span className="section-eyebrow">YOUR ROLE IN INTERNLINK</span><h2>Make every connection count.</h2><p>Thoughtful administration creates a dependable foundation for meaningful internship experiences.</p></div>
            <div className="admin-principles">
              <article className="admin-principle-card"><span className="principle-mark">✓</span><div><h3>Verify with care</h3><p>Help students engage with credible organizations and institutions.</p></div></article>
              <article className="admin-principle-card"><span className="principle-mark">↔</span><div><h3>Connect the ecosystem</h3><p>Keep academic partners and internship providers working together.</p></div></article>
              <article className="admin-principle-card"><span className="principle-mark">✦</span><div><h3>Enable progress</h3><p>Support a clear, structured journey from learning to experience.</p></div></article>
            </div>
          </section>

          <div className="platform-statement"><span className="statement-rule"></span><div><strong>One platform. A connected internship ecosystem.</strong><p>InternLink brings the people and institutions behind student opportunity into one trusted space.</p></div><span className="statement-spark">✦</span></div>

        </section>

        <section id="admin-requests" className="management-section pending-requests-page">
          <div className="management-section-heading">
            <span className="section-eyebrow">REVIEW QUEUE</span>
            <h2>Pending Requests</h2>
            <p>Review company and college registrations awaiting verification.</p>
          </div>
          <details id="pending-requests-disclosure" className="pending-requests-box">
            <summary><span><strong>Organization requests</strong><small>Open the queue to review and respond to submissions</small></span><span className="request-count">{pendingCompanies.length + pendingColleges.length}</span><span className="request-chevron">⌄</span></summary>
            <div className="pending-request-content">
              <div className="pending-request-group">
                <h3>Company requests <span>{filteredPendingCompanies.length}</span></h3>
                {filteredPendingCompanies.length === 0 ? <p className="request-empty">No company registrations are waiting for approval.</p> : <div className="request-list">{filteredPendingCompanies.map((company) => <article className="request-row" key={company._id}><div><strong>{company.companyName}</strong><span>{company.email} · {company.location || "Location not provided"}</span></div><div className="organization-actions"><button className="approve-button" onClick={() => handleApproveCompany(company._id)}>✓ Approve</button><button className="reject-button" onClick={() => handleRejectCompany(company._id)}>× Reject</button></div></article>)}</div>}
              </div>
              <div className="pending-request-group">
                <h3>College requests <span>{filteredPendingColleges.length}</span></h3>
                {filteredPendingColleges.length === 0 ? <p className="request-empty">No college registrations are waiting for approval.</p> : <div className="request-list">{filteredPendingColleges.map((college) => <article className="request-row" key={college._id}><div><strong>{college.collegeName}</strong><span>{college.email} · {college.location || "Location not provided"}</span></div><div className="organization-actions"><button className="approve-button" onClick={() => handleApproveCollege(college._id)}>✓ Approve</button><button className="reject-button" onClick={() => handleRejectCollege(college._id)}>× Reject</button></div></article>)}</div>}
              </div>
            </div>
          </details>
        </section>




        {/* ==================================================
            COMPANY MANAGEMENT
        ================================================== */}

        <section
          id="admin-companies"
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
                  Verified Companies
                </h2>

                <p>
                  Organizations approved to participate in the InternLink internship ecosystem.
                </p>

              </div>

              <div className="summary-open-icon">
                +
              </div>

            </summary>


            <div className="management-content">

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
            COLLEGE MANAGEMENT
        ================================================== */}

        <section
          id="admin-colleges"
          className="management-section"
        >

          <details
            className="management-details"
            open
          >

            <summary className="management-summary">

              <div>

                <span className="section-eyebrow">
                  EDUCATION
                </span>

                <h2>
                  Verified Colleges
                </h2>

                <p>
                  Institutions approved to participate in the InternLink platform.
                </p>

              </div>

              <div className="summary-open-icon">
                +
              </div>

            </summary>


            <div className="management-content">

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
