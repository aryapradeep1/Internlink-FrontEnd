import React, { useEffect, useState } from "react";

// Student
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import Companies from "./pages/Companies";
import StudentProfile from "./pages/StudentProfile";
import EditStudentProfile from "./pages/EditStudentProfile";
import MyApplications from "./pages/MyApplications";
import MyInternship from "./pages/MyInternship";
import StudentLogbook from "./pages/StudentLogbook";

// Company
import CompanyLogin from "./components/CompanyLogin";
import CompanyRegister from "./pages/CompanyRegister";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyProfile from "./pages/CompanyProfile";
import EditCompanyProfile from "./pages/EditCompanyProfile";


import ApplicationForm from "./pages/ApplicationForm";
// Admin
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Faculty
import FacultyLogin from "./pages/FacultyLogin";
import FacultyRegister from "./pages/FacultyRegister";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyProfile from "./pages/FacultyProfile";
import EditFacultyProfile from "./pages/EditFacultyProfile";

// Company Guide
import CompanyGuideLogin from "./pages/CompanyGuideLogin";
import CompanyGuideRegister from "./pages/CompanyGuideRegister";
import CompanyGuideDashboard from "./pages/CompanyGuideDashboard";
import CompanyGuideProfile from "./pages/CompanyGuideProfile";
import EditCompanyGuideProfile from "./pages/EditCompanyGuideProfile";

// College
import CollegeLogin from "./pages/CollegeLogin";
import CollegeRegister from "./pages/CollegeRegister";
import CollegeDashboard from "./pages/CollegeDashboard";
import CollegeProfile from "./pages/CollegeProfile";
import EditCollegeProfile from "./pages/EditCollegeProfile";

// Common
import ChangePassword from "./pages/ChangePassword";
import Home from "./pages/Home";
import "./App.css";
import './index.css'

// intershnip opeertunity
import PostInternship from "./pages/PostInternship";
//import InternshipDetails from "./pages/InternshipDetails";
import InternshipCertificate from "./pages/InternshipCertificate";

function App() {
  const [page, setPage] = useState("home");
  const [checkingSession, setCheckingSession] = useState(true);
  const [companySection, setCompanySection] =
  useState("dashboard");


  const [facultySection, setFacultySection] =
  useState("dashboard");

  const [companyGuideSection, setCompanyGuideSection] =
  useState("dashboard");

const [collegeSection, setCollegeSection] =
  useState("dashboard");

const [studentSection, setStudentSection] =
  useState("dashboard");

  const [student, setStudent] = useState(null);
  const [company, setCompany] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [companyGuide, setCompanyGuide] = useState(null);
  const [college, setCollege] = useState(null);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [certificateAssignment, setCertificateAssignment] = useState(null);
const [certificateHours, setCertificateHours] = useState(0);

  // =====================================================
  // RESTORE LOGIN SESSION
  // =====================================================

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          setCheckingSession(false);
          return;
        }

        const data = await response.json();

        if (data.status !== "success") {
          setCheckingSession(false);
          return;
        }

        const { role, user } = data;

        if (role === "student") {
          setStudent(user);
          setStudentSection("dashboard");
          setPage("studentDashboard");
        }

        if (role === "company") {
          setCompany(user);
          setCompanySection("dashboard");
          setPage("companyDashboard");
        }

        if (role === "admin") {
          setAdmin(user);
          setPage("adminDashboard");
        }

        if (role === "faculty") {
          setFaculty(user);
          setFacultySection("dashboard");
          setPage("facultyDashboard");
        }

        if (role === "companyGuide") {
          setCompanyGuide(user);
          setCompanyGuideSection("dashboard");
          setPage("companyGuideDashboard");
        }

        if (role === "collegeAdmin") {
          setCollege(user);
          setCollegeSection("dashboard");
          setPage("collegeDashboard");
        }
      } catch (error) {
        console.error("Session restore failed:", error);
      } finally {
        setCheckingSession(false);
      }
    };

    restoreSession();
  }, []);

  // =====================================================
  // STUDENT
  // =====================================================
const handleStudentLogin = (studentData) => {
  setStudent(studentData);
  setStudentSection("dashboard");
  setPage("studentDashboard");
};

 const handleStudentLogout = async () => {
  try {
    await fetch(
      "http://localhost:5000/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
  }

  setStudent(null);
  setPage("login");
};

const goToStudentProfile = () => {
  setStudentSection("profile");
  setPage("studentDashboard");
};

const goToEditStudentProfile = () => {
  setStudentSection("editProfile");
  setPage("studentDashboard");
};

const goToStudentDashboard = () => {
  setStudentSection("dashboard");
  setPage("studentDashboard");
};

  // =====================================================
  // COMPANY
  // =====================================================
const handleCompanyLogin = (companyData) => {
  setCompany(companyData);
  setCompanySection("dashboard");
  setPage("companyDashboard");
};

const handleCompanyLogout = async () => {
  try {
    await fetch(
      "http://localhost:5000/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
  }

  setCompany(null);
  setPage("login");
};
const goToCompanyProfile = () => {
  setCompanySection("profile");
  setPage("companyDashboard");
};

const goToEditCompanyProfile = () => {
  setCompanySection("editProfile");
  setPage("companyDashboard");
};

const goToCompanyDashboard = () => {
  setCompanySection("dashboard");
  setPage("companyDashboard");
};

const goToCompanyPostInternship = () => {
  setCompanySection("postInternship");
  setPage("companyDashboard");
};

const goToCompanyChangePassword = () => {
  setCompanySection("changePassword");
  setPage("companyDashboard");
};

  // =====================================================
  // ADMIN
  // =====================================================

  const handleAdminLogin = (adminData) => {
    setAdmin(adminData);
    setPage("adminDashboard");
  };

 const handleAdminLogout = async () => {
  try {
    await fetch(
      "http://localhost:5000/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
  }

  setAdmin(null);
  setPage("login");
};

  const goToAdminChangePassword = () => {
    setPage("changeAdminPassword");
  };

  // =====================================================
  // FACULTY
  // =====================================================
const handleFacultyLogin = (facultyData) => {
  setFaculty(facultyData);
  setFacultySection("dashboard");
  setPage("facultyDashboard");
};

const handleFacultyLogout = async () => {
  try {
    await fetch(
      "http://localhost:5000/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
  }

  setFaculty(null);
  setPage("login");
};

const goToFacultyProfile = () => {
  setFacultySection("profile");
  setPage("facultyDashboard");
};

const goToEditFacultyProfile = () => {
  setFacultySection("editProfile");
  setPage("facultyDashboard");
};

const goToFacultyDashboard = () => {
  setFacultySection("dashboard");
  setPage("facultyDashboard");
};

const goToFacultyStudents = () => {
  setFacultySection("students");
  setPage("facultyDashboard");
};

const goToFacultyLogbooks = () => {
  setFacultySection("logbooks");
  setPage("facultyDashboard");
};

const goToFacultyChangePassword = () => {
  setFacultySection("changePassword");
  setPage("facultyDashboard");
};
  // =====================================================
  // COMPANY GUIDE
  // =====================================================
const handleCompanyGuideLogin = (guideData) => {
  setCompanyGuide(guideData);
  setCompanyGuideSection("dashboard");
  setPage("companyGuideDashboard");
};

const handleCompanyGuideLogout = async () => {
  try {
    await fetch(
      "http://localhost:5000/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
  }

  setCompanyGuide(null);
  setPage("login");
};

const goToCompanyGuideProfile = () => {
  setCompanyGuideSection("profile");
  setPage("companyGuideDashboard");
};

const goToEditCompanyGuideProfile = () => {
  setCompanyGuideSection("editProfile");
  setPage("companyGuideDashboard");
};

const goToCompanyGuideDashboard = () => {
  setCompanyGuideSection("dashboard");
  setPage("companyGuideDashboard");
};

const goToCompanyGuideAssignedStudents = () => {
  setCompanyGuideSection("students");
  setPage("companyGuideDashboard");
};

const goToCompanyGuideLogbooks = () => {
  setCompanyGuideSection("logbooks");
  setPage("companyGuideDashboard");
};

const goToCompanyGuideChangePassword = () => {
  setCompanyGuideSection("changePassword");
  setPage("companyGuideDashboard");
};

  // =====================================================
  // COLLEGE
  // =====================================================
const handleCollegeLogin = (collegeData) => {
  setCollege(collegeData);
  setCollegeSection("dashboard");
  setPage("collegeDashboard");
};

  const handleCollegeLogout = async () => {
  try {
    await fetch(
      "http://localhost:5000/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
  }

  setCollege(null);
  setPage("login");
};

const goToCollegeProfile = () => {
  setCollegeSection("profile");
  setPage("collegeDashboard");
};

const goToEditCollegeProfile = () => {
  setCollegeSection("editProfile");
  setPage("collegeDashboard");
};

const goToCollegeDashboard = () => {
  setCollegeSection("dashboard");
  setPage("collegeDashboard");
};

const goToCollegeStudents = () => {
  setCollegeSection("students");
  setPage("collegeDashboard");
};

const goToCollegeFaculty = () => {
  setCollegeSection("faculty");
  setPage("collegeDashboard");
};

const goToCollegeApplications = () => {
  setCollegeSection("applications");
  setPage("collegeDashboard");
};

const goToCollegeWorkload = () => {
  setCollegeSection("workload");
  setPage("collegeDashboard");
};

const goToCollegeChangePassword = () => {
  setCollegeSection("changePassword");
  setPage("collegeDashboard");
};

  // =====================================================
  // CHECKING SESSION
  // =====================================================

  if (checkingSession) {
    return (
      <div className="session-loading">
        Checking session...
      </div>
    );
  }
  // =====================================================
// HOME PAGE
// =====================================================

if (page === "home") {
  return (
    <Home
      onLogin={() => setPage("login")}
      onSignup={() => setPage("register")}
    />
  );
}

  // =====================================================
  // MAIN LOGIN PAGE
  // =====================================================

  if (page === "login") {
    return (
      <Login
        onLogin={handleStudentLogin}
        onGoToRegister={() => setPage("register")}
        onGoToCompanyLogin={() => setPage("companyLogin")}
        onGoToAdminLogin={() => setPage("adminLogin")}
        onGoToFacultyLogin={() => setPage("facultyLogin")}
        onGoToCompanyGuideLogin={() =>
          setPage("companyGuideLogin")
        }
        onGoToCompanyGuideRegister={() =>
          setPage("companyGuideRegister")
        }
        onGoToCollegeLogin={() => setPage("collegeLogin")}
        onGoToCollegeRegister={() =>
          setPage("collegeRegister")
        }
        onGoToHome={() => setPage("home")}
      />
    );
  }

  // =====================================================
  // STUDENT REGISTER
  // =====================================================

if (page === "register") {
  return (
    <Register
      onRegisterSuccess={() => setPage("login")}
      onGoToLogin={() => setPage("login")}
    />
  );
}

// =====================================================
// STUDENT DASHBOARD
// =====================================================

if (page === "studentDashboard" && student) {
  return (
    <StudentDashboard
      student={student}
      onLogout={handleStudentLogout}
      onGoToDashboard={goToStudentDashboard}
      onGoToProfile={goToStudentProfile}
      onGoToChangePassword={() => {
        setStudentSection("changePassword");
        setPage("studentDashboard");
      }}
      onGoToInternships={() => {
        setStudentSection("internships");
        setPage("studentDashboard");
      }}
      onGoToMyApplications={() => {
        setStudentSection("applications");
        setPage("studentDashboard");
      }}
      onGoToMyInternship={() => {
        setStudentSection("myInternship");
        setPage("studentDashboard");
      }}
      onGoToLogbook={() => {
        setStudentSection("logbook");
        setPage("studentDashboard");
      }}
      activeSection={studentSection}
    >

      {/* =====================================================
          STUDENT PROFILE
          ===================================================== */}

      {studentSection === "profile" && (
        <StudentProfile
          student={student}
          onBack={goToStudentDashboard}
          onEdit={goToEditStudentProfile}
          onChangePassword={() => {
            setStudentSection("changePassword");
            setPage("studentDashboard");
          }}
        />
      )}


      {/* =====================================================
          EDIT STUDENT PROFILE
          ===================================================== */}

      {studentSection === "editProfile" && (
        <EditStudentProfile
          student={student}
          onBack={goToStudentProfile}
          onProfileUpdated={(updatedStudent) => {
            setStudent(updatedStudent);
            setStudentSection("profile");
          }}
        />
      )}


      {/* =====================================================
          STUDENT CHANGE PASSWORD
          ===================================================== */}

      {studentSection === "changePassword" && (
        <ChangePassword
          user={student}
          role="student"
          onBack={goToStudentProfile}
        />
      )}


      {/* =====================================================
          STUDENT MY APPLICATIONS
          ===================================================== */}

      {studentSection === "applications" && (
        <MyApplications
          student={student}
          onBack={goToStudentDashboard}
        />
      )}


      {/* =====================================================
          STUDENT MY INTERNSHIP
          ===================================================== */}

      {studentSection === "myInternship" && (
        <MyInternship
          student={student}
          onBack={goToStudentDashboard}
          onGenerateCertificate={(assignment, totalHours) => {
            setCertificateAssignment(assignment);
            setCertificateHours(totalHours);
            setPage("internshipCertificate");
          }}
        />
      )}


      {/* =====================================================
          STUDENT LOGBOOK
          ===================================================== */}

      {studentSection === "logbook" && (
        <StudentLogbook
          student={student}
          onBack={goToStudentDashboard}
        />
      )}


      {/* =====================================================
          INTERNSHIPS
          ===================================================== */}

      {studentSection === "internships" && (
  <Companies
    student={student}
    onBack={goToStudentDashboard}
   onViewDetails={(companyData, internshipData) => {
  setSelectedCompany(companyData);
  setSelectedInternship(internshipData);
  setStudentSection("internshipDetails");
  setPage("studentDashboard");
}}
  />
)}


{/* =====================================================
    INTERNSHIP DETAILS
    ===================================================== */}

{studentSection === "internshipDetails" &&
  selectedInternship && (
    <div className="internship-details-page">

      {/* BACK BUTTON */}

     


      {/* DETAILS CONTENT */}

      <main className="internship-details-content">

        {/* HERO */}

        <section className="internship-hero">

          <div className="internship-hero-content">

            <span className="internship-label">
              INTERNSHIP OPPORTUNITY
            </span>

            <h1>
              {selectedInternship.title}
            </h1>

            <div className="internship-company-location">

              <span>
                {selectedCompany?.companyName || "Company"}
              </span>

              <span className="dot-separator">
                •
              </span>

              <span>
                {selectedInternship.location ||
                  "Location not specified"}
              </span>

            </div>

          </div>

        </section>


        {/* MAIN CONTENT */}

        <div className="internship-main-layout">

          {/* LEFT CARD */}

          <section className="internship-main-card">

            <div className="internship-section">

              <h2>
                About this internship
              </h2>

              <p>
                {selectedInternship.description ||
                  "No description provided."}
              </p>

            </div>


            <div className="internship-section">

              <h2>
                Eligibility
              </h2>

              <p>
                {selectedInternship.eligibility ||
                  "No specific eligibility criteria provided."}
              </p>

            </div>


            <div className="internship-section">

              <h2>
                Skills Required
              </h2>

              {selectedInternship.skillsRequired &&
              selectedInternship.skillsRequired !== "None" ? (

                <div className="skills-container">

                  <span className="skill-tag">
                    {selectedInternship.skillsRequired}
                  </span>

                </div>

              ) : (

                <span className="no-skills">
                  No specific skills required
                </span>

              )}

            </div>

          </section>


          {/* RIGHT APPLY CARD */}

          <aside className="internship-apply-card">

            <div className="apply-card-heading">

              <div className="apply-icon">
                ✓
              </div>

              <div>

                <h2>
                  Ready to apply?
                </h2>

                <p>
                  Submit your application for this opportunity.
                </p>

              </div>

            </div>


            <div className="apply-info">

              <div className="apply-info-row">

                <span className="apply-info-label">
                  Application Deadline
                </span>

                <strong>
                  {new Date(
                    selectedInternship.deadline
                  ).toLocaleDateString()}
                </strong>

              </div>


              <div className="apply-info-row">

                <span className="apply-info-label">
                  Duration
                </span>

                <strong>
                  {selectedInternship.duration}
                </strong>

              </div>


              <div className="apply-info-row">

                <span className="apply-info-label">
                  Company
                </span>

                <strong>
                  {selectedCompany?.companyName ||
                    "Company"}
                </strong>

              </div>

            </div>


            <button
  className="internship-apply-button"
  onClick={() => {
    setStudentSection("applicationForm");
    setPage("studentDashboard");
  }}
>
              Apply for Internship

              <span>
                →
              </span>

            </button>


            <p className="apply-note">
              Your application will be reviewed by the company.
            </p>

          </aside>

        </div>

      </main>

    </div>
)}


{/* =====================================================
    APPLICATION FORM
    ===================================================== */}

{studentSection === "applicationForm" &&
  selectedCompany &&
  selectedInternship && (
    <ApplicationForm
      student={student}
      company={selectedCompany}
      internship={selectedInternship}
      onBack={() => {
        setStudentSection("internshipDetails");
        setPage("studentDashboard");
      }}
      onSuccess={() => {
        setStudentSection("applications");
        setPage("studentDashboard");
      }}
    />
)}

      {/* =====================================================
          STUDENT DASHBOARD HOME
          ===================================================== */}

      {studentSection === "dashboard" && (
        <div className="student-dashboard-home">

          {/* Your existing Student Dashboard content
              will be moved here in the next step. */}

        </div>
      )}

    </StudentDashboard>
  );
}

  // =====================================================
  // STUDENT PROFILE
  // =====================================================

  if (page === "studentProfile" && student) {
    return (
      <StudentProfile
        student={student}
        onBack={() => setPage("studentDashboard")}
        onEdit={goToEditStudentProfile}
        onChangePassword={() =>
          setPage("changeStudentPassword")
        }
      />
    );
  }

  // =====================================================
  // EDIT STUDENT PROFILE
  // =====================================================

  if (page === "editStudentProfile" && student) {
    return (
      <EditStudentProfile
        student={student}
        onBack={() => setPage("studentProfile")}
        onProfileUpdated={(updatedStudent) => {
          setStudent(updatedStudent);
          setPage("studentProfile");
        }}
      />
    );
  }

  // =====================================================
  // STUDENT CHANGE PASSWORD
  // =====================================================

  if (page === "changeStudentPassword" && student) {
    return (
      <ChangePassword
        user={student}
        role="student"
        onBack={() => setPage("studentProfile")}
      />
    );
  }

  // =====================================================
  // STUDENT MY APPLICATIONS
  // =====================================================

  if (page === "myApplications" && student) {
    return (
      <MyApplications
        student={student}
        onBack={() => setPage("studentDashboard")}
      />
    );
  }

  // =====================================================
  // STUDENT MY INTERNSHIP
  // =====================================================
if (page === "myInternship" && student) {
  return (
    <MyInternship
      student={student}
      onBack={() => setPage("studentDashboard")}
      onGenerateCertificate={(assignment, totalHours) => {
        setCertificateAssignment(assignment);
        setCertificateHours(totalHours);
        setPage("internshipCertificate");
      }}
    />
  );
}

// =====================================================
// INTERNSHIP CERTIFICATE
// =====================================================

if (
  page === "internshipCertificate" &&
  student &&
  certificateAssignment
) {
  return (
    <InternshipCertificate
      assignment={certificateAssignment}
      totalHours={certificateHours}
      onBack={() => {
  setStudentSection("dashboard");
  setPage("studentDashboard");
}}
    />
  );
}

  // =====================================================
  // STUDENT LOGBOOK
  // =====================================================

  if (page === "studentLogbook" && student) {
    return (
      <StudentLogbook
        student={student}
        onBack={() => setPage("studentDashboard")}
      />
    );
  }
// =====================================================
// COMPANIES
// =====================================================

if (page === "companies" && student) {
  return (
    <Companies
      student={student}
      onBack={() => setPage("studentDashboard")}
      onViewDetails={(companyData, internshipData) => {
        setSelectedCompany(companyData);
        setSelectedInternship(internshipData);
        setPage("internshipDetails");
      }}
    />
  );
}




  // =====================================================
  // COMPANY LOGIN
  // =====================================================

  if (page === "companyLogin") {
    return (
      <CompanyLogin
        onLogin={handleCompanyLogin}
        onRegister={() => setPage("companyRegister")}
        onBack={() => setPage("login")}
      />
    );
  }

  // =====================================================
  // COMPANY REGISTER
  // =====================================================

  if (page === "companyRegister") {
    return (
      <CompanyRegister
        onBack={() => setPage("companyLogin")}
        onLogin={() => setPage("companyLogin")}
      />
    );
  }

  // =====================================================
  // COMPANY DASHBOARD
  // =====================================================


// =====================================================
// COMPANY WORKSPACE
// =====================================================

if (page === "companyDashboard" && company) {
  return (
    <CompanyDashboard
      company={company}
      onLogout={handleCompanyLogout}
      onGoToProfile={goToCompanyProfile}
      onPostInternship={goToCompanyPostInternship}
      onGoToDashboard={goToCompanyDashboard}
      onGoToApplications={() => {
        setCompanySection("applications");
      }}
      onGoToCompanyGuides={() => {
        setCompanySection("guides");
      }}
      onGoToAccountSettings={() => {
        setCompanySection("settings");
      }}
      activeSection={companySection}
    >
      {companySection === "profile" && (
        <CompanyProfile
          company={company}
          onBack={goToCompanyDashboard}
          onEdit={goToEditCompanyProfile}
          onChangePassword={goToCompanyChangePassword}
        />
      )}

 {companySection === "editProfile" && ( 
  <EditCompanyProfile 
    company={company} 
    onBack={goToCompanyProfile} 
    onProfileUpdated={(updatedCompany) => { 
      setCompany(updatedCompany); 
      setCompanySection("profile"); 
    }} 
  /> 
)}

      {companySection === "postInternship" && (
        <PostInternship
          company={company}
          onBack={goToCompanyDashboard}
          onSuccess={goToCompanyDashboard}
        />
      )}

      {companySection === "changePassword" && (
        <ChangePassword
          user={company}
          role="company"
          onBack={goToCompanyProfile}
        />
      )}
    </CompanyDashboard>
  );
}
  // =====================================================
  // ADMIN LOGIN
  // =====================================================

  if (page === "adminLogin") {
    return (
      <AdminLogin
        onLogin={handleAdminLogin}
        onBack={() => setPage("login")}
      />
    );
  }

  // =====================================================
  // ADMIN DASHBOARD
  // =====================================================

  if (page === "adminDashboard" && admin) {
    return (
      <AdminDashboard
        admin={admin}
        onLogout={handleAdminLogout}
        onChangePassword={goToAdminChangePassword}
      />
    );
  }

  // =====================================================
  // ADMIN CHANGE PASSWORD
  // =====================================================

  if (page === "changeAdminPassword" && admin) {
    return (
      <ChangePassword
        user={admin}
        role="admin"
        onBack={() => setPage("adminDashboard")}
      />
    );
  }

  // =====================================================
  // FACULTY LOGIN
  // =====================================================

  if (page === "facultyLogin") {
    return (
      <FacultyLogin
        onLogin={handleFacultyLogin}
        onRegister={() => setPage("facultyRegister")}
        onBack={() => setPage("login")}
      />
    );
  }

  // =====================================================
  // FACULTY REGISTER
  // =====================================================
if (page === "facultyRegister") {
  return (
    <FacultyRegister
      onRegisterSuccess={() => setPage("facultyLogin")}
      onBackToLogin={() => setPage("facultyLogin")}
    />
  );
}

  // =====================================================
  // FACULTY DASHBOARD
  // =====================================================

 if (page === "facultyDashboard" && faculty) {
  return (
    <FacultyDashboard
      faculty={faculty}
      onLogout={handleFacultyLogout}
      onGoToProfile={goToFacultyProfile}
      onGoToDashboard={goToFacultyDashboard}
      onGoToStudents={goToFacultyStudents}
      onGoToLogbooks={goToFacultyLogbooks}
      onGoToEditProfile={goToEditFacultyProfile}
      onGoToChangePassword={goToFacultyChangePassword}
      activeSection={facultySection}
    >
      {facultySection === "profile" && (
        <FacultyProfile
          faculty={faculty}
          onBack={goToFacultyDashboard}
          onEdit={goToEditFacultyProfile}
          onChangePassword={goToFacultyChangePassword}
        />
      )}

      {facultySection === "editProfile" && (
        <EditFacultyProfile
          faculty={faculty}
          onBack={goToFacultyProfile}
          onUpdated={(updatedFaculty) => {
            setFaculty(updatedFaculty);
            setFacultySection("profile");
          }}
        />
      )}

      {facultySection === "changePassword" && (
        <ChangePassword
          user={faculty}
          role="faculty"
          onBack={goToFacultyProfile}
        />
      )}
    </FacultyDashboard>
  );
}



  // =====================================================
  // COMPANY GUIDE LOGIN
  // =====================================================

  if (page === "companyGuideLogin") {
    return (
      <CompanyGuideLogin
        onLogin={handleCompanyGuideLogin}
        onRegister={() =>
          setPage("companyGuideRegister")
        }
        onBack={() => setPage("login")}
      />
    );
  }

  // =====================================================
  // COMPANY GUIDE REGISTER
  // =====================================================

if (page === "companyGuideRegister") {
  return (
    <CompanyGuideRegister
      onBack={() => setPage("companyGuideLogin")}
      onRegisterSuccess={() =>
        setPage("companyGuideLogin")
      }
    />
  );
}

  // =====================================================
  // COMPANY GUIDE DASHBOARD
  // =====================================================

 if (page === "companyGuideDashboard" && companyGuide) {
  return (
    <CompanyGuideDashboard
      guide={companyGuide}
      onLogout={handleCompanyGuideLogout}
      onGoToProfile={goToCompanyGuideProfile}
      onGoToDashboard={goToCompanyGuideDashboard}
      onGoToAssignedStudents={goToCompanyGuideAssignedStudents}
      onGoToLogbooks={goToCompanyGuideLogbooks}
      onGoToEditProfile={goToEditCompanyGuideProfile}
      onGoToChangePassword={goToCompanyGuideChangePassword}
      activeSection={companyGuideSection}
    >
      {companyGuideSection === "profile" && (
        <CompanyGuideProfile
          guide={companyGuide}
          onBack={goToCompanyGuideDashboard}
          onEdit={goToEditCompanyGuideProfile}
          onChangePassword={goToCompanyGuideChangePassword}
        />
      )}

      {companyGuideSection === "editProfile" && (
        <EditCompanyGuideProfile
          guide={companyGuide}
          onBack={goToCompanyGuideProfile}
          onProfileUpdated={(updatedGuide) => {
            setCompanyGuide(updatedGuide);
            setCompanyGuideSection("profile");
          }}
        />
      )}

      {companyGuideSection === "changePassword" && (
        <ChangePassword
          user={companyGuide}
          role="companyGuide"
          onBack={goToCompanyGuideProfile}
        />
      )}
    </CompanyGuideDashboard>
  );
}



  // =====================================================
  // COLLEGE LOGIN
  // =====================================================

if (page === "collegeLogin") {
  return (
    <CollegeLogin
      onLogin={handleCollegeLogin}
      onGoToRegister={() => setPage("collegeRegister")}
      onBack={() => setPage("login")}
    />
  );
}

  // =====================================================
  // COLLEGE REGISTER
  // =====================================================

  if (page === "collegeRegister") {
    return (
      <CollegeRegister
        onBack={() => setPage("collegeLogin")}
        onLogin={() => setPage("collegeLogin")}
      />
    );
  }

  // =====================================================
  // COLLEGE DASHBOARD
  // =====================================================

 if (page === "collegeDashboard" && college) {
  return (
    <CollegeDashboard
      college={college}
      onLogout={handleCollegeLogout}
      onGoToProfile={goToCollegeProfile}
      onGoToDashboard={goToCollegeDashboard}
      onGoToStudents={goToCollegeStudents}
      onGoToFaculty={goToCollegeFaculty}
      onGoToApplications={goToCollegeApplications}
      onGoToWorkload={goToCollegeWorkload}
      onGoToEditProfile={goToEditCollegeProfile}
      onGoToChangePassword={goToCollegeChangePassword}
      activeSection={collegeSection}
    >
      {collegeSection === "profile" && (
        <CollegeProfile
          college={college}
          onBack={goToCollegeDashboard}
          onEdit={goToEditCollegeProfile}
          onChangePassword={goToCollegeChangePassword}
        />
      )}

      {collegeSection === "editProfile" && (
        <EditCollegeProfile
          college={college}
          onBack={goToCollegeProfile}
            onProfileUpdated={(updatedCollege)  => {
            setCollege(updatedCollege);
            setCollegeSection("profile");
          }}
        />
      )}

      {collegeSection === "changePassword" && (
        <ChangePassword
          user={college}
          role="college"
          onBack={goToCollegeProfile}
        />
      )}
    </CollegeDashboard>
  );
}




  // =====================================================
  // FALLBACK
  // =====================================================

  return (
    <div className="dashboard-container">
      <h2>Page not found</h2>

      <button onClick={() => setPage("login")}>
        Back to Login
      </button>
    </div>
  );
}

export default App;

