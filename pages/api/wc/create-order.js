// pages/api/wc/create-order.js
function b64(str) {
  return Buffer.from(str).toString("base64");
}

// 中文付款方式 → Woo slug 對照
function mapPaymentSlug(label = "") {
  const t = String(label).trim();
  if (!t) return { slug: "cod", title: "貨到付款" };

  const table = [
    { kw: ["貨到付款", "貨到", "COD", "cod"], slug: "cod", title: "貨到付款" },
    { kw: ["銀行轉帳", "匯款", "轉帳", "bacs", "BACS"], slug: "bacs", title: "銀行轉帳" },
    { kw: ["信用卡", "刷卡", "stripe", "card"], slug: "stripe", title: "信用卡" },
    { kw: ["LINE Pay", "line pay", "linepay"], slug: "linepay", title: "LINE Pay" },
  ];

  for (const row of table) {
    if (row.kw.some((k) => t.toLowerCase().includes(String(k).toLowerCase()))) {
      return { slug: row.slug, title: row.title };
    }
  }
  return { slug: "cod", title: t || "貨到付款" };
}

const ensureURL = (u) => (u || "").replace(/\/+$/, "");
const sanitize = (v) => (typeof v === "string" ? v.trim() : "");

// ⬇︎ 你前端 checkout 要傳的三個地區「slug」之一：
// 'vancouver_city' | 'burnaby' | 'surrey_whiterock'
const DELIVERY_AREA_MAP = {
  vancouver_city: "Vancouver City (including …)",
  burnaby: "Burnaby",
  surrey_whiterock: "White Rock / South Surrey / North Surrey",
};

// 封裝下單請求（可選 Basic 或 query auth）
async function postOrder({ url, payload, ck, cs, useQueryAuth = false }) {
  const endpoint = `${url}/wp-json/wc/v3/orders${
    useQueryAuth
      ? `?consumer_key=${encodeURIComponent(ck)}&consumer_secret=${encodeURIComponent(cs)}`
      : ""
  }`;

  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (!useQueryAuth) headers.Authorization = `Basic ${b64(`${ck}:${cs}`)}`;

  const r = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  try {
    const { cart = [], form = {} } = req.body || {};

    // === 環境檢查 ===
    const WC_URL = ensureURL(process.env.WC_URL);
    const WC_CK = process.env.WC_CK;
    const WC_CS = process.env.WC_CS;

    if (!WC_URL || !WC_CK || !WC_CS) {
      return res.status(500).json({
        ok: false,
        message: "WooCommerce 環境變數未設定（請確認 WC_URL/WC_CK/WC_CS）",
      });
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ ok: false, message: "購物車為空" });
    }

    // === line_items ===
    const line_items = cart.map((it) => {
      const pid = Number(it.id);
      if (!Number.isFinite(pid) || pid <= 0) {
        throw new Error(
          `商品 ${it.name || "(未命名)"} 的 id 不是有效的 Woo product_id：${it.id}`
        );
      }
      return { product_id: pid, quantity: Number(it.qty || 1) };
    });

    // === 付款方式對照 ===
    const { slug: payment_method, title: payment_method_title } = mapPaymentSlug(form.payment);

    // === 外送地區（slug + label）與詳細地址 ===
    const areaSlugRaw = sanitize(form.deliveryArea); // 前端送來的 slug
    const areaSlug =
      areaSlugRaw && DELIVERY_AREA_MAP[areaSlugRaw] ? areaSlugRaw : ""; // 僅接受三個有效值
    const areaLabel = areaSlug ? DELIVERY_AREA_MAP[areaSlug] : ""; // 顯示用名稱
    const addressDetail = sanitize(form.deliveryAddressDetail || form.address); // 你頁面中的詳細地址欄位

    // === 帳單/寄送 ===（city 帶入地區名稱，地址放 input 寫的詳細地址）
    const billing = {
      first_name: sanitize(form.name),
      last_name: "",
      address_1: addressDetail,
      address_2: "",
      city: areaLabel || sanitize(form.city),
      state: "",
      postcode: "",
      country: "CA", // 加拿大
      email: sanitize(form.email),
      phone: sanitize(form.phone),
    };
    const shipping = {
      first_name: sanitize(form.name),
      last_name: "",
      address_1: addressDetail,
      address_2: "",
      city: areaLabel || sanitize(form.city),
      state: "",
      postcode: "",
      country: "CA",
    };

    // === 備註/自訂欄位（關鍵：這三個 key 供後台篩選/顯示） ===
    const meta_data = [
      // 其他資訊（保留你原本的）
      { key: "wechat", value: sanitize(form.wechat) },
      { key: "contact_other", value: sanitize(form.contactOther) },
      { key: "subscribe_newsletter", value: !!form.subscribe },
      { key: "frontend_source", value: "Next.js custom checkout (Pages)" },

      // ↓↓↓ 外送地區（**這三個 key 是後台列表/篩選會用到**）
      ...(areaSlug
        ? [
            { key: "_delivery_area", value: areaSlug }, // e.g. 'burnaby'
            { key: "_delivery_area_label", value: areaLabel }, // e.g. 'Burnaby'
            { key: "_delivery_address_detail", value: addressDetail }, // 客人填的詳細地址
          ]
        : []),
    ];

    const customer_note =
      `來源：自訂結帳頁\n` +
      `付款方式：${sanitize(form.payment) || "未選"}\n` +
      (areaLabel ? `外送地區：${areaLabel}\n` : "") +
      (addressDetail ? `外送地址：${addressDetail}\n` : "") +
      (form.wechat ? `WeChat：${sanitize(form.wechat)}\n` : "") +
      (form.contactOther ? `其他聯絡：${sanitize(form.contactOther)}\n` : "");

    // === 訂單 payload ===
    const orderPayload = {
      payment_method,
      payment_method_title,
      set_paid: false, // 沒串金流 → false
      status: "pending",
      billing,
      shipping,
      line_items,
      meta_data,
      customer_note,
    };

    // 先嘗試 Basic Auth
    let resp = await postOrder({
      url: WC_URL,
      payload: orderPayload,
      ck: WC_CK,
      cs: WC_CS,
      useQueryAuth: false,
    });

    // 若 Basic 失敗（共享主機常見）→ 用 query auth 再試
    if (!resp.ok && [401, 403, 404].includes(resp.status)) {
      resp = await postOrder({
        url: WC_URL,
        payload: orderPayload,
        ck: WC_CK,
        cs: WC_CS,
        useQueryAuth: true,
      });
    }

    if (!resp.ok) {
      return res.status(resp.status || 400).json({
        ok: false,
        message: resp?.data?.message || "Woo 端建立訂單失敗",
        detail: resp.data,
      });
    }

    return res.status(200).json({ ok: true, order: resp.data });
  } catch (err) {
    console.error("create-order error:", err);
    return res.status(500).json({
      ok: false,
      message: "伺服器處理失敗",
      error: String(err?.message || err),
    });
  }
}
