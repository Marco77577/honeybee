/**
 * Get the start of the given year.
 * @param year The year whose start is to be determined.
 * @returns The start of the given year.
 */
function getStartOfYear(year: number) {
    return new Date(year, 0, 1);
}

/**
 * Format the fiscal year as a string.
 * @param year The year to format.
 * @returns The formatted fiscal year.
 */
export function formatFiscalYear(year: number) {
    return getStartOfYear(year)
        .toLocaleDateString(
            undefined, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
}