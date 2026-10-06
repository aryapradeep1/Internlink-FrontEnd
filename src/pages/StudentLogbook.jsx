import React, { useEffect, useState } from "react";
import "../css/StudentLogbook.css";

function StudentLogbook({ student, onBack }) {
  const [assignment, setAssignment] = useState(null);
  const [logbooks, setLogbooks] = useState([]);

  const [date, setDate] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [workDone, setWorkDone] = useState("");
  const [learnings, setLearnings] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const REQUIRED_HOURS = 60;

  /* ======================================================
     FETCH ASSIGNMENT
  ====================================================== */

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/internship-assignments/student/${student.id}`
        );

        const data = await response.json();

        if (data.status === "success") {
          setAssignment(data.assignment);
        } else {
          setError("No internship assigned yet.");
        }
      } catch (error) {
        console.error("Error fetching internship:", error);
        setError("Failed to load internship details.");
      } finally {
        setLoading(false);
      }
    };

    if (student?.id) {
      fetchAssignment();
    }
  }, [student?.id]);

  /* ======================================================
     FETCH LOGBOOK ENTRIES
  ====================================================== */

  useEffect(() => {
    const fetchLogbooks = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/logbook/student/${student.id}`
        );

        const data = await response.json();

        if (data.status === "success") {
          setLogbooks(data.logbooks);
        }
      } catch (error) {
        console.error(
          "Error fetching logbook entries:",
          error
        );
      }
    };

    if (student?.id) {
      fetchLogbooks();
    }
  }, [student?.id]);

  /* ======================================================
     HOURS CALCULATION
  ====================================================== */

  const totalHours = logbooks.reduce(
    (total, entry) =>
      total + Number(entry.hoursWorked || 0),
    0
  );

  const remainingHours = Math.max(
    REQUIRED_HOURS - totalHours,
    0
  );

  const progressPercentage =
    (totalHours / REQUIRED_HOURS) * 100;

  /* ======================================================
     ADD LOGBOOK ENTRY
  ====================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!assignment) {
      setError(
        "You do not have an internship assigned yet."
      );
      return;
    }

    const internshipId =
      assignment.internship?._id ||
      assignment.internship?.id;

    if (!internshipId) {
      setError("Internship information is missing.");
      return;
    }

    if (!hoursWorked || Number(hoursWorked) <= 0) {
      setError(
        "Please enter the number of hours worked."
      );
      return;
    }

    if (Number(hoursWorked) > 24) {
      setError(
        "Hours worked cannot be more than 24 hours."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "http://localhost:5000/api/logbook/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student: student.id,
            internship: internshipId,
            date,
            hoursWorked: Number(hoursWorked),
            workDone,
            learnings,
          }),
        }
      );

      const data = await response.json();

      if (data.status !== "success") {
        setError(
          data.message ||
            "Failed to add logbook entry."
        );
        return;
      }

      setMessage(
        "Logbook entry added successfully!"
      );

      setDate("");
      setHoursWorked("");
      setWorkDone("");
      setLearnings("");

      setLogbooks((previousEntries) => [
        data.logbook,
        ...previousEntries,
      ]);
    } catch (error) {
      console.error(
        "Add Logbook Error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ======================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <div className="logbook-page">
        <div className="logbook-scroll">
          <div className="logbook-loading">
            <div className="loading-book-icon">
              📖
            </div>

            <h2>Opening Logbook</h2>

            <p>
              Please wait while your logbook is loaded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================
     NO ASSIGNMENT
  ====================================================== */

  if (!assignment) {
    return (
      <div className="logbook-page">
        <div className="logbook-scroll">
          <div className="logbook-empty-state">
            <div className="empty-book-icon">
              📖
            </div>

            <h2>Logbook Not Available</h2>

            <p>
              {error ||
                "No internship assigned yet."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================
     MAIN LOGBOOK
  ====================================================== */

  return (
    <div className="logbook-page">

      {/* ==================================================
          ONLY LOGBOOK CONTENT
          NO EXTRA TOP WHITE HEADER
      ================================================== */}

      <div className="logbook-scroll">

        <main className="logbook-container">

          {/* ==================================================
              LOGBOOK TITLE
          ================================================== */}

          <section className="logbook-title">

            <div className="title-line"></div>

            <p className="logbook-label">
              INTERNSHIP DAILY RECORD
            </p>

            <h1>
              My Logbook
            </h1>

            <p className="logbook-description">
              Record your daily work, experience
              and learning throughout your internship.
            </p>

            <div className="title-line"></div>

          </section>

          {/* ==================================================
              HOURS SUMMARY
          ================================================== */}

          <section className="hours-summary">

            <div className="hours-summary-main">

              <span className="hours-label">
                TOTAL HOURS
              </span>

              <strong>
                {totalHours}

                <small>
                  / {REQUIRED_HOURS}
                </small>
              </strong>

            </div>

            <div className="hours-progress">

              <div className="hours-progress-track">

                <div
                  className="hours-progress-fill"
                  style={{
                    width: `${Math.min(
                      progressPercentage,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

              <span>
                {progressPercentage.toFixed(1)}%
              </span>

            </div>

            <div className="hours-status">

              {totalHours >= REQUIRED_HOURS ? (
                <>
                  <strong>
                    ✓ Requirement completed
                  </strong>

                  <span>
                    {totalHours -
                      REQUIRED_HOURS}{" "}
                    extra hours
                  </span>
                </>
              ) : (
                <>
                  <strong>
                    {remainingHours} hours remaining
                  </strong>

                  <span>
                    Minimum required:{" "}
                    {REQUIRED_HOURS} hours
                  </span>
                </>
              )}

            </div>

          </section>

          {/* ==================================================
              ADD NEW ENTRY
          ================================================== */}

          <section className="new-entry">

            <div className="new-entry-heading">

              <div className="new-entry-icon">
                +
              </div>

              <div>

                <span>
                  DAILY ENTRY
                </span>

                <h2>
                  Add Today's Record
                </h2>

              </div>

            </div>

            {message && (
              <div className="logbook-message success">
                ✓ {message}
              </div>
            )}

            {error && (
              <div className="logbook-message error">
                {error}
              </div>
            )}

            <form
              className="logbook-form"
              onSubmit={handleSubmit}
            >

              <div className="form-row">

                <div className="form-field">

                  <label>
                    DATE
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                      setDate(e.target.value)
                    }
                    required
                  />

                </div>

                <div className="form-field">

                  <label>
                    HOURS WORKED
                  </label>

                  <div className="hours-input">

                    <input
                      type="number"
                      min="0.5"
                      max="24"
                      step="0.5"
                      placeholder="6"
                      value={hoursWorked}
                      onChange={(e) =>
                        setHoursWorked(
                          e.target.value
                        )
                      }
                      required
                    />

                    <span>
                      hours
                    </span>

                  </div>

                </div>

              </div>

              <div className="form-field">

                <label>
                  WORK DONE
                </label>

                <textarea
                  placeholder="Write about the work you completed today..."
                  value={workDone}
                  onChange={(e) =>
                    setWorkDone(e.target.value)
                  }
                  rows="4"
                  required
                />

              </div>

              <div className="form-field">

                <label>
                  WHAT I LEARNED
                </label>

                <textarea
                  placeholder="Write about what you learned today..."
                  value={learnings}
                  onChange={(e) =>
                    setLearnings(e.target.value)
                  }
                  rows="4"
                  required
                />

              </div>

              <div className="form-submit">

                <span>
                  Your entry will be added to
                  the beginning of your logbook.
                </span>

                <button
                  type="submit"
                  disabled={submitting}
                >
                  {submitting
                    ? "Adding..."
                    : "Add Entry"}
                </button>

              </div>

            </form>

          </section>

          {/* ==================================================
              PREVIOUS ENTRIES
          ================================================== */}

          <section className="previous-logbook">

            <div className="entries-heading">

              <div>

                <span>
                  YOUR RECORDS
                </span>

                <h2>
                  Previous Entries
                </h2>

              </div>

              <div className="entry-total">

                {logbooks.length}

                <small>
                  {logbooks.length === 1
                    ? " ENTRY"
                    : " ENTRIES"}
                </small>

              </div>

            </div>

            {logbooks.length === 0 ? (

              <div className="no-entries">

                <div>
                  📖
                </div>

                <h3>
                  No entries yet
                </h3>

                <p>
                  Add your first daily record above.
                </p>

              </div>

            ) : (

              <div className="book-pages">

                {logbooks.map(
                  (entry, index) => {

                    const entryDate =
                      new Date(entry.date);

                    return (

                      <article
                        key={entry._id}
                        className="diary-page"
                      >

                        {/* LEFT BOOK EDGE */}

                        <div className="diary-edge"></div>

                        {/* PAGE HEADER */}

                        <div className="diary-header">

                          <div className="diary-date">

                            <span>
                              {entryDate
                                .toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                  }
                                )
                                .toUpperCase()}
                            </span>

                            <strong>
                              {String(
                                entryDate.getDate()
                              ).padStart(2, "0")}
                            </strong>

                            <small>
                              {entryDate.getFullYear()}
                            </small>

                          </div>

                          <div className="diary-title">

                            <span>
                              DAILY LOG
                            </span>

                            <h3>
                              Internship Entry
                            </h3>

                          </div>

                          <div className="diary-hours">

                            <strong>
                              {entry.hoursWorked}
                            </strong>

                            <span>
                              HOURS
                            </span>

                          </div>

                        </div>

                        <div className="diary-divider"></div>

                        {/* WORK DONE */}

                        <section className="diary-section">

                          <div className="diary-section-heading">

                            <span className="diary-marker work">
                              01
                            </span>

                            <h4>
                              Work Done
                            </h4>

                          </div>

                          <p>
                            {entry.workDone}
                          </p>

                        </section>

                        {/* LEARNING */}

                        <section className="diary-section">

                          <div className="diary-section-heading">

                            <span className="diary-marker learning">
                              02
                            </span>

                            <h4>
                              What I Learned
                            </h4>

                          </div>

                          <p>
                            {entry.learnings}
                          </p>

                        </section>

                        {/* PAGE FOOTER */}

                        <div className="diary-footer">

                          <div className="diary-review">

                            <div>

                              <span>
                                FACULTY
                              </span>

                              <strong>
                                {entry.facultyStatus}
                              </strong>

                            </div>

                            <div>

                              <span>
                                COMPANY GUIDE
                              </span>

                              <strong>
                                {
                                  entry.companyGuideStatus
                                }
                              </strong>

                            </div>

                          </div>

                          <div className="diary-page-number">

                            {String(
                              logbooks.length -
                                index
                            ).padStart(2, "0")}

                          </div>

                        </div>

                      </article>

                    );
                  }
                )}

              </div>

            )}

          </section>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <footer className="logbook-footer">
            InterLink · Internship Daily Logbook
          </footer>

        </main>

      </div>

    </div>
  );
}

export default StudentLogbook;