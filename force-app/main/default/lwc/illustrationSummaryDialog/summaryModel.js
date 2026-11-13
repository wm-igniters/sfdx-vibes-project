// Turns the IllustrationController.getIllustrationSummary result into the
// "Investment details" and "Fund selection" tables of the summary dialog.

const TYPES = [
    { key: 'SINGLE', label: 'Single' },
    { key: 'REGULAR', label: 'Regular' },
    { key: 'TRANSFER', label: 'Transfer' }
];
const FREQUENCY = { MONTHLY: 'monthly', ANNUALLY: 'annually', ANNUAL: 'annually', YEARLY: 'annually', QUARTERLY: 'quarterly', HALF_YEARLY: 'half-yearly', WEEKLY: 'weekly' };

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 });

/** "INITIAL_ADVICE_CHARGE" / "Initial Advice Charge" → "Initial advice charge" */
export function sentenceCase(text) {
    const t = String(text ?? '').replace(/_/g, ' ').trim().toLowerCase();
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : '';
}

export function formatPct(value, digits) {
    if (value === null || value === undefined || value === '') return '';
    return `${Number(value).toFixed(digits)}%`;
}

export function formatDate(iso, timeZone) {
    if (!iso) return '';
    const date = new Date(String(iso).replace(/(\.\d{3})\d+/, '$1'));
    if (Number.isNaN(date.getTime())) return '';
    const opts = { day: '2-digit', month: '2-digit', year: 'numeric' };
    try {
        return new Intl.DateTimeFormat('en-GB', { ...opts, timeZone }).format(date);
    } catch {
        return new Intl.DateTimeFormat('en-GB', opts).format(date);
    }
}

const typeOf = (c) => {
    const t = String(c?.contributionType ?? '').toUpperCase();
    if (t.includes('TRANSFER')) return 'TRANSFER';
    if (t.includes('REGULAR')) return 'REGULAR';
    return 'SINGLE';
};

/** "Single: £10,000.00", "Regular: £250.00 monthly", "Transfer: £40,000.00" */
export function contributionLabel(c) {
    const type = typeOf(c);
    const label = TYPES.find((t) => t.key === type).label;
    const value = type === 'TRANSFER' && c.transferValue != null ? c.transferValue : c.grossAmount;
    const amount = value === null || value === undefined ? '' : ` ${gbp.format(Number(value))}`;
    const freq = type === 'REGULAR' && c.frequency ? ` ${FREQUENCY[String(c.frequency).toUpperCase()] ?? sentenceCase(c.frequency)}` : '';
    return `${label}:${amount}${freq}`;
}

/**
 * Investment details: one column per charge/fee (in the order the API lists them),
 * one row per contribution with its contributors and applied rates.
 */
export function investmentTable(summary) {
    const contributions = summary?.contributions ?? [];
    const columns = [];
    contributions.forEach((c) =>
        (c.charges ?? []).forEach((ch) => {
            const key = ch.chargeTypeCode || ch.displayName;
            if (key && !columns.some((col) => col.key === key)) {
                columns.push({ key, label: sentenceCase(ch.displayName || ch.chargeTypeCode) });
            }
        })
    );
    const rows = contributions.map((c, i) => ({
        key: String(c.contributionId ?? i),
        label: contributionLabel(c),
        contributors: (c.contributors ?? []).map((p, j) => ({ key: `${i}-${j}`, label: sentenceCase(p.contributorType) || p.contributorName })),
        cells: columns.map((col) => {
            const ch = (c.charges ?? []).find((x) => (x.chargeTypeCode || x.displayName) === col.key);
            return { key: col.key, value: formatPct(ch?.appliedRatePct, 2) };
        })
    }));
    return { columns, rows, colspan: Math.max(columns.length, 1) };
}

/**
 * Fund selection: one row per fund; Single / Regular / Transfer × Income / Accumulation
 * percentages; a Total row with each contribution type's total allocation.
 */
export function fundTable(summary) {
    const contributions = summary?.contributions ?? [];
    const funds = new Map();
    const totals = {};
    contributions.forEach((c) => {
        const type = typeOf(c);
        let total = 0;
        (c.allocations ?? []).forEach((a) => {
            const key = a.fundCode || a.fundName;
            if (!funds.has(key)) funds.set(key, { key, name: a.fundName || a.fundCode, values: {} });
            const share = String(a.shareClass ?? '').toUpperCase().startsWith('INC') ? 'INCOME' : 'ACCUMULATION';
            const slot = `${type}_${share}`;
            const pct = Number(a.allocationPct ?? 0);
            funds.get(key).values[slot] = (funds.get(key).values[slot] ?? 0) + pct;
            total += pct;
        });
        if ((c.allocations ?? []).length) {
            totals[type] = (totals[type] ?? 0) + Number(c.allocationTotalPct ?? total);
        }
    });
    const slots = TYPES.flatMap((t) => ['INCOME', 'ACCUMULATION'].map((s) => `${t.key}_${s}`));
    const rows = [...funds.values()].map((f) => ({
        key: f.key,
        name: f.name,
        cells: slots.map((slot) => ({ key: slot, value: f.values[slot] != null ? formatPct(f.values[slot], 1) : '' }))
    }));
    const totalCells = TYPES.map((t) => ({ key: t.key, value: totals[t.key] != null ? formatPct(totals[t.key], 1) : '' }));
    return { types: TYPES, rows, totalCells, hasFunds: rows.length > 0 };
}
