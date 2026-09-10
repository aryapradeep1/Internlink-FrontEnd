import { useState } from "react";
import "./App.css";

import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import Companies from "./pages/Companies";
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
import FacultyLogin from "./pages/FacultyLogin";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyRegister from "./pages/FacultyRegister";
import CompanyGuideLogin from "./pages/CompanyGuideLogin";
import CompanyGuideDashboard from "./pages/CompanyGuideDashboard";
function App() {
  const [page, setPage] = useState("register");
  const [student, setStudent] = useState(null);
  const [companyUser, setCompanyUser] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [companyGuide, setCompanyGuide] = useState(null);


  const goToAdminLogin = () => {
  setPage("adminLogin");
};


const goToPostInternship = () => {
  setPage("postInternship");
};


const handleAdminLogin = (adminData) => {
  setAdmin(adminData);
  setPage("adminDashboard");
};

const handleFacultyLogin = (facultyData) => {
  setFaculty(facultyData);
  setPage("facultyDashboard");
};

const goToFacultyRegister = () => {
  setPage("facultyRegister");
};

  // Student login
  const handleLogin = (studentData) => {
    setStudent(studentData);
    setPage("dashboard");
  };

  // Company login
  const handleCompanyLogin = (companyData) => {
    setCompanyUser(companyData);
    setPage("companyDashboard");
  };

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


  const handleLogout = () => {
  setStudent(null);
  setSelectedCompany(null);
  setSelectedInternship(null);
  setPage("login");
};

  const handleCompanyLogout = () => {
    setCompanyUser(null);
    setPage("login");
  };

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
const goToInternshipDetails = (company, internship) => {
  setSelectedCompany(company);
  setSelectedInternship(internship);
  setPage("companyDetails");
};

  // Open application form
  const goToApplicationForm = () => {
    setPage("applicationForm");
  };

  // After successful application
  const handleApplicationSuccess = () => {
    setPage("companies");
  };


  const handleCompanyGuideLogin = (guideData) => {
  setCompanyGuide(guideData);
  setPage("companyGuideDashboard");
};

const goToCompanyGuideLogin = () => {
  setPage("companyGuideLogin");
};

  return (
    <>
      {/* Registration Page */}
      {page === "register" && (
        <Register
          onRegisterSuccess={goToLogin}
          onGoToLogin={goToLogin}
        />
      )}

      {/* Student Login Page */}
      {page === "login" && (
   <Login
  onLogin={handleLogin}
  onGoToRegister={goToRegister}
  onGoToCompanyLogin={goToCompanyLogin}
  onGoToAdminLogin={goToAdminLogin}
  onGoToFacultyLogin={() => setPage("facultyLogin")}
   onGoToCompanyGuideLogin={goToCompanyGuideLogin}
/>
      )}

    {/* Company Login Page */}
{page === "companyLogin" && (
  <CompanyLogin
    onLogin={handleCompanyLogin}
    onBack={goToLogin}
    onRegister={goToCompanyRegister}
  />
)}

       {/* Company Registration Page */}
    {page === "companyRegister" && (
       <CompanyRegister
      onBack={goToCompanyLogin}
      />
      )}


      {/* Student Dashboard */}
      {page === "dashboard" && (
        <StudentDashboard
          student={student}
          onLogout={handleLogout}
          onGoToInternships={goToInternships}
          onGoToMyApplications={goToMyApplications}
           onGoToMyInternship={goToMyInternship}
        />
      )}

      {/* Available Internships */}
{page === "internships" && (
  <Internships
    onBack={goToDashboard}
    onViewDetails={goToInternshipDetails}
  />
)}

      {/* Company Details */}
      {page === "companyDetails" && (
       <CompanyDetails
  company={selectedCompany}
  internship={selectedInternship}
  onBack={goToInternships}
  onApply={goToApplicationForm}
/>
      )}

      {/* Application Form */}
      {page === "applicationForm" && (
      <ApplicationForm
  student={student}
  company={selectedCompany}
  internship={selectedInternship}
  onBack={() => setPage("companyDetails")}
  onSuccess={handleApplicationSuccess}
/>
      )}

      {/* My Applications */}
      {page === "myApplications" && (
        <MyApplications
          student={student}
          onBack={goToDashboard}
        />
      )}

      {/* Temporary Company Dashboard */}
 
      {page === "companyDashboard" && (
  <CompanyDashboard
    company={companyUser}
    onLogout={handleCompanyLogout}
    onPostInternship={goToPostInternship}
  />
)}


          {page === "postInternship" && (
         <PostInternship
    company={companyUser}
    onBack={() => setPage("companyDashboard")}
    onSuccess={() => setPage("companyDashboard")}
      />
      )}

{page === "adminLogin" && (
  <AdminLogin
    onLogin={handleAdminLogin}
    onBack={goToLogin}
  />
)}

{page === "facultyLogin" && (
  <FacultyLogin
    onLogin={handleFacultyLogin}
    onBack={goToLogin}
     onRegister={goToFacultyRegister}
  />
)}

{page === "facultyRegister" && (
  <FacultyRegister
    onRegisterSuccess={() => setPage("facultyLogin")}
    onBackToLogin={() => setPage("facultyLogin")}
  />
)}

{page === "facultyDashboard" && (
  <FacultyDashboard
    faculty={faculty}
    onLogout={() => {
      setFaculty(null);
      setPage("login");
    }}
  />
)}

/* myintershnip */
{page === "myInternship" && (
  <MyInternship student={student} />
)}


/*      {/* Admin Dashboard */}
      {page === "adminDashboard" && (
  <AdminDashboard
    admin={admin}
    onLogout={() => {
      setAdmin(null);
      setPage("login");
    }}

  />
)}

{page === "companyGuideDashboard" && (
  <CompanyGuideDashboard
    guide={companyGuide}
    onLogout={() => {
      setCompanyGuide(null);
      setPage("login");
    }}
  />
)}


{page === "companyGuideLogin" && (
  <CompanyGuideLogin
    onLogin={handleCompanyGuideLogin}
    onBack={goToLogin}
  />
)}
        

    </>
  );
}

export default App;