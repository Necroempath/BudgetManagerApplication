import { hashPassword } from "../hashing/hashing.js";
import { saveUser } from "../backend/usersServer.js";

const regForm = document.querySelector("#regForm");
const loginForm = document.querySelector("#loginForm");
const cpass = regForm.querySelector("#cpassword");

document.querySelector("#regBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  const data = new FormData(regForm);

  const defValidate = validateDefault();
  const passValidate = validatePassword(data);

  if (!defValidate || !passValidate) {
    return;
  }

  const { salt, hash } = await hashPassword(cpass.value);

  const user = {
    email: data.get("email"),
    name: data.get("name"),
    salt: salt,
    hash: hash,
    remember: data.get("remember"),
    date: new Date(),
  };

  const report = saveUser(JSON.stringify(user));
  validateBusy(report);
});

function validatePassword(data) {
  const passValue = data.get("password");
  const cpassValue = data.get("cpassword");

  if (passValue != cpassValue) {
    cpass.classList.add("is-invalid");
    return false;
  } else if (cpassValue) {
    cpass.classList.add("is-valid");
  }

  return true;
}

function validateBusy(report) {
  regForm
    .querySelectorAll(".busy")
    .forEach((el) => el.classList.remove("d-none"));

  regForm
    .querySelectorAll(".non-busy")
    .forEach((el) => el.classList.add("d-none"));

  report.forEach((token) =>
    regForm.querySelector(`[name="${token}"]`).classList.add("is-invalid")
  );
}

function validateDefault() {
  const inputs = regForm.querySelectorAll("input");
  let valid = true;

  document
    .querySelectorAll(".busy")
    .forEach((el) => el.classList.add("d-none"));

  document
    .querySelectorAll(".non-busy")
    .forEach((el) => el.classList.remove("d-none"));

  inputs.forEach((input) => {
    input.classList.remove("is-invalid", "is-valid");

    const pattern = input.getAttribute("pattern");
    if (pattern && !new RegExp(`^${pattern}$`).test(input.value)) {
      input.classList.add("is-invalid");
      valid = false;
    } else if (pattern) {
      input.classList.add("is-valid");
    }
  });

  return valid;
}

document.querySelectorAll(".switchTabs").forEach((a) =>
  a.addEventListener("click", () => {
    document.querySelector('#regCard').classList.toggle("d-none");
    document.querySelector('#loginCard').classList.toggle("d-none");
  })
);
