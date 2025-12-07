'use client'

import { useTranslations } from 'next-intl';
import { useEffect, useState, useMemo } from "react";
import { useGreenhouse } from "@/context/GreenhouseContext";
import { getThresholdAlerts, getControlAlerts } from "@/components/greenhouse";
import { format } from "date-fns";

export default function AlertsPage() {
  const t = useTranslations('Alerts');

  const { greenhouses, selectedGreenhouseId, loading: ghLoading, error: ghError } = useGreenhouse();

  const [parameterAlerts, setParameterAlerts] = useState([]);
  const [deviceAlerts, setDeviceAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsError, setAlertsError] = useState("");
  const [isRTL, setIsRTL] = useState(false);

  const selectedGreenhouse = useMemo(
    () => greenhouses?.find((g) => g.id === selectedGreenhouseId) || null,
    [greenhouses, selectedGreenhouseId]
  );

  useEffect(() => {
    // detect directionality so we can adapt alignment & layout
    if (typeof document !== "undefined") {
      const dir = document.documentElement?.dir || document.body?.dir || "ltr";
      setIsRTL(dir.toLowerCase() === "rtl");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadAlerts = async () => {
      setAlertsLoading(true);
      setAlertsError("");
      setParameterAlerts([]);
      setDeviceAlerts([]);

      if (ghLoading) return;

      if (ghError || !greenhouses || greenhouses.length === 0) {
        setAlertsLoading(false);
        return;
      }

      if (!selectedGreenhouseId) {
        setAlertsLoading(false);
        return;
      }

      try {
        // Call endpoints (they return { alerts: [...], page, size, total })
        const thRaw = await getThresholdAlerts(selectedGreenhouseId);
        const ctrlRaw = await getControlAlerts(selectedGreenhouseId);

        const thList = Array.isArray(thRaw?.alerts) ? thRaw.alerts : [];
        const ctrlList = Array.isArray(ctrlRaw?.alerts) ? ctrlRaw.alerts : [];

        // Normalize threshold alerts
        const normalizedThresholds = thList.map((a) => ({
          id: a.id,
          kind: "threshold",
          parameter: a.parameter,
          message:
            a.parameter === "temperature"
              ? `${t('temperature')}: ${Number.isFinite(a.value) ? (Math.trunc(a.value * 100) / 100) + "°C" : a.value}`
              : `${a.parameter}: ${a.value}`,
          time: a.createdAt || a.time || null,
          raw: a,
        }));

        // Normalize control alerts
        const normalizedControls = ctrlList.map((a) => ({
          id: a.id,
          kind: "control",
          controlType: a.type || a.action || "control",
          message:
            a.action === "activation"
              ? t('device-activated')
              : a.action === "deactivation"
                ? t('device-deactivated')
                : `${a.type} ${a.action}`,
          time: a.createdAt || a.time || null,
          raw: a,
        }));

        if (!isMounted) return;

        // sort descending (newest first)
        normalizedThresholds.sort((x, y) => new Date(y.time).getTime() - new Date(x.time).getTime());
        normalizedControls.sort((x, y) => new Date(y.time).getTime() - new Date(x.time).getTime());

        setParameterAlerts(normalizedThresholds);
        setDeviceAlerts(normalizedControls);
      } catch (err) {
        console.error("Failed to load alerts:", err);
        if (isMounted) setAlertsError(t('failed-load-alerts') || "Failed to load alerts");
      } finally {
        if (isMounted) setAlertsLoading(false);
      }
    };

    loadAlerts();

    return () => {
      isMounted = false;
    };
  }, [ghLoading, ghError, greenhouses, selectedGreenhouseId, t]);

  // Alignment helpers (switch text alignment based on direction)
  const thAlign = isRTL ? "text-right" : "text-left";
  const tdAlign = isRTL ? "text-right" : "text-left";
  const containerDirStyle = { direction: isRTL ? "rtl" : "ltr" };

  if (!ghLoading && (ghError || !greenhouses || greenhouses.length === 0)) {
    return (
      <div className="p-6 min-h-screen bg-background text-(--card-text)" style={containerDirStyle}>
        <p className="text-sm text-(--muted-text)">
          {t('no-greenhouse')}
        </p>
      </div>
    );
  }

  if (!ghLoading && greenhouses && greenhouses.length > 0 && !selectedGreenhouseId) {
    return (
      <div className="p-6 min-h-screen bg-background text-(--card-text)" style={containerDirStyle}>
        <p className="text-sm text-(--muted-text)">
          {t('select-greenhouse')}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-background text-(--card-text)" style={containerDirStyle}>
      {/* Header */}
      <div className={`flex items-center justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div>
          {selectedGreenhouse && (
            <p className="text-sm text-(--muted-text)">
              {t('showing-for')}:{" "}
              <span className="font-medium text-(--card-text)">
                {selectedGreenhouse.name}
              </span>
            </p>
          )}
        </div>

        {(ghLoading || alertsLoading) && (
          <p className="text-sm text-(--muted-text)">{t('loading')}</p>
        )}
      </div>

      {/* Threshold Alerts */}
      <section className="mb-10">
        <h2 className="text-lg font-medium mb-4 text-(--muted-text)">
          {t('threshold-alerts')}
        </h2>
        <div className="rounded-lg border border-(--border-color) bg-(--card-bg) overflow-hidden">
          {alertsError ? (
            <div className="p-6 text-center text-red-500">{alertsError}</div>
          ) : parameterAlerts.length > 0 ? (
            // responsive wrapper prevents overflow on narrow screens
            <div className="w-full overflow-auto">
              <table className="w-full min-w-[640px] text-sm border-collapse">
                <thead className="bg-(--table-header-bg) text-(--card-text)">
                  <tr>
                    <th className={`py-3 px-4 font-medium ${thAlign}`}>{t('type')}</th>
                    <th className={`py-3 px-4 font-medium ${thAlign}`}>{t('message')}</th>
                    <th className={`py-3 px-4 font-medium ${thAlign}`}>{t('time')}</th>
                  </tr>
                </thead>
                <tbody>
                  {parameterAlerts.map((alert, i) => (
                    <tr
                      key={alert.id || i}
                      className="border-t border-(--border-color) hover:bg-(--header-hover) transition-colors duration-200"
                    >
                      <td className={`py-3 px-4 font-medium text-(--card-text) min-w-0 ${tdAlign} wrap-break-word`}>{alert.parameter}</td>
                      <td className={`py-3 px-4 text-(--muted-text) min-w-0 ${tdAlign} wrap-break-word`}>{alert.message}</td>
                      <td className={`py-3 px-4 text-(--faint-text) min-w-0 ${tdAlign} wrap-break-word`}>{alert.time ? format(new Date(alert.time), "dd MMM, h:mm a") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !alertsLoading && (
              <p className="p-6 text-center text-(--faint-text) text-sm">
                {t('no-threshold-alerts')}
              </p>
            )
          )}
        </div>
      </section>

      {/* Control Alerts */}
      <section>
        <h2 className="text-lg font-medium mb-4 text-(--muted-text)">
          {t('device-alerts')}
        </h2>
        <div className="rounded-lg border border-(--border-color) bg-(--card-bg) overflow-hidden">
          {alertsError ? (
            <div className="p-6 text-center text-red-500">{alertsError}</div>
          ) : deviceAlerts.length > 0 ? (
            <div className="w-full overflow-auto">
              <table className="w-full min-w-[640px] text-sm border-collapse">
                <thead className="bg-(--table-header-bg) text-(--card-text)">
                  <tr>
                    <th className={`py-3 px-4 font-medium ${thAlign}`}>{t('type')}</th>
                    <th className={`py-3 px-4 font-medium ${thAlign}`}>{t('message')}</th>
                    <th className={`py-3 px-4 font-medium ${thAlign}`}>{t('time')}</th>
                  </tr>
                </thead>
                <tbody>
                  {deviceAlerts.map((alert, i) => (
                    <tr
                      key={alert.id || i}
                      className="border-t border-(--border-color) hover:bg-(--header-hover) transition-colors duration-200"
                    >
                      <td className={`py-3 px-4 font-medium text-(--card-text) min-w-0 ${tdAlign} wrap-break-word`}>{alert.controlType}</td>
                      <td className={`py-3 px-4 text-(--muted-text) min-w-0 ${tdAlign} wrap-break-word`}>{alert.message}</td>
                      <td className={`py-3 px-4 text-(--faint-text) min-w-0 ${tdAlign} wrap-break-word`}>{alert.time ? format(new Date(alert.time), "dd MMM, h:mm a") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !alertsLoading && (
              <p className="p-6 text-center text-(--faint-text) text-sm">
                {t('no-device-alerts')}
              </p>
            )
          )}
        </div>
      </section>
    </div>
  );
}
