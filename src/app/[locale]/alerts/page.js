'use client'

import { useTranslations } from 'next-intl';
import { useEffect, useState, useMemo } from "react";
import { useGreenhouse } from "@/context/GreenhouseContext";

export default function AlertsPage() {
  const t = useTranslations('Alerts');

  const { greenhouses, selectedGreenhouseId, loading: ghLoading, error: ghError } = useGreenhouse();

  const [parameterAlerts, setParameterAlerts] = useState([]);
  const [deviceAlerts, setDeviceAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(true);

  const selectedGreenhouse = useMemo(
    () => greenhouses?.find((g) => g.id === selectedGreenhouseId) || null,
    [greenhouses, selectedGreenhouseId]
  );

  useEffect(() => {
    if (ghLoading) return;

    if (ghError || !greenhouses || greenhouses.length === 0) {
      setParameterAlerts([]);
      setDeviceAlerts([]);
      setAlertsLoading(false);
      return;
    }

    if (!selectedGreenhouseId) {
      setParameterAlerts([]);
      setDeviceAlerts([]);
      setAlertsLoading(false);
      return;
    }

    setAlertsLoading(true);

    const timer = setTimeout(() => {
      setParameterAlerts([
        { type: "Humidity", msg: "Low humidity detected: 55%", time: "Nov 27, 5:30 PM" },
        { type: "Temperature", msg: "Temperature returned to normal range 26.5°C", time: "Nov 27, 5:10 PM" },
        { type: "Temperature", msg: "Exceeded threshold: 30.0°C", time: "Nov 27, 4:50 PM" },
      ]);

      setDeviceAlerts([
        { type: "Device Deactivation", msg: "Cooling fan turned OFF", time: "Nov 27, 5:02 PM" },
        { type: "Device Activation", msg: "Cooling fan turned ON", time: "Nov 27, 4:55 PM" },
      ]);

      setAlertsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [ghLoading, ghError, greenhouses, selectedGreenhouseId]);

  if (!ghLoading && (ghError || !greenhouses || greenhouses.length === 0)) {
    return (
      <div className="p-6 min-h-screen bg-background text-(--card-text)">
        <p className="text-sm text-(--muted-text)">
          {t('no-greenhouse')}
        </p>
      </div>
    );
  }

  if (!ghLoading && greenhouses && greenhouses.length > 0 && !selectedGreenhouseId) {
    return (
      <div className="p-6 min-h-screen bg-background text-(--card-text)">
        <p className="text-sm text-(--muted-text)">
          {t('select-greenhouse')}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-background text-(--card-text)">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
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

      {/* Parameter Alerts */}
      <section className="mb-10">
        <h2 className="text-lg font-medium mb-4 text-(--muted-text)">
          {t('parameter-alerts')}
        </h2>
        <div className="rounded-lg border border-(--border-color) bg-(--card-bg) overflow-hidden">
          {parameterAlerts.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead className="bg-(--table-header-bg) text-(--card-text)">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">{t('type')}</th>
                  <th className="py-3 px-4 text-left font-medium">{t('message')}</th>
                  <th className="py-3 px-4 text-left font-medium">{t('time')}</th>
                </tr>
              </thead>
              <tbody>
                {parameterAlerts.map((alert, i) => (
                  <tr
                    key={i}
                    className="border-t border-(--border-color) hover:bg-(--header-hover) transition-colors duration-200"
                  >
                    <td className="py-3 px-4 font-medium text-(--card-text)">{alert.type}</td>
                    <td className="py-3 px-4 text-(--muted-text)">{alert.msg}</td>
                    <td className="py-3 px-4 text-(--faint-text)">{alert.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !alertsLoading && (
              <p className="p-6 text-center text-(--faint-text) text-sm">
                {t('no-parameter-alerts')}
              </p>
            )
          )}
        </div>
      </section>

      {/* Device Alerts */}
      <section>
        <h2 className="text-lg font-medium mb-4 text-(--muted-text)">
          {t('device-alerts')}
        </h2>
        <div className="rounded-lg border border-(--border-color) bg-(--card-bg) overflow-hidden">
          {deviceAlerts.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead className="bg-(--table-header-bg) text-(--card-text)">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">{t('type')}</th>
                  <th className="py-3 px-4 text-left font-medium">{t('message')}</th>
                  <th className="py-3 px-4 text-left font-medium">{t('time')}</th>
                </tr>
              </thead>
              <tbody>
                {deviceAlerts.map((alert, i) => (
                  <tr
                    key={i}
                    className="border-t border-(--border-color) hover:bg-(--header-hover) transition-colors duration-200"
                  >
                    <td className="py-3 px-4 font-medium text-(--card-text)">{alert.type}</td>
                    <td className="py-3 px-4 text-(--muted-text)">{alert.msg}</td>
                    <td className="py-3 px-4 text-(--faint-text)">{alert.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
