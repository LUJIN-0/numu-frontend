'use client'

import { useTranslations } from 'next-intl';

export default function GrowthTimeline() {
  const stages = [
    { stage: "Germination", status: "Completed 10 days ago", range: "0–7 days" },
    { stage: "Seedling", status: "Current", range: "8–14 days" },
    { stage: "Vegetative", status: "Starts in 5 days", range: "15–35 days" },
  ];

  const  t  = useTranslations('Dashboard');

  return (
    <div>
      <h2 className="font-light text-lg mb-4 wrap-break-word transition-colors duration-300 text-(--muted-text)">
        {t('growth')}
      </h2>

      <p className="text-sm mb-2 wrap-break-word transition-colors duration-300 text-(--faint-text)">
        Current day: 30 | Sown: 01/03/2025
      </p>

      <ul className="space-y-2 text-sm">
        {stages.map((s, i) => (
          <li
            key={i}
            className="pb-2 border-b transition-colors duration-300 border-(--border-color)"
          >
            <p className="font-medium wrap-break-word transition-colors duration-300 text-(--card-text)">
              {s.stage}
            </p>
            <p className="wrap-break-word transition-colors duration-300 text-(--muted-text)">
              {s.status}
            </p>
            <p className="text-xs wrap-break-word transition-colors duration-300 text-(--faint-text)">
              {s.range}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
