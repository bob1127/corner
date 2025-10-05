"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

/**
 * 使用方式：
 * <TestimonialsEmbla images={[{src:'/a.jpg', alt:'a'}, '/b.jpg', ...]} />
 * 或維持舊用法：
 * <TestimonialsEmbla testimonials={[{ image:'/a.jpg' }, '/b.jpg']} />
 */
export default function TestimonialsEmbla({
  images = [],
  testimonials = [],
  title = "客戶好評",
  autoPlayDelay = 4000, // ms
}) {
  // 兼容：若沒傳 images，就從 testimonials 取出圖片
  const slides = (images?.length ? images : testimonials)
    .map((it) =>
      typeof it === "string"
        ? { src: it, alt: "" }
        : typeof it?.image === "string"
        ? { src: it.image, alt: it?.alt || it?.name || "" }
        : { src: it?.src, alt: it?.alt || "" }
    )
    .filter((it) => !!it.src);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const isHoveringRef = useRef(false);
  const isDraggingRef = useRef(false);
  const autoPlayTimerRef = useRef(null);

  // loop 在只有 1 張時沒意義
  const enableLoop = slides.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: enableLoop,
    dragFree: false,
    skipSnaps: false,
    // 移除 containScroll，避免和 loop 互相干擾
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const startAutoPlay = useCallback(() => {
    if (!emblaApi || !enableLoop) return;
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    autoPlayTimerRef.current = setInterval(() => {
      if (
        !isHoveringRef.current &&
        !isDraggingRef.current &&
        !document.hidden
      ) {
        emblaApi.scrollNext();
      }
    }, autoPlayDelay);
  }, [emblaApi, autoPlayDelay, enableLoop]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();

    emblaApi
      .on("select", onSelect)
      .on("reInit", () => {
        setScrollSnaps(emblaApi.scrollSnapList());
        onSelect();
      })
      .on("pointerDown", () => {
        isDraggingRef.current = true;
        stopAutoPlay();
      })
      .on("pointerUp", () => {
        isDraggingRef.current = false;
        startAutoPlay();
      });

    startAutoPlay();
    const onResize = () => emblaApi.reInit();
    window.addEventListener("resize", onResize);
    return () => {
      stopAutoPlay();
      window.removeEventListener("resize", onResize);
    };
  }, [emblaApi, onSelect, startAutoPlay, stopAutoPlay]);

  const scrollTo = useCallback(
    (idx) => emblaApi && emblaApi.scrollTo(idx),
    [emblaApi]
  );

  if (!slides.length) return null;

  return (
    <section className="section-others-project mb-10 px-4 sm:px-0 overflow-hidden w-full">
      <div
        className="relative"
        onMouseEnter={() => {
          isHoveringRef.current = true;
          stopAutoPlay();
        }}
        onMouseLeave={() => {
          isHoveringRef.current = false;
          startAutoPlay();
        }}
      >
        {/* Viewport */}
        <div
          className="embla__viewport overflow-hidden cursor-grab active:cursor-grabbing"
          ref={emblaRef}
        >
          {/* Container：用 CSS 變數精準控制寬度/間距，支援 2.5 / 3.5 */}
          <div className="embla__container flex">
            {slides.map((img, idx) => (
              <div
                key={idx}
                className="embla__slide image-slide min-w-0 shrink-0"
              >
                <div className="relative w-full overflow-hidden rounded-md">
                  {/* 依需求調整高度比例 */}
                  <div className="relative w-full  overflow-hidden aspect-[2/2.5]">
                    <Image
                      src={img.src}
                      alt={img.alt || `slide-${idx + 1}`}
                      fill
                      className="object-contain"
                      priority={idx < 2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination：黑點→active 膠囊 */}
        <div className="embla__dots mt-6 flex items-center justify-center gap-3">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className={`pill-bullet ${
                i === selectedIndex ? "is-active" : ""
              }`}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        /* 隱藏 WebKit 捲軸 */
        .embla__viewport::-webkit-scrollbar {
          display: none;
        }

        /* ---- 核心寬度/間距設定：含「邊緣留白」避免最後一張超出 ---- */
        .embla__container {
          --slide-spacing: 16px; /* gap 大小 */
          --slides-per-view: 1; /* 預設 1 張 */
          --slide-size: calc(
            (100% - var(--slide-spacing) * (var(--slides-per-view) - 1)) /
              var(--slides-per-view)
          );
          gap: var(--slide-spacing);
          padding-left: var(--slide-spacing);
          padding-right: var(--slide-spacing);
          box-sizing: border-box;
        }
        .embla__slide {
          flex: 0 0 var(--slide-size);
        }

        /* 斷點配置：1 / 2 / 2.5 / 2.5 / 3.5 張（露半張） */
        @media (min-width: 640px) {
          .embla__container {
            --slides-per-view: 2;
          }
        }
        @media (min-width: 768px) {
          .embla__container {
            --slides-per-view: 2.5;
          }
        }
        @media (min-width: 1024px) {
          .embla__container {
            --slides-per-view: 2.5;
          }
        }
        @media (min-width: 1280px) {
          .embla__container {
            --slides-per-view: 3.5;
          }
        }

        /* pagination 樣式：黑點／active 膠囊 */
        .pill-bullet {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #111;
          border-radius: 9999px;
          opacity: 0.8;
          transition: width 0.28s cubic-bezier(0.22, 1, 0.36, 1),
            height 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease;
        }
        .pill-bullet:hover {
          opacity: 1;
        }
        .pill-bullet.is-active {
          width: 36px;
          height: 8px;
          background: #111;
          border-radius: 9999px;
          opacity: 1;
        }
        @media (min-width: 768px) {
          .pill-bullet {
            width: 6px;
            height: 6px;
          }
          .pill-bullet.is-active {
            width: 44px;
            height: 6px;
          }
        }
      `}</style>
    </section>
  );
}
