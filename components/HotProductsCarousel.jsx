// components/HotProductsCarousel.jsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function HotProductsCarousel({
  apiPath = "/api/store/products",
  perPage = 12,
  categoryIds = [],
  excludeId,
  items: presetItems = [],
  onAdd,
  fallbackItem,
}) {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState([]);
  const [err, setErr] = useState("");

  // ── Embla：順滑設定（保留慣性，但仍會貼齊）
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
      containScroll: "trimSnaps",
      duration: 30,
    },
    [autoplay.current]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // 抓資料
  useEffect(() => {
    if (presetItems?.length) return;
    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const qs = new URLSearchParams();
        if (perPage) qs.set("per_page", String(perPage));
        if (categoryIds?.length) qs.set("categories", categoryIds.join(","));
        const r = await fetch(`${apiPath}?${qs.toString()}`, {
          cache: "no-store",
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        const arr = Array.isArray(json) ? json : json?.data || [];
        if (!Array.isArray(arr)) throw new Error("API 格式錯誤");

        let list = excludeId ? arr.filter((x) => x.id !== excludeId) : arr;

        if (categoryIds?.length) {
          const catSet = new Set(categoryIds);
          list.sort((a, b) => {
            const ah = (a.categories || []).some((c) => catSet.has(c.id));
            const bh = (b.categories || []).some((c) => catSet.has(c.id));
            return Number(bh) - Number(ah);
          });
        }

        if (!list.length && excludeId) {
          const self = arr.find((x) => x.id === excludeId);
          if (self) list = [self];
        }

        let mapped = list.map((x) => ({
          id: x.id,
          slug: x.slug,
          name: x.name,
          price: x?.prices?.price ? Number(x.prices.price) / 100 : undefined,
          img: x?.images?.[0]?.src || "/images/placeholder.png",
          leftNote: "季節限定",
          rightNote: "クラフトラガー",
        }));

        if (!mapped.length && fallbackItem) mapped = [fallbackItem];
        if (!aborted) setFetched(mapped);
      } catch (e) {
        if (!aborted) setErr(e?.message || String(e));
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [
    apiPath,
    perPage,
    categoryIds,
    excludeId,
    presetItems?.length,
    fallbackItem,
  ]);

  const data = useMemo(() => {
    if (presetItems?.length) return presetItems;
    if (fetched?.length) return fetched;
    if (fallbackItem) return [fallbackItem];
    return [];
  }, [presetItems, fetched, fallbackItem]);

  if (err) return <div className="text-red-600">載入失敗：{err}</div>;
  if (!loading && !data.length)
    return <div className="text-gray-500">暫無其他商品</div>;

  return (
    <div className="relative w-full">
      {/* 左右箭頭（手機也顯示；置中不裁切） */}
      <button
        onClick={scrollPrev}
        aria-label="上一個"
        className="absolute z-10 left-1 top-1/2 -translate-y-1/2 grid place-items-center size-9 rounded-full bg-white/95 text-black/80 shadow ring-1 ring-black/10 hover:bg-black hover:text-white transition"
      >
        ‹
      </button>
      <button
        onClick={scrollNext}
        aria-label="下一個"
        className="absolute z-10 right-1 top-1/2 -translate-y-1/2 grid place-items-center size-9 rounded-full bg-white/95 text-black/80 shadow ring-1 ring-black/10 hover:bg-black hover:text-white transition"
      >
        ›
      </button>

      {/* Embla 視窗：加 px-4 以免卡片被左右裁切 */}
      <div className="overflow-hidden px-4" ref={emblaRef}>
        {/* 用 -ml-4 + 子項 pr-4 來製造間距（不影響寬度計算） */}
        <div className="embla__container -ml-4 select-none touch-pan-y">
          {(loading ? Array.from({ length: Math.min(4, perPage) }) : data).map(
            (p, idx) => (
              <div
                key={p?.id ?? idx}
                className="embla__slide pr-4 flex-none min-w-0"
              >
                {loading ? (
                  <SkeletonCard />
                ) : (
                  <article className="group bg-white overflow-visible flex flex-col h-full shadow-sm hover:shadow-md transition rounded-xl">
                    <div className="relative w-full aspect-[4/5]">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="h-[86%] w-[66%] rounded-full bg-stone-100" />
                      </div>

                      <div className="absolute inset-y-0 left-0 flex items-center pl-1 sm:pl-2 pointer-events-none">
                        <span className="[writing-mode:vertical-rl] text-[10px] sm:text-[11px] tracking-widest text-stone-400 select-none">
                          {p.leftNote ?? "季節限定"}
                        </span>
                      </div>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-2 pointer-events-none">
                        <span className="[writing-mode:vertical-rl] text-[10px] sm:text-[11px] tracking-widest text-stone-400 select-none">
                          {p.rightNote ?? "クラフトラガー"}
                        </span>
                      </div>

                      <Image
                        src={p.img}
                        alt={p.name}
                        fill
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, (max-width:1280px) 33vw, 25vw"
                        className="object-contain transition-transform duration-300 group-hover:-translate-y-1"
                      />

                      <button
                        onClick={() => onAdd?.(p)}
                        aria-label="加入購物車"
                        className="absolute bottom-[18%] right-[12%] size-9 sm:size-10 rounded-full bg-white text-black shadow ring-1 ring-black/10 grid place-items-center hover:bg-black hover:text-white transition"
                      >
                        +
                      </button>
                    </div>

                    <div className="px-3 sm:px-4 pt-3 pb-5 flex-1 flex flex-col">
                      <div>
                        <h3 className="text-[13px] font-bold leading-tight line-clamp-2">
                          {p.name}
                        </h3>
                        <div className="mt-1 text-[12px] text-stone-500">
                          {typeof p.price !== "undefined"
                            ? `CA$${p.price}`
                            : ""}
                        </div>
                      </div>
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
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* 斷點寬度（!important 覆蓋一切，保證不擠 & 手機一張） */}
      <style jsx>{`
        .embla__container {
          display: flex;
        }
        /* 手機：單張滿版（不裁邊） */
        .embla__slide {
          flex: 0 0 100% !important;
          min-width: 100% !important;
        }
        /* sm ≥640px：兩張 */
        @media (min-width: 640px) {
          .embla__slide {
            flex: 0 0 50% !important;
            min-width: 50% !important;
          }
        }
        /* md ≥768px：三張 */
        @media (min-width: 768px) {
          .embla__slide {
            flex: 0 0 33.3333% !important;
            min-width: 33.3333% !important;
          }
        }
        /* lg ≥1024px：四張 */
        @media (min-width: 1024px) {
          .embla__slide {
            flex: 0 0 25% !important;
            min-width: 25% !important;
          }
        }
      `}</style>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm bg-white">
      <div className="animate-pulse">
        <div className="w-full aspect-[4/5] bg-stone-100" />
        <div className="p-4">
          <div className="h-3 w-4/5 bg-stone-200 rounded mb-2" />
          <div className="h-3 w-2/5 bg-stone-200 rounded" />
          <div className="mt-4 h-8 bg-stone-200 rounded" />
        </div>
      </div>
    </div>
  );
}
