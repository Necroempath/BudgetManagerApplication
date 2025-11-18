export class OperationForm {
  constructor(form) {
    this.form = form;
  
    this.type = form.querySelector("#type");
    this.category = form.querySelector("#category");
    this.name = form.querySelector("#name");
    this.amount = form.querySelector("#amount");
    this.date = form.querySelector("#date");
    this.currency = form.querySelector('#currency')
  }
  getForm() {
    return this.form;
  }

  fillForm(data) {
    this.type.value = data.type;
    this.category.value = data.category;
    this.name.value = data.name;
    this.amount.value = data.amount;
    this.date.value = data.date;
    this.currency.textContent = data.currency.symbol;
  }

  setOperationId(id) {
    this.id = id;
  }
  getOperationId() {
    return this.id;
  }

  setCurrency(obj){
    this.currencyObj = obj;
    this.currency.textContent = obj.symbol;
  }

  readForm() {
    return {
      type: this.type.value,
      category: this.category.value,
      name: this.name.value.trim(),
      amount: this.amount.value,
      date: this.date.value,
      currency: this.currencyObj,
      id: this.id
    };
  }

  setCategory(category) {
    this.category.value = category;
  }

  #setOption(option) {
    const category = document.createElement("option");
    category.textContent = option;
    this.category.append(category);
    return category;
  }

  #setOptions(options) {
    this.category.textContent = "";
    options.map((option) => {
      this.#setOption(option);
    });
  }

  onTypeChanged(categories) {
    this.categoriesCash = categories;
    this.type.addEventListener("change", () => {
      this.category.disabled = false;
      this.#setOptions(categories[this.type.value]);
      this.setDefaultOption("Choose category...");
    });
  }

  updateCategoryOptions() {
    this.#setOptions(this.categoriesCash[this.type.value]);
  }

  disableCategoryOptions() {
    this.category.disabled = true;
  }
  
  resetCategoryOptions(){
    this.category.textContent = '';
    const opt = document.createElement('option');

    opt.value = '';
    opt.textContent = 'Choose type first...';
    this.category.append(opt);
  }

  enableCategoryOptions() {
    this.category.disabled = false;
  }

  setDefaultOption(option) {
    const category = this.#setOption(option);
    
    category.selected = true;
    category.hidden = true;
    category.value = "";
  }

  limitDateInput(minDate, maxDate) {
    this.date.min = minDate;
    this.date.max = maxDate;
  }
}
