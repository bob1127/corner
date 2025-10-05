"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Carousel from "../components/EmblaCarouselTravel/index";

const makeHref = (cta = {}) => {
  if (cta.tel) return `tel:${String(cta.tel).replace(/[\s-]/g, "")}`;
  return cta.href || "#";
};

export default function ProductSlider({
  slides = [
    {
      title: "有香 Memory Corner ",
      subtitle: "Crisp & clean flavor profile",
      src: "/images/羊肉爐.png",
      ctas: [
        {
          text: "外帶自取",
          tel: "04-1234-5678",
          iconSrc: "/images/外帶自取01.png",
          className: "mr-3",
        },
        {
          text: "線上訂位",
          href: "https://lin.ee/xxxx",
          iconSrc: "/images/線上訂位.png",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      ],
      thumbs: [
        { src: "/images/vg07.png", label: "抹茶" },
        { src: "/images/vg08.png", label: "草莓" },
        { src: "/images/vg04.png", label: "可可" },
      ],
      decor: {
        topBanner: {
          title: "BUY NOW",
          subtitle: "『 歡迎詢問訂購 』",
          className: "left-1/2 -translate-x-1/2 top-[3%]",
        },
        images: [
          {
            src: "/images/ed20658c0f18d9c0addf9381d5a80e42.jpg",
            alt: "sticker",
            width: 140,
            height: 50,
            className: "right-[5%] top-[10%] w-[110px] rotate-[-30deg]",
          },
          {
            src: "/images/text01.png",
            alt: "slogan",
            width: 140,
            height: 50,
            className: "right-[25%] bottom-[12%] w-[170px] rotate-[-10deg]",
          },
        ],
        infoCard: {
          tagText: "Beer",
          heading: "Memory Dining Group",
          lead: "讓【有香ㄟ灶腳】成為你家的冰箱後援\n備餐神隊友",
          description:
            "嚴選冷凍美食、經典台灣零食飲料和台味小物，從熟悉的味道，到日常的補給，一次買齊！讓【有香ㄟ灶腳】成為你家的冰箱後援、備餐神隊友：再忙也能快速上桌，再累也吃得到美味。把廚房交給我們，把時間留給最重要的人。",
        },
      },
    },
    {
      title: "憶點點 Memory Bites",
      subtitle: "Playful & sweet moments",
      src: "/images/beer01.png",
      thumbs: [
        { src: "/images/beer04.png", label: "啤酒" },
        { src: "/images/beer05.png", label: "啤酒" },
        { src: "/images/beer06.png", label: "啤酒" },
      ],
      decor: {
        topBanner: {
          title: "BUY NOW",
          subtitle: "『 歡迎詢問訂購 』",
          className: "left-1/2 -translate-x-1/2 top-[3%]",
        },
        infoCard: {
          tagText: "Snacks",
          heading: "Memory Bites",
          lead: "輕鬆分享，甜蜜回憶",
          description: "解嘴饞的小確幸，隨手就能擁有的幸福滋味。",
        },
      },
    },
    {
      title: " Old Memory Kitchen",
      subtitle: "Rich notes of spice & herbs",
      src: "/images/img-3.png",
      thumbs: [
        { src: "/images/desert.png", label: "青花椒" },
        { src: "/images/desert.png", label: "番茄鍋" },
        { src: "/images/desert.png", label: "牛奶鍋" },
      ],
      decor: {
        infoCard: {
          tagText: "Hotpot",
          heading: "Old Memory Kitchen",
          lead: "家常的暖意，回憶的味道",
          description: "主打香麻鍋底與自家特調配方，快來嚐鮮。",
        },
      },
    },
  ],

  // 主圖進出動畫
  switchDelay = 0.5,
  dur = 1.0,
  letterStagger = 0.03,

  // 不規則發散縮圖
  thumbsMax = 6,
  thumbSize = 88,
  baseRadius = 40,
  radiusStep = 84,
  jitter = 18,
  angleStartDeg = -45,
  angleEndDeg = 85,
  spiralSkew = 0.45,

  thumbBorderRadius = 16,
  thumbStagger = 0.06,
  springEnter = { type: "spring", stiffness: 520, damping: 30, mass: 0.7 },
  springExit = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 },

  // 營業時間（示例）
  businessTimeZone = "America/Toronto",
  businessOpen = "11:30",
  businessClose = "23:30",
}) {
  const itemsRef = useRef([]);
  const [current, setCurrent] = useState(0);
  const [isSettled, setIsSettled] = useState(false);
  const initedRef = useRef(false);
  const directionForwardRef = useRef(true);
  const activeTLRef = useRef({ in: null, out: null });

  // 營業時間
  const [isOpenNow, setIsOpenNow] = useState(true);

  // 左側 SplitType
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const splitRefs = useRef({ title: null, subtitle: null });

  // Tabs
  const TABS = ["有香", "憶點點", "有香ㄟ灶腳"];

  // 工具
  const isEl = (el) =>
    typeof window !== "undefined" &&
    el &&
    el.nodeType === 1 &&
    el instanceof window.HTMLElement;
  const inDoc = (el) =>
    typeof document !== "undefined" && el && document.contains(el);

  const toRad = (deg) => (deg * Math.PI) / 180;
  const rand = (seed) => {
    let x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
  };

  // 時間處理
  const parseHM = (s) => {
    const [h, m] = (s || "0:0").split(":").map((n) => parseInt(n, 10));
    return h * 60 + (m || 0);
  };
  const getMinutesInTZ = (tz) => {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(now);
    const hh = Number(parts.find((p) => p.type === "hour")?.value || 0);
    const mm = Number(parts.find((p) => p.type === "minute")?.value || 0);
    return hh * 60 + mm;
  };
  const isWithin = (mins, open, close) => {
    if (open <= close) return mins >= open && mins < close;
    return mins >= open || mins < close;
  };

  useEffect(() => {
    const openM = parseHM(businessOpen);
    const closeM = parseHM(businessClose);
    const tick = () => {
      const mins = getMinutesInTZ(businessTimeZone);
      setIsOpenNow(isWithin(mins, openM, closeM));
    };
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, [businessTimeZone, businessOpen, businessClose]);

  // 左側文案
  const setCopy = (idx) => {
    const tEl = titleRef.current;
    const sEl = subtitleRef.current;
    const next = slides?.[idx] ?? { title: "", subtitle: "" };
    try {
      splitRefs.current.title?.revert?.();
      splitRefs.current.subtitle?.revert?.();
    } catch {}
    if (isEl(tEl)) tEl.textContent = next.title || "\u00A0";
    if (isEl(sEl)) sEl.textContent = next.subtitle || "\u00A0";
  };

  const playTextAnimation = () => {
    const tEl = titleRef.current;
    const sEl = subtitleRef.current;
    if (!isEl(tEl) || !isEl(sEl) || !inDoc(tEl) || !inDoc(sEl)) return;
    const splitTitle = new SplitType(tEl, { types: "chars" });
    const splitSub = new SplitType(sEl, { types: "chars" });
    splitRefs.current.title = splitTitle;
    splitRefs.current.subtitle = splitSub;
    gsap.set(splitTitle.chars, { y: 150 });
    gsap.set(splitSub.chars, { y: 150 });
    gsap
      .timeline()
      .to(splitTitle.chars, {
        y: 0,
        stagger: letterStagger,
        duration: 1.2,
        ease: "power3.out",
      })
      .to(
        splitSub.chars,
        { y: 0, stagger: letterStagger, duration: 1.2, ease: "power3.out" },
        "-=0.6"
      );
  };

  // 主圖進退場
  const setInitial = () => {
    const items = itemsRef.current.filter(Boolean);
    items.forEach((item, idx) => {
      const card = item.querySelector(".card");
      if (idx === current) {
        gsap.set(item, { opacity: 1 });
        gsap.set(card, { x: 0, rotate: 0 });
      } else {
        gsap.set(item, { opacity: 1 });
        gsap.set(card, { x: "100vw", rotate: 40 });
      }
    });
  };

  const animateIn = (item) => {
    if (!item) return null;
    const forward = directionForwardRef.current;
    const card = item.querySelector(".card");
    return gsap
      .timeline({
        defaults: { duration: dur, ease: "expo.out" },
        onComplete: () => setIsSettled(true),
      })
      .fromTo(
        card,
        { x: forward ? "100vw" : "-100vw", rotate: 40 },
        { x: 0, rotate: 0 },
        0
      );
  };

  const animateOut = (item) => {
    if (!item) return null;
    const forward = directionForwardRef.current;
    const card = item.querySelector(".card");
    return gsap
      .timeline({
        defaults: { duration: dur, ease: "power3.inOut" },
        onStart: () => setIsSettled(false),
      })
      .to(card, { x: forward ? "-100vw" : "100vw", rotate: -40 }, 0);
  };

  const goTo = (targetIdx) => {
    if (!initedRef.current) return;
    const items = itemsRef.current.filter(Boolean);
    if (!items.length || targetIdx === current) return;
    directionForwardRef.current = targetIdx > current;
    activeTLRef.current.in?.kill();
    activeTLRef.current.out?.kill();

    const outEl = items[current];
    activeTLRef.current.out = animateOut(outEl);

    gsap.delayedCall(switchDelay, () => {
      const inEl = items[targetIdx];
      const forward = directionForwardRef.current;
      gsap.set(inEl.querySelector(".card"), {
        x: forward ? "100vw" : "-100vw",
        rotate: 40,
      });
      setCopy(targetIdx);
      requestAnimationFrame(() => playTextAnimation());
      activeTLRef.current.in = animateIn(inEl);
      setCurrent(targetIdx);
    });
  };

  // 初始
  useLayoutEffect(() => {
    if (initedRef.current) return;
    setInitial();
    setCopy(0);
    requestAnimationFrame(() => playTextAnimation());
    initedRef.current = true;
    return () => {
      activeTLRef.current.in?.kill();
      activeTLRef.current.out?.kill();
      gsap.globalTimeline.clear();
      try {
        splitRefs.current.title?.revert?.();
        splitRefs.current.subtitle?.revert?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 資料
  const idx =
    Number.isInteger(current) && current >= 0 && current < (slides?.length ?? 0)
      ? current
      : 0;
  const slide = slides?.[idx] ?? { title: "", subtitle: "", ctas: [] };
  const currentThumbs =
    slide.thumbs?.slice(0, thumbsMax) ??
    Array.from({ length: Math.min(3, thumbsMax) }, () => ({
      src: slide.src,
      label: "",
    }));

  // 不規則發散座標
  const computeScatter = (count) => {
    const out = [];
    for (let i = 0; i < count; i++) {
      const t = i / Math.max(1, count - 1);
      const ang =
        angleStartDeg + (angleEndDeg - angleStartDeg) * t ** (1 - spiralSkew);
      const r =
        baseRadius + i * radiusStep + (rand(current * 10 + i) * 2 - 1) * jitter;

      const x =
        Math.cos(toRad(ang)) * r +
        (rand(current * 20 + i) * 2 - 1) * (jitter * 0.35);
      const y =
        Math.sin(toRad(ang)) * r +
        (rand(current * 30 + i) * 2 - 1) * (jitter * 0.35);

      const adjX = x < 0 ? Math.abs(x) * 0.6 : x; // 偏右，避免壓到主圖
      out.push({ x: adjX, y });
    }
    return out;
  };
  const scatter = computeScatter(currentThumbs.length);

  const itemVariants = {
    initial: () => ({ opacity: 0, scale: 0.65, x: 0, y: 0 }),
    enter: (i) => ({
      opacity: 1,
      scale: 1,
      x: scatter[i]?.x ?? 0,
      y: scatter[i]?.y ?? 0,
      transition: { ...springEnter, delay: i * thumbStagger },
    }),
    exit: (i) => ({
      opacity: 0,
      scale: 0.8,
      x: 0,
      y: 0,
      transition: {
        ...springExit,
        delay: (currentThumbs.length - 1 - i) * 0.02,
      },
    }),
  };

  const disableCTA = !isOpenNow;

  return (
    <>
      <section className="section-hero-img h-[65vh]  flex  ">
        <div className="left w-1/2 relative z-50 bg-[url('https://image.memorycorner8.com/DAV02145.jpg')] bg-center bg-cover bg-no-repeat"></div>
        <div className="right bg-[#db9431] h-full w-1/2"></div>
      </section>
      <div className="mx-auto w-full !bg-white  ">
        <section
          className="
          grid w-full 
          !bg-white 
          grid-cols-1 lg:grid-cols-2
          isolate
        "
        >
          {/* 左半：Tabs + 文案 + infoCard（紅白配色） */}
          <div className="left relative z-30 !bg-white ">
            <div className="copy">
              {/* Tabs */}
              <div className="tabs">
                {["有香", "憶點點", "有香ㄟ灶腳"].map((label, i) => (
                  <button
                    key={label}
                    className={`tab ${i === current ? "active" : ""}`}
                    onClick={() => goTo(i)}
                    aria-pressed={i === current}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* 標題 / 副標（SplitType） */}
              <h2 className="title" ref={titleRef}></h2>
              <p className="subtitle" ref={subtitleRef}></p>

              {/* infoCard 紅底白字 */}
              <div className="infoCard bg-[#e13939] p-10 h-[380px]  relative mt-10">
                <div className="circle bg-[#e13939] border-2 border-[#e8e8e8]  absolute w-[90px] h-[90px] rounded-full left-[-30px] top-[-30px]">
                  <div className="w-full h-full flex justify-center items-center text-[16px] font-bold text-slate-50">
                    美味
                  </div>
                </div>
                {slide?.decor?.infoCard?.tagText && (
                  <span className="tag">{slide.decor.infoCard.tagText}</span>
                )}

                {slide?.decor?.infoCard?.heading && (
                  <h3 className="infoHeading">
                    {slide.decor.infoCard.heading}
                  </h3>
                )}

                {slide?.decor?.infoCard?.lead && (
                  <p className="lead">{slide.decor.infoCard.lead}</p>
                )}

                {slide?.decor?.infoCard?.description && (
                  <div className="desc">{slide.decor.infoCard.description}</div>
                )}
              </div>
            </div>
          </div>

          {/* 右半：主圖 + 不規則發散縮圖 */}
          <div className="right flex-col flex relative overflow-vishible">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={`decor-${current}`}
                className="relative lg:absolute inset-0 z-40 pointer-events-none"
                variants={{
                  initial: { opacity: 0 },
                  animate: {
                    opacity: 1,
                    transition: {
                      duration: 0.4,
                      when: "beforeChildren",
                      staggerChildren: 0.06,
                    },
                  },
                  exit: { opacity: 0, transition: { duration: 0.25 } },
                }}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {/* Top Banner（若需要） */}
                {slide?.decor?.topBanner && (
                  <motion.div
                    className={`pointer-events-auto relative lg:absolute lg:left-[43%] top-0 left-0 lg:top-[7%] lg:-translate-x-1/2 ${
                      slide.decor.topBanner.className || "top-[7%]"
                    }`}
                    variants={{
                      initial: { opacity: 0, y: -8 },
                      animate: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.35 },
                      },
                      exit: {
                        opacity: 0,
                        y: -8,
                        transition: { duration: 0.2 },
                      },
                    }}
                  ></motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Slider 本體 */}
            <div className="card-slider  relative ">
              <div className="bottom-carousel absolute w-full bottom-0 left-0 z-50">
                {" "}
                <Carousel />
              </div>
              <div className="items !top-[-40%]">
                {slides.map((s, i) => (
                  <div
                    key={i}
                    className={`item ${i === current ? "is-active" : ""}`}
                    ref={(el) => {
                      if (el) itemsRef.current[i] = el;
                    }}
                  >
                    <div className="card !w-[min(72vh,60vw)] !h-[min(72vh,60vw)] lg:!w-[min(80vh,60vw)] lg:!h-[min(70vh,50vw)]">
                      {/* 縮圖群：主圖定位後爆開 */}
                      {i === current && (
                        <AnimatePresence initial={false}>
                          {isSettled && (
                            <motion.div
                              key={`thumbs-${i}-${current}`}
                              className="thumbs-radial ml-[25%]"
                              style={{
                                position: "absolute",
                                left: "40%",
                                top: "10%",
                                width: 0,
                                height: 0,
                                zIndex: 2,
                                pointerEvents: "auto",
                              }}
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 1 }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.15 },
                              }}
                            >
                              {currentThumbs.map((t, ti) => (
                                <motion.button
                                  key={ti}
                                  className="thumb"
                                  custom={ti}
                                  initial="initial"
                                  animate="enter"
                                  exit="exit"
                                  variants={{
                                    initial: () => ({
                                      opacity: 0,
                                      scale: 0.65,
                                      x: 0,
                                      y: 0,
                                    }),
                                    enter: (ii) => ({
                                      opacity: 1,
                                      scale: 1,
                                      x: scatter[ii]?.x ?? 0,
                                      y: scatter[ii]?.y ?? 0,
                                      transition: {
                                        ...springEnter,
                                        delay: ii * thumbStagger,
                                      },
                                    }),
                                    exit: (ii) => ({
                                      opacity: 0,
                                      scale: 0.8,
                                      x: 0,
                                      y: 0,
                                      transition: {
                                        ...springExit,
                                        delay:
                                          (currentThumbs.length - 1 - ii) *
                                          0.02,
                                      },
                                    }),
                                  }}
                                  whileHover={{
                                    scale: 1.06,
                                    transition: {
                                      type: "spring",
                                      stiffness: 420,
                                      damping: 24,
                                    },
                                  }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() =>
                                    goTo((current + 1) % slides.length)
                                  }
                                  style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    transform: "translate(-50%, -50%)",
                                    width: thumbSize,
                                    height: thumbSize,
                                    borderRadius: thumbBorderRadius,
                                    background: "transparent",
                                    border: "none",
                                    overflow: "hidden",
                                    display: "grid",
                                    placeItems: "center",
                                    zIndex: 99999,
                                  }}
                                  aria-label={t.label || `thumb-${ti + 1}`}
                                >
                                  <img
                                    src={t.src}
                                    alt={t.label || `thumb-${ti + 1}`}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}

                      {/* 主圖 */}
                      <img className="card-bg" src={s.src} alt={s.title} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Styles（紅白配色 + 尺寸容器） */}
          <style jsx>{`
            * {
              box-sizing: border-box;
            }

            /* 左半邊：白底黑字 */
            .left {
              position: relative;

              color: #111;
              display: flex;
              align-items: center;
            }
            .copy {
              width: 100%;
              max-width: 780px;
              margin: 0 auto;
              padding: clamp(24px, 5vw, 64px);
            }

            /* Tabs：白底，active 紅底白字 */
            .tabs {
              display: inline-flex;
              gap: 8px;
              padding: 6px;
              border-radius: 14px;
              background: #f7f7f7;
              border: 1px solid #e5e7eb;
              margin-bottom: 18px;
            }
            .tab {
              padding: 8px 14px;
              border-radius: 10px;
              font-weight: 800;
              letter-spacing: 0.02em;
              border: 1px solid transparent;
              color: #111; /* 黑字 */
              background: #ffffff; /* 白底 */
              cursor: pointer;
              transition: all 0.2s ease;
            }
            .tab:hover {
              color: #e10600; /* 滑過紅字 */
              border-color: #fecaca; /* 淺紅邊 */
              background: #fff5f5; /* 淺紅底 */
            }
            .tab.active {
              color: #fff; /* 白字 */
              background: #e10600; /* 紅底 */
              border-color: #e10600;
              box-shadow: 0 6px 18px rgba(225, 6, 0, 0.25);
            }

            /* 文字動畫區：黑字 */
            .title {
              font-family: "Melodrama", serif;
              font-size: clamp(1.8rem, 3.2vw, 3rem);
              line-height: 1.05;
              margin: 14px 0 10px;
              letter-spacing: 0.02em;
              overflow: hidden;
              color: #111; /* 黑 */
            }
            .subtitle {
              font-size: clamp(1rem, 2.1vw, 1.25rem);
              line-height: 1.6;
              color: #333; /* 深灰 */
              margin: 0 0 18px;
              overflow: hidden;
            }

            .tag {
              display: inline-block;
              border: 1px solid #ffffffaa;
              padding: 6px 12px;
              border-radius: 999px;
              font-weight: 800;
              letter-spacing: 0.02em;
              margin-bottom: 10px;
              font-size: 13px;
              color: #fff;
            }
            .infoHeading {
              font-size: clamp(1.25rem, 2.2vw, 1.6rem);
              margin: 8px 0 10px;
              color: #fff;
              display: inline-block;
              border-bottom: 1px solid #ffffff80;
              padding-bottom: 2px;
            }
            .lead {
              color: #fff;
              white-space: pre-line;
              max-width: 60ch;
            }
            .desc {
              color: #fff;
              margin-top: 12px;
              white-space: pre-line;
              max-width: 58ch;
              line-height: 1.9;
              letter-spacing: 0.02em;
            }

            /* CTA：白線白字 */
            .cta-wrap {
              display: flex;
              align-items: center;
              gap: 10px;
              flex-wrap: wrap;
              margin-top: 16px;
            }
            .btn {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 10px 14px;
              border-radius: 12px;
              border: 1px solid #ffffffcc; /* 白線 */
              background: transparent; /* 透明，顯露紅底 */
              color: #fff; /* 白字 */
              text-decoration: none;
              font-weight: 800;
              letter-spacing: 0.02em;
              transition: transform 0.2s ease, background 0.3s ease, border 0.3s,
                opacity 0.2s ease, filter 0.2s ease;
            }
            .btn:hover {
              transform: translateY(-2px);
              background: #ffffff22; /* 淺白面 */
              border-color: #fff;
            }
            .btn.disabled {
              opacity: 0.55;
              filter: grayscale(70%) brightness(1.05);
              cursor: not-allowed;
              pointer-events: none;
            }

            .openBadge {
              margin-top: 12px;
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 6px 10px;
              border-radius: 999px;
              font-weight: 800;
              letter-spacing: 0.02em;
              background: #fff; /* 在紅底卡片上顯示狀態，用白底 */
              color: #e10600; /* 紅字 */
            }
            .openBadge.closed {
              background: #111;
              color: #fff;
            }

            /* 右半邊維持 */
            .right {
              position: relative;
            }
            .card-slider {
              position: relative;
              width: 100%;
              height: 100%;
            }
            .items {
              width: 100%;
              height: 100%;
              position: relative;
            }
            .item {
              position: absolute;
              inset: 0;

              display: grid;
              place-items: center;
              overflow: visible;
              pointer-events: none;
            }
            .item.is-active {
              pointer-events: auto;
            }
            .card {
              width: min(58vh, 48vw);
              height: min(58vh, 48vw);
              position: relative;
              overflow: visible;
            }
            .card img.card-bg {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: contain;
              transform: scale(1.1);
              transition: transform 2s cubic-bezier(0.86, 0, 0.07, 1);
              will-change: transform;
              z-index: 3;
              pointer-events: none;
            }
            .item.is-active .card img.card-bg {
              transform: scale(1);
            }

            @media (max-width: 1024px) {
              .right {
                order: -1;
                min-height: 80vh;
              }
              .left {
                min-height: 84vh;
              }
            }
          `}</style>
        </section>
      </div>
    </>
  );
}
