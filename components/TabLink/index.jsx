
'use client'
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";



let tabs = [
    { id: "UltraE", label: "UltraE" , url: 'UP100' },
    { id: "UltraPeace", label: "UltraPeace", url: ' Products/product01' },
    { id: "Ulreahp", label: "Ulreahp", url: '/' },
   
   
];

export default function App() {
    let [activeTab, setActiveTab] = useState(tabs[2].id);

    return (
        <div className="fixed w-[100vw] hover:opacity-[1] bottom-[35px] z-[99999999]  flex justify-center">
            <div className="flex space-x-1   rounded-full p-2  bg-rose-600  ">
                {tabs.map((tab) => (
                    <a
                        href={tab.url}
                        key={tab.id}
                        onMouseOver={() => setActiveTab(tab.id)}
                        className={`${activeTab === tab.id ? "" : "hover:text-white/60"
                            } relative rounded-full px-3 py-1.5 text-sm font-medium text-white outline-sky-400 transition focus-visible:outline-2`}
                        style={{
                            WebkitTapHighlightColor: "transparent",
                        }}
                    >
                        {activeTab === tab.id && (
                            <motion.span
                                layoutId="bubble"
                                className="absolute inset-0 z-1 bg-white mix-blend-difference"
                                style={{ borderRadius: 9999 }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {tab.label}
                    </a>
                    
                ))}
            </div>
          
        </div>
    );
}
