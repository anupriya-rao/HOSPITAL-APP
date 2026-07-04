export default function Medications({ patient }) {
  if (!patient) return <div style={{ padding: 32 }}>
    <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>💊</div>
      <p style={{ color: 'var(--text-muted)' }}>No patient profile found.</p>
    </div>
  </div>

  // Collect all unique medications across all visits
  const allMeds = []
  patient.medicalHistory?.forEach(visit => {
    visit.prescription?.forEach(drug => {
      if (!allMeds.find(m => m.drug === drug)) {
        allMeds.push({ drug, hospital: visit.hospital, date: visit.date, diagnosis: visit.diagnosis })
      }
    })
  })

  return (
    <div style={{ padding: 32, maxWidth: 700 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Medications</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>{allMeds.length} unique medications across all visits</p>

      {!allMeds.length ? (
        <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>💊</div>
          <p style={{ color: 'var(--text-muted)' }}>No medications recorded yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {allMeds.map((med, i) => (
            <div key={i} className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>💊</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 4 }}>{med.drug}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>🏥 {med.hospital} · {med.diagnosis}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{new Date(med.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
              <span style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(14,165,233,0.2)', padding: '4px 12px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Active</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}