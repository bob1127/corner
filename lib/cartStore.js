"use client";

// 超輕量全域購物車（localStorage + 事件訂閱）
let cart = [];
const LS_KEY = "cart:v1";
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  } catch {}
}

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    cart = raw ? JSON.parse(raw) : [];
  } catch {
    cart = [];
  }
}

function notify() {
  listeners.forEach((fn) => fn(cart));
}

function upsertItem(item, qty = 1) {
  const i = cart.findIndex((it) => it.id === item.id);
  if (i >= 0) {
    cart[i].qty += qty;
  } else {
    cart.push({ ...item, qty });
  }
}

export const cartStore = {
  init() {
    if (typeof window === "undefined") return;
    load();
    notify();
    // 同頁多分頁同步
    window.addEventListener("storage", (e) => {
      if (e.key === LS_KEY) {
        load();
        notify();
      }
    });
  },
  subscribe(fn) {
    listeners.add(fn);
    // 立刻回推一次
    fn(cart);
    return () => listeners.delete(fn);
  },
  get() {
    return cart;
  },
  add(item, qty = 1) {
    upsertItem(item, qty);
    persist();
    notify();
  },
  remove(id) {
    cart = cart.filter((it) => it.id !== id);
    persist();
    notify();
  },
  setQty(id, qty) {
    const it = cart.find((i) => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, qty | 0);
    persist();
    notify();
  },
  clear() {
    cart = [];
    persist();
    notify();
  },
  count() {
    return cart.reduce((n, it) => n + (it.qty || 0), 0);
  },
  total() {
    // 若之後有價格欄位可在此相乘
    return 0;
  },
};
