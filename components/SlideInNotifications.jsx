"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { FiCheckSquare, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

// Context for global use
const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const SlideInNotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (text) => {
    const id = Math.random();
    setNotifications((prev) => [{ id, text }, ...prev]);
    setTimeout(() => {
      removeNotif(id);
    }, 4000);
  };

  const removeNotif = (id) => {
    setNotifications((pv) => pv.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="flex flex-col gap-1 w-72 fixed top-4 right-4 z-50 pointer-events-auto">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ y: -15, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="p-3 flex items-start rounded gap-2 text-sm font-medium shadow-lg text-white bg-indigo-500 pointer-events-auto"
            >
              <FiCheckSquare className="mt-0.5" />
              <span>{n.text}</span>
              <button
                onClick={() => removeNotif(n.id)}
                className="ml-auto mt-0.5"
              >
                <FiX />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
