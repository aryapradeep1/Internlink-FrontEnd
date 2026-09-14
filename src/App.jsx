import { useState } from "react";
import "./App.css";

import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import CompanyDetails from "./pages/CompanyDetails";
import ApplicationForm from "./pages/ApplicationForm";
import MyApplications from "./pages/MyApplications";
import CompanyLogin from "./components/CompanyLogin";
import CompanyRegister from "./pages/CompanyRegister";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PostInternship from "./pages/PostInternship";
import Internships from "./pages/Internships";
import MyInternship from "./pages/MyInternship";
import StudentLogbook from "./pages/StudentLogbook";
import FacultyLogin from "./pages/FacultyLogin";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyRegister from "./pages/FacultyRegister";
import CompanyGuideLogin from "./pages/CompanyGuideLogin";
import CompanyGuideDashboard from "./pages/CompanyGuideDashboard";
import CollegeLogin from "./pages/CollegeLogin";
import CollegeRegister from "./pages/CollegeRegister";
import CollegeDashboard from "./pages/CollegeDashboard";

function App() {
  const [page, setPage] = useState("register");

  const [student, setStudent] = useState(null);
  const [companyUser, setCompanyUser] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [companyGuide, setCompanyGuide] = useState(null);
  const [college, setCollege] = useState(null);

  // ======================================================
  // PLATFORM ADMIN
  // ======================================================

  const goToAdminLogin = () => {
    setPage("adminLogin");
  };

  const handleAdminLogin = (adminData) => {
    setAdmin(adminData);
    setPage("adminDashboard");
  };

  // ======================================================
  // FACULTY
  // ======================================================

  const handleFacultyLogin = (facultyData) => {
    setFaculty(facultyData);
    setPage("facultyDashboard");
  };

  const goToFacultyRegister = () => {
    setPage("facultyRegister");
  };

  // ======================================================
  // STUDENT
  // ======================================================

  const handleLogin = (studentData) => {
    setStudent(studentData);
    setPage("dashboard");
  };

  // ======================================================
  // COMPANY
  // ======================================================

  const handleCompanyLogin = (companyData) => {
    setCompanyUser(companyData);
    setPage("companyDashboard");
  };

  const goToPostInternship = () => {
    setPage("postInternship");
  };

  // ======================================================
  // COMPANY GUIDE
  // ======================================================

  const handleCompanyGuideLogin = (guideData) => {
    setCompanyGuide(guideData);
    setPage("companyGuideDashboard");
  };

  const goToCompanyGuideLogin = () => {
    setPage("companyGuideLogin");
  };

  // ======================================================
  // COLLEGE
  // ======================================================

  const handleCollegeLogin = (collegeData) => {
    setCollege(collegeData);
    setPage("collegeDashboard");
  };

  const goToCollegeLogin = () => {
    setPage("collegeLogin");
  };

  const goToCollegeRegister = () => {
    setPage("collegeRegister");
  };

  // ======================================================
  // GENERAL NAVIGATION
  // ======================================================

  const goToLogin = () => {
    setPage("login");
  };

  const goToRegister = () => {
    setPage("register");
  };

  const goToCompanyLogin = () => {
    setPage("companyLogin");
  };

  const goToCompanyRegister = () => {
    setPage("companyRegister");
  };

  // ======================================================
  // STUDENT NAVIGATION
  // ======================================================

  const goToInternships = () => {
    setPage("internships");
  };

  const goToDashboard = () => {
    setPage("dashboard");
  };

  const goToMyApplications = () => {
    setPage("myApplications");
  };

  const goToMyInternship = () => {
    setPage("myInternship");
  };

  const goToLogbook = () => {
    setPage("logbook");
  };

  const goToInternshipDetails = (company, internship) => {
    setSelectedCompany(company);
    setSelectedInternship(internship);
    setPage("companyDetails");
  };

  const goToApplicationForm = () => {
    setPage("applicationForm");
  };

  const handleApplicationSuccess = () => {
    setPage("companies");
  };

  // ======================================================
  // STUDENT LOGOUT
  // ======================================================

  const handleLogout = () => {
    setStudent(null);
    setSelectedCompany(null);
    setSelectedInternship(null);
    setPage("login");
  };

  // ======================================================
  // COMPANY LOGOUT
  // ======================================================

  const handleCompanyLogout = () => {
    setCompanyUser(null);
    setPage("login");
  };

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <>
      {/* ==================================================
          STUDENT REGISTRATION
      ================================================== */}

      {page === "register" && (
        <Register
          onRegisterSuccess={goToLogin}
          onGoToLogin={goToLogin}
        />
      )}

      {/* ==================================================
          STUDENT LOGIN
      ================================================== */}

      {page === "login" && (
        <Login
          onLogin={handleLogin}
          onGoToRegister={goToRegister}
          onGoToCompanyLogin={goToCompanyLogin}
          onGoToAdminLogin={goToAdminLogin}
          onGoToFacultyLogin={() =>
            setPage("facultyLogin")
          }
          onGoToCompanyGuideLogin={
            goToCompanyGuideLogin
          }
          onGoToCollegeLogin={goToCollegeLogin}
          onGoToCollegeRegister={goToCollegeRegister}
        />
      )}

      {/* ==================================================
          COLLEGE LOGIN
      ================================================== */}

      {page === "collegeLogin" && (
        <CollegeLogin
          onLogin={handleCollegeLogin}
          onGoToRegister={goToCollegeRegister}
          onBack={goToLogin}
        />
      )}

      {/* ==================================================
          COLLEGE REGISTRATION
      ================================================== */}

      {page === "collegeRegister" && (
        <CollegeRegister
          onSuccess={goToCollegeLogin}
          onBack={goToCollegeLogin}
        />
      )}

      {/* ==================================================
          COLLEGE DASHBOARD
      ================================================== */}

      {page === "collegeDashboard" && college && (
        <CollegeDashboard
          college={college}
          onLogout={() => {
            setCollege(null);
            setPage("login");
          }}
        />
      )}

      {/* ==================================================
          COMPANY LOGIN
      ================================================== */}

      {page === "companyLogin" && (
        <CompanyLogin
          onLogin={handleCompanyLogin}
          onBack={goToLogin}
          onRegister={goToCompanyRegister}
        />
      )}

      {/* ==================================================
          COMPANY REGISTRATION
      ================================================== */}

      {page === "companyRegister" && (
        <CompanyRegister
          onBack={goToCompanyLogin}
        />
      )}

      {/* ==================================================
          STUDENT DASHBOARD
      ================================================== */}

      {page === "dashboard" && (
        <StudentDashboard
          student={student}
          onLogout={handleLogout}
          onGoToInternships={goToInternships}
          onGoToMyApplications={goToMyApplications}
          onGoToMyInternship={goToMyInternship}
          onGoToLogbook={goToLogbook}
        />
      )}

      {/* ==================================================
          AVAILABLE INTERNSHIPS
      ================================================== */}

      {page === "internships" && (
        <Internships
          onBack={goToDashboard}
          onViewDetails={goToInternshipDetails}
        />
      )}

      {/* ==================================================
          COMPANY DETAILS
      ================================================== */}

      {page === "companyDetails" && (
        <CompanyDetails
          company={selectedCompany}
          internship={selectedInternship}
          onBack={goToInternships}
          onApply={goToApplicationForm}
        />
      )}

      {/* ==================================================
          APPLICATION FORM
      ================================================== */}

      {page === "applicationForm" && (
        <ApplicationForm
          student={student}
          company={selectedCompany}
          internship={selectedInternship}
          onBack={() =>
            setPage("companyDetails")
          }
          onSuccess={handleApplicationSuccess}
        />
      )}

      {/* ==================================================
          MY APPLICATIONS
      ================================================== */}

      {page === "myApplications" && (
        <MyApplications
          student={student}
          onBack={goToDashboard}
        />
      )}

      {/* ==================================================
          MY INTERNSHIP
      ================================================== */}

      {page === "myInternship" && (
        <MyInternship
          student={student}
        />
      )}

      {/* ==================================================
          STUDENT LOGBOOK
      ================================================== */}

      {page === "logbook" && (
        <StudentLogbook
          student={student}
          onBack={goToDashboard}
        />
      )}

      {/* ==================================================
          COMPANY DASHBOARD
      ================================================== */}

      {page === "companyDashboard" && (
        <CompanyDashboard
          company={companyUser}
          onLogout={handleCompanyLogout}
          onPostInternship={goToPostInternship}
        />
      )}

      {/* ==================================================
          POST INTERNSHIP
      ================================================== */}

      {page === "postInternship" && (
        <PostInternship
          company={companyUser}
          onBack={() =>
            setPage("companyDashboard")
          }
          onSuccess={() =>
            setPage("companyDashboard")
          }
        />
      )}

      {/* ==================================================
          PLATFORM ADMIN LOGIN
      ================================================== */}

      {page === "adminLogin" && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onBack={goToLogin}
        />
      )}

      {/* ==================================================
          PLATFORM ADMIN DASHBOARD
      ================================================== */}

      {page === "adminDashboard" && (
        <AdminDashboard
          admin={admin}
          onLogout={() => {
            setAdmin(null);
            setPage("login");
          }}
        />
      )}

      {/* ==================================================
          FACULTY LOGIN
      ================================================== */}

      {page === "facultyLogin" && (
        <FacultyLogin
          onLogin={handleFacultyLogin}
          onBack={goToLogin}
          onRegister={goToFacultyRegister}
        />
      )}

      {/* ==================================================
          FACULTY REGISTRATION
      ================================================== */}

      {page === "facultyRegister" && (
        <FacultyRegister
          onRegisterSuccess={() =>
            setPage("facultyLogin")
          }
          onBackToLogin={() =>
            setPage("facultyLogin")
          }
        />
      )}

      {/* ==================================================
          FACULTY DASHBOARD
      ================================================== */}

      {page === "facultyDashboard" && (
        <FacultyDashboard
          faculty={faculty}
          onLogout={() => {
            setFaculty(null);
            setPage("login");
          }}
        />
      )}

      {/* ==================================================
          COMPANY GUIDE LOGIN
      ================================================== */}

      {page === "companyGuideLogin" && (
        <CompanyGuideLogin
          onLogin={handleCompanyGuideLogin}
          onBack={goToLogin}
        />
      )}

      {/* ==================================================
          COMPANY GUIDE DASHBOARD
      ================================================== */}

      {page === "companyGuideDashboard" && (
        <CompanyGuideDashboard
          guide={companyGuide}
          onLogout={() => {
            setCompanyGuide(null);
            setPage("login");
          }}
        />
      )}
    </>
  );
}

export default App;

