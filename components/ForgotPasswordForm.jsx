import { useState } from "react";

export default function ForgotPasswordForm({ onClose }) {
  const [identifier, setIdentifier] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setMsg("請輸入帳號或 Email");
      return;
    }
    setSubmitting(true);
    setMsg("寄送中…");

    try {
      // 直接呼叫你自己的 Next.js API（由它去問 WP 並寄信）
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg(data?.message || "若該 Email/帳號存在，將寄出重設密碼信。");
      } else {
        setMsg(data?.message || "寄送失敗，請稍後再試。");
      }
    } catch (err) {
      setMsg("錯誤：" + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h3 className="text-lg font-semibold mb-2">忘記密碼</h3>
      <p className="text-sm text-gray-600 mb-4">
        請輸入您的帳號或 Email，我們會寄出重設密碼連結到您的信箱。
      </p>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-[13px]"
          placeholder="帳號或 Email"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className={`bg-[#1757FF] text-white py-2 rounded-[10px] hover:bg-[#2a3ebb] transition ${
            submitting ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? "寄送中…" : "寄送重設密碼連結"}
        </button>
        {msg && <p className="text-sm text-center text-gray-700">{msg}</p>}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-2 text-sm text-blue-600 underline"
          >
            返回登入
          </button>
        )}
      </form>
    </div>
  );
}
