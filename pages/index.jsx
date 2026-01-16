// pages/index.jsx
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cartStore } from "@/lib/cartStore";
import Layout from "./Layout";
import { useT } from "@/lib/i18n";
import { useRouter } from "next/router";

/* =========================================================
   HELPER FUNCTIONS: 時間與排程計算
   ========================================================= */

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

/* =========================================================
   HELPER FUNCTIONS: 產品資料處理
   ========================================================= */

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

const PAGE_SIZE = 15;
function getVisiblePages(current, total) {
  const pages = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3)
    return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

const pickZhName = (p) =>
  p?.extensions?.custom_acf?.zh_product_name || p?.cn_name || "";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

/* =========================================================
   COMPONENT: Group Notice Modal
   ========================================================= */
function GroupNoticeModal({ open, onClose, nextPeriod }) {
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50"
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
                  <h3 className="text-lg font-semibold leading-tight">
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
                  很抱歉，本商品僅在
                  <b className="mx-1">「開團期間」</b>
                  開放下單；目前非開團時段。
                </p>
                <p className="text-sm leading-relaxed text-gray-600 mt-1">
                  Sorry! Orders are only accepted during the
                  <b className="mx-1">group-buy window</b>. It’s currently
                  closed.
                </p>

                <div className="rounded-xl border bg-amber-50/60 px-4 py-3 mt-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    📅 下一次開團時間 (Next Group Buy)
                  </div>
                  <div className="text-sm font-mono text-gray-800">
                    {timeRange}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    (Vancouver Time)
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-amber-100 bg-white px-4 py-3">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    📦 預計配送說明 / Delivery Info
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {info.delivery_zh || "確認中..."}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mt-2 italic">
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

// 判斷是否為啤酒
function isBeerProduct(p) {
  const cats = p?.categories;
  if (!Array.isArray(cats)) return false;
  return cats.some((c) => {
    const slug = String(c?.slug || "").toLowerCase();
    const name = String(c?.name || "").toLowerCase();
    return slug === "beer" || name === "beer";
  });
}

/* =========================================================
   MAIN PAGE COMPONENT
   ========================================================= */
export default function Home({
  initialItems = [],
  buildLocale = null,
  periods = [],
}) {
  const t = useT();
  const router = useRouter();

  const isCN = useMemo(() => {
    const loc = router?.locale || buildLocale || "";
    if (loc && /^(zh|cn)/i.test(loc)) return true;
    const p = router?.asPath || "";
    return p === "/cn" || p.startsWith("/cn/");
  }, [router.locale, router.asPath, buildLocale]);

  const getDisplayName = (p) => {
    const zh = pickZhName(p);
    const en = p?.name || "";
    return isCN && zh ? zh : en;
  };

  const prefix = isCN ? "/cn" : "";

  const CATEGORIES = useMemo(
    () => [
      { name: t("home.cat.all"), slug: "" },
      { name: t("home.cat.snacks"), slug: "snacks" },
      { name: t("home.cat.soups"), slug: "soups" },
      { name: t("home.cat.noodleSoups"), slug: "noodle-soups" },
      { name: t("home.cat.hotPot"), slug: "hot-pot" },
      { name: t("home.cat.friedRice"), slug: "fried-rice" },
      { name: t("home.cat.desserts"), slug: "desserts" },
      { name: t("home.cat.beverages"), slug: "beverages" },
      { name: t("home.cat.ready"), slug: "ready-to-enjoy" },
    ],
    [t]
  );

  // [修改 1] 將 state 命名從 items 改為 allItems，代表所有商品
  // initialItems 已經是 getStaticProps 抓好的「所有非啤酒商品」
  const [allItems, setAllItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [qtyMap, setQtyMap] = useState(
    Object.fromEntries((initialItems || []).map((p) => [p.id, 1]))
  );
  const [toast, setToast] = useState(null);

  /* ---- Group-buy Logic ---- */
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

  const [activeCat, setActiveCat] = useState("");
  const [page, setPage] = useState(1);
  const gridTopRef = useRef(null);

  // 切換分類時重置頁碼
  useEffect(() => {
    setPage(1);
  }, [activeCat]);

  const scrollToGridTop = () => {
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // [修改 2] 移除切換分類時的 API Call，改為頁面載入時確保抓到所有資料
  // 這樣切換 Tab 會瞬間完成，且能解決分類抓不到資料的問題
  useEffect(() => {
    (async () => {
      // 只有當初始資料很少時，才去後端抓「全部商品」
      // 如果 initialItems 已經有資料，這個 Effect 其實可以根據需求省略
      // 但為了保險起見 (getStaticProps 可能只有 100 筆)，這裡還是設計成去抓全部
      if (initialItems.length < 1) {
        try {
          setLoading(true);
          // 這裡不帶 category 參數，直接抓全部 (per_page 設大一點)
          const url = `/api/store/products?per_page=100`;
          const r = await fetch(url);
          const data = await r.json();
          const arr = Array.isArray(data) ? data : [];
          // 再次確保過濾掉啤酒
          const filteredArr = arr.filter((p) => !isBeerProduct(p));

          setAllItems(filteredArr);
          const init = Object.fromEntries(filteredArr.map((p) => [p.id, 1]));
          setQtyMap((prev) => ({ ...prev, ...init }));
        } catch (err) {
          console.error("Fetch items failed", err);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [initialItems]); // 依賴項移除 activeCat

  // [修改 3] 使用 useMemo 前端過濾商品
  const displayedItems = useMemo(() => {
    // 1. 先過濾掉啤酒 (雖然 API/StaticProps 應該已經濾過了，雙重保險)
    let filtered = allItems.filter((p) => !isBeerProduct(p));

    // 2. 根據目前選的 Tab (Category Slug) 進行過濾
    if (activeCat) {
      filtered = filtered.filter((p) => {
        // 檢查該商品的 categories 陣列中是否有符合 activeCat 的 slug
        return (
          Array.isArray(p.categories) &&
          p.categories.some(
            (c) => c.slug === activeCat || c.slug?.includes(activeCat)
          )
        );
      });
    }

    return filtered;
  }, [allItems, activeCat]);

  const setQty = (id, next) =>
    setQtyMap((m) => ({
      ...m,
      [id]: Math.max(0, Number.isFinite(+next) ? +next : 0),
    }));

  const toastTimerRef = useRef(null);
  const showToast = (text) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    const id = Date.now();
    setToast({ id, text });
    toastTimerRef.current = setTimeout(() => setToast(null), 1600);
  };
  useEffect(
    () => () => toastTimerRef.current && clearTimeout(toastTimerRef.current),
    []
  );

  // Add to Cart
  const addToCart = (p) => {
    if (!activePeriod) {
      setShowGroupModal(true);
      return;
    }
    const q = qtyMap[p.id] ?? 0;
    if (q <= 0) return;
    const priceNumber = p?.prices?.price ? Number(p.prices.price) / 100 : 0;
    const img = p?.images?.[0]?.src || "/images/placeholder.png";
    const enName = p?.name || "";
    const zhName = pickZhName(p) || "";
    const displayName = isCN && zhName ? zhName : enName;

    cartStore.add(
      {
        id: p.id,
        name: displayName,
        name_en: enName,
        name_zh: zhName,
        img,
        price: priceNumber,
        sku: p.sku || "",
      },
      q
    );
    showToast(`${t("pd.toast.added")} “${displayName}” (${q}).`);
    setQty(p.id, 0);
  };

  // [修改 4] 分頁計算基於 displayedItems
  const totalPages = Math.max(1, Math.ceil(displayedItems.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageItems = displayedItems.slice(pageStart, pageStart + PAGE_SIZE);

  const goTo = (n) => {
    const next = Math.min(Math.max(1, n), totalPages);
    if (next !== page) {
      setPage(next);
      scrollToGridTop();
    }
  };

  const base = SITE_URL.replace(/\/+$/, "");
  const pathPrefix = isCN ? "/cn" : "";
  const canonical = `${base}${pathPrefix || ""}/`;

  // JSON-LD 只顯示當前過濾後的商品
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: (displayedItems || []).slice(0, 20).map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${base}${pathPrefix}/product/${p.id}`,
      name: getDisplayName(p),
    })),
  };

  return (
    <Layout>
      <Head>
        <title>{isCN ? "商品列表｜中文站" : "Products"}</title>
        {SITE_URL ? <link rel="canonical" href={canonical} /> : null}
        {SITE_URL ? (
          <>
            <link rel="alternate" hrefLang="x-default" href={`${base}/`} />
            <link rel="alternate" hrefLang="en" href={`${base}/`} />
            <link rel="alternate" hrefLang="zh" href={`${base}/cn/`} />
          </>
        ) : null}
        <link rel="preconnect" href="https://i0.wp.com" />
        <link rel="dns-prefetch" href="https://i0.wp.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      </Head>

      <main className="bg-[#f4f1f1] pt-20 sm:pt-0">
        <div className="pointer-events-none fixed inset-0 z-[900] flex items-end justify-center">
          <AnimatePresence mode="wait">
            {toast && (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: -10, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="mb-8 rounded-xl bg-black text-white px-4 py-2 shadow-lg"
              >
                {toast.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <GroupNoticeModal
          open={showGroupModal}
          onClose={() => setShowGroupModal(false)}
          nextPeriod={nextPeriod}
        />

        <section>
          <Image
            src="/images/2025-10-灶腳-IG-灶腳宅配(1920x768px)-定稿01.jpg"
            alt="banner"
            width={1920}
            height={768}
            className="w-full "
            priority
          />
        </section>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="block sm:hidden w-[80%] max-w-[300px]">
            <select
              value={activeCat}
              onChange={(e) => setActiveCat(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:flex justify-center gap-3 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveCat(c.slug)}
                className={`px-5 py-2 rounded-full transition-all duration-500 ${
                  activeCat === c.slug
                    ? "bg-black text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <section className="section-content min-h-screen pb-24">
          <div ref={gridTopRef} />
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              {t("home.loading")}
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              {t("home.noMatch")}
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCat}-${safePage}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="grid max-w-[1600px] mx-auto w-[92%] grid-cols-2
           sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
           gap-2 sm:gap-8 my-12"
                >
                  {pageItems.map((p) => {
                    const q = qtyMap[p.id] ?? 0;
                    const img =
                      p?.images?.[0]?.src || "/images/placeholder.png";
                    const price = p?.prices?.price
                      ? Number(p.prices.price) / 100
                      : null;

                    const regularPrice = p?.prices?.regular_price
                      ? Number(p.prices.regular_price) / 100
                      : null;

                    const hasDiscount =
                      regularPrice !== null &&
                      price !== null &&
                      regularPrice > price;

                    const tags = storageTagsFromProduct(p);
                    const displayName = getDisplayName(p);

                    return (
                      <div
                        key={p.id}
                        className="item relative flex flex-col justify-center items-center group bg-white p-4 border border-gray-100 hover:shadow-md transition"
                      >
                        <Link
                          href={`${prefix}/product/${p.id}`}
                          aria-label={`${displayName} details`}
                          className="absolute inset-0 z-20"
                        />

                        <div className="relative z-10 w-full flex flex-col items-center">
                          <div className="w-full aspect-[4/3] relative overflow-hidden bg-white">
                            <Image
                              src={img}
                              alt={displayName}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                              className="object-contain p-2 transition-transform group-hover:scale-[1.05]"
                              loading="lazy"
                            />
                          </div>

                          <div className="item-info mt-3 text-center">
                            <b className="line-clamp-2">{displayName}</b>
                            {price !== null && (
                              <div className="mt-1 text-sm text-gray-600 flex flex-col items-center justify-center">
                                {hasDiscount && (
                                  <span className="text-xs text-gray-400 line-through">
                                    CA$ {regularPrice.toFixed(2)}
                                  </span>
                                )}
                                <span className="font-semibold text-gray-800">
                                  CA$ {price.toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>

                          {tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap justify-center gap-2">
                              {tags.map((tLabel, i) => {
                                const isCold = /冷藏/.test(tLabel);
                                const isFrozen = /冷凍/.test(tLabel);
                                const base =
                                  "inline-block px-3 py-1 rounded text-xs";
                                const cls = isFrozen
                                  ? "bg-red-100 text-red-800"
                                  : isCold
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800";
                                return (
                                  <span key={i} className={`${base} ${cls}`}>
                                    {tLabel}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div
                          className="relative z-30 mt-4 flex flex-col items-center gap-3"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setQty(p.id, q - 1)}
                              className="rounded-xl border px-3 py-1"
                              disabled={q <= 0}
                            >
                              −
                            </button>

                            <input
                              type="number"
                              min={0}
                              value={q}
                              onChange={(e) =>
                                setQty(
                                  p.id,
                                  Math.max(
                                    0,
                                    parseInt(e.target.value || "0", 10)
                                  )
                                )
                              }
                              className="w-16 rounded-xl border px-2 py-1 text-center no-spin"
                            />

                            <button
                              onClick={() => setQty(p.id, q + 1)}
                              className="rounded-xl border px-3 py-1"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p);
                            }}
                            className={`rounded-xl px-4 py-2 text-white ${
                              (qtyMap[p.id] ?? 0) > 0
                                ? "bg-[#ca9121] hover:opacity-90"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                            disabled={(qtyMap[p.id] ?? 0) <= 0}
                          >
                            {t("prod.addToCart")}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {totalPages > 1 && (
                <nav
                  aria-label="Products pagination"
                  className="mx-auto w-[92%] max-w-[1600px] flex items-center justify-center gap-2 flex-wrap"
                >
                  <button
                    onClick={() => goTo(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    {t("home.prev")}
                  </button>

                  {getVisiblePages(safePage, totalPages).map((pNum, i) =>
                    pNum === "…" ? (
                      <span key={`e-${i}`} className="px-2 text-gray-500">
                        …
                      </span>
                    ) : (
                      <button
                        key={pNum}
                        onClick={() => goTo(pNum)}
                        className={`min-w-9 px-3 py-2 rounded-lg border text-sm hover:bg-gray-50 ${
                          pNum === safePage
                            ? "bg-black text-white border-black"
                            : ""
                        }`}
                        aria-current={pNum === safePage ? "page" : undefined}
                      >
                        {pNum}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => goTo(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    {t("home.next")}
                  </button>
                </nav>
              )}
            </>
          )}
        </section>

        <style jsx global>{`
          input[type="number"].no-spin::-webkit-outer-spin-button,
          input[type="number"].no-spin::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"].no-spin {
            -moz-appearance: textfield;
          }
        `}</style>
      </main>
    </Layout>
  );
}

// getStaticProps 保持原樣 (除了確保啤酒過濾)
export async function getStaticProps({ locale }) {
  const base = process.env.WC_URL;
  const ck = process.env.WC_CK;
  const cs = process.env.WC_CS;

  let initialItems = [];
  let periods = [];

  try {
    const storeURL = new URL(`${ensureURL(base)}/wp-json/wc/store/products`);
    storeURL.searchParams.set("per_page", "100");
    const r = await fetch(storeURL.toString(), {
      headers: { Accept: "application/json" },
    });
    const rawList = (await r.json()) || [];
    // [重點] Server Side 先過濾掉啤酒
    const list = Array.isArray(rawList)
      ? rawList.filter((p) => !isBeerProduct(p))
      : [];
    const ids = Array.isArray(list)
      ? list
          .map((p) => p.id)
          .filter(Boolean)
          .slice(0, 100)
      : [];

    let metaMap = new Map();
    if (ids.length && ck && cs) {
      const v3 = new URL(`${ensureURL(base)}/wp-json/wc/v3/products`);
      v3.searchParams.set("include", ids.join(","));
      v3.searchParams.set("per_page", String(ids.length));
      v3.searchParams.set("_fields", "id,meta_data");
      const vr = await fetch(v3.toString(), {
        headers: {
          Accept: "application/json",
          Authorization: basicAuth(ck, cs),
        },
      });
      if (vr.ok) {
        const v3data = await vr.json();
        for (const it of Array.isArray(v3data) ? v3data : []) {
          metaMap.set(it.id, it.meta_data || []);
        }
      }
    }

    initialItems = Array.isArray(list)
      ? list.map((p) => {
          const meta = metaMap.get(p.id) || [];
          const cn = pickCnName(meta);
          if (!p.extensions) p.extensions = {};
          if (!p.extensions.custom_acf) p.extensions.custom_acf = {};
          p.extensions.custom_acf.cn_name = cn;
          p.extensions.custom_acf.zh_product_name = cn;
          return p;
        })
      : [];

    try {
      const apiUrl = `${ensureURL(base)}/wp-json/custom/v1/group-buy`;
      const timeRes = await fetch(apiUrl);
      if (timeRes.ok) {
        periods = await timeRes.json();
      }
    } catch (err) {
      console.error("Failed to fetch group-buy settings:", err);
    }
  } catch (e) {
    console.error("getStaticProps error:", e);
  }

  return {
    props: {
      initialItems,
      buildLocale: locale ?? null,
      periods,
    },
    revalidate: 300,
  };
}

function ensureURL(u = "") {
  return String(u).replace(/\/+$/, "");
}
function basicAuth(ck, cs) {
  return "Basic " + Buffer.from(`${ck}:${cs}`).toString("base64");
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
