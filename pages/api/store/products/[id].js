// pages/api/store/products/[id].js
export default async function handler(req, res) {
  const { id } = req.query;
  const base = process.env.WC_URL;
  const ck = process.env.WC_CK;
  const cs = process.env.WC_CS;

  if (!base) {
    return res.status(500).json({ ok: false, message: "❌ WC_URL 未設定" });
  }
  if (!id) {
    return res.status(400).json({ ok: false, message: "缺少商品 ID" });
  }

  try {
    // ① Store API 取單品
    const r = await fetch(`${ensureURL(base)}/wp-json/wc/store/products/${id}`, {
      headers: { Accept: "application/json" },
    });
    const product = await r.json();

    // 容錯：若不是 2xx 直接回傳 Woo 原樣
    if (!r.ok || !product?.id) {
      return res.status(r.status).json(product);
    }

    // ② 解析保存方式（你原本的程式）
    const resolved = await resolveStorageAttributeForSingle(base, product, ck, cs);

    // ③ 追加 v3 的 meta_data → 併入 ACF 中文名
    if (ck && cs) {
      const v3 = `${ensureURL(base)}/wp-json/wc/v3/products/${id}?_fields=id,meta_data`;
      const vr = await fetch(v3, {
        headers: {
          Accept: "application/json",
          Authorization: basicAuth(ck, cs),
        },
      });
      if (vr.ok) {
        const detail = await vr.json();
        const cn = pickCnName(detail?.meta_data || []);
        if (!resolved.extensions) resolved.extensions = {};
        if (!resolved.extensions.custom_acf) resolved.extensions.custom_acf = {};
        resolved.extensions.custom_acf.cn_name = cn;
        resolved.extensions.custom_acf.zh_product_name = cn;
      }
    }

    return res.status(200).json(resolved);
  } catch (e) {
    console.error("❌ WooCommerce 單品 API 錯誤：", e);
    return res.status(500).json({ ok: false, message: String(e) });
  }
}

/* ---------------- helpers ---------------- */

function ensureURL(u = "") {
  return String(u).replace(/\/+$/, "");
}

function basicAuth(ck, cs) {
  return "Basic " + Buffer.from(`${ck}:${cs}`).toString("base64");
}

// 找出保存方式 attribute（storage / pa_storage），若是 ID 就轉成名稱
async function resolveStorageAttributeForSingle(base, product, ck, cs) {
  const found = getStorageRawOptions(product);
  if (!found) return product;
  const { attr, raw } = found;

  const ids = raw
    .map((v) => (typeof v === "number" ? v : parseInt(v)))
    .filter((v) => Number.isInteger(v));

  if (ids.length === 0 || !ck || !cs) return product;

  try {
    const attrsRes = await fetch(`${ensureURL(base)}/wp-json/wc/v3/products/attributes?per_page=100`, {
      headers: { Accept: "application/json", Authorization: basicAuth(ck, cs) },
    });
    if (!attrsRes.ok) return product;

    const attrs = await attrsRes.json();
    const storageDef = attrs.find((a) => String(a.slug || "").toLowerCase().includes("storage"));
    if (!storageDef) return product;

    const termsRes = await fetch(
      `${ensureURL(base)}/wp-json/wc/v3/products/attributes/${storageDef.id}/terms?include=${ids.join(",")}&per_page=100`,
      { headers: { Accept: "application/json", Authorization: basicAuth(ck, cs) } }
    );
    if (!termsRes.ok) return product;

    const terms = await termsRes.json();
    const mapIdToName = new Map(terms.map((t) => [t.id, t.name]));
    const names = ids.map((id) => mapIdToName.get(id)).filter(Boolean);
    if (names.length) attr.options = names;
  } catch (err) {
    console.warn("⚠️ 無法解析保存方式 term 名稱：", err);
  }

  return product;
}

function getStorageRawOptions(product) {
  const attrs = Array.isArray(product?.attributes) ? product.attributes : [];
  const storageAttr = attrs.find((a) => {
    const name = String(a?.name || "").toLowerCase();
    const slug = String(a?.slug || "").toLowerCase();
    const tax = String(a?.taxonomy || "").toLowerCase();
    return (
      name.includes("保存方式") || slug === "storage" || slug === "pa_storage" || tax === "pa_storage"
    );
  });
  if (!storageAttr) return null;

  if (Array.isArray(storageAttr.terms) && storageAttr.terms.length > 0) {
    return { attr: storageAttr, raw: storageAttr.terms.map((t) => t?.id || t?.name) };
  }
  if (Array.isArray(storageAttr.options) && storageAttr.options.length > 0) {
    return { attr: storageAttr, raw: storageAttr.options.slice() };
  }
  return { attr: storageAttr, raw: [] };
}

function pickCnName(meta = []) {
  const keys = [
    "zh_product_name",
    "cn_name",
    "zh_name",
    "chinese_name",
    "cn_product_name",
    "中文產品名稱",
  ];
  for (const k of keys) {
    const row = meta.find((m) => m?.key === k && m?.value);
    if (row?.value) return String(row.value);
  }
  return "";
}
