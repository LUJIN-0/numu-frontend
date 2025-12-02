'use client'

import { useTranslations } from 'next-intl';
import { Check } from "lucide-react";

function getCurrentDay(sowDateStr) {
  if (!sowDateStr) return null;
  const sow = new Date(sowDateStr);
  if (isNaN(sow.getTime())) return null;

  const today = new Date();
  const sowMid = new Date(sow.getFullYear(), sow.getMonth(), sow.getDate());
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.floor((todayMid.getTime() - sowMid.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

export default function GrowthTimeline({ crop }) {
  const t = useTranslations('Dashboard');

  const sowDateStr = crop?.sowDate || null;
  const currentDay = sowDateStr ? getCurrentDay(sowDateStr) : null;

  const sowDisplay = sowDateStr
    ? new Date(sowDateStr).toLocaleDateString('en-GB')
    : "—";

  const stagesSorted = Array.isArray(crop?.stages)
    ? [...crop.stages].sort((a, b) => (a.stageOrder ?? 0) - (b.stageOrder ?? 0))
    : [];

  const STAGE_TRANSLATIONS = {
    "Early Growth": "stage-early-growth",
    "Vegetative": "stage-vegetative",
    "Flowering": "stage-flowering",
    "Fruit Formation": "stage-fruit-formation",
    "Mature Fruiting": "stage-mature-fruiting",
  };

  // Status translation map
  const STATUS_TRANSLATIONS = {
    Completed: 'status-completed',
    'In Progress': 'status-in-progress',
    Upcoming: 'status-upcoming',
  };

  let accumulated = 0;
  const stages = stagesSorted.map((stage) => {
    const startDay = accumulated + 1;
    const endDay = accumulated + (stage.durationDays || 0);
    accumulated = endDay;

    let status = "Upcoming";
    if (currentDay != null) {
      if (currentDay > endDay) status = "Completed";
      else if (currentDay >= startDay && currentDay <= endDay) status = "In Progress";
    }

    // Translate status for display
    const statusLabel = STATUS_TRANSLATIONS[status]
      ? t(STATUS_TRANSLATIONS[status])
      : status;

    const duration = endDay - startDay + 1;
    let percent = null;

    if (currentDay != null && duration > 0) {
      if (status === "Completed") {
        percent = 100;
      } else if (status === "Upcoming") {
        percent = 0;
      } else if (status === "In Progress") {
        const progressed = currentDay - startDay + 1;
        const raw = (progressed / duration) * 100;
        percent = Math.max(0, Math.min(100, Math.floor(raw)));
      }
    }

    return {
      stage: STAGE_TRANSLATIONS[stage.name]
        ? t(STAGE_TRANSLATIONS[stage.name])
        : stage.name,
      status,      
      statusLabel, 
      range: `${startDay} – ${endDay} ${t('days-short')}`,
      percent
    };
  });

  const hasStages = stages.length > 0;

  return (
    <div>
      <h2 className="font-light text-lg mb-4 wrap-break-word transition-colors duration-300 text-(--muted-text)">
        {t('growth')}
      </h2>

      <p className="text-sm mb-4 wrap-break-word transition-colors duration-300 text-(--faint-text)">
        {currentDay != null
          ? `${t('current-day')}: ${currentDay} | ${t('sown')}: ${sowDisplay}`
          : `${t('sown')}: ${sowDisplay}`}
      </p>

      {!hasStages ? (
        <p className="text-sm wrap-break-word transition-colors duration-300 text-(--muted-text)">
          {t('no-stages')}
        </p>
      ) : (
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute top-0 left-3 w-0.5 h-full bg-(--border-color) opacity-60"></div>

          <ul className="space-y-6 text-sm">
            {stages.map((s, i) => {
              const isCompleted = s.status === "Completed";
              const isCurrent = s.status === "In Progress";
              const isUpcoming = s.status === "Upcoming";

              const p = typeof s.percent === "number"
                ? Math.max(0, Math.min(100, s.percent))
                : null;

              let circleClasses =
                "w-6 h-6 rounded-full flex items-center justify-center " +
                "transition-all duration-200 hover:scale-[1.05]";

              let circleStyle = {};

              if (isCompleted) {
                circleClasses += " bg-(--gt-completed-bg) text-(--gt-completed-icon)";
              } else if (isCurrent && p != null) {
                circleClasses += " border";
                circleStyle = {
                  backgroundImage: `conic-gradient(var(--gt-progress-ring) ${p}%, var(--card-bg) ${p}% 100%)`,
                  borderColor: "var(--gt-progress-ring)",
                };
              } else if (isUpcoming) {
                circleClasses += " bg-(--card-bg) border";
                circleStyle = {
                  borderColor: "var(--gt-upcoming-border)",
                };
              }

              return (
                <li key={i} className="relative flex items-start gap-4">
                  {/* Circle marker */}
                  <div className="relative flex items-center justify-center mt-0.5">
                    <div className={circleClasses} style={circleStyle}>
                      {isCompleted ? (
                        <Check size={14} />
                      ) : isCurrent ? (
                        <div className="w-3 h-3 rounded-full bg-(--card-bg)"></div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-(--gt-upcoming-dot)"></div>
                      )}
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <p className="font-medium transition-colors duration-300 text-(--card-text)">
                      {s.stage}
                    </p>
                    <p
                      className={`transition-colors duration-300 text-sm ${isCompleted
                        ? "text-(--muted-text)"
                        : isCurrent
                          ? "text-(--gt-progress-ring)"
                          : "text-(--muted-text)"
                        }`}
                    >
                      {s.statusLabel}
                      {typeof s.percent === "number" && ` | ${s.percent}%`}
                    </p>
                    <p className="text-xs transition-colors duration-300 text-(--faint-text)">
                      {s.range}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
