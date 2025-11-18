import { categories } from './Repositories/categories.js';
import { currencies } from './Repositories/currencies.js';
import { getCookie } from './utils.js';

const load = () => JSON.parse(localStorage.getItem("operations")) || [];
const save = (operations) =>
  localStorage.setItem("operations", JSON.stringify(operations));

const length = () => load().length;

const add = (operation) => {
  const operations = load();
  operations.push(operation);
  save(operations);
};

export const removeOperationBd = (id) => {
  const operations = load();
  const index = operations.find((op) => op.id === id);
  const removed = operations.splice(index, 1)[0];

  save(operations);

  return removed;
};

export function saveOperation(operationJSON) {
  const operation = JSON.parse(operationJSON);
  operation.currency = getCookie('currency');
  operation.id = length();

  add(operation);

  return JSON.stringify(operation);
}

export function loadOperations() {
  return localStorage.getItem("operations") || "[]";
}

export function updateOperationBd(operationJSON){
    const operation = JSON.parse(operationJSON);
    const operations = load();
    const index = operations.findIndex(op => op.id === operation.id);
    operations[index] = operation;

    save(operations);

    return index;
}

export function loadCategories(){
    return JSON.stringify(categories);
}

export function loadCurrencies(){
    return JSON.stringify(currencies);
}