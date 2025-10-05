"use client";

import { useEffect } from "react";
import { useCart } from "./context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  const {
    cartItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    isOpen,
    setIsOpen,
  } = useCart();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    console.log("Sidebar state updated, isOpen:", isOpen);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="sidebar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999]"
        >
          {/* 背景遮罩 */}
          <div
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={toggleSidebar}
          />

          {/* Sidebar 內容 */}
          <motion.div
            className="absolute right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold">購物車</h2>
              <button onClick={toggleSidebar} aria-label="關閉購物車">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-600 hover:text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* 商品清單 */}
            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className="p-5 text-center text-gray-500">您的購物車是空的</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <li key={index} className="flex px-4 py-4 gap-4">
                      {/* 商品圖片 */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                      {/* 商品資訊 */}
                      <div className="flex flex-col justify-between flex-1 text-sm text-right">
                        <div className="space-y-1">
                          <p className="font-semibold break-words">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            顏色: {item.color}｜尺寸: {item.size}
                          </p>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm font-medium text-gray-800">
                            ${item.price}
                          </p>
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.color,
                                  item.size,
                                  item.quantity - 1
                                )
                              }
                              className="px-2 border rounded text-gray-600"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.color,
                                  item.size,
                                  item.quantity + 1
                                )
                              }
                              className="px-2 border rounded text-gray-600"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() =>
                              removeFromCart(item.id, item.color, item.size)
                            }
                            className="text-xs text-red-500 hover:underline"
                          >
                            刪除
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 底部結帳區塊 */}
            <div className="border-t border-gray-200 px-6 py-4">
              <p className="text-right text-base font-semibold mb-4">
                訂單總金額: ${totalPrice}
              </p>
              <Link
                href="/Cart"
                target="_blank"
                className="block w-full text-center bg-[#20a2e3] text-white py-3 rounded-full hover:bg-[#3294c8] transition"
              >
                前往結帳
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
