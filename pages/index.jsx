// pages/index.jsx
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cartStore } from "@/lib/cartStore";
import Layout from "./Layout";
import { useT } from "@/lib/i18n";

/* ---- Read storage method tags from product attributes ---- */
const storageTagsFromProduct = (p) => {
  if (!p || !Array.isArray(p.attributes)) return [];
  const attr = p.attributes.find((a) => {
    const slug = String(a?.slug || "").toLowerCase();
    const tax = String(a?.taxonomy || "").toLowerCase();
    const name = String(a?.name || "").toLowerCase();
    return (
      name.includes("保存方式") || // keep CN in case backend uses Chinese
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

export default function Home() {
  const t = useT();

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

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qtyMap, setQtyMap] = useState({});
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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // fetch more and paginate on client (or change API to support server pagination)
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

  const addToCart = (p) => {
    const q = qtyMap[p.id] ?? 0;
    if (q <= 0) return;
    const priceNumber = p?.prices?.price ? Number(p.prices.price) / 100 : 0;
    const img = p?.images?.[0]?.src || "/images/placeholder.png";

    cartStore.add(
      { id: p.id, name: p.name, img, price: priceNumber, sku: p.sku || "" },
      q
    );
    // Localized toast
    showToast(`${t("pd.toast.added")} “${p.name}” (${q}).`);
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

  return (
    <Layout>
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
                  className="grid max-w-[1600px] mx-auto w-[92%] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 my-12"
                >
                  {pageItems.map((p) => {
                    const q = qtyMap[p.id] ?? 0;
                    const img =
                      p?.images?.[0]?.src || "/images/placeholder.png";
                    const price = p?.prices?.price
                      ? Number(p.prices.price) / 100
                      : null;
                    const tags = storageTagsFromProduct(p);
                    return (
                      <div
                        key={p.id}
                        className="item flex flex-col justify-center items-center group bg-white p-4 border border-gray-100 hover:shadow-md transition"
                      >
                        {/* Image */}
                        <Link
                          href={`/product/${p.id}`}
                          aria-label={`${p.name} details`}
                        >
                          <img
                            src={img}
                            alt={p.name}
                            className="w-[200px] h-auto transition-transform group-hover:scale-[1.05]"
                            loading="lazy"
                          />
                        </Link>

                        {/* Title & Price */}
                        <div className="item-info mt-3 text-center">
                          <b className="line-clamp-2">{p.name}</b>
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

                        {/* Quantity */}
                        <div className="mt-4 flex items-center gap-3">
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
                                Math.max(0, parseInt(e.target.value || "0", 10))
                              )
                            }
                            className="w-16 rounded-xl border px-2 py-1 text-center"
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
                          onClick={() => addToCart(p)}
                          disabled={q <= 0}
                          className={`mt-3 rounded-xl px-4 py-2 text-white ${
                            q > 0
                              ? "bg-black hover:opacity-90"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {t("prod.addToCart")}
                        </button>

                        <Link
                          href={`/product/${p.id}`}
                          className="mt-2 text-xs underline underline-offset-4 hover:opacity-80"
                        >
                          {t("home.details")}
                        </Link>
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
      </main>
    </Layout>
  );
}
