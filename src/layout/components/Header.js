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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

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

        {/* Search bar */}
        <div className="relative flex-1 max-w-md mx-5">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value.toLowerCase();
              setQuery(val);

              // small keyword-to-page mapping
              const pages = [
                { title: "Dashboard", path: "/dashboard", keywords: ["temp", "humidity", "aqi", "growth", "chart", "stats"] },
                { title: "Alerts", path: "/alerts", keywords: ["alert", "device", "time", "aqi", "threshold", "humidity", "temperature"] },
              ];

              const found = pages.filter(p =>
                p.keywords.some(k => k.toLowerCase().includes(val)) ||
                p.title.toLowerCase().includes(val)
              );
              setResults(val ? found : []);
            }}
            placeholder={t("search")}
            className="w-full pl-10 pr-3 py-1.5 bg-(--header-input-bg) focus:outline-none rounded-lg placeholder-gray-300 
    text-(--header-text) text-sm placeholder:text-sm placeholder:italic border-(--header-border) border"
          />

          {/* Results dropdown */}
          {results.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-(--card-bg) border border-(--border-color) rounded-md shadow-md z-50">
              {results.map((r, i) => (
                <Link
                  key={i}
                  href={r.path}
                  onClick={() => { setQuery(""); setResults([]); }}
                  className="block px-3 py-2 text-sm text-(--card-text) hover:bg-(--header-hover)"
                >
                  {r.title}
                </Link>
              ))}
            </div>
          )}
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
