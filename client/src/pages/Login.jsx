import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { toast } from 'react-toastify'

const translations = {
  en: {
    tagline: 'Your Health,\nSafeguarded.',
    subtitle: 'One QR identity. Instant access to complete medical history across every hospital in India.',
    email: 'Email Address',
    password: 'Password',
    signin: 'Sign In to MediChain',
    signing: 'Signing in...',
    error: 'Invalid credentials',
  },
  hi: {
    tagline: 'आपका स्वास्थ्य,\nसुरक्षित।',
    subtitle: 'एक QR पहचान। भारत के हर अस्पताल में पूरे मेडिकल इतिहास तक तुरंत पहुंच।',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    signin: 'मेडीचेन में साइन इन करें',
    signing: 'साइन इन हो रहा है...',
    error: 'गलत क्रेडेंशियल',
  }
}

const DOCTOR_IMAGE = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80'

export default function Login({ theme, setTheme, lang, setLang }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const navigate = useNavigate()
  const t = translations[lang]

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      const { token, role, name, id } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      localStorage.setItem('name', name)
      localStorage.setItem('userId', id)
      toast.success(`Welcome back, ${name}!`)
      if (role === 'patient') navigate('/patient')
      else if (role === 'doctor') navigate('/doctor')
      else if (role === 'admin') navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || t.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>

      {/* ── LEFT PANEL ── */}
      <div style={s.left}>

        {/* gradient overlay on image */}
        <div style={s.imgOverlay} />

        {/* doctor photo */}
        <img
          src={DOCTOR_IMAGE}
          alt="Doctor"
          onLoad={() => setImgLoaded(true)}
          style={{ ...s.doctorImg, opacity: imgLoaded ? 1 : 0 }}
        />

        {/* bottom-gradient text panel */}
        <div style={s.leftContent}>

          {/* logo */}
          <div style={s.logoRow}>
            <div style={s.logoBox}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={s.logoText}>MediChain</span>

            <div style={s.topControls}>
              <button style={s.glassBtn} onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}>
                {lang === 'en' ? 'हिं' : 'EN'}
              </button>
              <button style={s.glassBtn} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* live pill */}
          <div style={s.livePill}>
            <span style={s.liveDot} />
            Live across 2,000+ hospitals in India
          </div>

          {/* tagline */}
          <h1 style={s.tagline}>{t.tagline}</h1>
          <p style={s.subtitle}>{t.subtitle}</p>

          {/* stats */}
          <div style={s.statsRow}>
            {[
              { n: '10M+', l: 'Patients' },
              { n: '50K+', l: 'Doctors' },
              { n: '2K+', l: 'Hospitals' },
            ].map(({ n, l }) => (
              <div key={l} style={s.stat}>
                <span style={s.statN}>{n}</span>
                <span style={s.statL}>{l}</span>
              </div>
            ))}
          </div>

          {/* trust badges */}
          <div style={s.badges}>
            {['🔒 HIPAA Safe', '⚡ Instant Access', '🩺 Drug Conflict AI', '📋 Full History'].map(b => (
              <span key={b} style={s.badge}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={s.right}>
        <div style={s.formWrap}>

          {/* header */}
          <div style={s.formHeader}>
            <div style={s.formIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={s.formTitle}>Welcome back</h2>
            <p style={s.formSub}>Sign in to access your dashboard</p>
          </div>

          {/* form */}
          <form onSubmit={handleLogin} style={s.form}>

            <div style={s.field}>
              <label style={s.label}>{t.email}</label>
              <div style={s.inputBox}>
                <svg style={s.icoSvg} width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="currentColor" strokeWidth="2" />
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
                </svg>
                <input
                  type="email"
                  placeholder="you@hospital.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={s.input}
                />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>{t.password}</label>
              <div style={s.inputBox}>
                <svg style={s.icoSvg} width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
                </svg>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={s.input}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={s.submitBtn}>
              {loading
                ? <span style={s.spinRow}><span style={s.spinner} /> {t.signing}</span>
                : t.signin}
            </button>
          </form>

          {/* divider */}
          <div style={s.divRow}>
            <div style={s.divLine} />
            <span style={s.divTxt}>Quick Demo Access</span>
            <div style={s.divLine} />
          </div>

          {/* quick fill */}
          <div style={s.quickRow}>
            {[
              { role: 'Admin', email: 'admin@test.com', pass: 'admin123', color: '#f59e0b', icon: '🛡️', desc: 'Full system access' },
              { role: 'Doctor', email: 'doc@test.com', pass: 'pass123', color: '#0ea5e9', icon: '🩺', desc: 'Patient management' },
            ].map(r => (
              <button
                key={r.role}
                onClick={() => { setEmail(r.email); setPassword(r.pass) }}
                style={{
                  ...s.quickBtn,
                  borderColor: r.color + '50',
                  background: r.color + '08',
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{r.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ ...s.quickRole, color: r.color }}>{r.role}</div>
                  <div style={s.quickDesc}>{r.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* footer note */}
          <p style={s.footNote}>
            🔐 256-bit encrypted · ABDM compliant · Trusted by AIIMS
          </p>

        </div>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: 'var(--font-body)',
    background: 'var(--bg-primary)',
  },

  /* LEFT */
  left: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    minHeight: '100vh',
  },
  doctorImg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
    transition: 'opacity 0.6s ease',
  },
  imgOverlay: {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(
      135deg,
      rgba(3, 105, 161, 0.75) 0%,
      rgba(2, 132, 199, 0.5) 40%,
      rgba(0,0,0,0.15) 100%
    ), linear-gradient(
      to top,
      rgba(2, 26, 60, 0.97) 0%,
      rgba(2, 26, 60, 0.7) 35%,
      transparent 65%
    )`,
    zIndex: 1,
  },
  leftContent: {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '36px 44px',
  },

  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    position: 'absolute',
    top: '32px',
    left: '44px',
    right: '44px',
  },
  logoBox: {
    width: '34px', height: '34px',
    borderRadius: '9px',
    background: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(14,165,233,0.5)',
    flexShrink: 0,
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800, fontSize: '1.15rem',
    color: 'white', letterSpacing: '-0.02em',
    flex: 1,
  },
  topControls: { display: 'flex', gap: '8px' },
  glassBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '8px', padding: '6px 12px',
    color: 'white', cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontWeight: 600, fontSize: '0.8rem',
    backdropFilter: 'blur(8px)',
    transition: 'var(--transition)',
  },

  livePill: {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    background: 'rgba(16,185,129,0.2)',
    border: '1px solid rgba(16,185,129,0.4)',
    borderRadius: '999px', padding: '5px 14px',
    color: '#6ee7b7', fontSize: '0.75rem',
    fontFamily: 'var(--font-display)', fontWeight: 600,
    letterSpacing: '0.03em', marginBottom: '18px',
    width: 'fit-content',
  },
  liveDot: {
    width: '7px', height: '7px', borderRadius: '50%',
    background: '#10b981', display: 'block',
    boxShadow: '0 0 8px #10b981',
    flexShrink: 0,
  },

  tagline: {
    fontFamily: 'var(--font-display)',
    fontSize: '3.2rem', fontWeight: 800,
    color: 'white', letterSpacing: '-0.03em',
    lineHeight: 1.1, marginBottom: '14px',
    whiteSpace: 'pre-line',
    textShadow: '0 2px 20px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: '0.95rem', color: 'rgba(255,255,255,0.72)',
    lineHeight: 1.7, marginBottom: '28px',
    maxWidth: '420px',
  },

  statsRow: {
    display: 'flex', gap: '0',
    marginBottom: '22px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '14px',
    overflow: 'hidden',
    width: 'fit-content',
    backdropFilter: 'blur(10px)',
  },
  stat: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', padding: '14px 28px',
    borderRight: '1px solid rgba(255,255,255,0.1)',
    gap: '2px',
  },
  statN: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.4rem', fontWeight: 800,
    color: '#7dd3fc',
  },
  statL: {
    fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase', letterSpacing: '0.08em',
  },

  badges: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  badge: {
    padding: '5px 12px', borderRadius: '999px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.85)',
    fontSize: '0.75rem', fontWeight: 500,
    backdropFilter: 'blur(6px)',
  },

  /* RIGHT */
  right: {
    width: '480px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 36px',
    background: 'var(--bg-primary)',
    borderLeft: '1px solid var(--border)',
  },
  formWrap: { width: '100%', maxWidth: '380px' },

  formHeader: { textAlign: 'center', marginBottom: '32px' },
  formIcon: {
    width: '54px', height: '54px', borderRadius: '16px',
    background: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 14px',
    boxShadow: '0 8px 24px rgba(14,165,233,0.35)',
  },
  formTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.7rem', fontWeight: 800,
    color: 'var(--text-primary)', marginBottom: '6px',
    letterSpacing: '-0.02em',
  },
  formSub: { color: 'var(--text-secondary)', fontSize: '0.9rem' },

  form: { display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '6px' },
  field: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: {
    fontSize: '0.75rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.07em',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
  },
  inputBox: {
    position: 'relative',
    display: 'flex', alignItems: 'center',
  },
  icoSvg: {
    position: 'absolute', left: '14px',
    color: 'var(--text-muted)', flexShrink: 0,
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    paddingLeft: '40px', paddingRight: '16px',
    paddingTop: '13px', paddingBottom: '13px',
    background: 'var(--bg-secondary)',
    border: '1.5px solid var(--border)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.93rem',
    outline: 'none',
    transition: 'var(--transition)',
    boxShadow: 'var(--shadow-card)',
  },

  submitBtn: {
    width: '100%', padding: '15px',
    background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
    color: 'white',
    fontFamily: 'var(--font-display)',
    fontWeight: 700, fontSize: '0.92rem',
    letterSpacing: '0.04em', textTransform: 'uppercase',
    border: 'none', borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 6px 24px rgba(14,165,233,0.35)',
    transition: 'var(--transition)',
    marginTop: '4px',
  },
  spinRow: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px',
  },
  spinner: {
    width: '16px', height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },

  divRow: {
    display: 'flex', alignItems: 'center',
    gap: '12px', margin: '22px 0',
  },
  divLine: { flex: 1, height: '1px', background: 'var(--border)' },
  divTxt: {
    fontSize: '0.72rem', color: 'var(--text-muted)',
    fontFamily: 'var(--font-display)', fontWeight: 600,
    letterSpacing: '0.05em', whiteSpace: 'nowrap',
  },

  quickRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  quickBtn: {
    flex: 1, display: 'flex', alignItems: 'center',
    gap: '10px', padding: '12px 14px',
    border: '1.5px solid', borderRadius: '12px',
    cursor: 'pointer', transition: 'var(--transition)',
    fontFamily: 'var(--font-body)',
  },
  quickRole: {
    fontWeight: 700, fontSize: '0.88rem',
    fontFamily: 'var(--font-display)',
  },
  quickDesc: {
    fontSize: '0.72rem', color: 'var(--text-muted)',
    marginTop: '1px',
  },

  footNote: {
    textAlign: 'center', fontSize: '0.72rem',
    color: 'var(--text-muted)', lineHeight: 1.5,
  },
}