"use client";

const fmt = (n, unit) => (typeof n === "number" ? `${n}${unit}` : n);

export default function LogsTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Timestamp</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Temperature</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Humidity</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">AQI</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500">
                No logs in this range.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.ts} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">{r.ts}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{fmt(r.temp, "°C")}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{fmt(r.rh, "%")}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.aqi}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
