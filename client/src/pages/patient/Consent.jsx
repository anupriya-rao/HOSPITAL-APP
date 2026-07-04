import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function Consent({ patient }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!patient) return
    api.get('/admin/audit-logs')
      .then(r => {
        const myLogs = r.data.filter(l => l.patientId === patient._id)
        setLogs(myLogs)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [patient])

  if (!patient) return <div style={{ padding: 32 }}>
    <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔐</div>
      <p style={{ color: 'var(--text-muted)' }}>No patient profile found.</p>
    </div>
  </div>

  return (
    <div style={{ padding: 32, maxWidth: 700 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Consent & Access Log</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>See who has accessed your medical records</p>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="shimmer" style={{ height: 72, borderRadius: 14 }} />)}
        </div>
      ) : !logs.length ? (
        <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
          <p style={{ color: 'var(--text-muted)' }}>No one has accessed your records yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {logs.map((log, i) => (
            <div key={i} className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                {log.action === 'ADD_VISIT' ? '💉' : log.action === 'FLAG' ? '⚠️' : '👁️'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{log.accessedByName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{log.action} · {log.accessedByRole}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                  {new Date(log.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}