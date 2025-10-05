"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GsapTextProps {
  text: string;
  id?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  lineHeight?: string;
  className?: string;
}

const GsapText: React.FC<GsapTextProps> = ({
  text,
  id = "gsap-text",
  fontSize = "50px",
  fontWeight = "normal",
  color = "#000",
  lineHeight = "80px",
  className = "",
}) => {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    // 先做 split
    const split = new SplitType(textRef.current, { types: "chars" });

    // 進場動畫
    gsap.set(split.chars, { y: 150 }); // 初始位置

    gsap.to(split.chars, {
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 80%", // 進入視窗底部時才觸發
        toggleActions: "play none none none",
      },
      y: 0,
      stagger: 0.03,
      duration: 1.2,
      ease: "power3.out",
    });

    return () => {
      // 清除 split 結構
      split.revert();
    };
  }, [text, id]);

  return (
    <p
      ref={textRef}
      id={id}
      className={className}
      style={{
        fontSize,
        fontWeight,
        color,
        lineHeight,
        textTransform: "uppercase",
        fontFamily: "'ResourceHanRoundedCN-Heavy', sans-serif",
        overflow: "hidden",
      }}
    >
      {text}
    </p>
  );
};

export default GsapText;
