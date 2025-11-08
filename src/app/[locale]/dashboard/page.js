'use client'

import StatCard from "./components/StatCard";
import Alerts from "./components/Alerts";
import Chart from "./components/Chart";
import LocationMap from "./components/LocationMap";
import CropInfo from "./components/CropInfo";
import GrowthTimeline from "./components/GrowthTimeline";
import { Thermometer, Droplet, AirVent } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function DashboardPage() {

  const  t  = useTranslations('Dashboard');

  return (
      <div className="flex min-h-screen bg-background var(--foreground)">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="p-6 grid grid-cols-12 gap-4">
            <StatCard
              title={t('temp')}
              value="18°C"
              max={100}
              icon={<Thermometer size={16} style={{ color: "var(--muted-text)" }}/>}
            />
            <StatCard
              title={t('humedity')}
              value="70% r.H"
              max={100}
              icon={<Droplet size={16} style={{ color: "var(--muted-text)" }}/>}
            />
            <StatCard
              title={t('aqi')}
              value="32"
              max={100}
              icon={<AirVent size={16} style={{ color: "var(--muted-text)" }}/>}
            />

            {/* Chart */}
            <div className="col-span-8 rounded-lg p-4 bg-(--card-bg)" style={{border: "1px solid var(--border-color)", }}>
              <Chart />
            </div>

            {/* Alerts */}
            <div className="col-span-4 rounded-lg p-4 bg-(--card-bg)" style={{border: "1px solid var(--border-color)", }}>
              <Alerts />
            </div>

            {/* Location */}
            <div className="col-span-8 rounded-lg p-4 bg-(--card-bg)" style={{border: "1px solid var(--border-color)", }}>
              <LocationMap />
            </div>

            {/* Crop Info */}
            <div className="col-span-4 rounded-lg p-4 bg-(--card-bg)" style={{border: "1px solid var(--border-color)", }}>
              <CropInfo />
            </div>

            {/* Growth 
            <div className="col-span-4 rounded-lg p-4 bg-(--card-bg)" style={{border: "1px solid var(--border-color)", }}>
              <GrowthTimeline />
            </div>*/}
          </main>
        </div>
      </div>
  );
}
