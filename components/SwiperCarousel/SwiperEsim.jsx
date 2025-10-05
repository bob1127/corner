"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import { motion, useAnimation } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-coverflow";

export default function CardCarousel() {
  const swiperRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, scale: 1 });
  }, []);

  const cards = [
    { title: "日本方案", desc: "高速5G、吃到飽、日本全區適用" },
    { title: "韓國方案", desc: "韓國不限速方案，自由上網" },
    { title: "越南方案", desc: "穩定連線、自由選天數" },
    { title: "泰國方案", desc: "高性價比、支援全國" },
    { title: "美國方案", desc: "支援T-Mobile與AT&T" },
    { title: "法國方案", desc: "歐洲旅遊首選方案" },
  ];

  return (
    <div className="w-full py-20 bg-white">
      <Swiper
        ref={swiperRef}
        spaceBetween={30}
        slidesPerView={1.2}
        centeredSlides
        loop
        modules={[EffectCoverflow]}
        onSlideChange={() => {}}
        className="w-full max-w-4xl"
        breakpoints={{
          768: {
            slidesPerView: 2.2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: isActive ? 1.05 : 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200"
              >
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-gray-500 text-sm">{card.desc}</p>
              </motion.div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
