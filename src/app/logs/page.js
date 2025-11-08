"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Layout from "@/layout/Layout";
import LogsHeader from "./components/LogsHeader";
import DateRange from "./components/DateRange";
import LogsTable from "./components/LogsTable";
import Pagination from "./components/Pagination";
import { fetchLogs } from "@/services/logs";

export default function LogsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const mapItems = (items = []) =>
    items.map((r) => {
      const ts = String(r.ts ?? r.timestamp ?? "");
      const tempNum = Number(r.temp ?? r.temperature);
      const rhNum = Number(r.rh ?? r.humidity);
      const baroNum = Number(r.barometer ?? r.aqi);
      return {
        ts,                                  
        tsDisplay: ts.replace("T", " ").replace(/Z$/, ""), 
        temp: isNaN(tempNum) ? null : tempNum,
        rh: isNaN(rhNum) ? null : rhNum,
        barometer: isNaN(baroNum) ? null : baroNum,
        _raw: r,
      };
    });

  const load = useCallback(async (opts = {}) => {
    setLoading(true);
    setErr("");
    try {
      const { items } = await fetchLogs({ limit: 500, ...opts });
      setRows(mapItems(items || []));
    } catch {
      setErr("فشل جلب البيانات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(); 
  }, [load]);

  const onRangeChange = ({ from: f = from, to: t = to }) => {
    setFrom(f);
    setTo(t);
    setPage(1);
  };

  const onSearch = () => {
    load({
      from: from || undefined,
      to: to || undefined,
      force: true,
    });
    setPage(1);
  };

  const filtered = useMemo(() => rows, [rows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = () => {
    const header = ["timestamp", "temperature_c", "humidity_pct", "barometer"].join(",");
    const lines = filtered.map((r) => `${r.tsDisplay},${r.temp ?? ""},${r.rh ?? ""},${r.barometer ?? ""}`);
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "numu_sensor_logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Layout><div className="p-6">Loading…</div></Layout>;
  if (err) return <Layout><div className="p-6 text-red-600">{err}</div></Layout>;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <main className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <LogsHeader onExport={exportCSV} />
            <DateRange from={from} to={to} onChange={onRangeChange} onSearch={onSearch} />
            <LogsTable rows={pageData} />
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        </main>
      </div>
    </Layout>
  );
}
