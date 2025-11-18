export let operations;

export const setOperations = value => operations = value;

export function removeOperation(index) {
  operations.splice(index, 1);
}

export function updateOperation(operation, index) {
  operations[index] = operation;
}
