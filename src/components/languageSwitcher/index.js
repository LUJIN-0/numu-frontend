'use client'

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState(routing.defaultLocale);

  // Detect current language from URL
  useEffect(() => {
    const match = pathname.match(/^\/(en|ar)/);
    if (match) setCurrentLang(match[1]);
  }, [pathname]);

  const changeLanguage = (e) => {
    const lang = e.target.value;
    setCurrentLang(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const newPath = pathname.replace(/^\/(en|ar)/, `/${lang}`);
    router.push(newPath);
  };

  return (
    <select
      value={currentLang}
      onChange={changeLanguage}
      className="bg-(--header-input-bg) px-3 py-2 rounded text-(--header-text) text-sm focus:outline-none"
    >
      {routing.locales.map((lng) => (
        <option key={lng} value={lng}>
          {lng === 'en' ? 'English' : 'العربية'}
        </option>
      ))}
    </select>
  );
}
