// pages/api/memory/delivery-slots.js
export default async function handler(req, res) {
  try {
    const r = await fetch(`${process.env.WC_URL}/wp-json/memory/v1/delivery-slots`);
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ ok:false, message:'WP slots error', data });
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ ok:false, message:String(e) });
  }
}
