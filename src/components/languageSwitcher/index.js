'use client'

import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { routing } from '@/i18n/routing'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentLang, setCurrentLang] = useState(routing.defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const match = pathname.match(/^\/(en|ar)/)
    if (match) setCurrentLang(match[1])
    setMounted(true)
  }, [pathname])

  if (!mounted) return null

  const changeLanguage = (lang) => {
    setCurrentLang(lang)
    //document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    const newPath = pathname.replace(/^\/(en|ar)/, `/${lang}`)
    router.push(newPath)
  }

  const languages = [
    { code: 'en', label: 'EN', flag: '/flags/en.png' },
    { code: 'ar', label: 'AR', flag: '/flags/sa.png' },
  ]

  return (
<div className="flex flex-col items-center">
  <div className="flex items-center gap-1">
    {languages.map(({ code, label, flag }) => (
      <button
        key={code}
        onClick={() => changeLanguage(code)}
        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer
          hover:bg-(--theme-switch-hover)
          ${currentLang === code ? 'bg-(--sidebar-active-bg) text-(--sidebar-active-text)' : 'text-(--header-text)'}
        `}
        aria-label={`Switch to ${label}`}
      >
        <Image
          src={flag}
          alt={`${label} flag`}
          width={20}
          height={14}
          className="rounded-sm"
        />
        <span className="text-xs font-medium">{label}</span>
      </button>
    ))}
  </div>

  {/* Attribution (site requests it) */}
  <p className="text-[7px] text-gray-400 mt-1">
    Designed by{" "}
    <a
      href="https://www.freepik.com"
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-gray-500"
    >
      Freepik
    </a>
  </p>
</div>

  )
}
