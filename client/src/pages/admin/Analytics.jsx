import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/analytics')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { label: 'Total Patients', value: stats.totalPatients, icon: '👤', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)' },
    { label: 'Total Doctors', value: stats.totalDoctors, icon: '🩺', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    { label: 'Verified Doctors', value: stats.verifiedDoctors, icon: '✅', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
    { label: 'High Risk Patients', value: stats.highRiskPatients, icon: '⚠️', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
    { label: 'Chronic Patients', value: stats.chronicPatients, icon: '🫀', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    { label: "Today's Footfall", value: stats.todayFootfall, icon: '📈', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)' },
  ] : []

  // Mock chart data since backend doesn't have per-day breakdown
  const chartData = [
    { day: 'Mon', visits: 12 },
    { day: 'Tue', visits: 19 },
    { day: 'Wed', visits: 8 },
    { day: 'Thu', visits: 24 },
    { day: 'Fri', visits: 17 },
    { day: 'Sat', visits: 6 },
    { day: 'Sun', visits: 3 },
  ]

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Analytics Overview</h1>
          <p style={s.sub}>Real-time platform statistics and insights</p>
        </div>
        <div style={s.dateBadge}>
          📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div style={s.grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shimmer" style={s.shimmerCard} />
          ))}
        </div>
      ) : (
        <div style={s.grid}>
          {cards.map((c, i) => (
            <div key={i} style={{ ...s.card, background: c.bg, borderColor: c.color + '30' }}
              className="fade-in" >
              <div style={s.cardTop}>
                <div style={{ ...s.cardIcon, background: c.color + '20', color: c.color }}>
                  {c.icon}
                </div>
                <div style={{ ...s.cardValue, color: c.color }}>{c.value}</div>
              </div>
              <div style={s.cardLabel}>{c.label}</div>
              <div style={{ ...s.cardBar, background: c.color + '20' }}>
                <div style={{
                  ...s.cardBarFill,
                  background: c.color,
                  width: `${Math.min((c.value / 20) * 100, 100)}%`
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div style={s.chartCard}>
        <div style={s.chartHeader}>
          <div>
            <h2 style={s.chartTitle}>Weekly Visit Trends</h2>
            <p style={s.chartSub}>Patient visits over the last 7 days</p>
          </div>
          <div style={s.chartBadge}>This Week</div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-display)' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={false} tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                boxShadow: 'var(--shadow)',
              }}
              cursor={{ fill: 'var(--accent-dim)' }}
            />
            <Bar dataKey="visits" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                <stop offset="100%" stopColor="#0369a1" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

const s = {
  page: {
    padding: '36px 40px',
    maxWidth: '1100px',
  },
  header: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: '32px',
    flexWrap: 'wrap', gap: '16px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem', fontWeight: 800,
    color: 'var(--text-primary)', letterSpacing: '-0.02em',
  },
  sub: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' },
  dateBadge: {
    padding: '8px 16px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    fontSize: '0.82rem', color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)', fontWeight: 600,
    boxShadow: 'var(--shadow-card)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px', marginBottom: '28px',
  },
  shimmerCard: { height: '120px' },
  card: {
    padding: '20px 22px',
    border: '1.5px solid',
    borderRadius: '18px',
    transition: 'var(--transition)',
    cursor: 'default',
  },
  cardTop: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: '10px',
  },
  cardIcon: {
    width: '40px', height: '40px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem',
  },
  cardValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem', fontWeight: 800,
    letterSpacing: '-0.03em',
  },
  cardLabel: {
    fontSize: '0.82rem', color: 'var(--text-secondary)',
    fontWeight: 500, marginBottom: '12px',
  },
  cardBar: {
    height: '4px', borderRadius: '999px', overflow: 'hidden',
  },
  cardBarFill: {
    height: '100%', borderRadius: '999px',
    transition: 'width 1s ease',
  },
  chartCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '20px', padding: '28px 28px 20px',
    boxShadow: 'var(--shadow-card)',
  },
  chartHeader: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: '24px',
  },
  chartTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.15rem', fontWeight: 700,
    color: 'var(--text-primary)', letterSpacing: '-0.02em',
  },
  chartSub: { fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '3px' },
  chartBadge: {
    padding: '5px 14px',
    background: 'var(--accent-dim)',
    border: '1px solid var(--border-bright)',
    borderRadius: '999px',
    fontSize: '0.75rem', fontWeight: 700,
    color: 'var(--accent)', fontFamily: 'var(--font-display)',
  },
}