"use client";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { gsap } from "gsap";
import Draggable from "gsap/Draggable";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const myLoader01 = ({ src, width, quality, placeholder }) => {
  return `https://cdn1.beams.co.jp/special/kids_summer_2024/assets/images/chapter_1/${src}?w=${width}?p=${placeholder}`;
};

const MySwiperComponent = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const swiper = swiperRef.current.swiper;
    gsap.registerPlugin(Draggable);

    const draggable = Draggable.create(swiper.wrapperEl, {
      type: "x",
      bounds: swiper.wrapperEl,
      onDrag: () => {
        const progress = swiper.progress;
        gsap.to(swiper.wrapperEl, {
          x: `-${progress * swiper.width}px`,
          duration: 0.3,
        });
      },
      onDragEnd: () => {
        swiper.slideToClosest();
      },
    });

    return () => {
      draggable.forEach((d) => d.kill());
    };
  }, []);

  return (
    <>
      <div className="e-full m-0 p-0">
        <Swiper
          ref={swiperRef}
          breakpoints={{
            0: { slidesPerView: 2 },
            500: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
          }}
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={1}
          className="m-0 p-0"
          navigation
          pagination={{ clickable: false }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
        >
          {/* Add SwiperSlide components here */}
        </Swiper>
        <div className="bg-white w-full min-h-[200px] flex items-center justify-center">
          <button className="px-6 py-2 font-medium bg-buy-dark text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
            選購更多商品！！！
          </button>
        </div>
      </div>
    </>
  );
};

export default MySwiperComponent;
