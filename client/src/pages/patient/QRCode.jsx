export default function QRCode({ patient }) {
  if (!patient) return <div style={{ padding: 32 }}>
    <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>📱</div>
      <p style={{ color: 'var(--text-muted)' }}>No patient profile found.</p>
    </div>
  </div>

  const printQR = () => window.print()

  return (
    <div style={{ padding: 32, maxWidth: 500 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Your QR Code</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Show this at any hospital for instant access to your medical history</p>

      <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
        <img src={patient.qrCode} alt="Patient QR Code" style={{ width: 220, height: 220, borderRadius: 16, border: '4px solid var(--accent)', boxShadow: '0 0 32px var(--accent-glow)' }} />
        <div style={{ marginTop: 20, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{patient.name}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>Blood Group: {patient.bloodGroup} · Age: {patient.age}</div>
        <button className="btn-primary" onClick={printQR} style={{ marginTop: 24, width: '100%' }}>🖨️ Print QR Code</button>
      </div>
    </div>
  )
}