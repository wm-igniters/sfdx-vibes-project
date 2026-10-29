// ─── employeeapp (UI Bundle) hand-off contract ────────────────────────────────
// Must match src/features/employee/employeeChannel.ts in the employeeapp bundle.
export const EMPLOYEE_APP_NAME = 'employeeapp';
export const EMPLOYEE_QUERY_PARAM = 'employee';

/**
 * UTF-8 safe base64url encoding of the payload so it survives as a single
 * query-string value.
 */
export function encodeEmployeePayload(payload) {
    // UTF-8 bytes as a binary string (no TextEncoder dependency)
    const binary = encodeURIComponent(JSON.stringify(payload)).replace(/%([0-9A-F]{2})/g, (m, hex) =>
        String.fromCharCode(parseInt(hex, 16))
    );
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Derive the employeeapp URL from the current Lightning host.
 * UI Bundles are served from <mydomain>--c.<instance>.my.salesforce.app/app/c__<bundle>:
 *   acme.lightning.force.com                → https://acme--c.my.salesforce.app/app/c__employeeapp
 *   acme-dev-ed.develop.lightning.force.com → https://acme-dev-ed--c.develop.my.salesforce.app/app/c__employeeapp
 *   acme--uat.sandbox.lightning.force.com   → https://acme--uat--c.sandbox.my.salesforce.app/app/c__employeeapp
 * Returns null when the host isn't a Lightning Experience host.
 */
export function deriveEmployeeAppUrl(hostname, appName = EMPLOYEE_APP_NAME) {
    const match = /^([a-z0-9-]+)((?:\.[a-z0-9-]+)*)\.lightning\.force\.com$/i.exec(hostname || '');
    if (!match) return null;
    const [, myDomain, instance] = match;
    return `https://${myDomain}--c${instance}.my.salesforce.app/app/c__${appName}`;
}

export function buildEmployeeAppUrl(baseUrl, payload) {
    const url = new URL(baseUrl);
    url.searchParams.set(EMPLOYEE_QUERY_PARAM, encodeEmployeePayload(payload));
    return url.toString();
}

/** Same-tab redirect (wrapped so it can be mocked in Jest). */
export function redirectTo(url) {
    window.location.assign(url);
}
