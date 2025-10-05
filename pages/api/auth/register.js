// /pages/api/auth/register.js
function b64(s){ return Buffer.from(s).toString("base64"); }
const trimURL = (u) => (u || "").replace(/\/+$/, "");

const usernameFromEmail = (email) =>
  String(email).split("@")[0].replace(/[^a-zA-Z0-9._-]/g, "_").slice(0,40);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok:false, message:"Method Not Allowed" });
  }
  const { email, password, first_name="", last_name="" } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ ok:false, message:"缺少 email 或 密碼" });
  }

  const WC_URL = trimURL(process.env.WC_URL);
  const CK = process.env.WC_CK, CS = process.env.WC_CS;
  if (!WC_URL || !CK || !CS) {
    return res.status(500).json({ ok:false, message:"環境變數未設定" });
  }

  try {
    // 1) 建 Woo 客戶（也會建立對應 WP 帳號）
    const payload = {
      email, first_name, last_name,
      username: usernameFromEmail(email),
      password,
    };
    const r = await fetch(`${WC_URL}/wp-json/wc/v3/customers`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${b64(`${CK}:${CS}`)}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ ok:false, message: data?.message || "註冊失敗", detail:data });
    }

    // 2) 直接幫使用者登入（JWT）
    const loginResp = await fetch(`${WC_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept:"application/json" },
      body: JSON.stringify({ username: email, password }),
    });
    const loginData = await loginResp.json();
    if (!loginResp.ok || !loginData?.token) {
      return res.status(200).json({
        ok:true,
        user: { email, displayName: `${first_name} ${last_name}`.trim(), customer_id: data?.id || null },
        note: "已建立帳號，但自動登入失敗，請用帳密登入。",
      });
    }

    return res.status(200).json({
      ok:true,
      token: loginData.token,
      user: {
        email,
        displayName: loginData?.user_display_name || `${first_name} ${last_name}`.trim() || email,
        nicename: loginData?.user_nicename || "",
        customer_id: data?.id || null,
      },
    });
  } catch (e) {
    return res.status(500).json({ ok:false, message:String(e) });
  }
}
