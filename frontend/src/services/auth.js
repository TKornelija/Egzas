export function gautiVartotoja() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function atsijungti() {
  localStorage.removeItem("user");

  window.dispatchEvent(new Event("storage"));
}
