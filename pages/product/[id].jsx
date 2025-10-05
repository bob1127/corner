// pages/product/[id].jsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useMemo, useState, useCallback } from "react";
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
  const { id } = router.query;

  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // === 自訂彈出匡狀態 ===
  const [added, setAdded] = useState(null); // { id, name, img, price, qty }

  // 加入購物車 + 彈出匡
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

  // 自動關閉
  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(null), 3000);
    return () => clearTimeout(t);
  }, [added]);

  // 抓商品
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const r = await fetch(`/api/store/products/${id}`);
        const data = await r.json();
        if (!r.ok || !data?.id) {
          setErr(`讀取失敗 ${r.status}: ${data?.message || "unknown"}`);
        } else {
          setP(data);
        }
      } catch (e) {
        setErr(String(e));
      }
    })();
  }, [id]);

  if (err) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto py-16 px-4 text-red-600">{err}</div>
      </Layout>
    );
  }
  if (!p) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto py-16 px-4 text-gray-500">
          載入中…
        </div>
      </Layout>
    );
  }

  const imgs = imagesFromProduct(p);
  const price = priceFromStore(p);
  const storageTags = storageTagsFromProduct(p);

  const add = () => {
    // 使用自訂彈出匡
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
          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full max-w-[520px] aspect-[4/4] relative">
              <Swiper
                loop
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="product-swiper w-full h-full"
                style={{ height: "100%" }}
              >
                {imgs.map((image, i) => (
                  <SwiperSlide key={`main-${i}`} className="!h-full">
                    <div className="relative w-full h-full min-h-[320px] rounded overflow-hidden bg-white">
                      <Image
                        src={image.src}
                        alt={image.alt || `Product Image ${i}`}
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
                        alt={image.alt || `Thumbnail ${i}`}
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
                加入購物車
              </button>
            </div>
          </div>
        </div>

        {/* 詳細介紹 */}
        {p.description && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-2">商品介紹</h2>
            <div
              className="prose prose-sm text-gray-800"
              dangerouslySetInnerHTML={{ __html: p.description }}
            />
          </div>
        )}

        {/* 推薦產品（與主按鈕共用同一個彈出匡） */}
        <section className="mt-16">
          <h3 className="text-xl font-bold mb-4">其他推薦產品</h3>
          <RelatedCarousel
            currentId={p.id}
            categories={p.categories}
            currentFirstImage={imgs?.[0]?.src || "/images/placeholder.png"}
            currentPrice={price}
            onQuickAdd={(prod) => showAddedToast(prod, 1)}
          />
        </section>
      </main>

      {/* ====== 新設計：加入購物車彈出匡 ====== */}
      <AddToCartToast
        open={!!added}
        onClose={() => setAdded(null)}
        item={added}
        onGoCart={() => router.push("/cart")}
      />
    </Layout>
  );
}

/* 推薦區：把 onQuickAdd 往下傳進 HotProductsCarousel 的 onAdd */
function RelatedCarousel({
  currentId,
  categories,
  currentFirstImage,
  currentPrice,
  onQuickAdd,
}) {
  return (
    <HotProductsCarousel
      fetchFromWoo
      perPage={12}
      excludeId={currentId}
      categoryIds={(categories || []).map((c) => c.id)}
      fallbackItem={{
        id: currentId,
        name: "本商品",
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
        // 寫入購物車 + 彈窗
        cartStore.add(payload, 1);
        onQuickAdd?.(payload);
      }}
    />
  );
}

/* ========== 元件：加入購物車彈出匡（Bottom Toast） ========== */
function AddToCartToast({ open, onClose, item, onGoCart }) {
  const visible = !!open && !!item;

  // 防止背景滾動（Toast 開啟時）
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
          {/* 半透明遮罩（可點關閉） */}
          <motion.button
            aria-label="關閉彈出視窗"
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom sheet / Toast */}
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
                    已加入購物車：{item?.name}
                  </p>
                  <p className="text-xs text-stone-600 mt-0.5">
                    數量 × {item?.qty}　|　CA${item?.price}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-3 py-2 text-sm rounded-lg hover:bg-stone-100"
                >
                  關閉
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
