"use client";

import { Wifi, Cloud, ShieldAlert } from "lucide-react";

export default function NetworkStatus({ data }) {
  return (
    <div>
      <div className="font-medium text-gray-800 mb-2">Network & Fallback</div>
      <div className="space-y-2">
        <Row
          icon={<Wifi size={16} />}
          label={`Gateway (${data.gateway.id})`}
          ok={data.gateway.online}
        />
        <Row icon={<Cloud size={16} />} label="Cloud (AWS)" ok={data.cloud.aws} />
        <Row
          icon={<ShieldAlert size={16} />}
          label="Local fallback"
          ok={!data.fallback.active}
          invert // active=false means OK
        />
      </div>
    </div>
  );
}

function Row({ icon, label, ok, invert = false }) {
  const good = invert ? ok : ok;
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2">
      <div className="flex items-center gap-2 text-sm text-gray-800">{icon}{label}</div>
      <span
        className={`text-xs px-2 py-0.5 rounded ${
          good ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {good ? "OK" : "Issue"}
      </span>
    </div>
  );
}
