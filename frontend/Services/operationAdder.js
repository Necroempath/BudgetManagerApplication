import { OperationForm } from "../UI/form.js";
import { defineDateRange } from "../utils.js";
import { categories } from "../Repositories/categories.js";

const form = document.querySelector("#addForm");
const addBtn = document.querySelector("#addBtn");
const addForm = new OperationForm(form);

export function createAddForm(onSubmit) {

  addForm.disableCategoryOptions();
  addForm.limitDateInput(...defineDateRange(3, 0));
  addForm.onTypeChanged(categories);

  addBtn.addEventListener("click", () => {
    console.log(addForm.readForm())
    onSubmit(form, addForm.readForm());
  });

  return addForm;
}

export function resetAddForm(){
  form.reset();

  addForm.disableCategoryOptions();
  addForm.resetCategoryOptions();
}
