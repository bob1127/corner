"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
const makeHref = (cta = {}) => {
  if (cta.tel) return `tel:${String(cta.tel).replace(/[\s-]/g, "")}`;
  return cta.href || "#";
};
export default function ProductSlider({
  slides = [
    {
      title: "有香 Memory Corner ",
      subtitle: "Crisp & clean flavor profile",
      src: "/images/hotpot-shadow.png",
      ctas: [
        {
          text: "外帶自取",
          tel: "04-1234-5678", // 會自動轉成 tel:0412345678
          iconSrc: "/images/外帶自取01.png",
          className: "mr-3",
        },
        {
          text: "線上訂位",
          href: "https://lin.ee/xxxx", // 一般連結
          iconSrc: "/images/線上訂位.png",
          target: "_blank", // 可選
          rel: "noopener noreferrer", // 可選
        },
      ],
      ctaHref: "#",
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
          className: "left-[5%] top-[20%]",
          logoSrc: "/images/logo-6.png",
          logoAlt: "Logo",
          logoW: 140,
          logoH: 50,
          tagText: "Beer",
          heading: "Memory Dining Group",
          lead: "讓【有香ㄟ灶腳】成為你家的冰箱後援\n備餐神隊友",
          description:
            "嚴選冷凍美食、經典台灣零食飲料和台味小物，從熟悉的味道，到日常的補給，一次買齊！讓【有香ㄟ灶腳】成為你家的冰箱後援、備餐神隊友：再忙也能快速上桌，再累也吃得到美味。把廚房交給我們，把時間留給最重要的人。",
        },
      },
    },
    {
      title: "有香 Memory Corner ",
      subtitle: "Crisp & clean flavor profile",
      src: "/images/beer01.png",
      ctaText: "外帶自取",
      ctaText02: "線上訂位",
      ctaHref: "#",
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
          className: "left-[5%] top-[20%]",
          logoSrc: "/images/logo-6.png",
          logoAlt: "Logo",
          logoW: 140,
          logoH: 50,
          tagText: "Beer",
          heading: "Memory Dining Group",
          lead: "讓【有香ㄟ灶腳】成為你家的冰箱後援\n備餐神隊友",
          description:
            "嚴選冷凍美食、經典台灣零食飲料和台味小物，從熟悉的味道，到日常的補給，一次買齊！讓【有香ㄟ灶腳】成為你家的冰箱後援、備餐神隊友：再忙也能快速上桌，再累也吃得到美味。把廚房交給我們，把時間留給最重要的人。",
        },
      },
    },
    {
      title: "有香ㄟ灶腳 Old Memory Kitchen",
      subtitle: "Rich notes of spice & herbs",
      src: "/images/img-3.png",
      ctaText: "外帶自取",
      ctaText02: "線上訂位",
      ctaHref: "#",
      thumbs: [
        { src: "/images/desert.png", label: "青花椒" },
        { src: "/images/desert.png", label: "番茄鍋" },
        { src: "/images/desert.png", label: "牛奶鍋" },
      ],
    },
  ],

  // 主圖進出動畫
  switchDelay = 0.5,
  dur = 1.0,
  letterStagger = 0.03,

  // 不規則發散縮圖自訂
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

  // ✅ 營業時間（加拿大時區）
  businessTimeZone = "America/Toronto", // 需要用溫哥華可改 "America/Vancouver"
  businessOpen = "11:30", // 開始時間（24h）
  businessClose = "23:30", // 結束時間（24h）
}) {
  const itemsRef = useRef([]);
  const [current, setCurrent] = useState(0);
  const [isSettled, setIsSettled] = useState(false);
  const initedRef = useRef(false);
  const directionForwardRef = useRef(true);
  const activeTLRef = useRef({ in: null, out: null });

  // ⏰ 營業時間狀態
  const [isOpenNow, setIsOpenNow] = useState(true);

  // 左側文字
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const splitRefs = useRef({ title: null, subtitle: null });

  // ===== 工具：時間與角度 =====
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

  // ===== 工具：加拿大時區時間判斷 =====
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
    // 支援跨越午夜，如 22:00~02:00
    if (open <= close) return mins >= open && mins < close;
    return mins >= open || mins < close;
  };

  // ✅ 每 30s 檢查一次（也會在掛載時立即判斷一次）
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

  // ===== 左側文字 SplitType 動畫 =====
  const setCopy = (idx) => {
    const tEl = titleRef.current;
    const sEl = subtitleRef.current;
    if (!isEl(tEl) || !isEl(sEl)) return;
    const next = slides?.[idx] ?? { title: "", subtitle: "" };
    try {
      splitRefs.current.title?.revert?.();
      splitRefs.current.subtitle?.revert?.();
    } catch {}
    tEl.innerHTML = "";
    sEl.innerHTML = "";
    tEl.textContent = next.title || "\u00A0";
    sEl.textContent = next.subtitle || "\u00A0";
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

  // ===== 主圖進退場 =====
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

  const go = (dir) => {
    if (!initedRef.current) return;
    const items = itemsRef.current.filter(Boolean);
    if (!items.length) return;
    directionForwardRef.current = dir === "next";
    activeTLRef.current.in?.kill();
    activeTLRef.current.out?.kill();
    const outEl = items[current];
    activeTLRef.current.out = animateOut(outEl);
    const nextIdx =
      dir === "next"
        ? (current + 1) % items.length
        : (current - 1 + items.length) % items.length;

    gsap.delayedCall(switchDelay, () => {
      const inEl = items[nextIdx];
      const forward = directionForwardRef.current;
      gsap.set(inEl.querySelector(".card"), {
        x: forward ? "100vw" : "-100vw",
        rotate: 40,
      });
      setCopy(nextIdx);
      requestAnimationFrame(() => playTextAnimation());
      activeTLRef.current.in = animateIn(inEl);
      setCurrent(nextIdx);
    });
  };

  const handleNext = () => go("next");
  const handlePrev = () => go("prev");

  // ===== 初始 =====
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

  // 當前資料
  const idx =
    Number.isInteger(current) && current >= 0 && current < (slides?.length ?? 0)
      ? current
      : 0;
  const slide = slides?.[idx] ?? {
    title: "",
    subtitle: "",
    ctaText: "",
    ctaText02: "",
    ctaHref: "#",
  };
  const currentThumbs =
    slide.thumbs?.slice(0, thumbsMax) ??
    Array.from({ length: Math.min(3, thumbsMax) }, () => ({
      src: slide.src,
      label: "",
    }));

  // ===== 不規則發散縮圖座標 =====
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

      const adjX = x < 0 ? Math.abs(x) * 0.6 : x;
      out.push({ x: adjX, y });
    }
    return out;
  };
  const scatter = computeScatter(currentThumbs.length);

  // 縮圖變體
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

  // ===== CTA 是否可點 =====
  const disableCTA = !isOpenNow;

  return (
    <section
      className="
    grid w-full  bg-white
    
    grid-cols-1 lg:grid-cols-2           /* 行動 1 欄、桌機 2 欄 */
    isolate                              /* 確保 z-index 堆疊不受外層影響 */
  "
    >
      {/* 左半：文案 */}
      <div className="left relative z-30 h-auto min-h-[100vh]">
        <div className="copy">
          <div className="info bg-slate-50 rounded-[35px] ">
            <div className="p-10">
              <div className="flex py-8">
                {" "}
                <div className="aspect-[6/4] w-1/2 rounded-[30px] relative overflow-hidden p-4 ">
                  <Image
                    src="https://image.memorycorner8.com/DAV02145.jpg"
                    alt="booking"
                    placeholder="empty"
                    loading="lazy"
                    fill
                    className="object-cover w-full"
                  ></Image>
                </div>
                <div className="txt w-1/2 px-5">
                  <h2
                    ref={titleRef}
                    className="title text-stone-900 !text-[30px] pt-5"
                  >
                    {slide.title}
                  </h2>
                </div>
              </div>
              <div className="w-full border-stone-600 mb-8 border px-4"></div>

              <div className="text-gray-800 flex flex-col">
                <div className="flex justify-between mt-2">
                  <b className="">店舖位置:</b>
                  <span>XXXXXXXXXX</span>
                </div>
                <div className="flex justify-between mt-2">
                  <b className="">營業時間:</b>
                  <span>XXXXXXXXXX</span>
                </div>
                <div className="flex justify-between mt-2">
                  <b className="">信箱:</b>
                  <span>XXXXXXXXXX</span>
                </div>
              </div>
              <div className="info bg-slate-300 text-[14px] my-5 text-stone-800 p-5">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor
                eos?
                <div className="cta">
                  <div className="mt-3 flex  gap-3">
                    <AnimatePresence initial={false} mode="wait">
                      {Array.isArray(slide?.ctas) && slide.ctas.length > 0 ? (
                        slide.ctas.map((cta, i) => {
                          const href = makeHref(cta);
                          const isExternal = String(href).startsWith("http");
                          const isDisabled =
                            (cta.disableWhenClosed ?? true) && !isOpenNow;

                          return (
                            <motion.a
                              key={`${current}-cta-${i}`}
                              href={isDisabled ? undefined : href}
                              className={`btn inline-flex items-center gap-2 ${
                                cta.className || ""
                              } ${isDisabled ? "disabled" : ""}`}
                              aria-label={cta.ariaLabel || cta.text || "cta"}
                              aria-disabled={isDisabled}
                              tabIndex={isDisabled ? -1 : 0}
                              onClick={(e) => {
                                if (isDisabled) e.preventDefault();
                              }}
                              target={
                                isDisabled
                                  ? undefined
                                  : cta.target ||
                                    (isExternal ? "_blank" : undefined)
                              }
                              rel={
                                isDisabled
                                  ? undefined
                                  : cta.rel ||
                                    (isExternal
                                      ? "noopener noreferrer"
                                      : undefined)
                              }
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.25, delay: i * 0.05 }}
                              title={
                                isDisabled
                                  ? `目前為非營業時間（${businessOpen}–${businessClose}，加拿大時間）`
                                  : undefined
                              }
                              draggable={false}
                            >
                              {cta.iconSrc && (
                                <Image
                                  src={cta.iconSrc}
                                  alt=""
                                  placeholder="empty"
                                  loading="lazy"
                                  width={500}
                                  height={500}
                                  className="w-[70px]"
                                />
                              )}
                              {cta.text}
                            </motion.a>
                          );
                        })
                      ) : (
                        <>
                          {(slide?.ctaText ?? "") && (
                            <motion.a
                              key={`${current}-legacy-1`}
                              href={
                                !isOpenNow ? undefined : slide?.ctaHref || "#"
                              }
                              className={`btn inline-flex items-center gap-2 mr-3 ${
                                !isOpenNow ? "disabled" : ""
                              }`}
                              aria-disabled={!isOpenNow}
                              tabIndex={!isOpenNow ? -1 : 0}
                              onClick={(e) => {
                                if (!isOpenNow) e.preventDefault();
                              }}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.25 }}
                              title={
                                !isOpenNow
                                  ? `目前為非營業時間（${businessOpen}–${businessClose}，加拿大時間）`
                                  : undefined
                              }
                              draggable={false}
                            >
                              <Image
                                src="/images/外帶自取01.png"
                                alt=""
                                placeholder="empty"
                                loading="lazy"
                                width={500}
                                height={500}
                                className="w-[70px]"
                              />
                              {slide.ctaText}
                            </motion.a>
                          )}
                          {(slide?.ctaText02 ?? "") && (
                            <motion.a
                              key={`${current}-legacy-2`}
                              href={
                                !isOpenNow ? undefined : slide?.ctaHref || "#"
                              }
                              className={`btn inline-flex items-center gap-2 ${
                                !isOpenNow ? "disabled" : ""
                              }`}
                              aria-disabled={!isOpenNow}
                              tabIndex={!isOpenNow ? -1 : 0}
                              onClick={(e) => {
                                if (!isOpenNow) e.preventDefault();
                              }}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.25, delay: 0.05 }}
                              title={
                                !isOpenNow
                                  ? `目前為非營業時間（${businessOpen}–${businessClose}，加拿大時間）`
                                  : undefined
                              }
                              draggable={false}
                            >
                              <Image
                                src="/images/線上訂位.png"
                                alt=""
                                placeholder="empty"
                                loading="lazy"
                                width={500}
                                height={500}
                                className="w-[70px]"
                              />
                              {slide.ctaText02}
                            </motion.a>
                          )}
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {!isOpenNow && (
                    <div className="closed-msg">
                      目前為非營業時間（營業時段 {businessOpen}–{businessClose}
                      ，加拿大時間）
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full relative !border-t !border-dashed !border-stone-600 mb-8">
              <div className="circle bg-[#0F0F10] w-[90px] absolute z-40 left-[-45px] top-[-40px] h-[90px] rounded-full"></div>
              <div className="circle bg-[#0F0F10] w-[90px] absolute z-40 right-[-45px] top-[-40px] h-[90px] rounded-full"></div>
            </div>
            <div className="qrcode w-full relative overflow-hidden aspect-[16/5] p-10 mt-10">
              <Image
                src="https://t4.ftcdn.net/jpg/05/59/73/75/360_F_559737505_YNl2juSnZlcqKvDO6OJjee2npQYMgLn0.jpg"
                alt="booking"
                placeholder="empty"
                loading="lazy"
                fill
                className="object-cover scale-75"
              ></Image>
            </div>
          </div>

          {/* CTA 區 */}
        </div>
      </div>

      {/* 右半：主圖 + 不規則發散縮圖 */}
      <div className="right !bg-[#f0f1ec] flex-col flex relative">
        {/* 裝飾群組 */}
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
            {/* Top Banner —— 修正置中 */}
            {slide?.decor?.topBanner && (
              <motion.div
                className={`pointer-events-auto relative  lg:absolute lg:left-[43%] top-0 left-0 lg:top-[7%] lg:-translate-x-1/2 ${
                  slide.decor.topBanner.className || "top-[7%]"
                }`}
                variants={{
                  initial: { opacity: 0, y: -8 },
                  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
                }}
              >
                <div className="flex flex-col justify-center items-center text-center">
                  <span className="font-extrabold text-[20px]">
                    {slide.decor.topBanner.title}
                  </span>
                  <div>{slide.decor.topBanner.subtitle}</div>
                  <div className="line h-[.5px] bg-black w-full"></div>
                </div>
              </motion.div>
            )}

            {/* 漂浮圖片 */}
            {Array.isArray(slide?.decor?.images) &&
              slide.decor.images.length > 0 && (
                <motion.div
                  className="absolute inset-0"
                  variants={{
                    initial: {},
                    animate: { transition: { staggerChildren: 0.06 } },
                    exit: {},
                  }}
                >
                  {slide.decor.images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      className={`pointer-events-none absolute ${
                        img.className || ""
                      }`}
                      variants={{
                        initial: { opacity: 0, scale: 0.94, y: 6 },
                        animate: {
                          opacity: 1,
                          scale: 1,
                          y: 0,
                          transition: { duration: 0.35 },
                        },
                        exit: {
                          opacity: 0,
                          scale: 0.96,
                          y: -6,
                          transition: { duration: 0.2 },
                        },
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt || `decor-${idx + 1}`}
                        placeholder="empty"
                        loading="lazy"
                        width={img.width || 140}
                        height={img.height || 50}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}

            {/* ✅ 補回：左側 infoCard */}
            {slide?.decor?.infoCard && (
              <motion.div
                className={`pointer-events-auto relative lg:absolute ${
                  slide.decor.infoCard.className || "left-[5%] top-[20%]"
                }`}
                variants={{
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
                }}
                style={{ overflow: "visible" }}
              >
                <div>
                  {/* {slide.decor.infoCard.logoSrc && (
                    <Image
                      src={slide.decor.infoCard.logoSrc}
                      alt={slide.decor.infoCard.logoAlt || "logo"}
                      placeholder="empty"
                      loading="lazy"
                      width={slide.decor.infoCard.logoW || 140}
                      height={slide.decor.infoCard.logoH || 50}
                      className="w-[80px]"
                    />
                  )} */}

                  {slide.decor.infoCard.tagText && (
                    <span className="tag border w-[80px] text-center border-gray-500 px-3 py-1 text-[14px] rounded-[20px] font-bold inline-block mt-2">
                      {slide.decor.infoCard.tagText}
                    </span>
                  )}
                  <br></br>
                  {slide.decor.infoCard.heading && (
                    <h3 className="border-b-1 text-2xl my-4 text-[#2f2f2f] inline-block border-[#313131]">
                      {slide.decor.infoCard.heading}
                    </h3>
                  )}

                  {slide.decor.infoCard.lead && (
                    <p className=" max-w-full lg:max-w-[20vw] text-[#2f2f2f] whitespace-pre-line">
                      {slide.decor.infoCard.lead}
                    </p>
                  )}

                  {slide.decor.infoCard.description && (
                    <div className="max-w-full lg:max-w-[14vw] mt-5 whitespace-pre-line leading-loose tracking-widest text-[14px]">
                      {slide.decor.infoCard.description}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="card-slider">
          <div className="nav">
            <button className="prev" onClick={handlePrev} aria-label="Previous">
              <svg viewBox="0 0 50 9">
                <path d="m0 4.5 5-3m-5 3 5 3m45-3h-77"></path>
              </svg>
            </button>
            <button className="next" onClick={handleNext} aria-label="Next">
              <svg viewBox="0 0 50 9">
                <path d="m0 4.5 5-3m-5 3 5 3m45-3h-77"></path>
              </svg>
            </button>
          </div>

          <div className="items">
            {slides.map((s, i) => (
              <div
                key={i}
                className={`item ${i === current ? "is-active" : ""}`}
                ref={(el) => {
                  if (el) itemsRef.current[i] = el;
                }}
              >
                <div className="card">
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
                          exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        >
                          {currentThumbs.map((t, ti) => (
                            <motion.button
                              key={ti}
                              className="thumb"
                              custom={ti}
                              initial="initial"
                              animate="enter"
                              exit="exit"
                              variants={itemVariants}
                              whileHover={{
                                scale: 1.06,
                                transition: {
                                  type: "spring",
                                  stiffness: 420,
                                  damping: 24,
                                },
                              }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleNext()}
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

      {/* Styles */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .left {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: min(6vw, 80px);
          background: #0f0f10;
          color: #fff;
        }
        .copy {
          max-width: 640px;
          width: 100%;
        }
        .title {
          font-family: "Melodrama", serif;
          font-size: clamp(2rem, 3vw, 3rem);
          line-height: 1.05;
          margin: 0 0 1rem;
          letter-spacing: 0.02em;
          overflow: hidden;
        }
        .subtitle {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          line-height: 1.6;
          color: #d6d6d6;
          margin: 0 0 1.75rem;
          overflow: hidden;
        }
        .cta-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.6rem 0.9rem;
          border-radius: 12px;
          border: 1px solid #ffffff30;
          background: linear-gradient(180deg, #ffffff1a, #ffffff0a);
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: transform 0.2s ease, background 0.3s ease, border 0.3s,
            opacity 0.2s ease, filter 0.2s ease;
        }
        .btn:hover {
          transform: translateY(-2px);
          background: linear-gradient(180deg, #ffffff2a, #ffffff12);
          border-color: #ffffff55;
        }
        .btn.disabled {
          opacity: 0.45;
          filter: grayscale(100%) brightness(1.1);
          cursor: not-allowed;
          pointer-events: none;
        }
        .btn.disabled :global(img) {
          filter: grayscale(100%) brightness(1.1);
        }
        .closed-msg {
          margin-top: 0.75rem;
          font-size: 0.95rem;
          color: #fca5a5;
        }

        .right {
          position: relative;
          background: #f6f7f9;
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

        .nav .next,
        .nav .prev {
          position: absolute;
          height: 2.25rem;
          width: 2.25rem;
          stroke: #111;
          cursor: pointer;
          z-index: 10;
          pointer-events: auto;
          background: #fff;
          border-radius: 999px;
          border: 1px solid #00000010;
          display: grid;
          place-items: center;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
          transition: transform 0.15s ease, box-shadow 0.25s ease;
        }
        .nav .next:hover,
        .nav .prev:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
        }
        .nav .next {
          bottom: 2.5rem;
          right: 2.5rem;
          transform: rotate(180deg);
        }
        .nav .prev {
          bottom: 2.5rem;
          right: 6rem;
        }
        .nav svg {
          width: 22px;
          height: 22px;
          fill: none;
          stroke-width: 1.5px;
        }

        @media (max-width: 1024px) {
          .slider-wrap {
            grid-template-columns: 1fr;
          }
          .right {
            order: -1;
            min-height: 80vh;
          }
          .left {
            min-height: 84vh;
          }
          .nav .prev {
            right: 6rem;
          }
        }
      `}</style>
    </section>
  );
}
