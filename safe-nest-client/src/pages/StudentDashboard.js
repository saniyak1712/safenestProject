import { useEffect, useState } from "react";
import { API_BASE_URL, clearAuth } from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sd-root { min-height:100vh; background:#0a0f1e; font-family:'DM Sans',sans-serif; color:#fff; overflow-x:hidden; position:relative; }

  /* Blobs */
  .sd-blob { position:fixed;border-radius:50%;filter:blur(90px);opacity:0.13;pointer-events:none;animation:blobFloat 9s ease-in-out infinite alternate; }
  .sd-blob-1 { width:520px;height:520px;background:radial-gradient(circle,#f97316,#ea580c);top:-130px;right:-90px;animation-delay:0s; }
  .sd-blob-2 { width:360px;height:360px;background:radial-gradient(circle,#22d3ee,#0891b2);bottom:-70px;left:-60px;animation-delay:3s; }
  .sd-blob-3 { width:260px;height:260px;background:radial-gradient(circle,#fcd34d,#f97316);top:45%;left:42%;animation-delay:1.5s; }
  @keyframes blobFloat { 0%{transform:scale(1) translate(0,0);}100%{transform:scale(1.1) translate(16px,-16px);} }

  /* Grid */
  .sd-grid { position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(249,115,22,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.03) 1px,transparent 1px);background-size:52px 52px; }

  /* Layout */
  .sd-layout { display:grid;grid-template-columns:260px 1fr;min-height:100vh;position:relative;z-index:1; }

  /* ── Sidebar ── */
  .sd-sidebar {
    background:rgba(255,255,255,0.02);
    border-right:1px solid rgba(249,115,22,0.1);
    backdrop-filter:blur(20px);
    padding:32px 20px;
    display:flex;flex-direction:column;gap:6px;
    position:sticky;top:0;height:100vh;overflow-y:auto;
    animation:slideIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes slideIn { from{opacity:0;transform:translateX(-20px);}to{opacity:1;transform:translateX(0);} }

  .sd-logo { display:flex;align-items:center;gap:11px;margin-bottom:28px;padding-bottom:24px;border-bottom:1px solid rgba(249,115,22,0.1); }
  .sd-logo-icon { width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#f97316,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 6px 20px rgba(249,115,22,0.4);flex-shrink:0; }
  .sd-logo-txt { font-family:'Playfair Display',serif;font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.5px; }
  .sd-logo-txt span { color:#f97316; }

  /* Student profile in sidebar */
  .sd-profile { background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.15);border-radius:16px;padding:16px;margin-bottom:20px; }
  .sd-profile-avatar { width:44px;height:44px;border-radius:13px;background:linear-gradient(135deg,#f97316,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff;margin-bottom:10px;box-shadow:0 4px 14px rgba(249,115,22,0.3); }
  .sd-profile-name { font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#fff; }
  .sd-profile-email { font-size:11.5px;color:rgba(255,255,255,0.35);margin-top:2px;word-break:break-all; }
  .sd-profile-room { display:inline-flex;align-items:center;gap:5px;margin-top:8px;padding:3px 10px;border-radius:20px;background:rgba(34,211,238,0.1);border:1px solid rgba(34,211,238,0.2);font-size:11px;color:#67e8f9;font-weight:600; }

  /* Nav items */
  .sd-nav-label { font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,0.2);padding:6px 10px 4px;margin-top:8px; }
  .sd-nav-item { display:flex;align-items:center;gap:11px;padding:11px 14px;border-radius:12px;border:1px solid transparent;background:transparent;color:rgba(255,255,255,0.45);font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:500;cursor:pointer;transition:all 0.2s;width:100%;text-align:left; }
  .sd-nav-item:hover { background:rgba(249,115,22,0.08);border-color:rgba(249,115,22,0.2);color:rgba(255,255,255,0.85); }
  .sd-nav-item.active { background:rgba(249,115,22,0.12);border-color:rgba(249,115,22,0.3);color:#fff; }
  .sd-nav-item .nav-icon { font-size:17px;flex-shrink:0; }
  .sd-nav-badge { margin-left:auto;font-size:10.5px;padding:2px 7px;border-radius:20px;background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.3);color:#fca5a5; }

  .sd-sidebar-spacer { flex:1; }
  .sd-logout { display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:12px;border:1px solid rgba(239,68,68,0.2);background:rgba(239,68,68,0.05);color:rgba(239,68,68,0.6);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all 0.2s;width:100%;margin-top:8px; }
  .sd-logout:hover { background:rgba(239,68,68,0.12);color:#f87171;border-color:rgba(239,68,68,0.4); }

  /* ── Main ── */
  .sd-main { padding:40px 44px;overflow-y:auto; }

  /* Topbar */
  .sd-topbar { display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;animation:fadeUp 0.6s 0.1s both; }
  .sd-topbar h1 { font-family:'Playfair Display',serif;font-size:30px;font-weight:800;letter-spacing:-0.7px; }
  .sd-topbar h1 span { color:#f97316; }
  .sd-topbar p { color:rgba(255,255,255,0.35);font-size:13px;margin-top:4px; }
  .sd-topbar-right { display:flex;align-items:center;gap:12px; }
  .sd-date-badge { background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:7px 14px;font-size:12.5px;color:rgba(255,255,255,0.4); }

  /* Section label */
  .sd-slabel { font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,0.22);margin-bottom:14px; }
  .sd-div { height:1px;background:linear-gradient(90deg,transparent,rgba(249,115,22,0.15),transparent);margin:6px 0 22px; }

  /* Quick action cards */
  .sd-actions { display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px; }
  .sd-action-card { border-radius:18px;padding:22px;position:relative;overflow:hidden;cursor:pointer;transition:all 0.25s;animation:fadeUp 0.5s both; }
  .sd-action-card:hover { transform:translateY(-4px); }
  .sd-action-card.checkin { background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2); }
  .sd-action-card.checkin:hover { background:rgba(34,197,94,0.14);border-color:rgba(34,197,94,0.4);box-shadow:0 16px 40px rgba(34,197,94,0.12); }
  .sd-action-card.checkout { background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2); }
  .sd-action-card.checkout:hover { background:rgba(249,115,22,0.14);border-color:rgba(249,115,22,0.4);box-shadow:0 16px 40px rgba(249,115,22,0.12); }
  .sd-action-card.sos { background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);animation:fadeUp 0.5s both, sosPulse 2.5s ease-in-out infinite; }
  .sd-action-card.sos:hover { background:rgba(239,68,68,0.16);border-color:rgba(239,68,68,0.5);box-shadow:0 16px 40px rgba(239,68,68,0.18); }
  @keyframes sosPulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0);}50%{box-shadow:0 0 20px rgba(239,68,68,0.1);} }

  .sd-action-icon { width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:14px; }
  .sd-action-icon.checkin { background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.25); }
  .sd-action-icon.checkout { background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.25); }
  .sd-action-icon.sos { background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.25);animation:iconPulse 1.5s infinite; }
  @keyframes iconPulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.3);}50%{box-shadow:0 0 0 7px rgba(239,68,68,0);} }

  .sd-action-title { font-size:15px;font-weight:600;color:#fff;margin-bottom:4px; }
  .sd-action-desc { font-size:12px;color:rgba(255,255,255,0.35); }
  .sd-action-arrow { position:absolute;bottom:20px;right:20px;font-size:16px;color:rgba(255,255,255,0.2);transition:all 0.2s; }
  .sd-action-card:hover .sd-action-arrow { color:rgba(255,255,255,0.6);transform:translate(2px,-2px); }

  /* Info grid */
  .sd-info-grid { display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:28px; }

  /* Info card */
  .sd-info-card { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:18px;padding:22px;transition:all 0.22s;animation:fadeUp 0.5s both; }
  .sd-info-card:hover { border-color:rgba(249,115,22,0.25);transform:translateY(-2px); }
  .sd-info-card-title { display:flex;align-items:center;gap:10px;margin-bottom:16px; }
  .sd-info-card-icon { width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px; }
  .sd-info-card-label { font-size:13px;font-weight:600;color:rgba(255,255,255,0.7); }

  .sd-room-row { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
  .sd-room-item { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:10px 13px; }
  .sd-room-lbl { font-size:10.5px;text-transform:uppercase;letter-spacing:0.7px;color:rgba(255,255,255,0.28);margin-bottom:4px; }
  .sd-room-val { font-size:17px;font-weight:600; }

  /* Rent status */
  .sd-rent-status { display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:10px;font-size:13px;font-weight:600; }
  .sd-rent-status.paid { background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.25);color:#6ee7b7; }
  .sd-rent-status.pending { background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.25);color:#fbbf24; }
  .sd-rent-status.pending::before { content:'';width:6px;height:6px;border-radius:50%;background:#fbbf24;box-shadow:0 0 6px #fbbf24;animation:dotPulse 1.8s infinite; }
  @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(1.5);} }

  .sd-rent-row { display:flex;gap:10px;margin-top:12px; }
  .sd-rent-item { flex:1;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:10px 13px; }
  .sd-rent-lbl { font-size:10.5px;text-transform:uppercase;letter-spacing:0.7px;color:rgba(255,255,255,0.28);margin-bottom:4px; }
  .sd-rent-val { font-size:16px;font-weight:600;color:#fbbf24; }

  /* Entry logs */
  .sd-logs-card { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:18px;padding:22px;margin-bottom:28px;animation:fadeUp 0.5s 0.25s both; }

  .sd-log-item { display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05); }
  .sd-log-item:last-child { border-bottom:none; }
  .sd-log-dot { width:10px;height:10px;border-radius:50%;flex-shrink:0; }
  .sd-log-dot.in { background:#22c55e;box-shadow:0 0 6px #22c55e; }
  .sd-log-dot.out { background:rgba(255,255,255,0.25); }
  .sd-log-dot.inside { background:#f97316;box-shadow:0 0 6px #f97316;animation:dotPulse 1.5s infinite; }
  .sd-log-times { flex:1; }
  .sd-log-in { font-size:13px;font-weight:500;color:#fff; }
  .sd-log-out { font-size:12px;color:rgba(255,255,255,0.38);margin-top:2px; }
  .sd-late-tag { padding:3px 8px;border-radius:6px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.25);color:#fca5a5;font-size:11px;font-weight:600;white-space:nowrap; }
  .sd-inside-tag { padding:3px 8px;border-radius:6px;background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.25);color:#fb923c;font-size:11px;white-space:nowrap; }

  /* Complaint form */
  .sd-complaint-card { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:18px;padding:24px;margin-bottom:28px;animation:fadeUp 0.5s 0.3s both;position:relative;overflow:hidden; }
  .sd-complaint-card::before { content:'';position:absolute;top:0;left:8%;right:8%;height:2px;background:linear-gradient(90deg,transparent,#f97316,#fbbf24,transparent);border-radius:0 0 2px 2px; }

  .sd-input { width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px 16px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:all 0.22s;margin-bottom:12px; }
  .sd-input::placeholder { color:rgba(255,255,255,0.2); }
  .sd-input:focus { background:rgba(249,115,22,0.06);border-color:rgba(249,115,22,0.45);box-shadow:0 0 0 3px rgba(249,115,22,0.1); }
  textarea.sd-input { resize:vertical;min-height:88px;line-height:1.6; }

  .sd-submit-btn { width:100%;padding:13px;border:none;border-radius:12px;background:linear-gradient(135deg,#f97316,#fbbf24);color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;box-shadow:0 6px 20px rgba(249,115,22,0.3);transition:all 0.2s;position:relative;overflow:hidden; }
  .sd-submit-btn:hover { transform:translateY(-2px);box-shadow:0 10px 28px rgba(249,115,22,0.45); }
  .sd-submit-btn:disabled { opacity:0.45;cursor:not-allowed;transform:none; }
  .sd-submit-btn::after { content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);transform:skewX(-20deg);animation:shimmer 3s 1s infinite; }
  @keyframes shimmer { 0%{left:-100%}100%{left:160%} }

  /* Spinner */
  .sd-spin { display:inline-block;width:13px;height:13px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite;vertical-align:middle;margin-right:6px; }
  @keyframes spin { to{transform:rotate(360deg);} }

  /* No room */
  .sd-noroom { text-align:center;padding:60px 0;animation:fadeUp 0.6s both; }
  .sd-noroom-icon { font-size:48px;margin-bottom:14px;opacity:0.4; }
  .sd-noroom h3 { font-family:'Playfair Display',serif;font-size:20px;color:rgba(255,255,255,0.4);margin-bottom:8px; }
  .sd-noroom p { font-size:13px;color:rgba(255,255,255,0.2); }

  /* Empty logs */
  .sd-empty-logs { text-align:center;padding:32px 0;color:rgba(255,255,255,0.22);font-size:13.5px; }

  /* Loading */
  .sd-loading { min-height:100vh;background:#0a0f1e;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px; }
  .sd-loading-ring { width:48px;height:48px;border:3px solid rgba(249,115,22,0.15);border-top-color:#f97316;border-radius:50%;animation:spin 0.8s linear infinite; }
  .sd-loading p { color:rgba(255,255,255,0.3);font-size:14px; }

  /* Toast */
  .sd-toast { position:fixed;bottom:28px;right:28px;z-index:999;padding:13px 20px;border-radius:14px;font-size:13.5px;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:10px;backdrop-filter:blur(20px);animation:toastIn 0.35s cubic-bezier(0.16,1,0.3,1) both;box-shadow:0 16px 40px rgba(0,0,0,0.4); }
  .sd-toast.success { background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.3);color:#6ee7b7; }
  .sd-toast.error { background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#fca5a5; }
  .sd-toast.warning { background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);color:#fde68a; }
  @keyframes toastIn { from{opacity:0;transform:translateY(16px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);} }

  @keyframes fadeUp { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }

  @media(max-width:1100px) { .sd-layout{grid-template-columns:1fr;} .sd-sidebar{display:none;} .sd-actions{grid-template-columns:1fr 1fr;} }
  @media(max-width:700px) { .sd-main{padding:24px 16px;} .sd-actions{grid-template-columns:1fr;} .sd-info-grid{grid-template-columns:1fr;} }
`;

function getInitials(name) {
  return name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";
}

function formatDateTime(d) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-IN", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit", hour12:true });
}

function formatDate(d) {
  if (!d) return "Not set";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`sd-toast ${type}`}>
      {type === "success" ? "✅" : type === "warning" ? "⚠️" : "⚠"} {msg}
    </div>
  );
}

export default function StudentDashboard() {
  const [student, setStudent]     = useState(null);
  const [logs, setLogs]           = useState([]);
  const [title, setTitle]         = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actioning, setActioning] = useState("");   // "checkin"|"checkout"|"sos"
  const [toast, setToast]         = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showRentPopup, setShowRentPopup] = useState(false);

  // Student dashboard bootstrap should run once on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { 
    fetchStudent(); 
    fetchLogs(); 
    fetchNotifications();
    fetchComplaints();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/student/notifications`, { headers: authHeaders() });
      if (res.ok) {
        const notifs = await res.json();
        setNotifications(notifs);
        if (notifs.length > 0) {
          setTimeout(() => {
            showToast(notifs[0].message, notifs[0].type === "danger" ? "error" : "warning");
            if (notifs.some((n) => n.id?.startsWith("rent"))) setShowRentPopup(true);
          }, 1500);
        }
      }
    } catch {}
  };

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchStudent = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/student/me`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      setStudent(await res.json());
    } catch {
      showToast("Failed to load student data", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/entry/history`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      setLogs(await res.json());
    } catch {}
  };

  const checkIn = async () => {
    setActioning("checkin");
    try {
      const res = await fetch(`${API_BASE_URL}/api/entry/checkin`, { method:"POST", headers: authHeaders(), body:"{}" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Check-in failed");
      }
      showToast("Checked in successfully");
      fetchLogs();
    } catch (err) { showToast(err.message || "Check-in failed", "error"); }
    finally { setActioning(""); }
  };

  const checkOut = async () => {
    setActioning("checkout");
    try {
      const res = await fetch(`${API_BASE_URL}/api/entry/checkout`, { method:"POST", headers: authHeaders(), body:"{}" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Check-out failed");
      }
      showToast("Checked out successfully");
      fetchLogs();
    } catch (err) { showToast(err.message || "Check-out failed", "error"); }
    finally { setActioning(""); }
  };

  const sendSOS = async () => {
    setActioning("sos");
    try {
      const res = await fetch(`${API_BASE_URL}/api/sos`, { method:"POST", headers: authHeaders(), body:"{}" });
      if (!res.ok) throw new Error();
      showToast("🚨 SOS alert sent! Help is on the way.", "warning");
    } catch { showToast("Failed to send SOS", "error"); }
    finally { setActioning(""); }
  };

  const generateQR = async () => {
    setActioning("qr");
    try {
      const res = await fetch(`${API_BASE_URL}/api/qr/generate`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQrCodeData(data.qrData);
      showToast("QR Code generated successfully");
    } catch { showToast("Failed to generate QR", "error"); }
    finally { setActioning(""); }
  };

  const submitComplaint = async () => {
    if (!title.trim()) { showToast("Please enter a complaint title", "error"); return; }
    if (!description.trim()) { showToast("Please describe your issue", "error"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints`, {
        method:"POST", headers: authHeaders(),
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error();
      showToast("Complaint submitted successfully");
      setTitle(""); setDescription("");
      fetchComplaints();
    } catch { showToast("Failed to submit complaint", "error"); }
    finally { setSubmitting(false); }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints/my`, { headers: authHeaders() });
      if (res.ok) setComplaints(await res.json());
    } catch {}
  };

  const isInsideNow = logs.length > 0 && !logs[0]?.checkOut;
  const rentNotice = notifications.find((n) => n.id?.startsWith("rent"));
  const pendingComplaints = complaints.filter((c) => c.status === "Pending").length;

  const NAV = [
    { id:"overview",   icon:"📊", label:"Overview"      },
    { id:"entry",      icon:"🚪", label:"Entry History", badge: logs.filter(l=>l.isLate).length || null },
    { id:"complaint",  icon:"💬", label:"Complaints", badge: pendingComplaints || null },
  ];

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="sd-loading">
        <div className="sd-loading-ring" />
        <p>Loading your dashboard…</p>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="sd-root">
        {showRentPopup && rentNotice && (
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(3,7,18,0.68)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}>
            <div style={{
              width: "min(420px, 100%)",
              background: "rgba(15,23,42,0.94)",
              border: "1px solid rgba(249,115,22,0.28)",
              borderRadius: 18,
              padding: 24,
              boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
            }}>
              <div style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 10 }}>
                Rent reminder
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 800, marginBottom: 10 }}>
                Payment attention needed
              </div>
              <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
                {rentNotice.message}
              </p>
              <button className="sd-submit-btn" onClick={() => setShowRentPopup(false)}>Got it</button>
            </div>
          </div>
        )}
        <div className="sd-blob sd-blob-1" /><div className="sd-blob sd-blob-2" /><div className="sd-blob sd-blob-3" />
        <div className="sd-grid" />

        <div className="sd-layout">

          {/* ── Sidebar ── */}
          <aside className="sd-sidebar">
            <div className="sd-logo">
              <div className="sd-logo-icon">🏠</div>
              <div className="sd-logo-txt">Safe<span>Nest</span></div>
            </div>

            {/* Profile */}
            {student && (
              <div className="sd-profile">
                <div className="sd-profile-avatar">{getInitials(student.name)}</div>
                <div className="sd-profile-name">{student.name}</div>
                <div className="sd-profile-email">{student.email}</div>
                {student.room && (
                  <div className="sd-profile-room">🏠 Room {student.room.roomNumber}</div>
                )}
              </div>
            )}

            <div className="sd-nav-label">Navigation</div>
            {NAV.map(item => (
              <button key={item.id} className={`sd-nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge ? <span className="sd-nav-badge">{item.badge}</span> : null}
              </button>
            ))}

            <div className="sd-sidebar-spacer" />
            <button className="sd-logout" onClick={() => {
              clearAuth();
              window.location.href = "/";
            }}>↩ &nbsp;Sign Out</button>
          </aside>

          {/* ── Main ── */}
          <main className="sd-main">

            {/* Topbar */}
            <div className="sd-topbar">
              <div>
                <h1>Student <span>Dashboard</span></h1>
                <p>SafeNest · {student?.name} · {new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long" })}</p>
              </div>
              <div className="sd-topbar-right">
                <div className="sd-date-badge">
                  {isInsideNow ? "🟢 Inside Hostel" : "⚫ Outside"}
                </div>
              </div>
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <>
                {student?.room ? (
                  <>
                    {/* Actions */}
                    <div className="sd-slabel">Quick Actions</div>
                    <div className="sd-div" />
                    <div className="sd-actions">
                      {[
                        { type:"checkin",  icon:"🚪", title:"Check In",       desc:"Mark your hostel entry",    delay:"0.15s" },
                        { type:"checkout", icon:"🏃", title:"Check Out",      desc:"Record your exit time",      delay:"0.2s"  },
                        { type:"qr",       icon:"📱", title:"Entry QR Code",  desc:"Generate smart access QR",   delay:"0.22s" },
                        { type:"sos",      icon:"🆘", title:"SOS Emergency",  desc:"Alert warden immediately",   delay:"0.25s" },
                      ].map(({ type, icon, title, desc, delay }) => (
                        <div key={type} className={`sd-action-card ${type}`}
                          style={{ animationDelay:delay }}
                          onClick={actioning ? undefined : type === "checkin" ? checkIn : type === "checkout" ? checkOut : type === "qr" ? generateQR : sendSOS}
                        >
                          <div className={`sd-action-icon ${type}`}>{icon}</div>
                          <div className="sd-action-title">
                            {actioning === type ? <><span className="sd-spin" />{title}…</> : title}
                          </div>
                          <div className="sd-action-desc">{desc}</div>
                          <div className="sd-action-arrow">↗</div>
                        </div>
                      ))}
                    </div>

                    {qrCodeData && (
                      <div className="sd-info-card" style={{ marginTop: 20, textAlign: 'center' }}>
                        <div className="sd-info-card-title" style={{ justifyContent: 'center' }}>
                          <div className="sd-info-card-icon" style={{ background:"rgba(34,211,238,0.1)", border:"1px solid rgba(34,211,238,0.2)" }}>📱</div>
                          <div className="sd-info-card-label">Your Entry QR Code</div>
                        </div>
                        <div style={{ background: '#fff', padding: 20, display: 'inline-block', borderRadius: 12 }}>
                          {/* Mock QR Code Visual */}
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeData)}`} alt="QR Code" />
                        </div>
                        <p style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Scan at the hostel gate for smart entry/exit</p>
                        <button onClick={() => setQrCodeData(null)} style={{ marginTop: 10, padding: "5px 15px", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer" }}>Close</button>
                      </div>
                    )}

                    {/* Room + Rent info */}
                    <div className="sd-slabel">Your Details</div>
                    <div className="sd-div" />
                    <div className="sd-info-grid">
                      {/* Room card */}
                      <div className="sd-info-card" style={{ animationDelay:"0.2s" }}>
                        <div className="sd-info-card-title">
                          <div className="sd-info-card-icon" style={{ background:"rgba(34,211,238,0.1)", border:"1px solid rgba(34,211,238,0.2)" }}>🏠</div>
                          <div className="sd-info-card-label">Assigned Room</div>
                        </div>
                        <div className="sd-room-row">
                          <div className="sd-room-item">
                            <div className="sd-room-lbl">Room No</div>
                            <div className="sd-room-val" style={{ color:"#22d3ee" }}>{student?.room?.roomNumber || "N/A"}</div>
                          </div>
                          <div className="sd-room-item">
                            <div className="sd-room-lbl">Capacity</div>
                            <div className="sd-room-val" style={{ color:"#a78bfa" }}>{student.room.capacity} beds</div>
                          </div>
                          <div className="sd-room-item" style={{ gridColumn:"1 / -1" }}>
                            <div className="sd-room-lbl">Monthly Rent</div>
                            <div className="sd-room-val" style={{ color:"#fbbf24" }}>₹{student.room.rent?.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      {/* Rent card */}
                      <div className="sd-info-card" style={{ animationDelay:"0.25s" }}>
                        <div className="sd-info-card-title">
                          <div className="sd-info-card-icon" style={{ background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.2)" }}>💰</div>
                          <div className="sd-info-card-label">Rent Status</div>
                        </div>
                        <div className={`sd-rent-status ${student.rentPaid ? "paid" : "pending"}`}>
                          {student.rentPaid ? "✅ Paid" : "Pending Payment"}
                        </div>
                        <div className="sd-rent-row">
                          <div className="sd-rent-item">
                            <div className="sd-rent-lbl">Amount Due</div>
                            <div className="sd-rent-val">₹{(student.rentAmount || 0).toLocaleString()}</div>
                          </div>
                          <div className="sd-rent-item">
                            <div className="sd-rent-lbl">Due Date</div>
                            <div className="sd-rent-val" style={{ color: new Date(student.rentDueDate) < new Date() && !student.rentPaid ? "#f87171" : "#fbbf24" }}>
                              {formatDate(student.rentDueDate)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent logs preview */}
                    <div className="sd-slabel">Recent Entry Activity</div>
                    <div className="sd-div" />
                    <div className="sd-logs-card">
                      {logs.length === 0 ? (
                        <div className="sd-empty-logs">📋 No entry history yet</div>
                      ) : (
                        logs.slice(0, 4).map((log, idx) => (
                          <div className="sd-log-item" key={log._id} style={{ animationDelay:`${0.05*idx}s` }}>
                            <div className={`sd-log-dot ${!log.checkOut ? "inside" : "out"}`} />
                            <div className="sd-log-times">
                              <div className="sd-log-in">↓ In: {formatDateTime(log.checkIn)}</div>
                              <div className="sd-log-out">
                                {log.checkOut ? `↑ Out: ${formatDateTime(log.checkOut)}` : "Still inside hostel"}
                              </div>
                            </div>
                            {log.isLate && <div className="sd-late-tag">⚠ Late</div>}
                            {!log.checkOut && <div className="sd-inside-tag">🟢 Inside</div>}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <div className="sd-noroom">
                    <div className="sd-noroom-icon">🏠</div>
                    <h3>No room assigned yet</h3>
                    <p>Contact your hostel admin to get a room assigned</p>
                  </div>
                )}
              </>
            )}

            {/* ── ENTRY TAB ── */}
            {activeTab === "entry" && (
              <>
                <div className="sd-slabel">Full Entry History</div>
                <div className="sd-div" />
                <div className="sd-logs-card">
                  {logs.length === 0 ? (
                    <div className="sd-empty-logs">📋 No entry history yet</div>
                  ) : (
                    logs.map((log, idx) => (
                      <div className="sd-log-item" key={log._id} style={{ animationDelay:`${0.04*idx}s` }}>
                        <div className={`sd-log-dot ${!log.checkOut ? "inside" : "out"}`} />
                        <div className="sd-log-times">
                          <div className="sd-log-in">↓ Check In: {formatDateTime(log.checkIn)}</div>
                          <div className="sd-log-out">
                            {log.checkOut ? `↑ Check Out: ${formatDateTime(log.checkOut)}` : "Currently inside hostel"}
                          </div>
                        </div>
                        {log.isLate && <div className="sd-late-tag">⚠ Late Entry</div>}
                        {!log.checkOut && <div className="sd-inside-tag">🟢 Inside</div>}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* ── COMPLAINT TAB ── */}
            {activeTab === "complaint" && (
              <>
                <div className="sd-slabel">Raise a Complaint</div>
                <div className="sd-div" />
                <div className="sd-complaint-card">
                  <div style={{ marginBottom:18 }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, marginBottom:6 }}>
                      File a Complaint
                    </div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.35)" }}>
                      Your complaint will be reviewed by the hostel admin
                    </div>
                  </div>
                  <input
                    className="sd-input"
                    placeholder="Complaint title (e.g. Water issue, Cleanliness…)"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                  <textarea
                    className="sd-input"
                    placeholder="Describe your issue in detail…"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                  <button className="sd-submit-btn" disabled={submitting} onClick={submitComplaint}>
                    {submitting ? <><span className="sd-spin" />Submitting…</> : "Submit Complaint →"}
                  </button>
                </div>
                <div className="sd-slabel">Complaint Tracking</div>
                <div className="sd-div" />
                <div className="sd-logs-card">
                  {complaints.length === 0 ? (
                    <div className="sd-empty-logs">No complaints submitted yet</div>
                  ) : (
                    complaints.slice(0, 5).map((c) => (
                      <div className="sd-log-item" key={c._id}>
                        <div className={`sd-log-dot ${c.status === "Pending" ? "inside" : "out"}`} />
                        <div className="sd-log-times">
                          <div className="sd-log-in">{c.title}</div>
                          <div className="sd-log-out">{c.description}</div>
                        </div>
                        <div className={c.status === "Pending" ? "sd-late-tag" : "sd-inside-tag"}>
                          {c.status}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

          </main>
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
