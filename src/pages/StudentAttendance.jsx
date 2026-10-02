import React, { useEffect, useState } from "react";

function StudentAttendance({ student, onBack }) {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);

  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH STUDENT INTERNSHIP ASSIGNMENTS
  // =====================================================

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoadingAssignments(true);
        setError("");

        const studentId = student?.id || student?._id;

        if (!studentId) {
          setError("Student information not available.");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/internship-assignments/student/${studentId}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load internship.");
          return;
        }

        if (data.status === "success") {
          const assignmentList =
            data.assignments || data.assignment || [];

          const list = Array.isArray(assignmentList)
            ? assignmentList
            : [assignmentList];

          setAssignments(list);

          // Automatically select the first assignment
          if (list.length > 0) {
            setSelectedAssignment(list[0]);
          }
        } else {
          setError(data.message || "Failed to load internship.");
        }
      } catch (error) {
        console.error("Student assignments error:", error);
        setError("Unable to load internship information.");
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, [student]);

  // =====================================================
  // FETCH ATTENDANCE
  // =====================================================

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedAssignment) {
        setAttendance([]);
        setSummary(null);
        return;
      }

      try {
        setLoadingAttendance(true);
        setError("");

        const assignmentId =
          selectedAssignment._id ||
          selectedAssignment.id ||
          selectedAssignment.assignment?._id;

        if (!assignmentId) {
          setError("Internship assignment ID not found.");
          return;
        }

        // Attendance
        const attendanceResponse = await fetch(
          `http://localhost:5000/api/attendance/student/${assignmentId}`,
          {
            credentials: "include",
          }
        );

        const attendanceData =
          await attendanceResponse.json();

        if (!attendanceResponse.ok) {
          setError(
            attendanceData.message ||
              "Failed to load attendance."
          );
          return;
        }

        if (attendanceData.status === "success") {
          setAttendance(
            attendanceData.attendance || []
          );
        }

        // Attendance summary
        const summaryResponse = await fetch(
          `http://localhost:5000/api/attendance/summary/${assignmentId}`,
          {
            credentials: "include",
          }
        );

        const summaryData =
          await summaryResponse.json();

        if (
          summaryResponse.ok &&
          summaryData.status === "success"
        ) {
          setSummary(summaryData.summary || null);
        }
      } catch (error) {
        console.error("Attendance fetch error:", error);
        setError("Unable to load attendance.");
      } finally {
        setLoadingAttendance(false);
      }
    };

    fetchAttendance();
  }, [selectedAssignment]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >

        <div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "1px",
              color: "#287653",
            }}
          >
            INTERNSHIP TRACKING
          </span>

          <h2
            style={{
              margin: "6px 0 0",
              color: "#294139",
              fontSize: "28px",
            }}
          >
            Attendance
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              color: "#71847c",
              fontSize: "14px",
            }}
          >
            View your verified internship attendance.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          style={{
            border: "1px solid #d8f3e5",
            background: "#ffffff",
            color: "#287653",
            padding: "10px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ← Back
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            background: "#fff2f0",
            border: "1px solid #efc4bd",
            color: "#b84f40",
            padding: "13px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}


      {/* =================================================
          LOADING ASSIGNMENT
      ================================================= */}

      {loadingAssignments ? (
        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "14px",
            textAlign: "center",
            color: "#71847c",
          }}
        >
          Loading internship...
        </div>
      ) : assignments.length === 0 ? (

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2eee8",
            borderRadius: "14px",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "38px",
              marginBottom: "12px",
            }}
          >
            📋
          </div>

          <h3
            style={{
              margin: "0 0 8px",
              color: "#294139",
            }}
          >
            No Internship Assigned
          </h3>

          <p
            style={{
              margin: 0,
              color: "#71847c",
            }}
          >
            Attendance will appear here after your
            internship is assigned.
          </p>
        </div>

      ) : (

        <>

          {/* =================================================
              INTERNSHIP SELECTOR
          ================================================= */}

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2eee8",
              borderRadius: "14px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >

            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "700",
                color: "#536961",
                marginBottom: "8px",
              }}
            >
              INTERNSHIP
            </label>

            <select
              value={
                selectedAssignment?._id ||
                selectedAssignment?.id ||
                ""
              }
              onChange={(e) => {
                const selected = assignments.find(
                  (assignment) =>
                    (assignment._id ||
                      assignment.id) ===
                    e.target.value
                );

                setSelectedAssignment(
                  selected || null
                );
              }}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #dce9e3",
                borderRadius: "9px",
                outline: "none",
                background: "#fbfdfc",
                color: "#294139",
                fontSize: "14px",
              }}
            >

              {assignments.map((assignment) => (
                <option
                  key={
                    assignment._id ||
                    assignment.id
                  }
                  value={
                    assignment._id ||
                    assignment.id
                  }
                >
                  {assignment.internship?.title ||
                    assignment.internship?.name ||
                    "Internship"}{" "}
                  -{" "}
                  {assignment.company?.companyName ||
                    "Company"}
                </option>
              ))}

            </select>

          </div>


          {/* =================================================
              SUMMARY
          ================================================= */}

          {summary && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(170px, 1fr))",
                gap: "14px",
                marginBottom: "22px",
              }}
            >

              <div
                style={{
                  background: "#eaf8f0",
                  borderRadius: "12px",
                  padding: "18px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#5c766b",
                    fontWeight: "700",
                  }}
                >
                  PRESENT DAYS
                </span>

                <strong
                  style={{
                    display: "block",
                    fontSize: "25px",
                    color: "#287653",
                    marginTop: "6px",
                  }}
                >
                  {summary.presentDays ?? 0}
                </strong>
              </div>


              <div
                style={{
                  background: "#fff4f1",
                  borderRadius: "12px",
                  padding: "18px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#806b66",
                    fontWeight: "700",
                  }}
                >
                  ABSENT DAYS
                </span>

                <strong
                  style={{
                    display: "block",
                    fontSize: "25px",
                    color: "#c96858",
                    marginTop: "6px",
                  }}
                >
                  {summary.absentDays ?? 0}
                </strong>
              </div>


              <div
                style={{
                  background: "#f3f0ff",
                  borderRadius: "12px",
                  padding: "18px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#6e6880",
                    fontWeight: "700",
                  }}
                >
                  HALF DAYS
                </span>

                <strong
                  style={{
                    display: "block",
                    fontSize: "25px",
                    color: "#6c5b9b",
                    marginTop: "6px",
                  }}
                >
                  {summary.halfDays ?? 0}
                </strong>
              </div>


              <div
                style={{
                  background: "#f0f8f4",
                  borderRadius: "12px",
                  padding: "18px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#5c766b",
                    fontWeight: "700",
                  }}
                >
                  APPROVED HOURS
                </span>

                <strong
                  style={{
                    display: "block",
                    fontSize: "25px",
                    color: "#287653",
                    marginTop: "6px",
                  }}
                >
                  {Number(
                    summary.approvedHours || 0
                  ).toFixed(2)}
                </strong>
              </div>

            </div>
          )}


          {/* =================================================
              ATTENDANCE TABLE
          ================================================= */}

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2eee8",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >

            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid #edf3f0",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#294139",
                  fontSize: "18px",
                }}
              >
                Attendance Records
              </h3>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#71847c",
                  fontSize: "13px",
                }}
              >
                Only attendance verified by your faculty
                guide is displayed.
              </p>
            </div>


            {loadingAttendance ? (

              <div
                style={{
                  padding: "35px",
                  textAlign: "center",
                  color: "#71847c",
                }}
              >
                Loading attendance...
              </div>

            ) : attendance.length === 0 ? (

              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#71847c",
                }}
              >
                No verified attendance records yet.
              </div>

            ) : (

              <div
                style={{
                  overflowX: "auto",
                }}
              >

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "720px",
                  }}
                >

                  <thead>
                    <tr
                      style={{
                        background: "#f6faf8",
                      }}
                    >

                      <th style={thStyle}>
                        Date
                      </th>

                      <th style={thStyle}>
                        Status
                      </th>

                      <th style={thStyle}>
                        Check In
                      </th>

                      <th style={thStyle}>
                        Check Out
                      </th>

                      <th style={thStyle}>
                        Hours
                      </th>

                      <th style={thStyle}>
                        Verification
                      </th>

                    </tr>
                  </thead>


                  <tbody>

                    {attendance.map((record) => (

                      <tr
                        key={
                          record._id ||
                          record.id
                        }
                      >

                        <td style={tdStyle}>
                          {formatDate(record.date)}
                        </td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 10px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "700",
                              background:
                                record.status ===
                                "Present"
                                  ? "#e3f6eb"
                                  : record.status ===
                                    "Absent"
                                  ? "#fff0ed"
                                  : "#f4f0ff",
                              color:
                                record.status ===
                                "Present"
                                  ? "#287653"
                                  : record.status ===
                                    "Absent"
                                  ? "#c45f4f"
                                  : "#6d5b9c",
                            }}
                          >
                            {record.status}
                          </span>
                        </td>

                        <td style={tdStyle}>
                          {record.checkIn || "-"}
                        </td>

                        <td style={tdStyle}>
                          {record.checkOut || "-"}
                        </td>

                        <td style={tdStyle}>
                          {Number(
                            record.totalHours || 0
                          ).toFixed(2)}{" "}
                          hrs
                        </td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              color: "#287653",
                              fontWeight: "700",
                              fontSize: "13px",
                            }}
                          >
                            ✓ Approved
                          </span>
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </>
      )}

    </div>
  );
}


// =====================================================
// TABLE STYLES
// =====================================================

const thStyle = {
  padding: "13px 15px",
  textAlign: "left",
  fontSize: "12px",
  color: "#62766d",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "14px 15px",
  borderTop: "1px solid #edf3f0",
  color: "#42574f",
  fontSize: "13px",
  whiteSpace: "nowrap",
};

export default StudentAttendance;