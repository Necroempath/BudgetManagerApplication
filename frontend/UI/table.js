const rowStyles = [
  {
    path: "0",
    tagName: "span",
    classNames: ["badge", "text-bg-secondary"],
    text: "Income",
  },
  {
    path: "0",
    tagName: "span",
    classNames: ["badge", "text-bg-dark"],
    text: "Expense",
  },
  { path: "5", tagName: "div", classNames: ["d-flex", "gap-2"] },
  {
    id: "edit",
    path: "50",
    tagName: "i",
    classNames: [
      "fa-solid",
      "fa-pen-to-square",
      "fs-5",
      "text-dark",
      "opacity-0",
      "clickable",
    ],
  },
  {
    id: "delete",
    path: "50",
    tagName: "i",
    classNames: [
      "fa-solid",
      "fa-delete-left",
      "fs-5",
      "text-dark",
      "opacity-0",
      "clickable",
    ],
    action: () => {},
  },
];

const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");

function initEvents([onEdit, onDelete], tr) {
  tr.querySelector("#edit").addEventListener("click", () => {
    onEdit(tr.id);
  });
  tr.querySelector("#delete").addEventListener("click", () => {
    onDelete(tr.id);
    tbody.removeChild(tr);
  });
}

function toRowObject(operation) {
  return {
    type: "",
    category: operation.category,
    name: operation.name,
    amount: operation.currency.symbol + operation.amount,
    date: operation.date,
    actions: "",
  };
}

function parse(operation, id) {
  const tr = document.createElement("tr");
  tr.id = id;
  Object.entries(operation).forEach(([key, value], i) => {
    const cell = document.createElement("td");
    cell.textContent = value;

    tr.append(cell);
  });

  return tr;
}

function stylize(tr, indexes) {
  indexes.forEach((index) => {
    const elInfo = rowStyles[index];
    const tag = document.createElement(elInfo.tagName);
    tag.textContent = elInfo.text;
    tag.classList.add(...elInfo.classNames);
    tag.id = elInfo.id;
    let destination = tr;

    elInfo.path.split("").forEach((unit) => {
      destination = destination.children[+unit];
    });

    destination.append(tag);
  });

  return tr;
}

export function writeToTable(operation, events, stylesIndexes) {
  const rowObject = toRowObject(operation);
  const parsedRowObject = parse(rowObject, operation.id);
  const stylized = stylize(parsedRowObject, stylesIndexes);

  initEvents(events, parsedRowObject);

  tbody.append(stylized);
}

export function clearTable() {
  tbody.innerHTML = "";
}

export function initSortHandler(onSort) {
  thead.querySelectorAll(".sorter").forEach(tag =>
    tag.addEventListener("click", (e) => {
      onSort(e.target.dataset.param, e.target.dataset.type);
    })
  );
}
