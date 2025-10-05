// ParallaxForks.jsx
"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * - /images/01.png ~ /images/04.png
 * - 新增 3 張「文字圖片」：/images/food-09.png、/images/food10.png、/images/food11.png
 * - 僅上下左右位移視差（不旋轉、不改大小與定位）
 */
export default function ParallaxForks({
  width = 420,
  height = 720,
  strength = 60, // 整體移動距離
  smooth = 0.18, // 移動速度（越大越快）
}) {
  const rootRef = useRef(null);
  const layersRef = useRef([]); // 0~3: 圖層, 4~6: 文字圖片

  let tx = 0,
    ty = 0,
    cx = 0,
    cy = 0,
    raf = 0;

  useEffect(() => {
    const root = rootRef.current;

    const calc = (clientX, clientY) => {
      const r = root.getBoundingClientRect();
      const px = (clientX - r.left) / r.width;
      const py = (clientY - r.top) / r.height;
      tx = (px - 0.5) * strength * 2.5;
      ty = (py - 0.5) * strength * 2.5;
      startRAF();
    };

    const onMove = (e) => calc(e.clientX, e.clientY);
    const onLeave = () => {
      tx = 0;
      ty = 0;
      startRAF();
    };
    const onTouch = (e) => {
      const t = e.touches?.[0];
      if (t) calc(t.clientX, t.clientY);
    };

    const startRAF = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      // 線性平滑（無抖動）
      cx += (tx - cx) * smooth;
      cy += (ty - cy) * smooth;

      // 01~04 + 文字(3張) 的倍率（背景最小、前景最大）
      const multipliers = [0.25, 0.6, 0.9, 1.2, 1.35, 1.35, 1.35];

      layersRef.current.forEach((el, i) => {
        if (!el) return;
        const m = multipliers[i] ?? 1;
        const lx = -(cx * m);
        const ly = -(cy * m);
        el.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      });

      if (Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        cx = tx;
        cy = ty;
        raf = 0;
      }
    };

    root.addEventListener("mousemove", onMove, { passive: true });
    root.addEventListener("mouseleave", onLeave, { passive: true });
    root.addEventListener("touchmove", onTouch, { passive: true });
    root.addEventListener("touchstart", onTouch, { passive: true });
    root.addEventListener("touchend", onLeave, { passive: true });

    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("touchmove", onTouch);
      root.removeEventListener("touchstart", onTouch);
      root.removeEventListener("touchend", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength, smooth]);

  return (
    <div
      ref={rootRef}
      className="parallax-root  !w-full relative overflow-hidden  mt-[0px] py-[0px] !h-[550px]"
      style={{ width, height }}
      aria-label="Parallax forks (mouse-follow)"
    >
      {/* 01：最底層模糊背景（鋪滿） */}
      <img
        ref={(el) => (layersRef.current[0] = el)}
        className="layer bg max-w-[330px] w-full img01"
        src="/images/01.png"
        alt="bg"
        draggable="false"
      />
      {/* 02 */}
      <img
        ref={(el) => (layersRef.current[1] = el)}
        className="layer img02"
        src="/images/02.png"
        alt="02"
        draggable="false"
      />
      {/* 03 */}
      <img
        ref={(el) => (layersRef.current[2] = el)}
        className="layer img03"
        src="/images/03.png"
        alt="03"
        draggable="false"
      />
      {/* 04 */}
      <img
        ref={(el) => (layersRef.current[3] = el)}
        className="layer img04"
        src="/images/04.png"
        alt="04"
        draggable="false"
      />

      {/* 文字圖片：普通大小、固定定位，只跟著移動 */}
      <img
        ref={(el) => (layersRef.current[4] = el)}
        className="layer txtLayer yummy"
        src="/images/food-09.png"
        alt="Yummy"
        draggable="false"
      />
      <img
        ref={(el) => (layersRef.current[5] = el)}
        className="layer txtLayer chicken"
        src="/images/food10.png"
        alt="鹹酥雞"
        draggable="false"
      />
      <img
        ref={(el) => (layersRef.current[6] = el)}
        className="layer txtLayer delicious"
        src="/images/food11.png"
        alt="delicious"
        draggable="false"
      />

      <style jsx>{`
        .parallax-root {
          position: relative;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 18px;
          background: #fff;
          user-select: none;
          -webkit-user-drag: none;
        }
        .layer {
          position: absolute;
          inset: 0;
          object-fit: contain;
          width: 100%;
          height: 100%;
          pointer-events: none;
          will-change: transform;
        }
        .bg {
          object-fit: cover;
          filter: blur(2px) saturate(1.05);
          opacity: 0.9;
        }

        /* 依畫面微調每層初始位置與大小（保留你原本設定） */
        .img01 {
          left: 30%;
          top: 27%;
          transform: translate3d(0, 0, 0);
          object-fit: contain;
        }
        .img02 {
          left: -23%;
          top: 10%;
          transform: translate3d(0, 0, 0);
          object-fit: contain;
        }
        .img03 {
          left: -10%;
          top: 14%;
          object-fit: contain;
        }
        .img04 {
          left: 4%;
          top: 19%;
          object-fit: contain;
        }

        /* 文字圖片：普通大小（不要佔滿），外框位置固定，只跟位移 */
        .txtLayer {
          inset: auto; /* 不鋪滿 */
          width: 120px; /* 普通大小 */
          height: auto;
          object-fit: contain;
        }
        .yummy {
          left: 15%;
          top: 12%;
        }
        .chicken {
          left: 36%;
          top: -1%;
        }
        .delicious {
          left: 56%;
          top: 64%;
        }
      `}</style>
    </div>
  );
}
