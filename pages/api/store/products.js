// pages/api/store/products.js
export default async function handler(req, res) {
  const { page = 1, per_page = 24, search = "", category = "" } = req.query;
  const base = process.env.WC_URL;
  const ck = process.env.WC_CK;
  const cs = process.env.WC_CS;

  if (!base) {
    return res.status(500).json({ ok: false, message: "WC_URL 未設定" });
  }

  // 10 秒時間桶，避開上游快取
  const tsBucket = Math.floor(Date.now() / 10000);

  const url = new URL(`${ensureURL(base)}/wp-json/wc/store/products`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(per_page));
  if (search) url.searchParams.set("search", search);
  if (category) url.searchParams.set("category", category);
  url.searchParams.set("_t", String(tsBucket));

  try {
    const r = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
    const storeData = await r.json();
    const list = Array.isArray(storeData) ? storeData : [];

    // 若沒有商品，直接回傳（照樣設置快取 header）
    setCacheHeaders(res);
    if (list.length === 0) return res.status(r.status).json(storeData);

    // 取目前頁面的商品 id 陣列（Woo v3 include 最多 100 筆）
    const ids = list.map((p) => p.id).filter(Boolean).slice(0, 100);

    // 用 v3 查 meta_data（需授權），只拿 id + meta_data
    let metaMap = new Map();
    if (ck && cs) {
      const v3 = new URL(`${ensureURL(base)}/wp-json/wc/v3/products`);
      v3.searchParams.set("include", ids.join(","));
      v3.searchParams.set("per_page", String(ids.length || 1));
      v3.searchParams.set("_fields", "id,meta_data");

      const vr = await fetch(v3.toString(), {
        headers: {
          Accept: "application/json",
          Authorization: basicAuth(ck, cs),
        },
      });
      if (vr.ok) {
        const v3data = await vr.json();
        for (const it of Array.isArray(v3data) ? v3data : []) {
          metaMap.set(it.id, it.meta_data || []);
        }
      }
    }

    // 把 zh_product_name 併到 extensions.custom_acf
    const merged = list.map((p) => {
      const meta = metaMap.get(p.id) || [];
      const cn = pickCnName(meta);
      if (!p.extensions) p.extensions = {};
      if (!p.extensions.custom_acf) p.extensions.custom_acf = {};
      p.extensions.custom_acf.cn_name = cn;
      p.extensions.custom_acf.zh_product_name = cn;
      return p;
    });

    setCacheHeaders(res);
    return res.status(r.status).json(merged);
  } catch (e) {
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

function setCacheHeaders(res) {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");
  res.setHeader("Vary", "Accept");
}

function pickCnName(meta = []) {
  // 依序嘗試這些 key
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
