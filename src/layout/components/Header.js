"use client";

import { Search, Sun, Menu } from "lucide-react"; 
import Image from "next/image"; 
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import ThemeSwitcher from "@/components/themeSwitcher"

export default function Header({ onToggleSidebar }) {
  // onToggleSidebar: passed from Layout.js to expand/collapse sidebar

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
      {/* Left side: Toggle + Logo + Search */}
      <div className="flex items-center gap-4 w-1/2">
        
        {/* Hamburger button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded text-gray-600"
        >
          <Menu size={22} />
        </button>

        {/*  Vertical divider */}
        <div className="w-px h-9 bg-gray-300"></div>

        {/* Logo */}
        <div className="flex items-center gap-2 pl-1">
          <Link href="/dashboard">
            <Image src="/logo.png" alt="NUMU Logo" width={75} height={28} className="cursor-pointer" />
          </Link>
        </div>

        {/* Search bar */}
        <div className="relative flex-1 max-w-md mx-5">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-3 py-1.5 bg-gray-100 focus:outline-none rounded-lg 
            placeholder-gray-300 text-gray-700 text-sm placeholder:text-sm placeholder:italic border-gray-300 border"
          />
        </div>
      </div>

      {/* Right side: Theme + Language + User */}
      <div className="flex items-center gap-4">
        
        <ThemeSwitcher />

        {/* Vertical divider */}
        <div className="w-px h-9 bg-gray-300"></div>

        {/* Language switcher */}
        <select className="bg-gray-100 px-3 py-2 rounded text-gray-700 text-sm">
          <option>English</option>
          <option>Arabic</option>
        </select>

        {/* Vertical divider */}
        <div className="w-px h-9 bg-gray-300"></div>

        {/* User name */}
        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setOpen(!open)}
            className="bg-gray-100 px-3 py-2 rounded text-gray-700 text-sm cursor-pointer hover:bg-gray-200 transition"
          >
            Sara Khalid
          </div>

          {/* Dropdown menu */}
          {open && (
            <div className="absolute right-0 w-25 bg-white border border-gray-200 rounded-md z-50">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
