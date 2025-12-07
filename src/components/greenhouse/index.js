import { apiFetch } from "@/config/api";

// Endpoint #1
export function getGreenhouses() {
  return apiFetch('/greenhouses');
}

// Endpoint #2
export function getCrop(greenhouseId) {
  return apiFetch(`/greenhouses/${greenhouseId}/crops`);
}

// Endpoint #3
export function getGreenhouseAverages(greenhouseId) {
  return apiFetch(`/greenhouses/${greenhouseId}/avg`);
}

// Endpoint #4
export function getHistoricalAvg(greenhouseId, granularity, start, end) {
  const params = new URLSearchParams({ granularity, start, end }).toString();
  return apiFetch(`/greenhouses/${greenhouseId}/historical-avg?${params}`);
}

// Endpoint #5
export function getThresholdAlerts(greenhouseId) {
  return apiFetch(`/greenhouses/${greenhouseId}/threshold-alerts`);
}

// Endpoint #6
export function getControlAlerts(greenhouseId) {
  return apiFetch(`/greenhouses/${greenhouseId}/control-alerts`);
}
