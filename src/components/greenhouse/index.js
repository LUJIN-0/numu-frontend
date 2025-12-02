import { apiFetch } from "@/config/api";

export function getGreenhouses() {
  return apiFetch('/greenhouses');
}

export function getCrop(greenhouseId) {
  return apiFetch(`/greenhouses/${greenhouseId}/crops`);
}

export function getGreenhouseAverages(greenhouseId) {
  return apiFetch(`/greenhouses/${greenhouseId}/avg`);
}

export function getHistoricalAvg(greenhouseId, granularity, start, end) {
  const params = new URLSearchParams({ granularity, start, end }).toString();
  return apiFetch(`/greenhouses/${greenhouseId}/historical-avg?${params}`);
}
