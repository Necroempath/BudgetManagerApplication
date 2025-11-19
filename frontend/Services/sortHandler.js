let lastSortParam = null;

export function sortBy(filtered, param, type) {
    if (lastSortParam === param) {
        filtered.reverse();
    } else if (param === "amount") {
        filtered.sort(
            (a, b) =>
                a[`${param}`] * a["currency"].rate - b[`${param}`] * b["currency"].rate
        );
    } else {
        filtered.sort((a, b) => a[`${param}`].localeCompare(b[`${param}`]));
    }

    lastSortParam = param;

    return filtered;
}