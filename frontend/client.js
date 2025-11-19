import { writeToTable, clearTable, initSortHandler } from "./UI/table.js";
import {
  saveOperation,
  loadOperations,
  loadCategories,
  removeOperationBd,
  updateOperationBd,
  loadCurrencies,
} from "../backend/backend.js";
import { showModal, hideModal } from "./UI/modal.js";
import { createAddForm, resetAddForm } from "./Services/operationAdder.js";
import { createEditForm } from "./Services/operationEditor.js";
import {
  operations,
  setOperations,
  removeOperation,
  updateOperation,
} from "./Repositories/operations.js";
import { setCategories } from "./Repositories/categories.js";
import { initSearchHandler } from "./UI/search.js";
import { setTotals } from "./UI/infoPanel.js";
import { currencies, setCurrencies } from "./Repositories/currencies.js";
import { setCurrenciesDropdown, setCurrency } from "./UI/currency.js";
import { setCookie, getCookie, calculateTotals } from "./utils.js";
import { initFilterHandler } from "./Services/operationFilter.js";
import { initTransferHandlers } from "./Services/dataTransfer.js";
setCategories(JSON.parse(loadCategories()));

setCurrencies(JSON.parse(loadCurrencies()));

setOperations(JSON.parse(loadOperations()));

setCurrenciesDropdown(
  currencies.map((c) => c.code),
  onCurrencySelected
);

let filteredOperations = operations;

function filterOperations(filtered) {
  filteredOperations = filtered;
  setTotals(
    ...calculateTotals(filteredOperations, selectedCurrency),
    selectedCurrency.symbol
  );
  refreshTable();
}

let selectedCurrency;

const addForm = createAddForm((form, formData) => onAdding(form, formData));

const editForm = createEditForm((form, formData) => onEdit(form, formData));

function setCurrencyFromCookie() {
  selectedCurrency = getCookie("currency");

  if (!selectedCurrency) {
    setCookie("currency", JSON.stringify(currencies[0]), 7);
    selectedCurrency = currencies[0];
  }
  addForm.setCurrency(selectedCurrency);

  setCurrency(selectedCurrency.code);

  setTotals(
    ...calculateTotals(filteredOperations, selectedCurrency),
    selectedCurrency.symbol
  );
}

function editOperation(id) {
  showModal(
    editForm,
    operations.find((op) => op.id == id)
  );
}

function deleteOperation(id) {
  const operation = removeOperationBd(id);
  removeOperation(operation.id);
}

function refreshTable() {
  clearTable();
  filteredOperations.forEach((op) => {
    writeToTable(op, [editOperation, deleteOperation], [`${op.type}`, 2, 3, 4]);
  });
}

setCurrencyFromCookie();

refreshTable();

function validate(form) {
  const data = new FormData(form);
  const cat = data.get("category");

  const valid = form.checkValidity();

  if (!valid) {
    form.classList.add("was-validated");
  } else {
    form.classList.remove("was-validated");
  }

  return valid;
}

function onEdit(form, formData) {
  if (!validate(form)) {
    return;
  }

  hideModal();
  const index = updateOperationBd(JSON.stringify(formData));

  operations[index] = formData;

  refreshTable();

  setTotals(
    ...calculateTotals(filteredOperations, selectedCurrency),
    selectedCurrency.symbol
  );
}

function onAdding(form, formData) {
  if (!validate(form)) {
    return;
  }

  resetAddForm();

  const operation = JSON.parse(saveOperation(JSON.stringify(formData)));
  operations.push(operation);

  writeToTable(
    operation,
    [editOperation, deleteOperation],
    [`${operation.type}`, 2, 3, 4]
  );
}

let lastSortParam = null;

function sortBy(param, type) {
  if (lastSortParam === param) {
    operations.reverse();
  } else if (param === "amount") {
    operations.sort(
      (a, b) =>
        a[`${param}`] * a["currency"].rate - b[`${param}`] * b["currency"].rate
    );
  } else {
    if (type === "string") {
      operations.sort((a, b) => a[`${param}`].localeCompare(b[`${param}`]));
    } else if (type === "number") {
      operations.sort((a, b) => a[`${param}`] - b[`${param}`]);
    }
  }

  lastSortParam = param;

  refreshTable();
}

initSortHandler(sortBy);

function searchByName(name) {
  let filtered;

  if (!name) {
    filtered = operations;
  } else {
    const normalized = name.toLowerCase().trim();
    filtered = operations.filter((op) =>
      op.name.toLowerCase().trim().includes(normalized)
    );
  }

  filterOperations(filtered);
}

initSearchHandler(searchByName);

function onCurrencySelected(index) {
  selectedCurrency = currencies[index];

  setCookie("currency", JSON.stringify(selectedCurrency), 7);

  addForm.setCurrency(selectedCurrency);
  setTotals(
    ...calculateTotals(filteredOperations, selectedCurrency),
    selectedCurrency.symbol
  );
}

initFilterHandler(currencies, onFilterApplied);

function onFilterApplied(filterParams) {
  if (!filterParams) {
    filterOperations(operations);
  }

  let filtered = [...operations];

  if (filterParams.type >= 0) {
    filtered = operations.filter((op) => op.type === filterParams.type);
  }

  filtered = filtered.filter((op) =>
    filterParams.currencies.includes(op.currency.code)
  );
  console.log(filtered);
  // filtered = filtered.filter(op => op.amount >= filterParams.minAmount && op.amount <= filterParams.maxAmount);

  // filtered = filtered.filter(op => op.amount >= filterParams.minAmount && op.amount <= filterParams.maxAmount);

  filterOperations(filtered);
}

initTransferHandlers(refreshTable);
