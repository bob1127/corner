// components/HomeLanding.jsx
"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import ParallaxForks from "@/components/ParallaxForks";
import Carousel from "@/components/EmblaCarouselTravel";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useScroll,
} from "framer-motion";

/* ========== 小元件：從火鍋中心「彈出」到最終位置（無裁切、只設寬度） ========== */
function VgPop({ containerRef, item, index }) {
  const ref = useRef(null);
  const [delta, setDelta] = useState(null);

  useEffect(() => {
    const el = ref.current;
    const wrap = containerRef.current;
    if (!el || !wrap) return;

    const r = el.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    const centerX = w.left + w.width / 2;
    const centerY = w.top + w.height / 2;
    const elemX = r.left + r.width / 2;
    const elemY = r.top + r.height / 2;
    setDelta({ x: centerX - elemX, y: centerY - elemY });
  }, []);

  return (
    <motion.div
      ref={ref}
      className="vg01 absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ ...item.final, rotate: `${item.rotate}deg`, zIndex: 3000 }}
      initial={
        delta
          ? { x: delta.x, y: delta.y, scale: 0.3, opacity: 0 }
          : { opacity: 0 }
      }
      animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 22,
        mass: 1.2,
        bounce: 0.25,
        delay: 1.0 + index * 0.28,
      }}
    >
      <motion.img
        src={item.src}
        alt="vg"
        className={`${item.widthClass} h-auto block`}
        draggable="false"
        initial={{ filter: "blur(2px)" }}
        animate={{ filter: "blur(0px)" }}
        transition={{ duration: 0.45, delay: 1.0 + index * 0.28 }}
      />
    </motion.div>
  );
}

/** =============== Snack：到達就「直上噴開」，離開才「直線收回」 + 點擊 Popup（最高層） =============== */
function SnackPop({
  id,
  anchorRef, // 袋口錨點
  active, // 區塊是否處於「活動區間」
  className, // 最終定位（absolute + left/top/bottom）
  imgSrc,
  imgClassName = "w-[400px]",
  width = 1000,
  height = 1000,
  initialScale = 0.45, // 收回到袋內時縮小
  finalScale = 1, // 最終停留時大小
  burst = 420, // ↑ 上拋高度（px）
  spin = 0, // 旋轉角度（deg）
  info = { title: "", sub: "", desc: "", tags: [] },
  activePopupId,
  setActivePopupId,
  popupSide = "right", // "right" | "left"
}) {
  const itemRef = useRef(null);
  const [delta, setDelta] = useState({ x: 0, y: 0 });
  const [measured, setMeasured] = useState(false);

  const measure = () => {
    const el = itemRef.current;
    const anchor = anchorRef.current;
    if (!el || !anchor) return;
    const r = el.getBoundingClientRect();
    const a = anchor.getBoundingClientRect();
    const elCX = r.left + r.width / 2;
    const elCY = r.top + r.height / 2;
    const aCX = a.left + a.width / 2;
    const aCY = a.top + a.height / 2;
    setDelta({ x: aCX - elCX, y: aCY - elCY });
    setMeasured(true);
  };

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    const t = setTimeout(measure, 120);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, []);

  const variants = {
    // 在袋內（靜止）
    rest: (c) => ({
      x: c.delta.x,
      y: c.delta.y,
      scale: c.initialScale,
      rotate: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 0.8, 0.2, 1] },
    }),
    // 進入視窗：只做垂直上拋（不做中段側移，避免「往右下」錯覺）
    burst: (c) => ({
      x: [c.delta.x, c.delta.x, 0],
      y: [c.delta.y, c.delta.y - c.burst, 0],
      scale: [c.initialScale, c.finalScale, c.finalScale],
      rotate: [0, c.spin, 0],
      opacity: 1,
      transition: {
        duration: 0.9,
        times: [0, 0.55, 1],
        ease: ["easeOut", [0.22, 0.8, 0.2, 1]],
      },
    }),
    // 離開視窗：直接線性回袋口
    restBack: (c) => ({
      x: [0, c.delta.x],
      y: [0, c.delta.y],
      scale: [c.finalScale, c.initialScale],
      rotate: [0, 0],
      opacity: 1,
      transition: { duration: 0.55, ease: [0.22, 0.8, 0.2, 1] },
    }),
  };

  const custom = { delta, initialScale, finalScale, burst, spin };

  const isOpen = activePopupId === id;
  const sideIsRight = popupSide === "right";

  return (
    <motion.div
      ref={itemRef}
      className={`absolute ${className}`}
      style={{
        // Snacks 層：低於 bag；但 popup 會再把層級拉最高
        zIndex: 6000,
        willChange: "transform, opacity",
        cursor: "pointer",
      }}
      variants={variants}
      initial="rest"
      animate={measured ? (active ? "burst" : "restBack") : "rest"}
      custom={custom}
      onClick={(e) => {
        e.stopPropagation();
        setActivePopupId(isOpen ? null : id);
      }}
      role="button"
      tabIndex={0}
    >
      <Image
        src={imgSrc}
        alt="snack"
        width={width}
        height={height}
        loading="lazy"
        className={imgClassName}
        draggable={false}
      />

      {/* Popup：最高層（高於 bag） */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="popup"
            className={`absolute top-1/2 -translate-y-1/2 ${
              sideIsRight ? "left-full ml-3" : "right-full mr-3"
            }`}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0.22, 0.8, 0.2, 1] }}
            style={{ zIndex: 10000 }} // ⬅︎ popup 永遠最高層
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-black/5 p-4 w-[260px]">
              <span
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-black/5 rotate-45 ${
                  sideIsRight ? "-left-1" : "-right-1"
                }`}
              />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-stone-900 font-semibold leading-tight">
                    {info.title}
                  </h4>
                  {info.sub && (
                    <div className="text-xs text-stone-500 mt-0.5">
                      {info.sub}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setActivePopupId(null)}
                  className="text-stone-400 hover:text-stone-600"
                  aria-label="close"
                  title="close"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed mt-2">
                {info.desc}
              </p>
              {info.tags?.length ? (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {info.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HomeLanding() {
  // 小料 images
  const vgItems = [
    {
      src: "/images/vg07.png",
      final: { right: "10%", top: "70%" },
      rotate: -40,
      widthClass: "w-[180px]",
    },
    {
      src: "/images/vg08.png",
      final: { right: "3%", top: "40%" },
      rotate: -70,
      widthClass: "w-[180px]",
    },
    {
      src: "/images/vg04.png",
      final: { right: "33%", top: "20%" },
      rotate: -40,
      widthClass: "w-[120px]",
    },
    {
      src: "/images/vg03.png",
      final: { left: "33%", top: "20%" },
      rotate: -40,
      widthClass: "w-[100px]",
    },
    {
      src: "/images/vg02.png",
      final: { left: "33%", bottom: "30%" },
      rotate: -40,
      widthClass: "w-[80px]",
    },
    {
      src: "/images/vg01.png",
      final: { right: "33%", bottom: "0%" },
      rotate: -40,
      widthClass: "w-[100px]",
    },
  ];

  const rightRef = useRef(null);

  // 中央 hotpot 滾動旋轉（跟手）
  const baseAngle = useMotionValue(0);
  const hotpotRotate = useSpring(baseAngle, {
    stiffness: 300,
    damping: 18,
    mass: 0.8,
  });
  useEffect(() => {
    const stepPerWheel = 0.25;
    const onWheel = (e) =>
      baseAngle.set(baseAngle.get() + e.deltaY * stepPerWheel);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [baseAngle]);

  const [index, setIndex] = useState(0);
  const images = [
    "https://image.memorycorner8.com/DAV02145.jpg",
    "https://image.memorycorner8.com/DAV02128.jpg",
    "https://image.memorycorner8.com/DAV02175.jpg",
  ];
  useEffect(() => {
    const timer = setInterval(
      () => setIndex((p) => (p + 1) % images.length),
      9000
    );
    return () => clearInterval(timer);
  }, [images.length]);

  const [activeTab, setActiveTab] = useState("youshang");

  // ===== Snack 區塊：用 useScroll + 雙門檻避免剛進就回收 =====
  const dingingRef = useRef(null);
  const anchorRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: dingingRef,
    offset: ["start 80%", "end 20%"],
  });

  const [activeBurst, setActiveBurst] = useState(false);
  useEffect(() => {
    const ENTER_ON = 0.25; // 進入門檻
    const EXIT_LOW = 0.12; // 往回上滾很遠才收回
    const EXIT_HIGH = 0.97; // 幾乎離開視窗底端時收回
    const unsub = scrollYProgress.on("change", (v) => {
      setActiveBurst((prev) => {
        if (!prev && v >= ENTER_ON && v <= 0.95) return true;
        if (prev && (v <= EXIT_LOW || v >= EXIT_HIGH)) return false;
        return prev;
      });
    });
    return () => unsub();
  }, [scrollYProgress]);

  // 只允許同時間一個 popup 最高層
  const [activePopupId, setActivePopupId] = useState(null);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="section_hero h-screen flex relative overflow-hidden">
        {/* 左半邊 */}
        <div className="left bg-[#ba1632] overflow-hidden  bg-[url('https://image.memorycorner8.com/DAV02145.jpg')] bg-cover bg-center bg-no-repeat relative w-1/2 h-full">
          <div className="mask w-full h-full bg-black/20 z-[100] absolute top-0 left-0 "></div>
          <motion.div
            className="lamp absolute left-[-5%] top-[0%] -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: 2000 }}
            initial={{ y: "-40vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 11,
              mass: 1.2,
              delay: 0.5,
            }}
          >
            <Image
              src="/images/lamp.png"
              alt="lamp"
              placeholder="empty"
              loading="lazy"
              width={1300}
              height={1300}
              className="w-[450px] h-auto"
            />
          </motion.div>
        </div>

        {/* 右半邊 */}
        <div
          ref={rightRef}
          className="right bg-[#092538] w-1/2 h-full relative overflow-hidden"
        >
          {/* 霧氣 */}
          <div
            className="steam-wrap pointer-events-none w-screen absolute left-0 bottom-0"
            style={{ zIndex: 1200 }}
          >
            <img
              src="https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog2.png"
              alt="fog"
              className="steam fog-l1"
            />
            <img
              src="https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog2.png"
              alt="fog"
              className="steam fog-l2"
            />
            <img
              src="https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog2.png"
              alt="fog"
              className="steam fog-l3"
            />
          </div>

          {/* 火鍋圖層 */}
          <div
            className="hotpot absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: 1500 }}
          >
            <div className="relative w-[600px] h-[600px]">
              <Image
                src="/images/cd6ca35d0819a7759029f682a81ac350.png"
                alt="hotpot"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div
            className="hotpot absolute left-[20%] top-[70%] -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: 1400 }}
          >
            <Image
              src="/images/desert.png"
              alt="hotpot"
              placeholder="empty"
              loading="lazy"
              width={900}
              height={900}
              className="w-[320px]"
            />
          </div>
          <div
            className="hotpot absolute left-[30%] top-[30%] -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: 1400 }}
          >
            <Image
              src="/images/food01.png"
              alt="hotpot"
              placeholder="empty"
              loading="lazy"
              width={900}
              height={900}
              className="w-[320px]"
            />
          </div>

          {/* 中央 hotpot：滑入 + 滾動旋轉 */}
          <motion.div
            className="hotpot absolute left-1/2 w-[500px] top-[18%] -translate-x-1/2 -translate-y-1/2"
            style={{ rotate: hotpotRotate, zIndex: 1600 }}
            initial={{ x: "60vw", opacity: 0 }}
            animate={{ x: -230, opacity: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 24 }}
          >
            <Image
              src="/images/hotpot.png"
              alt="hotpot"
              placeholder="empty"
              loading="lazy"
              width={1200}
              height={1200}
              className="!w-[800px]"
            />
          </motion.div>

          {/* 小料彈出 */}
          {vgItems.map((it, i) => (
            <VgPop key={it.src} containerRef={rightRef} item={it} index={i} />
          ))}
        </div>
      </section>

      {/* 霧氣 CSS */}
      <style jsx global>{`
        .steam-wrap {
          width: 100%;
          height: 110vh;
          -webkit-mask-image: radial-gradient(
            70% 60% at 50% 80%,
            #000 70%,
            rgba(0, 0, 0, 0) 100%
          );
          mask-image: radial-gradient(
            70% 60% at 50% 80%,
            #000 70%,
            rgba(0, 0, 0, 0) 100%
          );
          overflow: hidden;
        }
        .steam {
          position: absolute;
          left: 50%;
          top: 60%;
          transform: translateX(-50%) translateY(0) scale(2) rotate(-6deg);
          width: 800px;
          height: 800px;
          object-fit: cover;
          opacity: 0.55;
          filter: blur(1px) contrast(105%) brightness(110%);
          mix-blend-mode: screen;
          will-change: transform, opacity;
          pointer-events: none;
        }
        @keyframes steamUpSlow {
          0% {
            transform: translateX(-50%) translateY(0) scale(2) rotate(-6deg);
            opacity: 0.35;
          }
          10% {
            opacity: 0.55;
          }
          50% {
            transform: translateX(-50%) translateY(-55%) scale(2.08)
              rotate(-5deg);
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateX(-50%) translateY(-110%) scale(2.15)
              rotate(-4deg);
            opacity: 0;
          }
        }
        @keyframes steamUpMid {
          0% {
            transform: translateX(-50%) translateY(0) scale(2) rotate(4deg);
            opacity: 0.45;
          }
          15% {
            opacity: 0.65;
          }
          50% {
            transform: translateX(-50%) translateY(-60%) scale(2.1) rotate(6deg);
          }
          85% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(-50%) translateY(-115%) scale(2.18)
              rotate(8deg);
            opacity: 0;
          }
        }
        @keyframes steamUpFast {
          0% {
            transform: translateX(-50%) translateY(0) scale(2) rotate(-2deg);
            opacity: 0.5;
          }
          20% {
            opacity: 0.75;
          }
          50% {
            transform: translateX(-50%) translateY(-65%) scale(2.12)
              rotate(0deg);
          }
          90% {
            opacity: 0.55;
          }
          100% {
            transform: translateX(-50%) translateY(-120%) scale(2.22)
              rotate(2deg);
            opacity: 0;
          }
        }
        .fog-l1 {
          animation: steamUpSlow 9.5s ease-in-out infinite;
          opacity: 0.45;
        }
        .fog-l2 {
          animation: steamUpMid 7.8s ease-in-out infinite;
          opacity: 0.55;
          transform: translateX(-50%) translateY(0) scale(2.1) rotate(5deg);
          animation-delay: 2.2s;
        }
        .fog-l3 {
          animation: steamUpFast 6.4s ease-in-out infinite;
          opacity: 0.65;
          transform: translateX(-50%) translateY(0) scale(2.15) rotate(-2deg);
          animation-delay: 1.1s;
        }
        .hotpot img {
          will-change: transform;
        }
      `}</style>

      {/* ===================== 中段內容（保留原樣） ===================== */}
      <section className="flex py-20 flex-col relative overflow-hidden h-screen">
        <div className="flex justify-center xl:w-[85%] md:w-[90%] w-full px-5 mx-auto max-w-[1920px] ">
          <div className="w-1/2 flex justify-center pr-10 items-center">
            <div className="left-content flex flex-col">
              {/* 簡化的 tab 區塊 */}
              <div className="top-button flex">
                <button
                  onClick={() => setActiveTab("youshang")}
                  className={`text-[16px] mx-2 border px-4 py-2 transition-colors ${
                    activeTab === "youshang" ? "bg-[#dd1f1f] text-white" : ""
                  }`}
                >
                  有香餐飲
                </button>
                <button
                  onClick={() => setActiveTab("yi")}
                  className={`text-[16px] mx-2 border px-4 py-2 transition-colors ${
                    activeTab === "yi" ? "bg-[#dd1f1f] text-white" : ""
                  }`}
                >
                  憶點點
                </button>
              </div>

              <div className="brand-description h-[160px] mt-5 text-[20px] ml-2">
                <AnimatePresence mode="wait">
                  {activeTab === "youshang" && (
                    <motion.div
                      key="youshang"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div>有香餐飲 Lorem ipsum dolor sit amet...</div>
                    </motion.div>
                  )}
                  {activeTab === "yi" && (
                    <motion.div
                      key="yi"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div>憶點點 Lorem ipsum dolor sit amet...</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="color relative w-[95%] mt-10 mx-auto h-full bg-[#dd1f1f] p-[90px]">
                <div className="circle bg-[#dd1f1f] text-white flex justify-center items-center border-2 w-[80px] h-[80px] rounded-full absolute left-[-25px] top-[-25px] border-white">
                  起源
                </div>
                <ul>
                  <li className="text-gray-300 mt-5">
                    1. Lorem ipsum dolor sit amet
                  </li>
                  <li className="text-gray-300 mt-5">
                    2. Lorem ipsum dolor sit amet
                  </li>
                  <li className="text-gray-300 mt-5">
                    3. Lorem ipsum dolor sit amet
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="w-1/2 flex justify-center items-center">
            <Carousel />
          </div>
        </div>
      </section>

      {/* ===================== Snack 區塊 ===================== */}
      <section ref={dingingRef} className="section_Dinging bg-[#ebe5df] py-20">
        <div className="flex justify-center">
          <div className="left w-1/2 min-h-screen relative overflow-visible">
            {/* 袋口錨點（依袋口位置微調 bottom 百分比） */}
            <div
              ref={anchorRef}
              className="absolute left-1/2 -translate-x-1/2 bottom-[16%] w-[8px] h-[8px]"
              style={{ zIndex: 10 }}
            />

            {/* 四個 Snack（snack z=6000；popup z=10000；bag z=9000） */}
            <SnackPop
              id="snack-a"
              anchorRef={anchorRef}
              active={activeBurst}
              className="w-[80%] bottom-[0%] -translate-x-1/2 left-[35%]"
              imgSrc="/images/snack/6_edafda29-95a5-4756-8bc2-d57c4392d920.png-Photoroom.png"
              imgClassName="w-[400px]"
              burst={440}
              spin={-14}
              info={{
                title: "綜合餅乾禮包",
                sub: "Family Pack",
                desc: "多款人氣薄脆一次滿足，鹹甜交錯、口感酥脆，追劇必備！",
                tags: ["薄鹽", "不易碎", "分享包"],
              }}
              activePopupId={activePopupId}
              setActivePopupId={setActivePopupId}
              popupSide="right"
            />
            <SnackPop
              id="snack-b"
              anchorRef={anchorRef}
              active={activeBurst}
              className="w-[80%] bottom-[2%] -translate-x-1/2 left-[42%]"
              imgSrc="/images/snack/APPLE-CHIPS-SUP-Front_2000x.png-Photoroom.png"
              imgClassName="w-[400px]"
              burst={520}
              spin={+12}
              info={{
                title: "蘋果脆片",
                sub: "Apple Chips",
                desc: "低溫烘焙保留果香與纖維，清爽不膩，零負擔小點心。",
                tags: ["純素", "無添加糖", "高纖"],
              }}
              activePopupId={activePopupId}
              setActivePopupId={setActivePopupId}
              popupSide="right"
            />
            <SnackPop
              id="snack-c"
              anchorRef={anchorRef}
              active={activeBurst}
              className="w-[80%] bottom-[12%] -translate-x-1/2 left-[30%]"
              imgSrc="/images/snack/png-clipart-chocolate-bar-biscuit-product-snack-cacao-tree-sandwich-biscuits-food-chocolate-bar-Photoroom.png"
              imgClassName="w-[400px]"
              burst={480}
              spin={+18}
              info={{
                title: "巧克力餅乾",
                sub: "Choco Sandwich",
                desc: "濃醇可可夾心，外酥內軟的雙重口感，下午茶最對味。",
                tags: ["可可 72%", "不甜膩"],
              }}
              activePopupId={activePopupId}
              setActivePopupId={setActivePopupId}
              popupSide="right"
            />
            <SnackPop
              id="snack-d"
              anchorRef={anchorRef}
              active={activeBurst}
              className="w-[80%] bottom-[10%] -translate-x-1/2 left-[58%]"
              imgSrc="/images/snack/jalapeño p product-Photoroom.png"
              imgClassName="w-[400px]"
              initialScale={0.4}
              burst={500}
              spin={-20}
              info={{
                title: "墨西哥辣椒洋芋片",
                sub: "Jalapeño Chips",
                desc: "爽脆厚切與微辣香氣，越吃越涮嘴，一口接一口停不下來！",
                tags: ["厚切", "微辣"],
              }}
              activePopupId={activePopupId}
              setActivePopupId={setActivePopupId}
              popupSide="left"
            />

            {/* 中間大塑膠袋：最高層，但不擋點擊 */}
            <div className="absolute w-[80%] bottom-[-35%] -translate-x-1/2 left-1/2 pointer-events-none z-[9000]">
              <Image
                src="/images/bag.png"
                alt="bag"
                placeholder="empty"
                loading="lazy"
                width={1000}
                height={1000}
                className="!w-[1000px]"
              />
            </div>
          </div>

          {/* 右半內容（照舊） */}
          <div className="right w-1/2 flex justify-center items-center">
            <div className="flex flex-col">
              <h2 className="font-normal text-[#ff3c3c] text-6xl">
                Dinging Memory
              </h2>
              <div className="mt-10">
                <p className="text-[#ff3c3c] font-bold text-xl tracking-wider ">
                  Lorem dolor sit amet consectetur
                </p>
              </div>
              <div>
                <ul>
                  <li className="mt-5 font-normal ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab,
                    eveniet.
                  </li>
                  <li className="mt-5 font-normal ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab,
                    eveniet.
                  </li>
                  <li className="mt-5 font-normal ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab,
                    eveniet.
                  </li>
                  <li className="mt-5 font-normal ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab,
                    eveniet.
                  </li>
                </ul>
                <div className="mt-10">
                  <p className="text-[#ff3c3c] w-1/2 font-bold text-xl tracking-wider ">
                    Lorem dolor sit amet consectetur Lorem dolor sit amet
                    consectetur
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 其餘區塊（保留） ===================== */}
      <section className="section_brand_story">
        <div className="title">
          <h2 className="text-4xl font-bold text-stone-800">BARND STORY</h2>
          <div className="description mt-8">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laudantium
            obcaecati quis esse id sed ex minima nam incidunt mollitia
            perferendis?
          </div>
        </div>
      </section>

      <section className="bg-white py-[100px] overflow-hidden">
        <div className="mb-[-20px]">
          <ParallaxForks width={2020} height={720} maxTilt={20} />
        </div>
      </section>

      <section className="flex flex-row">
        <div className="left bg-[#ba1632] flex justify-center items-center p-10 xl:p-20 w-1/2 ">
          <div className="items flex max-w-[800px] flex-col ">
            <div className="item mt-5">
              <h2 className="text-white text-5xl font-bold mb-5">
                Memory Dining Group Now Open For Franchising
              </h2>
              <h3 className="text-4xl font-bold text-white">Our Philosophy</h3>
              <p className="text-gray-100">
                In the course of 40 years of inheritance, Memory Corner has
                experienced challenges...
              </p>
            </div>
            <div className="item mt-5">
              <h3 className="text-4xl font-bold text-white">
                Taiwanese Culture
              </h3>
              <p className="text-gray-100">
                In addition to the authentic Taiwanese cuisine, we expect every
                guest to see the beauty...
              </p>
            </div>
            <div className="item mt-5">
              <h3 className="text-4xl font-bold text-white">Our Advantages</h3>
              <p className="text-gray-100">
                Memory Dining Group has been deeply cultivated in Vancouver for
                many years...
              </p>
            </div>
          </div>
        </div>
        <div className="right relative w-1/2 aspect-square overflow-hidden">
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt="slideshow"
              fill
              sizes="50vw"
              className={`absolute inset-0 object-cover will-change-auto transition-opacity duration-[3000ms] ease-[cubic-bezier(0.45,0,0.1,1)] ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              priority={i === 0}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-row bg-[#092538] h-screen">
        <div className="left w-[25%] flex flex-col justify-center items-center border">
          <h2 className="text-5xl text-center mb-8 font-extrabold text-white">
            Discover
            <br /> Our <br /> Brand
          </h2>
          <button className="bg-rose-500 text-white text-xl px-4 py-1 flex justify-center items-center">
            More
          </button>
        </div>

        <div className="right w-[75%] flex justify-center items-center border">
          <div className="grid grid-cols-3 relative w-full h-full gap-8">
            {/* 略：此區維持你的原動畫結構 */}
            {/* ... */}
          </div>
        </div>
      </section>
    </>
  );
}
