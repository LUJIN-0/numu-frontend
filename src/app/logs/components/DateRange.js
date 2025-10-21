"use client";

import { Calendar, Search } from "lucide-react";

export default function DateRange({ from, to, onChange, onSearch }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-gray-500" />
        <span className="text-sm text-gray-600">From</span>
        <input
          type="datetime-local"
          value={from}
          onChange={(e) => onChange({ from: e.target.value, to })}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-800"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">To</span>
        <input
          type="datetime-local"
          value={to}
          onChange={(e) => onChange({ from, to: e.target.value })}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-800"
        />
      </div>

      
      <button
        onClick={() =>
          onSearch ? onSearch({ from, to }) : onChange({ from, to })
        }
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
      >
        <Search size={16} />
        Search
      </button>
    </div>
  );
}
