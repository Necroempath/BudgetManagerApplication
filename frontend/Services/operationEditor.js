import { OperationForm } from "../UI/form.js";
import { defineDateRange } from "../utils.js";
import { categories } from "../Repositories/categories.js";

export function CreateEditForm(onSubmit) {
  const form = document.querySelector("#addForm").cloneNode(true);
  const editBtn = document.querySelector("#editBtn");

  const editForm = new OperationForm(form);

  editForm.enableCategoryOptions();
  editForm.limitDateInput(...defineDateRange(3, 0));
  editForm.onTypeChanged(categories);

  editBtn.addEventListener("click", () => {
    console.log(editForm.readForm())
    onSubmit(form, editForm.readForm());
  });

  return editForm;
}
