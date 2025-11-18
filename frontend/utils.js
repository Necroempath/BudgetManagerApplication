const format = (date) => date.toISOString().split("T")[0];

export function defineDateRange(min, max) {
  const today = new Date();

  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - min);

  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() + max);

  return [format(minDate), format(maxDate)];
}
export function calculateTotals(operations, targetCurrency) {
  let totals = [0, 0];

  for (let op of operations) {
    totals[op.type] += op.amount * op.currency.rate;
  }

  totals = totals.map((t) => t / targetCurrency.rate);

  const profit = totals[0] - totals[1];

  return [...totals.map((t) => t.toFixed(2)), profit.toFixed(2)];
}

export function setCookie(name, value, days) {
  document.cookie = `${name} =${value}; max-age = ${
    days * 24 * 3600
  }; path =\\`;
}

export function getCookie(name) {
  const cookies = document.cookie.split("; ");

  const cookie = cookies.find((c) => c.startsWith(name + "="));

  if (!cookie) return null;
  return JSON.parse(cookie.split("=")[1]);
}
