"use client";

import { Thermometer, Droplet, Pencil } from "lucide-react";

export default function ThresholdBanner({ thresholds, stage, onEdit }) {
  const T = thresholds.temp;
  const H = thresholds.rh;

  const Block = ({ icon, title, range }) => (
    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
      {icon}
      <div className="text-sm">
        <div className="text-gray-500">{title}</div>
        <div className="font-medium text-gray-800">{range}</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-gray-700">
        <span className="font-semibold">{stage.crop}</span> —{" "}
        <span className="font-medium">{stage.stage}</span> thresholds in effect
      </div>
      <div className="flex items-center gap-3">
        <Block
          icon={<Thermometer size={16} className="text-gray-600" />}
          title="Temp (optimal)"
          range={`${T.optimal[0]}–${T.optimal[1]} °C`}
        />
        <Block
          icon={<Droplet size={16} className="text-gray-600" />}
          title="RH (optimal)"
          range={`${H.optimal[0]}–${H.optimal[1]} %`}
        />
      </div>
      <button
        onClick={onEdit}
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
      >
        <Pencil size={16} /> Edit thresholds
      </button>
    </div>
  );
}
