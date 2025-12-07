'use client'

import { useEffect, useState } from "react";
import StatCard from "./components/StatCard";
import Alerts from "./components/Alerts";
import Chart from "./components/Chart";
import LocationMap from "./components/LocationMap";
import CropInfo from "./components/CropInfo";
import GrowthTimeline from "./components/GrowthTimeline";
import { Thermometer, Droplet, AirVent, AlarmSmoke } from "lucide-react";
import { useTranslations } from "next-intl";
import { getGreenhouseAverages, getCrop } from "@/components/greenhouse";
import { useGreenhouse } from "@/context/GreenhouseContext";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");

  const {
    greenhouses,
    selectedGreenhouseId,
    loading: ghLoading,
    error: ghError,
  } = useGreenhouse();

  const [averages, setAverages] = useState(null);
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedGreenhouseId) {
      setAverages(null);
      setCrop(null);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const avgJson = await getGreenhouseAverages(selectedGreenhouseId);
        setAverages(avgJson?.averages || null);

        const cropJson = await getCrop(selectedGreenhouseId);
        setCrop(cropJson || null);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Unexpected error loading data");
        setAverages(null);
        setCrop(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedGreenhouseId]);

  const formatTemp = (v) => (v == null ? "—" : `${v.toFixed(1)}°C`);
  const formatHumidity = (v) => (v == null ? "—" : `${v.toFixed(0)}%`);
  const formatBarometer = (v) => (v == null ? "—" : `${v.toFixed(0)} hPa`);
  const formatGas = (v) => (v == null ? "—" : v.toFixed(2));

  const temp = averages?.temperature ?? null;
  const humidity = averages?.humidity ?? null;
  const barometer = averages?.barometer ?? null;
  const gasResistance = averages?.gasResistance ?? null;

  if (ghLoading) {
    return (
      <div className="flex min-h-screen bg-background var(--foreground)">
        <div className="flex-1 flex items-center justify-center text-(--muted-text) text-sm">
          {t('loading-greenhouses')}
        </div>
      </div>
    );
  }

  if (!ghLoading && (!greenhouses || greenhouses.length === 0)) {
    return (
      <div className="flex min-h-screen bg-background var(--foreground)">
        <div className="flex-1 flex items-center justify-center text-(--muted-text) text-sm">
          {t('no-greenhouse')}
        </div>
      </div>
    );
  }

  if (!selectedGreenhouseId) {
    return (
      <div className="flex min-h-screen bg-background var(--foreground)">
        <div className="flex-1 flex items-center justify-center text-(--muted-text) text-sm">
          {t('select-greenhouse')}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background var(--foreground)">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-6 grid grid-cols-12 gap-4">
          {error && (
            <div className="col-span-12 mb-2 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Stat cards - responsive */}
          <div className="col-span-12 sm:col-span-6 md:col-span-3 min-w-0">
            <div className="rounded-lg p-4 bg-(--card-bg) h-full w-full overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
              <StatCard
                title={t('temp')}
                value={formatTemp(temp)}
                max={50}
                icon={<Thermometer size={16} style={{ color: "var(--muted-text)" }} />}
              />
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 md:col-span-3 min-w-0">
            <div className="rounded-lg p-4 bg-(--card-bg) h-full w-full overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
              <StatCard
                title={t('humidity')}
                value={formatHumidity(humidity)}
                max={100}
                icon={<Droplet size={16} style={{ color: "var(--muted-text)" }} />}
              />
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 md:col-span-3 min-w-0">
            <div className="rounded-lg p-4 bg-(--card-bg) h-full w-full overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
              <StatCard
                title={t('barometer')}
                value={formatBarometer(barometer)}
                max={1100}
                icon={<AirVent size={16} style={{ color: "var(--muted-text)" }} />}
              />
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 md:col-span-3 min-w-0">
            <div className="rounded-lg p-4 bg-(--card-bg) h-full w-full overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
              <StatCard
                title={t('gas-resistance')}
                value={formatGas(gasResistance)}
                max={50}
                icon={<AlarmSmoke size={16} style={{ color: "var(--muted-text)" }} />}
              />
            </div>
          </div>

          {/* Chart and Alerts: responsive layout */}
          <div className="col-span-12 lg:col-span-8 min-w-0">
            <div className="rounded-lg p-4 bg-(--card-bg) h-full w-full overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
              <Chart greenhouseId={selectedGreenhouseId} />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 min-w-0">
            <div className="rounded-lg p-4 bg-(--card-bg) h-full w-full overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
              <Alerts />
            </div>
          </div>

          {/* Bottom cards: Map, CropInfo, GrowthTimeline - responsive */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 min-w-0">
            <div className="rounded-lg p-4 bg-(--card-bg) h-full w-full overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
              <LocationMap />
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-4 min-w-0">
            <div className="rounded-lg p-4 bg-(--card-bg) h-full w-full overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
              <CropInfo crop={crop} />
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-4 min-w-0">
            <div className="rounded-lg p-4 bg-(--card-bg) h-full w-full overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
              <GrowthTimeline crop={crop} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
