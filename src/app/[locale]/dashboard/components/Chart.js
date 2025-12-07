'use client'

import React, { useState, useMemo, useEffect } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, ReferenceLine, ReferenceDot } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { useTranslations } from "next-intl"
import { getHistoricalAvg } from "@/components/greenhouse"
import { DayPicker } from "react-day-picker"
import 'react-day-picker/dist/style.css'

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

function truncate2(val) {
  if (val == null || isNaN(val)) return null
  return Math.trunc(val * 100) / 100
}

export default function Chart({ greenhouseId }) {
  const t = useTranslations("Dashboard")
  const [metric, setMetric] = useState("temp")
  const [interval, setInterval] = useState("Daily")
  const [range, setRange] = useState({ from: null, to: null })
  const [rangeOpen, setRangeOpen] = useState(false)
  const [tmpFrom, setTmpFrom] = useState(null)
  const [tmpTo, setTmpTo] = useState(null)
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

  const computeStartEndUTC = () => {
    const now = new Date()
    let from = range.from
    let to = range.to
    if (!from || !to) {
      const d = new Date(now)
      d.setDate(d.getDate() - 6)
      from = d
      to = now
    }
    const startUTC = new Date(Date.UTC(from.getFullYear(), from.getMonth(), from.getDate(), 0, 0, 0))
    // Fix: include the entire end day
    const endUTC = new Date(Date.UTC(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999))
    return { startUTC, endUTC }
  }

  useEffect(() => {
    if (!greenhouseId) return
    const fetchHistory = async () => {
      try {
        setLoading(true)
        setError("")
        const { startUTC, endUTC } = computeStartEndUTC()
        const granularity = interval === "Hourly" ? "hour" : "day"
        const raw = await getHistoricalAvg(greenhouseId, granularity, startUTC.toISOString(), endUTC.toISOString())
        if (!Array.isArray(raw)) { setData([]); return }
        const transformed = raw.map(entry => {
          const date = new Date(entry.timestamp)
          const label = interval === "Hourly" ? format(date, "d MMM HH:mm") : format(date, "d MMM")
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
      } finally { setLoading(false) }
    }
    fetchHistory()
  }, [greenhouseId, range.from, range.to, interval, metric])

  const todayLabel = useMemo(() => format(new Date(), interval === "Hourly" ? "d MMM HH:mm" : "d MMM"), [interval])
  const todayData = data.find(d => d.day === todayLabel)
  const allNull = data.length > 0 && !data.some(d => d.temp != null || d.humidity != null || d.barometer != null || d.gas != null)
  const rangeLabel = useMemo(() => {
    if (range.from && range.to) return `${format(range.from, "d MMM yyyy")} → ${format(range.to, "d MMM yyyy")}`
    const d = new Date(); const before = new Date(); before.setDate(d.getDate() - 6)
    return `${format(before, "d MMM yyyy")} → ${format(d, "d MMM yyyy")}`
  }, [range])

  const openRangeModal = () => { setTmpFrom(range.from); setTmpTo(range.to); setRangeOpen(true) }
  const applyPreset = (preset) => {
    const now = new Date(); let from, to
    if (preset === 'last7') { to = now; from = new Date(now); from.setDate(now.getDate() - 6) }
    else if (preset === 'last30') { to = now; from = new Date(now); from.setDate(now.getDate() - 29) }
    else if (preset === 'thisMonth') { from = startOfMonth(now); to = endOfMonth(now) }
    setTmpFrom(from); setTmpTo(to)
  }
  const tmpValid = tmpFrom && tmpTo && tmpTo >= tmpFrom

  return (
    <Card className="w-full transition-colors duration-300">
      <CardHeader className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-[200px]">
            <CardTitle className="text-base sm:text-lg font-light mb-1 sm:mb-0">{t('historical-data')}</CardTitle>
          </div>
          <div className="px-4 pb-2 text-xs flex flex-wrap items-center gap-3">
            <button onClick={openRangeModal} className="px-3 py-1 text-xs rounded border border-(--border-color) bg-(--header-input-bg) hover:bg-(--header-hover)">
              {t('set-range-date')}
            </button>
            <div className="text-xs text-(--muted-text)">{rangeLabel}</div>
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

        <RadioGroup value={metric} onValueChange={setMetric} className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {['temp','humidity','barometer','gas'].map(m => (
            <div className="flex items-center space-x-2" key={m}>
              <RadioGroupItem value={m} id={m} />
              <Label htmlFor={m} className="cursor-pointer">{t(m === 'gas' ? 'gas-resistance' : m)}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardHeader>

      <CardContent className="w-full h-52 sm:h-60 md:h-64 lg:h-72 xl:h-80 overflow-hidden relative">
        <div className="w-full h-full min-h-[250px]">
          {(!greenhouseId || loading) && <div className="w-full h-full flex items-center justify-center text-(--muted-text) text-sm">{t('loading-chart')}</div>}
          {error && !loading && <div className="w-full h-full flex items-center justify-center text-red-500 text-sm">{error}</div>}
          {!loading && !error && (data.length === 0 || allNull) && <div className="w-full h-full flex items-center justify-center text-(--muted-text) text-sm">{t('no-data-period')}</div>}

          {!loading && !error && data.length > 0 && !allNull && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 24, left: 16, bottom: 6 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={metricConfig.gradient} stopOpacity={0.5}/>
                    <stop offset="60%" stopColor={metricConfig.gradient} stopOpacity={0.18}/>
                    <stop offset="100%" stopColor={metricConfig.gradient} stopOpacity={0.06}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border-color)" strokeDasharray="3 3"/>
                <XAxis dataKey="day" axisLine={false} tickLine={false} padding={{left:10,right:10}} tick={{fill:"var(--muted-text)", fontSize:12}}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill:"var(--muted-text)", fontSize:12}}/>
                <Area type="monotone" dataKey={metric} stroke="transparent" fill="url(#areaGrad)" isAnimationActive={false}/>
                <Line type="monotone" dataKey={metric} stroke={metricConfig.color} strokeWidth={3} dot={false} activeDot={{r:6}} isAnimationActive={false}/>
                {todayData && <>
                  <ReferenceLine x={todayData.day} stroke="var(--border-color)" strokeWidth={1} strokeOpacity={0.8}/>
                  <ReferenceDot x={todayData.day} y={todayData[metric]} r={6} fill="var(--card-bg)" stroke={metricConfig.color} strokeWidth={3} isFront/>
                </>}
                <Tooltip content={<CustomTooltip unit={metricConfig.unit}/>} wrapperStyle={{outline:"none"}} cursor={false}/>
              </LineChart>
            </ResponsiveContainer>
          )}

          {rangeOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-(--card-bg) border border-(--border-color) rounded-lg w-full max-w-3xl mx-auto overflow-auto shadow-xl">
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-(--card-text)">{t('select-range')}</h3>
                      <p className="text-xs text-(--muted-text) mt-1">{t('select-range-helper')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setTmpFrom(null); setTmpTo(null)}} className="px-3 py-1 text-xs rounded border border-(--border-color) bg-(--header-input-bg) hover:bg-(--header-hover)">{t('clear')}</button>
                      <button onClick={() => setRangeOpen(false)} className="px-3 py-1 text-xs rounded border border-(--border-color) bg-(--header-input-bg) hover:bg-(--header-hover)">{t('close')}</button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-(--card-text) mb-2">{t('start-date')}</div>
                      <div className="border rounded-md p-2 overflow-auto max-h-[300px]">
                        <DayPicker mode="single" selected={tmpFrom || undefined} onSelect={d => setTmpFrom(d || null)} numberOfMonths={1}/>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-(--card-text) mb-2">{t('end-date')}</div>
                      <div className="border rounded-md p-2 overflow-auto max-h-[300px]">
                        <DayPicker mode="single" selected={tmpTo || undefined} onSelect={d => setTmpTo(d || null)} numberOfMonths={1}/>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="text-xs text-red-500">
                      {!tmpFrom || !tmpTo ? t('pick-both-dates') : (!tmpValid ? t('end-before-start') : '')}
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          if (!tmpFrom || !tmpTo) return
                          if (!tmpValid) return
                          setRange({ from: tmpFrom, to: tmpTo })
                          setRangeOpen(false)
                        }}
                        className={`px-3 py-1 text-sm rounded border border-(--border-color) ${tmpValid ? 'bg-(--sidebar-bg) text-white hover:opacity-90' : 'bg-(--header-input-bg) text-(--muted-text) cursor-not-allowed'}`}
                        disabled={!tmpValid}
                      >
                        {t('apply')}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </CardContent>
    </Card>
  )
}
