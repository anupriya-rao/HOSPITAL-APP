import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [verifying, setVerifying] = useState(null)

  useEffect(() => {
    fetchDoctors()
  }, [])

  async function fetchDoctors() {
    try {
      const r = await api.get('/admin/doctors')
      setDoctors(r.data)
    } catch {
      toast.error('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  async function toggleVerify(doctorId, currentStatus) {
    setVerifying(doctorId)
    try {
      await api.patch(`/admin/verify-doctor/${doctorId}`, {
        verified: !currentStatus
      })
      setDoctors(prev => prev.map(d =>
        d._id === doctorId ? { ...d, verified: !currentStatus } : d
      ))
      toast.success(!currentStatus ? 'Doctor verified!' : 'Verification removed')
    } catch {
      toast.error('Failed to update verification')
    } finally {
      setVerifying(null)
    }
  }

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    d.hospital?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Doctors</h1>
          <p style={s.sub}>Manage and verify registered doctors</p>
        </div>
        <div style={s.headerRight}>
          <div style={s.countBadge}>
            {doctors.length} Total · {doctors.filter(d => d.verified).length} Verified
          </div>
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
          placeholder="Search by name, specialization or hospital..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={s.tableCard}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer" style={s.shimmerRow} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <span style={s.emptyIcon}>🩺</span>
          <p style={s.emptyText}>No doctors found</p>
        </div>
      ) : (
        <div style={s.tableCard}>
          {/* Table head */}
          <div style={s.tableHead}>
            <span style={{ ...s.th, flex: 2 }}>Doctor</span>
            <span style={{ ...s.th, flex: 1.5 }}>Specialization</span>
            <span style={{ ...s.th, flex: 2 }}>Hospital</span>
            <span style={{ ...s.th, flex: 1 }}>Status</span>
            <span style={{ ...s.th, flex: 1, textAlign: 'right' }}>Action</span>
          </div>

          {/* Rows */}
          {filtered.map((doc, i) => (
            <div
              key={doc._id}
              style={{
                ...s.row,
                animationDelay: `${i * 0.05}s`,
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              }}
              className="fade-in"
            >
              {/* Doctor info */}
              <div style={{ ...s.cell, flex: 2 }}>
                <div style={s.avatar}>
                  {doc.name?.charAt(0).toUpperCase() || 'D'}
                </div>
                <div>
                  <div style={s.docName}>
                    {doc.name}
                    {doc.verified && (
                      <span style={s.verifiedBadge} title="Verified">✓</span>
                    )}
                  </div>
                  <div style={s.docEmail}>{doc.email}</div>
                </div>
              </div>

              {/* Specialization */}
              <div style={{ ...s.cell, flex: 1.5 }}>
                <span style={s.specTag}>
                  {doc.specialization || 'General'}
                </span>
              </div>

              {/* Hospital */}
              <div style={{ ...s.cell, flex: 2 }}>
                <span style={s.hospitalText}>
                  🏥 {doc.hospital || '—'}
                </span>
              </div>

              {/* Status */}
              <div style={{ ...s.cell, flex: 1 }}>
                <span style={doc.verified ? s.statusVerified : s.statusPending}>
                  {doc.verified ? '● Verified' : '○ Pending'}
                </span>
              </div>

              {/* Action */}
              <div style={{ ...s.cell, flex: 1, justifyContent: 'flex-end' }}>
                <button
                  style={doc.verified ? s.btnUnverify : s.btnVerify}
                  onClick={() => toggleVerify(doc._id, doc.verified)}
                  disabled={verifying === doc._id}
                >
                  {verifying === doc._id
                    ? '...'
                    : doc.verified ? 'Unverify' : 'Verify'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const s = {
  page: { padding: '36px 40px', maxWidth: '1100px' },
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
  headerRight: { display: 'flex', gap: '10px', alignItems: 'center' },
  countBadge: {
    padding: '8px 16px',
    background: 'var(--accent-dim)',
    border: '1px solid var(--border-bright)',
    borderRadius: '10px',
    fontSize: '0.82rem', fontWeight: 700,
    color: 'var(--accent)', fontFamily: 'var(--font-display)',
  },
  searchWrap: {
    position: 'relative', marginBottom: '20px',
  },
  searchIcon: {
    position: 'absolute', left: '16px', top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)', pointerEvents: 'none',
  },
  searchInput: {
    paddingLeft: '44px',
    background: 'var(--bg-secondary)',
  },
  tableCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-card)',
  },
  shimmerRow: { height: '72px', margin: '8px 16px', borderRadius: '10px' },
  tableHead: {
    display: 'flex', alignItems: 'center',
    padding: '14px 24px',
    background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border)',
  },
  th: {
    fontSize: '0.72rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.07em',
    color: 'var(--text-muted)', fontFamily: 'var(--font-display)',
  },
  row: {
    display: 'flex', alignItems: 'center',
    padding: '16px 24px',
    transition: 'var(--transition)',
    cursor: 'default',
  },
  cell: {
    display: 'flex', alignItems: 'center', gap: '10px',
    minWidth: 0,
  },
  avatar: {
    width: '38px', height: '38px', borderRadius: '11px',
    background: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: 800, fontSize: '0.9rem',
    fontFamily: 'var(--font-display)', flexShrink: 0,
  },
  docName: {
    fontWeight: 600, fontSize: '0.9rem',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
    display: 'flex', alignItems: 'center', gap: '6px',
  },
  verifiedBadge: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '16px', height: '16px', borderRadius: '50%',
    background: '#10b981', color: 'white',
    fontSize: '0.6rem', fontWeight: 800, flexShrink: 0,
  },
  docEmail: {
    fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px',
  },
  specTag: {
    padding: '4px 10px', borderRadius: '999px',
    background: 'var(--accent-dim)',
    border: '1px solid var(--border-bright)',
    color: 'var(--accent)',
    fontSize: '0.78rem', fontWeight: 600,
    fontFamily: 'var(--font-display)',
    whiteSpace: 'nowrap',
  },
  hospitalText: {
    fontSize: '0.85rem', color: 'var(--text-secondary)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  statusVerified: {
    fontSize: '0.78rem', fontWeight: 700,
    color: '#10b981', fontFamily: 'var(--font-display)',
  },
  statusPending: {
    fontSize: '0.78rem', fontWeight: 700,
    color: 'var(--warning)', fontFamily: 'var(--font-display)',
  },
  btnVerify: {
    padding: '7px 16px', borderRadius: '8px',
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.3)',
    color: '#10b981', cursor: 'pointer',
    fontSize: '0.78rem', fontWeight: 700,
    fontFamily: 'var(--font-display)',
    transition: 'var(--transition)',
    whiteSpace: 'nowrap',
  },
  btnUnverify: {
    padding: '7px 16px', borderRadius: '8px',
    background: 'var(--danger-dim)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: 'var(--danger)', cursor: 'pointer',
    fontSize: '0.78rem', fontWeight: 700,
    fontFamily: 'var(--font-display)',
    transition: 'var(--transition)',
    whiteSpace: 'nowrap',
  },
  empty: {
    textAlign: 'center', padding: '80px 20px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
  },
  emptyIcon: { fontSize: '3rem', display: 'block', marginBottom: '16px' },
  emptyText: { color: 'var(--text-secondary)', fontSize: '1rem' },
}