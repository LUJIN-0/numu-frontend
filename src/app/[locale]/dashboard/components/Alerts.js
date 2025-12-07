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

  useEffect(() => {
    if (typeof document !== "undefined") {
      const dir = document.documentElement?.dir || document.body?.dir || "ltr";
      setIsRTL(dir.toLowerCase() === "rtl");
    }
  }, []);

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

  const controlIcon = (type) => {
    switch ((type || "").toLowerCase()) {
      case "cooling":
      case "fan":
        return <AirVent size={14} />;
      default:
        return <AlertOctagon size={14} />;
    }
  };

  const paramLabel = (parameter) => {
    if (!parameter) return "—";
    const p = parameter.toLowerCase();
    const map = {
      temperature: t('temperature') || 'Temperature',
      humidity: t('humidity') || 'Humidity',
      barometer: t('barometer') || 'Barometer',
      gas: t('gas-resistance') || 'Gas',
    };
    return map[p] || parameter;
  };

  const controlLabel = (type) => {
    if (!type) return "—";
    const p = type.toLowerCase();
    const map = {
      cooling: t('cooling') || 'Cooling',
      fan: t('fan') || 'Fan',
      heater: t('heater') || 'Heater',
      pump: t('pump') || 'Pump'
    };
    return map[p] || type;
  };

  const statusLabelFor = (parameterName, status) => {
    const param = paramLabel(parameterName);
    const statusMap = {
      above_optimal: t('status-above-optimal', { param }),
      below_optimal: t('status-below-optimal', { param }),
      within_optimal: t('status-within-optimal', { param }),
      triggered: t('status-triggered'),
    };
    return statusMap[status] || (status ? status.replace(/_/g, ' ') : '');
  };

  const fmtNumber = (v) => {
    if (v == null || Number.isNaN(Number(v))) return "—";
    const n = Number(v);
    return Number.isInteger(n) ? `${n}` : `${Math.round(n * 100) / 100}`;
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

        const normalizedThresholds = thList.map((a) => {
          const param = a.parameter;
          const label = paramLabel(param);
          const value = a.value;
          const valText = Number.isFinite(value) ? `${fmtNumber(value)}${param === 'temperature' ? '°C' : ''}` : String(value ?? '—');
          const hasStatus = !!a.status;
          const message = hasStatus ? `${statusLabelFor(param, a.status)}: ${valText}` : `${label}: ${valText}`;
          return {
            id: a.id,
            kind: "threshold",
            parameter: param,
            message,
            time: a.createdAt || a.time || null,
          };
        });

        const normalizedControls = ctrlList.map((a) => {
          const ctl = a.type;
          const ctlLabel = controlLabel(ctl);
          const message =
            a.action === "activation"
              ? (t('action-activated', { type: ctlLabel }) || `${ctlLabel} activated`)
              : a.action === "deactivation"
                ? (t('action-deactivated', { type: ctlLabel }) || `${ctlLabel} deactivated`)
                : `${ctlLabel} ${a.action}`;
          return {
            id: a.id,
            kind: "control",
            controlType: ctl,
            message,
            time: a.createdAt || a.time || null,
          };
        });

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

  const bubblePosStyle = isRTL ? { right: '1rem' } : { left: '1rem' };
  const linePosStyle = isRTL ? { right: '1.75rem' } : { left: '1.75rem' };

  return (
    <div>
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

      <div className="rounded-lg bg-(--card-bg) border border-(--border-color) px-0 py-2">
        {loading ? (
          <div className="py-8 text-center text-(--muted-text)">{t('loading')}</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : alerts.length === 0 ? (
          <div className="py-8 text-center text-(--muted-text)">{t('no-alerts')}</div>
        ) : (
          <ul className="relative">
            <div
              className="absolute top-4 bottom-4 w-px bg-(--border-color) opacity-40"
              style={{
                ...linePosStyle,
                transform: "translateX(0)",
              }}
            />

            {alerts.map((a, i) => {
              const dateLabel = a.time ? format(new Date(a.time), "dd MMM, h:mm a") : "—";
              const icon = a.kind === "threshold"
                ? paramIcon(a.parameter)
                : controlIcon(a.controlType);

              return (
                <li
                  key={a.id || i}
                  className="relative pr-4 py-4 border-b border-(--border-color) last:border-none min-w-0"
                  style={isRTL ? { paddingRight: '4.5rem' } : { paddingLeft: '4.5rem' }}
                >
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
                      {a.kind === "threshold" ? (a.parameter === "temperature" ? t('temperature-alert') : a.parameter) : t('device-alert')}
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
