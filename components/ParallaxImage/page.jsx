"use client";
import React, { useRef, useEffect, useState } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import "./style.css";

const lerp = (start, end, factor) => start + (end - start) * factor;

const ParallaxImage = ({ src, alt }) => {
  const imageRef = useRef(null);
  const bounds = useRef(null);
  const currentTranslateY = useRef(0);
  const targetTranslateY = useRef(0);
  const rafId = useRef(null);
  const [isMobile, setIsMobile] = useState(false); // State to track mobile view

  useEffect(() => {
    const updateBounds = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        bounds.current = {
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
        };
      }
    };

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    checkIfMobile();
    updateBounds();
    window.addEventListener("resize", updateBounds);
    window.addEventListener("resize", checkIfMobile);

    const animate = () => {
      if (imageRef.current && !isMobile) {
        // Apply parallax only if not mobile
        currentTranslateY.current = lerp(
          currentTranslateY.current,
          targetTranslateY.current,
          0.1
        );

        if (
          Math.abs(currentTranslateY.current - targetTranslateY.current) > 0.01
        ) {
          imageRef.current.style.transform = `translateY(${currentTranslateY.current}px) scale(1.5)`;
        }
      } else if (imageRef.current && isMobile) {
        // Reset style for mobile
        imageRef.current.style.transform = "none";
      }
      rafId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("resize", checkIfMobile);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isMobile]);

  useLenis(({ scroll }) => {
    if (!bounds.current || isMobile) return; // Skip parallax on mobile
    const relativeScroll = scroll - bounds.current.top;
    targetTranslateY.current = relativeScroll * 0.2;
  });

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      style={{
        transform: isMobile ? "none" : "translateY(0) scale(1.25)", // Adjust based on mobile
      }}
    />
  );
};

export default ParallaxImage;
