'use client'

import { useTranslations } from 'next-intl';

export default function CropInfo() {

  const  t  = useTranslations('Dashboard');
  
  const data = [
    { param: t('temp-day'), range: "21–27°C" },
    { param: t('temp-night'), range: "17–20°C" },
    { param: t('humedity'), range: "60–70%" },
    { param: t('aqi'), range: "0–50" },
  ];

  return (
    <div>
      <h2 className="font-light text-md mb-2 truncate transition-colors duration-300 text-(--muted-text)">{t('crop-info')}</h2>

      {/* Title */}
      <p className="text-sm mb-4 wrap-break-word max-w-full transition-colors duration-300 text-(--card-text)">
        <span className="font-semibold transition-colors duration-300 text-(--card-text)">{t('name')}:</span>{" "}
        <span className="font-medium wrap-break-word transition-colors duration-300 text-(--card-text)">Tomatoes</span>
      </p>

      {/* table box */}
      <div
        className="max-w-[280px] mx-auto rounded-sm overflow-hidden border transition-colors duration-300 border-(--border-color) bg-(--card-bg)"
      >
        <table className="w-full text-sm text-center font-light table-fixed">
          {/* header */}
          <thead
            className="transition-colors duration-300 bg-(--table-header-bg)"
          >
            <tr>
              <th
                className="py-3 px-4 font-semibold border-r wrap-break-word transition-colors duration-300 var(--muted-text) border-(--border-color)"
              >
                {t('parameter')}
              </th>
              <th
                className="py-3 px-4 font-semibold wrap-break-word transition-colors duration-300 text-var(--muted-text)"
              >
                {t('ideal-range')}
              </th>
            </tr>
          </thead>

          {/* body */}
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className="transition-colors duration-300"
                style={{
                  borderTop: "1px solid var(--border-color)",
                }}
              >
                <td
                  className="py-3 px-4 border-r wrap-break-word transition-colors duration-300 text-(--card-text) border-(--border-color)"
                >
                  {row.param}
                </td>
                <td
                  className="py-3 px-4 wrap-break-word transition-colors duration-300 text-(--card-text)"
                >
                  {row.range}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
