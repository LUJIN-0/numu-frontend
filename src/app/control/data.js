// Fake data 

export const GREENHOUSES = [
  { id: "gh-1", name: "Greenhouse 1" },
  { id: "gh-2", name: "Greenhouse 2" },
];

export const CROPS = ["Tomato", "Lettuce", "Potato"];

export const INITIAL_STAGE = { crop: "Tomato", stage: "Vegetative Growth" };

export const INITIAL_THRESHOLDS = {
  temp: { optimal: [22, 28], alarmingLow: [18, 22], alarmingHigh: [28, 32] },
  rh: { optimal: [60, 70], alarmingLow: [50, 60], alarmingHigh: [70, 80] },
};

export const MIN_ON_OFF_SEC = 90;

export const INITIAL_ACTUATORS = {
  fan: { state: "OFF", lastChange: Date.now() - 1000 * 120 },
  ac: { state: "OFF", lastChange: Date.now() - 1000 * 120 },
  humidifier: { state: "OFF", lastChange: Date.now() - 1000 * 120 },
};

export const INITIAL_ALERTS = [
  { id: "a1", ts: "2025-04-23T07:00:00Z", kind: "TEMP_HIGH", text: "Temperature above target (29.6°C)", ack: false },
  { id: "a2", ts: "2025-04-23T06:40:00Z", kind: "RH_LOW", text: "Humidity below target (53%)", ack: true },
];

export const DEVICES = [
  { id: "dev-001", name: "dev-01", rssi: -92, snr: 7.2, battery: 3.9, ok: true },
  { id: "dev-002", name: "dev-02",  rssi: -101, snr: 5.1, battery: 3.7, ok: true },
  { id: "dev-003", name: "dev-03",  rssi: -110, snr: 2.3, battery: 3.5, ok: false },
];

export const NETWORK = {
  gateway: { id: "rak7289-01", online: true },
  cloud: { aws: true },
  fallback: { active: false },
};
