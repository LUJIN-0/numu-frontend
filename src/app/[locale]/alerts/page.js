'use client'

import Layout from "@/layout/Layout";
import { useTranslations } from 'next-intl';

export default function AlertsPage() {
  const t = useTranslations('Alerts');

  // Dummy data
  const parameterAlerts = [
    { type: "Temperature", msg: "Exceeded threshold: 38.7°C", time: "Today, 2:14 PM" },
    { type: "Humidity", msg: "Low humidity detected: 25%", time: "Yesterday, 10:42 AM" },
    { type: "AQI", msg: "AQI levels dropped below safe range", time: "Yesterday, 6:30 AM" },
  ];

  const deviceAlerts = [
    { type: "Device Activation", msg: "Cooling fan turned ON", time: "Today, 1:45 PM" },
    { type: "Device Deactivation", msg: "Heater turned OFF", time: "Today, 12:15 PM" },
  ];

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-background text-(--card-text)">
        {/* Parameter Alerts */}
        <section className="mb-10">
          <h2 className="text-lg font-medium mb-4 text-(--muted-text)">
            {t('parameter-alerts')}
          </h2>

          <div className="rounded-lg border border-(--border-color) bg-(--card-bg) overflow-hidden">
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
                  <tr key={i} className="border-t border-(--border-color) hover:bg-(--header-hover) transition-colors duration-200">
                    <td className="py-3 px-4 font-medium text-(--card-text)">{alert.type}</td>
                    <td className="py-3 px-4 text-(--muted-text)">{alert.msg}</td>
                    <td className="py-3 px-4 text-(--faint-text)">{alert.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Device Alerts */}
        <section>
          <h2 className="text-lg font-medium mb-4 text-(--muted-text)">
            {t('device-alerts')}
          </h2>

          <div className="rounded-lg border border-(--border-color) bg-(--card-bg) overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-(--table-header-bg) text-(--card-text)">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">{t('type') || 'Type'}</th>
                  <th className="py-3 px-4 text-left font-medium">{t('message') || 'Message'}</th>
                  <th className="py-3 px-4 text-left font-medium">{t('time') || 'Time'}</th>
                </tr>
              </thead>
              <tbody>
                {deviceAlerts.map((alert, i) => (
                  <tr key={i} className="border-t border-(--border-color) hover:bg-(--header-hover) transition-colors duration-200">
                    <td className="py-3 px-4 font-medium text-(--card-text)">{alert.type}</td>
                    <td className="py-3 px-4 text-(--muted-text)">{alert.msg}</td>
                    <td className="py-3 px-4 text-(--faint-text)">{alert.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}
