const currencyBtn = document.querySelector("#currencyDropdownBtn");
const currencyDwn = document.querySelector("#currencyDropdown");
const selectedCurrency = document.querySelector("#selected-currency");

currencyDwn.style.width = getComputedStyle(currencyBtn).width;

export function setCurrenciesDropdown(options, onCurrencySelected) {
  currencyDwn.innerHTML = "";

  options.forEach((opt, index) => {
    const li = document.createElement("li");
    li.className = "text-light fs-6 fw-semibold selectable";
    li.innerHTML = `<span class="mx-3">—</span><span>${opt}</span>`;

    li.addEventListener("click", () => {
      onCurrencySelected(index);
      selectedCurrency.textContent = opt;
    });

    currencyDwn.append(li);
  });
}

export function setCurrency(opt){
    selectedCurrency.innerHTML = opt;
}

