"use client";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
const myLoader01 = ({ src, width, quality, placeholder }) => {
  return `https://cdn1.beams.co.jp/special/kids_summer_2024/assets/images/chapter_1/${src}?w=${width}?p=${placeholder}`;
};
const food01 = ({ src, width, quality, placeholder }) => {
  return `https://cdn1.beams.co.jp/special/kids_summer_2024/assets/images/chapter_1/${src}?w=${width}?p=${placeholder}`;
};
export default () => {
  // const sliderRef = useRef(null);
  // const handlePrev = useCallback(() => {
  //     if (!sliderRef.current) return;
  //     sliderRef.current.swiper.slidePrev();
  // }, []);

  // const handleNext = useCallback(() => {
  //     if (!sliderRef.current) return;
  //     sliderRef.current.swiper.slideNext();
  // }, []);

  return (
    <>
      <div data-aos="fade-up" className=" e-full  mt-[60px] m-0 p-0">
        <Swiper
          // install Swiper modules

          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            500: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 1,
            },
            1024: {
              slidesPerView: 1,
            },
          }}
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={1}
          className="m-0 p-0  h-auto "
          navigation
          autoplay
          pagination={{ clickable: false }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
        >
          <SwiperSlide className="  ">
            <div className="relative w-full aspect-[21/9] hidden sm:block">
              <Image
                src="/images/banner04.png"
                alt="hero-img"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide className="  ">
            <div className="relative w-full aspect-[21/9] hidden sm:block">
              <Image
                src="/images/banner04.png"
                alt="hero-img"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide className="  ">
            <div className="relative w-full aspect-[21/9] hidden sm:block">
              <Image
                src="/images/banner04.png"
                alt="hero-img"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
};
