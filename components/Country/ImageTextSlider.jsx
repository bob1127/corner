"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import ImageReveal from "./ImageReveal";
import { ChevronLeft, ChevronRight } from "lucide-react";

const data = [
  {
    title: "海外旅遊",
    subtitle: "手工美食",
    price: "基本消費：＄200-$500",
    description: "不用換卡、不用等待，eSIM 讓你一落地就能上網！",
    detail:
      "無論是日本、韓國、歐洲還是美國，只要掃描 QR Code  馬上開通行動數據，再也不用排隊買卡或找 Wi-Fi",
    mainImage: "/images/step/1-HfKw7hxyw6VkueL0EpYfffkTA.png",
    subImages: ["/images/step/esim03.png"],
  },
  {
    title: "現在就體驗 eSIM 無卡新生活",
    subtitle: "法式點心",
    price: "基本消費：＄180-$450",
    description: "熱門國家流量方案特價",
    detail: "出國上網首選！eSIM 熱門方案限時特價 ",
    mainImage: "/images/step/1-HfKw7hxyw6VkueL0EpYfffkTA.png",
    subImages: ["/images/step/esim04.png"],
  },
];

export default function ImageTextSlider() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % data.length);
  const prev = () => setIndex((prev) => (prev - 1 + data.length) % data.length);

  // ✅ 自動輪播邏輯
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 5000); // 每 5 秒自動切換

    return () => clearInterval(timer); // 清除計時器
  }, []);

  const item = data[index];

  return (
    <div className="relative mt-20 overflow-hidden w-[85%] mx-auto flex lg:flex-row flex-col section-part">
      <div className="w-full lg:w-1/2">
        <ImageReveal
          key={item.mainImage}
          src={item.mainImage}
          alt={item.title}
          className="w-full aspect-[2/1.6]"
        />
      </div>

      <div className="w-full py-10 lg:py-0 lg:w-1/2 px-0 md:px-10 pb-4 flex flex-col items-start justify-end relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <div className="title flex justify-between w-full">
              <div>
                <h4 className="font-bold text-[2.4rem]">{item.title}</h4>
              </div>
            </div>

            <div className="content mt-8">
              <h4 className="font-bold text-[1.4rem]">{item.description}</h4>
              <p className="tracking-wider text-[.9rem] lg:w-1/2 sm:w-2/3 my-3 leading-loose">
                {item.detail}
              </p>
            </div>

            <div className="flex gap-2 mt-2">
              <button onClick={prev}>
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={next}>
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="img-wrap flex flex-row mt-4">
              {item.subImages.map((img, i) => (
                <div key={i} className=" w-full lg:w-1/2 px-1">
                  <Image
                    src={img}
                    alt="sub"
                    width={800}
                    height={600}
                    className="w-full object-cover aspect-[4/4]"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
