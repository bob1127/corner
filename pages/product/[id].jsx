// pages/product/[id].jsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../Layout";
import { cartStore } from "@/lib/cartStore";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import Image from "next/image";
import HotProductsCarousel from "@/components/HotProductsCarousel";

/* helpers */
const priceFromStore = (p) =>
  p?.prices?.price ? Number(p.prices.price) / 100 : 0;

const imagesFromProduct = (p) =>
  Array.isArray(p?.images) && p.images.length
    ? p.images
    : [{ src: "/images/placeholder.png", alt: p?.name || "product" }];

/** 讀取保存方式（優先：全站屬性 storage；備援：自訂 meta） */
/** 讀取保存方式標籤（支援 pa_storage / terms 格式） */
const storageTagsFromProduct = (p) => {
  if (!p || !Array.isArray(p.attributes)) return [];

  // 找出名稱是「保存方式」、slug 或 taxonomy 為 pa_storage 的屬性
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

  // ✅ 你的 WooCommerce Store API 正確格式是這個
  if (Array.isArray(attr.terms) && attr.terms.length > 0) {
    return attr.terms.map((t) => t.name).filter(Boolean);
  }

  // 🟡 備援格式（options）
  if (Array.isArray(attr.options) && attr.options.length > 0) {
    return attr.options.map((s) => String(s).trim()).filter(Boolean);
  }

  return [];
};

export default function ProductDetail() {
  const { query } = useRouter();
  const { id } = query;

  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

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
  const storageTags = storageTagsFromProduct(p); // ← 取得保存方式

  const add = () => {
    const img = imgs?.[0]?.src || "/images/placeholder.png";
    cartStore.add({ id: p.id, name: p.name, img, price }, Math.max(1, qty));
    alert("已加入購物車");
  };

  return (
    <Layout>
      {/* ★★ Swiper 高度修正：務必存在（讓主圖不再空白） ★★ */}
      <style jsx global>{`
        .product-swiper,
        .product-swiper .swiper-wrapper,
        .product-swiper .swiper-slide {
          height: 100%;
        }
      `}</style>

      <main className="max-w-6xl mx-auto pb-20 pt-[140px] px-10">
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
          <div className="flex pl-10 items-start pt-0 sm:pt-20">
            <div className="right-info">
              <h1 className="text-2xl font-bold mb-2">{p.name}</h1>
              <div className="text-xl mb-2">NT$ {price}</div>

              {/* 保存方式標籤（顯示在價格下方） */}
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
                className="px-6 py-3 bg-black text-white rounded"
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

        {/* 推薦產品（保底顯示至少一張卡） */}
        <section className="mt-16">
          <h3 className="text-xl font-bold mb-4">其他推薦產品</h3>
          <RelatedCarousel
            currentId={p.id}
            categories={p.categories}
            currentFirstImage={imgs?.[0]?.src || "/images/placeholder.png"}
            currentPrice={price}
          />
        </section>
      </main>
    </Layout>
  );
}

/* 推薦區：即使只剩自己，也會顯示自己一張卡 */
function RelatedCarousel({
  currentId,
  categories,
  currentFirstImage,
  currentPrice,
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
      onAdd={(prod) =>
        cartStore.add(
          { id: prod.id, name: prod.name, img: prod.img, price: prod.price },
          1
        )
      }
    />
  );
}
