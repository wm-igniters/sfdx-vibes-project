// Display formatting for the Business manager table.

const FREQUENCY_SUFFIX = { MONTHLY: 'pm', ANNUALLY: 'pa', ANNUAL: 'pa', YEARLY: 'pa', QUARTERLY: 'pq', HALF_YEARLY: 'phy', WEEKLY: 'pw' };

const money = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** ISO timestamp → "14/10/2026" in the user's time zone. */
export function formatDate(iso, timeZone) {
    if (!iso) return '';
    const date = new Date(String(iso).replace(/(\.\d{3})\d+/, '$1'));
    if (Number.isNaN(date.getTime())) return '';
    try {
        return new Intl.DateTimeFormat('en-GB', { timeZone, day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    } catch {
        return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    }
}

export function formatAmount(value) {
    return value === null || value === undefined || value === '' ? '' : money.format(Number(value));
}

/** 6.83 + MONTHLY → "6.83pm" */
export function formatRegular(value, frequency) {
    const amount = formatAmount(value);
    if (!amount) return '';
    return amount + (FREQUENCY_SUFFIX[String(frequency || '').toUpperCase()] ?? '');
}
