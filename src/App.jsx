import React, { useState } from "react";

// Student
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import Companies from "./pages/Companies";
import StudentProfile from "./pages/StudentProfile";
import EditStudentProfile from "./pages/EditStudentProfile";

// Company
import CompanyLogin from "./components/CompanyLogin";
import CompanyRegister from "./pages/CompanyRegister";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyProfile from "./pages/CompanyProfile";
import EditCompanyProfile from "./pages/EditCompanyProfile";

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

function App() {
  const [page, setPage] = useState("login");

  const [student, setStudent] = useState(null);
  const [company, setCompany] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [companyGuide, setCompanyGuide] = useState(null);
  const [college, setCollege] = useState(null);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);

  // =====================================================
  // STUDENT
  // =====================================================

  const handleStudentLogin = (studentData) => {
    setStudent(studentData);
    setPage("studentDashboard");
  };

  const handleStudentLogout = () => {
    setStudent(null);
    setPage("login");
  };

  const goToStudentProfile = () => {
    setPage("studentProfile");
  };

  const goToEditStudentProfile = () => {
    setPage("editStudentProfile");
  };

  // =====================================================
  // COMPANY
  // =====================================================

  const handleCompanyLogin = (companyData) => {
    setCompany(companyData);
    setPage("companyDashboard");
  };

  const handleCompanyLogout = () => {
    setCompany(null);
    setPage("login");
  };

  const goToCompanyProfile = () => {
    setPage("companyProfile");
  };

  const goToEditCompanyProfile = () => {
    setPage("editCompanyProfile");
  };

  // =====================================================
  // ADMIN
  // =====================================================

  const handleAdminLogin = (adminData) => {
    setAdmin(adminData);
    setPage("adminDashboard");
  };

  const handleAdminLogout = () => {
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
    setPage("facultyDashboard");
  };

  const handleFacultyLogout = () => {
    setFaculty(null);
    setPage("login");
  };

  const goToFacultyProfile = () => {
    setPage("facultyProfile");
  };

  const goToEditFacultyProfile = () => {
    setPage("editFacultyProfile");
  };

  // =====================================================
  // COMPANY GUIDE
  // =====================================================

  const handleCompanyGuideLogin = (guideData) => {
    setCompanyGuide(guideData);
    setPage("companyGuideDashboard");
  };

  const handleCompanyGuideLogout = () => {
    setCompanyGuide(null);
    setPage("login");
  };

  const goToCompanyGuideProfile = () => {
    setPage("companyGuideProfile");
  };

  const goToEditCompanyGuideProfile = () => {
    setPage("editCompanyGuideProfile");
  };

  // =====================================================
  // COLLEGE
  // =====================================================

  const handleCollegeLogin = (collegeData) => {
    setCollege(collegeData);
    setPage("collegeDashboard");
  };

  const handleCollegeLogout = () => {
    setCollege(null);
    setPage("login");
  };

  const goToCollegeProfile = () => {
    setPage("collegeProfile");
  };

  const goToEditCollegeProfile = () => {
    setPage("editCollegeProfile");
  };

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
      />
    );
  }

  // =====================================================
  // STUDENT REGISTER
  // =====================================================

  if (page === "register") {
    return (
      <Register
        onBack={() => setPage("login")}
        onLogin={() => setPage("login")}
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
        onProfile={goToStudentProfile}
        onCompanies={() => setPage("companies")}
      />
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
        onUpdated={(updatedStudent) => {
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
  // COMPANIES
  // =====================================================

  if (page === "companies" && student) {
    return (
      <Companies
        student={student}
        onBack={() => setPage("studentDashboard")}
        onSelectCompany={(companyData) => {
          setSelectedCompany(companyData);
        }}
        onSelectInternship={(internshipData) => {
          setSelectedInternship(internshipData);
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

  if (page === "companyDashboard" && company) {
    return (
      <CompanyDashboard
        company={company}
        onLogout={handleCompanyLogout}
        onProfile={goToCompanyProfile}
      />
    );
  }

  // =====================================================
  // COMPANY PROFILE
  // =====================================================

  if (page === "companyProfile" && company) {
    return (
      <CompanyProfile
        company={company}
        onBack={() => setPage("companyDashboard")}
        onEdit={goToEditCompanyProfile}
        onChangePassword={() =>
          setPage("changeCompanyPassword")
        }
      />
    );
  }

  // =====================================================
  // EDIT COMPANY PROFILE
  // =====================================================

  if (page === "editCompanyProfile" && company) {
    return (
      <EditCompanyProfile
        company={company}
        onBack={() => setPage("companyProfile")}
        onUpdated={(updatedCompany) => {
          setCompany(updatedCompany);
          setPage("companyProfile");
        }}
      />
    );
  }

  // =====================================================
  // COMPANY CHANGE PASSWORD
  // =====================================================

  if (page === "changeCompanyPassword" && company) {
    return (
      <ChangePassword
        user={company}
        role="company"
        onBack={() => setPage("companyProfile")}
      />
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
        onBack={() => setPage("facultyLogin")}
        onLogin={() => setPage("facultyLogin")}
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
        onProfile={goToFacultyProfile}
      />
    );
  }

  // =====================================================
  // FACULTY PROFILE
  // =====================================================

  if (page === "facultyProfile" && faculty) {
    return (
      <FacultyProfile
        faculty={faculty}
        onBack={() => setPage("facultyDashboard")}
        onEdit={goToEditFacultyProfile}
        onChangePassword={() =>
          setPage("changeFacultyPassword")
        }
      />
    );
  }

  // =====================================================
  // EDIT FACULTY PROFILE
  // =====================================================

  if (page === "editFacultyProfile" && faculty) {
    return (
      <EditFacultyProfile
        faculty={faculty}
        onBack={() => setPage("facultyProfile")}
        onUpdated={(updatedFaculty) => {
          setFaculty(updatedFaculty);
          setPage("facultyProfile");
        }}
      />
    );
  }

  // =====================================================
  // FACULTY CHANGE PASSWORD
  // =====================================================

  if (page === "changeFacultyPassword" && faculty) {
    return (
      <ChangePassword
        user={faculty}
        role="faculty"
        onBack={() => setPage("facultyProfile")}
      />
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
        onLogin={() => setPage("companyGuideLogin")}
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
        onProfile={goToCompanyGuideProfile}
      />
    );
  }

  // =====================================================
  // COMPANY GUIDE PROFILE
  // =====================================================

  if (page === "companyGuideProfile" && companyGuide) {
    return (
      <CompanyGuideProfile
        guide={companyGuide}
        onBack={() =>
          setPage("companyGuideDashboard")
        }
        onEdit={goToEditCompanyGuideProfile}
        onChangePassword={() =>
          setPage("changeCompanyGuidePassword")
        }
      />
    );
  }

  // =====================================================
  // EDIT COMPANY GUIDE PROFILE
  // =====================================================

  if (
    page === "editCompanyGuideProfile" &&
    companyGuide
  ) {
    return (
      <EditCompanyGuideProfile
        guide={companyGuide}
        onBack={() =>
          setPage("companyGuideProfile")
        }
        onUpdated={(updatedGuide) => {
          setCompanyGuide(updatedGuide);
          setPage("companyGuideProfile");
        }}
      />
    );
  }

  // =====================================================
  // COMPANY GUIDE CHANGE PASSWORD
  // =====================================================

  if (
    page === "changeCompanyGuidePassword" &&
    companyGuide
  ) {
    return (
      <ChangePassword
        user={companyGuide}
        role="companyGuide"
        onBack={() =>
          setPage("companyGuideProfile")
        }
      />
    );
  }

  // =====================================================
  // COLLEGE LOGIN
  // =====================================================

  if (page === "collegeLogin") {
    return (
      <CollegeLogin
        onLogin={handleCollegeLogin}
        onRegister={() => setPage("collegeRegister")}
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
        onProfile={goToCollegeProfile}
      />
    );
  }

  // =====================================================
  // COLLEGE PROFILE
  // =====================================================

  if (page === "collegeProfile" && college) {
    return (
      <CollegeProfile
        college={college}
        onBack={() => setPage("collegeDashboard")}
        onEdit={goToEditCollegeProfile}
        onChangePassword={() =>
          setPage("changeCollegePassword")
        }
      />
    );
  }

  // =====================================================
  // EDIT COLLEGE PROFILE
  // =====================================================

  if (page === "editCollegeProfile" && college) {
    return (
      <EditCollegeProfile
        college={college}
        onBack={() => setPage("collegeProfile")}
        onUpdated={(updatedCollege) => {
          setCollege(updatedCollege);
          setPage("collegeProfile");
        }}
      />
    );
  }

  // =====================================================
  // COLLEGE CHANGE PASSWORD
  // =====================================================

  if (page === "changeCollegePassword" && college) {
    return (
      <ChangePassword
        user={college}
        role="college"
        onBack={() => setPage("collegeProfile")}
      />
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