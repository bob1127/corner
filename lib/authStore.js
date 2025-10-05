// /lib/authStore.js
export const authStore = {
  _state: { ready: false, token: null, user: null }, // user: {email, displayName, nicename, customer_id?}
  _subs: new Set(),

  init() {
    if (this._state.ready) return;
    try {
      const raw = localStorage.getItem("wcAuth");
      if (raw) {
        const { token, user } = JSON.parse(raw);
        this._state.token = token || null;
        this._state.user = user || null;
      }
    } catch {}
    this._state.ready = true;
    this._emit();
  },

  _emit() { this._subs.forEach((fn) => fn(this._state)); },
  get() { return this._state; },

  subscribe(fn) {
    this._subs.add(fn);
    fn(this._state);
    return () => this._subs.delete(fn);
  },

  _save() {
    localStorage.setItem("wcAuth", JSON.stringify({
      token: this._state.token, user: this._state.user
    }));
  },

  async login({ username, password }) {
    const r = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const j = await r.json();
    if (!r.ok || !j.ok) throw new Error(j?.message || "登入失敗");
    this._state.token = j.token;
    this._state.user = j.user;
    this._save(); this._emit();
    return j;
  },

  async register({ email, password, first_name = "", last_name = "" }) {
    const r = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, first_name, last_name }),
    });
    const j = await r.json();
    if (!r.ok || !j.ok) throw new Error(j?.message || "註冊失敗");
    // 註冊後直接登入
    this._state.token = j.token;
    this._state.user = j.user;
    this._save(); this._emit();
    return j;
  },

  logout() {
    this._state.token = null;
    this._state.user = null;
    localStorage.removeItem("wcAuth");
    this._emit();
  },
};
