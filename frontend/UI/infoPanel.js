const incSum = document.querySelector("#inc-sum");
const expSum = document.querySelector("#exp-sum");
const totalSum = document.querySelector("#total");

export function setTotals(inc, exp, profit, currency) {
  incSum.textContent = `${inc} ${currency}`;
  expSum.textContent = `${exp} ${currency}`;
  totalSum.textContent = `${profit} ${currency}`;
}
