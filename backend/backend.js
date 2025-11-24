import { categories } from './Repositories/categories.js';
import { currencies } from './Repositories/currencies.js';
import { getCookie } from './utils.js';

const load = (name) => JSON.parse(localStorage.getItem(name)) || [];
const save = (operations, name) =>
  localStorage.setItem(name, JSON.stringify(operations));

const length = () => load().length;

const add = (operation, name) => {
  const operations = load(name);
  operations.push(operation);
  save(operations, name);
};

export function removeOperationBd(id, name){
  const operations = load(name);
  const index = operations.findIndex((op) => op.id == id);
  const removed = operations.splice(index, 1)[0];

  save(operations, name);

  return removed;
};

export function saveOperation(operationJSON, name) {
  const operation = JSON.parse(operationJSON);
  operation.currency = getCookie('currency');
  operation.id = length();

  add(operation, name);

  return JSON.stringify(operation);
}

export function loadOperations(name) {
  return localStorage.getItem(name) || "[]";
}

export function updateOperationBd(operationJSON, name){
    const operation = JSON.parse(operationJSON);
    const operations = load(name);
    const index = operations.findIndex(op => op.id === operation.id);
    operations[index] = operation;

    save(operations, name);

    return index;
}

export function loadCategories(){
    return JSON.stringify(categories);
}

export function loadCurrencies(){
    return JSON.stringify(currencies);
}