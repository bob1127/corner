// pages/thank-you.jsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "./Layout";
import { useT } from "@/lib/i18n";

const PLACEHOLDER = "https://dummyimage.com/80x80/eeeeee/999999.png&text=%20";

/* --- helpers --- */
const toNum = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const moneyStr = (n, locale) =>
  Number(toNum(n)).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getMetaVal = (order, key) => {
  const md = Array.isArray(order?.meta_data) ? order.meta_data : [];
  const hit = md.find((m) => m?.key === key);
  return hit?.value ?? "";
};

export default function ThankYouPage() {
  const router = useRouter();
  const t = useT();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  // 數字/日期本地化
  const nfLocale = router.locale === "cn" ? "zh-TW" : "en-CA";
  const dfLocale = nfLocale;

  const orderDate = useMemo(() => {
    if (!order?.date_created) return "";
    const d = new Date(order.date_created);
    if (isNaN(d.getTime())) return String(order.date_created);
    return d.toLocaleString(dfLocale);
  }, [order, dfLocale]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const resp = await fetch(`/api/wc/order?id=${id}`);
        const data = await resp.json();
        if (!resp.ok || !data?.id) {
          setError(data?.message || t("ty.error", "Failed to load order"));
        } else {
          setOrder(data);
        }
      } catch (e) {
        setError(String(e?.message || e));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ---------- 訂單金額拆解（相容 fee_lines 與 tax_lines） ---------- */
  const breakdown = useMemo(() => {
    if (!order) return null;

    // 小計：以每項 total 相加（扣除折扣後的商品金額）
    const itemsSubtotal = (order.line_items || []).reduce(
      (sum, li) => sum + toNum(li.total ?? li.subtotal ?? 0),
      0
    );

    // 運費：優先 shipping_total，其次 shipping_lines
    let shippingFee =
      order.shipping_total != null
        ? toNum(order.shipping_total)
        : (order.shipping_lines || []).reduce((s, l) => s + toNum(l.total), 0);

    // 稅金：優先 tax_lines，再退而求其次 fee_lines 名稱包含 Tax，再不行用 meta 或 total_tax
    const taxFromTaxLines = (order.tax_lines || []).reduce(
      (s, tl) => s + toNum(tl.tax_total ?? tl.total),
      0
    );
    const taxFromFeeLines = (order.fee_lines || []).reduce((s, f) => {
      const label = (f?.name || f?.title || "").toString();
      return /tax/i.test(label) ? s + toNum(f.total) : s;
    }, 0);
    let taxAmount =
      taxFromTaxLines > 0
        ? taxFromTaxLines
        : taxFromFeeLines > 0
        ? taxFromFeeLines
        : toNum(getMetaVal(order, "_tax_frontend")) || toNum(order.total_tax);

    // 後備：若 Woo 沒吃到我們的運費，讀 meta
    if (!shippingFee) {
      const metaShip = toNum(getMetaVal(order, "_shipping_fee_frontend"));
      if (metaShip) shippingFee = metaShip;
    }

    const grandTotal = toNum(order.total); // Woo 的最終總額

    return {
      itemsSubtotal,
      shippingFee,
      taxAmount,
      grandTotal,
    };
  }, [order]);

  // 取出地區/地址（我們在 create-order.js 有塞 meta）
  const delivery = useMemo(() => {
    if (!order) return null;
    const area =
      getMetaVal(order, "_delivery_area_label") ||
      order.billing?.city ||
      order.shipping?.city ||
      "";
    const address =
      getMetaVal(order, "_delivery_address_detail") ||
      order.billing?.address_1 ||
      order.shipping?.address_1 ||
      "";
    return { area, address };
  }, [order]);

  return (
    <Layout>
      <div className="bg-[#f5f4f4] pt-20">
        <main className="max-w-5xl mx-auto py-16 px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold mb-2 tracking-wide">
              {t("ty.title", "Thank you for your order!")}
            </h1>
            <p className="text-gray-600">
              {t(
                "ty.subtitle",
                "We’ve received your order and will contact you shortly."
              )}
            </p>
          </div>

          {!id && (
            <p className="text-gray-500 text-center">
              {t("ty.missingId", "Missing order ID")}
            </p>
          )}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {order ? (
            <div className="grid gap-8 md:grid-cols-2 items-start">
              {/* 左欄：訂單資訊 + 收件資訊 */}
              <div className="space-y-8 md:order-1">
                {/* 訂單資訊 */}
                <section className="bg-white rounded-lg p-6">
                  <div className="text-gray-900 rounded-md px-3 py-2 mb-5 font-semibold">
                    {t("ty.orderInfo", "Order Info")}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[15px] leading-relaxed">
                    <p>
                      <span className="text-gray-500">
                        {t("ty.orderNo", "Order No.")}：
                      </span>
                      <span className="font-semibold">
                        #{order.number || order.id}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">
                        {t("ty.orderDate", "Order Date")}：
                      </span>
                      <span className="font-medium">{orderDate}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">
                        {t("ty.payment", "Payment")}：
                      </span>
                      <span className="font-medium">
                        {order.payment_method_title || "—"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">
                        {t("ty.total", "Total")}：
                      </span>
                      <span className="font-bold text-gray-900">
                        CA${moneyStr(order.total, nfLocale)}
                      </span>
                    </p>
                  </div>

                  {/* 金額明細（小計/運費/稅金） */}
                  {breakdown && (
                    <div className="mt-5 border-t pt-4 space-y-2 text-[15px]">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("ty.subtotal", "Subtotal")}
                        </span>
                        <span className="font-medium">
                          CA${moneyStr(breakdown.itemsSubtotal, nfLocale)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("ty.shipping", "Shipping")}
                        </span>
                        <span className="font-medium">
                          {breakdown.shippingFee === 0 ? (
                            <span className="text-emerald-600">
                              {t("ty.freeShipping", "Free")}
                            </span>
                          ) : (
                            <>CA${moneyStr(breakdown.shippingFee, nfLocale)}</>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("ty.tax", "Tax")}
                        </span>
                        <span className="font-medium">
                          CA${moneyStr(breakdown.taxAmount, nfLocale)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-semibold">
                          {t("ty.orderTotal", "Order Total")}
                        </span>
                        <span className="font-extrabold text-lg text-gray-900">
                          CA${moneyStr(breakdown.grandTotal, nfLocale)}
                        </span>
                      </div>
                    </div>
                  )}
                </section>

                {/* 收件資訊 */}
                <section className="bg-white rounded-lg p-6">
                  <div className="text-gray-900 rounded-md px-3 py-2 mb-5 font-semibold">
                    {t("ty.recipientInfo", "Recipient Info")}
                  </div>

                  <div className="space-y-1 text-[15px] leading-relaxed">
                    <p className="font-semibold">
                      {(order.billing?.first_name || "") +
                        " " +
                        (order.billing?.last_name || "")}
                    </p>
                    {/* 地區與地址（優先用我們在 meta 寫入的值） */}
                    {delivery?.area ? (
                      <p className="text-gray-700">
                        {t("ty.deliveryArea", "Delivery Area")}：{delivery.area}
                      </p>
                    ) : null}
                    <p className="text-gray-700">
                      {delivery?.address || order.billing?.address_1 || "—"}
                    </p>
                    <p className="text-gray-700">
                      {order.billing?.phone || "—"}
                    </p>
                    <p className="text-gray-700">
                      {order.billing?.email || "—"}
                    </p>
                  </div>
                </section>
              </div>

              {/* 右欄：商品清單 */}
              <aside className="bg-white rounded-lg p-6 h-full md:order-2 md:sticky md:top-8 md:max-h-[75vh] overflow-auto">
                <div className="text-gray-900 rounded-md px-3 py-2 mb-5 font-semibold">
                  {t("ty.items", "Items")}
                </div>

                {order.line_items?.length ? (
                  <ul className="divide-y">
                    {order.line_items.map((item) => {
                      const imgSrc =
                        item?.image?.src ||
                        item?.image?.thumbnail ||
                        PLACEHOLDER;
                      return (
                        <li key={item.id} className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="shrink-0">
                              <Image
                                src={imgSrc}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="rounded border object-contain w-16 h-16 bg-white"
                                unoptimized
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {t("ty.qty", "Qty")}：{item.quantity}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                CA${moneyStr(item.total, nfLocale)}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500">{t("ty.noItems", "No items")}</p>
                )}
              </aside>
            </div>
          ) : (
            !error && (
              <p className="text-gray-500 text-center">
                {t("ty.loading", "Loading…")}
              </p>
            )
          )}

          {/* 底部提示 */}
          <div className="mt-12 text-center text-gray-600">
            <p>
              {t(
                "ty.contact",
                "If you have any questions, please contact our customer service."
              )}
            </p>
            <p className="mt-2">
              {router.locale === "cn" ? "或回到 " : ""}
              <Link
                href="/"
                locale={router.locale}
                className="text-blue-600 underline"
              >
                {t("ty.backHome", "Home")}
              </Link>{" "}
              {t("ty.viewMore", "to explore more.")}
            </p>
          </div>
        </main>
      </div>
    </Layout>
  );
}
