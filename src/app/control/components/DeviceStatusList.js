"use client";

export default function DeviceStatusList({ devices }) {
  return (
    <div>
      <div className="font-medium text-gray-800 mb-2">Device health</div>
      <div className="overflow-hidden rounded-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Device</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">RSSI</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">SNR</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Battery</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {devices.map((d) => (
              <tr key={d.id}>
                <td className="px-3 py-2 text-sm text-gray-800">{d.name}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{d.rssi} dBm</td>
                <td className="px-3 py-2 text-sm text-gray-700">{d.snr} dB</td>
                <td className="px-3 py-2 text-sm text-gray-700">{d.battery} V</td>
                <td className="px-3 py-2 text-sm">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      d.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {d.ok ? "OK" : "Check"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
