const LS_KEY = "admin";

export function getAdmin() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || null; }
  catch { return null; }
}

export function adminLogin({ token, email, role }) {
  const admin = { token, email, role, ts: Date.now() };
  localStorage.setItem(LS_KEY, JSON.stringify(admin));
  return admin;
}

export function adminLogout() {
  localStorage.removeItem(LS_KEY);
}

export function isAdminAuthed() {
  return !!getAdmin()?.token;
}
