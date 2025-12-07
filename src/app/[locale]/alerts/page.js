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
    if (typeof document !== "undefined") {
      const dir = document.documentElement?.dir || document.body?.dir || "ltr";
      setIsRTL(dir.toLowerCase() === "rtl");
    }
  }, []);

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
        const thRaw = await getThresholdAlerts(selectedGreenhouseId);
        const ctrlRaw = await getControlAlerts(selectedGreenhouseId);

        const thList = Array.isArray(thRaw?.alerts) ? thRaw.alerts : [];
        const ctrlList = Array.isArray(ctrlRaw?.alerts) ? ctrlRaw.alerts : [];

        const normalizedThresholds = thList.map((a) => {
          const value = a.value;
          const parameter = a.parameter;
          const paramText = paramLabel(parameter);
          const valText = Number.isFinite(value) ? `${fmtNumber(value)}${parameter === 'temperature' ? '°C' : ''}` : String(value ?? '—');

          const hasStatus = !!a.status;
          const finalMessage = hasStatus
            ? `${statusLabelFor(parameter, a.status)}: ${valText}`
            : `${paramText}: ${valText}`;

          return {
            id: a.id,
            kind: "threshold",
            parameter,
            parameterLabel: paramText,
            message: finalMessage,
            time: a.createdAt || a.time || null,
            raw: a,
          };
        });

        const normalizedControls = ctrlList.map((a) => {
          const ctlLabel = controlLabel(a.type);
          // Use i18n placeholder so Arabic ordering can be correct
          const message =
            a.action === "activation"
              ? (t('action-activated', { type: ctlLabel }) || `${ctlLabel} activated`)
              : a.action === "deactivation"
                ? (t('action-deactivated', { type: ctlLabel }) || `${ctlLabel} deactivated`)
                : (`${ctlLabel} ${a.action}`);
          return {
            id: a.id,
            kind: "control",
            controlType: a.type,
            controlLabel: ctlLabel,
            message,
            time: a.createdAt || a.time || null,
            raw: a,
          };
        });

        if (!isMounted) return;

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

      <section className="mb-10">
        <h2 className="text-lg font-medium mb-4 text-(--muted-text)">
          {t('threshold-alerts')}
        </h2>
        <div className="rounded-lg border border-(--border-color) bg-(--card-bg) overflow-hidden">
          {alertsError ? (
            <div className="p-6 text-center text-red-500">{alertsError}</div>
          ) : parameterAlerts.length > 0 ? (
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
                    <tr key={alert.id || i} className="border-t border-(--border-color) hover:bg-(--header-hover) transition-colors duration-200">
                      <td className={`py-3 px-4 font-medium text-(--card-text) min-w-0 ${tdAlign} wrap-break-word`}>{alert.parameterLabel || alert.parameter}</td>
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
                    <tr key={alert.id || i} className="border-t border-(--border-color) hover:bg-(--header-hover) transition-colors duration-200">
                      <td className={`py-3 px-4 font-medium text-(--card-text) min-w-0 ${tdAlign} wrap-break-word`}>{alert.controlLabel || alert.controlType}</td>
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
