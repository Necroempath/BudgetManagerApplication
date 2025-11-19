import { defineDateRange, getCookie, setCookie } from "../utils.js";
import { operations } from "../Repositories/operations.js";

const form = document.querySelector("#filterForm");

const canvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasExample'));

const clearFormBtn = document.querySelector("#clearForm");
const resetFiltersBtn = document.querySelector("#resetFilters");
const applyFiltersBtn = document.querySelector("#applyFilters");
const currencyInput = document.querySelector("#currencyInput");
const dateFrom = document.querySelector("#dateFrom");
const crncSymbol = document.querySelectorAll('.crnc');

let filterParams;
let selectedCurrency = getCookie('currency');

export function initFilterHandler(currencies, onFiltersApplied) {
  const [min, max] = defineDateRange(3, 0);
  dateFrom.min = min;
  dateFrom.max = max;

  createCurrencyInputs(currencies);

  clearFormBtn.addEventListener("click", () => {
    form.reset();
  });

  applyFiltersBtn.addEventListener("click", () => {
    const data = new FormData(form);

    filterParams = validate(data);

    if (!filterParams) {
      return;
    }

    canvas.hide();

    setCookie('Filtering parameters', filterParams, 7);

    onFiltersApplied(filterOperations());
  });

  resetFiltersBtn.addEventListener("click", () => {
    canvas.hide();

    setCookie('Filtering parameters', null, 7);
    filterParams = null;
    onFiltersApplied(operations);
  });
}

export function filterOperations(data = operations) {
  filterParams = filterParams || getCookie('Filtering parameters');
  if (!filterParams) return data;

  let copy = [...data];

  if (filterParams.type >= 0) {
    copy = copy.filter((op) => op.type === filterParams.type);

  }

  copy = copy.filter((op) =>
    filterParams.currencies.includes(op.currency.code)
  );
  copy = copy.filter(op => op.amount * op.currency.rate >= filterParams.minAmount * selectedCurrency.rate && op.amount * op.currency.rate <= filterParams.maxAmount * selectedCurrency.rate);

  copy = copy.filter(op => op.date >= filterParams.dateFrom && op.date <= filterParams.dateTo);

  return copy;
}

export function setCurrencyToFilter(currency) {
  selectedCurrency = currency;
  crncSymbol.forEach(item => item.textContent = currency.symbol);
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

function validate(data) {
  let valid = true;

  const minAmountInput = document.querySelector("#minAmount");
  const maxAmountInput = document.querySelector("#maxAmount");

  const minAmount = document.querySelector("#minAmount").value || 0;
  const maxAmount = document.querySelector("#maxAmount").value || +Infinity;

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

  if (valid) {
    return {
      type: data.get("btnradio"),
      currencies: data.getAll("currency"),
      minAmount: minAmount,
      maxAmount: maxAmount,
      dateFrom: dateFrom,
      dateTo: dateTo,
    };
  }
  else return null;

}
