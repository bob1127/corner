// pages/product/[id].jsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";
import Head from "next/head";
import Layout from "../Layout";
import { cartStore } from "@/lib/cartStore";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import Image from "next/image";
import HotProductsCarousel from "@/components/HotProductsCarousel";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";

/* ========= 開團時間（America/Vancouver） =========
   開始：2025-10-29 00:00（PDT, -07:00）
   結束：2025-11-04 23:59:59.999（PST, -08:00；已考量 11/02 切換） */
const GROUP_START_ISO = "2025-11-22T00:00:00-08:00";
const GROUP_END_ISO = "2025-11-26T01:00:00-08:00";
const GROUP_START_TS = new Date(GROUP_START_ISO).getTime();
const GROUP_END_TS = new Date(GROUP_END_ISO).getTime();
function isGroupActive(nowTs = Date.now()) {
  return nowTs >= GROUP_START_TS && nowTs <= GROUP_END_TS;
}

/* ---------- helpers ---------- */
const priceFromStore = (p) =>
  p?.prices?.price ? Number(p.prices.price) / 100 : 0;

const imagesFromProduct = (p) =>
  Array.isArray(p?.images) && p.images.length
    ? p.images
    : [{ src: "/images/placeholder.png", alt: p?.name || "product" }];

const storageTagsFromProduct = (p) => {
  if (!p || !Array.isArray(p.attributes)) return [];
  const attr = p.attributes.find((a) => {
    const slug = String(a?.slug || "").toLowerCase();
    const tax = String(a?.taxonomy || "").toLowerCase();
    const name = String(a?.name || "").toLowerCase();
    return (
      name.includes("保存方式") ||
      slug === "storage" ||
      slug === "pa_storage" ||
      tax === "pa_storage"
    );
  });
  if (!attr) return [];
  if (Array.isArray(attr.terms) && attr.terms.length > 0) {
    return attr.terms.map((t) => t.name).filter(Boolean);
  }
  if (Array.isArray(attr.options) && attr.options.length > 0) {
    return attr.options.map((s) => String(s).trim()).filter(Boolean);
  }
  return [];
};

const pickZhName = (p) =>
  p?.extensions?.custom_acf?.zh_product_name || p?.cn_name || "";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

/* ========= 置中 & bg-black/50 的雙語 Popup ========= */
function GroupNoticeModal({ open, onClose }) {
  // 供顯示用的簡潔時間字串（固定文案：溫哥華時間 10/29–11/04 11:59pm）
  // 仍保留程式化格式在小字行，避免未來調整常數時漏改文案。
  const startCn = new Date(GROUP_START_TS).toLocaleString("zh-TW", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const endCn = new Date(GROUP_END_TS).toLocaleString("zh-TW", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const startEn = new Date(GROUP_START_TS).toLocaleString("en-CA", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const endEn = new Date(GROUP_END_TS).toLocaleString("en-CA", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[1000]">
          {/* 背景遮罩 */}
          <motion.div
            key="backdrop"
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          {/* 置中容器 */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="group-notice-title"
              className="relative w-[min(560px,95vw)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b px-6 py-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-100 text-amber-700">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 9v4m0 4h.01M4.93 19h14.14a2 2 0 0 0 1.73-3l-7.07-12a2 2 0 0 0-3.46 0l-7.07 12a2 2 0 0 0 1.73 3Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    id="group-notice-title"
                    className="text-lg font-semibold leading-tight"
                  >
                    目前無法下單（Group-Buy Closed）
                  </h3>
                  <p className="text-xs text-gray-600">
                    請等待下一次開團（Please wait for the next group-buy
                    window）
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                {/* 開團時間（更新為 10/29–11/04 11:59pm，America/Vancouver） */}
                <div className="rounded-xl border bg-amber-50/60 px-4 py-3">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    本次開團時間（America/Vancouver）
                  </div>
                  <div className="text-sm font-mono text-gray-900">
                    11/22 00:00 — 11/26 01:00am
                  </div>

                  <div className="mt-1 text-xs text-gray-600">
                    {startCn} — {endCn}（zh） / {startEn} — {endEn}（en）
                  </div>
                </div>

                {/* 配送時間說明（依需求替換） */}
                <div className="rounded-xl border bg-white px-4 py-3">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    配送時間說明
                  </div>
                  <p className="text-[15px] leading-relaxed text-gray-800">
                    本次配送將於 <b>11/06（四）</b> 與 <b>11/07（五）</b> 中午
                    12:00 起依區域陸續進行。
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    註記：訂單成立後，我們的客服人員會主動與您聯繫，確認您的地區與確切配送日期，讓您能安心等候收貨。
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-3 border-t px-6 py-4">
                <button
                  onClick={onClose}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  知道了 / Got it
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export default function ProductDetail({
  initialProduct = null,
  buildLocale = null,
}) {
  const router = useRouter();
  const t = useT();
  const { id } = router.query;

  // 是否中文站
  const isCN = useMemo(() => {
    const loc = router?.locale || buildLocale || "";
    if (loc && /^(zh|cn)/i.test(loc)) return true;
    const path = router?.asPath || "";
    return path === "/cn" || path.startsWith("/cn/");
  }, [router.locale, router.asPath, buildLocale]);

  const [p, setP] = useState(initialProduct);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(!initialProduct);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // 加入購物車 Toast 狀態
  const [added, setAdded] = useState(null); // { id, name, img, price, qty }

  // Group-buy 限制 & Modal
  const [groupActive, setGroupActive] = useState(isGroupActive());
  const [showGroupModal, setShowGroupModal] = useState(false);

  // 定時刷新 groupActive（避免長時間停留頁面）
  useEffect(() => {
    const update = () => setGroupActive(isGroupActive());
    update();
    const id = setInterval(update, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  // ====== 安全傳遞 thumbs（避免 destroyed 狀態觸發錯誤）======
  const thumbsParam = useMemo(() => {
    return thumbsSwiper && !thumbsSwiper.destroyed
      ? { swiper: thumbsSwiper }
      : undefined;
  }, [thumbsSwiper]);

  // 語系或商品變動時，清空舊的 thumbs 參考
  useEffect(() => {
    setThumbsSwiper(null);
  }, [router.locale, id]);

  // ✅ 加入購物車 + 顯示自訂彈窗（同時存中英文名稱）
  const showAddedToast = useCallback((prod, count = 1) => {
    const payload = {
      id: prod.id,
      name: prod.name, // 依當前語系顯示名
      name_en: prod.name_en || "", // 也存英文
      name_zh: prod.name_zh || "", // 也存中文
      price: prod.price ?? priceFromStore(prod),
      img: prod.img ?? prod?.images?.[0]?.src ?? "/images/placeholder.png",
      qty: Math.max(1, count),
    };

    cartStore.add(
      {
        id: payload.id,
        name: payload.name,
        name_en: payload.name_en,
        name_zh: payload.name_zh,
        img: payload.img,
        price: payload.price,
      },
      payload.qty
    );

    setAdded(payload);
  }, []);

  // 自動關閉彈窗
  useEffect(() => {
    if (!added) return;
    const tmr = setTimeout(() => setAdded(null), 3000);
    return () => clearTimeout(tmr);
  }, [added]);

  // 取單品（若有 SSR 初始資料就不再抓）
  useEffect(() => {
    if (!router.isReady || initialProduct) return;
    let aborted = false;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const pid = router.query.id;
        const headers = { "Accept-Language": router.locale || "en" };

        // 1) /api/store/products/:id
        let res = await fetch(`/api/store/products/${pid}`, { headers });
        let data;
        if (res.ok) {
          data = await res.json();
        } else {
          // 2) /api/store/products?id=:id
          const res2 = await fetch(`/api/store/products?id=${pid}`, {
            headers,
          });
          if (!res2.ok) throw new Error(`HTTP ${res.status}`);
          data = await res2.json();
        }

        const prod = Array.isArray(data)
          ? data[0]
          : data?.data && !data?.id
          ? data.data
          : data;

        if (!prod?.id) throw new Error("Invalid product payload");

        if (!aborted) setP(prod);
      } catch (e) {
        if (!aborted) setErr(String(e?.message || e));
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [router.isReady, router.query.id, router.locale, initialProduct]);

  if (err) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto py-16 px-4 text-red-600">{err}</div>
      </Layout>
    );
  }
  if (loading || !p) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto py-16 px-4 text-gray-500">
          {t("pd.loading", "Loading…")}
        </div>
      </Layout>
    );
  }

  const imgs = imagesFromProduct(p);
  const price = priceFromStore(p);
  const storageTags = storageTagsFromProduct(p);

  const zh = pickZhName(p) || "";
  const en = p?.name || "";
  const displayName = isCN && zh ? zh : en;
  const prefix = isCN ? "/cn" : "";

  // ✅ 主商品加入購物車：非開團期間 → 彈窗；文案不變
  const add = () => {
    if (!groupActive) {
      setShowGroupModal(true);
      return;
    }
    showAddedToast(
      {
        id: p.id,
        name: displayName,
        name_en: en,
        name_zh: zh,
        img: imgs?.[0]?.src,
        price,
      },
      qty
    );
  };

  // ====== SEO：canonical / hreflang / Product JSON-LD ======
  const base = SITE_URL.replace(/\/+$/, "");
  const canonical = SITE_URL ? `${base}${prefix}/product/${p.id}` : undefined;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayName,
    sku: p?.sku || undefined,
    image: imgs.map((i) => i.src).filter(Boolean),
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: String(price || 0),
      availability: p?.is_in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: canonical,
    },
  };

  return (
    <Layout>
      <Head>
        <title>{displayName}</title>
        {canonical ? <link rel="canonical" href={canonical} /> : null}
        {SITE_URL ? (
          <>
            <link
              rel="alternate"
              hrefLang="x-default"
              href={`${base}/product/${p.id}`}
            />
            <link
              rel="alternate"
              hrefLang="en"
              href={`${base}/product/${p.id}`}
            />
            <link
              rel="alternate"
              hrefLang="zh"
              href={`${base}/cn/product/${p.id}`}
            />
          </>
        ) : null}
        <link rel="preconnect" href="https://i0.wp.com" />
        <link rel="dns-prefetch" href="https://i0.wp.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      </Head>

      {/* 修正 Swiper 高度 */}
      <style jsx global>{`
        .product-swiper,
        .product-swiper .swiper-wrapper,
        .product-swiper .swiper-slide {
          height: 100%;
        }
      `}</style>

      <main className="max-w-6xl mx-auto  pb-24 pt-[140px] px-8 sm:px-10">
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-10">
          {/* 左：主圖 + 縮圖 */}
          <div
            className="w-full flex flex-col items-center gap-4"
            key={`${router.locale}-${p.id}`}
          >
            <div className="w-full max-w-[520px] aspect-[4/4] relative">
              <Swiper
                loop
                navigation
                thumbs={thumbsParam}
                modules={[FreeMode, Navigation, Thumbs]}
                className="product-swiper w-full h-full"
                style={{ height: "100%" }}
              >
                {imgs.map((image, i) => (
                  <SwiperSlide key={`main-${i}`} className="!h-full">
                    <div className="relative w-full h-full min-h-[320px] rounded overflow-hidden bg-white">
                      <Image
                        src={image.src}
                        alt={image.alt || `Product Image ${i + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width:768px) 100vw, 520px"
                        priority={i === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="w-full max-w-[520px]">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                watchSlidesProgress
                modules={[FreeMode, Thumbs]}
                className="w-full"
                breakpoints={{
                  480: { slidesPerView: 5 },
                  768: { slidesPerView: 6 },
                }}
              >
                {imgs.map((image, i) => (
                  <SwiperSlide key={`thumb-${i}`}>
                    <div className="relative w-full aspect-square rounded overflow-hidden cursor-pointer hover:opacity-80 bg-white">
                      <Image
                        src={image.src}
                        alt={image.alt || `Thumbnail ${i + 1}`}
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* 右：內容（顯示 displayName） */}
          <div className="flex pl-0 sm:pl-10 items-start pt-0 sm:pt-20">
            <div className="right-info w-full">
              <h1 className="text-2xl font-bold mb-2">{displayName}</h1>
              <div className="text-xl mb-2">CA$ {price}</div>

              {/* 保存方式 */}
              {storageTags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {storageTags.map((t, i) => {
                    const isCold = /冷藏/.test(t);
                    const isFrozen = /冷凍/.test(t);
                    const base =
                      "inline-block px-3 py-1 rounded text-sm align-middle";
                    const cls = isFrozen
                      ? "bg-red-100 text-red-800"
                      : isCold
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800";
                    return (
                      <span key={i} className={`${base} ${cls}`}>
                        {t}
                      </span>
                    );
                  })}
                </div>
              )}

              {p.short_description && (
                <div
                  className="prose prose-sm text-gray-700 mb-6"
                  dangerouslySetInnerHTML={{ __html: p.short_description }}
                />
              )}

              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="border rounded px-3 py-1"
                >
                  -
                </button>
                <span>{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="border rounded px-3 py-1"
                >
                  +
                </button>
              </div>

              <button
                onClick={add}
                className="px-6 py-3 bg-black text-white rounded hover:opacity-90 transition"
              >
                {t("pd.addToCart", "Add to Cart")}
              </button>
            </div>
          </div>
        </div>

        {/* 詳細介紹 */}
        {p.description && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-2">
              {t("pd.desc", "Description")}
            </h2>
            <div
              className="prose prose-sm text-gray-800"
              dangerouslySetInnerHTML={{ __html: p.description }}
            />
          </div>
        )}

        {/* 推薦產品（也受開團限制） */}
        <section className="mt-16">
          <h3 className="text-xl font-bold mb-4">
            {t("pd.other", "You may also like")}
          </h3>
          <RelatedCarousel
            currentId={p.id}
            categories={p.categories}
            currentFirstImage={
              imagesFromProduct(p)?.[0]?.src || "/images/placeholder.png"
            }
            currentPrice={price}
            onQuickAdd={(prod) => {
              if (!groupActive) {
                setShowGroupModal(true);
                return;
              }
              // 同父層一致：加入購物車 + toast
              showAddedToast(prod, 1);
            }}
          />
        </section>
      </main>

      {/* 加入購物車彈出匡 */}
      <AddToCartToast
        open={!!added}
        onClose={() => setAdded(null)}
        item={added}
        onGoCart={() => router.push("/checkout")}
        t={t}
      />

      {/* 團購限制提示 Modal */}
      <GroupNoticeModal
        open={showGroupModal}
        onClose={() => setShowGroupModal(false)}
      />
    </Layout>
  );
}

/* 推薦區（不直接 add，只回傳 payload 給父層） */
function RelatedCarousel({
  currentId,
  categories,
  currentFirstImage,
  currentPrice,
  onQuickAdd,
}) {
  const t = useT();
  return (
    <HotProductsCarousel
      fetchFromWoo
      perPage={12}
      excludeId={currentId}
      categoryIds={(categories || []).map((c) => c.id)}
      fallbackItem={{
        id: currentId,
        name: t("pd.thisProduct", "This Product"),
        img: currentFirstImage,
        price: currentPrice,
      }}
      onAdd={(prod) => {
        const payload = {
          id: prod.id,
          name: prod.name,
          name_en: prod.name_en || "",
          name_zh: prod.name_zh || "",
          img: prod.img,
          price: prod.price,
        };
        onQuickAdd?.(payload);
      }}
    />
  );
}

/* 加入購物車 Toast */
function AddToCartToast({ open, onClose, item, onGoCart, t }) {
  const visible = !!open && !!item;

  useEffect(() => {
    if (!visible) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.button
            aria-label={t("pd.toast.close", "Close")}
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed z-50 right-1/2 -translate-x-1/2 bottom-4 w-[92vw] ml-4 sm:w-[560px]"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden">
              <div className="p-3 sm:p-4 flex items-center gap-3">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  {item?.img && (
                    <Image
                      src={item.img}
                      alt={item?.name || "product"}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">
                    {t("pd.toast.added", "Added to cart:")} {item?.name}
                  </p>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {t("pd.toast.qty", "Qty")} × {item?.qty} | CA${item?.price}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-3 py-2 text-sm rounded-lg hover:bg-stone-100"
                >
                  {t("pd.toast.close", "Close")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- SSG + ISR ---------------- */
export async function getStaticPaths() {
  const base = process.env.WC_URL;
  let paths = [];
  try {
    const url = new URL(`${ensureURL(base)}/wp-json/wc/store/products`);
    url.searchParams.set("per_page", "100");
    const r = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
    const arr = await r.json();
    if (Array.isArray(arr)) {
      paths = arr.map((p) => ({ params: { id: String(p.id) } }));
    }
  } catch {}
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params, locale }) {
  const base = process.env.WC_URL;
  const ck = process.env.WC_CK;
  const cs = process.env.WC_CS;

  const id = params?.id;
  if (!id) return { notFound: true };

  let product = null;
  try {
    // ① Store API 取單品
    const r = await fetch(
      `${ensureURL(base)}/wp-json/wc/store/products/${id}`,
      {
        headers: { Accept: "application/json" },
      }
    );
    const data = await r.json();
    if (!r.ok || !data?.id) throw new Error("Product not found");
    product = data;

    // ② 解析保存方式 terms 名稱（若 options 是 ID）
    product = await resolveStorageAttributeForSingle(base, product, ck, cs);

    // ③ 追加 v3 meta_data → 併入 zh 名
    if (ck && cs) {
      const v3 = `${ensureURL(
        base
      )}/wp-json/wc/v3/products/${id}?_fields=id,meta_data`;
      const vr = await fetch(v3, {
        headers: {
          Accept: "application/json",
          Authorization: basicAuth(ck, cs),
        },
      });
      if (vr.ok) {
        const detail = await vr.json();
        const cn = pickCnName(detail?.meta_data || []);
        if (!product.extensions) product.extensions = {};
        if (!product.extensions.custom_acf) product.extensions.custom_acf = {};
        product.extensions.custom_acf.cn_name = cn;
        product.extensions.custom_acf.zh_product_name = cn;
      }
    }
  } catch {
    return { notFound: true, revalidate: 60 };
  }

  return {
    props: { initialProduct: product, buildLocale: locale ?? null },
    revalidate: 300,
  };
}

/* ---- helpers (SSR 用；與你的 API 同邏輯) ---- */
function ensureURL(u = "") {
  return String(u).replace(/\/+$/, "");
}
function basicAuth(ck, cs) {
  return "Basic " + Buffer.from(`${ck}:${cs}`).toString("base64");
}
async function resolveStorageAttributeForSingle(base, product, ck, cs) {
  const found = getStorageRawOptions(product);
  if (!found) return product;
  const { attr, raw } = found;

  const ids = raw
    .map((v) => (typeof v === "number" ? v : parseInt(v)))
    .filter((v) => Number.isInteger(v));

  if (ids.length === 0 || !ck || !cs) return product;

  try {
    const attrsRes = await fetch(
      `${ensureURL(base)}/wp-json/wc/v3/products/attributes?per_page=100`,
      {
        headers: {
          Accept: "application/json",
          Authorization: basicAuth(ck, cs),
        },
      }
    );
    if (!attrsRes.ok) return product;

    const attrs = await attrsRes.json();
    const storageDef = attrs.find((a) =>
      String(a.slug || "")
        .toLowerCase()
        .includes("storage")
    );
    if (!storageDef) return product;

    const termsRes = await fetch(
      `${ensureURL(base)}/wp-json/wc/v3/products/attributes/${
        storageDef.id
      }/terms?include=${ids.join(",")}&per_page=100`,
      {
        headers: {
          Accept: "application/json",
          Authorization: basicAuth(ck, cs),
        },
      }
    );
    if (!termsRes.ok) return product;

    const terms = await termsRes.json();
    const mapIdToName = new Map(terms.map((t) => [t.id, t.name]));
    const names = ids.map((id) => mapIdToName.get(id)).filter(Boolean);
    if (names.length) attr.options = names;
  } catch {}
  return product;
}
function getStorageRawOptions(product) {
  const attrs = Array.isArray(product?.attributes) ? product.attributes : [];
  const storageAttr = attrs.find((a) => {
    const name = String(a?.name || "").toLowerCase();
    const slug = String(a?.slug || "").toLowerCase();
    const tax = String(a?.taxonomy || "").toLowerCase();
    return (
      name.includes("保存方式") ||
      slug === "storage" ||
      slug === "pa_storage" ||
      tax === "pa_storage"
    );
  });
  if (!storageAttr) return null;

  if (Array.isArray(storageAttr.terms) && storageAttr.terms.length > 0) {
    return {
      attr: storageAttr,
      raw: storageAttr.terms.map((t) => t?.id || t?.name),
    };
  }
  if (Array.isArray(storageAttr.options) && storageAttr.options.length > 0) {
    return { attr: storageAttr, raw: storageAttr.options.slice() };
  }
  return { attr: storageAttr, raw: [] };
}
function pickCnName(meta = []) {
  const keys = [
    "zh_product_name",
    "cn_name",
    "zh_name",
    "chinese_name",
    "cn_product_name",
    "中文產品名稱",
  ];
  for (const k of keys) {
    const row = meta.find((m) => m?.key === k && m?.value);
    if (row?.value) return String(row.value);
  }
  return "";
}
