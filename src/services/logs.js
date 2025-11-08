const API = process.env.NEXT_PUBLIC_API || "http://localhost:4000";

export async function fetchLogs({ from, to, limit = 500, cursor, force = true } = {}) {
  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  const capped = Math.min(Number(limit || 500), 500);
  qs.set("limit", String(capped));
  if (cursor) qs.set("cursor", cursor);
  if (force) qs.set("force", "true");

  const res = await fetch(`${API}/logs?${qs.toString()}`, { cache: "no-store" });
  const ct = res.headers.get("content-type") || "";
  const body = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = typeof body === "string" ? body : body?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body?.data ?? body;
}
