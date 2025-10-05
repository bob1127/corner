// pages/api/wc/order.js
function b64(str) {
  return Buffer.from(str).toString("base64");
}

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ ok: false, message: "缺少訂單 ID" });
  }

  if (!process.env.WC_URL || !process.env.WC_CK || !process.env.WC_CS) {
    return res.status(500).json({ ok: false, message: "環境變數未設定" });
  }

  try {
    const url = `${process.env.WC_URL}/wp-json/wc/v3/orders/${id}`;

    const r = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${b64(
          `${process.env.WC_CK}:${process.env.WC_CS}`
        )}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        ok: false,
        message: `讀取失敗 ${r.status}`,
        detail: data,
      });
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ ok: false, message: String(e) });
  }
}
