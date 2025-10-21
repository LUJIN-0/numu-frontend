"use client";

export default function ControlEvents({ events }) {
  return (
    <div>
      <div className="font-medium text-gray-800 mb-2">Recent control events</div>
      <div className="h-[220px] overflow-y-auto rounded-md border border-gray-200 bg-white">
        {events.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No events yet.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {events.map((e, i) => (
              <li key={i} className="px-3 py-2 text-sm">
                <span className="text-gray-500 mr-2">{new Date(e.ts).toLocaleString()}</span>
                <span className="text-gray-800">{e.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
