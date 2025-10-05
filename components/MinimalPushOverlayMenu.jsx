// ./components/MinimalPushOverlayMenu.jsx
"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { gsap as _gsap } from "gsap";
import SplitType from "split-type";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Carousel from "../components/EmblaCarouselTravel/index";

// GSAP 註冊（SplitText 現在免費，確保使用 3.13+）
if (typeof window !== "undefined" && !gsap.core.globals()._menu_once_) {
  gsap.registerPlugin(CustomEase, SplitText);
  CustomEase.create("hop", ".87,0,.13,1");
  gsap.core.globals("_menu_once_", true);
}

export default function MinimalPushOverlayMenu({
  menus = DEFAULT_MENUS,
  logoSrc = "/logo.png",
}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState(false);

  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const overlayContentRef = useRef(null);
  const mediaWrapperRef = useRef(null);
  const menuColsRef = useRef([]); // 三塊：左 links、右 scrollText、footer
  const splitsRef = useRef([]); // SplitText instances
  const copyTlRef = useRef(null); // 行動畫 timeline

  // 鎖捲動（打開時）
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  // 初始狀態
  useLayoutEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    const content = overlayContentRef.current;
    const media = mediaWrapperRef.current;

    gsap.set(container, { y: "0svh" });
    gsap.set(overlay, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });
    gsap.set(content, { yPercent: -50 });
    gsap.set(media, { opacity: 0 });

    // 先做一次 split & 行位移
    splitAllLines();
    setLinesY("-110%");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 依 active 切換 overlay 內容（已開啟時）
  useEffect(() => {
    if (!open) return;
    animateCopyOut(() => {
      requestAnimationFrame(() => {
        splitAllLines();
        setLinesY("-110%");
        animateCopyIn();
        gsap.fromTo(
          mediaWrapperRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" }
        );
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // —— SplitText 輔助 —— //
  function splitAllLines() {
    // 清掉舊 split
    splitsRef.current.forEach((s) => {
      try {
        s.revert();
      } catch {}
    });
    splitsRef.current = [];

    const cols = menuColsRef.current.filter(Boolean);
    cols.forEach((col) => {
      const nodes = col.querySelectorAll("a, p");
      nodes.forEach((el) => {
        const split = new SplitText(el, { type: "lines" });
        splitsRef.current.push(split);
      });
    });
  }

  function setLinesY(val) {
    const lines = splitsRef.current.flatMap((s) => s.lines || []);
    if (!lines.length) return;
    gsap.set(lines, { y: val });
  }

  function animateCopyIn() {
    const lines = splitsRef.current.flatMap((s) => s.lines || []);
    if (!lines.length) return;
    killCopyTl();
    copyTlRef.current = gsap.timeline();
    copyTlRef.current.to(lines, {
      y: "0%",
      duration: 1.2,
      ease: "hop",
      stagger: -0.075,
    });
  }

  function animateCopyOut(onDone) {
    const lines = splitsRef.current.flatMap((s) => s.lines || []);
    killCopyTl();
    if (!lines.length) {
      onDone?.();
      return;
    }
    copyTlRef.current = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => onDone?.(),
    });
    copyTlRef.current.to(lines, {
      y: "-110%",
      duration: 0.45,
      stagger: 0.02,
    });
  }

  function killCopyTl() {
    if (copyTlRef.current) {
      copyTlRef.current.kill();
      copyTlRef.current = null;
    }
  }

  // —— 開關 Overlay —— //
  function openMenu(idx) {
    if (animating) return;
    setAnimating(true);
    setActive(idx);

    splitAllLines();
    setLinesY("-110%");

    const tl = gsap.timeline({
      defaults: { ease: "hop" },
      onComplete: () => {
        setOpen(true);
        setAnimating(false);
        animateCopyIn();
      },
    });

    tl.to(containerRef.current, { y: "100svh", duration: 1 }, 0)
      .to(
        overlayRef.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
        },
        0
      )
      .to(overlayContentRef.current, { yPercent: 0, duration: 1 }, 0)
      .to(
        mediaWrapperRef.current,
        { opacity: 1, duration: 0.75, ease: "power2.out", delay: 0.5 },
        0
      );
  }

  function closeMenu() {
    if (animating) return;
    setAnimating(true);
    // 先把行淡出，避免關閉瞬間殘影
    animateCopyOut(() => {
      const tl = gsap.timeline({
        defaults: { ease: "hop" },
        onComplete: () => {
          setOpen(false);
          setAnimating(false);
          // 重置
          setLinesY("-110%");
          gsap.set(mediaWrapperRef.current, { opacity: 0 });
        },
      });

      tl.to(containerRef.current, { y: "0svh", duration: 1 }, 0)
        .to(
          overlayRef.current,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1,
          },
          0
        )
        .to(overlayContentRef.current, { yPercent: -50, duration: 1 }, 0);
    });
  }

  // Esc 關閉
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open && !animating) closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, animating]);

  const m = menus[active] || menus[0];

  return (
    <nav className={`nav-root ${open ? "is-open" : ""}`}>
      {/* Overlay */}
      <div ref={overlayRef} className="menu-overlay">
        <div ref={overlayContentRef} className="menu-overlay-content">
          <div ref={mediaWrapperRef} className="w-1/2 overflow-hidden">
            <img src={m.media} alt="" />
          </div>

          <div className="menu-content-wrapper">
            <div className="menu-content-main">
              {/* 左：大連結（每個前面都加小圖示） */}
              <div
                className="menu-col"
                ref={(el) => (menuColsRef.current[0] = el)}
              >
                {m.links.map((t, i) => (
                  <div className="menu-link" key={i}>
                    <a href={t.href || "#"}>
                      <span className="mini-icon" aria-hidden="true">
                        {/* 內嵌 SVG：圓角方塊 + 中心小圓 */}
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          aria-label=""
                        >
                          <rect
                            x="1.5"
                            y="1.5"
                            width="19"
                            height="19"
                            rx="5"
                            ry="5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            opacity="0.9"
                          />
                          <circle cx="11" cy="11" r="2.8" fill="currentColor" />
                        </svg>
                      </span>
                      <span className="menu-link-text">{t.text}</span>
                    </a>
                  </div>
                ))}
              </div>

              {/* 右：可滾動短文 */}
              <div
                className="menu-col"
                ref={(el) => (menuColsRef.current[1] = el)}
              >
                <div className="menu-scroll">
                  <p>{m.scrollText}</p>
                </div>
              </div>
            </div>

            {/* Footer（保留右側聯絡資訊） */}
            <div
              className="menu-footer"
              ref={(el) => (menuColsRef.current[2] = el)}
            >
              <div className="menu-col" />
              <div className="menu-col">
                {m.footer.right.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* 右上角關閉（X） */}
            <button
              className="menu-close mt-20"
              onClick={closeMenu}
              title="Close"
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      {/* 被 push 的主頁內容：👉 已改成你的 ProductSlider */}
      <div ref={containerRef} className="">
        <ProductSlider
          onOpenMenu={openMenu}
          onSetActive={setActive}
          onCloseMenu={closeMenu}
          isOpen={open}
          active={active}
        />
      </div>

      {/* 整合樣式 */}
      <style jsx global>{`
        @import url("https://fonts.cdnfonts.com/css/pp-neue-montreal");
        @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

        :root {
          --bg: #171717;
          --fg: #fff;
          --menu-bg: #0f0f0f;
          --menu-fg-secondary: #8a8a8a;
          --menu-scroll-track: #1b1b1b;
          --menu-scroll-thumb: #3a3a3a;
          --hamburger-icon-border: rgba(255, 255, 255, 0.1);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "PP Neue Montreal", "Inter", sans-serif;
          background: #000;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        h1 {
          font-size: 7.5rem;
          font-weight: 500;
          letter-spacing: -0.2rem;
          line-height: 1;
        }

        p {
          font-size: 0.95rem;
          font-weight: 500;
        }

        a {
          text-decoration: none;
          color: var(--fg);
          font-size: 1.5rem;
          font-weight: 500;
        }

        .container {
          position: relative;
          transform: translateY(0svh);
          background-color: var(--bg);
          color: var(--fg);
        }

        .demo-section {
          position: relative;
          width: 100vw;
          height: 100svh;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          z-index: -1;
        }

        .nav-root {
          top: 0;
          left: 0;
          width: 100vw;
          height: 100svh;
          pointer-events: none;
          overflow: hidden;
          z-index: 2;
        }

        /* ✅ Overlay 提升層級，蓋過 menu-bar */
        .menu-overlay,
        .menu-overlay-content {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100svh;
          color: var(--fg);
          overflow: hidden;
          z-index: 10; /* ← 提升到最上層 */
        }

        .menu-bar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: all;
          color: var(--menu-fg-secondary);
          z-index: 3;
        }

        /* ✅ 當 overlay 打開時，讓 menu-bar 不吃點擊，避免擋住右上角 X */
        .nav-root.is-open .menu-bar {
          pointer-events: none;
        }

        .menu-logo {
          width: 2rem;
          height: 2rem;
        }

        .menu-overlay {
          background-color: var(--menu-bg);
          clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);
          will-change: clip-path;
          pointer-events: none;
        }

        .menu-overlay-content {
          display: flex;
          transform: translateY(-50%);
          will-change: transform;
          pointer-events: all; /* 讓內容（含關閉鈕）可點擊 */
        }

        .menu-media-wrapper {
          flex: 2;
          opacity: 0;
          will-change: opacity;
        }
        .menu-media-wrapper img {
          opacity: 0.25;
        }

        .menu-content-wrapper {
          flex: 3;
          position: relative;
          display: flex;
        }

        .menu-content-main {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .menu-footer {
          margin: 0 auto;
        }

        .menu-content-main,
        .menu-footer {
          width: 75%;
          padding: 2rem;
          display: flex;
          align-items: flex-end;
          gap: 2rem;
        }

        .menu-col {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .menu-col:nth-child(1) {
          flex: 3;
        }
        .menu-col:nth-child(2) {
          flex: 2;
        }

        /* ===== 左側：連結 + 小圖示 ===== */
        .menu-link a {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 3.5rem;
          font-weight: 500;
          line-height: 1.2;
          white-space: nowrap;
        }
        .menu-link a .mini-icon {
          display: inline-grid;
          place-items: center;
          width: 22px;
          height: 22px;
          color: #fff;
          opacity: 0.95;
          transform: translateY(4px);
        }
        .menu-link a:hover .mini-icon {
          opacity: 1;
        }

        /* ===== 右側：可滾動短文 + 捲動條樣式 ===== */
        .menu-scroll {
          max-height: min(40vh, 440px);
          overflow-y: auto;
          padding-right: 10px;
        }
        .menu-scroll p {
          color: var(--menu-fg-secondary);
          line-height: 1.9;
          letter-spacing: 0.01em;
          font-size: 1.05rem;
          white-space: pre-line;
        }

        /* WebKit 捲動條 */
        .menu-scroll::-webkit-scrollbar {
          width: 10px;
        }
        .menu-scroll::-webkit-scrollbar-track {
          background: var(--menu-scroll-track);
          border-radius: 999px;
        }
        .menu-scroll::-webkit-scrollbar-thumb {
          background: var(--menu-scroll-thumb);
          border-radius: 999px;
        }
        .menu-scroll::-webkit-scrollbar-thumb:hover {
          background: #4a4a4a;
        }

        /* Firefox */
        .menu-scroll {
          scrollbar-width: thin;
          scrollbar-color: var(--menu-scroll-thumb) var(--menu-scroll-track);
        }

        .menu-tag a,
        .menu-footer p {
          color: var(--menu-fg-secondary);
        }

        /* 關閉按鈕（右上角 X） */
        .menu-close {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--hamburger-icon-border);
          background: transparent;
          display: grid;
          place-items: center;
          cursor: pointer;
          z-index: 11; /* 再保險疊上一層 */
        }
        .menu-close span {
          position: absolute;
          width: 18px;
          height: 1.5px;
          background: #fff;
        }
        .menu-close span:first-child {
          transform: rotate(45deg);
        }
        .menu-close span:last-child {
          transform: rotate(-45deg);
        }
        .menu-close:hover {
          background: #ffffff10;
        }

        @media (max-width: 1000px) {
          h1 {
            font-size: 3rem;
            letter-spacing: -0.05rem;
          }
          .menu-media-wrapper {
            display: none;
          }
          .menu-content-main,
          .menu-footer {
            width: 100%;
          }
          .menu-content-main {
            top: 50%;
            flex-direction: column;
            align-items: flex-start;
            gap: 3.5rem;
          }
          .menu-link a {
            font-size: 2.4rem;
          }
          .menu-scroll {
            max-height: 36vh;
          }
        }
      `}</style>
    </nav>
  );
}

/* ===== 你的 ProductSlider（維持原邏輯；加入 AOS + 視差 + z-50） ===== */
function ProductSlider({
  slides = [
    {
      title: "有香 Memory Corner ",
      subtitle: "Crisp & clean flavor profile",
      src: "/images/DAV01683.png", // ← 第一張
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

  onOpenMenu,
  onSetActive,
  onCloseMenu,
  isOpen,
  active,
}) {
  const itemsRef = useRef([]);
  const [current, setCurrent] = useState(0);
  const [isSettled, setIsSettled] = useState(false);
  const initedRef = useRef(false);
  const directionForwardRef = useRef(true);
  const activeTLRef = useRef({ in: null, out: null });

  // 視差：筷子
  const chopsticksRef = useRef(null);
  const { scrollYProgress: chopsticksProg } = useScroll({
    target: chopsticksRef,
    offset: ["start 85%", "end 15%"],
  });
  const chopsticksY = useTransform(chopsticksProg, [0, 1], ["-12vh", "12vh"]);

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
        stagger: 0.03,
        duration: 1.2,
        ease: "power3.out",
      })
      .to(
        splitSub.chars,
        { y: 0, stagger: 0.03, duration: 1.2, ease: "power3.out" },
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
        defaults: { duration: 1.0, ease: "expo.out" },
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
        defaults: { duration: 1.0, ease: "power3.inOut" },
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

    gsap.delayedCall(0.5, () => {
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
  }, []);

  const idx =
    Number.isInteger(current) && current >= 0 && current < (slides?.length ?? 0)
      ? current
      : 0;
  const slide = slides?.[idx] ?? { title: "", subtitle: "", ctas: [] };
  const currentThumbs =
    slide.thumbs?.slice(0, 6) ??
    Array.from({ length: Math.min(3, 6) }, () => ({
      src: slide.src,
      label: "",
    }));

  const computeScatter = (count) => {
    const out = [];
    for (let i = 0; i < count; i++) {
      const t = i / Math.max(1, count - 1);
      const ang = -45 + (85 - -45) * t ** (1 - 0.45);
      const r =
        40 + i * 84 + (Math.sin((current * 20 + i) * 13.37) * 2 - 1) * 18;
      const x =
        Math.cos((ang * Math.PI) / 180) * r +
        (Math.sin((current * 30 + i) * 7.77) * 2 - 1) * (18 * 0.35);
      const y =
        Math.sin((ang * Math.PI) / 180) * r +
        (Math.sin((current * 40 + i) * 5.55) * 2 - 1) * (18 * 0.35);
      const adjX = x < 0 ? Math.abs(x) * 0.6 : x;
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
      transition: {
        type: "spring",
        stiffness: 520,
        damping: 30,
        mass: 0.7,
        delay: i * 0.06,
      },
    }),
    exit: (i) => ({
      opacity: 0,
      scale: 0.8,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 380,
        damping: 32,
        mass: 0.8,
        delay: (currentThumbs.length - 1 - i) * 0.02,
      },
    }),
  };

  return (
    <div className="bg-white h-screen pb-20">
      <div className="mx-auto py-20 w-[80%] flex justify-center items-center">
        <section className="grid w-full !bg-white grid-cols-1 lg:grid-cols-2 isolate">
          {/* 左半 */}
          <div className="left relative z-30 !bg-white ">
            <div className="copy">
              <div className="my-5">
                <Image
                  src="/images/旗幟.png"
                  alt="旗幟"
                  placeholder="empty"
                  property="eager"
                  width={200}
                  height={130}
                  className="max-w-[190px]"
                />
              </div>
              <div className="border-b-1 pb-2 mb-8">
                <span className="bg-[#dc9352] text-white px-4 rounded-2xl py-1">
                  有香
                </span>
                <span className=" text-gray-800 px-4 rounded-2xl py-1">
                  有香
                </span>
                <span className=" text-gray-800 px-4 rounded-2xl py-1">
                  有香
                </span>
              </div>
              <h2 className="info-title text-5xl font-bold">有香餐飲</h2>
              <p className="info-subtitle text-lg tracking-wider">
                MEMORY CORNER
              </p>
              <div className="infoCard h-[380px] relative mt-10">
                <h3 className="text-2xl font-bold">Lorem ipsum dolor.</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
                  omnis pariatur cum necessitatibus obcaecati iusto odio harum
                  exercitationem ullam.
                </p>
                <p className="mt-10">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
                  omnis pariatur cum necessitatibus obcaecati iusto odio harum.
                </p>
              </div>
            </div>
          </div>

          {/* 右半：主圖 + 筷子視差 + 發散縮圖 */}
          <div className="right flex-col flex relative overflow-visible">
            {/* 筷子 → AOS + 視差 */}
            <div
              ref={chopsticksRef}
              className="absolute top-[15%] right-[-35%] z-50 pointer-events-none"
              data-aos="fade-down"
              data-aos-duration="1200"
              data-aos-easing="ease-out-cubic"
            >
              <motion.img
                src="https://static.vecteezy.com/system/resources/thumbnails/049/096/323/small_2x/hand-grasping-wooden-chopsticks-for-eating-transparent-png.png"
                alt="chopsticks"
                className="max-w-[800px] will-change-transform"
                style={{ y: chopsticksY }}
                draggable={false}
              />
            </div>

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
              />
            </AnimatePresence>

            {/* Slider 本體 */}
            <div className="card-slider relative">
              <div className="items ">
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
                              {(slide.thumbs?.slice(0, 6) ?? []).map(
                                (t, ti) => (
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
                                    onClick={() =>
                                      setTimeout(
                                        () =>
                                          goTo((current + 1) % slides.length),
                                        0
                                      )
                                    }
                                    style={{
                                      position: "absolute",
                                      left: 0,
                                      top: 0,
                                      transform: "translate(-50%, -50%)",
                                      width: 88,
                                      height: 88,
                                      borderRadius: 16,
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
                                )
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}

                      {/* 主圖（第 1 張加 AOS zoom-in） */}
                      <img
                        className="card-bg"
                        src={s.src}
                        alt={s.title}
                        {...(s.src === "/images/DAV01683.png"
                          ? {
                              "data-aos": "zoom-in",
                              "data-aos-duration": "900",
                              "data-aos-delay": "120",
                            }
                          : {})}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ 功能按鈕：移到 DAV01683.png（第 1 張）下方，只在 current===0 顯示 */}
            {idx === 0 && (
              <div className="menu-button-group under-image mt-6 flex gap-6 justify-center">
                <button
                  className={`relative z-50 ${
                    isOpen && active === 0 ? "is-active" : ""
                  }`}
                  data-aos="fade-up"
                  data-aos-delay="200"
                  onClick={() => (isOpen ? onSetActive?.(0) : onOpenMenu?.(0))}
                >
                  <div className="flex flex-col justify-center items-center">
                    <img
                      src="/images/肉包.png"
                      alt=""
                      className="max-w-[100px]"
                    />
                    <span className="text-black">TITLE</span>
                  </div>
                </button>
                <button
                  className={`relative z-50 ${
                    isOpen && active === 1 ? "is-active" : ""
                  }`}
                  data-aos="fade-up"
                  data-aos-delay="400"
                  onClick={() => (isOpen ? onSetActive?.(1) : onOpenMenu?.(1))}
                >
                  <div className="flex flex-col justify-center items-center">
                    <img
                      src="/images/food01.png"
                      alt=""
                      className="max-w-[100px]"
                    />
                    <span className="text-black">TITLE</span>
                  </div>
                </button>
                <button
                  className={`relative z-50 ${
                    isOpen && active === 2 ? "is-active" : ""
                  }`}
                  data-aos="fade-up"
                  data-aos-delay="600"
                  onClick={() => (isOpen ? onSetActive?.(2) : onOpenMenu?.(2))}
                >
                  <div className="flex flex-col justify-center items-center">
                    <img
                      src="/images/desert.png"
                      alt=""
                      className="max-w-[100px]"
                    />
                    <span className="text-black">TITLE</span>
                  </div>
                </button>
                {isOpen && (
                  <button
                    className="menu-button"
                    onClick={() => onCloseMenu?.()}
                    title="Close"
                  >
                    Close
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Styles（紅白配色 + 尺寸容器） */}
          <style jsx>{`
            * {
              box-sizing: border-box;
            }
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
            .title {
              font-family: "Melodrama", serif;
              font-size: clamp(1.8rem, 3.2vw, 3rem);
              line-height: 1.05;
              margin: 14px 0 10px;
              letter-spacing: 0.02em;
              overflow: hidden;
              color: #111;
            }
            .subtitle {
              font-size: clamp(1rem, 2.1vw, 1.25rem);
              line-height: 1.6;
              color: #333;
              margin: 0 0 18px;
              overflow: hidden;
            }
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

            /* 下方按鈕群 */
            .menu-button-group.under-image {
              display: flex;
              gap: 0.5rem;
              justify-content: center;
              align-items: center;
              margin-top: 18px;
              padding: 8px 10px;
              pointer-events: all;
            }
            .menu-button {
              appearance: none;
              border: 1px solid rgba(0, 0, 0, 0.1);
              color: #fff;
              background: #111;
              padding: 0.6rem 0.9rem;
              border-radius: 999px;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.87, 0, 0.13, 1);
            }
            .menu-button:hover {
              transform: translateY(-2px);
              border-color: #ffffff33;
              background: #222;
            }
            .menu-button.is-active {
              border-color: #ffffff60;
              background: #333;
              box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
            }

            @media (max-width: 1024px) {
              .right {
                order: -1;
                min-height: 80vh;
              }
              .left {
                min-height: 84vh;
              }
              .menu-button-group.under-image {
                flex-wrap: wrap;
              }
            }
          `}</style>
        </section>
      </div>
    </div>
  );
}

/* ===== 預設資料（可用 props 覆蓋） ===== */
const DEFAULT_MENUS = [
  {
    media: "/images/cabeb5b2-7d82-408e-9b01-e5bf008536fb.png",
    links: [
      { text: "Index" },
      { text: "Portfolio" },
      { text: "Studio" },
      { text: "Journal" },
      { text: "Connect" },
    ],
    scrollText:
      "Toronto, Canada — We build expressive web experiences that blend GSAP-driven motion, performance-first engineering, and editorial art direction. From Web Animations to Interactive Media and Motion Craft, our practice focuses on details that feel effortless: choreographed entrances, tactile micro-interactions, and layouts that read like stories. We collaborate closely with design-forward brands to craft pages that move with intent—fast, fluid, and memorable.\n\nOur work scales from single-page showcases to modular content systems, with attention to accessibility, responsiveness, and CMS workflows. If you care about feel as much as function, we’ll get along.",
    footer: {
      left: [],
      right: ["+1 437 555 0199", "hello@nullspace.studio"],
    },
  },
  {
    media: "/images/cabeb5b2-7d82-408e-9b01-e5bf008536fb.png",
    links: [
      { text: "Overview" },
      { text: "Work" },
      { text: "Team" },
      { text: "Insights" },
      { text: "Contact" },
    ],
    scrollText:
      "Taipei, Taiwan — We create brand systems and motion identities tailored for the web. From GSAP + WebGL prototyping to production-ready micro-interactions, our approach is pragmatic and iterative. We sweat timing curves, typography rhythm, and how elements layer on scroll. The result: pages that feel alive yet remain robust, SEO-clean, and maintainable by your team.\n\nWe’re comfortable inside component libraries and headless CMS setups. Bring us in early to set the motion language—and keep us around to scale it.",
    footer: {
      left: [],
      right: ["+886 2 5555 0000", "hi@studio.example"],
    },
  },
  {
    media: "/images/cabeb5b2-7d82-408e-9b01-e5bf008536fb.png",
    links: [
      { text: "Home" },
      { text: "Cases" },
      { text: "About" },
      { text: "Journal" },
      { text: "Hire Us" },
    ],
    scrollText:
      "Tokyo, Japan — Creative coding for realtime graphics and editorial motion. We prototype bold visual ideas, then refine them into resilient interfaces. Expect careful attention to GPU budgets, interaction latency, and content tooling—so artistry never fights operations.\n\nWe work best with teams who embrace experimentation and value crisp implementation as part of the brand.",
    footer: {
      left: [],
      right: ["+81 3 1234 5678", "contact@brand.example"],
    },
  },
];
