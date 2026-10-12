export function isInternshipDeadlineExpired(deadline, now = new Date()) {
  if (!deadline) return false;

  // The existing posting form stores a calendar date. Keep that date open
  // through its local end of day; timestamps retain their exact time.
  const dateOnly = typeof deadline === "string" && /^\d{4}-\d{2}-\d{2}(?:T00:00:00(?:\.000)?Z)?$/.test(deadline);
  const deadlineDate = dateOnly
    ? (() => {
        const [year, month, day] = deadline.slice(0, 10).split("-").map(Number);
        return new Date(year, month - 1, day, 23, 59, 59, 999);
      })()
    : new Date(deadline);

  return !Number.isNaN(deadlineDate.getTime()) && deadlineDate.getTime() < now.getTime();
}

export function getInternshipDisplayStatus(internship, now = new Date()) {
  const status = internship?.status;
  const normalizedStatus = typeof status === "string" ? status.toLowerCase() : "";

  if (normalizedStatus === "closed") {
    return "Closed";
  }

  if (status && normalizedStatus !== "open") return status;
  if (isInternshipDeadlineExpired(internship?.deadline, now)) return "Closed";

  return status || "Open";
}

export function isInternshipAvailableForApplications(internship, now = new Date()) {
  const status = internship?.status;
  const markedOpen = !status || (typeof status === "string" && status.toLowerCase() === "open");
  return markedOpen && !isInternshipDeadlineExpired(internship?.deadline, now);
}
