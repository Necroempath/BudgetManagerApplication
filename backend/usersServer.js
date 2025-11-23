import { verifyPassword } from "../hashing/hashing";
const users = JSON.parse(localStorage.getItem("users")) || [];
const save = (users) => localStorage.setItem("users", JSON.stringify(users));

export function saveUser(userJSON) {
  const user = JSON.parse(userJSON);
  const report = validate(user);

  if (report.length === 0) {
    users.push(user);
    save(users);

  }

  return report;
}

export function authorize(userJSON) {
  const user = JSON.parse(userJSON);
  const searchRes = users.find((u) => u.name === user.name);

  if (!searchRes) {
    return null;
  }

  if (
    verifyPassword(user.password, searchRes.hash, searchRes.salt) !==
    searchRes.hash
  ) {
    return null;
  }

  return searchRes;
}

function remember(user) {
  if (user.remember) {
    users.forEach((user) => (user.remember = false));
    user.remember = true;
  } else {
    user.remember = false;
  }
}
function validate(data) {
  const duplicates = [];

  if (users.find((user) => user.email === data.email)) {
    duplicates.push("email");
  }
  if (users.find((user) => user.name === data.name)) {
    duplicates.push("name");
  }

  return duplicates;
}
