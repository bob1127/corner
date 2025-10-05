"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "../components/context/CartContext";
import Image from "next/image";
import { motion } from "framer-motion";
import PLAN_ID_MAP from "../lib/esim/planMap";

const CheckoutPage = ({ onBack, onNext }) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // 未折扣小計（給後端算百分比）
  const subtotal = useMemo(
    () => cartItems.reduce((s, it) => s + it.price * it.quantity, 0),
    [cartItems]
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "Credit",
    shippingMethod: "宅配",
    storeInfo: null,
  });

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0); // 實際折抵金額（元，整數）
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponInfo, setCouponInfo] = useState(null); // { code, type: "percent"|"fixed", amount }
  const [memberInfo, setMemberInfo] = useState(null);
  const [useMemberInfo, setUseMemberInfo] = useState(false);

  const finalTotal = Math.max(subtotal - discount, 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storeData = localStorage.getItem("ecpay_cvs_store");
      if (storeData) {
        setFormData((prev) => ({ ...prev, storeInfo: JSON.parse(storeData) }));
      }
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setMemberInfo(JSON.parse(savedUser));
      }
    }
  }, []);

  // 購物車金額變動時，若已套用優惠碼則自動重算
  useEffect(() => {
    if (couponApplied && couponInfo?.code) {
      void reapplyCoupon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 重新計算目前已套用的券（購物車變更時）
  const reapplyCoupon = async () => {
    if (!couponInfo?.code) return;
    try {
      const code = couponInfo.code.toLowerCase(); // ✅ 用已套用的券碼
      const res = await fetch(
        `/api/validate-coupon?code=${encodeURIComponent(
          code
        )}&subtotal=${subtotal}`
      );
      const data = await res.json();
      if (data.valid) {
        setDiscount(Number(data.discount ?? 0));
        setCouponInfo({
          code: data.code,
          type: data.type,
          amount: Number(data.amount),
        });
      } else {
        setDiscount(0);
        setCouponApplied(false);
        setCouponInfo(null);
      }
    } catch {
      /* ignore */
    }
  };

  // 第一次套用（按下「套用」）
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const code = couponCode.trim().toLowerCase(); // ✅ 用輸入框的券碼
      const res = await fetch(
        `/api/validate-coupon?code=${encodeURIComponent(
          code
        )}&subtotal=${subtotal}`
      );
      const data = await res.json();

      if (data.valid) {
        setDiscount(Number(data.discount ?? 0)); // 實際折抵金額（元）
        setCouponApplied(true);
        setCouponInfo({
          code: data.code,
          type: data.type,
          amount: Number(data.amount),
        });
      } else {
        alert(data.message || "優惠碼無效");
        setDiscount(0);
        setCouponApplied(false);
        setCouponInfo(null);
      }
    } catch (err) {
      console.error("❌ 驗證失敗", err);
      alert("套用優惠碼時發生錯誤");
      setDiscount(0);
      setCouponApplied(false);
      setCouponInfo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("請填寫所有必填欄位");
      return;
    }
    if (cartItems.length === 0) {
      alert("購物車為空，無法結帳");
      return;
    }

    const newWindow = window.open("about:blank");
    try {
      const enrichedItems = cartItems.map((item) => {
        const cleanedSku = item.sku
          ?.trim()
          .replace(/\u200B/g, "")
          .replace(/,/g, "-")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
        const resolvedPlanId = item.planId || PLAN_ID_MAP[cleanedSku];
        return { ...item, planId: resolvedPlanId };
      });

      const res = await fetch("/api/newebpay-generate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: enrichedItems,
          totalPrice: finalTotal,
          orderInfo: {
            ...formData,
            customerId: memberInfo?.id || 0,
            couponCode: couponInfo?.code || couponCode,
            discount, // 實際折抵金額（元）
          },
        }),
      });

      const html = await res.text();
      if (newWindow) {
        newWindow.document.write(html);
        newWindow.document.close();
      }
      if (onNext) onNext();
    } catch (err) {
      console.error("❌ 建立訂單失敗", err);
      if (newWindow) newWindow.close();
      alert("送出失敗，請稍後再試");
    }
  };

  const handleLinePaySubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("請填寫所有必填欄位");
      return;
    }
    if (cartItems.length === 0) {
      alert("購物車為空，無法結帳");
      return;
    }
    try {
      const enrichedItems = cartItems.map((item) => {
        const cleanedSku = item.sku
          ?.trim()
          .replace(/\u200B/g, "")
          .replace(/,/g, "-")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
        const resolvedPlanId = item.planId || PLAN_ID_MAP[cleanedSku];
        return { ...item, planId: resolvedPlanId };
      });

      const res = await fetch("/api/linepay/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderInfo: formData,
          cartItems: enrichedItems,
          totalPrice: finalTotal,
          couponCode: couponInfo?.code || couponCode,
          discount, // 實際折抵金額（元）
        }),
      });

      const json = await res.json();
      if (json?.info?.paymentUrl?.web) {
        window.location.href = json.info.paymentUrl.web;
        if (onNext) onNext();
      } else {
        console.error("LINE Pay API 回傳錯誤", json);
        alert("LINE Pay 串接失敗，請查看 Console");
      }
    } catch (err) {
      console.error("LINE Pay 發生錯誤", err);
      alert("LINE Pay 串接失敗");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-[#f5f6f7] pb-[80px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row max-w-7xl w-full my-[70px] mx-auto"
        >
          <div className="w-full lg:w-1/2 flex justify-center bg-white p-5 sm:p-10 m-2 flex-col">
            <div className="max-w-[500px] flex flex-col mx-auto items-center">
              <h2 className="text-xl font-bold mb-4">結帳資訊</h2>

              <div className="flex items-center w-full mb-4">
                <input
                  type="checkbox"
                  id="useMember"
                  checked={useMemberInfo}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setUseMemberInfo(checked);
                    if (checked && memberInfo) {
                      setFormData((prev) => ({
                        ...prev,
                        name: memberInfo.name || "",
                        email: memberInfo.email || "",
                        phone: memberInfo.phone || "",
                      }));
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor="useMember" className="text-sm text-gray-700">
                  同會員資料自動填入
                </label>
              </div>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="姓名"
                className="border p-2 w-full border-gray-300 rounded-[13px] mb-2"
                required
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border p-2 w-full border-gray-300 rounded-[13px] mb-2"
                required
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="手機號碼"
                className="border p-2 w-full border-gray-300 rounded-[13px] mb-2"
                required
              />

              <div className="flex w-full mb-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="折扣碼（選填）"
                  className="border p-2 w-full border-gray-300 rounded-l-[13px]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-gray-800 text-white px-4 rounded-r-[13px]"
                >
                  套用
                </button>
              </div>

              {couponApplied && couponInfo && (
                <p className="text-green-600 mb-2">
                  {couponInfo.type === "percent"
                    ? `已套用優惠碼，折扣 ${couponInfo.amount}%`
                    : `已套用優惠碼，折扣 $${couponInfo.amount}`}
                </p>
              )}

              <div className="mt-2 text-[14px] text-gray-600">
                備註：請填入正確的 Email，此 Email 會拿來當作發送 QR CODE
                兌換的依據
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 m-2 p-10 bg-white">
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                購物車內容
              </h3>

              {cartItems.length === 0 ? (
                <p className="text-gray-500">購物車是空的</p>
              ) : (
                <ul className="space-y-4">
                  {cartItems.map((item, index) => (
                    <li
                      key={index}
                      className="bg-[#f8f8fa] p-4 border-gray-200 border-2 flex flex-row rounded-[20px] items-center gap-4"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-xl max-w-[110px]"
                      />
                      <div className="flex flex-col w-full pl-5">
                        <span className="font-bold">{item.name}</span>
                        <span className="text-sm text-gray-600">
                          國家：{item.color} / 規格：{item.size}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <label className="text-sm">數量：</label>
                          <input
                            type="number"
                            value={item.quantity}
                            min={1}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                item.color,
                                item.size,
                                parseInt(e.target.value, 10)
                              )
                            }
                            className="w-16 rounded-[10px] px-2 py-1 text-sm border"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.id, item.color, item.size)
                            }
                            className="text-red-500 hover:underline text-sm"
                          >
                            移除
                          </button>
                        </div>
                        <span className="text-sm font-medium mt-1">
                          小計：${item.price * item.quantity}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <p className="text-right font-bold mt-4">總金額：${subtotal}</p>
              {discount > 0 && (
                <p className="text-right text-green-600">折扣：-${discount}</p>
              )}
              <p className="text-right text-xl font-bold mt-2">
                優惠後總金額：${finalTotal}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="submit"
                className="hover:bg-gray-900 bg-gray-800 text-white px-6 py-2 rounded-[10px] w-full"
              >
                使用藍新金流結帳
              </button>
              <button
                type="button"
                onClick={handleLinePaySubmit}
                className="hover:bg-green-700 bg-green-600 text-white px-6 py-2 rounded-[10px] w-full"
              >
                使用 LINE Pay 結帳
              </button>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={onBack}
                className="text-gray-600 underline text-sm"
              >
                ← 返回上一步
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
