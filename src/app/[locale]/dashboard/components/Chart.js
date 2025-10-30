'use client'

import React, { useState, useMemo } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, ReferenceLine, ReferenceDot } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { eachDayOfInterval, eachHourOfInterval, eachWeekOfInterval, format, startOfMonth, endOfMonth } from "date-fns"
import { useTranslations } from 'next-intl';

function generateData(month, interval) {
  const year = new Date().getFullYear()
  const monthIndex = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(month)
  const start = startOfMonth(new Date(year, monthIndex)), end = endOfMonth(new Date(year, monthIndex))
  let dates = interval === "Hourly" ? eachHourOfInterval({ start, end }) : interval === "Weekly" ? eachWeekOfInterval({ start, end }) : eachDayOfInterval({ start, end })
  return dates.map((d, i) => ({
    day: format(d, interval === "Hourly" ? "d MMM HH:mm" : "d MMM"),
    temp: Math.round(15 + Math.sin(i * 0.5) * 8 + Math.random() * 5),
    humidity: Math.round(55 + Math.cos(i * 0.3) * 10 + Math.random() * 5),
    aqi: Math.round(25 + Math.sin(i * 0.2) * 10 + Math.random() * 5),
  }))
}

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  const value = payload[0].value
  return (
    <div className="rounded-lg p-3 shadow-md text-center min-w-[90px] border transition-colors duration-300 bg-(--card-bg) border-(--border-color) text-(--card-text)">
      <div className="text-xs mb-1 text-(--muted-text)">{label}</div>
      <div className="text-2xl font-semibold text-(--card-text)">{value}<span className="text-sm font-normal ml-1 text-(--muted-text)">{unit}</span></div>
    </div>
  )
}

export default function Chart() {
  const  t  = useTranslations('Dashboard');
  const [metric, setMetric] = useState("temp"), [interval, setInterval] = useState("Daily"), [month, setMonth] = useState("March")
  const metricConfig = useMemo(() => metric === "temp" ? { unit: "°C", color: "#b7791f", gradient: "#facc15" } :
    metric === "humidity" ? { unit: "% r.H", color: "#2f6b57", gradient: "#8bd19a" } : { unit: "", color: "#6b7280", gradient: "#c7c7c7" }, [metric])
  const data = useMemo(() => generateData(month, interval), [month, interval])

  const todayLabel = format(new Date(), interval === "Hourly" ? "d MMM HH:mm" : "d MMM")
  const todayData = data.find(d => d.day === todayLabel)

  return (
    <Card className="w-full transition-colors duration-300">
      <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-[200px]">
          <CardTitle className="text-base sm:text-lg font-light mb-2">{t('historical-data')}</CardTitle>
          <RadioGroup value={metric} onValueChange={setMetric} className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center space-x-2"><RadioGroupItem value="temp" id="temp" /><Label htmlFor="temp" className="cursor-pointer">{t('temp')}</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="humidity" id="humidity" /><Label htmlFor="humidity" className="cursor-pointer">{t('humedity')}</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="aqi" id="aqi" /><Label htmlFor="aqi" className="cursor-pointer">{t('aqi')}</Label></div>
          </RadioGroup>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Select value={interval} onValueChange={setInterval}><SelectTrigger className="w-[100px]"><SelectValue placeholder="Interval" /></SelectTrigger><SelectContent><SelectItem value="Daily">{t('daily')}</SelectItem>
            <SelectItem value="Hourly">{t('hourly')}</SelectItem><SelectItem value="Weekly">{t('weekly')}</SelectItem></SelectContent></Select>
          <Select value={month} onValueChange={setMonth}><SelectTrigger className="w-[110px]"><SelectValue placeholder="Month" />
          </SelectTrigger><SelectContent><SelectItem value="January">January</SelectItem><SelectItem value="February">February</SelectItem>
              <SelectItem value="March">March</SelectItem><SelectItem value="April">April</SelectItem><SelectItem value="May">May</SelectItem>
              <SelectItem value="June">June</SelectItem><SelectItem value="July">July</SelectItem><SelectItem value="August">August</SelectItem>
              <SelectItem value="September">September</SelectItem><SelectItem value="October">October</SelectItem>
              <SelectItem value="November">November</SelectItem><SelectItem value="December">December</SelectItem></SelectContent></Select>
        </div>
      </CardHeader>

      <CardContent className="w-full h-52 sm:h-60 md:h-64 lg:h-72 xl:h-80 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 24, left: 16, bottom: 6 }}>
            <defs><linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={metricConfig.gradient} stopOpacity={0.35} />
              <stop offset="60%" stopColor={metricConfig.gradient} stopOpacity={0.12} />
              <stop offset="100%" stopColor={metricConfig.gradient} stopOpacity={0.04} /></linearGradient></defs>
            <CartesianGrid vertical={false} stroke="var(--border-color)" strokeDasharray="3 3" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} tick={{ fill: "var(--muted-text)", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-text)", fontSize: 12 }} />
            <Area type="monotone" dataKey={metric} stroke="transparent" fill="url(#areaGrad)" isAnimationActive={false} />
            <Line type="monotone" dataKey={metric} stroke={metricConfig.color} strokeWidth={3} dot={false} activeDot={{ r: 6 }} isAnimationActive={false} />
            {todayData && <ReferenceLine x={todayData.day} stroke="var(--border-color)" strokeWidth={1} strokeOpacity={0.8} />}
            {todayData && <ReferenceDot x={todayData.day} y={todayData[metric]} r={6} fill="var(--card-bg)" stroke={metricConfig.color} strokeWidth={3} isFront />}
            <Tooltip content={<CustomTooltip unit={metricConfig.unit} />} wrapperStyle={{ outline: "none" }} cursor={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
