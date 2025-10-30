'use client'

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Home, FileText, Settings, ChevronDown, LayoutDashboard, AlertOctagon } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function Sidebar({ isOpen }) {
  const [greenhouseOpen, setGreenhouseOpen] = useState(false);
  const pathname = usePathname();
  const  t  = useTranslations('SideBar');

  return (
    <aside
      // <aside> a semantic HTML for sidebars
      className={`${isOpen ? "w-70" : "w-20"} 
  bg-(--sidebar-bg) text-white p-4 flex flex-col 
  transition-[width,background-color] duration-300 overflow-hidden`}
    >
      {/* dropdown */}
      <div className={`${isOpen ? "mb-4 mr-6 mt-7" : "mb-4 mt-7"}`}>
        <button
          onClick={() => setGreenhouseOpen(!greenhouseOpen)} // toggle dropdown open/close
          className={`flex items-center w-full p-3 rounded-xl border border-(--border-color)
        ${isOpen ? "ml-3 justify-between gap-2" : "justify-center"}
        bg-white/5 hover:bg-(--sidebar-hover) transition-colors`}
        >
          <Home size={15} className={`${isOpen ? "ml-2" : ""}`} />

          {/* To show text only if sidebar is open */}
          {isOpen && (
            <span className="flex-1 text-left text-sm whitespace-nowrap overflow-hidden">
              {t('greenhouse')} 1
            </span>
          )}

          {/* Dropdown arrow, rotate it when opened */}
          {isOpen && (
            <ChevronDown
              size={16}
              className={`transition-transform ${greenhouseOpen ? "rotate-180" : ""
                }`}
            />
          )}
        </button>

        {/* Dropdown items (only visible if sidebar is open and dropdown is expanded) */}
        {isOpen && greenhouseOpen && (
          <div className="mt-2 ml-14 space-y-1 text-sm">
            <a
              href="#"
              className="block hover:underline text-gray-100"
            >
              Greenhouse 1
            </a>
            <a
              href="#"
              className="block hover:underline text-gray-100"
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
        ${pathname === "/dashboard"
              ? "bg-(--sidebar-active-bg) text-(--sidebar-active-text)"
              : "hover:bg-(--sidebar-hover)"
            } 
        ${isOpen ? "my-3 mx-3 items-center gap-2" : "my-3 justify-center"}`}
        >
          <LayoutDashboard size={15} className={`${isOpen ? "ml-2" : ""}`} />
          {isOpen && (
            <span className="ml-1 whitespace-nowrap text-sm">{t('dashboard')}</span>
          )}
        </a>

        {/* Logs link */}
        <a
          href="./logs"
          className={`flex p-3 rounded-lg font-medium transition-colors
        ${pathname === "/logs"
              ? "bg-(--sidebar-active-bg) text-(--sidebar-active-text)"
              : "hover:bg-(--sidebar-hover)"
            } 
        ${isOpen ? "my-3 mx-3 items-center gap-2" : "my-3 justify-center"}`}
        >
          <FileText size={15} className={`${isOpen ? "ml-2" : ""}`} />
          {isOpen && (
            <span className="ml-1 whitespace-nowrap text-sm">{t('logs')}</span>
          )}
        </a>

        {/* Control Panel link */}
        <a
          href="./control"
          className={`flex p-3 rounded-lg font-medium transition-colors
        ${pathname === "/controlPanel"
              ? "bg-(--sidebar-active-bg) text-(--sidebar-active-text)"
              : "hover:bg-(--sidebar-hover)"
            } 
        ${isOpen ? "my-3 mx-3 items-center gap-2" : "my-3 justify-center"}`}
        >
          <Settings size={15} className={`${isOpen ? "ml-2" : ""}`} />
          {isOpen && (
            <span className="ml-1 whitespace-nowrap text-sm">{t('control-panel')}</span>
          )}
        </a>

        {/* Alerts link */}
        <a
          href="./alerts"
          className={`flex p-3 rounded-lg font-medium transition-colors
        ${pathname === "/alerts"
              ? "bg-(--sidebar-active-bg) text-(--sidebar-active-text)"
              : "hover:bg-(--sidebar-hover)"
            } 
        ${isOpen ? "my-3 mx-3 items-center gap-2" : "my-3 justify-center"}`}
        >
          <AlertOctagon size={15} className={`${isOpen ? "ml-2" : ""}`} />
          {isOpen && (
            <span className="ml-1 whitespace-nowrap text-sm">{t('alerts')}</span>
          )}
        </a>
      </nav>
    </aside>

  );
}
