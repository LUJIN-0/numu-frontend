'use client'

import { useTranslations } from 'next-intl';

export default function LocationMap() {

  const  t  = useTranslations('Dashboard');

  return (
    <div>
      <h2 className="font-light text-lg mb-4 text-(--muted-text) wrap-break-word">{t('location')}</h2>
      <iframe
        src="https://maps.google.com/maps?q=King%20Abdulaziz%20University&t=&z=15&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="200"
        className="rounded"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </div>
  );
}
