"use client";

import { Download } from "lucide-react";

export default function LogsHeader({ title = "Sensor Logs", onExport }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <button
        onClick={onExport}
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Download size={16} /> Export
      </button>
    </div>
  );
}
