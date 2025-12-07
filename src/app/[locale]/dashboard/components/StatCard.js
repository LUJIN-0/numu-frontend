'use client'

import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export default function StatCard({ title, value, max, icon = null, infoText = "" }) {
  // parse numeric value (supports strings like "23 °C")
  const numericValue = typeof value === "number" ? value : parseFloat(value || "0");
  const unit =
    typeof value === "number" ? "" : (value || "").replace(String(numericValue), "").trim();

  const clamped = Math.max(0, Math.min(numericValue || 0, max));

  // Local state for chart colors
  const [colors, setColors] = useState({
    fill: "#2F4635", // fallback
    empty: "#EAF4EE", // fallback
  });

  // RTL detection to place badge correctly
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const getColors = () => {
      if (typeof window === "undefined") return;
      const root = getComputedStyle(document.documentElement);
      const fill = root.getPropertyValue("--chart-fill")?.trim() || "#2F4635";
      const empty = root.getPropertyValue("--chart-empty")?.trim() || "#EAF4EE";
      setColors({ fill, empty });
    };

    getColors();

    // Observe theme changes (class on <html> usually toggles)
    const observer = new MutationObserver(getColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // detect dir for RTL support
    if (typeof document !== "undefined") {
      const dir = document.documentElement.getAttribute("dir") || document.body.getAttribute("dir") || "ltr";
      setIsRTL(dir.toLowerCase() === "rtl");
    }

    return () => observer.disconnect();
  }, []);

  const data = {
    datasets: [
      {
        data: [clamped, Math.max(0, max - clamped)],
        backgroundColor: [colors.fill, colors.empty],
        borderWidth: 0,
        cutout: "78%",
      },
    ],
  };

  const options = {
    rotation: -135,
    circumference: 270,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  // Tooltip state for the info badge
  const [showTooltip, setShowTooltip] = useState(false);

  // Friendly display for numeric value - if value wasn't numeric show "—"
  const displayValue = Number.isFinite(numericValue) ? numericValue : null;

  return (
    <div
      className="relative w-full min-w-0 rounded-lg border p-4 sm:p-6 flex flex-col items-center justify-center transition-all duration-300
       border-(--border-color) bg-(--card-bg) text-(--card-text) overflow-hidden"
      // card root (positioned) so the tooltip badge can be absolutely placed relative to this.
    >
      {/* Info badge (exclamation) */}
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={showTooltip}
        className="absolute top-2"
        style={{
          // place on the right in LTR, left in RTL
          right: isRTL ? "auto" : "0.5rem",
          left: isRTL ? "0.5rem" : "auto",
        }}
      >

        
      </div>

      <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40">
        <div className="absolute inset-0">
          <Doughnut data={data} options={options} />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div
            className="rounded-full p-2 sm:p-3 mb-1 flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: colors.empty }}
          >
            {icon}
          </div>

          <div
            className="text-lg sm:text-xl md:text-2xl font-bold text-center transition-colors duration-300 text-(--card-text) min-w-0"
          >
            {displayValue !== null ? displayValue : "—"}
            {unit && (
              <span className="text-xs sm:text-sm font-normal ml-1 transition-colors duration-300 text-(--muted-text)">
                {unit}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm sm:text-base text-center transition-colors duration-300 text-(--muted-text) truncate w-full">
        {title}
      </p>
    </div>
  );
}
