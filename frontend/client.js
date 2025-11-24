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
import { initFilterHandler, setCurrencyToFilter, filterOperations } from "./Services/operationFilter.js";
import { initTransferHandlers } from "./Services/dataTransfer.js";
import { sortBy } from "./Services/sortHandler.js";

const user = getCookie('user');

setCategories(JSON.parse(loadCategories()));

setCurrencies(JSON.parse(loadCurrencies()));

setOperations(JSON.parse(loadOperations(user.name)));

setCurrenciesDropdown(
  currencies.map((c) => c.code),
  onCurrencySelected
);

let filteredOperations = operations;

function onFiltering(filtered) {
  filteredOperations = filtered;
  
  render(filtered);
}

function render(operations){
    setTotals(
    ...calculateTotals(operations, selectedCurrency),
    selectedCurrency.symbol
  );

  refreshTable(operations);
}

let selectedCurrency;
let searchResults;

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
    filteredOperations.find((op) => op.id == id)
  );
}

function deleteOperation(id) {
  const operation = removeOperationBd(id, user.name);
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
  const index = updateOperationBd(JSON.stringify(formData), user.name);

  operations[index] = formData;

  onFiltering(filterOperations());

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

  const operation = JSON.parse(saveOperation(JSON.stringify(formData), user.name));
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
  if (!name) {
    searchResults = filteredOperations;
  } else {
    const normalized = name.toLowerCase().trim();
    searchResults = filteredOperations.filter((op) =>
      op.name.toLowerCase().trim().includes(normalized)
    );
  }

  render(searchResults);
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

onFiltering(initFilterHandler(currencies, onFiltering));

initTransferHandlers(onImport);

function onImport(ops){
  onFiltering(filterOperations(ops));
}

