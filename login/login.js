import { hashPassword } from "../hashing/hashing.js";
import { saveUser, authorize } from "../backend/usersServer.js";
import { setCookie } from "../frontend/utils.js";

const regForm = document.querySelector("#regForm");
const loginForm = document.querySelector("#loginForm");
const cpass = regForm.querySelector("#cpassword");

document.querySelector("#regBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  const data = new FormData(regForm);

  const defValidate = validateDefault(regForm);
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

  if (validateBusy(report, regForm)) {
    setCookie("user", user, 7);
    resetForms();
    window.location.href = "index.htm";
  }
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

function validateBusy(report, form) {
  let valid = true;

  form.querySelectorAll(".busy").forEach((el) => el.classList.remove("d-none"));

  form
    .querySelectorAll(".non-busy")
    .forEach((el) => el.classList.add("d-none"));

  report.forEach((token) => {
    form.querySelector(`[name="${token}"]`).classList.add("is-invalid");
    valid = false;
  });

  return valid;
}

function validateDefault(form) {
  const inputs = form.querySelectorAll("input");
  let valid = true;

  form.querySelectorAll(".busy").forEach((el) => el.classList.add("d-none"));

  form
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
    document.querySelector("#regCard").classList.toggle("d-none");
    document.querySelector("#loginCard").classList.toggle("d-none");
  })
);

//Login code
document.querySelector("#loginBtn").addEventListener("click", async e => {
  e.preventDefault();

  const data = new FormData(loginForm);

  if (!validateDefault(loginForm)) {
    return;
  }

  const user = {
    name: data.get("name"),
    password: data.get("password"),
    remember: data.get("remember")
  };

  const authorized = JSON.parse(await authorize(JSON.stringify(user)));

  if (!authorized) {
    validateBusy(['name', 'password'], loginForm)
  } else {
    setCookie("user", authorized, 7);
    resetForms();
    window.location.href = "index.htm";
  }
});

function resetForms() {
  regForm.reset();
  loginForm.reset();
}
