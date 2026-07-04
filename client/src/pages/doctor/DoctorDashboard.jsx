import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import SearchPatient from './SearchPatient'
import PatientProfile from './PatientProfile'
import AddVisit from './AddVisit'

const navItems = [
  { path: '/doctor/search', label: 'Search Patient', icon: '🔍' },
  { path: '/doctor/profile', label: 'Patient Profile', icon: '👤' },
  { path: '/doctor/add-visit', label: 'Add Visit', icon: '💉' },
]

export default function DoctorDashboard({ theme, setTheme, lang, setLang }) {
  const navigate = useNavigate()
  const name = localStorage.getItem('name') || 'Doctor'
  const [currentPatient, setCurrentPatient] = useState(null)

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
            Doctor Portal
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

        {currentPatient && (
          <div style={s.patientChip}>
            <div style={s.chipLabel}>Current Patient</div>
            <div style={s.chipName}>{currentPatient.name}</div>
            <div style={s.chipSub}>
              {currentPatient.bloodGroup} ·{' '}
              {currentPatient.highRisk ? '⚠️ High Risk' : '✓ Stable'}
            </div>
          </div>
        )}

        <div style={s.sideBottom}>
          <div style={s.userCard}>
            <div style={s.userAvatar}>{name.charAt(0).toUpperCase()}</div>
            <div>
              <div style={s.userName}>{name}</div>
              <div style={s.userRole}>Verified Doctor ✓</div>
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
          <Route index element={<SearchPatient setCurrentPatient={setCurrentPatient} />} />
          <Route path="search" element={<SearchPatient setCurrentPatient={setCurrentPatient} />} />
          <Route path="profile" element={<PatientProfile patient={currentPatient} setCurrentPatient={setCurrentPatient} />} />
          <Route path="add-visit" element={<AddVisit patient={currentPatient} setCurrentPatient={setCurrentPatient} />} />
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
    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
    borderRadius: '999px', padding: '4px 12px',
    fontSize: '0.72rem', fontWeight: 700,
    color: '#10b981', fontFamily: 'var(--font-display)',
    letterSpacing: '0.05em', textTransform: 'uppercase',
  },
  roleDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: '#10b981', display: 'block', boxShadow: '0 0 6px #10b981',
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
  patientChip: {
    margin: '0 12px 12px', padding: '12px 14px',
    background: 'var(--accent-dim)', border: '1px solid var(--border-bright)', borderRadius: '14px',
  },
  chipLabel: {
    fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.07em', color: 'var(--accent)',
    fontFamily: 'var(--font-display)', marginBottom: '4px',
  },
  chipName: { fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' },
  chipSub: { fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' },
  sideBottom: { padding: '16px 12px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' },
  userCard: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
    background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px',
  },
  userAvatar: {
    width: '34px', height: '34px', borderRadius: '10px',
    background: 'linear-gradient(135deg,#10b981,#059669)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: 800, fontSize: '0.95rem',
    fontFamily: 'var(--font-display)', flexShrink: 0,
  },
  userName: { fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' },
  userRole: { fontSize: '0.72rem', color: '#10b981', marginTop: '1px' },
  sideControls: { display: 'flex', gap: '8px' },
  ctrlBtn: {
    flex: 1, padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '10px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem',
    transition: 'var(--transition)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoutBtn: { color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)', background: 'var(--danger-dim)' },
  main: { flex: 1, marginLeft: '240px', minHeight: '100vh', overflowY: 'auto' },
}
