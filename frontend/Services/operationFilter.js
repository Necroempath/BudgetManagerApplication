import { defineDateRange } from "../utils.js";

const form = document.querySelector("#filterForm");

const clearFormBtn = document.querySelector("#clearForm");
const resetFiltersBtn = document.querySelector("#resetFilters");
const applyFiltersBtn = document.querySelector("#applyFilters");
const currencyInput = document.querySelector("#currencyInput");
const dateFrom = document.querySelector("#dateFrom");

export function initFilterHandler(currencies, onFilterApplied) {
  const [min, max] = defineDateRange(3, 0);
  dateFrom.min = min;
  dateFrom.max = max;

  createCurrencyInputs(currencies);

  clearFormBtn.addEventListener("click", () => {
    form.reset();
  });

  applyFiltersBtn.addEventListener("click", () => {
    if (!validate()) {
      return;
    }

    const data = new FormData(form);

    const filterParams = {
      type: data.get("btnradio"),
      currencies: data.getAll("currency"),
      minAmount: data.get("minAmount"),
      maxAmount: data.get("maxAmount"),
      dateFrom: data.get("dateFrom"),
      dateTo: data.get("dateTo"),
    };

    onFilterApplied(filterParams);
  });

  resetFiltersBtn.addEventListener("click", () => {
    onFilterApplied(null);
  });
}

function createCurrencyInputs(currencies) {
  currencies.forEach((currency) => {
    const col = document.createElement("div");
    col.className = "col-4";

    const formCheck = document.createElement("div");
    formCheck.className = "form-check";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "form-check-input";
    input.id = `curr-${currency.code}`;
    input.value = currency.code;
    input.name = "currency";
    input.checked = true;
    input.defaultChecked = true;

    const label = document.createElement("label");
    label.className = "form-check-label";
    label.htmlFor = input.id;
    label.textContent = currency.code;

    formCheck.append(input, label);
    col.append(formCheck);
    currencyInput.append(col);
  });
}

function validate() {
  let valid = true;

  const minAmountInput = document.getElementById("minAmount");
  const maxAmountInput = document.getElementById("maxAmount");

  const minAmount = document.getElementById("minAmount").value || 0;
  const maxAmount = document.getElementById("maxAmount").value || Infinity;

  minAmountInput.classList.remove("is-invalid");
  maxAmountInput.classList.remove("is-invalid");
  if (minAmount < 0) {
    minAmountInput.classList.add("is-invalid");
    valid = false;
  } else if (maxAmount < minAmount) {
    maxAmountInput.classList.add("is-invalid");
    valid = false;
  }

  const dateFrom = document.getElementById("dateFrom").value || new Date();
  const dateTo =
    document.getElementById("dateTo").value || new Date(8640000000000000);
  const dateToInput = document.getElementById("dateTo");
  dateToInput.classList.remove("is-invalid");

  if (dateTo < dateFrom) {
    dateToInput.classList.add("is-invalid");
    valid = false;
  }

  return valid;
}
