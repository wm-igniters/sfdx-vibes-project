/**
 * Employee channel — the contract between the LWC "Employee Directory"
 * (employeeDatatable) and this UI bundle.
 *
 * The UI bundle is served from its own origin (*.my.salesforce.app), so
 * Lightning Message Service / BroadcastChannel / shared storage are not
 * available across the boundary. The datatable therefore hands the selected
 * row over in two ways, and this module subscribes to both:
 *
 *   1. URL hand-off  — `?employee=<base64url(JSON)>` on the app URL
 *                      (used when the Employee Name is clicked and the user is
 *                      redirected to the app).
 *   2. postMessage    — `{ type: 'EMPLOYEE_SELECTED', payload }` from a
 *                      Salesforce origin (used when the app is iframed, e.g.
 *                      by employeeReactBridge).
 *
 * Everything coming in is treated as untrusted and validated before it is
 * published to the store.
 */

export const EMPLOYEE_QUERY_PARAM = 'employee';
export const EMPLOYEE_MESSAGE_TYPE = 'EMPLOYEE_SELECTED';

/** Max encoded payload length we are willing to decode (defensive). */
const MAX_ENCODED_LENGTH = 8192;
const MAX_STRING_LENGTH = 255;

export interface EmployeePayload {
  employeeId: string;
  employeeName: string;
  department?: string;
  title?: string;
  email?: string;
  phone?: string;
  salary?: number;
  location?: string;
  hireDate?: string;
  status?: string;
  avatarInitials?: string;
  source?: string;
  timestamp?: number;
}

const OPTIONAL_STRING_FIELDS = [
  'department',
  'title',
  'email',
  'phone',
  'location',
  'hireDate',
  'status',
  'avatarInitials',
  'source',
] as const;

function cleanString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, MAX_STRING_LENGTH);
}

function cleanNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

/**
 * Validate an unknown value and return a clean EmployeePayload (unknown keys
 * dropped, strings trimmed/limited) or null when required fields are missing.
 */
export function parseEmployeePayload(input: unknown): EmployeePayload | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const raw = input as Record<string, unknown>;

  const employeeId = cleanString(raw.employeeId ?? raw.id);
  const employeeName = cleanString(raw.employeeName ?? raw.name);
  if (!employeeId || !employeeName) return null;

  const result: EmployeePayload = { employeeId, employeeName };
  for (const key of OPTIONAL_STRING_FIELDS) {
    const v = cleanString(raw[key]);
    if (v !== undefined) result[key] = v;
  }
  const salary = cleanNumber(raw.salary);
  if (salary !== undefined) result.salary = salary;
  const timestamp = cleanNumber(raw.timestamp);
  if (timestamp !== undefined) result.timestamp = timestamp;

  return result;
}

// ─── base64url (UTF-8 safe) ─────────────────────────────────────────────────

export function encodeEmployeePayload(payload: EmployeePayload): string {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = '';
  bytes.forEach(b => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeEmployeePayload(encoded: string): EmployeePayload | null {
  if (!encoded || encoded.length > MAX_ENCODED_LENGTH) return null;
  try {
    let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4 !== 0) b64 += '=';
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return parseEmployeePayload(JSON.parse(json));
  } catch {
    return null;
  }
}

/** Read an employee hand-off from a URL search string (e.g. location.search). */
export function readEmployeeFromSearch(search: string): EmployeePayload | null {
  const params = new URLSearchParams(search);
  const encoded = params.get(EMPLOYEE_QUERY_PARAM);
  return encoded ? decodeEmployeePayload(encoded) : null;
}

// ─── postMessage subscription ───────────────────────────────────────────────

const TRUSTED_ORIGIN =
  /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.(force\.com|salesforce\.com|salesforce\.app|salesforce-setup\.com|site\.com)$/i;

export function isTrustedOrigin(origin: string): boolean {
  if (typeof window !== 'undefined' && origin === window.location.origin) return true;
  return TRUSTED_ORIGIN.test(origin);
}

/**
 * Subscribe to employee selections posted by a Salesforce host page.
 * Returns an unsubscribe function.
 */
export function subscribeToEmployeeMessages(
  callback: (employee: EmployeePayload) => void
): () => void {
  const handler = (event: MessageEvent) => {
    if (!isTrustedOrigin(event.origin)) return;
    const data = event.data as { type?: unknown; payload?: unknown } | null;
    if (!data || data.type !== EMPLOYEE_MESSAGE_TYPE) return;
    const employee = parseEmployeePayload(data.payload);
    if (employee) callback(employee);
  };
  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}
