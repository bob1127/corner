import { useState } from "react";

const RegisterForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    code: "",
  });

  const [message, setMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendCode = async () => {
    if (!form.email) return setMessage("請先輸入 Email");

    try {
      const res = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("驗證碼已寄出，請查收 Email");
        setIsCodeSent(true);
      } else {
        setMessage(data.message || "驗證碼寄送失敗");
      }
    } catch (err) {
      setMessage("錯誤：" + err.message);
    }
  };

  const handleVerifyCode = async () => {
    if (!form.email || !form.code) {
      return setMessage("請輸入 Email 與驗證碼");
    }

    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: form.code }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("✅ 驗證成功，請繼續註冊");
        setIsCodeVerified(true);
      } else {
        setMessage("驗證碼錯誤或已過期");
      }
    } catch (err) {
      setMessage("錯誤：" + err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isCodeVerified) return setMessage("請先完成 Email 驗證");

    setMessage("註冊中...");
    try {
      const res = await fetch(
        "https://fegoesim.com/wp-json/custom/v1/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data.user_id) {
        setShowSuccessPopup(true);
        setMessage("");
        if (onSuccess) onSuccess("註冊成功！請登入會員");

        setTimeout(() => setShowSuccessPopup(false), 3000);
      } else {
        setMessage(data.message || "註冊失敗");
      }
    } catch (err) {
      setMessage("錯誤：" + err.message);
    }
  };

  return (
    <div className="relative">
      {showSuccessPopup && (
        <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          註冊成功！
        </div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          required
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-[13px]"
          placeholder="請輸入帳號"
        />

        <div className="flex gap-2">
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-[13px]"
            placeholder="請輸入 Email"
          />
          <button
            type="button"
            onClick={handleSendCode}
            className="px-4 py-2 bg-blue-500 text-white rounded-[10px]"
          >
            發送驗證碼
          </button>
        </div>

        {isCodeSent && (
          <div className="flex gap-2">
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-[13px]"
              placeholder="請輸入驗證碼"
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              className="px-4 py-2 bg-green-600 text-white rounded-[10px]"
            >
              驗證
            </button>
          </div>
        )}

        <input
          required
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-[13px]"
          placeholder="請輸入密碼"
        />

        <button
          type="submit"
          className="bg-[#1757FF] text-white py-2 rounded-[10px] hover:bg-[#2a3ebb] transition"
        >
          註冊
        </button>
      </form>

      {message && (
        <p className="text-sm text-center text-red-600 mt-2">{message}</p>
      )}
    </div>
  );
};

export default RegisterForm;
