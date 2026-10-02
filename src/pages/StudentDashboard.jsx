import React from "react";
import "../css/StudentDashboard.css";

function StudentDashboard({
  student,
  onLogout,
  onGoToDashboard,
  onGoToInternships,
  onGoToMyApplications,
  onGoToMyInternship,
  onGoToLogbook,
  onGoToAttendance,
  onGoToProfile,
  onGoToChangePassword,
  activeSection,
  children,
}) {
  return (
    <div className="student-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="student-sidebar">

        {/* INTERLINK LOGO */}

        <div className="student-brand">

          <div className="student-brand-logo">
            <span className="logo-i">I</span>
            <span className="logo-arrow">↗</span>
          </div>

          <div className="student-brand-text">
            <div className="student-brand-name">
              InternLink
            </div>

            <div className="student-brand-tagline">
              FYUGP INTERNSHIP PLATFORM
            </div>
          </div>

        </div>


        {/* SIDEBAR DIVIDER */}

        <div className="student-sidebar-divider"></div>


        {/* WORKSPACE */}

        <div className="student-sidebar-label">
          WORKSPACE
        </div>


        {/* DASHBOARD */}

        <button
          type="button"
          className={`student-nav-item ${
            activeSection === "dashboard" ? "active" : ""
          }`}
          onClick={onGoToDashboard}
        >
          <span className="student-nav-icon">
            ◉
          </span>

          <span>
            Dashboard
          </span>
        </button>


        {/* PROFILE */}

        <button
          type="button"
          className={`student-nav-item ${
            activeSection === "profile" ? "active" : ""
          }`}
          onClick={onGoToProfile}
        >
          <span className="student-nav-icon">
            ◯
          </span>

          <span>
            My Profile
          </span>
        </button>


        {/* AVAILABLE INTERNSHIPS */}

        <button
          type="button"
          className={`student-nav-item ${
            activeSection === "internships" ? "active" : ""
          }`}
          onClick={onGoToInternships}
        >
          <span className="student-nav-icon">
            ◇
          </span>

          <span>
            Internships
          </span>
        </button>


        {/* MY APPLICATIONS */}

        <button
          type="button"
          className={`student-nav-item ${
            activeSection === "applications" ? "active" : ""
          }`}
          onClick={onGoToMyApplications}
        >
          <span className="student-nav-icon">
            ▤
          </span>

          <span>
            My Applications
          </span>
        </button>


        {/* MY INTERNSHIP */}

        <button
          type="button"
          className={`student-nav-item ${
            activeSection === "myInternship" ? "active" : ""
          }`}
          onClick={onGoToMyInternship}
        >
          <span className="student-nav-icon">
            ◆
          </span>

          <span>
            My Internship
          </span>
        </button>


        {/* ATTENDANCE */}

        <button
          type="button"
          className={`student-nav-item ${
            activeSection === "attendance" ? "active" : ""
          }`}
          onClick={onGoToAttendance}
        >
          <span className="student-nav-icon">
            ◷
          </span>

          <span>
            Attendance
          </span>
        </button>


        {/* LOGBOOK */}

        <button
          type="button"
          className={`student-nav-item ${
            activeSection === "logbook" ? "active" : ""
          }`}
          onClick={onGoToLogbook}
        >
          <span className="student-nav-icon">
            ▥
          </span>

          <span>
            Logbook
          </span>
        </button>


        {/* =====================================================
            SIDEBAR BOTTOM
        ===================================================== */}

        <div className="student-sidebar-bottom">

          {/* STUDENT MINI PROFILE */}

          <div className="student-mini-profile">

            <div className="student-mini-avatar">
              {student?.name
                ? student.name.charAt(0).toUpperCase()
                : "S"}
            </div>

            <div className="student-mini-details">

              <strong>
                {student?.name || "Student"}
              </strong>

              <span>
                Student
              </span>

            </div>

          </div>


          {/* CHANGE PASSWORD */}

          <button
            type="button"
            className="student-bottom-button"
            onClick={onGoToChangePassword}
          >
            <span>
              🔐
            </span>

            Change Password
          </button>


          {/* LOGOUT */}

          <button
            type="button"
            className="student-bottom-button logout"
            onClick={onLogout}
          >
            <span>
              ↪
            </span>

            Logout
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="student-main">

        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <header className="student-topbar">

          <div>

            <div className="student-page-label">
              FYUGP STUDENT WORKSPACE
            </div>

            <h1>
              {activeSection === "profile"
                ? "My Profile"

                : activeSection === "editProfile"
                ? "Edit Profile"

                : activeSection === "applications"
                ? "My Applications"

                : activeSection === "internships"
                ? "Available Internships"

                : activeSection === "internshipDetails"
                ? "Internship Details"

                : activeSection === "applicationForm"
                ? "Application Form"

                : activeSection === "myInternship"
                ? "My Internship"

                : activeSection === "attendance"
                ? "Attendance"

                : activeSection === "logbook"
                ? "Logbook"

                : activeSection === "changePassword"
                ? "Change Password"

                : "Home"}
            </h1>

          </div>


          <div className="student-topbar-right">

            <div className="student-topbar-welcome">
              Welcome back
            </div>

            <div className="student-topbar-avatar">
              {student?.name
                ? student.name.charAt(0).toUpperCase()
                : "S"}
            </div>

          </div>

        </header>


        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}

        <div className="student-page-content">

          {/* =================================================
              HOME / DASHBOARD
              No section-specific information is shown here.
          ================================================= */}

          {activeSection === "dashboard" && (
            <section className="student-home">

              {/* =============================================
                  HERO AREA
              ============================================= */}

              <div className="student-home-hero">

                <div className="student-home-text">

                  <span className="student-home-badge">
                    WELCOME TO INTERNLINK
                  </span>

                  <h2>
                    Hello,{" "}
                    <span>
                      {student?.name || "Student"}
                    </span>
                    <br />
                    <strong>
                      Your journey starts here.
                    </strong>
                  </h2>

                  <p>
                    A simple space to explore, learn,
                    grow and build your internship
                    experience.
                  </p>

                  <div className="student-home-line">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                </div>


                {/* =========================================
                    STUDENT ILLUSTRATION
                ========================================= */}

                <div className="student-illustration-area">

                  <div className="illustration-glow"></div>

                  {/* FLOATING BULB */}

                  <div className="floating-bulb">
                    <div className="bulb-rays">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div className="bulb-icon">
                      💡
                    </div>
                  </div>


                  {/* BOOKS */}

                  <div className="study-books">
                    <div className="book book-one"></div>
                    <div className="book book-two"></div>
                    <div className="book book-three"></div>
                  </div>


                  {/* DESK */}

                  <div className="study-desk"></div>


                  {/* LAPTOP */}

                  <div className="study-laptop">

                    <div className="laptop-screen">
                      <div className="laptop-screen-line"></div>
                      <div className="laptop-screen-line short"></div>
                      <div className="laptop-screen-dot"></div>
                    </div>

                    <div className="laptop-base"></div>

                  </div>


                  {/* STUDENT */}

                  <div className="study-student">

                    <div className="student-hair"></div>

                    <div className="student-head">
                      <div className="student-eye left"></div>
                      <div className="student-eye right"></div>
                      <div className="student-smile"></div>
                    </div>

                    <div className="student-body">

                      <div className="student-shirt"></div>

                      <div className="student-arm left-arm"></div>

                      <div className="student-arm right-arm"></div>

                    </div>

                  </div>


                  {/* PLANT */}

                  <div className="study-plant">

                    <div className="plant-pot"></div>

                    <div className="plant-stem"></div>

                    <div className="plant-leaf leaf-one"></div>
                    <div className="plant-leaf leaf-two"></div>
                    <div className="plant-leaf leaf-three"></div>

                  </div>

                </div>

              </div>


              {/* =============================================
                  WELCOME MESSAGE
              ============================================= */}

              <div className="student-home-message">

                <div className="message-icon">
                  ✦
                </div>

                <div>

                  <span>
                    LEARN • GROW • BUILD
                  </span>

                  <h3>
                    Make every step of your internship
                    journey meaningful.
                  </h3>

                  <p>
                    Explore the workspace whenever you
                    are ready. Your internship tools and
                    information are available through the
                    navigation menu.
                  </p>

                </div>

              </div>


              {/* =============================================
                  THREE SIMPLE VALUES
                  These are generic and do not duplicate
                  any section's actual information.
              ============================================= */}

              <div className="student-home-values">

                <div className="student-value-card">

                  <div className="value-icon green">
                    ✦
                  </div>

                  <div>
                    <h3>
                      Learn
                    </h3>

                    <p>
                      Turn every experience into
                      something you can learn from.
                    </p>
                  </div>

                </div>


                <div className="student-value-card">

                  <div className="value-icon coral">
                    ↗
                  </div>

                  <div>
                    <h3>
                      Grow
                    </h3>

                    <p>
                      Develop your skills through
                      real-world experiences.
                    </p>
                  </div>

                </div>


                <div className="student-value-card">

                  <div className="value-icon mint">
                    ★
                  </div>

                  <div>
                    <h3>
                      Build
                    </h3>

                    <p>
                      Build confidence for your
                      academic and professional future.
                    </p>
                  </div>

                </div>

              </div>


              {/* =============================================
                  BOTTOM QUOTE
              ============================================= */}

              <div className="student-home-quote">

                <div className="quote-mark">
                  “
                </div>

                <div>

                  <p>
                    Small steps today can become
                    meaningful achievements tomorrow.
                  </p>

                  <span>
                    — Your InternLink journey
                  </span>

                </div>

                <div className="quote-decoration">
                  ✦
                </div>

              </div>

            </section>
          )}


          {/* =====================================================
              OTHER STUDENT SECTIONS
              Existing functionality preserved.
          ===================================================== */}

          {activeSection !== "dashboard" && (
            <div className="student-section-wrapper">
              {children}
            </div>
          )}

        </div>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="student-footer">

          <span>
            © InternLink
          </span>

          <span>
            FYUGP Internship Management Platform
          </span>

        </footer>

      </main>

    </div>
  );
}

export default StudentDashboard;