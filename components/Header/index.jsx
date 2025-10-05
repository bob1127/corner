import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";
import styles from "./style.module.scss";
import Nav from "./Nav";

export default function MenuToggle({ isActive, setIsActive }) {
  const [showNav, setShowNav] = useState(false);
  const [menuWidth, setMenuWidth] = useState("480px");

  useEffect(() => {
    const updateWidth = () => {
      const isMobile = window.innerWidth <= 768;
      setMenuWidth(isMobile ? "90vw" : "480px");
    };

    updateWidth(); // 初始化
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowNav(true), 350);
      return () => clearTimeout(timer);
    } else {
      setShowNav(false);
    }
  }, [isActive]);

  // 保留原本動畫設定，僅 width 使用變數
  const menu = {
    open: {
      width: menuWidth,
      height: "650px",
      top: "-25px",
      right: "-25px",
      transition: {
        duration: 0.6,
        type: "tween",
        ease: [0.76, 0, 0.24, 1],
      },
    },
    closed: {
      width: "55px",
      height: "55px",
      top: "0px",
      right: "0px",
      transition: {
        duration: 0.4,
        delay: 0.4,
        type: "tween",
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  return (
    <div className={styles.header}>
      <motion.div
        className={styles.menu}
        variants={menu}
        animate={isActive ? "open" : "closed"}
        initial="closed"
        style={{ overflow: "hidden" }} // ✅ 避免 Nav 抖動
      >
        <AnimatePresence>{showNav && <Nav />}</AnimatePresence>
      </motion.div>
      <Button isActive={isActive} toggleMenu={() => setIsActive(!isActive)} />
    </div>
  );
}
