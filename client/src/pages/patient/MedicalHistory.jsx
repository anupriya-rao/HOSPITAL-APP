import jsPDF from 'jspdf'
import { useState } from 'react'

export default function MedicalHistory({ patient }) {
  if (!patient) return <div style={{ padding: 32 }}>
    <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
      <p style={{ color: 'var(--text-muted)' }}>No patient profile found.</p>
    </div>
  </div>

  const [filter, setFilter] = useState('')
  const hospitals = [...new Set(patient.medicalHistory?.map(v => v.hospital).filter(Boolean))]
  const filtered = filter ? patient.medicalHistory?.filter(v => v.hospital === filter) : patient.medicalHistory

  const downloadPDF = (visit, index) => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('MediChain Prescription', 20, 20)
    doc.setFontSize(12)
    doc.text(`Patient: ${patient.name}`, 20, 40)
    doc.text(`Age: ${patient.age} | Blood Group: ${patient.bloodGroup}`, 20, 50)
    doc.text(`Date: ${new Date(visit.date).toLocaleDateString('en-IN')}`, 20, 60)
    doc.text(`Hospital: ${visit.hospital}`, 20, 70)
    doc.text(`Doctor: ${visit.doctor}`, 20, 80)
    doc.text(`Diagnosis: ${visit.diagnosis}`, 20, 90)
    doc.text(`Prescription: ${visit.prescription?.join(', ')}`, 20, 100)
    doc.text(`Notes: ${visit.notes || 'None'}`, 20, 110)
    doc.save(`prescription-${index + 1}.pdf`)
  }

  const shareWhatsApp = (visit) => {
    const text = `MediChain Prescription\nPatient: ${patient.name}\nDate: ${new Date(visit.date).toLocaleDateString('en-IN')}\nHospital: ${visit.hospital}\nDiagnosis: ${visit.diagnosis}\nMeds: ${visit.prescription?.join(', ')}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`)
  }

  return (
    <div style={{ padding: 32, maxWidth: 820 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Medical History</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field" style={{ width: 'auto', padding: '8px 16px' }}>
          <option value=''>All Hospitals</option>
          {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>{filtered?.length || 0} visits found</p>

      {!filtered?.length ? (
        <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
          <p style={{ color: 'var(--text-muted)' }}>No visits recorded yet.</p>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: 'var(--border)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[...filtered].reverse().map((visit, i) => (
              <div key={i} style={{ display: 'flex', gap: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.85rem', fontWeight: 700, zIndex: 1, boxShadow: 'var(--shadow-accent)', fontFamily: 'var(--font-display)' }}>
                  {filtered.length - i}
                </div>
                <div className="glass-card" style={{ flex: 1, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{visit.diagnosis}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: 2 }}>🏥 {visit.hospital} · 👨‍⚕️ {visit.doctor}</div>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                      {new Date(visit.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {visit.prescription?.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6, letterSpacing: '0.06em' }}>Prescription</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {visit.prescription.map((drug, j) => (
                          <span key={j} style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(14,165,233,0.2)', padding: '3px 10px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600 }}>{drug}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {visit.notes && (
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent)', marginBottom: 12 }}>{visit.notes}</div>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '7px 14px' }} onClick={() => downloadPDF(visit, i)}>📄 Download PDF</button>
                    <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '7px 14px' }} onClick={() => shareWhatsApp(visit)}>📤 WhatsApp</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}