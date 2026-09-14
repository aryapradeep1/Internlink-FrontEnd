import React, { useEffect, useState } from "react";

function AdminDashboard({ onLogout }) {
  const [companies, setCompanies] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [approvedCompanies, setApprovedCompanies] = useState([]);
  const [approvedColleges, setApprovedColleges] = useState([]);
  const [message, setMessage] = useState("");
const [companySearch, setCompanySearch] = useState("");
const [collegeSearch, setCollegeSearch] = useState("");
  // =========================
  // FETCH PENDING COMPANIES
  // =========================

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/pending-companies"
      );

      const data = await response.json();

      if (data.status === "success") {
        setCompanies(data.companies);
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  // =========================
  // FETCH APPROVED COMPANIES
  // =========================

  const fetchApprovedCompanies = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/approved-companies"
      );

      const data = await response.json();

      if (data.status === "success") {
        setApprovedCompanies(data.companies);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // FETCH PENDING COLLEGES
  // =========================

  const fetchColleges = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/pending-colleges"
      );

      const data = await response.json();

      if (data.status === "success") {
        setColleges(data.colleges);
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  // =========================
  // FETCH APPROVED COLLEGES
  // =========================

  const fetchApprovedColleges = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/approved-colleges"
      );

      const data = await response.json();

      if (data.status === "success") {
        setApprovedColleges(data.colleges);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchCompanies();
    fetchApprovedCompanies();
    fetchColleges();
    fetchApprovedColleges();
  }, []);

  // =========================
  // APPROVE COMPANY
  // =========================

  const approveCompany = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/approve-company/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      setMessage(data.message);

      fetchCompanies();
      fetchApprovedCompanies();
    } catch (error) {
      console.error(error);
      setMessage("Unable to approve company");
    }
  };

  // =========================
  // REJECT COMPANY
  // =========================

  const rejectCompany = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/reject-company/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      setMessage(data.message);

      fetchCompanies();
    } catch (error) {
      console.error(error);
      setMessage("Unable to reject company");
    }
  };

  // =========================
  // APPROVE COLLEGE
  // =========================

  const approveCollege = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/approve-college/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      setMessage(data.message);

      fetchColleges();
      fetchApprovedColleges();
    } catch (error) {
      console.error(error);
      setMessage("Unable to approve college");
    }
  };

  // =========================
  // REJECT COLLEGE
  // =========================

  const rejectCollege = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/reject-college/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      setMessage(data.message);

      fetchColleges();
    } catch (error) {
      console.error(error);
      setMessage("Unable to reject college");
    }
  };

  // =========================
  // SMALL ICON COMPONENT
  // =========================

  const Icon = ({ children }) => (
    <div
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        backgroundColor: "#f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "21px",
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );

  // =========================
  // SUMMARY CARD
  // =========================

  const SummaryCard = ({ title, value, icon, description }) => (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
      }}
    >
      <Icon>{icon}</Icon>

      <div>
        <p
          style={{
            margin: "0 0 5px",
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          {title}
        </p>

        <h2
          style={{
            margin: "0 0 3px",
            fontSize: "28px",
            color: "#111827",
          }}
        >
          {value}
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#94a3b8",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );

  // =========================
  // COMPANY CARD
  // =========================

  const CompanyCard = ({ company, pending }) => (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "20px",
        marginBottom: "14px",
        boxShadow: "0 2px 6px rgba(15, 23, 42, 0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "13px",
            alignItems: "flex-start",
          }}
        >
          <Icon>🏢</Icon>

          <div>
            <h3
              style={{
                margin: "0 0 5px",
                fontSize: "17px",
                color: "#111827",
              }}
            >
              {company.companyName}
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              {company.email}
            </p>
          </div>
        </div>

        <span
          style={{
            backgroundColor: pending ? "#fff7ed" : "#ecfdf5",
            color: pending ? "#c2410c" : "#047857",
            padding: "6px 10px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: "600",
          }}
        >
          {pending ? "Pending" : "Approved"}
        </span>
      </div>

      <div
        style={{
          marginTop: "18px",
          paddingTop: "15px",
          borderTop: "1px solid #f1f5f9",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "11px",
              color: "#94a3b8",
            }}
          >
            LOCATION
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#334155",
            }}
          >
            {company.location || "Not provided"}
          </p>
        </div>

        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "11px",
              color: "#94a3b8",
            }}
          >
            DESCRIPTION
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#334155",
            }}
          >
            {company.description || "Not provided"}
          </p>
        </div>
      </div>

      {pending && (
        <div
          style={{
            marginTop: "18px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={() => approveCompany(company._id)}
            style={{
              padding: "9px 18px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#111827",
              color: "#ffffff",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Approve
          </button>

          <button
            onClick={() => rejectCompany(company._id)}
            style={{
              padding: "9px 18px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              color: "#dc2626",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );

  // =========================
  // COLLEGE CARD
  // =========================

  const CollegeCard = ({ college, pending }) => (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "20px",
        marginBottom: "14px",
        boxShadow: "0 2px 6px rgba(15, 23, 42, 0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "13px",
            alignItems: "flex-start",
          }}
        >
          <Icon>🎓</Icon>

          <div>
            <h3
              style={{
                margin: "0 0 5px",
                fontSize: "17px",
                color: "#111827",
              }}
            >
              {college.collegeName}
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              {college.email}
            </p>
          </div>
        </div>

        <span
          style={{
            backgroundColor: pending ? "#fff7ed" : "#ecfdf5",
            color: pending ? "#c2410c" : "#047857",
            padding: "6px 10px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: "600",
          }}
        >
          {pending ? "Pending" : "Approved"}
        </span>
      </div>

      <div
        style={{
          marginTop: "18px",
          paddingTop: "15px",
          borderTop: "1px solid #f1f5f9",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "11px",
              color: "#94a3b8",
            }}
          >
            LOCATION
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#334155",
            }}
          >
            {college.location || "Not provided"}
          </p>
        </div>

        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "11px",
              color: "#94a3b8",
            }}
          >
            UNIVERSITY
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#334155",
            }}
          >
            {college.university || "Not provided"}
          </p>
        </div>
      </div>

      {pending && (
        <div
          style={{
            marginTop: "18px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={() => approveCollege(college._id)}
            style={{
              padding: "9px 18px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#111827",
              color: "#ffffff",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Approve
          </button>

          <button
            onClick={() => rejectCollege(college._id)}
            style={{
              padding: "9px 18px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              color: "#dc2626",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );

  // =========================
  // SECTION HEADER
  // =========================

  const SectionHeader = ({ icon, title, count }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "18px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span style={{ fontSize: "20px" }}>{icon}</span>

        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            color: "#111827",
          }}
        >
          {title}
        </h2>
      </div>

      <span
        style={{
          backgroundColor: "#f1f5f9",
          color: "#475569",
          padding: "6px 10px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {count}
      </span>
    </div>
  );

// =========================
// SEARCH FILTERS
// =========================

const filteredApprovedCompanies = approvedCompanies.filter((company) =>
  `${company.companyName} ${company.email} ${company.location || ""}`
    .toLowerCase()
    .includes(companySearch.toLowerCase())
);

const filteredApprovedColleges = approvedColleges.filter((college) =>
  `${college.collegeName} ${college.email} ${college.location || ""} ${
    college.university || ""
  }`
    .toLowerCase()
    .includes(collegeSearch.toLowerCase())
);

  // =========================
  // MAIN UI
  // =========================

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
        color: "#111827",
      }}
    >
      {/* TOP HEADER */}

      <div
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "18px 30px",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  backgroundColor: "#111827",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                }}
              >
                IL
              </div>

              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "19px",
                    fontWeight: "700",
                  }}
                >
                  InterLink
                </h1>

                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  Internship Management Platform
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              padding: "9px 16px",
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              color: "#334155",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "35px 25px 50px",
        }}
      >
        {/* WELCOME */}

        <div style={{ marginBottom: "28px" }}>
          <p
            style={{
              margin: "0 0 7px",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            ADMINISTRATION
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            Admin Dashboard
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Manage registered companies and colleges.
          </p>
        </div>

        {/* MESSAGE */}

        {message && (
          <div
            style={{
              marginBottom: "22px",
              padding: "12px 15px",
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              color: "#334155",
              fontSize: "13px",
            }}
          >
            {message}
          </div>
        )}

        {/* SUMMARY CARDS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "16px",
            marginBottom: "35px",
          }}
        >
          <SummaryCard
            title="Pending Companies"
            value={companies.length}
            icon="⏳"
            description="Awaiting approval"
          />

          <SummaryCard
            title="Approved Companies"
            value={approvedCompanies.length}
            icon="🏢"
            description="Active companies"
          />

          <SummaryCard
            title="Pending Colleges"
            value={colleges.length}
            icon="⏳"
            description="Awaiting approval"
          />

          <SummaryCard
            title="Approved Colleges"
            value={approvedColleges.length}
            icon="🎓"
            description="Registered colleges"
          />
        </div>

        {/* =========================
            COMPANY MANAGEMENT
        ========================= */}

        <div style={{ marginBottom: "38px" }}>
          <SectionHeader
            icon="🏢"
            title="Company Management"
            count={companies.length + approvedCompanies.length}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "22px",
            }}
          >
            {/* Pending Companies */}

            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              <div style={{ marginBottom: "18px" }}>
                <h3
                  style={{
                    margin: "0 0 4px",
                    fontSize: "15px",
                  }}
                >
                  Pending Registrations
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  Companies waiting for approval
                </p>
              </div>

              {companies.length === 0 ? (
                <div
                  style={{
                    padding: "30px 15px",
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    color: "#94a3b8",
                    fontSize: "13px",
                  }}
                >
                  No pending companies
                </div>
              ) : (
                companies.map((company) => (
                  <CompanyCard
                    key={company._id}
                    company={company}
                    pending={true}
                  />
                ))
              )}
            </div>

            {/* Approved Companies */}

            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              <div style={{ marginBottom: "18px" }}>
                <h3
                  style={{
                    margin: "0 0 4px",
                    fontSize: "15px",
                  }}
                >
                  Approved Companies
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  Companies approved by admin
                </p>
                <p
  style={{
    margin: 0,
    fontSize: "12px",
    color: "#64748b",
  }}
>
  Companies approved by admin
</p>
<input
  type="text"
  placeholder="Search companies..."
  value={companySearch}
  onChange={(e) => setCompanySearch(e.target.value)}
  style={{
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    marginTop: "15px",
    marginBottom: "15px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
  }}
/>
              </div>

              {approvedCompanies.length === 0 ? (
                <div
                  style={{
                    padding: "30px 15px",
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    color: "#94a3b8",
                    fontSize: "13px",
                  }}
                >
                  No approved companies
                </div>
              ) : (
               filteredApprovedCompanies.map((company) => (
                  <CompanyCard
                    key={company._id}
                    company={company}
                    pending={false}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* =========================
            COLLEGE MANAGEMENT
        ========================= */}

        <div>
          <SectionHeader
            icon="🎓"
            title="College Management"
            count={colleges.length + approvedColleges.length}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "22px",
            }}
          >
            {/* Pending Colleges */}

            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              <div style={{ marginBottom: "18px" }}>
                <h3
                  style={{
                    margin: "0 0 4px",
                    fontSize: "15px",
                  }}
                >
                  Pending Registrations
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  Colleges waiting for approval
                </p>
              </div>

              {colleges.length === 0 ? (
                <div
                  style={{
                    padding: "30px 15px",
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    color: "#94a3b8",
                    fontSize: "13px",
                  }}
                >
                  No pending colleges
                </div>
              ) : (
                colleges.map((college) => (
                  <CollegeCard
                    key={college._id}
                    college={college}
                    pending={true}
                  />
                ))
              )}
            </div>

            {/* Approved Colleges */}

            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              <div style={{ marginBottom: "18px" }}>
                <h3
                  style={{
                    margin: "0 0 4px",
                    fontSize: "15px",
                  }}
                >
                  Approved Colleges
                </h3>
                  <p
  style={{
    margin: 0,
    fontSize: "12px",
    color: "#64748b",
  }}
>
  Colleges approved by admin
</p>
<input
  type="text"
  placeholder="Search colleges..."
  value={collegeSearch}
  onChange={(e) => setCollegeSearch(e.target.value)}
  style={{
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    marginTop: "15px",
    marginBottom: "15px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
  }}
/>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  Colleges approved by admin
                </p>
              </div>

              {approvedColleges.length === 0 ? (
                <div
                  style={{
                    padding: "30px 15px",
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    color: "#94a3b8",
                    fontSize: "13px",
                  }}
                >
                  No approved colleges
                </div>
              ) : (
               filteredApprovedColleges.map((college) => (
                  <CollegeCard
                    key={college._id}
                    college={college}
                    pending={false}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

