// pages/thank-you.jsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "./Layout";
import { useT } from "@/lib/i18n";

const PLACEHOLDER = "https://dummyimage.com/80x80/eeeeee/999999.png&text=%20";

export default function ThankYouPage() {
  const router = useRouter();
  const t = useT();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  // locale 對應（數字/日期使用本地化）
  const nfLocale = router.locale === "cn" ? "zh-TW" : "en-CA";
  const dfLocale = nfLocale;

  const money = (n) =>
    Number(n || 0).toLocaleString(nfLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
          setError(data?.message || t("ty.error"));
        } else {
          setOrder(data);
        }
      } catch (e) {
        setError(String(e?.message || e));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Layout>
      <div className="bg-[#f5f4f4] pt-20">
        <main className="max-w-5xl mx-auto py-16 px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold mb-2 tracking-wide">
              {t("ty.title")}
            </h1>
            <p className="text-gray-600">{t("ty.subtitle")}</p>
          </div>

          {!id && (
            <p className="text-gray-500 text-center">{t("ty.missingId")}</p>
          )}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {order ? (
            <div className="grid gap-8 md:grid-cols-2 items-start">
              {/* 左欄：訂單資訊 + 收件資訊 */}
              <div className="space-y-8 md:order-1">
                {/* 訂單資訊 */}
                <section className="bg-white rounded-lg p-6">
                  <div className="text-gray-900 rounded-md px-3 py-2 mb-5 font-semibold">
                    {t("ty.orderInfo")}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[15px] leading-relaxed">
                    <p>
                      <span className="text-gray-500">{t("ty.orderNo")}：</span>
                      <span className="font-semibold">
                        #{order.number || order.id}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">
                        {t("ty.orderDate")}：
                      </span>
                      <span className="font-medium">{orderDate}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">{t("ty.payment")}：</span>
                      <span className="font-medium">
                        {order.payment_method_title || "—"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">{t("ty.total")}：</span>
                      <span className="font-bold text-gray-900">
                        CA${money(order.total)}
                      </span>
                    </p>
                  </div>
                </section>

                {/* 收件資訊（Woo 預設在 billing，也可按你需求改 shipping） */}
                <section className="bg-white rounded-lg p-6">
                  <div className="text-gray-900 rounded-md px-3 py-2 mb-5 font-semibold">
                    {t("ty.recipientInfo")}
                  </div>

                  <div className="space-y-1 text-[15px] leading-relaxed">
                    <p className="font-semibold">
                      {(order.billing?.first_name || "") +
                        " " +
                        (order.billing?.last_name || "")}
                    </p>
                    <p className="text-gray-700">
                      {order.billing?.address_1 || "—"}
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
                  {t("ty.items")}
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
                                {t("ty.qty")}：{item.quantity}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                CA${money(item.total)}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500">{t("ty.noItems")}</p>
                )}

                {/* 總計 */}
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between text-[15px] mb-2">
                    <span className="text-gray-600">{t("ty.orderTotal")}</span>
                    <span className="font-extrabold text-lg text-gray-900">
                      CA${money(order.total)}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            !error && (
              <p className="text-gray-500 text-center">{t("ty.loading")}</p>
            )
          )}

          {/* 底部提示 */}
          <div className="mt-12 text-center text-gray-600">
            <p>{t("ty.contact")}</p>
            <p className="mt-2">
              {router.locale === "cn" ? "或回到 " : ""}
              <Link
                href="/"
                locale={router.locale}
                className="text-blue-600 underline"
              >
                {t("ty.backHome")}
              </Link>{" "}
              {t("ty.viewMore")}
            </p>
          </div>
        </main>
      </div>
    </Layout>
  );
}
