// pages/product/[id].jsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";
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

export default function ProductDetail() {
  const router = useRouter();
  const t = useT();
  const { id } = router.query;

  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // 加入購物車 Toast 狀態
  const [added, setAdded] = useState(null); // { id, name, img, price, qty }

  // ====== 安全傳遞 thumbs（避免 destroyed 狀態觸發錯誤）======
  const thumbsParam = useMemo(() => {
    return thumbsSwiper && !thumbsSwiper.destroyed
      ? { swiper: thumbsSwiper }
      : undefined;
  }, [thumbsSwiper]);

  // 語系或商品變動時，清空舊的 thumbs 實例參考
  useEffect(() => {
    setThumbsSwiper(null);
  }, [router.locale, id]);

  // 加入購物車 + 顯示自訂彈窗
  const showAddedToast = useCallback((prod, count = 1) => {
    const payload = {
      id: prod.id,
      name: prod.name,
      price: prod.price ?? priceFromStore(prod),
      img: prod.img ?? prod?.images?.[0]?.src ?? "/images/placeholder.png",
      qty: Math.max(1, count),
    };
    cartStore.add(
      {
        id: payload.id,
        name: payload.name,
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

  // 取單品（等待 router.isReady；容錯兩種 API 寫法；容忍不同 payload 形狀）
  useEffect(() => {
    if (!router.isReady) return;
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
  }, [router.isReady, router.query.id, router.locale]);

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

  const add = () => {
    showAddedToast({ id: p.id, name: p.name, img: imgs?.[0]?.src, price }, qty);
  };

  return (
    <Layout>
      {/* 修正 Swiper 高度 */}
      <style jsx global>{`
        .product-swiper,
        .product-swiper .swiper-wrapper,
        .product-swiper .swiper-slide {
          height: 100%;
        }
      `}</style>

      <main className="max-w-6xl mx-auto pb-24 pt-[140px] px-4 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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

          {/* 右：內容 */}
          <div className="flex pl-0 sm:pl-10 items-start pt-0 sm:pt-20">
            <div className="right-info w-full">
              <h1 className="text-2xl font-bold mb-2">{p.name}</h1>
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

        {/* 推薦產品 */}
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
            onQuickAdd={(prod) => showAddedToast(prod, 1)}
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
    </Layout>
  );
}

/* 推薦區 */
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
          img: prod.img,
          price: prod.price,
        };
        cartStore.add(payload, 1);
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
            className="fixed z-50 left-1/2 -translate-x-1/2 bottom-4 w-[92vw] sm:w-[560px]"
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
