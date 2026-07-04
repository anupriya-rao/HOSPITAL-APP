import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

function QrScannerWrapper({ onScan, onError }) {
  const [Scanner, setScanner] = useState(null);
  useEffect(() => {
    import("react-qr-scanner").then(mod => {
      setScanner(() => mod.default);
    }).catch(() => toast.error("Failed to load camera."));
  }, []);
  if (!Scanner) return (
    <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading camera…</div>
  );
  return <Scanner delay={300} onScan={onScan} onError={onError} style={{ width: "100%" }} />;
}

export default function SearchPatient({ setCurrentPatient }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const navigate = useNavigate();

  const handlePhoneSearch = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) return;
    setLoading(true);
    try {
      const res = await axios.get(`/patient/search/phone/${phone.trim()}`);
      setCurrentPatient(res.data);
      navigate("/doctor/profile");
    } catch {
      toast.error("Patient not found. Check the phone number.");
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (data) => {
    if (data) {
      try {
        const parts = data.text.split("/");
        const patientId = parts[parts.length - 1];
        setScannerOpen(false);
        const res = await axios.get(`/patient/profile/${patientId}`);
        setCurrentPatient(res.data);
        navigate("../profile", { relative: "path" });
      } catch {
        toast.error("Could not load patient from QR.");
      }
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: 580 }}>
      <div className="fade-in">
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Find Patient</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 32, fontSize: "0.95rem" }}>Search by phone number or scan their QR code</p>
        <div className="glass-card fade-in-delay-1" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>📱</div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Search by Phone</span>
          </div>
          <form onSubmit={handlePhoneSearch} style={{ display: "flex", gap: 12 }}>
            <input className="input-field" type="tel" placeholder="Enter 10-digit phone number" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} maxLength={10} style={{ flex: 1 }} />
            <button type="submit" className="btn-primary" disabled={loading || phone.length !== 10} style={{ whiteSpace: "nowrap" }}>
              {loading ? "Searching…" : "Search"}
            </button>
          </form>
          {phone.length > 0 && phone.length < 10 && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 8 }}>{10 - phone.length} more digits needed</p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontFamily: "var(--font-display)", fontWeight: 600 }}>OR</span>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
        </div>
        <div className="glass-card fade-in-delay-2" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>📷</div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Scan Patient QR Code</span>
          </div>
          {!scannerOpen ? (
            <button className="btn-ghost" style={{ width: "100%", padding: "16px", fontSize: "0.95rem" }} onClick={() => setScannerOpen(true)}>
              📸 &nbsp; Open Camera Scanner
            </button>
          ) : (
            <div>
              <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", border: "2px solid var(--accent)", marginBottom: 12, boxShadow: "0 0 20px var(--accent-glow)" }}>
                <QrScannerWrapper onScan={handleQRScan} onError={err => { console.error(err); toast.error("Camera error."); }} />
              </div>
              <button className="btn-danger" style={{ width: "100%" }} onClick={() => setScannerOpen(false)}>Cancel Scanner</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
