// components/HotProductsCarousel.jsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

/**
 * 熱銷產品 Embla Carousel（自動抓 Woo Store API，保底至少顯示一張）
 *
 * @param {Array}    items         - 可選，手動提供資料 [{ id, name, price, img, leftNote?, rightNote? }]
 * @param {Function} onAdd         - 可選，加入購物車 callback (p)=>void
 * @param {boolean}  fetchFromWoo  - 預設 true；若 true 且 items 為空，會打 /api/store/products
 * @param {number}   perPage       - 預設 12；抓取數量
 * @param {number}   excludeId     - 可選；排除目前商品 id（若清單變空會自動用自己補上）
 * @param {number[]} categoryIds   - 可選；優先排序含此分類 id 的商品
 * @param {object}   fallbackItem  - 可選；最後萬一仍為空，用這個單卡顯示
 */
export default function HotProductsCarousel({
  items = [],
  onAdd,
  fetchFromWoo = true,
  perPage = 12,
  excludeId,
  categoryIds = [],
  fallbackItem,
}) {
  const [fetched, setFetched] = useState([]);
  const [error, setError] = useState("");

  // 自動播放：3 秒一格、滑鼠移入暫停
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1, dragFree: false },
    [autoplay.current]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // ---- 抓 Woo 資料（或使用外部傳入的 items）----
  useEffect(() => {
    if (!fetchFromWoo || (items && items.length > 0)) return;

    (async () => {
      try {
        const r = await fetch(`/api/store/products?per_page=${perPage}`);
        const data = await r.json();

        // 兼容 array 或 {data:[...]}
        const arr = Array.isArray(data) ? data : data?.data || [];
        if (!Array.isArray(arr)) throw new Error("Woo API response 格式錯誤");

        // 排除自己（若過濾後為空，會在下方補回）
        let list = excludeId ? arr.filter((x) => x.id !== excludeId) : arr;

        // 優先同分類（有交集者排前面）
        if (Array.isArray(categoryIds) && categoryIds.length) {
          const catSet = new Set(categoryIds);
          list = [...list].sort((a, b) => {
            const aHit = (a.categories || []).some((c) => catSet.has(c.id));
            const bHit = (b.categories || []).some((c) => catSet.has(c.id));
            return Number(bHit) - Number(aHit);
          });
        }

        // ★ 如果排除自己後沒有其他商品 → 用自己補回（確保至少有一張卡）
        if (!list.length && excludeId) {
          const self = arr.find((x) => x.id === excludeId);
          if (self) list = [self];
        }

        // 映射成元件需要的格式
        let mapped = list.map((x) => ({
          id: x.id,
          name: x.name,
          price: x?.prices?.price ? Number(x.prices.price) / 100 : undefined,
          img: x?.images?.[0]?.src || "/images/placeholder.png",
          leftNote: "季節限定",
          rightNote: "クラフトラガー",
          slug: x?.slug,
        }));

        // 最終保底（仍為空時）
        if (!mapped.length && fallbackItem) {
          mapped = [fallbackItem];
        }

        setFetched(mapped);
      } catch (e) {
        setError(String(e?.message || e));
      }
    })();
  }, [fetchFromWoo, items, perPage, excludeId, categoryIds, fallbackItem]);

  // 最終要渲染的資料來源：有手動 items 用 items，否則用 fetched；最後再 fallback
  const data = useMemo(() => {
    if (items?.length) return items;
    if (fetched?.length) return fetched;
    if (fallbackItem) return [fallbackItem];
    return [];
  }, [items, fetched, fallbackItem]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!data?.length)
    return <div className="text-gray-500">暫無其他商品，敬請期待</div>;

  return (
    <div className="relative w-full">
      {/* 右上角箭頭 */}
      <div className="pointer-events-auto absolute -top-5 right-2 z-10 flex gap-2">
        <button
          onClick={scrollPrev}
          aria-label="上一個"
          className="size-9 rounded-full bg-white text-black/80 shadow ring-1 ring-black/10 hover:bg-black hover:text-white transition"
        >
          ‹
        </button>
        <button
          onClick={scrollNext}
          aria-label="下一個"
          className="size-9 rounded-full bg-white text-black/80 shadow ring-1 ring-black/10 hover:bg-black hover:text-white transition"
        >
          ›
        </button>
      </div>

      {/* Embla */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {data.map((p, idx) => (
            <div
              key={p.id ?? idx}
              className="
                embla__slide px-4 
                flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%]
              "
            >
              {/* 卡片（大量留白、極淡陰影） */}
              <article className="group bg-white overflow-visible flex flex-col h-full shadow-sm hover:shadow-md transition">
                {/* 視覺區 */}
                <div className="relative w-full aspect-[4/5]">
                  {/* 超淡橢圓背景 */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-[86%] w-[66%] rounded-full bg-stone-100"></div>
                  </div>

                  {/* 直書輔助字 */}
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <span className="[writing-mode:vertical-rl] text-[11px] tracking-widest text-stone-400 select-none">
                      {p.leftNote ?? "季節限定"}
                    </span>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <span className="[writing-mode:vertical-rl] text-[11px] tracking-widest text-stone-400 select-none">
                      {p.rightNote ?? "クラフトラガー"}
                    </span>
                  </div>

                  {/* 商品圖（next/image 需設定 remotePatterns：inf.fjg.mybluehost.me、i0.wp.com） */}
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    priority={false}
                    className="object-contain transition-transform duration-300 group-hover:-translate-y-1"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                  />

                  {/* 右下角 + 快捷加入購物車 */}
                  <button
                    onClick={() => onAdd?.(p)}
                    aria-label="加入購物車"
                    className="
                      absolute bottom-[20%] right-[16%]
                      size-10 rounded-full bg-white text-black shadow
                      ring-1 ring-black/10
                      grid place-items-center
                      hover:bg-black hover:text-white transition
                    "
                  >
                    +
                  </button>
                </div>

                {/* 文案 */}
                <div className="px-4 pt-3 pb-5 flex-1 flex flex-col">
                  <div>
                    <h3 className="text-[13px] font-bold leading-tight line-clamp-2">
                      {p.name}
                    </h3>
                    <div className="mt-1 text-[12px] text-stone-500">
                      {typeof p.price !== "undefined" ? `NT$${p.price}` : ""}
                    </div>
                  </div>

                  {/* 操作 */}
                  <div className="mt-auto pt-3 flex gap-2">
                    <a
                      href={`/product/${p.id}`}
                      className="flex-1 rounded-full border py-2 text-xs text-center hover:bg-black hover:text-white transition"
                    >
                      查看
                    </a>
                    <button
                      onClick={() => onAdd?.(p)}
                      className="flex-1 rounded-full bg-black text-white py-2 text-xs hover:opacity-90 transition"
                    >
                      加入購物車
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
