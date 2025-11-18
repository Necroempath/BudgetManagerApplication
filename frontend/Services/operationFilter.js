import { defineDateRange } from "../utils.js";

const form = document.querySelector("#filterForm");

const canvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasExample'));

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

    canvas.hide();

    onFilterApplied(filterParams);
  });

  resetFiltersBtn.addEventListener("click", () => {
    canvas.hide();
    
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

  const minAmountInput = document.querySelector("#minAmount");
  const maxAmountInput = document.querySelector("#maxAmount");

  const minAmount = document.querySelector("#minAmount").value || 0;
  const maxAmount = document.querySelector("#maxAmount").value || Infinity;

  minAmountInput.classList.remove("is-invalid");
  maxAmountInput.classList.remove("is-invalid");
  if (minAmount < 0) {
    minAmountInput.classList.add("is-invalid");
    valid = false;
  } else if (maxAmount < minAmount) {
    maxAmountInput.classList.add("is-invalid");
    valid = false;
  }

  const dateFrom = document.querySelector("#dateFrom").value || new Date();
  const dateTo =
    document.querySelector("#dateTo").value || new Date(8640000000000000);
  const dateToInput = document.querySelector("#dateTo");
  dateToInput.classList.remove("is-invalid");

  if (dateTo < dateFrom) {
    dateToInput.classList.add("is-invalid");
    valid = false;
  }

  return valid;
}
