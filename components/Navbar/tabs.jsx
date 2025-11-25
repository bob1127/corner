// components/SlideTabsExample.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
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
      ["關於有香餐飲集團", "/main01"],
      ["有香", "/brand01"],
      ["憶點點", "/brand02"],
      ["有香ㄟ灶腳", "/brand03"],
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

/* ====== 加入購物車成功：右下角 Toast-Popup ====== */
function AddToCartPopup({
  open,
  item,
  subtotal,
  onClose,
  onCheckout,
  getName,
}) {
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onClose, 2800);
    return () => clearTimeout(id);
  }, [open, onClose]);

  const displayName = item ? getName?.(item) || item.name || "" : "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={modalCard}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed bottom-6 right-6 z-[2100] w-[min(420px,92vw)] rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-md"
        >
          <button
            className="absolute right-3 top-3 rounded-full px-2 py-1 text-gray-500 hover:bg-black/5"
            onClick={onClose}
            aria-label={t("pd.toast.close", "關閉")}
          >
            ✕
          </button>
          <div className="p-4">
            <div className="mb-3 flex items-center gap-2 text-base font-semibold">
              <ShoppingCart size={18} /> {t("pd.toast.added", "已加入購物車：")}
            </div>
            {item && (
              <div className="flex items-center gap-3">
                <img
                  src={item.img}
                  alt={displayName}
                  className="h-16 w-16 shrink-0 rounded-lg bg-gray-50 object-contain ring-1 ring-black/5"
                />
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-sm font-medium">
                    {displayName}
                  </div>
                  <div className="mt-1 text-xs text-black/60">
                    {t("pd.toast.qty", "數量")}：{item.qty || 1}
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  CA${" "}
                  {(
                    Number(item.price || 0) * Number(item.qty || 1)
                  ).toLocaleString()}
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between border-t border-dashed border-black/10 pt-3">
              <span className="text-sm text-black/70">
                {t("cart.subtotal", "小計")}
              </span>
              <span className="text-lg font-bold">
                CA$ {Number(subtotal || 0).toLocaleString()}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={onCheckout}
                className="rounded-xl bg-black px-4 py-2.5 text-white hover:opacity-90 active:scale-[0.99] transition"
              >
                {t("cart.goCheckout", "前往結帳")}
              </button>
              <button
                onClick={onClose}
                className="rounded-xl border border-black/15 bg-white px-4 py-2.5 text-black hover:bg-black/5 active:scale-[0.99] transition"
              >
                {t("cart.continue", "繼續購物")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const SlideTabsExample = () => {
  const router = useRouter();
  const t = useT();
  const { locale, asPath } = router;
  const currentLocale = locale ?? "en";

  /* ===== 語系判斷（跟 checkout 同邏輯） ===== */
  const isCN = useMemo(() => {
    const loc = router?.locale || "";
    if (loc && /^(zh|cn)/i.test(loc)) return true;
    const p = router?.asPath || "";
    return p === "/cn" || p.startsWith("/cn/");
  }, [router.locale, router.asPath]);

  /* ===== 名稱挑選（依語系 + 後相容） ===== */
  const itemName = (it) => {
    const zh =
      it?.name_zh ||
      it?.zh_name ||
      it?.cn_name ||
      it?.extensions?.custom_acf?.zh_product_name ||
      "";
    const en = it?.name_en || it?.name || "";
    return isCN ? zh || en : en || zh;
  };

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
  const [authMode, setAuthMode] = useState("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [authErr, setAuthErr] = useState("");

  // 線上點餐彈出框
  const [showOrderPopup, setShowOrderPopup] = useState(false);

  // 加入購物車成功提示
  const [showAdded, setShowAdded] = useState(false);
  const [addedItem, setAddedItem] = useState(null);

  useEffect(() => {
    authStore.init();
    const unsub = authStore.subscribe((s) => setAuth({ ...s }));
    return unsub;
  }, []);

  // ✅ 加入購物車時，存雙語欄位
  const handleAddToCart = (item) => {
    const payload = {
      id: item.id,
      name: item.name, // 當下語系顯示名
      name_en: item.name_en || item.name || "",
      name_zh:
        item.name_zh ||
        item.extensions?.custom_acf?.zh_product_name ||
        item.extensions?.custom_acf?.cn_name ||
        "",
      img: item.img,
      price: item.price,
    };

    cartStore.add(payload, item.qty || 1);

    setAddedItem({
      ...payload,
      qty: item.qty || 1,
    });
    setShowAdded(true);
  };

  const handleLangChange = (nextLocale) => {
    if (nextLocale === currentLocale) return;
    router.push(asPath, asPath, {
      locale: nextLocale,
      scroll: false,
    });
  };

  return (
    <div>
      {/* 手機菜單遮罩 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            {...modalFade}
            className="fixed inset-0 z-[900] pointer-events-none"
          >
            <div className="w-full h-full bg-black/35 backdrop-blur-sm pointer-events-auto" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        key="navbar"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: easeOut }}
        className="fixed left-0 top-0 z-[1000] bg-white sm:bg-transparent w-full"
      >
        <div className="mx-auto w-full mt-0 sm:mt-5 py-2 sm:py-0 px-2 text-white">
          <div className="flex items-center">
            {/* 左：手機 Logo */}
            <div className="w-1/3 md:w-1/3">
              <div className="md:hidden">
                <Link href="/" aria-label="Home">
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
              <FlyoutLink
                href="/"
                label="品牌門店"
                FlyoutContent={BrandStoresContent}
              />
              <FlyoutLink
                href="/menu"
                label="品牌菜單"
                FlyoutContent={BrandMenuContent}
              />

              {/* 中間 Logo */}
              <Link href="/" aria-label="Home" className="pl-2">
                <Image
                  src="/images/logo/有香餐飲集團-logo.png"
                  alt="有香餐飲集團"
                  width={150}
                  height={48}
                  priority
                  className="h-auto w-[190px]"
                />
              </Link>

              <Link
                href="/news"
                className="text-base font-medium text-black/80 hover:text-[#eda240] transition-colors"
              >
                品牌動態
              </Link>
              <Link
                href="/participation"
                className="text-base font-medium text-black/80 hover:text-[#eda240] transition-colors"
              >
                加盟合作
              </Link>
            </div>

            {/* 右：訂購 / 語系 / 會員 / 購物車 / 漢堡 */}
            <div className="flex w-2/3 md:w-1/3 pr-8 items-center justify-end gap-3">
              {/* 語系切換：中 / EN（桌機） */}
              <div className="hidden sm:flex items-center">
                <div className="flex rounded-full bg-black/30 py-1 px-1 text-[12px] p-0.5 border border-white/30">
                  <button
                    type="button"
                    onClick={() => handleLangChange("cn")}
                    className={`px-2 py-0.5 rounded-full transition-colors ${
                      currentLocale === "cn"
                        ? "bg-white text-black"
                        : "text-white/80 hover:bg白/10"
                    }`}
                  >
                    CN
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLangChange("en")}
                    className={`px-2 py-0.5 rounded-full transition-colors ${
                      currentLocale === "en"
                        ? "bg-white text-black"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* 會員 icon */}
              <div className="relative">
                <button
                  aria-label="user"
                  onClick={() => setUserOpen((v) => !v)}
                  className="relative grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/30 hover:bg-white/20 transition-colors"
                >
                  <User2 size={18} />
                </button>

                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      {...fadeUp}
                      className="absolute right-0 mt-2 w-60 rounded-xl border border-white/15 bg-black/80 text-white shadow-xl backdrop-blur-md"
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
                            <LogIn size={16} /> {t("user.login", "登入")}
                          </button>
                          <button
                            onClick={() => {
                              setShowAuthModal(true);
                              setAuthMode("register");
                              setUserOpen(false);
                            }}
                            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors"
                          >
                            <User2 size={16} /> {t("user.register", "註冊")}
                          </button>
                        </div>
                      ) : (
                        <div className="p-2 text-sm">
                          <div className="px-3 py-2">
                            嗨，
                            {auth.user.displayName ||
                              auth.user.name ||
                              auth.user.email}
                          </div>
                          <Link
                            href="/account"
                            className="block rounded-lg px-3 py-2 hover:bg-white/10 transition-colors"
                            onClick={() => setUserOpen(false)}
                          >
                            {t("user.account", "我的帳戶 / 訂單")}
                          </Link>
                          <button
                            onClick={() => {
                              authStore.logout();
                              setUserOpen(false);
                            }}
                            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-200 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut size={16} /> {t("user.logout", "登出")}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 購物車 */}
              <button
                aria-label="cart"
                onClick={() => setCartOpen((v) => !v)}
                className="relative grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/30 hover:bg-white/20 transition-colors"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-500 px-1 text-[11px] text-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* 漢堡（手機） */}
              <div className="md:hidden pl-1">
                <button
                  aria-label="open menu"
                  className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
                    isMenuOpen
                      ? "bg-white border-gray-300 shadow-sm"
                      : "bg-white/90 border-gray-300 hover:bg-white"
                  }`}
                  onClick={() => setIsMenuOpen((v) => !v)}
                >
                  {isMenuOpen ? (
                    <X className="text-gray-700" />
                  ) : (
                    <Menu className="text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ===== 線上點餐自定義 Popup ===== */}
      <OrderPopup
        open={showOrderPopup}
        onClose={() => setShowOrderPopup(false)}
      >
        <div className="text-center text-sm text-black/70">
          這裡放你「線上點餐」的宣傳圖與連結（保留原本程式碼）
        </div>
      </OrderPopup>

      {/* 加入購物車成功 Toast */}
      <AddToCartPopup
        open={showAdded}
        item={addedItem}
        subtotal={subtotal}
        onClose={() => setShowAdded(false)}
        onCheckout={() => {
          setShowAdded(false);
          setCartOpen(true); // 或 router.push('/checkout')
        }}
        getName={itemName}
      />

      {/* ====== 購物車 Drawer ====== */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              {...cartOverlay}
              className="fixed inset-0 z-[2000] bg-black/35 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />
            <motion.section
              variants={cartPanel}
              initial="initial"
              animate="animate"
              exit="exit"
              className="thin-scrollbar fixed h-[95vh] overflow-y-auto right-4 ml-4 top-4 z-[2010] w-[min(920px,92vw)] rounded-2xl border border-black/10 bg-white/98 shadow-2xl backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-3">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <ShoppingCart size={18} />
                  {t("cart.title", "購物車")}
                  {cartCount > 0 && (
                    <span className="ml-1 text-sm font-normal text-black/60">
                      · {cartCount} {t("cart.items", "件")}
                    </span>
                  )}
                </div>
                <button
                  className="rounded-full px-3 py-1.5 text-sm text-gray-600 hover:bg-black/5"
                  onClick={() => setCartOpen(false)}
                >
                  {t("cart.close", "關閉")}
                </button>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Items */}
                <div className="lg:col-span-2  h-full overflow-y-auto px-5 py-4">
                  {cart.length === 0 ? (
                    <EmptyCart />
                  ) : (
                    <ul className="space-y-3">
                      <AnimatePresence initial={false}>
                        {cart.map((it, i) => {
                          const name = itemName(it);
                          return (
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
                                  alt={name}
                                  className="h-20 w-20 shrink-0 rounded-lg bg-gray-50 object-contain ring-1 ring-black/5"
                                />

                                <div className="min-w-0 flex-1">
                                  <div className="line-clamp-2 text-sm font-medium">
                                    {name}
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
                                        cartStore.setQty(
                                          it.id,
                                          (it.qty || 1) + 1
                                        )
                                      }
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                  <div className="text-sm font-semibold">
                                    CA${" "}
                                    {(
                                      Number(it.price || 0) * (it.qty || 0)
                                    ).toLocaleString()}
                                  </div>
                                  <button
                                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 active:scale-95 transition"
                                    onClick={() => cartStore.remove(it.id)}
                                  >
                                    <Trash2 size={14} />
                                    {t("cart.delete", "移除")}
                                  </button>
                                </div>
                              </div>
                            </motion.li>
                          );
                        })}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>

                {/* Summary */}
                <div className="border-t border-black/10 lg:border-l lg:border-t-0">
                  <div className="sticky top-0 px-5 py-4">
                    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                      <div className="text-base font-semibold">
                        {t("cart.orderSummary", "訂單摘要")}
                      </div>

                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-black/70">
                            {t("cart.subtotal", "小計")}
                          </span>
                          <span className="font-medium">
                            CA$ {subtotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black/70">
                            {t("cart.shipping", "運費")}
                          </span>
                          <span className="text-black/60">
                            {t("cart.shipping.calc", "結帳計算")}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-dashed border-black/10 pt-3">
                        <span className="font-semibold">
                          {t("cart.total", "總計")}
                        </span>
                        <span className="text-lg font-bold">
                          CA$ {subtotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-2">
                        <button
                          className="rounded-xl bg-black px-4 py-3 text-white shadow-sm hover:opacity-90 active:scale-[0.99] transition"
                          onClick={() => {
                            setCartOpen(false);
                            router.push("/checkout");
                          }}
                          disabled={cart.length === 0}
                        >
                          {t("cart.goCheckout", "前往結帳")} ({cartCount})
                        </button>
                        <button
                          className="rounded-xl border border-black/15 bg-white px-4 py-3 text-black hover:bg-black/5 active:scale-[0.99] transition"
                          onClick={() => setCartOpen(false)}
                        >
                          {t("cart.continue", "繼續購物")}
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

      {/* ===== 登入/註冊 Modal ===== */}
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

/* ===== 空購物車 ===== */
function EmptyCart() {
  const t = useT();
  return (
    <div className="grid min-h-[220px] place-items-center rounded-xl border border-dashed border-black/15 bg-gray-50/60 text-center">
      <div>
        <ShoppingCart className="mx-auto mb-2 opacity-50" size={28} />
        <div className="text-sm text-black/60">
          {t("cart.noItems", "目前沒有商品")}
        </div>
      </div>
    </div>
  );
}

/* ===== 線上點餐自定義 Popup ===== */
function OrderPopup({ open, onClose, children }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        variants={modalFade}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 z-[9999999999] grid place-items-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalCard}
          className="relative w-full max-w-[1560px] bg-[#dcdedd] p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute right-4 top-4 text-gray-500 hover:text-black"
            onClick={onClose}
          >
            ✕
          </button>
          <div>{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ===== 登入/註冊 Modal + 表單 ===== */
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
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        }}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 z-[2000] grid place-items-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          variants={{
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
          }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className="w-full max-w-[420px] rounded-2xl bg-white p-5 text-black shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {mode === "login" ? "會員登入" : "會員註冊"}
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
            alert("請完整填寫：Email、手機、姓名、密碼");
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
            placeholder="Email 或手機"
            value={f.username}
            onChange={onChange("username")}
            autoComplete="username"
            required
          />
          <input
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            type="password"
            placeholder="密碼"
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
            placeholder="Email（必填）"
            value={f.email}
            onChange={onChange("email")}
            autoComplete="email"
            required
          />
          <input
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            type="tel"
            placeholder="手機號碼（必填）"
            value={f.phone}
            onChange={onChange("phone")}
            inputMode="tel"
            autoComplete="tel"
            required
          />
          <input
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            placeholder="姓名（必填）"
            value={f.name}
            onChange={onChange("name")}
            autoComplete="name"
            required
          />
          <input
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            type="password"
            placeholder="設定密碼（必填）"
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
        {loading ? "處理中…" : mode === "login" ? "登入" : "註冊並登入"}
      </button>

      <div className="text-center text-sm text-gray-600">
        {mode === "login" ? (
          <>
            還沒有帳號？{" "}
            <button type="button" onClick={switchMode} className="underline">
              前往註冊
            </button>
          </>
        ) : (
          <>
            已有帳號？{" "}
            <button type="button" onClick={switchMode} className="underline">
              立即登入
            </button>
          </>
        )}
      </div>
    </form>
  );
}
