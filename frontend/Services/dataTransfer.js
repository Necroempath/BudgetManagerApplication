import { operations, setOperations } from "../Repositories/operations.js";

export function exportToJson(fileName) {
  const jsonData = JSON.stringify(operations);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
}

export function initTransferHandlers(onImport) {
  const importInput = document.querySelector("#importInput");

  document.querySelector("#exportBtn").addEventListener("click", () => {
    exportToJson("operationsJSON.json");
  });

  document.querySelector("#importBtn").addEventListener("click", () => {
    importInput.click();
  });

  importInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const text = await file.text();

    try {
      const newOpers = JSON.parse(text);
     
      localStorage.setItem("operations", JSON.stringify(newOpers));
      setOperations(newOpers);
      onImport(newOpers);

    } catch {
      alert("Invalid json");
    }

    e.target.value = "";
  });
}
