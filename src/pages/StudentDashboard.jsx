import React from "react";
import "../css/StudentDashboard.css";

function StudentDashboard({
  student,
  onLogout,
  onGoToInternships,
  onGoToMyApplications,
  onGoToMyInternship,
  onGoToLogbook,
  onGoToProfile,
  onGoToChangePassword,
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

        <div className="student-nav-item active">

          <span className="student-nav-icon">
            ◉
          </span>

          <span>
            Dashboard
          </span>

        </div>


        {/* PROFILE */}

        <button
          className="student-nav-item"
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
          className="student-nav-item"
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
          className="student-nav-item"
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
          className="student-nav-item"
          onClick={onGoToMyInternship}
        >

          <span className="student-nav-icon">
            ◆
          </span>

          <span>
            My Internship
          </span>

        </button>


        {/* LOGBOOK */}

        <button
          className="student-nav-item"
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

        {/* TOP BAR */}

        <header className="student-topbar">

          <div>

            <div className="student-page-label">
              STUDENT WORKSPACE
            </div>

            <h1>
              Student Dashboard
            </h1>

          </div>

          <div className="student-topbar-avatar">
            {student?.name
              ? student.name.charAt(0).toUpperCase()
              : "S"}
          </div>

        </header>


        {/* =====================================================
            WELCOME BANNER
        ===================================================== */}

        <section className="student-welcome">

          <div className="student-welcome-content">

            <span className="student-welcome-badge">
              FYUGP STUDENT
            </span>

            <h2>
              Welcome back,{" "}
              <span>
                {student?.name || "Student"}
              </span>{" "}
              👋
            </h2>

            <p>
              Manage your internship journey,
              applications and academic progress
              from one place.
            </p>

          </div>


          <div className="student-welcome-decoration">

            <div className="welcome-circle-one"></div>

            <div className="welcome-circle-two"></div>

            <div className="welcome-small-card">
              <span>INTERNSHIP</span>
              <strong>Journey</strong>
            </div>

          </div>

        </section>


        {/* =====================================================
            STUDENT INFORMATION
        ===================================================== */}

        <section className="student-information">

          <div className="student-section-heading">

            <div>

              <span className="student-section-label">
                YOUR INFORMATION
              </span>

              <h2>
                Student Overview
              </h2>

            </div>

            <button
              className="student-profile-button"
              onClick={onGoToProfile}
            >
              View Profile
              <span>→</span>
            </button>

          </div>


          <div className="student-info-grid">

            {/* NAME */}

            <div className="student-info-card">

              <div className="student-info-icon green">
                A
              </div>

              <div>

                <span>
                  STUDENT NAME
                </span>

                <strong>
                  {student?.name || "Not available"}
                </strong>

              </div>

            </div>


            {/* REGISTER NUMBER */}

            <div className="student-info-card">

              <div className="student-info-icon peach">
                #
              </div>

              <div>

                <span>
                  REGISTER NUMBER
                </span>

                <strong>
                  {student?.registerNumber || "Not available"}
                </strong>

              </div>

            </div>


            {/* DEPARTMENT */}

            <div className="student-info-card">

              <div className="student-info-icon lavender">
                ◇
              </div>

              <div>

                <span>
                  DEPARTMENT
                </span>

                <strong>
                  {student?.department || "Not available"}
                </strong>

              </div>

            </div>


            {/* SEMESTER */}

            <div className="student-info-card">

              <div className="student-info-icon cream">
                S
              </div>

              <div>

                <span>
                  SEMESTER
                </span>

                <strong>
                  {student?.semester || "Not available"}
                </strong>

              </div>

            </div>


            {/* EMAIL */}

            <div className="student-info-card email-card">

              <div className="student-info-icon mint">
                @
              </div>

              <div>

                <span>
                  EMAIL
                </span>

                <strong>
                  {student?.email || "Not available"}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            INTERNSHIP WORKSPACE
        ===================================================== */}

        <section className="student-workspace">

          <div className="student-section-heading">

            <div>

              <span className="student-section-label">
                INTERNSHIP JOURNEY
              </span>

              <h2>
                Manage Your Internship
              </h2>

            </div>

          </div>


          <div className="student-action-grid">


            {/* AVAILABLE INTERNSHIPS */}

            <button
              className="student-action-card internship-action"
              onClick={onGoToInternships}
            >

              <div className="student-action-top">

                <div className="student-action-icon">
                  💼
                </div>

                <span className="student-action-arrow">
                  →
                </span>

              </div>

              <h3>
                Available Internships
              </h3>

              <p>
                Explore internship opportunities
                posted by approved companies.
              </p>

            </button>


            {/* MY APPLICATIONS */}

            <button
              className="student-action-card applications-action"
              onClick={onGoToMyApplications}
            >

              <div className="student-action-top">

                <div className="student-action-icon">
                  📋
                </div>

                <span className="student-action-arrow">
                  →
                </span>

              </div>

              <h3>
                My Applications
              </h3>

              <p>
                View the internships you have
                applied for and their status.
              </p>

            </button>


            {/* MY INTERNSHIP */}

            <button
              className="student-action-card internship-progress-action"
              onClick={onGoToMyInternship}
            >

              <div className="student-action-top">

                <div className="student-action-icon">
                  🎓
                </div>

                <span className="student-action-arrow">
                  →
                </span>

              </div>

              <h3>
                My Internship
              </h3>

              <p>
                Access your approved internship
                and internship information.
              </p>

            </button>


            {/* LOGBOOK */}

            <button
              className="student-action-card logbook-action"
              onClick={onGoToLogbook}
            >

              <div className="student-action-top">

                <div className="student-action-icon">
                  📖
                </div>

                <span className="student-action-arrow">
                  →
                </span>

              </div>

              <h3>
                Logbook
              </h3>

              <p>
                Record and manage your internship
                activities and hours.
              </p>

            </button>


          </div>

        </section>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="student-footer">

          <span>
            © InterLink
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