'use client'

import { Search, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import ThemeSwitcher from "@/components/themeSwitcher";
import LanguageSwitcher from "@/components/languageSwitcher";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { getCurrentUser, signOut } from "aws-amplify/auth"; // ✅ updated import
import { useRouter } from "next/navigation";

export default function Header({ onToggleSidebar }) {
  // onToggleSidebar: passed from Layout.js to expand/collapse sidebar

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);       // ✅ store current user
  const router = useRouter();
  const t = useTranslations("Header");

  // Wait until mounted to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  // ✅ Fetch user info from Cognito
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser(); // ✅ updated method
        const email = currentUser.signInDetails?.loginId || currentUser.username || "";
        const name = email.includes("@") ? email.split("@")[0] : email; // ✅ email before '@'
        setUser({ name });
      } catch {
        setUser(null); // not logged in
      }
    };
    fetchUser();
  }, []);

  // ✅ Handle logout
  const handleLogout = async () => {
    try {
      await signOut(); // ✅ updated method
      localStorage.removeItem("access_token");
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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

  // Placeholders to keep layout stable before theme loads
  if (!mounted) {
    return (
      <header className="flex items-center justify-between px-6 py-3 bg-(--header-bg) shadow-sm border-b border-(--header-border) transition-colors duration-300">
        {/* Left side: Toggle + Logo + Search */}
        <div className="flex items-center gap-4 w-1/2">
          <div className="w-9 h-9"></div> {/* placeholder for menu */}
          <div className="flex items-center gap-2 pl-1 w-[75px] h-7"></div> {/* placeholder for logo */}
        </div>
      </header>
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const mainLogo = currentTheme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-(--header-bg) shadow-sm border-b border-(--header-border) transition-colors duration-300">
      {/* Left side: Toggle + Logo + Search */}
      <div className="flex items-center gap-4 w-1/2">

        {/* Hamburger button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded text-(--header-text) hover:bg-(--header-hover) transition-colors"
        >
          <Menu size={22} />
        </button>

        {/* Vertical divider */}
        <div className="w-px h-9 bg-(--header-border)"></div>

        {/* Logo */}
        <div className="flex items-center gap-2 pl-1">
          <Link href="/dashboard">
            <Image
              src={mainLogo}
              alt="NUMU Logo"
              width={75}
              height={28}
              className="cursor-pointer transition-opacity duration-300"
            />
          </Link>
        </div>

        {/* Search bar 
        <div className="relative flex-1 max-w-md mx-5">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={t("search")}
            className="w-full pl-10 pr-3 py-1.5 bg-(--header-input-bg) focus:outline-none rounded-lg 
            placeholder-gray-300 text-(--header-text) text-sm placeholder:text-sm placeholder:italic border-(--header-border) border"
          />
        </div>*/}
      </div>

      {/* Right side: Theme + Language + User */}
      <div className="flex items-center gap-4">
        {/* Theme switcher */}
        <ThemeSwitcher />

        {/* Vertical divider */}
        <div className="w-px h-9 bg-(--header-border)"></div>

        {/* Language switcher */}
        <LanguageSwitcher />

        {/* Vertical divider */}
        <div className="w-px h-9 bg-(--header-border)"></div>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setOpen(!open)}
            className="bg-(--header-input-bg) px-3 py-2 rounded text-(--header-text) text-sm cursor-pointer hover:bg-(--header-hover) transition inline-block min-w-fit"
          >
            {user ? user.name : "Guest"}
          </div>

          {/* Dropdown menu */}
          {open && (
            <div className="absolute right-0 min-w-max bg-(--header-bg) border border-(--border-color) rounded-md z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 rounded text-sm text-(--header-text) cursor-pointer hover:bg-(--header-hover)"
              >
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
