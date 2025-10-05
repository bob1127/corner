// components/CustomAccordion.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AccordionItem = {
  question: string;
  answer: React.ReactNode;
};

export default function CustomAccordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`border border-gray-300 rounded-xl my-3 overflow-hidden transition-all duration-300 ${
              isOpen ? "bg-white" : "bg-transparent"
            }`}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-4 py-4 flex justify-between items-center"
            >
              <div className="text-lg font-medium">{item.question}</div>
              <div className="text-sm text-gray-500">{isOpen ? "-" : "+"}</div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-4 pb-4 text-sm leading-relaxed text-gray-700">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
