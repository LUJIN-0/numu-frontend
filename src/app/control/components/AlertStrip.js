"use client";

import { AlertTriangle } from "lucide-react";

export default function AlertStrip({ items = [] }) {
  return (
    <div>
      <div className="font-medium text-gray-800 mb-2">Notifications</div>

      <div className="rounded-md border border-gray-200 bg-white">
        {(!items || items.length === 0) ? (
          <div className="p-4 text-sm text-gray-500">No notifications.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((a) => (
              <li key={a.id} className="px-3 py-3 flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5 text-amber-600" />
                <div className="text-sm text-gray-800">
                  {a.text}
                  {a.ts && (
                    <span className="ml-2 text-xs text-gray-500">
                      {new Date(a.ts).toLocaleString()}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
