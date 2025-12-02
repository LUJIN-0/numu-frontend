'use client'

import { useTranslations } from 'next-intl';

export default function CropInfo({ crop }) {
  const t = useTranslations('Dashboard');

  const cropName = crop?.cropType?.name || "—";

  const stagesSorted = Array.isArray(crop?.stages)
    ? [...crop.stages].sort((a, b) => (a.stageOrder ?? 0) - (b.stageOrder ?? 0))
    : [];

  const data = stagesSorted.map((stage) => {
    const low = stage.tempLowerOptimal;
    const high = stage.tempUpperOptimal;
    let range = "—";
    if (low != null && high != null) {
      range = `${low}–${high}°C`;
    } else if (low != null) {
      range = `≥ ${low}°C`;
    } else if (high != null) {
      range = `≤ ${high}°C`;
    }
    const STAGE_TRANSLATIONS = {
      "Early Growth": "stage-early-growth",
      "Vegetative": "stage-vegetative",
      "Flowering": "stage-flowering",
      "Fruit Formation": "stage-fruit-formation",
      "Mature Fruiting": "stage-mature-fruiting",
    };

    return {
      param: STAGE_TRANSLATIONS[stage.name]
        ? t(STAGE_TRANSLATIONS[stage.name])
        : stage.name,
      range,
    };
  });

  const hasData = data.length > 0;

  return (
    <div>
      <h2 className="font-light text-md mb-2 truncate transition-colors duration-300 text-(--muted-text)">
        {t('crop-info')}
      </h2>

      <p className="text-sm mt-5 mb-6 wrap-break-word max-w-full transition-colors duration-300 text-(--card-text)">
        <span className="font-semibold transition-colors duration-300 text-(--card-text)">
          {t('name')}:
        </span>{" "}
        <span className="font-medium wrap-break-word transition-colors duration-300 text-(--card-text)">
          {cropName}
        </span>
      </p>

      <div
        className="max-w-[280px] mx-auto rounded-sm overflow-hidden border transition-colors duration-300 border-(--border-color) bg-(--card-bg)"
      >
        {!hasData ? (
          <div className="py-6 text-center text-sm transition-colors duration-300 text-(--muted-text)">
            {t('no-stages')}
          </div>
        ) : (
          <table className="w-full text-sm text-center font-light table-fixed">
            <thead
              className="transition-colors duration-300 bg-(--table-header-bg)"
            >
              <tr>
                <th
                  className="py-3 px-4 font-semibold border-r wrap-break-word transition-colors duration-300 var(--muted-text) border-(--border-color)"
                >
                  {t('crop-stage')}
                </th>
                <th
                  className="py-3 px-4 font-semibold wrap-break-word transition-colors duration-300 text-var(--muted-text)"
                >
                  {t('ideal-range')}
                </th>
              </tr>
            </thead>

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
        )}
      </div>
    </div>
  );
}
