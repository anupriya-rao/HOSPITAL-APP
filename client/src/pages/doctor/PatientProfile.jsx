// src/pages/doctor/PatientProfile.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

export default function PatientProfile({ patient, setCurrentPatient }) {
  const navigate = useNavigate();
  const [flagging, setFlagging] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);

  if (!patient) {
    return (
      <div style={{ padding: 32 }}>
        <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: 8
          }}>No Patient Selected</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
            Search for a patient first to view their profile.
          </p>
          <button className="btn-primary" onClick={() => navigate("../search", { relative: "path" })}>
            Go to Search
          </button>
        </div>
      </div>
    );
  }

  const handleFlag = async (field, value) => {
    setFlagging(true);
    try {
      const payload = {};
      payload[field] = value;
      const res = await axios.patch(`/doctor/flag/${patient._id}`, payload);
      setCurrentPatient({ ...patient, ...payload });
      toast.success(`Patient ${field === "highRisk" ? "risk" : "chronic"} status updated.`);
    } catch {
      toast.error("Failed to update flag.");
    } finally {
      setFlagging(false);
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 820 }}>

      {/* Emergency Overlay */}
      {emergencyMode && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(239,68,68,0.97)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: 40
        }}>
          <div style={{
            background: "white", borderRadius: 24, padding: 48,
            maxWidth: 480, width: "100%", textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🚨</div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "1.8rem", color: "#dc2626", marginBottom: 24
            }}>EMERGENCY INFO</h2>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: 4 }}>Name</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.4rem", color: "#111" }}>{patient.name}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: 4 }}>Blood Group</div>
              <div style={{
                display: "inline-block", background: "#fee2e2", color: "#dc2626",
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.6rem",
                padding: "4px 20px", borderRadius: 12
              }}>{patient.bloodGroup}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: 8 }}>Allergies</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {patient.allergies?.length ? patient.allergies.map((a, i) => (
                  <span key={i} style={{
                    background: "#fee2e2", color: "#dc2626", padding: "4px 14px",
                    borderRadius: 999, fontWeight: 700, fontSize: "0.9rem"
                  }}>{a}</span>
                )) : <span style={{ color: "#6b7280" }}>None</span>}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: 8 }}>Chronic Conditions</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {patient.chronicConditions?.length ? patient.chronicConditions.map((c, i) => (
                  <span key={i} style={{
                    background: "#fef3c7", color: "#d97706", padding: "4px 14px",
                    borderRadius: 999, fontWeight: 700, fontSize: "0.9rem"
                  }}>{c}</span>
                )) : <span style={{ color: "#6b7280" }}>None</span>}
              </div>
            </div>

            {patient.emergencyContact && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: 4 }}>Emergency Contact</div>
                <div style={{ fontWeight: 700, color: "#111" }}>{patient.emergencyContact.name}</div>
                <div style={{ color: "#dc2626", fontWeight: 700 }}>{patient.emergencyContact.phone}</div>
              </div>
            )}

            <button
              onClick={() => setEmergencyMode(false)}
              style={{
                background: "#dc2626", color: "white", border: "none",
                borderRadius: 12, padding: "14px 32px", fontWeight: 700,
                fontSize: "1rem", cursor: "pointer", fontFamily: "var(--font-display)"
              }}
            >
              Close Emergency View
            </button>
          </div>
        </div>
      )}

      <div className="fade-in">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "1.8rem",
              fontWeight: 800, color: "var(--text-primary)", marginBottom: 8
            }}>{patient.name}</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span className="badge badge-accent">{patient.bloodGroup}</span>
              <span className="badge" style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                {patient.age} yrs · {patient.gender}
              </span>
              {patient.highRisk && (
                <span className="badge badge-danger pulse-danger">⚠️ High Risk</span>
              )}
              {patient.chronic && (
                <span className="badge badge-warning">🔄 Chronic</span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn-danger"
              onClick={() => setEmergencyMode(true)}
              style={{ fontWeight: 700 }}
            >
              🚨 Emergency
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate("../add-visit", { relative: "path" })}
            >
              + Add Visit
            </button>
          </div>
        </div>

        {/* Info Cards Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>

          {/* Allergies */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--danger)", marginBottom: 10, fontFamily: "var(--font-display)" }}>
              ⚠️ Allergies
            </div>
            {patient.allergies?.length ? patient.allergies.map((a, i) => (
              <div key={i} style={{
                display: "inline-block", margin: "3px 4px 3px 0",
                background: "var(--danger-dim)", color: "var(--danger)",
                border: "1px solid rgba(239,68,68,0.2)",
                padding: "3px 10px", borderRadius: 999,
                fontSize: "0.82rem", fontWeight: 600
              }}>{a}</div>
            )) : <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>None recorded</span>}
          </div>

          {/* Chronic Conditions */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--warning)", marginBottom: 10, fontFamily: "var(--font-display)" }}>
              🔄 Chronic Conditions
            </div>
            {patient.chronicConditions?.length ? patient.chronicConditions.map((c, i) => (
              <div key={i} style={{
                display: "inline-block", margin: "3px 4px 3px 0",
                background: "var(--warning-dim)", color: "var(--warning)",
                border: "1px solid rgba(245,158,11,0.2)",
                padding: "3px 10px", borderRadius: 999,
                fontSize: "0.82rem", fontWeight: 600
              }}>{c}</div>
            )) : <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>None recorded</span>}
          </div>

          {/* Emergency Contact */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--success)", marginBottom: 10, fontFamily: "var(--font-display)" }}>
              📞 Emergency Contact
            </div>
            {patient.emergencyContact ? (
              <>
                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>{patient.emergencyContact.name}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{patient.emergencyContact.phone}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{patient.emergencyContact.relation}</div>
              </>
            ) : <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Not recorded</span>}
          </div>
        </div>

        {/* Flag Toggles */}
        <div className="glass-card fade-in-delay-1" style={{ padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 14, fontFamily: "var(--font-display)" }}>
            Doctor Flags
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              disabled={flagging}
              onClick={() => handleFlag("highRisk", !patient.highRisk)}
              style={{
                padding: "10px 20px", borderRadius: 12, border: "none",
                cursor: "pointer", fontWeight: 700, fontSize: "0.88rem",
                fontFamily: "var(--font-display)", transition: "var(--transition)",
                background: patient.highRisk ? "var(--danger)" : "var(--danger-dim)",
                color: patient.highRisk ? "white" : "var(--danger)",
              }}
            >
              {patient.highRisk ? "✓ High Risk ON" : "High Risk OFF"}
            </button>
            <button
              disabled={flagging}
              onClick={() => handleFlag("chronic", !patient.chronic)}
              style={{
                padding: "10px 20px", borderRadius: 12, border: "none",
                cursor: "pointer", fontWeight: 700, fontSize: "0.88rem",
                fontFamily: "var(--font-display)", transition: "var(--transition)",
                background: patient.chronic ? "var(--warning)" : "var(--warning-dim)",
                color: patient.chronic ? "white" : "var(--warning)",
              }}
            >
              {patient.chronic ? "✓ Chronic ON" : "Chronic OFF"}
            </button>
          </div>
        </div>

        {/* Medical History Timeline */}
        <div className="fade-in-delay-2">
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 20
          }}>
            Medical History
            <span style={{
              marginLeft: 10, fontSize: "0.75rem", fontWeight: 600,
              color: "var(--text-muted)", background: "var(--bg-card)",
              border: "1px solid var(--border)", borderRadius: 999,
              padding: "2px 10px"
            }}>{patient.medicalHistory?.length || 0} visits</span>
          </h3>

          {!patient.medicalHistory?.length ? (
            <div className="glass-card" style={{ padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>📋</div>
              <p style={{ color: "var(--text-muted)" }}>No visits recorded yet.</p>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              {/* Timeline line */}
              <div style={{
                position: "absolute", left: 19, top: 0, bottom: 0,
                width: 2, background: "var(--border)", zIndex: 0
              }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[...patient.medicalHistory].reverse().map((visit, i) => (
                  <div key={i} style={{ display: "flex", gap: 20, position: "relative" }}>
                    {/* Dot */}
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontSize: "0.85rem", fontWeight: 700,
                      zIndex: 1, boxShadow: "var(--shadow-accent)",
                      fontFamily: "var(--font-display)"
                    }}>
                      {patient.medicalHistory.length - i}
                    </div>

                    {/* Card */}
                    <div className="glass-card" style={{ flex: 1, padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
                            {visit.diagnosis}
                          </div>
                          <div style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginTop: 2 }}>
                            🏥 {visit.hospital} · 👨‍⚕️ {visit.doctorName}
                          </div>
                        </div>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
                          {new Date(visit.date || visit.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>

                      {/* Prescriptions */}
                      {visit.prescription?.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent)", marginBottom: 6, letterSpacing: "0.06em" }}>
                            Prescription
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {visit.prescription.map((drug, j) => (
                              <span key={j} style={{
                                background: "var(--accent-dim)", color: "var(--accent)",
                                border: "1px solid rgba(14,165,233,0.2)",
                                padding: "3px 10px", borderRadius: 999,
                                fontSize: "0.8rem", fontWeight: 600
                              }}>{drug}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {visit.notes && (
                        <div style={{
                          background: "var(--bg-secondary)", borderRadius: 10,
                          padding: "10px 14px", fontSize: "0.85rem",
                          color: "var(--text-secondary)", borderLeft: "3px solid var(--accent)"
                        }}>
                          {visit.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}