"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "../../../components/context/UserContext";
import styles from "./style.module.scss";
import { motion } from "framer-motion";
import { links, footerLinks } from "./data";
import { perspective, slideIn } from "./anim";

const imgAnim = {
  initial: { width: 0 },
  open: {
    width: "10vw",
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  },
  closed: { width: 0, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } },
};

export default function Nav() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const { userInfo, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.div
      className={styles.nav}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      <div className={styles.body}>
        {links.map((link, i) => {
          const { title, href, imgSrc } = link;
          return (
            <div
              key={`b_${i}`}
              className={styles.linkContainer}
              onMouseEnter={() => !isMobile && setHoveredIndex(i)}
              onMouseLeave={() => !isMobile && setHoveredIndex(null)}
            >
              <motion.div
                custom={i}
                variants={perspective}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                <a href={href}>{title}</a>
              </motion.div>

              {!isMobile && (
                <motion.div
                  className={styles.imgContainer}
                  variants={imgAnim}
                  initial="initial"
                  animate={hoveredIndex === i ? "open" : "closed"}
                >
                  <img src={imgSrc} alt={title} />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* ✅ 登入／登出區塊 */}
      <div className="Login_Out px-4 py-2 text-center">
        {userInfo ? (
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-gray-700">
              Hi, {userInfo.name || userInfo.username}
            </span>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              登出
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
          >
            登入 / 註冊
          </button>
        )}
      </div>

      <div className="border-t-1 border-gray-300 flex justify-center pt-5">
        <motion.div className={styles.footer}>
          {footerLinks.map((link, i) => {
            const { title, href, iconSrc } = link;
            return (
              <motion.a
                href={href}
                variants={slideIn}
                custom={i}
                initial="initial"
                animate="enter"
                exit="exit"
                key={`f_${i}`}
                className="flex group"
              >
                <img
                  src={iconSrc}
                  alt={title}
                  className="w-[20px] h-[20px] mr-2"
                />
                <span className="text-gray-600 !tracking-wider font-light group-hover:scale-105 group-hover:font-bold">
                  {title}
                </span>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
