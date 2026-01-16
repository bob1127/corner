// pages/product/[id].jsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";
import Head from "next/head";
import Link from "next/link"; // 新增 Link 用於麵包屑
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

/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

// 去除 HTML 標籤，用於生成 Meta Description
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, "")
    .substring(0, 160)
    .trim();
}

function getActivePeriod(periods = []) {
  if (!Array.isArray(periods) || periods.length === 0) return null;
  const now = Date.now();
  return periods.find((p) => {
    const start = new Date(p.start).getTime();
    const end = new Date(p.end).getTime();
    return now >= start && now <= end;
  });
}

function getNextPeriod(periods = []) {
  if (!Array.isArray(periods) || periods.length === 0) return null;
  const now = Date.now();
  const upcoming = periods
    .filter((p) => new Date(p.start).getTime() > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  return upcoming[0] || null;
}

const formatTimeDisplay = (isoString) => {
  if (!isoString) return "TBA";
  try {
    const date = new Date(isoString);
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Vancouver",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const getPart = (type) => parts.find((p) => p.type === type)?.value;
    return `${getPart("year")}/${getPart("month")}/${getPart("day")} ${getPart(
      "hour"
    )}:${getPart("minute")}`;
  } catch (e) {
    return isoString;
  }
};

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourwebsite.com"; // 確保有預設值

/* =========================================================
   COMPONENTS: Modal & Breadcrumbs
   ========================================================= */

function GroupNoticeModal({ open, onClose, nextPeriod }) {
  // ... (保持原本的 Modal 代碼不變)
  const info = nextPeriod || {
    start: null,
    end: null,
    delivery_zh: "待定 (TBA)",
    delivery_en: "To be announced",
  };

  const timeRange =
    info.start && info.end
      ? `${formatTimeDisplay(info.start)} — ${formatTimeDisplay(info.end)}`
      : "Coming Soon";

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[1000]">
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

              <div className="px-6 py-5 space-y-4">
                <p className="text-[15px] leading-relaxed text-gray-800">
                  很抱歉，本商品僅在<b className="mx-1">「開團期間」</b>
                  開放下單；目前非開團時段。
                </p>
                <p className="text-sm leading-relaxed text-gray-600 mt-1">
                  Sorry! Orders are only accepted during the{" "}
                  <b className="mx-1">group-buy window</b>. It’s currently
                  closed.
                </p>

                <div className="rounded-xl border bg-amber-50/60 px-4 py-3 mt-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    📅 下一次開團時間 (Next Group Buy)
                  </div>
                  <div className="text-sm font-mono text-gray-900">
                    {timeRange}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    (Vancouver Time)
                  </div>
                </div>

                <div className="rounded-xl border bg-white px-4 py-3 mt-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    📦 預計配送說明 / Delivery Info
                  </div>
                  <p className="text-[15px] leading-relaxed text-gray-800">
                    {info.delivery_zh || "確認中..."}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700 italic">
                    {info.delivery_en || "TBA"}
                  </p>
                </div>
              </div>

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

// 麵包屑組件
function Breadcrumbs({ items, prefix }) {
  if (!items || items.length === 0) return null;
  return (
    <nav
      className="text-xs sm:text-sm text-gray-500 mb-4"
      aria-label="Breadcrumb"
    >
      <ol className="list-none p-0 inline-flex flex-wrap gap-2">
        <li className="flex items-center">
          <Link
            href={`${prefix}/`}
            className="hover:text-black hover:underline transition"
          >
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-black hover:underline transition"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">
                {item.label}
              </span>
            )}
            {idx < items.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function ProductDetail({
  initialProduct = null,
  buildLocale = null,
  periods = [],
}) {
  const router = useRouter();
  const t = useT();
  const { id } = router.query;

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
  const [added, setAdded] = useState(null);

  const [activePeriod, setActivePeriod] = useState(null);
  const [nextPeriod, setNextPeriod] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      setActivePeriod(getActivePeriod(periods));
      setNextPeriod(getNextPeriod(periods));
    };
    checkTime();
    const id = setInterval(checkTime, 30 * 1000);
    return () => clearInterval(id);
  }, [periods]);

  const thumbsParam = useMemo(() => {
    return thumbsSwiper && !thumbsSwiper.destroyed
      ? { swiper: thumbsSwiper }
      : undefined;
  }, [thumbsSwiper]);

  useEffect(() => {
    setThumbsSwiper(null);
  }, [router.locale, id]);

  const showAddedToast = useCallback((prod, count = 1) => {
    const payload = {
      id: prod.id,
      name: prod.name,
      name_en: prod.name_en || "",
      name_zh: prod.name_zh || "",
      price: prod.price ?? priceFromStore(prod),
      img: prod.img ?? prod?.images?.[0]?.src ?? "/images/placeholder.png",
      qty: Math.max(1, count),
    };

    cartStore.add(payload, payload.qty);
    setAdded(payload);
  }, []);

  useEffect(() => {
    if (!added) return;
    const tmr = setTimeout(() => setAdded(null), 3000);
    return () => clearTimeout(tmr);
  }, [added]);

  useEffect(() => {
    if (!router.isReady || initialProduct) return;
    let aborted = false;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const pid = router.query.id;
        const headers = { "Accept-Language": router.locale || "en" };

        let res = await fetch(`/api/store/products/${pid}`, { headers });
        let data;
        if (res.ok) {
          data = await res.json();
        } else {
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

  // --- 資料準備 ---
  const imgs = imagesFromProduct(p);
  const price = priceFromStore(p);
  const storageTags = storageTagsFromProduct(p);
  const zh = pickZhName(p) || "";
  const en = p?.name || "";
  const displayName = isCN && zh ? zh : en;
  const prefix = isCN ? "/cn" : "";
  const base = SITE_URL.replace(/\/+$/, "");
  const canonical = SITE_URL ? `${base}${prefix}/product/${p.id}` : undefined;

  // SEO Meta Description (取純文字)
  const metaDesc = p.short_description
    ? stripHtml(p.short_description)
    : stripHtml(p.description);

  // Breadcrumbs Data
  const breadcrumbItems = [
    // 這裡可以根據 p.categories 動態加入分類，這裡僅示例
    ...(p.categories && p.categories.length > 0
      ? [{ label: p.categories[0].name, href: null }]
      : []),
    { label: displayName, href: null },
  ];

  // 加入購物車
  const add = () => {
    if (!activePeriod) {
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

  // --- SEO 結構化資料 (JSON-LD) ---
  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: displayName,
      description: metaDesc,
      sku: p?.sku || String(p.id),
      image: imgs.map((i) => i.src).filter(Boolean),
      brand: {
        "@type": "Brand",
        name: "Zao Jiao", // 你的品牌名稱
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "CAD",
        price: String(price || 0),
        url: canonical,
        availability: p?.is_in_stock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "Zao Jiao",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${base}${prefix}/`,
        },
        // 如果有分類，可以在這裡插入
        {
          "@type": "ListItem",
          position: 2,
          name: displayName,
          item: canonical,
        },
      ],
    },
  ];

  return (
    <Layout>
      <Head>
        <title>{displayName} | Zao Jiao</title>
        <meta name="description" content={metaDesc} />
        {canonical ? <link rel="canonical" href={canonical} /> : null}

        {SITE_URL && (
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
        )}

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={displayName} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={imgs?.[0]?.src} />
        <meta property="product:price:amount" content={price} />
        <meta property="product:price:currency" content="CAD" />
        <meta property="og:site_name" content="Zao Jiao" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={displayName} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={imgs?.[0]?.src} />

        <link rel="preconnect" href="https://i0.wp.com" />
        <link rel="dns-prefetch" href="https://i0.wp.com" />

        {jsonLdData.map((data, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
      </Head>

      <style jsx global>{`
        .product-swiper,
        .product-swiper .swiper-wrapper,
        .product-swiper .swiper-slide {
          height: 100%;
        }
      `}</style>

      <main className="max-w-6xl mx-auto pb-24 pt-[100px] sm:pt-[140px] px-6 sm:px-10">
        {/* 1. 麵包屑導航 */}
        <div className="mb-4">
          <Breadcrumbs items={breadcrumbItems} prefix={prefix} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 左：圖片 */}
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
                    <div className="relative w-full h-full min-h-[320px] rounded overflow-hidden bg-white border border-gray-100">
                      <Image
                        src={image.src}
                        alt={image.alt || displayName}
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
                    <div className="relative w-full aspect-square rounded overflow-hidden cursor-pointer hover:opacity-80 bg-white border border-gray-100">
                      <Image
                        src={image.src}
                        alt={image.alt || `Thumb ${i + 1}`}
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

          {/* 右：資訊 */}
          <div className="flex pl-0 sm:pl-10 items-start pt-0 sm:pt-10">
            <div className="right-info w-full">
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug">
                {displayName}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-medium text-gray-900">
                  CA$ {price.toFixed(2)}
                </div>
                {/* 團購狀態標籤 */}
                {!activePeriod && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md font-medium">
                    {isCN ? "非開團期間" : "Group Buy Closed"}
                  </span>
                )}
                {!p.is_in_stock && (
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                    Sold Out
                  </span>
                )}
              </div>

              {storageTags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {storageTags.map((t, i) => {
                    const isCold = /冷藏/.test(t);
                    const isFrozen = /冷凍/.test(t);
                    const base =
                      "inline-block px-3 py-1.5 rounded text-sm align-middle font-medium tracking-wide";
                    const cls = isFrozen
                      ? "bg-red-50 text-red-700 border border-red-100"
                      : isCold
                      ? "bg-blue-50 text-blue-700 border border-blue-100"
                      : "bg-gray-100 text-gray-700 border border-gray-200";
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
                  className="prose prose-sm text-gray-600 mb-8 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: p.short_description }}
                />
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <div className="flex items-center border border-gray-300 rounded-lg w-max">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-50 text-gray-600"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-medium">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-4 py-2 hover:bg-gray-50 text-gray-600"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={add}
                  disabled={!p.is_in_stock && false} // 若要強制庫存判斷可打開
                  className={`flex-1 px-8 py-3 rounded-lg text-white font-medium transition shadow-sm
                    ${
                      activePeriod
                        ? "bg-black hover:bg-gray-800"
                        : "bg-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {activePeriod
                    ? t("pd.addToCart", "Add to Cart")
                    : isCN
                    ? "目前無法下單"
                    : "Group Buy Closed"}
                </button>
              </div>

              {/* 運送說明小字 (Optional) */}
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-100">
                <p>
                  🚚{" "}
                  {isCN
                    ? "配送範圍：大溫哥華地區"
                    : "Delivery: Greater Vancouver Area"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 詳細描述區塊 */}
        {p.description && (
          <div className="mt-16 border-t pt-10">
            <h2 className="text-xl font-bold mb-6">
              {t("pd.desc", "Description")}
            </h2>
            <div
              className="prose prose-neutral max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: p.description }}
            />
          </div>
        )}

        <section className="mt-20">
          <h3 className="text-xl font-bold mb-6">
            {t("pd.other", "You may also like")}
          </h3>
          <RelatedCarousel
            currentId={p.id}
            categories={p.categories}
            currentFirstImage={
              imagesFromProduct(p)?.[0]?.src || "/images/placeholder.png"
            }
            currentPrice={price}
            activePeriod={activePeriod}
            onQuickAdd={(prod) => {
              if (!activePeriod) {
                setShowGroupModal(true);
                return;
              }
              showAddedToast(prod, 1);
            }}
          />
        </section>
      </main>

      <AddToCartToast
        open={!!added}
        onClose={() => setAdded(null)}
        item={added}
        onGoCart={() => router.push("/checkout")}
        t={t}
      />
      <GroupNoticeModal
        open={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        nextPeriod={nextPeriod}
      />
    </Layout>
  );
}

// ... (保持 RelatedCarousel, AddToCartToast 組件不變)
/* 推薦區 */
function RelatedCarousel({
  currentId,
  categories,
  currentFirstImage,
  currentPrice,
  activePeriod,
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
// ... (保持原本的 getStaticPaths 和 getStaticProps, 這部分邏輯已足夠完善)
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
  let periods = [];

  try {
    const r = await fetch(
      `${ensureURL(base)}/wp-json/wc/store/products/${id}`,
      {
        headers: { Accept: "application/json" },
      }
    );
    const data = await r.json();
    if (!r.ok || !data?.id) throw new Error("Product not found");
    product = data;

    product = await resolveStorageAttributeForSingle(base, product, ck, cs);

    if (ck && cs) {
      const v3 = `${ensureURL(
        base
      )}/wp-json/wc/v3/products/${id}?_fields=id,meta_data,sku`; // 增加獲取 SKU
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
        // 確保 SKU 有被傳入
        if (detail.sku) product.sku = detail.sku;
      }
    }

    try {
      const apiUrl = `${ensureURL(base)}/wp-json/custom/v1/group-buy`;
      const timeRes = await fetch(apiUrl);
      if (timeRes.ok) {
        periods = await timeRes.json();
      }
    } catch (err) {
      console.error("Failed to fetch group-buy settings:", err);
    }
  } catch {
    return { notFound: true, revalidate: 60 };
  }

  return {
    props: {
      initialProduct: product,
      buildLocale: locale ?? null,
      periods,
    },
    revalidate: 300,
  };
}

/* ---- helpers (SSR 用) ---- */
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
