"use client";
import { useEffect, useRef, useState, RefObject } from "react";
import {
  motion,
  useAnimation,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

function useScrollParallax(ref: RefObject<HTMLElement>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 15,
    mass: 0.3,
  });

  const y1 = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    ["120px", "0px", "-20px"]
  );
  const y2 = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    ["80px", "0px", "-20px"]
  );
  const y3 = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    ["40px", "0px", "-20px"]
  );

  return { y1, y2, y3 };
}

export default function IntroHero() {
  const logoControls = useAnimation();
  const phonesControls = useAnimation();
  const titleControls = useAnimation();
  const textControls = useAnimation();
  const [activeImage, setActiveImage] = useState<{
    src: string;
    text: string;
  } | null>(null);

  const sectionA = useRef<HTMLElement>(null);
  const sectionB = useRef<HTMLElement>(null);
  const sectionC = useRef<HTMLElement>(null);

  const { y1: y1A, y2: y2A, y3: y3A } = useScrollParallax(sectionA);
  const { y1: y1B, y2: y2B, y3: y3B } = useScrollParallax(sectionB);
  const { y1: y1C, y2: y2C, y3: y3C } = useScrollParallax(sectionC);

  useEffect(() => {
    async function sequence() {
      await logoControls.start({
        scale: 1,
        y: 0,
        opacity: 1,
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
      });
      await Promise.all([
        logoControls.start({
          scale: 0.5,
          y: "-160px",
          transition: { duration: 1.1, ease: [0.33, 1, 0.68, 1] },
        }),
        phonesControls.start({
          opacity: 1,
          y: -160,
          scale: 1,
          transition: { duration: 1.3, ease: [0.33, 1, 0.68, 1] },
        }),
        titleControls.start({
          opacity: 1,
          y: -160,
          scale: 1,
          transition: { duration: 1.3, ease: [0.33, 1, 0.68, 1] },
        }),
      ]);
      textControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.2 },
      });
    }
    sequence();
  }, []);

  const renderSteps = (y1: any, y2: any, y3: any) => {
    const steps = [
      { src: "step01", y: y1, text: "Step 1：點擊設定裡的行動服務選項" },
      { src: "step02", y: y2, text: "Step 2：選擇加入 eSIM" },
      { src: "step03", y: y3, text: "Step 3：掃描 QR Code 完成設定" },
    ];
    return (
      <div className="flex gap-8">
        {steps.map((step, idx) => (
          <div key={idx} className="relative group">
            <motion.img
              src={`/images/step/${step.src}.png`}
              alt={`Phone ${idx + 1}`}
              className="w-[200px] md:w-[280px] cursor-pointer object-contain"
              style={{ y: step.y }}
              onClick={() =>
                setActiveImage({
                  src: `/images/step/${step.src}.png`,
                  text: step.text,
                })
              }
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-white text-black text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              {step.text}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section className="relative bg-white flex flex-col items-center justify-center">
        <motion.div
          className="z-10 text-4xl flex flex-col justify-center items-center font-extrabold mb-4"
          initial={{ scale: 2.2, y: 0, opacity: 0 }}
          animate={logoControls}
        >
          <div className="logo bg-[#1757ff] text-white rounded-[20px] flex justify-center items-center w-[180px] h-[180px] shadow-xl">
            ESIM
          </div>
          <span className="text-[26px]">iOS</span>
        </motion.div>
        <motion.div
          className="font-bold text-neutral-800 text-[45px] mb-6"
          initial={{ opacity: 0, y: 0, scale: 0.95 }}
          animate={titleControls}
        >
          LET'S GET ESIM
        </motion.div>
        <motion.div
          className="relative flex gap-4 z-0"
          initial={{ opacity: 0, y: 100, scale: 1.1 }}
          animate={phonesControls}
        >
          {["step01", "step02", "step03"].map((img, i) => (
            <div className="group relative" key={i}>
              <img
                src={`/images/step/${img}.png`}
                alt={`Phone ${i + 1}`}
                className="w-[80px] md:w-[220px] object-contain"
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-black text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Step {i + 1}
              </div>
            </div>
          ))}
        </motion.div>
        <motion.div
          className="absolute bottom-10 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={textControls}
        >
          <h1 className="text-3xl font-bold">選擇您的旅遊地區</h1>
          <p className="text-neutral-600 mt-2">Powered by Motion + Tailwind</p>
        </motion.div>
      </section>

      <section
        ref={sectionA}
        className="bg-white mt-[80px] pt-[60px] pb-[160px] flex flex-col items-center"
      >
        <h2 className="text-4xl font-bold mb-12 text-center">
          eSIM Tutorial <br /> 出國當日可於有網路的狀態下完成 1~7 步驟
        </h2>
        {renderSteps(y1A, y2A, y3A)}
      </section>
      <section
        ref={sectionB}
        className="bg-white mt-[80px] pt-[60px] pb-[160px] flex flex-col items-center"
      >
        <h2 className="text-4xl font-bold mb-12 text-center">
          啟用 eSIM <br /> eSIM 安裝及設定
        </h2>
        {renderSteps(y1B, y2B, y3B)}
      </section>
      <section
        ref={sectionC}
        className="bg-white mt-[80px] pt-[60px] pb-[160px] flex flex-col items-center"
      >
        <h2 className="text-4xl font-bold mb-12 text-center">
          切換 eSIM <br /> 抵達目的地後再進行 ⑧~10 步驟
        </h2>
        {renderSteps(y1C, y2C, y3C)}
      </section>

      <AnimatePresence>
        {activeImage && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
          >
            <div
              className="relative text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 inline-block bg-white text-black text-sm px-4 py-2 rounded shadow">
                {activeImage.text}
              </div>
              <img
                src={activeImage.src}
                alt="Preview"
                className="max-w-[90vw] max-h-[80vh] object-contain mx-auto"
              />
              <button
                className="absolute top-2 right-2 bg-white text-black rounded-full px-3 py-1 font-bold shadow"
                onClick={() => setActiveImage(null)}
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
