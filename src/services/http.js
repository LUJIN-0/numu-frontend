export const API_BASE = process.env.NEXT_PUBLIC_API || "http://localhost:4000";

const qs = (params = {}) => {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") u.append(k, String(v));
  });
  return u.toString();
};

export async function httpGet(path, { params, headers } = {}) {
  const url = `${API_BASE}${path}${params ? `?${qs(params)}` : ""}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json", ...(headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const j = await res.json();
    return j?.data ?? j;
  }
  return res.text();
}
