/**
 * "HH:MM, DD-MM-YYYY" (24-hour) for an ISO-8601 timestamp, in the given IANA time zone.
 * Returns "" for blank or invalid input.
 */
export function formatDateTime(iso, timeZone) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  let parts;
  try {
    parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date);
  } catch {
    // Unknown time zone → fall back to the browser's.
    return formatDateTime(iso, undefined);
  }
  const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("hour")}:${get("minute")}, ${get("day")}-${get("month")}-${get("year")}`;
}

/** "ILLUSTRATED" / "IN_PROGRESS" → "Illustrated" / "In progress". */
export function formatStatus(status) {
  if (!status) return "";
  const text = String(status).replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}
