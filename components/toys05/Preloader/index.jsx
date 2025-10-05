"use client";
import styles from "./style.module.scss";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { opacity, slideUp } from "./anim";

const images = [
  "/images/l_2.png",
  "/images/look_1_2.png",
  "/images/l_7.png",
  "/images/截圖-20243-12-01-上午9.43.08.png",
  "/images/截圖-2024-12-05-晚上9.47.11-1.png",
];

export default function Index() {
  const [index, setIndex] = useState(0);

  const [dimension, setDimension] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (index === images.length - 1) return;

    const timer = setTimeout(
      () => {
        setIndex(index + 1);
      },

      index === 0 ? 1000 : 150
    );
    return () => clearTimeout(timer);
  }, [index]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height + 300} 0 ${
    dimension.height
  } L0 0`;

  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: {
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1],
      },
    },

    exit: {
      d: targetPath,
      transition: {
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className={styles.introduction}
    >
      {dimension.width > 0 && (
        <>
          <motion.div
            variants={opacity}
            initial="initial"
            animate="enter"
            className="image-container z-[99999999999]"
          >
            <img
              src={images[index]}
              alt={`Slide ${index}`}
              className="image"
              width={150}
              height={100}
            />
          </motion.div>
          <svg>
            <motion.path
              variants={curve}
              initial="initial"
              exit="exit"
            ></motion.path>
          </svg>
        </>
      )}
    </motion.div>
  );
}
