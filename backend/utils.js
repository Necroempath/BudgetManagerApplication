export function getCookie(name) {
  const cookies = document.cookie.split("; ");

  const cookie = cookies.find((c) => c.startsWith(name + "="));

  if (!cookie) return null;
  return JSON.parse(cookie.split("=")[1]);
}