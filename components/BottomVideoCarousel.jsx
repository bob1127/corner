"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import Head from "next/head";

/** 小工具：左右鍵（保留） */
const IconBtn = ({ dir = "prev", ...rest }) => (
  <button
    type="button"
    aria-label={dir === "prev" ? "上一個" : "下一個"}
    className="w-9 h-9 grid place-items-center rounded-full bg-white border border-black/10 shadow-md hover:-translate-y-0.5 transition"
    {...rest}
  >
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="#111"
      strokeWidth="2"
    >
      {dir === "prev" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  </button>
);

/**
 * BottomVideoGallery
 * items: [{ src, poster, title, description, toIndex? }]
 * onItemClick: (index, item) => void
 */
export default function BottomVideoGallery({
  className = "",
  items = [],
  options = { loop: true, align: "start" },
  // autoplayDelay 移除（不再使用自動輪播）
  onItemClick,
}) {
  // 移除 Autoplay plugin，僅使用 embla 本體
  const mergedOptions = {
    loop: true,
    align: "start",
    slidesToScroll: 1,
    containScroll: "keepSnaps",
    ...options,
  };
  const [emblaRef, emblaApi] = useEmblaCarousel(mergedOptions);

  const [selected, setSelected] = useState(0);
  const mainVideoRef = useRef(null);
  const viewportRef = useRef(null);
  const [inViewport, setInViewport] = useState(true);

  // 觀察整個元件是否在畫面中
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInViewport(entries.some((e) => e.isIntersecting)),
      { root: null, threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Embla：同步選中索引
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi?.off("select", onSelect);
      emblaApi?.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // 只在選中 & 在 viewport 時播放；其他暫停
  useEffect(() => {
    const v = mainVideoRef.current;
    if (!v) return;
    const play = async () => {
      try {
        v.load();
        if (inViewport) await v.play().catch(() => {});
      } catch {}
    };
    const pause = () => {
      try {
        v.pause();
      } catch {}
    };
    if (inViewport) play();
    else pause();
  }, [selected, inViewport]);

  // JSON-LD（SEO）
  const jsonLd = useMemo(() => {
    const list = items.map((it) => ({
      "@type": "VideoObject",
      name: it.title || "Video",
      description: it.description || "",
      contentUrl: it.src,
      thumbnailUrl: it.poster ? [it.poster] : undefined,
    }));
    return { "@context": "https://schema.org", "@graph": list };
  }, [items]);

  const active = items[selected] || {};

  return (
    <div ref={viewportRef} className={`relative w-full ${className}`}>
      {/* SEO */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      {/* 主視區（影片） */}
      <div className="w-full px-4 md:px-6">
        <div className="relative mx-auto max-w-[1280px] bg-[#e68c33] border p-4 overflow-hidden shadow-sm">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <video
              key={`main-${selected}`}
              ref={mainVideoRef}
              className="absolute inset-0 w-full h-full object-cover bg-black"
              preload="metadata"
              muted
              playsInline
              controls={false}
              poster={active.poster || undefined}
              aria-label={active.title || `video-${selected + 1}`}
              title={active.title || `video-${selected + 1}`}
            >
              {active?.src && <source src={active.src} type="video/mp4" />}
              您的瀏覽器不支援 HTML5 影片。
            </video>
            <button
              type="button"
              onClick={() => onItemClick?.(selected, active)}
              className="absolute inset-0"
              aria-label="播放/切換"
              title="切換"
              style={{ background: "transparent" }}
            />
          </div>
        </div>
      </div>

      {/* ===== 縮圖列（寬度上限 800px，置中，RWD 自適應） ===== */}
      <div className="mt-4 md:mt-5 px-2">
        {/* 將整條縮圖容器限制為 800px 並置中 */}
        <div className="thumbs-embla mx-auto w-full max-w-[800px]">
          {/* Scope 這個 embla 的 RWD 寬度配置，避免干擾其他 embla */}
          <style>{`
            .thumbs-embla .embla__viewport { --slide-spacing: .8rem; --slide-size: 50%; }
            /* sm: 2 張 */
            @media (min-width: 640px)  {
              .thumbs-embla .embla__viewport { --slide-size: 50%; }
            }
            /* md: 3 張 */
            @media (min-width: 768px)  {
              .thumbs-embla .embla__viewport { --slide-size: 33.3333%; }
            }
            /* lg+: 4 張（在 800px 容器內每張 ~200px） */
            @media (min-width: 1024px) {
              .thumbs-embla .embla__viewport { --slide-size: 25%; }
            }
          `}</style>

          <div className="embla__viewport overflow-hidden" ref={emblaRef}>
            <div
              className="embla__container flex touch-pan-y touch-pinch-zoom h-auto"
              style={{ marginLeft: "calc(var(--slide-spacing) * -1)" }}
            >
              {items.map((it, i) => (
                <div
                  key={i}
                  className="embla__slide transform flex-none min-w-0"
                  style={{
                    transform: "translate3d(0,0,0)",
                    flex: "0 0 var(--slide-size)",
                    paddingLeft: "var(--slide-spacing)",
                  }}
                >
                  <article
                    className={` border ${
                      i === selected ? "border-black" : "border-black/40"
                    } bg-white overflow-hidden`}
                  >
                    <button
                      type="button"
                      className="w-full h-full"
                      onClick={() => {
                        emblaApi?.scrollTo(i);
                        onItemClick?.(i, items[i]);
                      }}
                    >
                      <figure className="w-full p-2">
                        {/* 讓縮圖自己填滿卡片寬，維持 16:9 比例 */}
                        <div
                          className="w-full rounded-lg overflow-hidden"
                          style={{ aspectRatio: "16 / 9" }}
                        >
                          <img
                            src={
                              it.poster || "/images/video-poster-fallback.jpg"
                            }
                            alt={it.title || `thumb-${i + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {(it.title || it.description) && (
                          <figcaption className="mt-2 text-center px-2">
                            {it.title && (
                              <b className="block text-[14px] md:text-[15px] leading-snug line-clamp-2">
                                {it.title}
                              </b>
                            )}
                            {it.description && (
                              <p className="text-[12px] text-neutral-600 leading-relaxed line-clamp-2">
                                {it.description}
                              </p>
                            )}
                          </figcaption>
                        )}
                      </figure>
                    </button>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* 控制列：只保留左右鍵，拿掉底部圓點 */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <IconBtn dir="prev" onClick={() => emblaApi?.scrollPrev()} />
            <IconBtn dir="next" onClick={() => emblaApi?.scrollNext()} />
          </div>
        </div>
      </div>
    </div>
  );
}
