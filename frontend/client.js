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
} from "./Repositories/operations.js";
import { setCategories } from "./Repositories/categories.js";
import { initSearchHandler } from "./UI/search.js";
import { setTotals } from "./UI/infoPanel.js";
import { currencies, setCurrencies } from "./Repositories/currencies.js";
import { setCurrenciesDropdown, setCurrency } from "./UI/currency.js";
import { setCookie, getCookie, calculateTotals } from "./utils.js";
import { initFilterHandler, setCurrencyToFilter } from "./Services/operationFilter.js";
import { initTransferHandlers } from "./Services/dataTransfer.js";
import { sortBy } from "./Services/sortHandler.js";

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
  refreshTable(filteredOperations);
}

let selectedCurrency;

const addForm = createAddForm((form, formData) => onAdding(form, formData));

const editForm = createEditForm((form, formData) => onEdit(form, formData));

function setCurrencyFromCookie() {
  selectedCurrency = getCookie("currency");

  if (!selectedCurrency) {
    setCookie("currency", currencies[0], 7);
    selectedCurrency = currencies[0];
  }
  addForm.setCurrency(selectedCurrency);

  setCurrency(selectedCurrency.code);
  setCurrencyToFilter(selectedCurrency);
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

function refreshTable(data) {
  clearTable();
  data.forEach((item) => {
    writeToTable(item, [editOperation, deleteOperation], [`${item.type}`, 2, 3, 4]);
  });
}

setCurrencyFromCookie();

refreshTable(filteredOperations);

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

  refreshTable(filteredOperations);

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

function onSorted(param, type) {
  const sorted = sortBy(filteredOperations, param, type);
  refreshTable(sorted);
}

initSortHandler(onSorted);

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

  setCookie("currency", selectedCurrency, 7);

  addForm.setCurrency(selectedCurrency);
  setTotals(
    ...calculateTotals(filteredOperations, selectedCurrency),
    selectedCurrency.symbol
  );

  setCurrencyToFilter(selectedCurrency);
}

initFilterHandler(currencies, filterOperations);

initTransferHandlers(refreshTable);

