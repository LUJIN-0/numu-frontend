'use client'

import { useTranslations } from 'next-intl';

export default function Alerts() {
  const alerts = [
    { type: "Device Activation", msg: "Humidifier activated", time: "Yesterday, 4:37 PM" },
    { type: "Humidity", msg: "Humidity level too low: 24%", time: "Yesterday, 4:30 PM" },
    { type: "Temperature", msg: "Too high: 39.2°C", time: "21 Apr, 1:05 PM" },
  ];

  const  t  = useTranslations('Dashboard');

  return (
    <div>
      <h2 className="font-light text-lg mb-4 wrap-break-word transition-colors duration-300 text-(--muted-text)">{t('alerts')}</h2>
      <ul className="space-y-3 text-sm">
        {alerts.map((a, i) => (
          <li key={i} className="pb-2 border-b transition-colors duration-300 border-(--border-color)">
            <p className="font-medium wrap-break-word transition-colors duration-300 text-(--card-text)">{a.type}</p>
            <p className="text-sm wrap-break-word transition-colors duration-300 text-(--muted-text)">{a.msg}</p>
            <p className="text-xs wrap-break-word transition-colors duration-300 text-(--faint-text)">{a.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
