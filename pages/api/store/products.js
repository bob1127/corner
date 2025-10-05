// pages/api/store/products.js
export default async function handler(req, res) {
  const { page = 1, per_page = 24, search = "", category = "" } = req.query;
  const base = process.env.WC_URL;
  if (!base) {
    return res.status(500).json({ ok: false, message: "WC_URL 未設定" });
  }

  // 10 秒時間桶：同一個 10 秒區間內值相同，跨區間自動變更，幫你避開上游快取
  const tsBucket = Math.floor(Date.now() / 10000);

  const url = new URL(`${base}/wp-json/wc/store/products`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(per_page));
  if (search) url.searchParams.set("search", search);
  if (category) url.searchParams.set("category", category);
  // 🔸 加上 10 秒時間桶，避免 Woo/瀏覽器把結果卡住
  url.searchParams.set("_t", String(tsBucket));

  try {
    const r = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
    const data = await r.json();

   
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
    );

    // 讓不同查詢參數能被獨立快取（保險做法）
    res.setHeader("Vary", "Accept");

    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ ok: false, message: String(e) });
  }
}
