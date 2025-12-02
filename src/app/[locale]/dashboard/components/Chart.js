'use client'

import React, { useState, useMemo, useEffect } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, ReferenceLine, ReferenceDot } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { useTranslations } from "next-intl"
import { getHistoricalAvg } from "@/components/greenhouse"

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  const value = payload[0].value
  return (
    <div className="rounded-lg p-3 shadow-md text-center min-w-[90px] border transition-colors duration-300 bg-(--card-bg) border-(--border-color) text-(--card-text)">
      <div className="text-xs mb-1 text-(--muted-text)">{label}</div>
      <div className="text-2xl font-semibold text-(--card-text)">
        {value}
        <span className="text-sm font-normal ml-1 text-(--muted-text)">{unit}</span>
      </div>
    </div>
  )
}

// only two values after decimal
function truncate2(val) {
  if (val == null || isNaN(val)) return null
  return Math.trunc(val * 100) / 100
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function Chart({ greenhouseId }) {
  const t = useTranslations("Dashboard")
  const [metric, setMetric] = useState("temp"),
    [interval, setInterval] = useState("Daily"),
    [month, setMonth] = useState(MONTHS[new Date().getMonth()]),
    [dayStart, setDayStart] = useState("1"),
    [dayEnd, setDayEnd] = useState("31")

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const metricConfig = useMemo(
    () =>
      metric === "temp" ? { unit: "°C", color: "#b7791f", gradient: "#facc15" }
        : metric === "humidity" ? { unit: "% r.H", color: "#2f6b57", gradient: "#8bd19a" }
          : metric === "barometer" ? { unit: "hPa", color: "#4b5563", gradient: "#9ca3af" }
            : metric === "gas" ? { unit: "", color: "#b4491f", gradient: "#facc15" }
              : { unit: "", color: "#6b7280", gradient: "#c7c7c7" },
    [metric]
  )

  const dayOptions = useMemo(() => {
    const year = new Date().getFullYear()
    const monthIndex = MONTHS.indexOf(month)
    if (monthIndex === -1) return []
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => String(i + 1))
  }, [month])

  useEffect(() => {
    if (!dayOptions.length) return
    if (!dayOptions.includes(dayStart)) setDayStart("1")
    if (!dayOptions.includes(dayEnd)) setDayEnd(dayOptions[dayOptions.length - 1])
  }, [dayOptions, dayStart, dayEnd])

  useEffect(() => {
    if (!greenhouseId) return

    const fetchHistory = async () => {
      try {
        setLoading(true)
        setError("")

        const now = new Date()
        const year = now.getFullYear()
        const monthIndex = MONTHS.indexOf(month)
        if (monthIndex === -1) {
          setData([])
          return
        }

        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

        let startDay = parseInt(dayStart, 10)
        let endDay = parseInt(dayEnd, 10)

        if (isNaN(startDay) || startDay < 1) startDay = 1
        if (startDay > daysInMonth) startDay = daysInMonth

        if (isNaN(endDay) || endDay < startDay) endDay = startDay
        if (endDay > daysInMonth) endDay = daysInMonth

        const start = new Date(Date.UTC(year, monthIndex, startDay, 0, 0, 0))

        let end
        if (endDay === daysInMonth) {
          end = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0))
        } else {
          end = new Date(Date.UTC(year, monthIndex, endDay + 1, 0, 0, 0))
        }

        const granularity = interval === "Hourly" ? "hour" : "day"
        const startISO = start.toISOString()
        const endISO = end.toISOString()

        const raw = await getHistoricalAvg(greenhouseId, granularity, startISO, endISO)
        console.log("Historical avg raw:", raw)

        if (!Array.isArray(raw)) {
          setData([])
          return
        }

        const filtered = raw.filter((entry) => {
          const d = new Date(entry.timestamp)
          const m = d.getUTCMonth()
          const day = d.getUTCDate()
          return (
            m === monthIndex &&
            day >= startDay &&
            day <= endDay
          )
        })

        const transformed = filtered.map((entry) => {
          const date = new Date(entry.timestamp)
          const label =
            interval === "Hourly"
              ? format(date, "d MMM HH:mm")
              : format(date, "d MMM")

          const avgs = entry.averages || {}
          return {
            day: label,
            temp: avgs.temperature != null ? truncate2(avgs.temperature) : null,
            humidity: avgs.humidity != null ? truncate2(avgs.humidity) : null,
            barometer: avgs.barometer != null ? truncate2(avgs.barometer) : null,
            gas: avgs.gasResistance != null ? truncate2(avgs.gasResistance) : null
          }
        })

        setData(transformed)
      } catch (err) {
        console.error("Failed to load historical data:", err)
        setError("Failed to load historical data")
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [greenhouseId, month, interval, dayStart, dayEnd])

  const todayLabel = useMemo(() => {
    return format(
      new Date(),
      interval === "Hourly" ? "d MMM HH:mm" : "d MMM"
    )
  }, [interval])

  const todayData = data.find((d) => d.day === todayLabel)

  const allNull = data.length > 0 && data.every(
    (d) =>
      d.temp == null &&
      d.humidity == null &&
      d.barometer == null &&
      d.gas == null
  )

  return (
    <Card className="w-full transition-colors duration-300">
      <CardHeader className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-[200px]">
            <CardTitle className="text-base sm:text-lg font-light mb-1 sm:mb-0">
              {t('historical-data')}
            </CardTitle>
          </div>

          <div className="px-4 pb-2 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap items-center gap-2">

                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="w-[115px] h-8 text-xs">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={dayStart} onValueChange={setDayStart}>
                  <SelectTrigger className="w-[70px] h-8 text-xs">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={dayEnd} onValueChange={setDayEnd}>
                  <SelectTrigger className="w-[70px] h-8 text-xs">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vertical divider */}
              <div className="hidden md:block h-6 w-px bg-(--border-color)" />

              <div className="flex flex-wrap items-center gap-2">

                <Select value={interval} onValueChange={setInterval}>
                  <SelectTrigger className="w-[90px] h-8 text-xs">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">{t('daily')}</SelectItem>
                    <SelectItem value="Hourly">{t('hourly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <RadioGroup
          value={metric}
          onValueChange={setMetric}
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="temp" id="temp" />
            <Label htmlFor="temp" className="cursor-pointer">
              {t('temp')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="humidity" id="humidity" />
            <Label htmlFor="humidity" className="cursor-pointer">
              {t('humedity')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="barometer" id="barometer" />
            <Label htmlFor="barometer" className="cursor-pointer">
              {t('barometer')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gas" id="gas" />
            <Label htmlFor="gas" className="cursor-pointer">
              {t('gas-resistance')}
            </Label>
          </div>
        </RadioGroup>
      </CardHeader>


      <CardContent className="w-full h-52 sm:h-60 md:h-64 lg:h-72 xl:h-80 overflow-hidden">
        <div className="w-full h-full min-h-[250px]">
          {(!greenhouseId || loading) && (
            <div className="w-full h-full flex items-center justify-center text-(--muted-text) text-sm">
              {t('loading-chart')}
            </div>
          )}

          {error && !loading && (
            <div className="w-full h-full flex items-center justify-center text-red-500 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && (data.length === 0 || allNull) && (
            <div className="w-full h-full flex items-center justify-center text-(--muted-text) text-sm">
              {t('no-data-period')}
            </div>
          )}

          {!loading && !error && data.length > 0 && !allNull && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 24, left: 16, bottom: 6 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={metricConfig.gradient} stopOpacity={0.5} />
                    <stop offset="60%" stopColor={metricConfig.gradient} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={metricConfig.gradient} stopOpacity={0.06} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border-color)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  padding={{ left: 10, right: 10 }}
                  tick={{ fill: "var(--muted-text)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-text)", fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey={metric}
                  stroke="transparent"
                  fill="url(#areaGrad)"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey={metric}
                  stroke={metricConfig.color}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
                {todayData && (
                  <>
                    <ReferenceLine
                      x={todayData.day}
                      stroke="var(--border-color)"
                      strokeWidth={1}
                      strokeOpacity={0.8}
                    />
                    <ReferenceDot
                      x={todayData.day}
                      y={todayData[metric]}
                      r={6}
                      fill="var(--card-bg)"
                      stroke={metricConfig.color}
                      strokeWidth={3}
                      isFront
                    />
                  </>
                )}
                <Tooltip
                  content={<CustomTooltip unit={metricConfig.unit} />}
                  wrapperStyle={{ outline: "none" }}
                  cursor={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
