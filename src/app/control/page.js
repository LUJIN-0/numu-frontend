"use client";

import { useMemo, useState, useEffect } from "react";
import Layout from "@/layout/Layout";
import StagePicker from "./components/StagePicker";
import ModeSwitch from "./components/ModeSwitch";
import ThresholdBanner from "./components/ThresholdBanner";
import ActuatorCard from "./components/ActuatorCard";
import AlertStrip from "./components/AlertStrip";
import DeviceStatusList from "./components/DeviceStatusList";
import ControlEvents from "./components/ControlEvents";

import {
  GREENHOUSES,
  CROPS,
  INITIAL_STAGE,
  INITIAL_THRESHOLDS,
  INITIAL_ACTUATORS,
  INITIAL_ALERTS,
  DEVICES,
  MIN_ON_OFF_SEC,
} from "./data";

export default function ControlPanelPage() {
  // scope
  const [greenhouseId, setGreenhouseId] = useState(GREENHOUSES[0].id);
  const [stage, setStage] = useState(INITIAL_STAGE); // {crop, stage}
  const [mode, setMode] = useState("AUTO"); // AUTO | MANUAL
  const [thresholds, setThresholds] = useState(INITIAL_THRESHOLDS);
  const [actuators, setActuators] = useState(INITIAL_ACTUATORS);
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  // initialize lastChange on client to avoid hydration mismatch
  useEffect(() => {
    setActuators((prev) => ({
      fan: { ...prev.fan, lastChange: Date.now() - 1000 * 120 },
      ac: { ...prev.ac, lastChange: Date.now() - 1000 * 120 },
    }));
  }, []);

  const greenhouse = useMemo(
    () => GREENHOUSES.find((g) => g.id === greenhouseId),
    [greenhouseId]
  );

  const pushEvent = (type, message) =>
    setEvents((prev) => [
      { ts: new Date().toISOString(), type, message },
      ...prev.slice(0, 49),
    ]);

  const handleModeChange = (nextMode) => {
    if (nextMode !== "AUTO" && nextMode !== "MANUAL") return;
    setMode(nextMode);
    pushEvent("mode", `Mode set to ${nextMode}`);
  };

  const toggleActuator = (key) => {
    if (mode !== "MANUAL") {
      pushEvent("warning", `Cannot toggle ${key} in ${mode} mode`);
      return;
    }
    setActuators((prev) => {
      const now = Date.now();
      const current = prev[key];
      if (!current) return prev;

      const elapsed = Math.floor((now - current.lastChange) / 1000);
      if (elapsed < MIN_ON_OFF_SEC) {
        pushEvent(
          "warning",
          `${key} locked for ${MIN_ON_OFF_SEC - elapsed}s (minimum on/off window)`
        );
        return prev;
      }
      const next = {
        ...current,
        state: current.state === "ON" ? "OFF" : "ON",
        lastChange: now,
      };
      pushEvent("control", `${key} switched ${next.state}`);
      return { ...prev, [key]: next };
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <main className="p-6 grid grid-cols-12 gap-4">
          {/* Top controls */}
          <div className="col-span-12 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-gray-800">
                <StagePicker
                  greenhouses={GREENHOUSES}
                  greenhouseId={greenhouseId}
                  onGreenhouseChange={setGreenhouseId}
                  crops={CROPS}
                  stage={stage}
                  onStageChange={setStage}
                />
              </div>
              <ModeSwitch mode={mode} onChange={handleModeChange} />
            </div>
          </div>

          {/* Thresholds */}
          <div className="col-span-12 bg-white rounded-lg border border-gray-200 p-4">
            <ThresholdBanner
              thresholds={thresholds}
              stage={stage}
              onEdit={() =>
                alert("In MVP, thresholds are static. Hook your editor here.")
              }
            />
          </div>

          {/* Actuators row (Fans + AC only) */}
          <div className="col-span-12 grid md:grid-cols-2 grid-cols-1 gap-4">
            <ActuatorCard
              title="Fans"
              kind="fan"
              description="Ventilation to lower temperature and reduce humidity."
              state={actuators.fan?.state}
              lastChange={actuators.fan?.lastChange}
              minWindow={MIN_ON_OFF_SEC}
              disabled={mode !== "MANUAL"}
              onToggle={() => toggleActuator("fan")}
            />
            <ActuatorCard
              title="AC Unit"
              kind="ac"
              description="Cooling to reach the target temperature range."
              state={actuators.ac?.state}
              lastChange={actuators.ac?.lastChange}
              minWindow={MIN_ON_OFF_SEC}
              disabled={mode !== "MANUAL"}
              onToggle={() => toggleActuator("ac")}
            />
          </div>

          {/* Status row: Notifications + Device Health + Control Events */}
          <div className="col-span-12 grid md:grid-cols-3 grid-cols-1 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:col-span-1">
              <AlertStrip items={alerts} />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:col-span-1">
              <DeviceStatusList devices={DEVICES} />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:col-span-1">
              <ControlEvents events={events} />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
