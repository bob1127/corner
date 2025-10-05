// app/page.jsx
"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Layout from "./Layout";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import SplitType from "split-type";

/** ========= 工具 ========= */
const isEl = (el) =>
  typeof window !== "undefined" &&
  el &&
  el.nodeType === 1 &&
  el instanceof window.HTMLElement;
const inDoc = (el) =>
  typeof document !== "undefined" && el && document.contains(el);

/** 讓 CTA 支援 tel / 一般連結 */
function makeHref(cta = {}) {
  if (cta.tel) {
    const digits = String(cta.tel).replace(/[^\d]/g, "");
    return `tel:${digits}`;
  }
  return cta.href || "#";
}

export default function Home() {
  /** ====== 分頁 / 幻燈資料（含右側內容） ====== */
  const slides = [
    {
      key: "youxiang",
      tabLabel: "有香",
      title: "有香 Memory Corner ",
      subtitle: "Crisp & clean flavor profile",
      src: "/images/hotpot-shadow.png",
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
      right: {
        heading: "有香餐飲集團",
        paragraphs: [
          "我們的故事始於1975年台灣高雄，吳爺爺為了提升家人的生活，毅然放棄穩定高薪的工作，創立了小餐館。他每日清晨騎腳踏車跋涉三小時，拜師學習台灣傳統羊肉料理。這份對美食的執著，讓吳家羊肉鍋成為高雄饕客們心中的珍寶。",
          "隨著歲月流轉，吳爺爺將這獨特的秘方傳給了吳爸爸，餐館逐步成為高雄當地人熟知的經典小館，名聲遠播。",
          "後來，由於吳家移民加拿大，吳家餐館停業，但傳承未終止。長孫自小立志成為廚師，最終在大溫地區創立「有香」。",
        ],
        hero: "https://image.memorycorner8.com/DAV02175.jpg",
        sideBlockTitle: "匠心與日常",
      },
    },
    {
      key: "yidiandian",
      tabLabel: "憶點點",
      title: "有香 Memory Corner ",
      subtitle: "Crisp & clean flavor profile",
      src: "/images/beer01.png",
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
        { src: "/images/beer04.png", label: "啤酒" },
        { src: "/images/beer05.png", label: "啤酒" },
        { src: "/images/beer06.png", label: "啤酒" },
      ],
      right: {
        heading: "憶點點 · Dessert & Drink",
        paragraphs: [
          "從日常的一杯到節慶的一口，憶點點把『記憶中的甜』做成可分享的點心與飲品。",
          "我們堅持基底與比例，以溫潤而乾淨的風味，搭起每一段與人的連結。",
        ],
        hero: "https://image.memorycorner8.com/DAV02145.jpg",
        sideBlockTitle: "甜點的平衡",
      },
    },
    {
      key: "youxiang-zaojia",
      tabLabel: "有香ㄟ灶咖",
      title: "有香ㄟ灶腳",
      subtitle: "Rich notes of spice & herbs",
      src: "/images/img-3.png",
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
        { src: "/images/desert.png", label: "青花椒" },
        { src: "/images/desert.png", label: "番茄鍋" },
        { src: "/images/desert.png", label: "牛奶鍋" },
      ],
      right: {
        heading: "有香ㄟ灶咖 · Old Memory Kitchen",
        paragraphs: [
          "從攤車到餐桌，香氣繞回你我的日常。灶咖延續家常的溫度，保留手路的節奏。",
          "我們把時間變成風味，讓每一鍋都像是回到家。",
        ],
        hero: "https://image.memorycorner8.com/DAV02175.jpg",
        sideBlockTitle: "家常的力量",
      },
    },
  ];

  /** ====== 動畫與設定 ====== */
  const letterStagger = 0.03;

  /** ====== 營業時間（加拿大時區） ====== */
  const businessTimeZone = "America/Toronto";
  const businessOpen = "11:30";
  const businessClose = "23:30";

  /** ====== 狀態 ====== */
  const [current, setCurrent] = useState(0); // 0: 有香 / 1: 憶點點 / 2: 灶咖
  const [isOpenNow, setIsOpenNow] = useState(true);

  /** ====== 文字節點 ====== */
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const splitRefs = useRef({ title: null, subtitle: null });

  /** ====== 時間工具 ====== */
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
    if (open <= close) return mins >= open && mins < close; // 一般
    return mins >= open || mins < close; // 跨夜
  };

  /** ====== 營業時間判斷 ====== */
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

  /** ====== 設定文字內容 ====== */
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

  /** ====== SplitType 文字進場 ====== */
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

  /** ====== 初始 ====== */
  useLayoutEffect(() => {
    setCopy(0);
    requestAnimationFrame(() => playTextAnimation());
    return () => {
      try {
        splitRefs.current.title?.revert?.();
        splitRefs.current.subtitle?.revert?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ====== 分頁切換：更新文案與動畫 ====== */
  useEffect(() => {
    setCopy(current);
    const id = requestAnimationFrame(() => playTextAnimation());
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  /** ====== 目前資料 ====== */
  const slide =
    Number.isInteger(current) && current >= 0 && current < (slides?.length ?? 0)
      ? slides[current]
      : slides[0];

  /** ====== Tabs（放在最上方，控制整頁左右內容） ====== */
  const Tabs = () => {
    return (
      <div
        role="tablist"
        aria-label="品牌切換"
        className="sticky top-0 z-[60] backdrop-blur md:px-10 px-6 py-4"
      >
        <div className="max-w-[1920px] xl:w-[80%] md:w-[90%] w-full mx-auto flex items-center gap-2">
          {slides.map((s, i) => {
            const active = i === current;
            return (
              <button
                key={s.key}
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${s.key}`}
                id={`tab-${s.key}`}
                onClick={() => setCurrent(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight")
                    setCurrent((prev) => (prev + 1) % slides.length);
                  if (e.key === "ArrowLeft")
                    setCurrent(
                      (prev) => (prev - 1 + slides.length) % slides.length
                    );
                }}
                className={`px-5 py-2 w-[200px] border text-sm md:text-base transition
                  ${
                    active
                      ? "bg-[#d09a25] text-white border-gray-200"
                      : "bg-white text-stone-800 border-stone-300 hover:bg-stone-100"
                  }`}
              >
                {s.tabLabel}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="bg-[#eddbc1] pt-20">
        {/* 全頁頂部的 Tabs */}
        <div className="flex justify-center">
          <Tabs />
        </div>

        {/* 主要區塊：兩欄。讓右欄內容夠長，左欄 sticky 才有意義 */}
        <section
          className="section_hero flex max-w-[1920px] xl:w-[80%] md:w-[90%] w-full mx-auto items-start gap-0"
          id={`panel-${slide.key}`}
          role="tabpanel"
          aria-labelledby={`tab-${slide.key}`}
        >
          {/* ===== 左側（Sticky） =====
               - top-24：與你的 Navbar 高度對齊，可依實際高度調整（例如 top-[88px]）
               - self-start / shrink-0 / h-fit：避免被自動拉伸或壓縮 */}
          <div className="left-info sticky top-0 self-start shrink-0 w-full lg:w-[45%] h-fit p-6 lg:p-20">
            <div className="info bg-white rounded-[35px]">
              <div className="p-10">
                <div className="flex py-8">
                  <div className="aspect-[6/4] w-1/2 rounded-[30px] relative overflow-hidden p-4 ">
                    <Image
                      src="https://image.memorycorner8.com/DAV02145.jpg"
                      alt="booking"
                      placeholder="empty"
                      loading="lazy"
                      fill
                      className="object-cover w-full"
                    />
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
                    <b>店舖位置:</b>
                    <span>XXXXXXXXXX</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <b>營業時間:</b>
                    <span>
                      {businessOpen}–{businessClose}（
                      {businessTimeZone.replace("America/", "")}）
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <b>信箱:</b>
                    <span>XXXXXXXXXX</span>
                  </div>
                </div>

                <div className="info bg-slate-400 text-[14px] my-5 text-stone-800 p-5">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Dolor eos?
                  <div className="cta">
                    <div className="mt-3 flex gap-3">
                      <AnimatePresence initial={false} mode="wait">
                        {Array.isArray(slide?.ctas) && slide.ctas.length > 0
                          ? slide.ctas.map((cta, i) => {
                              const href = makeHref(cta);
                              const isExternal =
                                String(href).startsWith("http");
                              const isDisabled =
                                (cta.disableWhenClosed ?? true) && !isOpenNow;

                              return (
                                <motion.a
                                  key={`cta-${slide.key}-${i}`}
                                  href={isDisabled ? undefined : href}
                                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-black text-white hover:opacity-90 transition ${
                                    cta.className || ""
                                  } ${
                                    isDisabled
                                      ? "pointer-events-none opacity-50"
                                      : ""
                                  }`}
                                  aria-label={
                                    cta.ariaLabel || cta.text || "cta"
                                  }
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
                                  transition={{
                                    duration: 0.25,
                                    delay: i * 0.05,
                                  }}
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
                          : null}
                      </AnimatePresence>
                    </div>

                    {!isOpenNow && (
                      <div className="closed-msg mt-2 text-red-700">
                        目前為非營業時間（營業時段 {businessOpen}–
                        {businessClose}，加拿大時間）
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full relative !border-t !border-dashed !border-stone-600 mb-8">
                <div className="circle bg-[#eddbc1] w-[90px] absolute z-40 left-[-45px] top-[-40px] h-[90px] rounded-full"></div>
                <div className="circle bg-[#eddbc1] w-[90px] absolute z-40 right-[-45px] top-[-40px] h-[90px] rounded-full"></div>
              </div>

              <div className="qrcode w-full relative overflow-hidden aspect-[16/5] p-10 mt-10">
                <Image
                  src="https://t4.ftcdn.net/jpg/05/59/73/75/360_F_559737505_YNl2juSnZlcqKvDO6OJjee2npQYMgLn0.jpg"
                  alt="booking"
                  placeholder="empty"
                  loading="lazy"
                  fill
                  className="object-cover scale-75"
                />
              </div>
            </div>
          </div>

          {/* ===== 右側（會跟著 tab 切換） ===== */}
          <div className="right-info w-full lg:w-[55%]">
            <div className="content bg-[url('/images/newspaper.png')] bg-center bg-cover bg-no-repeat w-full mx-auto min-h-screen flex justify-center">
              <div className="txt z-50 w-[85%] mx-auto mt-20 h-auto">
                <h2 className="text-3xl font-bold mt-10">
                  {slide.right?.heading ?? "品牌故事"}
                </h2>

                {(slide.right?.paragraphs ?? []).map((p, idx) => (
                  <p key={`p-${slide.key}-${idx}`} className="text-[16px] mt-4">
                    {p}
                  </p>
                ))}

                <div className="relative mt-5 overflow-hidden aspect-[16/9]">
                  <Image
                    src={
                      slide.right?.hero ||
                      "https://image.memorycorner8.com/DAV02175.jpg"
                    }
                    alt="paper-img"
                    placeholder="empty"
                    loading="lazy"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex mt-10">
                  <div className="left p-3 w-1/2">
                    <p>
                      我們相信：好味道，來自對日常的觀察與耐心的堆疊；更來自每位夥伴的講究與堅持。
                    </p>
                    <div className="border p-8 mt-3">
                      {slide.right?.sideBlockTitle ?? "日常的講究"}
                      ：挑選、新鮮、比例、火候。
                    </div>
                    <p className="mt-5">
                      無論你選擇哪一道，我們都希望你在忙碌的一天裡，能用餐桌交換彼此的溫度。
                    </p>
                    <div className="flex">
                      <div className="left w-1/2">
                        <div className="relative mt-5 overflow-hidden aspect-[16/9]">
                          <Image
                            src={slide.src}
                            alt="panel-thumb"
                            placeholder="empty"
                            loading="lazy"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="right w-1/2 text-[14px] pl-4 pt-3">
                        {slide.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="right w-1/2 px-3">
                    <b className="text-3xl font-bold">精選主打</b>
                    <p>
                      我們將各品牌的招牌菜系、甜品與飲品，整合出更直覺的點單體驗，讓初次到訪也能快速上手。
                    </p>
                    <div className="relative mt-5 overflow-hidden aspect-[16/9]">
                      <Image
                        src={
                          slide.right?.hero ||
                          "https://image.memorycorner8.com/DAV02175.jpg"
                        }
                        alt="paper-img"
                        placeholder="empty"
                        loading="lazy"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-5">
                      以「{slide.tabLabel}
                      」為主題的季節菜單，會不定期更新。歡迎追蹤我們的社群與官網。
                    </p>
                  </div>
                </div>

                <div className="left p-3 w-1/2">
                  <p>
                    我們相信：好味道，來自對日常的觀察與耐心的堆疊；更來自每位夥伴的講究與堅持。
                  </p>
                  <div className="border p-8 mt-3">
                    {slide.right?.sideBlockTitle ?? "日常的講究"}
                    ：挑選、新鮮、比例、火候。
                  </div>
                  <p className="mt-5">
                    無論你選擇哪一道，我們都希望你在忙碌的一天裡，能用餐桌交換彼此的溫度。
                  </p>
                  <div className="flex">
                    <div className="left w-1/2">
                      <div className="relative mt-5 overflow-hidden aspect-[16/9]">
                        <Image
                          src={slide.src}
                          alt="panel-thumb"
                          placeholder="empty"
                          loading="lazy"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="right w-1/2 text-[14px] pl-4 pt-3">
                      {slide.subtitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
