import React, { useState } from "react";

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


// intershnip opeertunity
import PostInternship from "./pages/PostInternship";
//import InternshipDetails from "./pages/InternshipDetails";
import InternshipCertificate from "./pages/InternshipCertificate";

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
  const [certificateAssignment, setCertificateAssignment] = useState(null);
const [certificateHours, setCertificateHours] = useState(0);

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

  // Clear old company dashboard data
  window.location.reload();
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
        onGoToProfile={goToStudentProfile}
        onGoToChangePassword={() =>
          setPage("changeStudentPassword")
        }
        onGoToInternships={() =>
          setPage("companies")
        }
        onGoToMyApplications={() =>
          setPage("myApplications")
        }
        onGoToMyInternship={() =>
          setPage("myInternship")
        }
        onGoToLogbook={() =>
          setPage("studentLogbook")
        }
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
      onBack={() => setPage("myInternship")}
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
// INTERNSHIP DETAILS
// =====================================================

if (
  page === "internshipDetails" &&
  student &&
  selectedInternship
) {
  return (
    <div className="companies-container">

      <h1>Internship Details</h1>

      <h2>
        {selectedInternship.title}
      </h2>

      <p>
        <strong>Company:</strong>{" "}
        {selectedCompany?.companyName || "Company"}
      </p>

      <p>
        <strong>Description:</strong>{" "}
        {selectedInternship.description}
      </p>

      <p>
        <strong>Location:</strong>{" "}
        {selectedInternship.location}
      </p>

      <p>
        <strong>Eligibility:</strong>{" "}
        {selectedInternship.eligibility}
      </p>

      <p>
        <strong>Skills Required:</strong>{" "}
        {selectedInternship.skillsRequired}
      </p>

      <p>
        <strong>Duration:</strong>{" "}
        {selectedInternship.duration}
      </p>

      <p>
        <strong>Application Deadline:</strong>{" "}
        {new Date(
          selectedInternship.deadline
        ).toLocaleDateString()}
      </p>

     
       <button
  onClick={() => setPage("applicationForm")}
>
  Apply
</button>

      <br />
      <br />

      <button
        onClick={() => setPage("companies")}
      >
        ← Back to Internships
      </button>

    </div>
  );
}

// =====================================================
// APPLICATION FORM
// =====================================================

if (
  page === "applicationForm" &&
  student &&
  selectedCompany &&
  selectedInternship
) {
  return (
    <ApplicationForm
      student={student}
      company={selectedCompany}
      internship={selectedInternship}
      onBack={() => setPage("internshipDetails")}
      onSuccess={() => setPage("myApplications")}
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
      onGoToProfile={goToCompanyProfile}
      onPostInternship={() =>
        setPage("postInternship")
      }
      onRegisterCompanyGuide={() =>
        setPage("companyGuideRegister")
      }
    />
  );
}

// POst inetrnship

if (page === "postInternship" && company) {
  return (
    <PostInternship
      company={company}
      onBack={() => setPage("companyDashboard")}
      onSuccess={() => setPage("companyDashboard")}
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
      onGoToProfile={goToFacultyProfile}
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
  onGoToProfile={goToCollegeProfile}
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

