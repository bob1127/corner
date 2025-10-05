// ==== SnackDropLoop：從上方慢慢落到袋口、輕彈一下、淡出，然後無限循環 ====
import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export function SnackDropLoop({
  anchorRef, // 袋口錨點（必填）
  className, // 你的最終定位（absolute + left/top/bottom）
  imgSrc,
  imgClassName = "w-[400px]",
  width = 1000,
  height = 1000,

  // 動畫參數
  spawn = 420, // 初始從多高開始掉（px，上方）
  sway = 120, // 左右微擺幅度（px，正值偏右）
  spin = 12, // 旋轉總角度（deg）
  initialScale = 0.95, // 初始縮放
  duration = 2.2, // 落下主段時間（秒）
  bounce = 10, // 掉進袋口後向下的小彈（px）
  fadeOutDelay = 0.05, // 到袋口後開始淡出的延遲（秒）
  loopDelay = 0.8, // 每圈之間的停頓（秒）
  z = 40,
  delay = 0, // 每個零食的起始延遲（做出先後落下）
  startRot = 0, // 初始角度（deg）
}) {
  const itemRef = useRef(null);
  const controls = useAnimation();
  const [delta, setDelta] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const runningRef = useRef(true);

  // 量測：從零食中心到錨點中心的位移（讓它能正確「掉到袋口」）
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
    setReady(true);
  };

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    const t = setTimeout(measure, 80);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    runningRef.current = true;
    if (!ready) return;

    const run = async () => {
      // 每圈：重置到「上方、透明」
      while (runningRef.current) {
        // 起始：在上方、微縮小、透明
        await controls.set({
          x: 0,
          y: -spawn,
          rotate: startRot,
          scale: initialScale,
          opacity: 0,
          zIndex: z,
        });

        // 進場（淡入）
        await wait(delay * 1000);
        await controls.start({
          opacity: 1,
          transition: { duration: 0.28 },
        });

        // 主落下段（帶左右輕擺 & 旋轉）
        await controls.start({
          x: [0, sway * 0.4, sway * 0.75, delta.x],
          y: [-spawn, -spawn * 0.35, -spawn * 0.12, delta.y],
          rotate: [
            startRot,
            startRot + spin * 0.5,
            startRot + spin * 0.8,
            startRot + spin,
          ],
          scale: [initialScale, 1, 1, 1],
          transition: {
            duration,
            ease: "easeInOut",
          },
        });

        // 輕微彈一下
        await controls.start({
          y: delta.y + bounce,
          transition: { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] },
        });
        await controls.start({
          y: delta.y,
          transition: { duration: 0.12, ease: "easeOut" },
        });

        // 到袋口後淡出
        await controls.start({
          opacity: 0,
          transition: { duration: 0.25, delay: fadeOutDelay },
        });

        // 下一圈前停頓
        await wait(loopDelay * 1000);
      }
    };

    run();
    return () => {
      runningRef.current = false;
      controls.stop();
    };
  }, [
    ready,
    delta.x,
    delta.y,
    controls,
    spawn,
    sway,
    spin,
    initialScale,
    duration,
    bounce,
    fadeOutDelay,
    loopDelay,
    delay,
    startRot,
    z,
  ]);

  return (
    <motion.div
      ref={itemRef}
      className={`absolute pointer-events-none ${className}`}
      animate={controls}
      style={{
        willChange: "transform, opacity",
        zIndex: z,
      }}
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
    </motion.div>
  );
}
