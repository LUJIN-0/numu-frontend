"use client";

import { useEffect, useState } from "react";
import { AirVent, Snowflake, Droplets, Power } from "lucide-react";

const iconFor = (kind) =>
  kind === "fan" ? (
    <AirVent size={18} className="text-gray-600" />
  ) : kind === "ac" ? (
    <Snowflake size={18} className="text-gray-600" />
  ) : (
    <Droplets size={18} className="text-gray-600" />
  );

export default function ActuatorCard({
  title,
  kind, // fan | ac | humidifier
  description,
  state, // "ON" | "OFF"
  lastChange, // ms
  minWindow, // seconds
  disabled,
  onToggle,
}) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => {
      const elapsed = Math.floor((Date.now() - lastChange) / 1000);
      setRemaining(Math.max(0, minWindow - elapsed));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastChange, minWindow]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {iconFor(kind)}
          <div>
            <div className="font-medium text-gray-800">{title}</div>
            <div className="text-xs text-gray-500">{description}</div>
          </div>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded ${
            state === "ON"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {state}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Min on/off window: {minWindow}s
          {remaining > 0 && (
            <span className="ml-2 text-gray-700">• lock {remaining}s</span>
          )}
        </div>
        <button
          onClick={onToggle}
          disabled={disabled || remaining > 0}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 enabled:hover:bg-gray-50 disabled:opacity-40"
          title={disabled ? "Switch to Manual mode to control" : "Toggle"}
        >
          <Power size={16} />
          Toggle
        </button>
      </div>
    </div>
  );
}
