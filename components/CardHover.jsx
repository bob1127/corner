"use client"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

import Image from "next/image";

import { CldImage } from 'next-cloudinary';
// components/ThemeSwitcher.tsx
import { useTheme } from "next-themes";

export default function App() {



    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({
        currentTarget,
        clientX,
        clientY,
    }) {
        let { left, top } = currentTarget.getBoundingClientRect();

        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        
        <div className="container">
            <div className="relative h-[100vh]">

                <div
                    className="cardFiver group md:px-20 z-50 absolute top-0 left-0  w-full rounded-xl border border-white/10  px-8 py-16 shadow-2xl "
                    onMouseMove={handleMouseMove}
                >
                    <motion.div
                        className="pointer-events-none  -inset-px rounded-xl opacity-0 transition duration-00 group-hover:opacity-100"
                        style={{
                            background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.15),
              transparent 90%d
            )
          `,
                        }}
                    />
                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className=" ">
                            <h3 className="text-base font-semibold leading-7 text-sky-500">
                                {/* Nearly half of the global population is estimated to be infected with H. pylori */}
                            </h3>
                            <div className="mt-2 flex items-center gap-x-2">
                                <h2 className="md:text-3xl lg:text-5xl text-black font-bold tracking-tight ">
                                    免校正拋棄式pH電極


                                </h2>
                            </div>
                            <h3 className="mt-6 text-xl leading-7 text-gray-800">
                                滿足你對pH檢測的全面需求
                            </h3>
                            <p className="text-base  text-gray-700">
                                我們的免校正專利試片技術讓你的每一次 酸鹼測試pH檢測數據都精準無比!
                            </p>
                            <div className="btn">
                                關於蜂鳥探針電極
                            </div>
                        </div>
                        <div className=" h-80 overflow-hidden ">

                            {/* <iframe className="h-80 w-full scale-150" src="https://my.spline.design/planetearthdaycopy-2333a6dda7fecbc7779226b36abe6285/" frameborder="0"></iframe> */}


                        </div>
                    </div>
                </div>

                <Image src='/蜂鳥探針主視覺圖-無字1920X768_fgn8wa.webp' className='absolute rounded-2xl  z-1 top-0 left-0' width={1300} height={400} >
                </Image>

            </div>
        </div>
        
        
    );
}