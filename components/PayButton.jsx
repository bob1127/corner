"use client";

export default function NewebPayTestButton() {
  const handleClick = async () => {
    const popup = window.open("", "_blank", "width=600,height=800");
    if (!popup) {
      alert("請允許瀏覽器彈出視窗");
      return;
    }

    // 等待 API 取得 HTML 表單
    const res = await fetch("/api/newebpay-generate-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderInfo: { email: "test@example.com" },
        items: [{ name: "Test Item", price: 200, quantity: 1 }],
      }),
    });

    const html = await res.text();

    // 確保 popup 完整載入後再寫入內容
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded shadow"
    >
      測試藍新付款
    </button>
  );
}
