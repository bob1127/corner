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

/* ---- Read storage method tags from product attributes ---- */
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

/* ---- Pagination constants ---- */
const PAGE_SIZE = 15;

/* Generate compact pagination (with ellipsis) */
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

/** 從擴充欄位/中英欄位挑選中文名 */
const pickZhName = (p) =>
  p?.extensions?.custom_acf?.zh_product_name || p?.cn_name || "";

/** 站台絕對網址（給 canonical/hreflang 用） */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export default function Home({ initialItems = [], buildLocale = null }) {
  const t = useT();
  const router = useRouter();

  // 是否在中文站 (/cn 或 locale 為 zh/cn)
  const isCN = useMemo(() => {
    const loc = router?.locale || buildLocale || "";
    if (loc && /^(zh|cn)/i.test(loc)) return true;
    const p = router?.asPath || "";
    return p === "/cn" || p.startsWith("/cn/");
  }, [router.locale, router.asPath, buildLocale]);

  // 依語系取得顯示名稱
  const getDisplayName = (p) => {
    const zh = pickZhName(p);
    const en = p?.name || "";
    return isCN && zh ? zh : en;
  };

  // 語系前綴（若有中文子路徑）
  const prefix = isCN ? "/cn" : "";

  // Build localized categories with useMemo so it updates when locale changes
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

  // ✅ 初始就帶 SSR/ISR 好的清單
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(!initialItems.length);
  const [qtyMap, setQtyMap] = useState(
    Object.fromEntries((initialItems || []).map((p) => [p.id, 1]))
  );
  const [toast, setToast] = useState(null);

  // current category (default shows all)
  const [activeCat, setActiveCat] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const gridTopRef = useRef(null);

  // reset to first page when category changes
  useEffect(() => {
    setPage(1);
  }, [activeCat]);

  // scroll to product grid top
  const scrollToGridTop = () => {
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 客端切換分類時抓資料
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const url = `/api/store/products?per_page=100${
          activeCat ? `&category=${activeCat}` : ""
        }`;
        const r = await fetch(url);
        const data = await r.json();
        const arr = Array.isArray(data) ? data : [];
        setItems(arr);
        const init = Object.fromEntries(arr.map((p) => [p.id, 1]));
        setQtyMap(init);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeCat]);

  const setQty = (id, next) =>
    setQtyMap((m) => ({
      ...m,
      [id]: Math.max(0, Number.isFinite(+next) ? +next : 0),
    }));

  // Toast
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

  // ✅ 這裡同時把 name_en / name_zh 存進購物車，摘要才能依語系顯示
  const addToCart = (p) => {
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
        name: displayName, // 兼容舊資料
        name_en: enName, // ✅ 存英文
        name_zh: zhName, // ✅ 存中文（若無為空字串）
        img,
        price: priceNumber,
        sku: p.sku || "",
      },
      q
    );
    showToast(`${t("pd.toast.added")} “${displayName}” (${q}).`);
    setQty(p.id, 0);
  };

  // pagination slice
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageItems = items.slice(pageStart, pageStart + PAGE_SIZE);

  const goTo = (n) => {
    const next = Math.min(Math.max(1, n), totalPages);
    if (next !== page) {
      setPage(next);
      scrollToGridTop();
    }
  };

  // ====== SEO: canonical / hreflang / JSON-LD ======
  const base = SITE_URL.replace(/\/+$/, "");
  const pathPrefix = isCN ? "/cn" : "";
  const canonical = `${base}${pathPrefix || ""}/`;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: (items || []).slice(0, 20).map((p, idx) => ({
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
        {/* 圖片 CDN 預連線 */}
        <link rel="preconnect" href="https://i0.wp.com" />
        <link rel="dns-prefetch" href="https://i0.wp.com" />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      </Head>

      <main className="bg-[#f4f1f1] pt-20 sm:pt-0">
        {/* Toast */}
        <div className="pointer-events-none fixed inset-0 z-[200] flex items-end justify-center">
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

        {/* Banner */}
        <section className="">
          <Image
            src="/images/2025-10-灶腳-IG-灶腳宅配(1920x768px)-定稿.jpg"
            alt="banner"
            width={1920}
            height={768}
            className="w-full "
            priority
          />
        </section>

        {/* Tabs (desktop buttons, mobile select) */}
        <div className="mt-8 flex flex-col items-center gap-4">
          {/* 🔹 Mobile Dropdown */}
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

          {/* 🔹 Desktop Tabs */}
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

        {/* Products */}
        <section className="section-content min-h-screen pb-24">
          {/* scroll anchor */}
          <div ref={gridTopRef} />

          {loading ? (
            <div className="text-center py-20 text-gray-500">
              {t("home.loading")}
            </div>
          ) : items.length === 0 ? (
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
                  className="grid max-w-[1600px] mx-auto w-[92%] grid-cols-1
                             sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                             gap-6 sm:gap-8 my-12"
                >
                  {pageItems.map((p) => {
                    const q = qtyMap[p.id] ?? 0;
                    const img =
                      p?.images?.[0]?.src || "/images/placeholder.png";
                    const price = p?.prices?.price
                      ? Number(p.prices.price) / 100
                      : null;
                    const tags = storageTagsFromProduct(p);
                    const displayName = getDisplayName(p);

                    return (
                      <div
                        key={p.id}
                        className="item relative flex flex-col justify-center items-center group bg-white p-4 border border-gray-100 hover:shadow-md transition"
                      >
                        {/* 覆蓋整張卡片的 Link（置於最上層） */}
                        <Link
                          href={`${prefix}/product/${p.id}`}
                          aria-label={`${displayName} details`}
                          className="absolute inset-0 z-20"
                        />

                        {/* 內容層（一般資訊：圖片/標題/價格） */}
                        <div className="relative z-10 flex flex-col items-center">
                          {/* 圖片：點擊會被上面的覆蓋層攔截 → 導頁 */}
                          <img
                            src={img}
                            alt={displayName}
                            className="w-[200px] h-auto transition-transform group-hover:scale-[1.05]"
                            loading="lazy"
                          />

                          {/* Title & Price */}
                          <div className="item-info mt-3 text-center">
                            <b className="line-clamp-2">{displayName}</b>
                            {price !== null && (
                              <div className="text-sm text-gray-600">
                                CA$ {price}
                              </div>
                            )}
                          </div>

                          {/* Storage tags */}
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

                        {/* 互動區（放在更高層級，能蓋過覆蓋層進行操作） */}
                        <div
                          className="relative z-30 mt-4 flex flex-col items-center gap-3"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          {/* Quantity */}
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

                          {/* Add to cart */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p);
                            }}
                            disabled={q <= 0}
                            className={`rounded-xl px-4 py-2 text-white ${
                              q > 0
                                ? "bg-[#ca9121] hover:opacity-90"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {t("prod.addToCart")}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
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

        {/* 隱藏 number input 的預設加減箭頭 */}
        <style jsx global>{`
          /* Chrome / Safari */
          input[type="number"].no-spin::-webkit-outer-spin-button,
          input[type="number"].no-spin::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          /* Firefox */
          input[type="number"].no-spin {
            -moz-appearance: textfield;
          }
        `}</style>
      </main>
    </Layout>
  );
}

/* ---------------- SSG + ISR ---------------- */
export async function getStaticProps({ locale }) {
  const base = process.env.WC_URL;
  const ck = process.env.WC_CK;
  const cs = process.env.WC_CS;

  let initialItems = [];
  try {
    // 1) 取 Store API
    const storeURL = new URL(`${ensureURL(base)}/wp-json/wc/store/products`);
    storeURL.searchParams.set("per_page", "100");
    const r = await fetch(storeURL.toString(), {
      headers: { Accept: "application/json" },
    });
    const list = (await r.json()) || [];
    const ids = Array.isArray(list)
      ? list
          .map((p) => p.id)
          .filter(Boolean)
          .slice(0, 100)
      : [];

    // 2) 取 v3 meta_data → 併 zh 名稱
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
  } catch (e) {
    // 靜默失敗，留空陣列
  }

  return {
    props: { initialItems, buildLocale: locale ?? null },
    revalidate: 300, // 5 分鐘
  };
}

/* ---- helpers (SSR 用) ---- */
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
