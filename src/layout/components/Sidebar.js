"use client";

import { useState } from "react";

import { Home, Activity, FileText, Settings, ChevronDown, Flower2, LayoutDashboard } from "lucide-react";

export default function Sidebar({ isOpen }) {

  const [greenhouseOpen, setGreenhouseOpen] = useState(false);

  return (
    <aside
      // <aside> a semantic HTML for sidebars
      className={`${isOpen ? "w-70" : "w-20" // when open: width (70), collapsed: width (20)
        } bg-[#2F4635] text-white p-4 flex flex-col 
      transition-[width] duration-300 overflow-hidden`}
    >
      {/* dropdown */}
      <div className={`${isOpen ? "mb-4 mr-6 mt-7" : "mb-4 mt-7"}`}>
        <button
          onClick={() => setGreenhouseOpen(!greenhouseOpen)} // toggle dropdown open/close
          className={`flex items-center w-full p-3 rounded-xl border-1 border-gray-200 
            ${isOpen ? "ml-3 justify-between gap-2" : "justify-center"}`}
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
              className={`transition-transform ${greenhouseOpen ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {/* Dropdown items (only visible if sidebar is open and dropdown is expanded) */}
        {isOpen && greenhouseOpen && (
          <div className="mt-2 ml-14 space-y-1 text-sm">
            <a href="#" className="block hover:underline">Greenhouse 1</a>
            <a href="#" className="block hover:underline">Greenhouse 2</a>
          </div>
        )}
      </div>

      {/* Navigation links */}
      <nav className="space-y-2">
        {/* Dashboard link */}
        <a
          href="#"
          className={`flex p-3 rounded-lg font-medium 
            ${isOpen ? "my-3 mx-3 bg-[#DCE6DC] text-[#2F4635] items-center gap-2" 
                      : "my-3 justify-center bg-[#DCE6DC] text-[#2F4635]"}`}
        >
          <LayoutDashboard size={15} className={`${isOpen ? "ml-2" : ""}`} />
          {isOpen && <span className="ml-1 whitespace-nowrap text-sm">Dashboard</span>}
        </a>

        {/* Logs link */}
        <a
          href="#"
          className={`flex p-3 rounded-lg hover:bg-[#3C5A44]
            ${isOpen ? "my-3 mx-3 items-center gap-2" : "my-3 justify-center"}`}
        >
          <FileText size={15} className={`${isOpen ? "ml-2" : ""}`} />
          {isOpen && <span className="ml-1 whitespace-nowrap text-sm">Logs</span>}
        </a>

        {/* Disease Detection link - Check if we'll remove it or not*/}
        <a
          href="#"
          className={`flex p-3 rounded-lg hover:bg-[#3C5A44] 
            ${isOpen ? "my-3 mx-3 items-center gap-2" : "my-3 justify-center"}`}
        >
          <Activity size={15} className={`${isOpen ? "ml-2" : ""}`} />
          {isOpen && <span className="ml-1 whitespace-nowrap text-sm">Disease Detection</span>}
        </a>

        {/* Control Panel link */}
        <a
          href="#"
          className={`flex p-3 rounded-lg hover:bg-[#3C5A44] 
            ${isOpen ? "my-3 mx-3 items-center gap-2" : "my-3 justify-center"}`}
        >
          <Settings size={15} className={`${isOpen ? "ml-2" : ""}`} />
          {isOpen && <span className="ml-1 whitespace-nowrap text-sm">Control Panel</span>}
        </a>
      </nav>
    </aside>
  );
}
