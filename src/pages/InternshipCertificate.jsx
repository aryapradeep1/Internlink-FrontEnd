import React from "react";
import "../css/InternshipCertificate.css";

function InternshipCertificate({ assignment, totalHours, onBack }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="il-certificate-page">

      {/* ACTION BUTTONS */}
      <div className="no-print il-certificate-actions">

        <button
          type="button"
          onClick={handlePrint}
          className="il-cert-print-btn"
        >
          🖨️ Print / Save as PDF
        </button>

        <button
          type="button"
          onClick={onBack}
          className="il-cert-back-btn"
        >
          ← Back to My Internship
        </button>

      </div>


      {/* CERTIFICATE */}
      <div className="il-certificate-wrapper">

        <div className="il-certificate-paper">

          {/* DECORATIVE BORDER */}
          <div className="il-cert-outer-border"></div>
          <div className="il-cert-inner-border"></div>


          {/* CORNER DECORATIONS */}
          <div className="il-cert-corner il-cert-corner-tl"></div>
          <div className="il-cert-corner il-cert-corner-tr"></div>
          <div className="il-cert-corner il-cert-corner-bl"></div>
          <div className="il-cert-corner il-cert-corner-br"></div>


          {/* TOP BRAND */}
          <div className="il-cert-brand">

            <div className="il-cert-logo">
              <span>I</span>
              <b>↗</b>
            </div>

            <div className="il-cert-brand-text">
              <h1>InternLink</h1>

              <p>
                FYUGP INTERNSHIP MANAGEMENT PLATFORM
              </p>
            </div>

          </div>


          {/* TITLE */}
          <div className="il-cert-title">

            <div className="il-cert-title-line"></div>

            <span className="il-cert-title-small">
              CERTIFICATE OF
            </span>

            <div className="il-cert-title-line"></div>

            <h2>
              INTERNSHIP COMPLETION
            </h2>

            <p>
              Certificate of Successful Completion
            </p>

          </div>


          {/* MAIN CONTENT */}
          <div className="il-cert-main">

            <p className="il-cert-intro">
              This is to proudly certify that
            </p>


            <h3 className="il-cert-student-name">
              {assignment.student?.name || "Student"}
            </h3>


            <div className="il-cert-name-line"></div>


            <p className="il-cert-register">
              Register Number:
              <strong>
                {" "}
                {assignment.student?.registerNumber || "N/A"}
              </strong>
            </p>


            <p className="il-cert-completion-text">
              has successfully completed the internship programme
              <br />
              at
            </p>


            <h3 className="il-cert-company">
              {assignment.company?.companyName || "Company"}
            </h3>


            {/* POSITION */}
            <div className="il-cert-position">

              <span>
                INTERNSHIP / POSITION
              </span>

              <strong>
                {assignment.internship?.title || "N/A"}
              </strong>

            </div>


            {/* DURATION */}
            <div className="il-cert-duration">

              <div className="il-cert-duration-item">

                <span>
                  REQUIRED DURATION
                </span>

                <strong>
                  {assignment.internship?.duration || "N/A"}
                </strong>

              </div>


              <div className="il-cert-duration-divider"></div>


              <div className="il-cert-duration-item">

                <span>
                  HOURS COMPLETED
                </span>

                <strong>
                  {totalHours} hours
                </strong>

              </div>

            </div>

          </div>


          {/* INFORMATION */}
          <div className="il-cert-info">

            <div className="il-cert-info-item">

              <span>
                FACULTY GUIDE
              </span>

              <strong>
                {assignment.facultyGuide?.name || "N/A"}
              </strong>

            </div>


            <div className="il-cert-info-item">

              <span>
                COMPANY GUIDE
              </span>

              <strong>
                {assignment.companyGuide?.name || "N/A"}
              </strong>

            </div>


            <div className="il-cert-info-item">

              <span>
                MARK
              </span>

              <strong>
                {assignment.mark !== null &&
                assignment.mark !== undefined
                  ? assignment.mark
                  : "N/A"}
              </strong>

            </div>


            <div className="il-cert-info-item">

              <span>
                CREDITS
              </span>

              <strong>
                {assignment.credits || 0}
              </strong>

            </div>

          </div>


          {/* SIGNATURE AREA */}
          <div className="il-cert-bottom">

            {/* LEFT */}
            <div className="il-cert-signature">

              <div className="il-cert-sign-line"></div>

              <strong>
                InterLink System
              </strong>

              <span>
                Authorized System
              </span>

            </div>


            {/* SEAL */}
            <div className="il-cert-seal">

              <div className="il-cert-seal-ring">

                <div className="il-cert-seal-inner">

                  <strong>
                    IL
                  </strong>

                  <span>
                    INTERNLINK
                  </span>

                  <small>
                    VERIFIED
                  </small>

                </div>

              </div>

            </div>


            {/* RIGHT */}
            <div className="il-cert-signature">

              <div className="il-cert-sign-line"></div>

              <strong>
                Faculty Guide
              </strong>

              <span>
                Authorized Signature
              </span>

            </div>

          </div>


          {/* FOOTER */}
          <div className="il-cert-footer">

            <span>
              INTERNLINK
            </span>

            <b>•</b>

            <span>
              FYUGP INTERNSHIP MANAGEMENT PLATFORM
            </span>

            <b>•</b>

            <span>
              VERIFIED COMPLETION
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default InternshipCertificate;