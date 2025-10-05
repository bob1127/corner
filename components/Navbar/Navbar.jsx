"use client";
import React, { useState, useEffect } from "react";
import { SlideTabsExample } from "./tabs.jsx"; // Adjust the path as per your file structure

import Link from "next/link";
// import { ThemeSwitcher } from "./ThemeSwitcher.tsx";
import { motion, AnimatePresence } from "framer-motion";
import ModalBtn02 from "../../components/ModalBtn-2.jsx";
import { useTheme } from "next-themes";
// import Switcher from '../Switcher.js';
import Image from "next/image";
// import MobileMenu from "../../components/MobileHeader/index.jsx";
// import modalBTN from '../../components//mobileMenu/index.jsx'
// import { ThemeSwitcher } from '@/app/ThemeSwitcher';
// import Switchers from '../Switcher.js/index.js'

// import MobileMenu from "../../components/Navbar/mobile-menu/MobileMenu.jsx";
const myLoader01 = ({ src, width, quality }) => {
  return `https://www.ultraehp.com/images/Products-Detail-Img/UP100/${src}?w=${width}&q=${
    quality || 75
  }`;
};
const myLoader02 = ({ src, width, quality }) => {
  return `https://www.ultraehp.com/images/Products-Detail-Img/UP100/${src}?w=${width}&q=${
    quality || 75
  }`;
};
const myLoader03 = ({ src, width, quality }) => {
  return `https://www.ultraehp.com/images/nav/${src}?w=${width}&q=${
    quality || 75
  }`;
};
const myLoader04 = ({ src, width, quality }) => {
  return `https://www.ultraehp.com/images/nav/mobile-nav/${src}?w=${width}&q=${
    quality || 75
  }`;
};

export default function App() {
  const [open, setOpen] = useState(false);

  const isOpen = () => {
    setOpen(true);
  };

  const closeMenu = () => {
    setOpen(false);
  };
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const currentTheme = theme === "system" ? systemTheme : theme;

  //lets start animation
  const item = {
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        ease: "easeInOut",
        duration: 0.3,
        delay: 1.2,
      },
    },
  };

  return (
    <div className="">
      <SlideTabsExample />
    </div>
  );
}
