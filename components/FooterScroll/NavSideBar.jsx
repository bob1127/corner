"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function NavbarWithSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white p-4 flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-gray-800 hover:bg-gray-700"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-lg font-semibold">My App</h1>
      </nav>

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg p-5"
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 p-2 bg-gray-700 rounded-md"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul className="space-y-3">
          <li>
            <a href="#" className="block p-2 hover:bg-gray-700 rounded">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="block p-2 hover:bg-gray-700 rounded">
              About
            </a>
          </li>
          <li>
            <a href="#" className="block p-2 hover:bg-gray-700 rounded">
              Services
            </a>
          </li>
          <li>
            <a href="#" className="block p-2 hover:bg-gray-700 rounded">
              Contact
            </a>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
