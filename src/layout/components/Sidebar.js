'use client'

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Home, ChevronDown, LayoutDashboard, AlertOctagon } from "lucide-react";
import { useLocale, useTranslations } from 'next-intl';
import { useGreenhouse } from "@/context/GreenhouseContext";

export default function Sidebar({ isOpen }) {
  const [greenhouseOpen, setGreenhouseOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('SideBar');
  const locale = useLocale();

  const {
    greenhouses,
    selectedGreenhouseId,
    setSelectedGreenhouseId,
    loading,
    error,
  } = useGreenhouse();

  const selectedGreenhouse = greenhouses.find(g => g.id === selectedGreenhouseId) || null;
  const hasGreenhouses = greenhouses.length > 0;

  const handleSelectGreenhouse = (id) => {
    setSelectedGreenhouseId(id);
    setGreenhouseOpen(false);
  };

  const handleAddGreenhouse = () => {
    setGreenhouseOpen(false);
    setShowAddModal(true);
  };

  const closeModal = () => setShowAddModal(false);

  return (
    <>
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
                {loading && t('loading-greenhouses')}
                {!loading && error && t('greenhouse-error')}
                {!loading && !error && hasGreenhouses && (
                  selectedGreenhouse?.name || `${t('greenhouse')} 1`
                )}
                {!loading && !error && !hasGreenhouses && t('no-greenhouse')}
              </span>
            )}

            {/* Dropdown arrow, rotate when opened */}
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
              {hasGreenhouses && greenhouses.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSelectGreenhouse(g.id)}
                  className={`block w-full text-left hover:underline text-gray-100 cursor-pointer ${g.id === selectedGreenhouseId ? "font-semibold" : ""
                    }`}
                >
                  {g.name}
                </button>
              ))}

              {/* Add greenhouse Button 
              <button
                type="button"
                onClick={handleAddGreenhouse}
                className="block w-full text-left text-gray-100 hover:underline mt-2 cursor-pointer"
              >
                + {t('add-greenhouse')}
              </button>*/}
            </div>
          )}
        </div>

        {/* Navigation links */}
        <nav className="space-y-2">
          {/* Dashboard link */}
          <a
            href="./dashboard"
            className={`flex p-3 rounded-lg font-medium transition-colors
        ${pathname === `/${locale}/dashboard`
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

          {/* Alerts link */}
          <a
            href="./alerts"
            className={`flex p-3 rounded-lg font-medium transition-colors
        ${pathname === `/${locale}/alerts`
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

      {/*
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-(--card-bg) text-(--card-text) border border-(--border-color) rounded-lg p-6 max-w-sm w-[90%] shadow-lg">
            <h2 className="text-lg font-semibold mb-2">
              {t('add-greenhouse')}
            </h2>
            <p className="text-sm text-(--muted-text) mb-4">
              {t('unavailable')}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-1.5 rounded-md text-sm bg-(--sidebar-bg) text-white hover:opacity-90 transition cursor-pointer"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}*/}
    </>
  );
}
