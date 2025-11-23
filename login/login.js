import { hashPassword, verifyPassword } from '../hashing/hashing.js'
const regForm = document.querySelector("#regForm");
const loginForm = document.querySelector("#loginForm");
const cpass = document.querySelector("#cpassword");

document.querySelector("#regBtn").addEventListener("click", async e => {
  e.preventDefault();
  const data = new FormData(regForm);

  const defValidate = validateDefault();
  const passValidate = validatePassword(data);

  if(!defValidate || !passValidate) {
    return;
  }

  const {salt, hash} = await hashPassword(cpass.value);

  const user = {
    email: data.get('email'),
    name: data.get('name'),
    salt: salt,
    hash: hash,
    remember: data.get('remember'),
    date: new Date()
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

function validateDefault() {
  const inputs = regForm.querySelectorAll("input");
let valid = true;
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
document.querySelector("#loginBtn");
