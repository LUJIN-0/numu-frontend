'use client'

import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function Alerts() {
  const t = useTranslations('Dashboard');

  // Used when I dont want alerts
  const alerts = [];

  // Used when I want alerts
  /*
  const alerts = [
    { type: "Humidity", msg: "Low humidity detected: 55%", time: "Yesterday, 5:30 PM" },
    { type: "Device Deactivation", msg: "Cooling fan turned OFF", time: "Yesterday, 5:02 PM" },
    { type: "Temperature", msg: "Temperature returned to normal range 26.5°C", time: "Yesterday, 5:10 PM" },
    { type: "Device Activation", msg: "Cooling fan turned ON", time: "Yesterday, 4:55 PM" },
    { type: "Temperature", msg: "Exceeded threshold: 30.0°C", time: "Yesterday, 4:50 PM" },
  ];
  */

  return (
    <div>
      {/* Header with View All button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-light text-lg wrap-break-word transition-colors duration-300 text-(--muted-text)">
          {t('alerts')}
        </h2>
        <Link
          href="./alerts"
          className="text-sm font-small px-3 py-1 rounded border border-(--border-color)
          bg-(--header-input-bg) text-(--header-text) cursor-pointer hover:bg-(--header-hover) transition-colors duration-200"
        >
          {t('view-all')}
        </Link>
      </div>

      <ul className="space-y-3 text-sm">
        {alerts.length === 0 ? (
          // Empty state when there are no alerts
          <li className="flex items-center justify-center py-40">
            
            <p className="text-sm wrap-break-word transition-colors duration-300 text-(--muted-text)">
              {t('no-alerts')}
            </p>
          </li>
        ) : (
          // Normal state when there are alerts
          alerts.map((a, i) => (
            <li
              key={i}
              className="pb-2 border-b transition-colors duration-300 border-(--border-color)"
            >
              <p className="font-medium wrap-break-word transition-colors duration-300 text-(--card-text)">
                {a.type}
              </p>
              <p className="text-sm wrap-break-word transition-colors duration-300 text-(--muted-text)">
                {a.msg}
              </p>
              <p className="text-xs wrap-break-word transition-colors duration-300 text-(--faint-text)">
                {a.time}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
