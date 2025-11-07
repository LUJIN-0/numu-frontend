'use client'

import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function Alerts() {
  const alerts = [
    { type: "Device Activation", msg: "Humidifier activated", time: "Yesterday, 4:37 PM" },
    { type: "Humidity", msg: "Humidity level too low: 24%", time: "Yesterday, 4:30 PM" },
    { type: "Temperature", msg: "Too high: 39.2°C", time: "21 Apr, 1:05 PM" },
  ];

  const t = useTranslations('Dashboard');

  return (
    <div>
      {/* Header with View All button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-light text-lg wrap-break-word transition-colors duration-300 text-(--muted-text)">{t('alerts')}</h2>
        <Link
          href="./alerts"
          className="text-sm font-small px-3 py-1 rounded border border-(--border-color)
          bg-(--header-input-bg) text-(--header-text) cursor-pointer hover:bg-(--header-hover) transition-colors duration-200"
        > 
        {t('view-all')}
        </Link>
      </div>
      <ul className="space-y-3 text-sm">
        {alerts.map((a, i) => (
          <li key={i} className="pb-2 border-b transition-colors duration-300 border-(--border-color)">
            <p className="font-medium wrap-break-word transition-colors duration-300 text-(--card-text)">{a.type}</p>
            <p className="text-sm wrap-break-word transition-colors duration-300 text-(--muted-text)">{a.msg}</p>
            <p className="text-xs wrap-break-word transition-colors duration-300 text-(--faint-text)">
              {a.time}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
