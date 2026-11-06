// ─── Embedded app URL ─────────────────────────────────────────────────────────
// The embedded app (WaveMaker app using the package-free sf-embedding bridge)
// is deployed to this org as a UI Bundle and served from
// <mydomain>--c.<instance>.my.salesforce.app/app/c__<bundle>.
export const DEFAULT_APP_NAME = 'employeeapp';

/**
 * Derive the UI Bundle URL from the current Lightning host
 * (same rule as c-employee-datatable). Returns null outside Lightning Experience.
 *   acme.lightning.force.com                → https://acme--c.my.salesforce.app/app/c__employeeapp
 *   acme-dev-ed.develop.lightning.force.com → https://acme-dev-ed--c.develop.my.salesforce.app/app/c__employeeapp
 */
export function deriveEmployeeAppUrl(hostname, appName = DEFAULT_APP_NAME) {
    const match = /^([a-z0-9-]+)((?:\.[a-z0-9-]+)*)\.lightning\.force\.com$/i.exec(hostname || '');
    if (!match) return null;
    const [, myDomain, instance] = match;
    return `https://${myDomain}--c${instance}.my.salesforce.app/app/c__${appName || DEFAULT_APP_NAME}`;
}

/**
 * Build the `src` for <lightning-ui-embedding>: the explicit App Builder URL if
 * set, otherwise the derived UI Bundle URL. Must be https and on a different
 * origin than Lightning (SAME_ORIGIN_SRC otherwise). Returns null when invalid.
 */
export function buildEmbeddingSrc(appUrl, hostname, appName = DEFAULT_APP_NAME) {
    const base = (appUrl && appUrl.trim()) || deriveEmployeeAppUrl(hostname, appName);
    if (!base) return null;
    try {
        const url = new URL(base);
        if (url.protocol !== 'https:') return null;
        // lightning-ui-embedding rejects a src on the page's own origin (SAME_ORIGIN_SRC).
        if (hostname && url.hostname.toLowerCase() === String(hostname).toLowerCase()) return null;
        return url.toString();
    } catch {
        return null;
    }
}
