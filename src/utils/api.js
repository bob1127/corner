export async function addToCart(productId, quantity) {
  try {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log("✅ 加入購物車成功:", data);
    } else {
      console.error("❌ 加入購物車失敗:", data);
    }
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return { error: "Server error" };
  }
}
