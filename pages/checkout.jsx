// pages/checkout.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { cartStore } from "@/lib/cartStore";
import Layout from "./Layout";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useT } from "@/lib/i18n";

/* === Areas factory so labels can be localized === */
function getAreas(t) {
  return [
    {
      label: t(
        "co.area.vancouver",
        "Vancouver City (Includes West Side, East Van, UBC) — Excludes Downtown & North Van"
      ),
      value: "Vancouver City",
      fee: 12,
      tax: 5,
      freeThreshold: 120,
    },
    {
      label: t("co.area.burnaby", "Burnaby"),
      value: "Burnaby",
      fee: 12,
      tax: 5,
      freeThreshold: 120,
    },
    {
      label: t("co.area.surrey", "White Rock / South Surrey / North Surrey"),
      value: "White Rock / South Surrey / North Surrey",
      fee: 14,
      tax: 5,
      freeThreshold: 150,
    },
  ];
}

export default function CheckoutPage() {
  const router = useRouter();
  const t = useT();

  const AREAS = useMemo(() => getAreas(t), [t]);

  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    email: "",
    subscribe: false,
    name: "",
    phone: "",
    address: "",
    wechat: "",
    contactOther: "",
    payment: "", // 前端保留，但不做驗證
    deliveryArea: "",
    deliveryAddress: "",
  });

  useEffect(() => {
    cartStore.init();
    const unsub = cartStore.subscribe((c) => setCart([...c]));
    return unsub;
  }, []);

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, it) => sum + Number(it.price || 0) * (it.qty || 0), 0),
    [cart]
  );

  /* === Shipping fee & tax based on selected area === */
  const selectedArea = AREAS.find((a) => a.value === form.deliveryArea);
  let shippingFee = selectedArea?.fee || 0;
  const taxRate = selectedArea?.tax || 0;

  // Free shipping above threshold
  if (selectedArea && subtotal >= selectedArea.freeThreshold) {
    shippingFee = 0;
  }

  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const total = subtotal + shippingFee + taxAmount;

  const onChange = (key) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: v }));
  };

  async function handlePlaceOrder() {
    if (!cart.length) return alert(t("co.alert.empty", "Cart is empty"));
    if (!form.name || !form.phone || !form.email)
      return alert(
        t("co.alert.fillBasic", "Please enter name, phone, and email")
      );
    // （已移除付款方式驗證）
    if (!form.deliveryArea)
      return alert(t("co.alert.chooseArea", "Please select a delivery area"));
    if (!form.deliveryAddress.trim())
      return alert(t("co.alert.fullAddr", "Please enter a full address"));

    // Minimum order CA$80 for delivery
    if (subtotal < 80) {
      alert(t("co.alert.min80", "Order minimum is CA$80 for delivery"));
      return;
    }

    const fullAddress = `${form.deliveryArea} ${form.deliveryAddress}`.trim();

    setPlacing(true);
    try {
      const resp = await fetch("/api/wc/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          form: { ...form, address: fullAddress }, // payment 會帶上（即便為空字串）
          shipping_fee: shippingFee,
          tax: taxAmount,
        }),
      });

      const json = await resp.json();
      if (!resp.ok || !json?.ok) {
        const msg =
          json?.detail?.message ||
          json?.message ||
          t("co.alert.noWoo", "No response from WooCommerce");
        return alert(t("co.alert.failed", "Order failed: ") + msg);
      }

      const order = json.order;
      cartStore.clear?.();
      router.push(`/thank-you?id=${order.id}`);
    } catch (e) {
      console.error(e);
      alert(
        t("co.alert.error", "Something went wrong. Please try again later.")
      );
    } finally {
      setPlacing(false);
    }
  }

  return (
    <Layout>
      <main className="min-h-screen py-10 bg-gray-50 pt-[100px]">
        <div className="mx-auto w-[min(1200px,95vw)] grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {/* Contact Information */}
            <section className="mb-8">
              <h3 className="font-semibold text-lg mb-1">
                {t("co.contact", "Contact Information")}
              </h3>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder={t("co.email", "Email")}
                  value={form.email}
                  onChange={onChange("email")}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/10"
                />
              </div>
            </section>

            {/* Recipient */}
            <section className="mb-8">
              <h3 className="font-semibold text-lg mb-1">
                {t("co.recipient", "Recipient")}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <input
                    placeholder={t("co.name", "Name")}
                    value={form.name}
                    onChange={onChange("name")}
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div className="col-span-2">
                  <input
                    placeholder={t("co.phone", "Phone")}
                    value={form.phone}
                    onChange={onChange("phone")}
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div>
                  <input
                    placeholder={t("co.wechatOpt", "WeChat (Optional)")}
                    value={form.wechat}
                    onChange={onChange("wechat")}
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div>
                  <input
                    placeholder={t("co.otherContact", "Other contact info")}
                    value={form.contactOther}
                    onChange={onChange("contactOther")}
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>
            </section>

            {/* Delivery Area */}
            <section className="mb-8">
              <h3 className="font-semibold text-lg mb-1">
                {t("co.deliveryArea", "Delivery Area")}
              </h3>

              <div className="rounded-xl border divide-y overflow-hidden">
                {AREAS.map((a) => (
                  <label
                    key={a.value}
                    className={`flex flex-col sm:flex-row sm:items-center gap-2 p-3 cursor-pointer transition ${
                      form.deliveryArea === a.value
                        ? "bg-yellow-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery-area"
                        checked={form.deliveryArea === a.value}
                        onChange={() =>
                          setForm((v) => ({ ...v, deliveryArea: a.value }))
                        }
                      />
                      <span className="text-[15px] font-medium">{a.label}</span>
                    </div>
                    <div className="ml-auto text-sm text-gray-600">
                      <span>
                        {t("cart.shipping", "Shipping")} CA${a.fee} ·{" "}
                        {t("co.tax", "Tax")} {a.tax}%
                      </span>
                      <span className="block text-xs text-gray-500">
                        {t("co.freeOver", "Free over")} CA${a.freeThreshold}{" "}
                        {t("co.freeShipping", "shipping")}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {form.deliveryArea && (
                <div className="mt-3">
                  <input
                    placeholder={t(
                      "co.addrPlaceholder",
                      "Address (street, number, city, postal code)"
                    )}
                    value={form.deliveryAddress}
                    onChange={onChange("deliveryAddress")}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/10"
                  />
                </div>
              )}
            </section>

            {/* Payment Method + Delivery dates note */}
            <section>
              <h3 className="font-semibold text-lg mb-1">
                {t("co.paymentMethod", "Payment Method")}
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                {t(
                  "co.payHint",
                  "Payment details will be provided by customer service."
                )}
              </p>

              {/* ✅ 新增的動態提示（中英切換） */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-900 px-3 py-2 text-sm">
                {t(
                  "co.deliveryDates",
                  "Delivery dates: expected 10/16–10/17; customer service will contact you to confirm the exact date."
                )}
              </div>
            </section>
          </div>

          {/* Right: summary */}
          <aside className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
            <h3 className="font-semibold text-lg mb-1">
              {t("cart.orderSummary", "Order Summary")}
            </h3>

            {cart.length === 0 ? (
              <p className="text-gray-500">
                {t("cart.noItems", "No items in cart")}
              </p>
            ) : (
              <ul className="divide-y mb-4">
                {cart.map((it) => (
                  <li key={it.id} className="py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={it.img}
                        alt={it.name}
                        width={400}
                        height={400}
                        className="rounded max-w-[110px] border object-contain bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium line-clamp-2">
                          {it.name}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            className="grid h-8 w-8 place-items-center rounded-lg border hover:bg-black/5"
                            onClick={() =>
                              cartStore.setQty(
                                it.id,
                                Math.max(1, (it.qty || 1) - 1)
                              )
                            }
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            className="h-8 w-14 rounded-lg border text-center text-sm"
                            value={it.qty}
                            onChange={(e) =>
                              cartStore.setQty(
                                it.id,
                                Math.max(1, parseInt(e.target.value || "1"))
                              )
                            }
                          />
                          <button
                            className="grid h-8 w-8 place-items-center rounded-lg border hover:bg-black/5"
                            onClick={() =>
                              cartStore.setQty(it.id, (it.qty || 1) + 1)
                            }
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            className="ml-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => cartStore.remove(it.id)}
                          >
                            <Trash2 size={14} />
                            <span>{t("cart.delete", "Delete")}</span>
                          </button>
                        </div>
                      </div>
                      <div className="text-sm font-semibold whitespace-nowrap">
                        CA$
                        {(
                          Number(it.price || 0) * (it.qty || 0)
                        ).toLocaleString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Totals */}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t("cart.subtotal", "Subtotal")}</span>
                <span>CA$ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("cart.shipping", "Shipping")}</span>
                <span>CA$ {shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("co.tax", "Tax")}</span>
                <span>CA$ {taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2">
                <span>{t("cart.total", "Total")}</span>
                <span>CA$ {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              className="mt-6 w-full bg-black text-white py-3 rounded-lg disabled:opacity-60 hover:opacity-90"
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              <span className="leading-tight">
                {placing
                  ? t("co.creating", "Creating order…")
                  : t("co.placeOrder", "Place Order")}
              </span>
            </button>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
