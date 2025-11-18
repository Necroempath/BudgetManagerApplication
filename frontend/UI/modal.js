const editModal = new bootstrap.Modal(document.querySelector("#editModal"));
const modalBody = document.querySelector(".modal-body");

export const showModal = (form, operation) => {
  form.fillForm(operation);
  modalBody.append(form.getForm());
  form.updateCategoryOptions();
  form.setOperationId(operation.id);
  form.setCategory(operation.category);
  form.setCurrency(operation.currency);
  editModal.show();
};

export const hideModal = () => {
  editModal.hide();
}
