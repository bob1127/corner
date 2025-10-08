// pages/api/wc/create-order.js
function b64(str) {
  return Buffer.from(str).toString("base64");
}

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

// 支援 slug 與 label 兩種寫法
const DELIVERY_AREAS = {
  vancouver_city: "Vancouver City (Includes West Side, East Van, UBC)",
  burnaby: "Burnaby",
  surrey_whiterock: "White Rock / South Surrey / North Surrey",
};
const DELIVERY_LABEL_TO_SLUG = Object.entries(DELIVERY_AREAS).reduce((acc, [slug, label]) => {
  acc[label] = slug;
  return acc;
}, {});

// Woo REST
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
    const { cart = [], form = {}, shipping_fee = 0, tax = 0 } = req.body || {};

    const WC_URL = ensureURL(process.env.WC_URL);
    const WC_CK = process.env.WC_CK;
    const WC_CS = process.env.WC_CS;
    const WC_TAX_RATE_ID = process.env.WC_TAX_RATE_ID
      ? Number(process.env.WC_TAX_RATE_ID)
      : null; // 可選：Woo 稅率 ID（有設定就用 tax_lines）

    if (!WC_URL || !WC_CK || !WC_CS) {
      return res.status(500).json({
        ok: false,
        message: "WooCommerce 環境變數未設定（請確認 WC_URL/WC_CK/WC_CS）",
      });
    }
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ ok: false, message: "購物車為空" });
    }

    // line_items
    const line_items = cart.map((it) => {
      const pid = Number(it.id);
      if (!Number.isFinite(pid) || pid <= 0) {
        throw new Error(
          `商品 ${it.name || "(未命名)"} 的 id 不是有效的 Woo product_id：${it.id}`
        );
      }
      return { product_id: pid, quantity: Number(it.qty || 1) };
    });

    // 付款
    const { slug: payment_method, title: payment_method_title } = mapPaymentSlug(form.payment);

    // 外送地區：接受 slug 或 label
    const areaRaw = sanitize(form.deliveryArea);
    const areaSlug =
      DELIVERY_AREAS[areaRaw] // 本身就是 slug
        ? areaRaw
        : DELIVERY_LABEL_TO_SLUG[areaRaw] // 給了 label
        ? DELIVERY_LABEL_TO_SLUG[areaRaw]
        : "";
    const areaLabel = areaSlug ? DELIVERY_AREAS[areaSlug] : sanitize(form.deliveryArea) || "";

    // 地址
    const addressDetail = sanitize(form.deliveryAddressDetail || form.address || form.deliveryAddress);

    // 帳單/寄送
    const billing = {
      first_name: sanitize(form.name),
      last_name: "",
      address_1: addressDetail,
      address_2: "",
      city: areaLabel,
      state: "",
      postcode: "",
      country: "CA",
      email: sanitize(form.email),
      phone: sanitize(form.phone),
    };
    const shipping = {
      first_name: sanitize(form.name),
      last_name: "",
      address_1: addressDetail,
      address_2: "",
      city: areaLabel,
      state: "",
      postcode: "",
      country: "CA",
    };

    // 備註 / 自訂欄位
    const meta_data = [
      { key: "wechat", value: sanitize(form.wechat) },
      { key: "contact_other", value: sanitize(form.contactOther) },
      { key: "subscribe_newsletter", value: !!form.subscribe },
      { key: "frontend_source", value: "Next.js custom checkout (Pages)" },
      ...(areaSlug
        ? [
            { key: "_delivery_area", value: areaSlug },
            { key: "_delivery_area_label", value: areaLabel },
            { key: "_delivery_address_detail", value: addressDetail },
          ]
        : []),
      // 也把金額記一份在 meta，方便對帳
      { key: "_shipping_fee_frontend", value: Number(shipping_fee) || 0 },
      { key: "_tax_frontend", value: Number(tax) || 0 },
    ];

    const customer_note =
      `來源：自訂結帳頁\n` +
      `付款方式：${sanitize(form.payment) || "未選"}\n` +
      (areaLabel ? `外送地區：${areaLabel}\n` : "") +
      (addressDetail ? `外送地址：${addressDetail}\n` : "") +
      (form.wechat ? `WeChat：${sanitize(form.wechat)}\n` : "") +
      (form.contactOther ? `其他聯絡：${sanitize(form.contactOther)}\n` : "");

    // —— 關鍵：把運費/稅金塞進訂單 —— //
    // 運費（顯示為「運送」）：
    const shipping_lines = [
      {
        method_id: "custom_delivery", // 任意字串；若你有啟用 flat_rate 也可用 'flat_rate'
        method_title: "Delivery",
        total: Number(shipping_fee || 0).toFixed(2),
      },
    ];

    // 稅金：預設用 fee_lines（顯示為費用）。若環境有 WC_TAX_RATE_ID，就用 tax_lines 正規寫法。
    const fee_lines = [];
    let tax_lines = [];

    const taxAmount = Number(tax || 0);
    if (WC_TAX_RATE_ID && taxAmount > 0) {
      tax_lines = [
        {
          rate_id: WC_TAX_RATE_ID,
          label: "Tax",
          // Woo 版本差異：有的用 tax_total，有的用 total；帶這兩個最穩
          tax_total: taxAmount.toFixed(2),
          total: taxAmount.toFixed(2),
        },
      ];
    } else if (taxAmount > 0) {
      fee_lines.push({
        name: "Tax",
        total: taxAmount.toFixed(2),
      });
    }

    const orderPayload = {
      payment_method,
      payment_method_title,
      set_paid: false,
      status: "pending",
      billing,
      shipping,
      line_items,
      meta_data,
      // 這兩個才會影響 Woo 後台「總計」：
      shipping_lines,
      fee_lines,
      tax_lines,
      customer_note,
    };

    // 建單
    let resp = await postOrder({
      url: WC_URL,
      payload: orderPayload,
      ck: WC_CK,
      cs: WC_CS,
      useQueryAuth: false,
    });
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
