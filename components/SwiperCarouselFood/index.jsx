import React, { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import Link from "next/link";

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

export default () => {
  const [imgIndex, setImgIndex] = useState(0);
  const [isClient, setIsClient] = useState(false); // 用來判斷是否在瀏覽器端
  const dragX = useMotionValue(0);

  // 確保只有在瀏覽器端獲取 window 物件
  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  // 根據螢幕尺寸設定圖片陣列
  const imgs = isClient
    ? [
        window.innerWidth <= 550
          ? "/images/banner02_600x600.jpg"
          : "/images/banner01_1920x768.jpg",
        window.innerWidth <= 550
          ? "/images/S__4915217.jpg"
          : "/images/S__4915213.jpg",
        "/images/S__4677656.png",
      ]
    : [];

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const x = dragX.get();
      if (x === 0) {
        setImgIndex((pv) => (pv === imgs.length - 1 ? 0 : pv + 1));
      }
    }, AUTO_DELAY);
    return () => clearInterval(intervalRef);
  }, [imgs]);

  const onDragEnd = () => {
    const x = dragX.get();
    if (x <= -DRAG_BUFFER && imgIndex < imgs.length - 1) {
      setImgIndex((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1);
    }
  };

  return (
    <div className="relative mx-auto w-full sm:w-[80%] 2xl:w-[50%] mt-[80px] md:mt-[100px] 2xl:mt-[50px] py-0">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x: dragX }}
        animate={{ translateX: `-${imgIndex * 100}%` }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className="flex cursor-grab items-center active:cursor-grabbing"
      >
        <Images imgIndex={imgIndex} imgs={imgs} />
      </motion.div>
      <GradientEdges />
    </div>
  );
};

const Images = ({ imgIndex, imgs }) => {
  return (
    <>
      {imgs.map((imgSrc, idx) => (
        <motion.div
          key={idx}
          style={{
            backgroundImage: `url(${imgSrc})`,
            backgroundSize: window.innerWidth < 768 ? "contain" : "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "100%",
            height: window.innerWidth <= 550 ? "350px" : "100%",
          }}
          animate={{ scale: imgIndex === idx ? 0.95 : 0.85 }}
          transition={SPRING_OPTIONS}
          className="aspect-video  w-[100%]  shrink-0 rounded-xl bg-transparent"
        />
      ))}
    </>
  );
};

const GradientEdges = () => {
  return (
    <>
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px]" />
    </>
  );
};
