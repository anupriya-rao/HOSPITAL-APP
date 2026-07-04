// src/pages/patient/PatientDashboard.jsx
import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import QRCode from './QRCode'
import MedicalHistory from './MedicalHistory'
import Medications from './Medications'
import Consent from './Consent'
import axios from '../../api/axios'

const navItems = [
  { path: '/patient/qrcode', label: 'My QR Code', icon: '📱' },
  { path: '/patient/history', label: 'Medical History', icon: '📋' },
  { path: '/patient/medications', label: 'Medications', icon: '💊' },
  { path: '/patient/consent', label: 'Consent & Access', icon: '🔐' },
]

function PatientHome({ patient }) {
  if (!patient) return (
    <div style={{ padding: 32 }}>
      <div className="shimmer" style={{ height: 120, marginBottom: 16 }} />
      <div className="shimmer" style={{ height: 80 }} />
    </div>
  )

  return (
    <div style={{ padding: 32, maxWidth: 720 }}>
      <div className="fade-in">
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.8rem',
          fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8
        }}>
          Welcome, {patient.name} 👋
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '0.95rem' }}>
          Your health profile is active and accessible by verified doctors.
        </p>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Blood Group', value: patient.bloodGroup, color: 'var(--danger)', bg: 'var(--danger-dim)', icon: '🩸' },
            { label: 'Age', value: `${patient.age} yrs`, color: 'var(--accent)', bg: 'var(--accent-dim)', icon: '👤' },
            { label: 'Visits', value: patient.medicalHistory?.length || 0, color: 'var(--success)', bg: 'var(--success-dim)', icon: '🏥' },
            { label: 'Allergies', value: patient.allergies?.length || 0, color: 'var(--warning)', bg: 'var(--warning-dim)', icon: '⚠️' },
          ].map((card, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px 18px' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{card.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: card.color }}>{card.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          {patient.highRisk && <span className="badge badge-danger pulse-danger">⚠️ High Risk Patient</span>}
          {patient.chronic && <span className="badge badge-warning">🔄 Chronic Condition</span>}
          {!patient.highRisk && !patient.chronic && <span className="badge badge-success">✓ Stable</span>}
        </div>

        {/* Allergies */}
        {patient.allergies?.length > 0 && (
          <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--danger)', marginBottom: 10, fontFamily: 'var(--font-display)' }}>
              ⚠️ Allergies
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {patient.allergies.map((a, i) => (
                <span key={i} style={{
                  background: 'var(--danger-dim)', color: 'var(--danger)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  padding: '4px 12px', borderRadius: 999, fontSize: '0.85rem', fontWeight: 600
                }}>{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* Chronic Conditions */}
        {patient.chronicConditions?.length > 0 && (
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--warning)', marginBottom: 10, fontFamily: 'var(--font-display)' }}>
              🔄 Chronic Conditions
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {patient.chronicConditions.map((c, i) => (
                <span key={i} style={{
                  background: 'var(--warning-dim)', color: 'var(--warning)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  padding: '4px 12px', borderRadius: 999, fontSize: '0.85rem', fontWeight: 600
                }}>{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PatientDashboard({ theme, setTheme, lang, setLang }) {
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const name = localStorage.getItem('name') || 'Patient'

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const userId = localStorage.getItem('id')
        // First get the user's linked patientId, then fetch profile
        const res = await axios.get('/patient/my-profile')
        setPatient(res.data)
      } catch {
        // If direct id doesn't work, patient profile may use linkedId
        // Will handle gracefully — show empty state
      }
    }
    fetchPatient()
  }, [])

  function handleLogout() {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.logoRow}>
            <div style={s.logoBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={s.logoText}>MediChain</span>
          </div>
          <div style={s.roleBadge}>
            <span style={s.roleDot} />
            Patient Portal
          </div>
        </div>

        <nav style={s.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...s.navItem,
                ...(isActive ? s.navActive : {}),
              })}
            >
              <span style={s.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={s.sideBottom}>
          <div style={s.userCard}>
            <div style={s.userAvatar}>{name.charAt(0).toUpperCase()}</div>
            <div>
              <div style={s.userName}>{name}</div>
              <div style={s.userRole}>Patient</div>
            </div>
          </div>
          <div style={s.sideControls}>
            <button style={s.ctrlBtn} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button style={s.ctrlBtn} onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}>
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>
            <button style={{ ...s.ctrlBtn, ...s.logoutBtn }} onClick={handleLogout}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <polyline points="16 17 21 12 16 7"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="21" y1="12" x2="9" y2="12"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <main style={s.main}>
        <Routes>
          <Route index element={<PatientHome patient={patient} />} />
          <Route path="qrcode" element={<QRCode patient={patient} />} />
          <Route path="history" element={<MedicalHistory patient={patient} />} />
          <Route path="medications" element={<Medications patient={patient} />} />
          <Route path="consent" element={<Consent patient={patient} />} />
        </Routes>
      </main>
    </div>
  )
}

const s = {
  shell: { display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' },
  sidebar: {
    width: '240px', flexShrink: 0,
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column',
    position: 'fixed', top: 0, left: 0, bottom: 0,
    zIndex: 100, boxShadow: '4px 0 24px rgba(0,0,0,0.06)',
  },
  sideTop: { padding: '28px 20px 20px', borderBottom: '1px solid var(--border)' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' },
  logoBox: {
    width: '32px', height: '32px', borderRadius: '9px',
    background: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(14,165,233,0.3)', flexShrink: 0,
  },
  logoText: {
    fontFamily: 'var(--font-display)', fontWeight: 800,
    fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em',
  },
  roleBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)',
    borderRadius: '999px', padding: '4px 12px',
    fontSize: '0.72rem', fontWeight: 700,
    color: 'var(--accent)', fontFamily: 'var(--font-display)',
    letterSpacing: '0.05em', textTransform: 'uppercase',
  },
  roleDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: 'var(--accent)', display: 'block', boxShadow: '0 0 6px var(--accent)',
  },
  nav: { flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '11px 14px', borderRadius: '12px',
    color: 'var(--text-secondary)', fontSize: '0.9rem',
    fontWeight: 500, transition: 'var(--transition)',
    cursor: 'pointer', textDecoration: 'none', fontFamily: 'var(--font-body)',
  },
  navActive: {
    background: 'var(--accent-dim)', color: 'var(--accent)',
    fontWeight: 600, borderLeft: '3px solid var(--accent)', paddingLeft: '11px',
  },
  navIcon: { fontSize: '1.05rem', flexShrink: 0 },
  sideBottom: { padding: '16px 12px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' },
  userCard: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
    background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px',
  },
  userAvatar: {
    width: '34px', height: '34px', borderRadius: '10px',
    background: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: 800, fontSize: '0.95rem',
    fontFamily: 'var(--font-display)', flexShrink: 0,
  },
  userName: { fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' },
  userRole: { fontSize: '0.72rem', color: 'var(--accent)', marginTop: '1px' },
  sideControls: { display: 'flex', gap: '8px' },
  ctrlBtn: {
    flex: 1, padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '10px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem',
    transition: 'var(--transition)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoutBtn: { color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)', background: 'var(--danger-dim)' },
  main: { flex: 1, marginLeft: '240px', minHeight: '100vh', overflowY: 'auto' },
}