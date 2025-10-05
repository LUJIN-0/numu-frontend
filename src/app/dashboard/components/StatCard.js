"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export default function StatCard({ title, value, max, icon = null }) {

  // extract numeric part (e.g., 18 from "18°C")
  const numericValue = typeof value === "number" ? value : parseFloat(value || "0");
  
  // extract unit text from string (e.g., "°C" or "% r.H")
  const unit =
    typeof value === "number" ? "" : (value || "").replace(String(numericValue), "").trim();

  // clamp percent to [0, max]
  const clamped = Math.max(0, Math.min(numericValue || 0, max));

  // chart data: filled portion then remaining
  const data = {
    datasets: [
      {
        data: [clamped, Math.max(0, max - clamped)],
        // active vs inactive
        backgroundColor: ["#2F4635", "#EAF4EE"],
        borderWidth: 0,
        // cutout
        cutout: "78%",
      },
    ],
  };

  const options = {
    rotation: -135, // start angle
    circumference: 270, // how much of the circle to draw
    plugins: {
      tooltip: { enabled: false }, // hide tooltips
      legend: { display: false },
    },
    maintainAspectRatio: false, // let the container control sizing
  };

  return (
    <div className="col-span-4 bg-white rounded-lg border-1 border-gray-300 p-6 flex flex-col items-center justify-center">
      {/* Chart container */}
      <div className="relative w-40 h-40">
        
        {/* Doughnut chart */}
        <div className="absolute inset-0">
          <Doughnut data={data} options={options} />
        </div>

        {/* small icon badge + numeric value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

          {/* small pale circular badge for icon */}
          <div className="bg-[#ECF7EE] rounded-full p-2 mb-1 flex items-center justify-center">

            {/* render icon */}
            {icon}
          </div>

          {/* numeric value */}
          <div className="text-2xl font-bold text-gray-800">
            {Number.isFinite(numericValue) ? numericValue : "—"}
            {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
          </div>
        </div>
      </div>

      {/* Label below */}
      <p className="text-gray-500 mt-3">{title}</p>
    </div>
  );
}
