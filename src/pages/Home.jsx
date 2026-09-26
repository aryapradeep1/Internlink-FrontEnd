import React from "react";
import "../css/Home.css";

const Home = ({ onLogin, onSignup }) => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}
      <nav className="home-navbar">
        <div className="nav-container">

          <div
            className="brand"
            onClick={() => scrollToSection("home")}
          >
            <div className="brand-logo">
              <span className="logo-i">I</span>
              <span className="logo-link">↗</span>
            </div>

            <div className="brand-text">
              <span className="brand-name">InternLink</span>
              <span className="brand-tagline">
                FYUGP Internship Platform
              </span>
            </div>
          </div>

          <div className="nav-links">
            <button onClick={() => scrollToSection("home")}>
              Home
            </button>

            <button onClick={() => scrollToSection("about")}>
              About
            </button>

            <button onClick={() => scrollToSection("how-it-works")}>
              How It Works
            </button>

            <button onClick={() => scrollToSection("features")}>
              Features
            </button>
          </div>

          <div className="nav-actions">
            <button
              className="nav-login"
              onClick={onLogin}
            >
              Login
            </button>

            <button
              className="nav-signup"
              onClick={onSignup}
            >
              Get Started
              <span>→</span>
            </button>
          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section className="hero-section" id="home">

        <div className="hero-decoration hero-decoration-one"></div>
        <div className="hero-decoration hero-decoration-two"></div>
        <div className="hero-decoration hero-decoration-three"></div>

        <div className="hero-container">

          <div className="hero-content">

            <div className="hero-badge">
              <span className="badge-dot"></span>
              Built for FYUGP Internship Management
            </div>

            <h1>
              Connecting
              <span className="highlight-green"> students </span>
              with
              <span className="highlight-coral"> meaningful </span>
              internships.
            </h1>

            <p className="hero-description">
              InterLink brings students, companies, colleges, faculty
              guides and company guides together in one organized
              internship management platform.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-button"
                onClick={onSignup}
              >
                Get Started
                <span>→</span>
              </button>

              <button
                className="secondary-button"
                onClick={() => scrollToSection("how-it-works")}
              >
                Explore Platform
                <span>↓</span>
              </button>

            </div>

            <div className="hero-trust">

              <div className="avatar-stack">
                <div className="avatar avatar-one">S</div>
                <div className="avatar avatar-two">C</div>
                <div className="avatar avatar-three">F</div>
                <div className="avatar avatar-four">G</div>
              </div>

              <div className="trust-text">
                <strong>One connected platform</strong>
                <span>
                  for the complete internship journey
                </span>
              </div>

            </div>

          </div>


          {/* HERO VISUAL */}
          <div className="hero-visual">

            <div className="hero-image-wrapper">

              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85"
                alt="Students collaborating"
                className="hero-image"
              />

              <div className="image-overlay"></div>

            </div>


            {/* Floating card 1 */}
            <div className="floating-card internship-card">

              <div className="floating-icon mint-icon">
                ✓
              </div>

              <div>
                <span>Internship</span>
                <strong>Approved</strong>
              </div>

              <div className="status-check">
                ✓
              </div>

            </div>


            {/* Floating card 2 */}
            <div className="floating-card connection-card">

              <div className="connection-icon">
                ↗
              </div>

              <div>
                <span>Connected</span>
                <strong>5 Roles</strong>
              </div>

            </div>


            {/* Decorative circle */}
            <div className="visual-circle"></div>

          </div>

        </div>
      </section>


      {/* ================= STATS ================= */}
      <section className="stats-section">

        <div className="stats-container">

          <div className="stat-item">
            <div className="stat-number">01</div>
            <div className="stat-content">
              <strong>Unified Platform</strong>
              <span>One place for internship management</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-number">05</div>
            <div className="stat-content">
              <strong>Connected Roles</strong>
              <span>Students, companies, colleges & guides</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-number">02</div>
            <div className="stat-content">
              <strong>Credit Value</strong>
              <span>FYUGP internship credit</span>
            </div>
          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}
      <section className="about-section section-padding" id="about">

        <div className="section-container">

          <div className="section-heading">

            <span className="section-label">
              ABOUT INTERLINK
            </span>

            <h2>
              Making internship management
              <span> simpler and connected.</span>
            </h2>

            <p>
              InterLink is designed to organize the complete FYUGP
              internship process, from discovering opportunities to
              completing the internship and receiving certification.
            </p>

          </div>


          <div className="about-grid">

            <div className="about-card about-card-main">

              <div className="about-icon mint-bg">
                <span>◎</span>
              </div>

              <h3>
                One platform.
                <br />
                Complete journey.
              </h3>

              <p>
                Instead of managing internship activities through
                disconnected systems, InterLink connects every
                important participant in one workflow.
              </p>

              <div className="about-line"></div>

              <div className="about-mini">

                <div>
                  <strong>Student</strong>
                  <span>Discover & Apply</span>
                </div>

                <div>
                  <strong>Company</strong>
                  <span>Post & Manage</span>
                </div>

              </div>

            </div>


            <div className="about-card cream-card">

              <div className="about-icon peach-bg">
                <span>✦</span>
              </div>

              <h3>
                Organized
                <br />
                Opportunities
              </h3>

              <p>
                Companies can publish internship opportunities with
                descriptions, eligibility requirements, skills,
                duration and deadlines.
              </p>

              <button
                onClick={() => scrollToSection("features")}
                className="text-link"
              >
                Explore features →
              </button>

            </div>


            <div className="about-card lavender-card">

              <div className="about-icon lavender-bg">
                <span>♧</span>
              </div>

              <h3>
                Guided
                <br />
                Experience
              </h3>

              <p>
                Faculty guides and company guides help students
                throughout their internship journey.
              </p>

              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-link"
              >
                See how it works →
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ================= VISUAL STORY ================= */}
      <section className="visual-story-section">

        <div className="section-container">

          <div className="visual-story-grid">

            <div className="story-image-container">

              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85"
                alt="Team working together"
                className="story-image"
              />

              <div className="story-image-overlay"></div>

              <div className="story-caption">

                <div className="caption-icon">
                  ↗
                </div>

                <div>
                  <strong>Connected Experience</strong>
                  <span>
                    From application to completion
                  </span>
                </div>

              </div>

            </div>


            <div className="story-content">

              <span className="section-label">
                THE INTERLINK EXPERIENCE
              </span>

              <h2>
                From opportunity
                <span> to achievement.</span>
              </h2>

              <p>
                InterLink creates a structured workflow where every
                stage of an internship can be managed clearly.
              </p>


              <div className="story-steps">

                <div className="story-step">

                  <div className="story-step-number">
                    01
                  </div>

                  <div>
                    <h4>Discover</h4>
                    <p>
                      Find internship opportunities that match
                      your academic requirements.
                    </p>
                  </div>

                </div>


                <div className="story-step">

                  <div className="story-step-number">
                    02
                  </div>

                  <div>
                    <h4>Apply</h4>
                    <p>
                      Submit your application with the required
                      documents.
                    </p>
                  </div>

                </div>


                <div className="story-step">

                  <div className="story-step-number">
                    03
                  </div>

                  <div>
                    <h4>Complete</h4>
                    <p>
                      Track your internship, logbook and
                      certification in one place.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section
        className="how-section section-padding"
        id="how-it-works"
      >

        <div className="section-container">

          <div className="section-heading centered">

            <span className="section-label">
              HOW IT WORKS
            </span>

            <h2>
              A simple workflow for a
              <span> complete internship.</span>
            </h2>

            <p>
              InterLink organizes every important stage of the
              internship process into a clear workflow.
            </p>

          </div>


          <div className="workflow-grid">

            <div className="workflow-card">

              <div className="workflow-top">
                <span className="workflow-number">01</span>
                <div className="workflow-icon mint-icon">
                  ◇
                </div>
              </div>

              <h3>Discover</h3>

              <p>
                Students explore internship opportunities posted
                by approved companies.
              </p>

              <span className="workflow-arrow">→</span>

            </div>


            <div className="workflow-card peach-workflow">

              <div className="workflow-top">
                <span className="workflow-number">02</span>
                <div className="workflow-icon peach-icon">
                  ↗
                </div>
              </div>

              <h3>Apply</h3>

              <p>
                Students submit their applications along with
                their CV and required academic documents.
              </p>

              <span className="workflow-arrow">→</span>

            </div>


            <div className="workflow-card lavender-workflow">

              <div className="workflow-top">
                <span className="workflow-number">03</span>
                <div className="workflow-icon lavender-icon">
                  ✓
                </div>
              </div>

              <h3>Approve</h3>

              <p>
                Companies and colleges review applications
                through the structured approval process.
              </p>

              <span className="workflow-arrow">→</span>

            </div>


            <div className="workflow-card cream-workflow">

              <div className="workflow-top">
                <span className="workflow-number">04</span>
                <div className="workflow-icon cream-icon">
                  ♧
                </div>
              </div>

              <h3>Assign Guides</h3>

              <p>
                Faculty and company guides are connected with
                students for internship support.
              </p>

              <span className="workflow-arrow">→</span>

            </div>


            <div className="workflow-card pink-workflow">

              <div className="workflow-top">
                <span className="workflow-number">05</span>
                <div className="workflow-icon pink-icon">
                  ◷
                </div>
              </div>

              <h3>Track</h3>

              <p>
                Students maintain their internship logbook and
                track their progress.
              </p>

              <span className="workflow-arrow">→</span>

            </div>


            <div className="workflow-card green-workflow">

              <div className="workflow-top">
                <span className="workflow-number">06</span>
                <div className="workflow-icon green-icon">
                  ★
                </div>
              </div>

              <h3>Complete</h3>

              <p>
                Internship completion and certification bring the
                entire journey to an organized finish.
              </p>

              <span className="workflow-arrow">✓</span>

            </div>

          </div>

        </div>

      </section>


      {/* ================= ROLES ================= */}
      <section className="roles-section section-padding">

        <div className="section-container">

          <div className="section-heading">

            <span className="section-label">
              ONE CONNECTED ECOSYSTEM
            </span>

            <h2>
              Everyone has a role.
              <span> Everyone stays connected.</span>
            </h2>

            <p>
              InterLink brings the key participants of the
              internship process together.
            </p>

          </div>


          <div className="roles-grid">

            <div className="role-card role-student">

              <div className="role-icon">
                👩‍🎓
              </div>

              <span className="role-label">
                FOR STUDENTS
              </span>

              <h3>Students</h3>

              <p>
                Discover opportunities, apply for internships,
                track applications and maintain your internship
                journey.
              </p>

              <div className="role-list">
                <span>✓ Find internships</span>
                <span>✓ Apply with documents</span>
                <span>✓ Track progress</span>
              </div>

            </div>


            <div className="role-card role-company">

              <div className="role-icon">
                🏢
              </div>

              <span className="role-label">
                FOR COMPANIES
              </span>

              <h3>Companies</h3>

              <p>
                Publish internship opportunities and manage
                student applications efficiently.
              </p>

              <div className="role-list">
                <span>✓ Post opportunities</span>
                <span>✓ Review applications</span>
                <span>✓ Assign company guides</span>
              </div>

            </div>


            <div className="role-card role-college">

              <div className="role-icon">
                🏫
              </div>

              <span className="role-label">
                FOR COLLEGES
              </span>

              <h3>Colleges</h3>

              <p>
                Manage internship approvals and coordinate the
                academic side of the process.
              </p>

              <div className="role-list">
                <span>✓ Manage approvals</span>
                <span>✓ Coordinate students</span>
                <span>✓ Connect guides</span>
              </div>

            </div>


            <div className="role-card role-faculty">

              <div className="role-icon">
                👨‍🏫
              </div>

              <span className="role-label">
                FOR FACULTY
              </span>

              <h3>Faculty Guides</h3>

              <p>
                Guide students throughout their internship and
                monitor their academic progress.
              </p>

              <div className="role-list">
                <span>✓ Guide students</span>
                <span>✓ Review logbooks</span>
                <span>✓ Monitor progress</span>
              </div>

            </div>


            <div className="role-card role-guide">

              <div className="role-icon">
                🧑‍💼
              </div>

              <span className="role-label">
                FOR COMPANY GUIDES
              </span>

              <h3>Company Guides</h3>

              <p>
                Support students from the company side and
                contribute to their internship evaluation.
              </p>

              <div className="role-list">
                <span>✓ Support interns</span>
                <span>✓ Review internship work</span>
                <span>✓ Approve completion</span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section
        className="features-section section-padding"
        id="features"
      >

        <div className="section-container">

          <div className="section-heading centered">

            <span className="section-label">
              PLATFORM FEATURES
            </span>

            <h2>
              Everything needed for
              <span> internship management.</span>
            </h2>

            <p>
              InterLink keeps the complete internship journey
              organized, transparent and easy to follow.
            </p>

          </div>


          <div className="features-grid">

            <div className="feature-card">

              <div className="feature-icon mint-bg">
                ◇
              </div>

              <h3>Internship Opportunities</h3>

              <p>
                Companies can create detailed internship
                opportunities with eligibility, skills, duration
                and deadlines.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon peach-bg">
                ↗
              </div>

              <h3>Application Tracking</h3>

              <p>
                Students can easily view the status of their
                submitted internship applications.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon lavender-bg">
                ♧
              </div>

              <h3>Guide Assignment</h3>

              <p>
                Faculty and company guides can be connected to
                students through the internship workflow.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon cream-bg">
                ◷
              </div>

              <h3>Digital Logbook</h3>

              <p>
                Students can record their daily internship work,
                learning and working hours digitally.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon pink-bg">
                ✓
              </div>

              <h3>Internship Certification</h3>

              <p>
                Internship completion and certificate management
                are integrated into the platform.
              </p>

            </div>


            <div className="feature-card feature-highlight">

              <div className="feature-highlight-content">

                <span className="small-label">
                  BUILT AROUND FYUGP
                </span>

                <h3>
                  A structured internship journey for
                  students.
                </h3>

                <button
                  onClick={onSignup}
                  className="feature-button"
                >
                  Start your journey →
                </button>

              </div>

              <div className="feature-decoration-circle"></div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="cta-section">

        <div className="cta-decoration cta-circle-one"></div>
        <div className="cta-decoration cta-circle-two"></div>

        <div className="cta-container">

          <div className="cta-content">

            <span className="cta-label">
              START WITH INTERLINK
            </span>

            <h2>
              Your internship journey
              <br />
              starts here.
            </h2>

            <p>
              Discover opportunities, connect with organizations,
              work with your guides and complete your internship
              journey through one platform.
            </p>

            <div className="cta-buttons">

              <button
                className="cta-primary"
                onClick={onSignup}
              >
                Get Started
                <span>→</span>
              </button>

              <button
                className="cta-secondary"
                onClick={onLogin}
              >
                Already registered? Login
              </button>

            </div>

          </div>

          <div className="cta-illustration">

            <div className="cta-card cta-card-one">
              <span>✓</span>
              Internship
              <strong>Approved</strong>
            </div>

            <div className="cta-card cta-card-two">
              <span>♧</span>
              Guide
              <strong>Assigned</strong>
            </div>

            <div className="cta-card cta-card-three">
              <span>★</span>
              Certificate
              <strong>Completed</strong>
            </div>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="home-footer">

        <div className="footer-container">

          <div className="footer-main">

            <div className="footer-brand">

              <div className="brand">

                <div className="brand-logo footer-logo">
                  <span className="logo-i">I</span>
                  <span className="logo-link">↗</span>
                </div>

                <div className="brand-text">
                  <span className="brand-name">InterLink</span>
                  <span className="brand-tagline">
                    FYUGP Internship Platform
                  </span>
                </div>

              </div>

              <p>
                Connecting students, companies, colleges and
                internship guides through one organized platform.
              </p>

            </div>


            <div className="footer-links">

              <div className="footer-column">

                <h4>Platform</h4>

                <button onClick={() => scrollToSection("home")}>
                  Home
                </button>

                <button onClick={() => scrollToSection("about")}>
                  About
                </button>

                <button onClick={() => scrollToSection("features")}>
                  Features
                </button>

              </div>


              <div className="footer-column">

                <h4>Workflow</h4>

                <button onClick={() => scrollToSection("how-it-works")}>
                  How It Works
                </button>

                <button onClick={() => scrollToSection("features")}>
                  Opportunities
                </button>

                <button onClick={() => scrollToSection("features")}>
                  Certification
                </button>

              </div>


              <div className="footer-column">

                <h4>Account</h4>

                <button onClick={onLogin}>
                  Login
                </button>

                <button onClick={onSignup}>
                  Register
                </button>

                <button onClick={onSignup}>
                  Get Started
                </button>

              </div>

            </div>

          </div>


          <div className="footer-bottom">

            <span>
              © 2026 InterLink. FYUGP Internship Management Platform.
            </span>

            <span>
              Built for a connected internship experience.
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default Home;