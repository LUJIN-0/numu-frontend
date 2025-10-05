// I mostly didn't work on this one 
"use client";
import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ReferenceLine,
  ReferenceDot,
} from "recharts";

/* Hardcoded dummy data */
const sampleData = [
  { day: "1 Mar", temp: 8, humidity: 55, aqi: 25 },
  { day: "5 Mar", temp: 12, humidity: 60, aqi: 28 },
  { day: "10 Mar", temp: 25, humidity: 65, aqi: 30 },
  { day: "15 Mar", temp: 33, humidity: 58, aqi: 35 },
  { day: "20 Mar", temp: 9, humidity: 50, aqi: 20 },
  { day: "25 Mar", temp: 15, humidity: 56, aqi: 24 },
  { day: "30 Mar", temp: 30, humidity: 62, aqi: 32 },
];

/* Small custom tooltip */
function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;
  return (
    <div className="bg-white rounded-lg p-3 shadow-md text-center min-w-[90px]">
      <div className="text-xs text-gray-500 mb-1">{label} 21:00</div>
      <div className="text-2xl font-semibold text-gray-800">
        {value}
        <span className="text-sm font-normal ml-1">{unit}</span>
      </div>
    </div>
  );
}

export default function Chart() {
  const [metric, setMetric] = useState("temp"); 
  const [interval, setInterval] = useState("Daily");
  const [month, setMonth] = useState("March");

  const metricConfig = useMemo(() => {
    if (metric === "temp") return { unit: "°C", color: "#b7791f", gradient: "#facc15" };
    if (metric === "humidity") return { unit: "% r.H", color: "#2f6b57", gradient: "#8bd19a" };
    return { unit: "", color: "#6b7280", gradient: "#c7c7c7" }; // AQI default
  }, [metric]);

  const data = useMemo(() => sampleData, []);

  const defaultSelectedIndex = 3;
  const selected = data[defaultSelectedIndex] || data[data.length - 1];
  const selectedX = selected?.day;
  const selectedY = selected?.[metric];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* header + controls */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-gray-700 text-lg font-light mb-2">Historical Data</h3>

          {/* small radio group */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="metric"
                checked={metric === "temp"}
                onChange={() => setMetric("temp")}
                className="form-radio text-amber-400"
              />
              <span>Temperature</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="metric"
                checked={metric === "humidity"}
                onChange={() => setMetric("humidity")}
                className="form-radio text-amber-400"
              />
              <span>Humidity</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="metric"
                checked={metric === "aqi"}
                onChange={() => setMetric("aqi")}
                className="form-radio text-amber-400"
              />
              <span>AQI</span>
            </label>
          </div>
        </div>

        {/* right controls */}
        <div className="flex items-center space-x-3">
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="bg-white border border-gray-200 rounded-md px-3 py-1 text-sm shadow-sm text-gray-500"
          >
            <option>Daily</option>
            <option>Hourly</option>
            <option>Weekly</option>
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-white border border-gray-200 rounded-md px-3 py-1 text-sm shadow-sm text-gray-500"
          >
            <option>March</option>
            <option>February</option>
            <option>January</option>
          </select>
        </div>
      </div>

      {/* chart area */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 24, left: 16, bottom: 6 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={metricConfig.gradient} stopOpacity={0.35} />
                <stop offset="60%" stopColor={metricConfig.gradient} stopOpacity={0.12} />
                <stop offset="100%" stopColor={metricConfig.gradient} stopOpacity={0.04} />
              </linearGradient>
            </defs>

            {/* only horizontal grid lines */}
            <CartesianGrid vertical={false} stroke="#eef2f4" strokeDasharray="3 3" />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />

            <Area
              type="monotone"
              dataKey={metric}
              stroke="transparent"
              fill="url(#areaGrad)"
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey={metric}
              stroke={metricConfig.color}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />

            {selectedX && (
              <ReferenceLine
                x={selectedX}
                stroke="#e5e7eb"
                strokeWidth={1}
                strokeOpacity={0.8}
              />
            )}

            {selectedX && selectedY != null && (
              <ReferenceDot
                x={selectedX}
                y={selectedY}
                r={6}
                fill="#ffffff"
                stroke={metricConfig.color}
                strokeWidth={3}
                isFront={true}
              />
            )}

            {/* tooltip (appears on hover) */}
            <Tooltip
              content={<CustomTooltip unit={metricConfig.unit} />}
              wrapperStyle={{ outline: "none" }}
              cursor={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
