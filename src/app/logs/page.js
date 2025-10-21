"use client";

import { useMemo, useState } from "react";
import Layout from "@/layout/Layout";

import LogsHeader from "./components/LogsHeader";
import DateRange from "./components/DateRange";
import LogsTable from "./components/LogsTable";
import Pagination from "./components/Pagination";

import { RAW_LOGS } from "./data";

const toDate = (s) => new Date(s.replace(" ", "T") + "Z"); // treat as UTC

export default function LogsPage() {
  const [from, setFrom] = useState("2025-04-23T00:00");
  const [to, setTo] = useState("2025-04-23T23:59");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    const fromD = new Date(from);
    const toD = new Date(to);
    return RAW_LOGS.filter((r) => {
      const d = toDate(r.ts);
      return d >= fromD && d <= toD;
    });
  }, [from, to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = () => {
    const header = ["timestamp", "temperature_c", "humidity_pct", "aqi"].join(",");
    const lines = filtered.map((r) => `${r.ts},${r.temp},${r.rh},${r.aqi}`);
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "numu_sensor_logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onRangeChange = ({ from: f = from, to: t = to }) => {
    setFrom(f);
    setTo(t);
    setPage(1);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <main className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <LogsHeader onExport={exportCSV} />
            <DateRange from={from} to={to} onChange={onRangeChange} />
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
