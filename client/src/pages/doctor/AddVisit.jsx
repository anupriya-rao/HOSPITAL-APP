// src/pages/doctor/AddVisit.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

export default function AddVisit({ patient, setCurrentPatient }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    hospital: "",
    diagnosis: "",
    notes: "",
  });
  const [drugInput, setDrugInput] = useState("");
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conflict, setConflict] = useState(null); // { drugs: [...] }
  const [pendingSubmit, setPendingSubmit] = useState(false);

  if (!patient) {
    return (
      <div style={{ padding: 32 }}>
        <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>💉</div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: 8
          }}>No Patient Selected</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
            Search for a patient first before adding a visit.
          </p>
          <button className="btn-primary" onClick={() => navigate("../search", { relative: "path" })}>
            Go to Search
          </button>
        </div>
      </div>
    );
  }

  const addDrug = () => {
    const trimmed = drugInput.trim();
    if (!trimmed) return;
    if (drugs.includes(trimmed)) {
      toast.error("Drug already added.");
      return;
    }
    setDrugs([...drugs, trimmed]);
    setDrugInput("");
  };

  const removeDrug = (drug) => {
    setDrugs(drugs.filter(d => d !== drug));
  };

  const handleDrugKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addDrug();
    }
  };

  const submitVisit = async (force = false) => {
    if (!form.hospital || !form.diagnosis) {
      toast.error("Hospital and diagnosis are required.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/doctor/visit/${patient._id}`, {
        hospital: form.hospital,
        diagnosis: form.diagnosis,
        prescription: drugs,
        notes: form.notes,
        force,
      });
      const updated = await axios.get(`/patient/profile/${patient._id}`);
      setCurrentPatient(updated.data);
      setForm({ hospital: "", diagnosis: "", notes: "" });
      setDrugs([]);
      setConflict(null);
      setPendingSubmit(false);
      navigate("/doctor/search")
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 409 || status === 400) {
        // Drug conflict detected
        setConflict(data);
        setPendingSubmit(true);
      } else {
        toast.error(data?.message || "Failed to add visit.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 640 }}>
      <div className="fade-in">
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: "1.8rem",
          fontWeight: 800, color: "var(--text-primary)", marginBottom: 8
        }}>Add Visit</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 28, fontSize: "0.95rem" }}>
          Recording visit for <strong style={{ color: "var(--text-primary)" }}>{patient.name}</strong>
          {" · "}{patient.bloodGroup}
        </p>

        {/* Allergy Warning */}
        {patient.allergies?.length > 0 && (
          <div style={{
            background: "var(--danger-dim)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "var(--radius-sm)", padding: "14px 18px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 12
          }}>
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, color: "var(--danger)", fontSize: "0.85rem", marginBottom: 4 }}>
                Known Allergies
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {patient.allergies.map((a, i) => (
                  <span key={i} style={{
                    background: "var(--danger)", color: "white",
                    padding: "2px 10px", borderRadius: 999,
                    fontSize: "0.78rem", fontWeight: 700
                  }}>{a}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Drug Conflict Banner */}
        {conflict && (
          <div className="fade-in" style={{
            background: "rgba(239,68,68,0.12)", border: "2px solid var(--danger)",
            borderRadius: "var(--radius-sm)", padding: "20px 24px", marginBottom: 24
          }}>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "1.1rem", color: "var(--danger)", marginBottom: 8
            }}>
              🚨 Drug Conflict Detected
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 12 }}>
              {conflict.message || "One or more prescribed drugs conflict with patient allergies:"}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {(conflict.conflicts || conflict.conflictingDrugs || []).map((d, i) => (
                <span key={i} style={{
                  background: "var(--danger)", color: "white",
                  padding: "4px 14px", borderRadius: 999,
                  fontSize: "0.85rem", fontWeight: 700
                }}>{d}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-danger"
                onClick={() => submitVisit(true)}
                disabled={loading}
              >
                ⚠️ Override & Submit Anyway
              </button>
              <button
                className="btn-ghost"
                onClick={() => { setConflict(null); setPendingSubmit(false); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="glass-card fade-in-delay-1" style={{ padding: 28 }}>

          {/* Hospital */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>🏥 Hospital</label>
            <input
              className="input-field"
              placeholder="e.g. AIIMS Delhi"
              value={form.hospital}
              onChange={e => setForm({ ...form, hospital: e.target.value })}
            />
          </div>

          {/* Diagnosis */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>🩺 Diagnosis</label>
            <input
              className="input-field"
              placeholder="e.g. Type 2 Diabetes — follow-up"
              value={form.diagnosis}
              onChange={e => setForm({ ...form, diagnosis: e.target.value })}
            />
          </div>

          {/* Prescription */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>💊 Prescription</label>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <input
                className="input-field"
                placeholder="Type drug name and press Enter"
                value={drugInput}
                onChange={e => setDrugInput(e.target.value)}
                onKeyDown={handleDrugKeyDown}
                style={{ flex: 1 }}
              />
              <button
                className="btn-ghost"
                onClick={addDrug}
                type="button"
              >
                + Add
              </button>
            </div>
            {drugs.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {drugs.map((drug, i) => (
                  <span key={i} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "var(--accent-dim)", color: "var(--accent)",
                    border: "1px solid rgba(14,165,233,0.2)",
                    padding: "5px 12px", borderRadius: 999,
                    fontSize: "0.85rem", fontWeight: 600
                  }}>
                    {drug}
                    <span
                      onClick={() => removeDrug(drug)}
                      style={{ cursor: "pointer", opacity: 0.6, fontSize: "1rem", lineHeight: 1 }}
                    >×</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>📝 Notes</label>
            <textarea
              className="input-field"
              placeholder="Additional notes, observations, follow-up instructions..."
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={4}
              style={{ resize: "vertical", minHeight: 100 }}
            />
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="btn-primary"
              onClick={() => submitVisit(false)}
              disabled={loading || !form.hospital || !form.diagnosis}
              style={{ flex: 1 }}
            >
              {loading ? "Submitting…" : "✓ Submit Visit"}
            </button>
            <button
              className="btn-ghost"
              onClick={() => navigate("../profile", { relative: "path" })}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--text-muted)",
  fontFamily: "var(--font-display)",
  marginBottom: 8
};