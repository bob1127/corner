import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { DotButton, useDotButton } from "./EmblaCarosuelDotButton";
import { gsap } from "gsap";

const EmblaCarousel = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
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

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi
      .on("reInit", () => {})
      .on("scroll", () => {})
      .on("slideFocus", () => {});
  }, [emblaApi]);

  return (
    <div
      className="w-full py-8 mx-auto"
      style={{
        "--slide-height": "19rem",
        "--slide-spacing": "1rem",
        "--slide-size": "25%", // Default value for larger screens
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div
          className="embla__container flex touch-pan-y touch-pinch-zoom h-[600px]"
          style={{ marginLeft: "calc(var(--slide-spacing) * -1)" }}
        >
          {slides.map((slide, index) => (
            <div
              className="embla__slide transform flex-none  h-full min-w-0"
              key={index}
              style={{
                transform: "translate3d(0, 0, 0)",
                flex: "0 0 var(--slide-size)",
                paddingLeft: "var(--slide-spacing)",
              }}
            >
              <div
                className="embla__slide__number border-none border border-black md:border bg-grey-500 py-8 md:border-black flex flex-col items-center justify-center font-semibold"
                style={{
                  boxShadow: "inset 0 0 0 0.2rem var(--detail-medium-contrast)",
                  borderRadius: "1.8rem",
                  fontSize: "4rem",
                  height: "100%",
                  userSelect: "none",
                }}
              >
                <a href="/" className="">
                  <div className="flex overflow-hidden flex-col justify-center items-center">
                    {slide.content ? (
                      slide.content
                    ) : (
                      <div className="h-full border border-black w-full overflow-hidden">
                        <img
                          src={slide.image}
                          className="w-full hover:scale-105 duration-1000 md:h-full"
                          alt={`Slide ${index + 1}`}
                        />
                      </div>
                    )}
                    <div className="txt mt-5 flex-col flex justify-center items-center w-4/5 mx-auto">
                      <b className="text-[18px] font-extrabold text-center">
                        {slide.title}
                      </b>
                      <p className="text-[14px] text-rose-500 font-bold text-center">
                        {slide.description}
                      </p>
                      <a
                        className="text-black px-2 py-1 w-[80px] inline-block  text-[14px] rounded-[3px] hover:text-white  hover:bg-rose-500 duration-300 border border-black"
                        href=""
                      >
                        Buy Now
                      </a>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls absolute bottom-0 left-6 grid grid-cols-[auto_1fr] justify-between flex inline-block border border-black gap-3 mt-7">
        <div className="embla__buttons flex justify-center">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
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

      <div
        ref={dragIndicatorRef}
        className="drag-indicator absolute bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full text-white bg-black flex items-center justify-center"
        style={{
          opacity: 0,
          scale: 0.5,
          width: "100px",
          height: "100px",
          fontSize: "20px",
        }}
      >
        拖曳
      </div>
    </div>
  );
};

export default EmblaCarousel;
