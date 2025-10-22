'use client'

export default function GrowthTimeline() {
  const stages = [
    { stage: "Germination", status: "Completed 10 days ago", range: "0–7 days" },
    { stage: "Seedling", status: "Current", range: "8–14 days" },
    { stage: "Vegetative", status: "Starts in 5 days", range: "15–35 days" },
  ];

  return (
    <div>
      <h2 className="font-light text-lg mb-4 text-gray-600 wrap-break-word">Growth Timeline</h2>
      <p className="text-sm text-gray-500 mb-2 wrap-break-word">Current day: 30 | Sown: 01/03/2025</p>
      <ul className="space-y-2 text-sm">
        {stages.map((s, i) => (
          <li key={i} className="border-b pb-2">
            <p className="font-medium text-gray-600 wrap-break-word">{s.stage}</p>
            <p className="text-gray-500 wrap-break-word">{s.status}</p>
            <p className="text-xs text-gray-400 wrap-break-word">{s.range}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
