const CART_KEY = "fot:cart";

function read() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function write(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function getItems() { return read(); }
export function clearCart() { write([]); }
export function addItem(item) {
  const items = read();
  const idx = items.findIndex(it => it.id === item.id && it.size === item.size);
  if (idx >= 0) {
    items[idx].qty += item.qty || 1;
  } else {
    items.push({ ...item, qty: item.qty || 1 });
  }
  write(items);
  return items;
}
export function removeItem(id, size) {
  write(read().filter(it => !(it.id === id && it.size === size)));
}
export function setQty(id, size, qty) {
  const items = read().map(it => (it.id === id && it.size === size) ? { ...it, qty: Math.max(1, qty) } : it);
  write(items);
  return items;
}
export function total(items = read()) {
  return items.reduce((sum, it) => sum + it.qty * (it.price ?? 0), 0);
}
