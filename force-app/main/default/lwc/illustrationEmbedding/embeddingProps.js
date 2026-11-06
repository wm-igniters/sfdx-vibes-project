import LOCALE from '@salesforce/i18n/locale';

/**
 * <lightning-ui-embedding> posts `props` over a MessagePort (structured clone), but
 * only the top level is copied: any nested object or array reaches postMessage as a
 * read-only proxy and fails with DataCloneError, so the app never receives the
 * ui-state (its ui/subscribe/ui-state request times out). Keep every prop a
 * primitive: objects and arrays travel as JSON strings under `<name>Json`
 * (employeesJson, selectedEmployeeJson, selectionPartiesJson); the app's bridge
 * parses them back to `<name>`.
 */
export function toEmbeddingProps({
    employees = [],
    selectedEmployeeId = null,
    selectedEmployee = null,
    selectionParties = null,
    selectionRequestId = null
}) {
    return {
        employeesJson: JSON.stringify(employees ?? []),
        selectedEmployeeId: selectedEmployeeId ?? null,
        selectedEmployeeJson: JSON.stringify(selectedEmployee ?? null),
        selectionPartiesJson: JSON.stringify(selectionParties ?? null),
        selectionRequestId: selectionRequestId ?? null,
        locale: LOCALE,
        source: 'illustrationEmbedding'
    };
}
