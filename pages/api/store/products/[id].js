// pages/api/store/products/[id].js
export default async function handler(req, res) {
  const { id } = req.query;
  const base = process.env.WC_URL;
  if (!base) {
    return res.status(500).json({ ok: false, message: "❌ WC_URL 未設定" });
  }

  try {
    // ① 使用 WooCommerce Store API 取得商品資料（公開端點）
    const r = await fetch(`${base}/wp-json/wc/store/products/${id}`, {
      headers: { Accept: "application/json" },
    });
    const data = await r.json();

    // ② 嘗試轉換保存方式（storage / pa_storage）的 term ID → 名稱
    const resolved = await resolveStorageAttributeForSingle(base, data);

    return res.status(r.status).json(resolved);
  } catch (e) {
    console.error("❌ WooCommerce 單品 API 錯誤：", e);
    return res.status(500).json({ ok: false, message: String(e) });
  }
}

/* -------------------- helpers -------------------- */

// 建立 Basic Auth header（v3 API 需授權）
function authHeader() {
  const key = process.env.WC_KEY;
  const secret = process.env.WC_SECRET;
  if (!key || !secret) return null;
  const token = Buffer.from(`${key}:${secret}`).toString("base64");
  return { Authorization: `Basic ${token}` };
}

// 從商品裡取出保存方式屬性（storage / pa_storage）
function getStorageRawOptions(product) {
  if (!product) return null;
  const attrs = Array.isArray(product.attributes) ? product.attributes : [];

  const storageAttr = attrs.find((a) => {
    const name = String(a?.name || "").toLowerCase();
    const slug = String(a?.slug || "").toLowerCase();
    const tax = String(a?.taxonomy || "").toLowerCase();
    return (
      name.includes("保存方式") ||
      slug === "storage" ||
      slug === "pa_storage" ||
      tax === "pa_storage"
    );
  });

  if (!storageAttr) return null;

  // 優先處理 Store API 的 terms（正確格式）
  if (Array.isArray(storageAttr.terms) && storageAttr.terms.length > 0) {
    return { attr: storageAttr, raw: storageAttr.terms.map((t) => t?.id || t?.name) };
  }

  // 備援：options 陣列（舊版本 WooCommerce）
  if (Array.isArray(storageAttr.options) && storageAttr.options.length > 0) {
    return { attr: storageAttr, raw: storageAttr.options.slice() };
  }

  return { attr: storageAttr, raw: [] };
}

/**
 * 如果保存方式的 options 是數字 ID，就去 WooCommerce v3 API 查 term 名稱
 */
async function resolveStorageAttributeForSingle(base, product) {
  const found = getStorageRawOptions(product);
  if (!found) return product;

  const { attr, raw } = found;
  const ids = raw
    .map((v) => (typeof v === "number" ? v : parseInt(v)))
    .filter((v) => Number.isInteger(v));

  // 若都是名稱（非數字），直接回傳
  if (ids.length === 0) return product;

  const header = authHeader();
  if (!header) return product; // 無授權，無法進一步解析名稱

  try {
    // 1️⃣ 抓全部 attributes 找出 storage
    const attrsRes = await fetch(`${base}/wp-json/wc/v3/products/attributes?per_page=100`, {
      headers: { ...header, Accept: "application/json" },
    });
    if (!attrsRes.ok) return product;

    const attrs = await attrsRes.json();
    const storageDef = attrs.find((a) => {
      const slug = String(a.slug || "").toLowerCase();
      return slug === "storage" || slug === "pa_storage";
    });
    if (!storageDef) return product;

    // 2️⃣ 查該 storage attribute 的 term 名稱
    const include = ids.join(",");
    const termsRes = await fetch(
      `${base}/wp-json/wc/v3/products/attributes/${storageDef.id}/terms?include=${include}&per_page=100`,
      { headers: { ...header, Accept: "application/json" } }
    );
    if (!termsRes.ok) return product;

    const terms = await termsRes.json();
    const mapIdToName = new Map(terms.map((t) => [t.id, t.name]));
    const names = ids.map((id) => mapIdToName.get(id)).filter(Boolean);

    // 3️⃣ 覆蓋 attr.options 為名稱陣列
    if (names.length) {
      attr.options = names;
    }
  } catch (err) {
    console.warn("⚠️ 無法解析保存方式 term 名稱：", err);
  }

  return product;
}
