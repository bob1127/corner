// components/SlideTabsExample.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  User2,
  LogIn,
  LogOut,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/router";

import { cartStore } from "@/lib/cartStore";
import { authStore } from "@/lib/authStore";
import { useT } from "@/lib/i18n";

/* -------------------- 動畫 Variants -------------------- */
const easeOut = [0.22, 1, 0.36, 1];

const fadeUp = {
  initial: { opacity: 0, y: 10, scale: 0.98, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.22, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    filter: "blur(6px)",
    transition: { duration: 0.18, ease: easeOut },
  },
};

const modalFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const modalCard = {
  initial: { opacity: 0, y: 16, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.26, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.97,
    transition: { duration: 0.18, ease: easeOut },
  },
};

const cartOverlay = modalFade;

const cartPanel = {
  initial: { x: 24, opacity: 0, scale: 0.98 },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 30 },
  },
  exit: {
    x: 24,
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2, ease: easeOut },
  },
};

const listItem = {
  initial: { opacity: 0, y: 10 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.22, ease: easeOut },
  }),
  exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
};

/* ------- 簡潔 Hover Flyout（靠左對齊） ------- */
function FlyoutLink({ label, href = "#", FlyoutContent }) {
  const [open, setOpen] = useState(false);
  const showFlyout = !!FlyoutContent && open;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative w-fit h-fit"
    >
      <Link
        href={href}
        className="relative text-base font-medium text-black/80 hover:text-[#eda240] transition-colors"
      >
        {label}
        <span
          style={{ transform: showFlyout ? "scaleX(1)" : "scaleX(0)" }}
          className="absolute -bottom-1 left-0 right-0 h-[2px] origin-left scale-x-0 bg-black/20 transition-transform duration-300 ease-out"
        />
      </Link>

      <AnimatePresence>
        {showFlyout && (
          <motion.div
            {...fadeUp}
            className="absolute left-0 top-8 z-[1200] rounded-xl border border-black/10 bg-white/95 shadow-lg backdrop-blur-md"
          >
            <div className="p-3">{FlyoutContent && <FlyoutContent />}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------ 二層內容（純文字連結） ------------ */
const BrandStoresContent = () => (
  <ul className="min-w-56 text-sm">
    {[
      ["關於有香餐飲集團", "/brand01"],
      ["有香", "/brand01"],
      ["憶點點", "/brand01"],
      ["有香ㄟ灶腳", "/brand01"],
    ].map(([t, href]) => (
      <li key={t}>
        <Link
          href={href}
          className="block text-base text-black rounded-lg px-3 py-2 hover:text-white hover:bg-[#e09437] transition-colors"
        >
          {t}
        </Link>
      </li>
    ))}
  </ul>
);

const BrandMenuContent = () => (
  <ul className="min-w-56 text-sm">
    {[
      ["菜單總覽", "/menu"],
      ["有香", "/menu01"],
      ["憶點點", "/menu02"],
      ["有香ㄟ灶腳", "/menu03"],
    ].map(([t, href]) => (
      <li key={t}>
        <Link
          href={href}
          className="block text-base text-black rounded-lg px-3 py-2 hover:text-white hover:bg-[#e09437] transition-colors"
        >
          {t}
        </Link>
      </li>
    ))}
  </ul>
);

/* ===== 語系切換（穩定版：整頁重載避免 runtime 錯誤） ===== */
function LangSwitcher({ scrolled }) {
  const router = useRouter();
  const { locale } = router;

  const baseWrap =
    "flex items-center rounded-full  overflow-hidden border transition-colors";
  const wrapTheme = scrolled
    ? "border-black/10 bg-black/5 text-black"
    : "border-white/20 bg-black/30 text-white";

  const btnBase =
    "px-3 h-8 grid place-items-center text-[12px] font-medium transition-colors";
  const activeOnLight = "bg-white text-black";
  const activeOnDark = "bg-white/20";

  const buildLocaleUrl = (nextLocale) => {
    const current = router.asPath || "/";
    const bare = current.replace(/^\/(en|cn)(?=\/|$)/, "");
    const path = bare.startsWith("/") ? bare : `/${bare}`;
    return `/${nextLocale}${path}`;
  };

  const switchLocale = (nextLocale) => {
    if (nextLocale === locale) return;
    const url = buildLocaleUrl(nextLocale);
    // 使用 hard navigation 避免第三方元件卸載時丟例外
    window.location.assign(url);
  };

  const btnCls = (isActive) =>
    `${btnBase} ${
      isActive ? (scrolled ? activeOnLight : activeOnDark) : "hover:bg-white/10"
    }`;

  return (
    <div className={`${baseWrap} ${wrapTheme}`}>
      <button
        type="button"
        aria-current={locale === "cn" ? "true" : undefined}
        onClick={() => switchLocale("cn")}
        className={btnCls(locale === "cn")}
      >
        中
      </button>
      <button
        type="button"
        aria-current={locale === "en" ? "true" : undefined}
        onClick={() => switchLocale("en")}
        className={btnCls(locale === "en")}
      >
        EN
      </button>
    </div>
  );
}

export const SlideTabsExample = () => {
  const router = useRouter();
  const t = useT();

  /* ===== 語系判斷與路徑前綴 ===== */
  const isCN = useMemo(() => {
    const loc = router?.locale || "";
    if (loc && /^(zh|cn)/i.test(loc)) return true;
    const p = router?.asPath || "";
    return p === "/cn" || p.startsWith("/cn/");
  }, [router.locale, router.asPath]);

  const prefix = isCN ? "/cn" : "";
  const toLocalePath = (path = "/") => `${prefix}${path === "/" ? "" : path}`;

  /* ===== 名稱挑選：依語系顯示 name_zh / name_en，並向後相容 ===== */
  const itemName = (it) => {
    const zh = it?.name_zh || it?.zh_name || it?.cn_name;
    const en = it?.name_en || it?.name;
    return isCN ? zh || en || it?.name || "" : en || zh || it?.name || "";
  };

  // === 滾動狀態 + 導覽列高度量測 ===
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const [headerH, setHeaderH] = useState(64); // fallback

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        const h = headerRef.current.getBoundingClientRect().height;
        setHeaderH(Math.round(h));
      }
    };
    measure();
    const obs = new ResizeObserver(measure);
    if (headerRef.current) obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  // 手機選單
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBrandOpenMobile, setIsBrandOpenMobile] = useState(false);
  const [isMenuOpenMobile, setIsMenuOpenMobile] = useState(false);

  // 購物車
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => {
    cartStore.init();
    const unsub = cartStore.subscribe((c) => setCart([...c]));
    return unsub;
  }, []);
  const cartCount = cart.reduce((n, it) => n + (it.qty || 0), 0);
  const subtotal = cart.reduce(
    (sum, it) => sum + Number(it.price || 0) * (it.qty || 0),
    0
  );

  // 會員
  const [auth, setAuth] = useState(authStore.get());
  const [userOpen, setUserOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login | register
  const [authLoading, setAuthLoading] = useState(false);
  const [authErr, setAuthErr] = useState("");

  useEffect(() => {
    authStore.init();
    const unsub = authStore.subscribe((s) => setAuth({ ...s }));
    return unsub;
  }, []);

  // === 鎖定背景捲動（購物車 / 手機選單 / 認證視窗開啟時） ===
  useEffect(() => {
    const lock = cartOpen || isMenuOpen || showAuthModal;
    const original = document.body.style.overflow;
    if (lock) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [cartOpen, isMenuOpen, showAuthModal]);

  // 只要購物車打開就強制 navbar 用實心白底
  const navSolid = scrolled || cartOpen;

  return (
    <div>
      {/* ======= 導覽列：頂部透明、滾動/購物車時變白 ======= */}
      <motion.nav
        key={`navbar-${router.locale}`}
        ref={headerRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: easeOut }}
        className={[
          "fixed left-0 top-0 z-[1000] w-full",
          "transition-[background-color,backdrop-filter,box-shadow,border-color] duration-300",
          navSolid
            ? "bg-white/90 supports-[backdrop-filter]:bg-white backdrop-blur shadow-sm border-b border-white/10"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto w-full mt-0 py-2 sm:py-3 px-2">
          <div className="flex items-center">
            {/* 左：手機 Logo 佔位 */}
            <div className="w-1/3 md:w-1/3">
              <div className="md:hidden">
                <Link href={toLocalePath("/")} aria-label="Home">
                  <div className="w-[160px] p-2">
                    <Image
                      src="/images/logo/有香餐飲集團-logo.png"
                      alt="有香餐飲集團"
                      width={180}
                      height={56}
                      priority
                    />
                  </div>
                </Link>
              </div>
            </div>

            {/* 中：桌機選單 */}
            <div className="hidden md:flex w-[60%] lg:w-[80%] items-center justify-center gap-8">
              <Link href={toLocalePath("/")} aria-label="Home" className="pl-2">
                <Image
                  src="/images/logo/有香餐飲集團-logo.png"
                  alt="有香餐飲集團"
                  width={150}
                  height={48}
                  priority
                  className="h-auto w-[190px]"
                />
              </Link>
            </div>

            {/* 右：訂購 / 會員 / 語系 / 購物車 / 漢堡 */}
            <div className="flex w-2/3 md:w-1/3 items-center justify-end pr-8 gap-3">
              {/* 會員 icon */}
              <div className="relative">
                <button
                  aria-label="user"
                  onClick={() => setUserOpen((v) => !v)}
                  className={[
                    "relative grid h-10 w-10 place-items-center rounded-full transition-colors",
                    navSolid
                      ? "border border-black/10 bg-black/5 hover:bg-black/10 text-black"
                      : "border border-white/20 bg-black/30 hover:bg-white/20 text-white",
                  ].join(" ")}
                >
                  <User2 size={18} />
                </button>

                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      {...fadeUp}
                      className={[
                        "absolute right-0 mt-2 w-60 rounded-xl shadow-xl backdrop-blur-md",
                        navSolid
                          ? "border border-black/10 bg-white/95 text-black"
                          : "border border-white/15 bg-black/80 text-white",
                      ].join(" ")}
                    >
                      {!auth.user ? (
                        <div className="p-2">
                          <button
                            onClick={() => {
                              setShowAuthModal(true);
                              setAuthMode("login");
                              setUserOpen(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors"
                          >
                            <LogIn size={16} /> {t("user.login")}
                          </button>
                          <button
                            onClick={() => {
                              setShowAuthModal(true);
                              setAuthMode("register");
                              setUserOpen(false);
                            }}
                            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors"
                          >
                            <User2 size={16} /> {t("user.register")}
                          </button>
                        </div>
                      ) : (
                        <div className="p-2 text-sm">
                          <div className="px-3 py-2">
                            Hi,{" "}
                            {auth.user.displayName ||
                              auth.user.name ||
                              auth.user.email}
                          </div>
                          <Link
                            href={toLocalePath("/account")}
                            className="block rounded-lg px-3 py-2 hover:bg-white/10 transition-colors"
                            onClick={() => setUserOpen(false)}
                          >
                            {t("user.account")}
                          </Link>
                          <button
                            onClick={() => {
                              authStore.logout();
                              setUserOpen(false);
                            }}
                            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-200 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut size={16} /> {t("user.logout")}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 語系切換（在購物車旁） */}
              <LangSwitcher scrolled={navSolid} />

              {/* 購物車 */}
              <button
                aria-label="cart"
                onClick={() => setCartOpen((v) => !v)}
                className={[
                  "relative grid h-10 w-10 place-items-center rounded-full transition-colors",
                  navSolid
                    ? "border border-black/10 bg-black/5 hover:bg-black/10 text-black"
                    : "border border-white/20 bg-black/30 hover:bg-white/20 text-white",
                ].join(" ")}
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-500 px-1 text-[11px] text-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* 手機漢堡（如果需要） */}
              <button
                aria-label="menu"
                onClick={() => setIsMenuOpen((v) => !v)}
                className={[
                  "ml-1 grid h-10 w-10 place-items-center rounded-full transition-colors md:hidden",
                  navSolid
                    ? "border border-black/10 bg-black/5 hover:bg-black/10 text-black"
                    : "border border-white/20 bg-black/30 hover:bg-white/20 text-white",
                ].join(" ")}
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ===== 購物車下拉：移出 nav，避免透明態影響 ===== */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* 背景遮罩（高於 nav） */}
            <motion.div
              {...cartOverlay}
              className="fixed inset-0 z-[2000] bg-black/35 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />
            {/* Panel */}
            <motion.section
              variants={cartPanel}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed right-4 ml-4 top-4 z-[2010] w-[min(920px,92vw)] rounded-2xl border border-black/10 bg-white/98 shadow-2xl backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-3">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <ShoppingCart size={18} />
                  {t("cart.title")}
                  {cartCount > 0 && (
                    <span className="ml-1 text-sm font-normal text-black/60">
                      · {cartCount} {t("cart.items")}
                    </span>
                  )}
                </div>
                <button
                  className="rounded-full px-3 py-1.5 text-sm text-gray-600 hover:bg-black/5"
                  onClick={() => setCartOpen(false)}
                >
                  {t("cart.close")}
                </button>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Items */}
                <div className="lg:col-span-2 max-h-[58vh] overflow-y-auto px-5 py-4">
                  {cart.length === 0 ? (
                    <EmptyCart />
                  ) : (
                    <ul className="space-y-3">
                      <AnimatePresence initial={false}>
                        {cart.map((it, i) => (
                          <motion.li
                            key={it.id}
                            custom={i}
                            variants={listItem}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="rounded-xl border border-black/10 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={it.img}
                                alt={itemName(it)}
                                className="h-20 w-20 shrink-0 rounded-lg bg-gray-50 object-contain ring-1 ring-black/5"
                              />

                              <div className="min-w-0 flex-1">
                                <div className="line-clamp-2 text-sm font-medium">
                                  {itemName(it)}
                                </div>

                                <div className="mt-2 flex items-center gap-2">
                                  <button
                                    className="grid h-7 w-7 place-items-center rounded-lg border border-black/10 hover:bg-black/5 active:scale-95 transition"
                                    onClick={() =>
                                      cartStore.setQty(
                                        it.id,
                                        Math.max(1, (it.qty || 1) - 1)
                                      )
                                    }
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <input
                                    className="h-7 w-12 rounded-lg border border-black/10 text-center text-sm"
                                    value={it.qty}
                                    onChange={(e) =>
                                      cartStore.setQty(
                                        it.id,
                                        Math.max(
                                          1,
                                          parseInt(e.target.value || "1", 10)
                                        )
                                      )
                                    }
                                  />
                                  <button
                                    className="grid h-7 w-7 place-items-center rounded-lg border border-black/10 hover:bg-black/5 active:scale-95 transition"
                                    onClick={() =>
                                      cartStore.setQty(it.id, (it.qty || 1) + 1)
                                    }
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                <div className="text-sm font-semibold">
                                  CA{"$ "}
                                  {(
                                    Number(it.price || 0) * (it.qty || 0)
                                  ).toLocaleString()}
                                </div>
                                <button
                                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 active:scale-95 transition"
                                  onClick={() => cartStore.remove(it.id)}
                                >
                                  <Trash2 size={14} />
                                  {t("cart.delete")}
                                </button>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>

                {/* Summary（已接 i18n） */}
                <div className="border-t border-black/10 lg:border-l lg:border-t-0">
                  <div className="sticky top-0 px-5 py-4">
                    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                      <div className="text-base font-semibold">
                        {t("cart.orderSummary")}
                      </div>

                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-black/70">
                            {t("cart.subtotal")}
                          </span>
                          <span className="font-medium">
                            CA$ {subtotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black/70">
                            {t("cart.shipping")}
                          </span>
                          <span className="text-black/60">
                            {t("cart.shipping.calc")}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-dashed border-black/10 pt-3">
                        <span className="font-semibold">{t("cart.total")}</span>
                        <span className="text-lg font-bold">
                          CA$ {subtotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-2">
                        <button
                          className="rounded-xl bg-black px-4 py-3 text-white shadow-sm hover:opacity-90 active:scale-[0.99] transition"
                          onClick={() => {
                            setCartOpen(false);
                            router.push(toLocalePath("/checkout"));
                          }}
                          disabled={cart.length === 0}
                        >
                          {t("cart.goCheckout")} ({cartCount})
                        </button>
                        <button
                          className="rounded-xl border border-black/15 bg-white px-4 py-3 text-black hover:bg-black/5 active:scale-[0.99] transition"
                          onClick={() => setCartOpen(false)}
                        >
                          {t("cart.continue")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>

      {/* ===== 手機：漢堡選單內容（白底 + 頂部對齊） ===== */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.18 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="fixed inset-0 z-[1900] bg-black/20 backdrop-blur-[2px]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ y: -12, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { type: "spring", stiffness: 420, damping: 32 },
              }}
              exit={{ y: -12, opacity: 0, transition: { duration: 0.18 } }}
              style={{ top: headerH }}
              className="fixed left-0 right-0 z-[1910] overflow-hidden bg-white text-gray-800 shadow-xl border border-gray-200/70"
            >
              <div className="flex flex-col gap-2 py-4 px-4">
                {/* 品牌門店 */}
                <div className="border-b border-gray-200 pb-2">
                  <button
                    className="flex w-full items-center justify-between py-2"
                    onClick={() => setIsBrandOpenMobile((v) => !v)}
                  >
                    <span className="text-base font-medium text-gray-900">
                      品牌門店
                    </span>
                    <motion.span
                      animate={{ rotate: isBrandOpenMobile ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block text-gray-600"
                    >
                      ▾
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isBrandOpenMobile && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: {
                            type: "spring",
                            stiffness: 360,
                            damping: 28,
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: { duration: 0.16 },
                        }}
                        className="pl-3"
                      >
                        {[
                          { label: "有香", href: "/main01" },
                          { label: "憶點點", href: "/main02" },
                          { label: "有香ㄟ灶腳", href: "/main03" },
                        ].map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block py-2 text-sm text-gray-700 hover:text-black"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 品牌菜單 */}
                <div className="border-b border-gray-200 pb-2">
                  <button
                    className="flex w-full items-center justify-between py-2"
                    onClick={() => setIsMenuOpenMobile((v) => !v)}
                  >
                    <span className="text-base font-medium text-gray-900">
                      品牌菜單
                    </span>
                    <motion.span
                      animate={{ rotate: isMenuOpenMobile ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block text-gray-600"
                    >
                      ▾
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isMenuOpenMobile && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: {
                            type: "spring",
                            stiffness: 360,
                            damping: 28,
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: { duration: 0.16 },
                        }}
                        className="pl-3"
                      >
                        {[
                          { label: "有香 菜單", href: "/menu/youxiang" },
                          { label: "憶點點 菜單", href: "/menu/yidiandian" },
                          { label: "有香ㄟ灶腳 菜單", href: "/menu/zhao-jiao" },
                        ].map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block py-2 text-sm text-gray-700 hover:text-black"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 其餘連結 */}
                {[
                  { label: "品牌動態", href: "/news" },
                  { label: "加盟合作", href: "/participation" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-3 text-gray-800 border-b border-gray-200 hover:text-black"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-2 py-4 px-4">
                <Link
                  href={toLocalePath("/products")}
                  className="py-3 text-gray-800 border-b border-gray-200 hover:text-black"
                >
                  {t("nav.order")}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 登入/註冊 Modal（柔順） */}
      <AuthModal
        open={showAuthModal}
        mode={authMode}
        loading={authLoading}
        error={authErr}
        onClose={() => setShowAuthModal(false)}
        onSwitchMode={() =>
          setAuthMode((m) => (m === "login" ? "register" : "login"))
        }
        onSubmit={async (payload) => {
          try {
            setAuthErr("");
            setAuthLoading(true);
            if (authMode === "login") {
              await authStore.login(payload);
            } else {
              await authStore.register(payload);
            }
            setShowAuthModal(false);
          } catch (e) {
            setAuthErr(String(e?.message || e));
          } finally {
            setAuthLoading(false);
          }
        }}
      />
    </div>
  );
};

export default SlideTabsExample;

/* ====== 空購物車（接 i18n） ====== */
function EmptyCart() {
  const t = useT();
  return (
    <div className="grid min-h-[220px] place-items-center rounded-xl border border-dashed border-black/15 bg-gray-50/60 text-center">
      <div>
        <ShoppingCart className="mx-auto mb-2 opacity-50" size={28} />
        <div className="text-sm text-black/60">{t("cart.noItems")}</div>
      </div>
    </div>
  );
}

/* ===== 登入/註冊 Modal + 表單（含 fade/scale 動畫） ===== */
function AuthModal({
  open,
  mode,
  onClose,
  onSwitchMode,
  onSubmit,
  loading,
  error,
}) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        variants={modalFade}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 z-[2000] grid place-items-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalCard}
          className="w-full max-w-[420px] rounded-2xl bg-white p-5 text-black shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {mode === "login" ? "Login" : "Register"}
            </h3>
            <button
              className="rounded-full px-2 py-1 text-gray-500 hover:bg-black/5"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <AuthForm
            mode={mode}
            loading={loading}
            error={error}
            onSubmit={onSubmit}
            switchMode={onSwitchMode}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function AuthForm({ mode, onSubmit, loading, error, switchMode }) {
  const [f, setF] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    name: "",
  });
  const onChange = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));

  const nameToFirstLast = (name) => {
    const s = String(name || "").trim();
    if (!s) return { first_name: "", last_name: "" };
    const parts = s.split(/\s+/);
    if (parts.length >= 2) {
      return {
        first_name: parts.slice(0, -1).join(" "),
        last_name: parts.at(-1),
      };
    }
    return { first_name: s, last_name: "" };
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (mode === "login") {
          onSubmit({ username: f.username.trim(), password: f.password });
        } else {
          if (
            !f.email.trim() ||
            !f.phone.trim() ||
            !f.name.trim() ||
            !f.password
          ) {
            alert("Please complete: Email, Phone, Name, Password");
            return;
          }
          const { first_name, last_name } = nameToFirstLast(f.name);
          onSubmit({
            email: f.email.trim(),
            password: f.password,
            phone: f.phone.trim(),
            name: f.name.trim(),
            first_name,
            last_name,
          });
        }
      }}
      className="space-y-3"
    >
      {mode === "login" ? (
        <>
          <input
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            placeholder="Email or phone"
            value={f.username}
            onChange={onChange("username")}
            autoComplete="username"
            required
          />
          <input
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            type="password"
            placeholder="Password"
            value={f.password}
            onChange={onChange("password")}
            autoComplete="current-password"
            required
          />
        </>
      ) : (
        <>
          <input
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            type="email"
            placeholder="Email (required)"
            value={f.email}
            onChange={onChange("email")}
            autoComplete="email"
            required
          />
          <input
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            type="tel"
            placeholder="Phone (required)"
            value={f.phone}
            onChange={onChange("phone")}
            inputMode="tel"
            autoComplete="tel"
            required
          />
          <input
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            placeholder="Name (required)"
            value={f.name}
            onChange={onChange("name")}
            autoComplete="name"
            required
          />
          <input
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            type="password"
            placeholder="Password (required)"
            value={f.password}
            onChange={onChange("password")}
            autoComplete="new-password"
            required
          />
        </>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-600"
        >
          {error}
        </motion.div>
      )}

      <button
        disabled={loading}
        className="w-full rounded-xl bg-black px-4 py-2 text-white shadow-sm hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50"
      >
        {loading
          ? "Processing…"
          : mode === "login"
          ? "Login"
          : "Register and Login"}
      </button>

      <div className="text-center text-sm text-gray-600">
        {mode === "login" ? (
          <>
            No account yet?{" "}
            <button type="button" onClick={switchMode} className="underline">
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button type="button" onClick={switchMode} className="underline">
              Login
            </button>
          </>
        )}
      </div>
    </form>
  );
}
