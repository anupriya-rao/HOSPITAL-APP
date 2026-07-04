import { useEffect, useState, useRef } from 'react'
import api from '../../api/axios'

export default function AuditLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const intervalRef = useRef(null)

  useEffect(() => {
    fetchLogs()
    // Live update every 10 seconds
    intervalRef.current = setInterval(fetchLogs, 10000)
    return () => clearInterval(intervalRef.current)
  }, [])

  async function fetchLogs() {
    try {
      const r = await api.get('/admin/audit-logs')
      setLogs(r.data)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const filtered = logs.filter(l =>
    l.action?.toLowerCase().includes(filter.toLowerCase()) ||
    l.doctorName?.toLowerCase().includes(filter.toLowerCase()) ||
    l.patientName?.toLowerCase().includes(filter.toLowerCase())
  )

  function timeAgo(date) {
    const diff = Date.now() - new Date(date)
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  function actionColor(action) {
    if (!action) return 'var(--text-muted)'
    const a = action.toLowerCase()
    if (a.includes('visit') || a.includes('add')) return '#0ea5e9'
    if (a.includes('flag') || a.includes('risk')) return '#ef4444'
    if (a.includes('scan') || a.includes('view')) return '#10b981'
    if (a.includes('verify')) return '#6366f1'
    return 'var(--text-secondary)'
  }

  function actionIcon(action) {
    if (!action) return '📋'
    const a = action.toLowerCase()
    if (a.includes('visit') || a.includes('add')) return '💉'
    if (a.includes('flag') || a.includes('risk')) return '⚠️'
    if (a.includes('scan') || a.includes('view')) return '👁️'
    if (a.includes('verify')) return '✅'
    return '📋'
  }

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Audit Log</h1>
          <p style={s.sub}>Live feed of all system access and actions</p>
        </div>
        <div style={s.liveRow}>
          <span style={s.liveDot} />
          <span style={s.liveText}>Live · updates every 10s</span>
        </div>
      </div>

      {/* Search */}
      <div style={s.searchWrap}>
        <svg style={s.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          className="input-field"
          style={s.searchInput}
          placeholder="Filter by doctor, patient or action..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <span style={s.countChip}>{filtered.length} entries</span>
      </div>

      {/* Log feed */}
      {loading ? (
        <div style={s.feed}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shimmer" style={s.shimmerRow} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <span style={{ fontSize: '2.5rem' }}>📋</span>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>No logs found</p>
        </div>
      ) : (
        <div style={s.feed}>
          {filtered.map((log, i) => (
            <div
              key={log._id || i}
              style={s.logRow}
              className="fade-in"
            >
              {/* Timeline line */}
              <div style={s.timeline}>
                <div style={{ ...s.timelineDot, background: actionColor(log.action) }} />
                {i < filtered.length - 1 && <div style={s.timelineLine} />}
              </div>

              {/* Content */}
              <div style={s.logContent}>
                <div style={s.logCard}>
                  <div style={s.logTop}>
                    {/* Action icon + label */}
                    <div style={s.logLeft}>
                      <span style={{
                        ...s.logIcon,
                        background: actionColor(log.action) + '15',
                        color: actionColor(log.action),
                      }}>
                        {actionIcon(log.action)}
                      </span>
                      <div>
                        <div style={{ ...s.logAction, color: actionColor(log.action) }}>
                          {log.action || 'Unknown Action'}
                        </div>
                        <div style={s.logMeta}>
                          {log.doctorName && (
                            <span style={s.metaChip}>
                              🩺 {log.doctorName}
                            </span>
                          )}
                          {log.patientName && (
                            <span style={s.metaChip}>
                              👤 {log.patientName}
                            </span>
                          )}
                          {log.hospital && (
                            <span style={s.metaChip}>
                              🏥 {log.hospital}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Time */}
                    <div style={s.logRight}>
                      <span style={s.logTime}>{timeAgo(log.createdAt)}</span>
                      <span style={s.logDate}>
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          day: '2-digit', month: 'short',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  {log.details && (
                    <div style={s.logDetails}>{log.details}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const s = {
  page: { padding: '36px 40px', maxWidth: '1000px' },
  header: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: '28px',
    flexWrap: 'wrap', gap: '16px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem', fontWeight: 800,
    color: 'var(--text-primary)', letterSpacing: '-0.02em',
  },
  sub: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' },
  liveRow: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '8px 16px',
    background: 'rgba(16,185,129,0.08)',
    border: '1px solid rgba(16,185,129,0.25)',
    borderRadius: '10px',
  },
  liveDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#10b981', display: 'block',
    boxShadow: '0 0 8px #10b981',
    animation: 'pulse-ring 2s infinite',
    flexShrink: 0,
  },
  liveText: {
    fontSize: '0.78rem', fontWeight: 700,
    color: '#10b981', fontFamily: 'var(--font-display)',
  },
  searchWrap: {
    position: 'relative', marginBottom: '24px',
    display: 'flex', alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute', left: '16px',
    color: 'var(--text-muted)', pointerEvents: 'none',
  },
  searchInput: {
    paddingLeft: '44px', paddingRight: '100px',
    background: 'var(--bg-secondary)', flex: 1,
  },
  countChip: {
    position: 'absolute', right: '14px',
    padding: '4px 10px', borderRadius: '999px',
    background: 'var(--accent-dim)',
    color: 'var(--accent)',
    fontSize: '0.72rem', fontWeight: 700,
    fontFamily: 'var(--font-display)',
  },
  feed: {
    display: 'flex', flexDirection: 'column',
  },
  shimmerRow: {
    height: '80px', marginBottom: '12px', borderRadius: '14px',
  },
  logRow: {
    display: 'flex', gap: '16px', marginBottom: '4px',
  },
  timeline: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', flexShrink: 0,
    paddingTop: '18px',
  },
  timelineDot: {
    width: '10px', height: '10px', borderRadius: '50%',
    flexShrink: 0, zIndex: 1,
    boxShadow: '0 0 8px currentColor',
  },
  timelineLine: {
    width: '2px', flex: 1,
    background: 'var(--border)',
    marginTop: '4px', minHeight: '20px',
  },
  logContent: { flex: 1, paddingBottom: '8px' },
  logCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '14px', padding: '14px 18px',
    boxShadow: 'var(--shadow-card)',
    transition: 'var(--transition)',
  },
  logTop: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', gap: '12px',
  },
  logLeft: { display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 },
  logIcon: {
    width: '36px', height: '36px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1rem', flexShrink: 0,
  },
  logAction: {
    fontWeight: 700, fontSize: '0.88rem',
    fontFamily: 'var(--font-display)', marginBottom: '6px',
  },
  logMeta: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  metaChip: {
    padding: '3px 8px', borderRadius: '999px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    fontSize: '0.74rem', color: 'var(--text-secondary)',
  },
  logRight: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'flex-end', gap: '2px', flexShrink: 0,
  },
  logTime: {
    fontSize: '0.78rem', fontWeight: 700,
    color: 'var(--accent)', fontFamily: 'var(--font-display)',
  },
  logDate: { fontSize: '0.72rem', color: 'var(--text-muted)' },
  logDetails: {
    marginTop: '10px', padding: '8px 12px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '0.8rem', color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
  },
  empty: {
    textAlign: 'center', padding: '80px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
  },
}