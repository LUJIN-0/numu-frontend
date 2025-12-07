'use client'

import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Thermometer, Droplet, AlertOctagon, AirVent } from "lucide-react";
import { useGreenhouse } from "@/context/GreenhouseContext";
import { getThresholdAlerts, getControlAlerts } from "@/components/greenhouse";

export default function Alerts() {
  const t = useTranslations('Dashboard');
  const { greenhouses, selectedGreenhouseId, loading: ghLoading } = useGreenhouse();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRTL, setIsRTL] = useState(false);

  // Detect document direction so we can position timeline correctly (left vs right)
  useEffect(() => {
    if (typeof document !== "undefined") {
      const dir = document.documentElement?.dir || document.body?.dir || "ltr";
      setIsRTL(dir.toLowerCase() === "rtl");
    }
  }, []);

  // Icons for parameters
  const paramIcon = (parameter) => {
    switch ((parameter || "").toLowerCase()) {
      case "temperature":
        return <Thermometer size={14} />;
      case "humidity":
        return <Droplet size={14} />;
      default:
        return <AlertOctagon size={14} />;
    }
  };

  // Icons for actuator type
  const controlIcon = (type) => {
    switch ((type || "").toLowerCase()) {
      case "cooling":
      case "fan":
        return <AirVent size={14} />;
      default:
        return <AlertOctagon size={14} />;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      setAlerts([]);

      if (!selectedGreenhouseId) {
        setLoading(false);
        return;
      }

      try {
        const thRaw = await getThresholdAlerts(selectedGreenhouseId);
        const ctrlRaw = await getControlAlerts(selectedGreenhouseId);

        const thList = Array.isArray(thRaw?.alerts) ? thRaw.alerts : [];
        const ctrlList = Array.isArray(ctrlRaw?.alerts) ? ctrlRaw.alerts : [];

        const normalizedThresholds = thList.map((a) => ({
          id: a.id,
          kind: "threshold",
          parameter: a.parameter,
          message:
            a.parameter === "temperature"
              ? `${t('temperature')}: ${(Math.round(a.value * 100) / 100)}°C`
              : `${a.parameter}: ${a.value}`,
          time: a.createdAt || a.time || null,
        }));

        const normalizedControls = ctrlList.map((a) => ({
          id: a.id,
          kind: "control",
          controlType: a.type,
          message:
            a.action === "activation"
              ? t('device-activated')
              : a.action === "deactivation"
              ? t('device-deactivated')
              : `${a.type} ${a.action}`,
          time: a.createdAt || a.time || null,
        }));

        const merged = [...normalizedThresholds, ...normalizedControls]
          .sort((a, b) => new Date(b.time) - new Date(a.time));

        if (!isMounted) return;

        setAlerts(merged.slice(0, 5));
      } catch (err) {
        console.error(err);
        if (isMounted) setError(t('failed-load-alerts') || "Failed to load alerts");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!ghLoading) load();

    return () => { isMounted = false; };
  }, [selectedGreenhouseId, ghLoading, t]);

  // Positioning for timeline & icon bubble based on direction
  const bubblePosStyle = isRTL ? { right: '1rem' } : { left: '1rem' };
  const linePosStyle = isRTL ? { right: '1.75rem' } : { left: '1.75rem' };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-light text-lg text-(--muted-text)">{t('alerts')}</h2>
        <Link
          href="./alerts"
          className="text-sm px-3 py-1 rounded border border-(--border-color)
          bg-(--header-input-bg) text-(--header-text) hover:bg-(--header-hover) transition-colors"
        >
          {t('view-all')}
        </Link>
      </div>

      {/* Container */}
      <div className="rounded-lg bg-(--card-bg) border border-(--border-color) px-0 py-2">
        {loading ? (
          <div className="py-8 text-center text-(--muted-text)">{t('loading')}</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : alerts.length === 0 ? (
          <div className="py-8 text-center text-(--muted-text)">{t('no-alerts')}</div>
        ) : (
          <ul className="relative">

            {/* timeline line (position depends on LTR/RTL) */}
            <div
              className="absolute top-4 bottom-4 w-px bg-(--border-color) opacity-40"
              style={{
                ...linePosStyle,
                // ensure it doesn't overflow small containers
                transform: "translateX(0)",
              }}
            />

            {alerts.map((a, i) => {
              const dateLabel = a.time ? format(new Date(a.time), "dd MMM, h:mm a") : "—";
              const icon =
                a.kind === "threshold" ? paramIcon(a.parameter) : controlIcon(a.controlType);

              return (
                <li
                  key={a.id || i}
                  className="relative pr-4 py-4 border-b border-(--border-color) last:border-none min-w-0"
                  // allow content to adapt in RTL/LTR by using padding that keeps timeline space
                  style={isRTL ? { paddingRight: '4.5rem' } : { paddingLeft: '4.5rem' }}
                >
                  {/* Icon Bubble (positioned depending on direction) */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
                    style={{
                      ...bubblePosStyle,
                      background: "var(--header-input-bg)",
                    }}
                  >
                    <div className="min-w-0">{icon}</div>
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-(--card-text) wrap-break-word">
                      {a.kind === "threshold"
                        ? (a.parameter === "temperature"
                            ? t('temperature-alert')
                            : a.parameter)
                        : t('device-alert')}
                    </p>

                    <p className="text-sm text-(--muted-text) wrap-break-word">{a.message}</p>
                    <p className="text-xs text-(--faint-text)">{dateLabel}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
