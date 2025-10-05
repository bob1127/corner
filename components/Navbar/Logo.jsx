"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className=" top-2 left-0 w-full  z-50">
      <a
        href="/"
        className="Logo rounded-[50px] mx-auto block py-2 text-center text-[30px] font-extrabold px-3 text-black"
      >
        <img
          src="/images/company-logo.png"
          alt="company-logo"
          className={`transition-all mx-auto  w-[45px] sm:w-[55px]  duration-300 
            ${isScrolled ? "lg:w-[55px]" : "lg:w-[110px]"}`}
        />
      </a>
    </div>
  );
}
