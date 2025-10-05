import React, { useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { DotButton, useDotButton } from "./EmblaCarosuelDotButton";
import { gsap } from "gsap";

const EmblaCarousel = (props) => {
  const { slides, options } = props;

  // ✅ 加入 Autoplay 插件（保持風格不變，但自動輪播）
  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
      playOnInit: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, ...options }, [
    autoplay.current,
  ]);

  const dragIndicatorRef = useRef(null);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const handleMouseEnter = () => {
    gsap.to(dragIndicatorRef.current, { opacity: 1, scale: 1, duration: 0.5 });
    document.body.style.cursor = "grab";
  };
  const handleMouseLeave = () => {
    gsap.to(dragIndicatorRef.current, {
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
    });
    document.body.style.cursor = "default";
  };

  // ✅ 鍵盤左右鍵也可切換
  const handleKeyDown = useCallback(
    (e) => {
      if (!emblaApi) return;
      if (e.key === "ArrowLeft") onPrevButtonClick();
      if (e.key === "ArrowRight") onNextButtonClick();
    },
    [emblaApi, onPrevButtonClick, onNextButtonClick]
  );

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi
      .on("reInit", () => {})
      .on("scroll", () => {})
      .on("slideFocus", () => {});
  }, [emblaApi]);

  return (
    <div
      className="w-full py-8 mx-auto relative"
      style={{
        "--slide-height": "22rem", // 調整卡片高度
        "--slide-spacing": "1rem",
        "--slide-size": "26%",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0} // 讓容器可聚焦以接收鍵盤事件
    >
      {/* RWD：在不同寬度時調整每張卡片的寬度比例 */}
      <style>{`
        .embla__viewport { --slide-size: 20%; }
        @media (max-width: 1700px) { .embla__viewport { --slide-size: 30%; } }
        @media (max-width: 1200px) { .embla__viewport { --slide-size: 30%; } }
        @media (max-width: 768px)  { .embla__viewport { --slide-size: 58%; } }
        @media (max-width: 550px)  { .embla__viewport { --slide-size: 84%; } }
      `}</style>

      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div
          className="embla__container flex touch-pan-y touch-pinch-zoom h-auto"
          style={{ marginLeft: "calc(var(--slide-spacing) * -1)" }}
        >
          {slides.map((slide, index) => (
            <div
              className="embla__slide transform flex-none  min-w-0"
              key={index}
              style={{
                transform: "translate3d(0, 0, 0)",
                flex: "0 0 var(--slide-size)",
                paddingLeft: "var(--slide-spacing)",
              }}
            >
              <div
                className="embla__slide__card !h-auto overflow-hidden border-none md:border  pb-8 md:border-black flex flex-col items-center justify-start font-semibold"
                style={{
                  boxShadow: "inset 0 0 0 0.2rem var(--detail-medium-contrast)",
                  borderRadius: "1.8rem",
                  height: "var(--slide-height)",
                  userSelect: "none",
                }}
              >
                <a href="/" className="w-full h-full block">
                  <div className="flex  flex-col justify-start items-center w-full h-full">
                    {slide.content ? (
                      slide.content
                    ) : (
                      <div className="w-2/3 ">
                        <img
                          src={slide.image}
                          alt={
                            slide.title
                              ? `Slide: ${slide.title}`
                              : `Slide ${index + 1}`
                          }
                          className="w-full h-auto  aspect-[4/4] object-cover  duration-1000"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="txt mt-4 flex-col flex justify-center items-center w-11/12 md:w-4/5 mx-auto">
                      <b className="text-[16px] text-center leading-snug line-clamp-2">
                        {slide.title}
                      </b>
                      <p className="text-[14px] font-normal text-center leading-relaxed line-clamp-3">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ 控制列：置底置中，避免壓到卡片內容 */}
      <div className="embla__controls pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-2 md:bottom-4 flex flex-col items-center gap-3">
        <div className="embla__buttons pointer-events-auto flex items-center gap-3">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots pointer-events-auto flex items-center gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
            />
          ))}
        </div>
      </div>

      {/* 你的 Drag Indicator（風格不變） */}
      <div
        ref={dragIndicatorRef}
        className="drag-indicator absolute top-[-5%] left-[-5%] transform rounded-full text-white text-center text-[10px] bg-black flex items-center justify-center"
        style={{
          opacity: 0,
          scale: 0.5,
          width: "100px",
          height: "100px",
          fontSize: "20px",
          pointerEvents: "none",
        }}
      >
        <div className="flex flex-col justify-center items-center">
          <p className="text-white text-center text-[14px]">The Taiwan</p>{" "}
          <p className="text-center text-white text-[10px]">Flaver</p>
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
