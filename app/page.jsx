"use client"

import { useState, useEffect, useRef } from 'react'
import {
  Shield, Clock, User, Activity, AlertTriangle, CheckCircle,
  Info, FileText, Download, Search, PlusCircle, TrendingUp,
  TrendingDown, Users, Scale, Building2, Banknote, FileBarChart,
  ChevronRight, Bell, BarChart3, Gavel, Briefcase, CircleDot,
  ArrowUpRight, ArrowDownRight, Layers, Database, Lock
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  LineChart, Line, Cell, Tooltip, Area, AreaChart,
  ComposedChart, ReferenceLine
} from 'recharts'

// INSTITUTIONAL LUXURY PALETTE - Swiss Government meets Bloomberg
const COLORS = {
  // Navy spectrum - deep institutional
  bg: '#040810',
  bgNavy: '#0A1628',
  card: '#0D1B2A',
  cardElevated: '#112240',
  border: '#1E3A5F',
  borderSubtle: '#162D50',

  // Gold spectrum - refined luxury
  gold: '#D4AF37',
  goldBright: '#F4D03F',
  goldMuted: '#9A7B4F',
  goldDim: '#6B5A3E',

  // Text hierarchy
  text: '#F0F4F8',
  textSecondary: '#B8C5D3',
  textMuted: '#6B7C93',
  textDim: '#4A5568',

  // Status colors - muted institutional
  red: '#C53030',
  redMuted: '#9B2C2C',
  amber: '#D69E2E',
  amberMuted: '#B7791F',
  green: '#2F855A',
  greenBright: '#48BB78',
  blue: '#2B6CB0',
  blueBright: '#4299E1',
}

// Animated counter hook with easing
function useAnimatedCounter(end, duration = 2000, decimals = 0) {
  const [count, setCount] = useState(0)
  const countRef = useRef(null)

  useEffect(() => {
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Cubic ease out for luxury feel
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(end * eased)
      if (progress < 1) {
        countRef.current = requestAnimationFrame(animate)
      }
    }
    countRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(countRef.current)
  }, [end, duration])

  return decimals > 0 ? count.toFixed(decimals) : Math.floor(count)
}

// Circular progress - refined
function CircularProgress({ percentage, size = 56, strokeWidth = 4 }) {
  const [progress, setProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 300)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={COLORS.borderSubtle}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={COLORS.gold}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="square"
        style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    </svg>
  )
}

// Mini sparkline - Bloomberg style
function Sparkline({ data, width = 72, height = 20, color = COLORS.gold }) {
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    setTimeout(() => setDrawn(true), 400)
  }, [])

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.8s' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <circle
        cx={width}
        cy={parseFloat(points.split(' ').pop().split(',')[1])}
        r="2"
        fill={color}
      />
    </svg>
  )
}

// Data bar - Swiss precision
function DataBar({ value, max, color = COLORS.gold, height = 6 }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setTimeout(() => setWidth((value / max) * 100), 200)
  }, [value, max])

  return (
    <div style={{
      width: '100%',
      height,
      backgroundColor: COLORS.borderSubtle,
    }}>
      <div style={{
        height: '100%',
        width: `${width}%`,
        backgroundColor: color,
        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }} />
    </div>
  )
}

// KPI Card - Institutional
function KPICard({ icon: Icon, label, value, prefix = '', suffix = '', subtext, trend, trendValue, sparklineData, progress, decimals = 0, highlight }) {
  const animatedValue = useAnimatedCounter(parseFloat(value?.toString().replace(/,/g, '') || 0), 2000, decimals)

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <div style={{
      backgroundColor: COLORS.card,
      borderLeft: highlight ? `2px solid ${COLORS.gold}` : `1px solid ${COLORS.border}`,
      borderTop: `1px solid ${COLORS.border}`,
      borderRight: `1px solid ${COLORS.border}`,
      borderBottom: `1px solid ${COLORS.border}`,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      position: 'relative',
    }}>
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon size={12} color={COLORS.goldMuted} strokeWidth={1.5} />
          <span style={{
            fontSize: '9px',
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            fontWeight: '500',
          }}>
            {label}
          </span>
        </div>
        {sparklineData && <Sparkline data={sparklineData} width={48} height={16} />}
      </div>

      {/* Value row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
        {progress !== undefined ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', width: 48, height: 48 }}>
              <CircularProgress percentage={progress} size={48} strokeWidth={3} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '11px',
                fontWeight: '600',
                color: COLORS.gold,
                fontFamily: 'var(--font-inter), monospace',
              }}>
                {progress}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: COLORS.textMuted }}>de $443.1M</div>
              <div style={{ fontSize: '10px', color: COLORS.textSecondary }}>$324.4M ejecutado</div>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              fontSize: '22px',
              fontWeight: '600',
              color: COLORS.text,
              fontFamily: 'var(--font-inter), monospace',
              letterSpacing: '-0.5px',
              lineHeight: 1,
            }}>
              {prefix}{decimals > 0 ? formatNumber(animatedValue) : formatNumber(Math.floor(animatedValue))}{suffix}
            </div>
            {trend && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '10px',
                marginBottom: '2px',
              }}>
                {trend === 'up' ? (
                  <ArrowUpRight size={12} color={COLORS.greenBright} strokeWidth={2} />
                ) : (
                  <ArrowDownRight size={12} color={trend === 'down-good' ? COLORS.greenBright : COLORS.red} strokeWidth={2} />
                )}
                <span style={{
                  color: trend === 'up' || trend === 'down-good' ? COLORS.greenBright : COLORS.red,
                  fontWeight: '600',
                }}>
                  {trendValue}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {subtext && (
        <div style={{ fontSize: '9px', color: COLORS.textDim, marginTop: '2px' }}>
          {subtext}
        </div>
      )}
    </div>
  )
}

// Budget data - REAL CSJ FIGURES
const budgetData = [
  { name: 'Remuneraciones', executed: 273.6, approved: 273.6, pct: 100 },
  { name: 'Bienes y Servicios', executed: 72.3, approved: 99.0, pct: 73 },
  { name: 'Inversiones', executed: 8.1, approved: 15.2, pct: 53 },
  { name: 'Transferencias', executed: 41.2, approved: 55.3, pct: 74.5 },
]

// Circuit performance data
const circuitData = [
  { name: 'San Salvador', cases: 12847, resolved: 8864, efficiency: 69, pending: 3983, avgDays: 127, alert: 'HIGH' },
  { name: 'Santa Ana', cases: 4521, resolved: 3436, efficiency: 76, pending: 1085, avgDays: 89, alert: 'MEDIUM' },
  { name: 'San Miguel', cases: 3892, resolved: 2763, efficiency: 71, pending: 1129, avgDays: 112, alert: 'HIGH' },
  { name: 'La Libertad', cases: 3201, resolved: 2465, efficiency: 77, pending: 736, avgDays: 84, alert: 'LOW' },
  { name: 'Sonsonate', cases: 2156, resolved: 1595, efficiency: 74, pending: 561, avgDays: 95, alert: 'MEDIUM' },
  { name: 'Usulután', cases: 1843, resolved: 1327, efficiency: 72, pending: 516, avgDays: 103, alert: 'MEDIUM' },
  { name: 'La Paz', cases: 1654, resolved: 1307, efficiency: 79, pending: 347, avgDays: 78, alert: 'LOW' },
  { name: 'Ahuachapán', cases: 1203, resolved: 974, efficiency: 81, pending: 229, avgDays: 71, alert: 'LOW' },
  { name: 'Chalatenango', cases: 987, resolved: 819, efficiency: 83, pending: 168, avgDays: 65, alert: 'LOW' },
  { name: 'Cabañas', cases: 731, resolved: 570, efficiency: 78, pending: 161, avgDays: 82, alert: 'LOW' },
]

// Alerts
const alertsData = [
  { type: 'critical', label: 'CRÍTICO', time: '14:23', message: 'Juzgado 2° Civil San Salvador — mora >180 días en 23 expedientes. Requiere intervención inmediata.', code: 'MOR-2847' },
  { type: 'warning', label: 'ADVERTENCIA', time: '11:45', message: 'Ejecución Bienes y Servicios 73% — proyección sub-ejecución Q1. Revisar compromisos pendientes.', code: 'PRE-1203' },
  { type: 'warning', label: 'ADVERTENCIA', time: '09:12', message: '478 plazas vacantes (5.4%). Circuitos San Miguel, Usulután, Santa Ana por debajo del 90% dotación.', code: 'RH-0456' },
  { type: 'success', label: 'CUMPLIMIENTO', time: 'Ayer', message: 'Ley de Ciberseguridad 2024 — auditoría externa programada 15 Mar 2026. Documentación lista.', code: 'SEC-0089' },
  { type: 'success', label: 'CUMPLIMIENTO', time: 'Ayer', message: 'COMPRASAL — 47 procesos activos, 0 observaciones. Cumplimiento normativo 100%.', code: 'ADQ-0312' },
  { type: 'info', label: 'SISTEMA', time: '2 días', message: 'Informe trimestral Corte Plena — borrador generado automáticamente. Pendiente revisión.', code: 'INF-0078' },
]

// Mora trend - 12 months
const moraTrendData = [
  { month: 'Mar', value: 34.2, cases: 28450 },
  { month: 'Abr', value: 33.1, cases: 27890 },
  { month: 'May', value: 32.5, cases: 27420 },
  { month: 'Jun', value: 31.8, cases: 26850 },
  { month: 'Jul', value: 31.0, cases: 26310 },
  { month: 'Ago', value: 30.2, cases: 25780 },
  { month: 'Sep', value: 29.7, cases: 25340 },
  { month: 'Oct', value: 29.1, cases: 24890 },
  { month: 'Nov', value: 28.4, cases: 24350 },
  { month: 'Dic', value: 28.0, cases: 24010 },
  { month: 'Ene', value: 27.8, cases: 23780 },
  { month: 'Feb', value: 27.3, cases: 23420, projected: true },
]

// Monthly execution data
const monthlyExecutionData = [
  { month: 'Ene', executed: 35.2, projected: 36.9 },
  { month: 'Feb', executed: 37.8, projected: 36.9 },
  { month: 'Mar', executed: 38.1, projected: 36.9 },
  { month: 'Abr', executed: 36.4, projected: 36.9 },
  { month: 'May', executed: 35.9, projected: 36.9 },
  { month: 'Jun', executed: 38.7, projected: 36.9 },
  { month: 'Jul', executed: 37.2, projected: 36.9 },
  { month: 'Ago', executed: 36.8, projected: 36.9 },
  { month: 'Sep', executed: 35.1, projected: 36.9 },
  { month: 'Oct', executed: null, projected: 36.9 },
  { month: 'Nov', executed: null, projected: 36.9 },
  { month: 'Dic', executed: null, projected: 36.9 },
]

export default function PanelEjecutivo() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [consultasHoy, setConsultasHoy] = useState(487)
  const [alertsVisible, setAlertsVisible] = useState([])
  const [selectedCircuit, setSelectedCircuit] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setConsultasHoy(prev => prev + Math.floor(Math.random() * 2))
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    alertsData.forEach((_, i) => {
      setTimeout(() => setAlertsVisible(prev => [...prev, i]), 300 + i * 120)
    })
  }, [])

  const formatDate = (date) => {
    return date.toLocaleDateString('es-SV', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).toUpperCase()
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-SV', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return COLORS.red
      case 'warning': return COLORS.amber
      case 'success': return COLORS.green
      case 'info': return COLORS.blue
      default: return COLORS.textMuted
    }
  }

  const getEfficiencyColor = (eff) => {
    if (eff < 70) return COLORS.red
    if (eff < 76) return COLORS.amber
    return COLORS.green
  }

  const getAlertBadge = (alert) => {
    const styles = {
      HIGH: { bg: 'rgba(197, 48, 48, 0.15)', color: COLORS.red, border: COLORS.redMuted },
      MEDIUM: { bg: 'rgba(214, 158, 46, 0.15)', color: COLORS.amber, border: COLORS.amberMuted },
      LOW: { bg: 'rgba(47, 133, 90, 0.15)', color: COLORS.green, border: COLORS.green },
    }
    return styles[alert]
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: COLORS.bg,
      color: COLORS.text,
      fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif',
      display: 'grid',
      gridTemplateRows: '48px auto 1fr 160px 24px',
      overflow: 'hidden',
    }}>
      {/* TOP BAR - Minimal, institutional */}
      <header style={{
        backgroundColor: COLORS.bgNavy,
        borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            backgroundColor: COLORS.gold,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Scale size={16} color={COLORS.bgNavy} strokeWidth={2} />
          </div>
          <div style={{ borderLeft: `1px solid ${COLORS.border}`, paddingLeft: '12px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              color: COLORS.text,
            }}>
              PANEL DE INTELIGENCIA INSTITUCIONAL
            </div>
            <div style={{
              fontSize: '9px',
              color: COLORS.textMuted,
              letterSpacing: '1.5px',
              marginTop: '1px',
            }}>
              ÓRGANO JUDICIAL DE EL SALVADOR
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* System status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '6px',
              height: '6px',
              backgroundColor: COLORS.greenBright,
              animation: 'pulse 2s infinite',
            }} />
            <span style={{
              fontSize: '9px',
              color: COLORS.greenBright,
              letterSpacing: '1px',
              fontWeight: '500',
            }}>
              OPERATIVO
            </span>
          </div>

          {/* Date/Time */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            paddingLeft: '16px',
            borderLeft: `1px solid ${COLORS.border}`,
          }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '9px', color: COLORS.textMuted, letterSpacing: '0.5px' }}>
                {formatDate(currentTime)}
              </div>
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: 'monospace',
              color: COLORS.gold,
              letterSpacing: '1px',
            }}>
              {formatTime(currentTime)}
            </div>
          </div>

          {/* User */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingLeft: '16px',
            borderLeft: `1px solid ${COLORS.border}`,
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              backgroundColor: COLORS.cardElevated,
              border: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User size={14} color={COLORS.textSecondary} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '500', color: COLORS.text }}>
                LIC. J. CHAVEZ H.
              </div>
              <div style={{ fontSize: '8px', color: COLORS.textMuted, letterSpacing: '0.5px' }}>
                GERENCIA GENERAL
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* KPI ROW - 6 columns, dense */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '1px',
        padding: '12px 20px',
        backgroundColor: COLORS.bg,
      }}>
        <KPICard
          icon={Banknote}
          label="Presupuesto 2024"
          value="443069655"
          prefix="$"
          subtext="Reducido de $472.9M preliminar"
          sparklineData={[472.9, 465, 458, 450, 448, 445, 443.1]}
          highlight
        />
        <KPICard
          icon={BarChart3}
          label="Ejecución Presupuestaria"
          progress={73.2}
        />
        <KPICard
          icon={FileText}
          label="Expedientes Activos"
          value="26617"
          trend="up"
          trendValue="+2.1%"
          subtext="vs. mes anterior"
        />
        <KPICard
          icon={AlertTriangle}
          label="Mora Judicial"
          value="27.8"
          suffix="%"
          decimals={1}
          trend="down-good"
          trendValue="-3.2%"
          subtext="23,780 casos en mora"
        />
        <KPICard
          icon={Users}
          label="Personal Activo"
          value="8412"
          suffix=""
          subtext="de 8,890 plazas (94.6%)"
          sparklineData={[8250, 8310, 8340, 8380, 8395, 8405, 8412]}
        />
        <KPICard
          icon={Activity}
          label="Consultas Hoy"
          value={consultasHoy}
          trend="up"
          trendValue="EN VIVO"
          subtext="Portal ciudadano"
        />
      </div>

      {/* MAIN CONTENT - 3 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr 0.9fr',
        gap: '12px',
        padding: '0 20px',
        minHeight: 0,
      }}>
        {/* LEFT: Budget Execution */}
        <div style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px 12px',
            borderBottom: `1px solid ${COLORS.borderSubtle}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h3 style={{
                fontSize: '10px',
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                margin: 0,
                fontWeight: '500',
              }}>
                Ejecución por Rubro
              </h3>
              <div style={{ fontSize: '9px', color: COLORS.textDim, marginTop: '2px' }}>
                Año fiscal 2024 — Corte al {formatDate(currentTime)}
              </div>
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: COLORS.gold,
              fontFamily: 'monospace',
            }}>
              $324.4M
            </div>
          </div>

          <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {budgetData.map((item, i) => (
              <div key={item.name}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                  alignItems: 'baseline',
                }}>
                  <span style={{ fontSize: '11px', color: COLORS.text, fontWeight: '500' }}>
                    {item.name}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '10px', color: COLORS.textMuted }}>
                      ${item.executed}M
                    </span>
                    <span style={{ fontSize: '9px', color: COLORS.textDim }}>
                      / ${item.approved}M
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: item.pct >= 95 ? COLORS.greenBright : item.pct >= 70 ? COLORS.gold : COLORS.amber,
                      fontWeight: '600',
                      fontFamily: 'monospace',
                      width: '36px',
                      textAlign: 'right',
                    }}>
                      {item.pct}%
                    </span>
                  </div>
                </div>
                <DataBar
                  value={item.pct}
                  max={100}
                  color={item.pct >= 95 ? COLORS.greenBright : item.pct >= 70 ? COLORS.gold : COLORS.amber}
                  height={8}
                />
              </div>
            ))}
          </div>

          {/* Mini chart */}
          <div style={{
            padding: '12px 16px',
            borderTop: `1px solid ${COLORS.borderSubtle}`,
            height: '100px',
          }}>
            <div style={{ fontSize: '9px', color: COLORS.textMuted, marginBottom: '8px', letterSpacing: '0.5px' }}>
              EJECUCIÓN MENSUAL (MILLONES USD)
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <ComposedChart data={monthlyExecutionData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Bar dataKey="executed" fill={COLORS.gold} />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke={COLORS.textMuted}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CENTER: Circuit Performance Table */}
        <div style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px 12px',
            borderBottom: `1px solid ${COLORS.borderSubtle}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h3 style={{
                fontSize: '10px',
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                margin: 0,
                fontWeight: '500',
              }}>
                Rendimiento por Circuito Judicial
              </h3>
              <div style={{ fontSize: '9px', color: COLORS.textDim, marginTop: '2px' }}>
                10 circuitos · 26,617 expedientes activos
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '9px' }}>
              <span style={{ color: COLORS.red }}>● {'<'}70%</span>
              <span style={{ color: COLORS.amber }}>● 70-75%</span>
              <span style={{ color: COLORS.greenBright }}>● {'>'}75%</span>
            </div>
          </div>

          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 65px 65px 55px 50px 55px',
            gap: '8px',
            padding: '10px 16px',
            fontSize: '8px',
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            borderBottom: `1px solid ${COLORS.borderSubtle}`,
            backgroundColor: COLORS.bgNavy,
          }}>
            <span>Circuito</span>
            <span style={{ textAlign: 'right' }}>Activos</span>
            <span style={{ textAlign: 'right' }}>Resueltos</span>
            <span style={{ textAlign: 'center' }}>Efic.</span>
            <span style={{ textAlign: 'right' }}>Días Ø</span>
            <span style={{ textAlign: 'center' }}>Estado</span>
          </div>

          {/* Table body */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {circuitData.map((circuit, i) => (
              <div
                key={circuit.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 65px 65px 55px 50px 55px',
                  gap: '8px',
                  padding: '10px 16px',
                  borderBottom: `1px solid ${COLORS.borderSubtle}`,
                  alignItems: 'center',
                  fontSize: '11px',
                  backgroundColor: selectedCircuit === i ? COLORS.cardElevated : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={() => setSelectedCircuit(i)}
                onMouseLeave={() => setSelectedCircuit(null)}
              >
                <span style={{ color: COLORS.text, fontWeight: '500' }}>
                  {circuit.name}
                </span>
                <span style={{ textAlign: 'right', color: COLORS.textSecondary, fontFamily: 'monospace' }}>
                  {circuit.cases.toLocaleString()}
                </span>
                <span style={{ textAlign: 'right', color: COLORS.textMuted, fontFamily: 'monospace' }}>
                  {circuit.resolved.toLocaleString()}
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}>
                  <div style={{
                    width: '32px',
                    height: '3px',
                    backgroundColor: COLORS.borderSubtle,
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${circuit.efficiency}%`,
                      backgroundColor: getEfficiencyColor(circuit.efficiency),
                    }} />
                  </div>
                  <span style={{
                    fontSize: '10px',
                    color: getEfficiencyColor(circuit.efficiency),
                    fontWeight: '600',
                    fontFamily: 'monospace',
                  }}>
                    {circuit.efficiency}
                  </span>
                </div>
                <span style={{
                  textAlign: 'right',
                  color: circuit.avgDays > 100 ? COLORS.amber : COLORS.textMuted,
                  fontFamily: 'monospace',
                  fontSize: '10px',
                }}>
                  {circuit.avgDays}
                </span>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '8px',
                    padding: '2px 6px',
                    backgroundColor: getAlertBadge(circuit.alert).bg,
                    color: getAlertBadge(circuit.alert).color,
                    border: `1px solid ${getAlertBadge(circuit.alert).border}`,
                    letterSpacing: '0.5px',
                    fontWeight: '600',
                  }}>
                    {circuit.alert}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary footer */}
          <div style={{
            padding: '10px 16px',
            borderTop: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.bgNavy,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '9px',
          }}>
            <span style={{ color: COLORS.textMuted }}>
              TOTAL: <span style={{ color: COLORS.text, fontWeight: '600' }}>26,617</span> activos ·
              <span style={{ color: COLORS.greenBright, fontWeight: '600' }}> 18,120</span> resueltos
            </span>
            <span style={{ color: COLORS.gold }}>
              Eficiencia promedio: 75.8%
            </span>
          </div>
        </div>

        {/* RIGHT: Alerts */}
        <div style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px 12px',
            borderBottom: `1px solid ${COLORS.borderSubtle}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h3 style={{
                fontSize: '10px',
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                margin: 0,
                fontWeight: '500',
              }}>
                Alertas y Cumplimiento
              </h3>
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              fontSize: '9px',
            }}>
              <span style={{
                color: COLORS.red,
                backgroundColor: 'rgba(197, 48, 48, 0.15)',
                padding: '2px 6px',
              }}>1</span>
              <span style={{
                color: COLORS.amber,
                backgroundColor: 'rgba(214, 158, 46, 0.15)',
                padding: '2px 6px',
              }}>2</span>
              <span style={{
                color: COLORS.greenBright,
                backgroundColor: 'rgba(47, 133, 90, 0.15)',
                padding: '2px 6px',
              }}>2</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {alertsData.map((alert, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 12px',
                  marginBottom: '6px',
                  backgroundColor: COLORS.bgNavy,
                  border: `1px solid ${COLORS.borderSubtle}`,
                  borderLeft: `2px solid ${getAlertColor(alert.type)}`,
                  opacity: alertsVisible.includes(i) ? 1 : 0,
                  transform: alertsVisible.includes(i) ? 'translateX(0)' : 'translateX(-8px)',
                  transition: 'all 0.3s ease-out',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '8px',
                      color: getAlertColor(alert.type),
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                    }}>
                      {alert.label}
                    </span>
                    <span style={{
                      fontSize: '8px',
                      color: COLORS.textDim,
                      fontFamily: 'monospace',
                    }}>
                      {alert.code}
                    </span>
                  </div>
                  <span style={{ fontSize: '8px', color: COLORS.textDim }}>
                    {alert.time}
                  </span>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '10px',
                  color: COLORS.textSecondary,
                  lineHeight: '1.4',
                }}>
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW - 4 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1.2fr 0.8fr',
        gap: '12px',
        padding: '12px 20px',
      }}>
        {/* Procurement */}
        <div style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          padding: '14px 16px',
        }}>
          <div style={{
            fontSize: '9px',
            color: COLORS.textMuted,
            letterSpacing: '1px',
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>CONTRATACIÓN ACTIVA</span>
            <span style={{ color: COLORS.greenBright }}>COMPRASAL 100%</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, fontFamily: 'monospace' }}>47</div>
              <div style={{ fontSize: '8px', color: COLORS.textMuted }}>Procesos</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: COLORS.gold, fontFamily: 'monospace' }}>$12.4M</div>
              <div style={{ fontSize: '8px', color: COLORS.textMuted }}>En proceso</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, fontFamily: 'monospace' }}>156</div>
              <div style={{ fontSize: '8px', color: COLORS.textMuted }}>Proveedores</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, fontFamily: 'monospace' }}>0</div>
              <div style={{ fontSize: '8px', color: COLORS.textMuted }}>Observaciones</div>
            </div>
          </div>
        </div>

        {/* HR Summary */}
        <div style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          padding: '14px 16px',
        }}>
          <div style={{
            fontSize: '9px',
            color: COLORS.textMuted,
            letterSpacing: '1px',
            marginBottom: '12px',
          }}>
            RECURSOS HUMANOS
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, fontFamily: 'monospace' }}>8,412</div>
              <div style={{ fontSize: '8px', color: COLORS.textMuted }}>Activos</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: COLORS.amber, fontFamily: 'monospace' }}>478</div>
              <div style={{ fontSize: '8px', color: COLORS.textMuted }}>Vacantes</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, fontFamily: 'monospace' }}>94.6%</div>
              <div style={{ fontSize: '8px', color: COLORS.textMuted }}>Dotación</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: COLORS.greenBright, fontFamily: 'monospace' }}>97.2%</div>
              <div style={{ fontSize: '8px', color: COLORS.textMuted }}>Asistencia</div>
            </div>
          </div>
        </div>

        {/* Mora Trend */}
        <div style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          padding: '14px 16px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '9px', color: COLORS.textMuted, letterSpacing: '1px' }}>
              TENDENCIA MORA JUDICIAL — 12 MESES
            </span>
            <span style={{ fontSize: '11px', color: COLORS.greenBright, fontWeight: '600' }}>
              ▼ 6.9%
            </span>
          </div>

          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={moraTrendData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="moraGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.gold} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={COLORS.gold} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={COLORS.gold}
                strokeWidth={2}
                fill="url(#moraGradient)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: COLORS.cardElevated,
                  border: `1px solid ${COLORS.border}`,
                  fontSize: '10px',
                  padding: '6px 10px',
                }}
                labelStyle={{ color: COLORS.textMuted, marginBottom: '4px' }}
                itemStyle={{ color: COLORS.gold }}
                formatter={(value, name, props) => [
                  `${value}% (${props.payload.cases.toLocaleString()} casos)`,
                  'Mora'
                ]}
              />
            </AreaChart>
          </ResponsiveContainer>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '8px',
            color: COLORS.textDim,
            marginTop: '4px',
          }}>
            <span>MAR 2025</span>
            <span style={{ color: COLORS.textMuted }}>Reducción: 28,450 → 23,420 casos</span>
            <span>FEB 2026</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          padding: '14px 16px',
        }}>
          <div style={{
            fontSize: '9px',
            color: COLORS.textMuted,
            letterSpacing: '1px',
            marginBottom: '10px',
          }}>
            ACCIONES RÁPIDAS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { icon: FileBarChart, label: 'Informe Corte Plena' },
              { icon: Download, label: 'Exportar PAO' },
              { icon: Search, label: 'Auditoría' },
              { icon: PlusCircle, label: 'Nuevo COMPRASAL' },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  backgroundColor: COLORS.bgNavy,
                  border: `1px solid ${COLORS.borderSubtle}`,
                  color: COLORS.textSecondary,
                  cursor: 'pointer',
                  fontSize: '10px',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = COLORS.gold
                  e.currentTarget.style.color = COLORS.text
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = COLORS.borderSubtle
                  e.currentTarget.style.color = COLORS.textSecondary
                }}
              >
                <Icon size={12} color={COLORS.goldMuted} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: COLORS.bgNavy,
        borderTop: `1px solid ${COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        fontSize: '8px',
        color: COLORS.textDim,
        letterSpacing: '0.5px',
      }}>
        <span>ÓRGANO JUDICIAL DE EL SALVADOR</span>
        <span style={{ color: COLORS.borderSubtle }}>|</span>
        <span>PANEL DE INTELIGENCIA INSTITUCIONAL v2.1</span>
        <span style={{ color: COLORS.borderSubtle }}>|</span>
        <span>DATOS: {formatTime(currentTime)}</span>
        <span style={{ color: COLORS.borderSubtle }}>|</span>
        <span style={{ opacity: 0.6 }}>MACHINEMIND AI INFRASTRUCTURE</span>
      </footer>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        ::-webkit-scrollbar {
          width: 3px;
        }

        ::-webkit-scrollbar-track {
          background: ${COLORS.bg};
        }

        ::-webkit-scrollbar-thumb {
          background: ${COLORS.borderSubtle};
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${COLORS.goldDim};
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
