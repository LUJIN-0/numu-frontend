'use client'

import { Search, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import ThemeSwitcher from "@/components/themeSwitcher";
import LanguageSwitcher from "@/components/languageSwitcher";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { signOut } from "aws-amplify/auth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header({ onToggleSidebar }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const t = useTranslations("Header");

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("access_token");
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const mainLogo = currentTheme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-(--header-bg) shadow-sm border-b border-(--header-border)">
      <div className="flex items-center gap-4 w-1/2">
        <button onClick={onToggleSidebar} className="p-2 rounded text-(--header-text) hover:bg-(--header-hover)">
          <Menu size={22} />
        </button>
        <div className="w-px h-9 bg-(--header-border)" />
        <div className="flex items-center gap-2 pl-1">
          <Link href="/dashboard">
            <Image src={mainLogo} alt="NUMU Logo" width={75} height={28} className="cursor-pointer" />
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <div className="w-px h-9 bg-(--header-border)" />
        <LanguageSwitcher />
        <div className="w-px h-9 bg-(--header-border)" />

        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setOpen(!open)}
            className="bg-(--header-input-bg) px-3 py-2 rounded text-(--header-text) text-sm cursor-pointer hover:bg-(--header-hover) transition inline-block min-w-fit"
          >
            {user ? user.name : "Guest"}
          </div>

          {open && (
            <div className="absolute right-0 min-w-max bg-(--header-bg) border border-(--border-color) rounded-md z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 rounded text-sm text-(--header-text) hover:bg-(--header-hover) cursor-pointer"
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
