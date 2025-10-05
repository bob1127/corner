"use client";

import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils"; // 若你有使用 tailwind 的 cn 工具，可選擇移除

export default function ImageReveal({
  src,
  alt = "",
  className = "",
  width,
  height,
  placeholder = "empty",
  loading = "lazy",
}) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.4 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden w-full", className)}>
      <motion.div
        key={src}
        style={{ willChange: "transform, filter, opacity" }}
        initial={{ scale: 1.2, filter: "blur(8px)", opacity: 0 }}
        animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full h-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          placeholder={placeholder}
          loading={loading}
          style={{ objectFit: "cover" }}
        />
      </motion.div>
    </div>
  );
}
