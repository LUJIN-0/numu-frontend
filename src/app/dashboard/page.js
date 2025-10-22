'use client'

import Layout from "@/layout/Layout";
import StatCard from "./components/StatCard";
import Alerts from "./components/Alerts";
import Chart from "./components/Chart";
import LocationMap from "./components/LocationMap";
import CropInfo from "./components/CropInfo";
import GrowthTimeline from "./components/GrowthTimeline";
import { Thermometer, Droplet, AirVent } from "lucide-react";

export default function DashboardPage() {
  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50">

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="p-6 grid grid-cols-12 gap-4">
            {/* Stats (hardcoded dummy data) */}
            <StatCard
              title="Temperature"
              value="18°C"
              max={100}
              icon={<Thermometer size={16} className="text-gray-600" />}
            />
            <StatCard
              title="Humidity"
              value="70% r.H"
              max={100}
              icon={<Droplet size={16} className="text-gray-600" />}
            />
            <StatCard
              title="AQI"
              value="32"
              max={100}
              icon={<AirVent size={16} className="text-gray-600" />}
            />

            {/* Chart */}
            <div className="col-span-8 bg-white rounded-lg p-4 border border-gray-300">
              <Chart />
            </div>

            {/* Alerts */}
            <div className="col-span-4 bg-white rounded-lg p-4 border border-gray-300">
              <Alerts />
            </div>

            {/* Location */}
            <div className="col-span-4 bg-white rounded-lg p-4 border border-gray-300">
              <LocationMap />
            </div>

            {/* Crop Info */}
            <div className="col-span-4 bg-white rounded-lg p-4 border border-gray-300">
              <CropInfo />
            </div>

            {/* Growth */}
            <div className="col-span-4 bg-white rounded-lg p-4 border border-gray-300">
              <GrowthTimeline />
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
