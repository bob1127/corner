// pages/thank-you.jsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Layout from "./Layout";

const PLACEHOLDER = "https://dummyimage.com/80x80/eeeeee/999999.png&text=%20"; // 後備縮圖

export default function ThankYouPage() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const resp = await fetch(`/api/wc/order?id=${id}`);
        const data = await resp.json();
        if (!resp.ok || !data?.id) {
          setError(data?.message || "讀取訂單失敗");
        } else {
          setOrder(data);
        }
      } catch (e) {
        setError(String(e));
      }
    })();
  }, [id]);

  return (
    <Layout>
      <div className="bg-[#f5f4f4] pt-20">
        <main className="max-w-5xl mx-auto py-16 px-6 ">
          {/* 頁面抬頭 */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold mb-2 tracking-wide">
              感謝您的訂購！
            </h1>
            <p className="text-gray-600">
              我們已收到您的訂單，將盡快為您處理。
            </p>
          </div>

          {!id && <p className="text-gray-500 text-center">缺少訂單編號</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {order ? (
            // 主要內容：左右兩欄（右邊是商品清單）
            <div className="grid gap-8 md:grid-cols-2 items-start">
              {/* 左欄：訂單資訊 + 收件資訊 */}
              <div className="space-y-8 md:order-1">
                <section className="bg-white  rounded-lg p-6">
                  <div className=" text-gray-900 rounded-md px-3 py-2 mb-5 font-semibold">
                    訂單資訊
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[15px] leading-relaxed">
                    <p>
                      <span className="text-gray-500">訂單編號：</span>
                      <span className="font-semibold">
                        #{order.number || order.id}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">下單日期：</span>
                      <span className="font-medium">{order.date_created}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">付款方式：</span>
                      <span className="font-medium">
                        {order.payment_method_title}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">總金額：</span>
                      <span className="font-bold text-gray-900">
                        CA${order.total}
                      </span>
                    </p>
                  </div>
                </section>

                <section className="bg-white  rounded-lg p-6">
                  <div className=" text-gray-900 rounded-md px-3 py-2 mb-5 font-semibold">
                    收件資訊
                  </div>

                  <div className="space-y-1 text-[15px] leading-relaxed">
                    <p className="font-semibold">
                      {order.billing.first_name} {order.billing.last_name}
                    </p>
                    <p className="text-gray-700">{order.billing.address_1}</p>
                    <p className="text-gray-700">{order.billing.phone}</p>
                    <p className="text-gray-700">{order.billing.email}</p>
                  </div>
                </section>
              </div>

              {/* 右欄：商品清單（sticky、可滾動，外觀與左欄切齊） */}
              <aside className="bg-white  rounded-lg p-6 h-full md:order-2 md:sticky md:top-8 md:max-h-[75vh] overflow-auto">
                <div className=" text-gray-900 rounded-md px-3 py-2 mb-5 font-semibold">
                  商品清單
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
                                數量：{item.quantity}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                CA${item.total}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500">無商品資料</p>
                )}

                {/* 總計區塊 */}
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between text-[15px] mb-2">
                    <span className="text-gray-600">訂單總計</span>
                    <span className="font-extrabold text-lg text-gray-900">
                      CA${order.total}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            !error && <p className="text-gray-500 text-center">讀取中…</p>
          )}

          {/* 底部提示 */}
          <div className="mt-12 text-center text-gray-600">
            <p>若有任何問題，請隨時聯絡我們的客服。</p>
            <p className="mt-2">
              或回到{" "}
              <a href="/" className="text-blue-600 underline">
                首頁
              </a>{" "}
              瀏覽更多商品。
            </p>
          </div>
        </main>
      </div>
    </Layout>
  );
}
