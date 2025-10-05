export default function Alerts() {
  const alerts = [
    { type: "Device Activation", msg: "Humidifier activated", time: "Yesterday, 4:37 PM" },
    { type: "Humidity", msg: "Humidity level too low: 24%", time: "Yesterday, 4:30 PM" },
    { type: "Temperature", msg: "Too high: 39.2°C", time: "21 Apr, 1:05 PM" },
  ];

  return (
    <div>
      <h2 className="font-light text-lg mb-4 text-gray-600">Alerts</h2>
      <ul className="space-y-3 text-sm">
        {alerts.map((a, i) => (
          <li key={i} className="border-b pb-2 border-gray-300">
            <p className="font-medium text-gray-600">{a.type}</p>
            <p className="text-sm text-gray-500">{a.msg}</p>
            <p className="text-xs text-gray-400">{a.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
