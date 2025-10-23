const LS_KEY = "fot:user";

export function getUser() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || null; }
  catch { return null; }
}

export function login({ email }) {
  const user = { email, name: email.split("@")[0], ts: Date.now() };
  localStorage.setItem(LS_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(LS_KEY);
}

const subs = new Set();
export function subscribeAuth(fn){ subs.add(fn); return ()=>subs.delete(fn); }
export function notifyAuth(){ subs.forEach(fn=>fn(getUser())); }
