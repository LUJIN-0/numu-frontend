'use client'

import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export default function StatCard({ title, value, max, icon = null }) {
  const numericValue = typeof value === "number" ? value : parseFloat(value || "0");
  const unit =
    typeof value === "number" ? "" : (value || "").replace(String(numericValue), "").trim();

  const clamped = Math.max(0, Math.min(numericValue || 0, max));

  // Local state for chart colors
  const [colors, setColors] = useState({
    fill: "#2F4635", // fallback
    empty: "#EAF4EE", // fallback
  });

  useEffect(() => {
    const getColors = () => {
      if (typeof window === "undefined") return;
      const root = getComputedStyle(document.documentElement);
      const fill = root.getPropertyValue("--chart-fill")?.trim() || "#2F4635";
      const empty = root.getPropertyValue("--chart-empty")?.trim() || "#EAF4EE";
      setColors({ fill, empty });
    };

    getColors();

    // Check theme changes
    const observer = new MutationObserver(getColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

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

  return (
    <div
      className="col-span-3 rounded-lg border p-4 sm:p-6 flex flex-col items-center justify-center transition-all duration-300
       border-(--border-color) bg-(--card-bg) text-(--card-text)"
    >
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
            className="text-lg sm:text-xl md:text-2xl font-bold text-center transition-colors duration-300 text-(--card-text)"
          >
            {Number.isFinite(numericValue) ? numericValue : "—"}
            {unit && (
              <span className="text-xs sm:text-sm font-normal ml-1 transition-colors duration-300 text-(--muted-text)">
                {unit}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm sm:text-base text-center transition-colors duration-300 text-(--muted-text)">
        {title}
      </p>
    </div>
  );
}
