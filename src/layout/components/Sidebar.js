"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {Home, Activity, FileText, Settings, ChevronDown, LayoutDashboard } from "lucide-react";

export default function Sidebar({ isOpen }) {
  const [greenhouseOpen, setGreenhouseOpen] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      // <aside> a semantic HTML for sidebars
      className={`${isOpen ? "w-70" : "w-20"} 
      bg-[#2F4635] dark:bg-[#1E1E1E] text-white p-4 flex flex-col 
      transition-[width,background-color] duration-300 overflow-hidden`}
    >
      {/* dropdown */}
      <div className={`${isOpen ? "mb-4 mr-6 mt-7" : "mb-4 mt-7"}`}>
        <button
          onClick={() => setGreenhouseOpen(!greenhouseOpen)} // toggle dropdown open/close
          className={`flex items-center w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700
            ${isOpen ? "ml-3 justify-between gap-2" : "justify-center"}
            bg-white/5 hover:bg-white/10 dark:bg-gray-800/40 dark:hover:bg-gray-700/50 transition-colors`}
        >
          <Home size={15} className={`${isOpen ? "ml-2" : ""}`} />

          {/* To show text only if sidebar is open */}
          {isOpen && (
            <span className="flex-1 text-left text-sm whitespace-nowrap overflow-hidden">
              Greenhouse 1
            </span>
          )}

          {/* Dropdown arrow, rotate it when opened */}
          {isOpen && (
            <ChevronDown
              size={16}
              className={`transition-transform ${
                greenhouseOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {/* Dropdown items (only visible if sidebar is open and dropdown is expanded) */}
        {isOpen && greenhouseOpen && (
          <div className="mt-2 ml-14 space-y-1 text-sm">
            <a
              href="#"
              className="block hover:underline text-gray-100 dark:text-gray-300"
            >
              Greenhouse 1
            </a>
            <a
              href="#"
              className="block hover:underline text-gray-100 dark:text-gray-300"
            >
              Greenhouse 2
            </a>
          </div>
        )}
      </div>

      {/* Navigation links */}
      <nav className="space-y-2">
        {/* Dashboard link */}
        <a
          href="./dashboard"
          className={`flex p-3 rounded-lg font-medium transition-colors
            ${
              pathname === "/dashboard"
                ? "bg-[#DCE6DC] text-[#2F4635] dark:bg-gray-200 dark:text-gray-900"
                : "hover:bg-[#3C5A44] dark:hover:bg-gray-700"
            } 
            ${isOpen ? "my-3 mx-3 items-center gap-2" : "my-3 justify-center"}`}
        >
          <LayoutDashboard size={15} className={`${isOpen ? "ml-2" : ""}`} />
          {isOpen && (
            <span className="ml-1 whitespace-nowrap text-sm">Dashboard</span>
          )}
        </a>

        {/* Logs link */}
        <a
          href="./logs"
          className={`flex p-3 rounded-lg font-medium transition-colors
            ${
              pathname === "/logs"
                ? "bg-[#DCE6DC] text-[#2F4635] dark:bg-gray-200 dark:text-gray-900"
                : "hover:bg-[#3C5A44] dark:hover:bg-gray-700"
            } 
            ${isOpen ? "my-3 mx-3 items-center gap-2" : "my-3 justify-center"}`}
        >
          <FileText size={15} className={`${isOpen ? "ml-2" : ""}`} />
          {isOpen && (
            <span className="ml-1 whitespace-nowrap text-sm">Logs</span>
          )}
        </a>

        {/* Control Panel link */}
        <a
          href="./control"
          className={`flex p-3 rounded-lg font-medium transition-colors
            ${
              pathname === "/controlPanel"
                ? "bg-[#DCE6DC] text-[#2F4635] dark:bg-gray-200 dark:text-gray-900"
                : "hover:bg-[#3C5A44] dark:hover:bg-gray-700"
            } 
            ${isOpen ? "my-3 mx-3 items-center gap-2" : "my-3 justify-center"}`}
        >
          <Settings size={15} className={`${isOpen ? "ml-2" : ""}`} />
          {isOpen && (
            <span className="ml-1 whitespace-nowrap text-sm">Control Panel</span>
          )}
        </a>
      </nav>
    </aside>
  );
}
