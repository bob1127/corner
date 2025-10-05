// /pages/api/auth/login.js
function b64(s){ return Buffer.from(s).toString("base64"); }
const trimURL = (u) => (u || "").replace(/\/+$/, "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok:false, message:"Method Not Allowed" });
  }
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ ok:false, message:"缺少帳號或密碼" });
  }
  const WC_URL = trimURL(process.env.WC_URL);
  const CK = process.env.WC_CK, CS = process.env.WC_CS;
  if (!WC_URL || !CK || !CS) {
    return res.status(500).json({ ok:false, message:"環境變數未設定" });
  }

  try {
    // 1) JWT 取得 token
    const tokenResp = await fetch(`${WC_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept:"application/json" },
      body: JSON.stringify({ username, password }),
    });
    const tokenData = await tokenResp.json();
    if (!tokenResp.ok || !tokenData?.token) {
      return res.status(tokenResp.status || 400).json({
        ok:false, message: tokenData?.message || "登入失敗", detail: tokenData
      });
    }

    const email = tokenData?.user_email || username;
    // 2) 找 Woo 顧客（補 customer_id）
    const meResp = await fetch(
      `${WC_URL}/wp-json/wc/v3/customers?email=${encodeURIComponent(email)}`,
      { headers: { Authorization: `Basic ${b64(`${CK}:${CS}`)}` } }
    );
    const customers = await meResp.json().catch(()=>[]);
    const customer = Array.isArray(customers) ? customers[0] : null;

    return res.status(200).json({
      ok: true,
      token: tokenData.token,
      user: {
        email,
        displayName: tokenData?.user_display_name || email,
        nicename: tokenData?.user_nicename || "",
        customer_id: customer?.id || null,
      },
    });
  } catch (e) {
    return res.status(500).json({ ok:false, message:String(e) });
  }
}
