import { useEffect, useState } from "react";
import { API_BASE_URL, clearAuth } from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sos-root {
    min-height: 100vh;
    background: #0a0f1e;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    overflow-x: hidden;
    position: relative;
  }

  /* ── Blobs ── */
  .sos-blob {
    position: fixed; border-radius: 50%;
    filter: blur(90px); opacity: 0.13;
    pointer-events: none;
    animation: blobFloat 9s ease-in-out infinite alternate;
  }
  .sos-blob-1 { width:560px;height:560px;background:radial-gradient(circle,#f97316,#ea580c);top:-140px;right:-100px;animation-delay:0s; }
  .sos-blob-2 { width:380px;height:380px;background:radial-gradient(circle,#fb923c,#f59e0b);bottom:-80px;left:-60px;animation-delay:3s; }
  /* extra red blob for urgency atmosphere */
  .sos-blob-3 { width:320px;height:320px;background:radial-gradient(circle,#ef4444,#dc2626);top:30%;left:38%;animation-delay:1.5s;opacity:0.07; }
  @keyframes blobFloat {
    0%   { transform: scale(1) translate(0,0); }
    100% { transform: scale(1.1) translate(16px,-16px); }
  }

  /* ── Grid ── */
  .sos-grid {
    position: fixed; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(249,115,22,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(249,115,22,0.035) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  /* ── Sidebar ── */
  .sos-sidebar {
    position: fixed; top:0; left:0; bottom:0; width:72px;
    background: rgba(255,255,255,0.02);
    border-right: 1px solid rgba(249,115,22,0.1);
    backdrop-filter: blur(20px);
    display: flex; flex-direction: column; align-items: center;
    padding: 24px 0; gap: 8px; z-index: 100;
    animation: slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes slideInLeft {
    from { opacity:0; transform:translateX(-20px); }
    to   { opacity:1; transform:translateX(0); }
  }
  .sos-sidebar-logo {
    width:44px; height:44px; border-radius:14px;
    background: linear-gradient(135deg,#f97316,#fbbf24);
    display: flex; align-items: center; justify-content: center;
    font-size:20px; margin-bottom:16px;
    box-shadow: 0 8px 24px rgba(249,115,22,0.45); flex-shrink:0;
  }
  .sos-nav-btn {
    width:48px; height:48px; border-radius:14px;
    border:1px solid transparent; background:transparent;
    color:rgba(255,255,255,0.35); font-size:20px;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    transition:all 0.2s; position:relative;
  }
  .sos-nav-btn:hover, .sos-nav-btn.active {
    background:rgba(249,115,22,0.12); border-color:rgba(249,115,22,0.3);
    color:#f97316; box-shadow:0 0 20px rgba(249,115,22,0.15);
  }
  .sos-nav-btn .sos-tooltip {
    position:absolute; left:62px;
    background:rgba(15,20,40,0.95); border:1px solid rgba(249,115,22,0.2);
    color:#fff; font-size:12px; font-family:'DM Sans',sans-serif;
    padding:5px 10px; border-radius:8px;
    white-space:nowrap; pointer-events:none;
    opacity:0; transform:translateX(-6px);
    transition:all 0.18s; z-index:200;
  }
  .sos-nav-btn:hover .sos-tooltip { opacity:1; transform:translateX(0); }
  .sos-sidebar-spacer { flex:1; }
  .sos-logout-btn {
    width:44px; height:44px; border-radius:12px;
    border:1px solid rgba(239,68,68,0.25);
    background:rgba(239,68,68,0.06); color:rgba(239,68,68,0.6);
    font-size:18px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:all 0.2s;
  }
  .sos-logout-btn:hover { background:rgba(239,68,68,0.15); color:#f87171; border-color:rgba(239,68,68,0.5); }

  /* ── Main ── */
  .sos-main {
    margin-left: 72px;
    padding: 40px 48px;
    position: relative; z-index: 1;
  }

  /* ── Top Bar ── */
  .sos-topbar {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:40px;
    animation: fadeUp 0.6s 0.1s both;
  }
  .sos-topbar-left h1 {
    font-family:'Playfair Display',serif;
    font-size:34px; font-weight:800;
    letter-spacing:-0.8px; line-height:1.1;
  }
  .sos-topbar-left h1 span { color:#ef4444; }
  .sos-topbar-left p { color:rgba(255,255,255,0.38); font-size:13.5px; margin-top:5px; font-weight:300; }
  .sos-topbar-right { display:flex; align-items:center; gap:14px; }

  /* live alert indicator in topbar */
  .sos-live-badge {
    background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.3);
    border-radius:20px; padding:7px 16px;
    font-size:12.5px; font-weight:600; color:#f87171;
    display:flex; align-items:center; gap:7px;
  }
  .sos-live-dot {
    width:8px; height:8px; border-radius:50%;
    background:#ef4444; box-shadow:0 0 8px #ef4444;
    animation: pulse 1.4s infinite;
  }

  .sos-back-btn {
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
    border-radius:12px; padding:9px 18px; color:rgba(255,255,255,0.6);
    font-family:'DM Sans',sans-serif; font-size:13.5px; cursor:pointer;
    display:flex; align-items:center; gap:7px; transition:all 0.2s;
  }
  .sos-back-btn:hover { border-color:rgba(249,115,22,0.35); color:#f97316; background:rgba(249,115,22,0.07); }
  .sos-avatar {
    width:40px; height:40px; border-radius:12px;
    background:linear-gradient(135deg,#f97316,#fbbf24);
    display:flex; align-items:center; justify-content:center;
    font-size:16px; font-weight:700; color:#fff;
    box-shadow:0 4px 16px rgba(249,115,22,0.35);
  }

  /* ── Section label / divider ── */
  .sos-section-label {
    font-size:11px; font-weight:600;
    text-transform:uppercase; letter-spacing:1.5px;
    color:rgba(255,255,255,0.25); margin-bottom:16px;
  }
  .sos-divider {
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(249,115,22,0.18),transparent);
    margin:8px 0 28px;
  }

  /* ── Stats Row ── */
  .sos-stats-row {
    display:grid; grid-template-columns:repeat(3,1fr);
    gap:16px; margin-bottom:32px;
    animation:fadeUp 0.6s 0.15s both;
  }
  .sos-mini-stat {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; padding:18px 20px;
    display:flex; align-items:center; gap:14px;
    transition:all 0.22s;
  }
  .sos-mini-stat:hover { border-color:rgba(249,115,22,0.25); transform:translateY(-2px); }
  .sos-mini-icon { width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0; }
  .sos-mini-val { font-family:'Playfair Display',serif; font-size:26px; font-weight:800; line-height:1; }
  .sos-mini-lbl { font-size:11.5px; color:rgba(255,255,255,0.3); margin-top:3px; }

  /* ── Toolbar ── */
  .sos-toolbar {
    display:flex; align-items:center; gap:14px; margin-bottom:28px; flex-wrap:wrap;
    animation:fadeUp 0.6s 0.2s both;
  }
  .sos-filter-btn {
    padding:10px 16px; border-radius:12px; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    border:1px solid rgba(255,255,255,0.08);
    background:rgba(255,255,255,0.03); color:rgba(255,255,255,0.5);
    transition:all 0.2s;
  }
  .sos-filter-btn:hover, .sos-filter-btn.active { background:rgba(249,115,22,0.1); border-color:rgba(249,115,22,0.3); color:#f97316; }
  .sos-filter-btn.danger.active { background:rgba(239,68,68,0.1); border-color:rgba(239,68,68,0.35); color:#f87171; }
  .sos-count-badge { margin-left:auto; font-size:12px; color:rgba(255,255,255,0.25); white-space:nowrap; }

  /* ── Cards Grid ── */
  .sos-cards-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(340px,1fr));
    gap:20px;
  }

  /* ── Alert Card ── */
  .sos-alert-card {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:20px; padding:24px;
    position:relative; overflow:hidden;
    transition:all 0.25s;
    animation:fadeUp 0.5s both;
    display:flex; flex-direction:column; gap:18px;
  }
  .sos-alert-card.active-alert {
    border-color:rgba(239,68,68,0.3);
    background:rgba(239,68,68,0.04);
    box-shadow:0 0 30px rgba(239,68,68,0.08);
    animation:fadeUp 0.5s both, cardPulse 3s ease-in-out infinite;
  }
  @keyframes cardPulse {
    0%,100% { box-shadow:0 0 30px rgba(239,68,68,0.08); }
    50%      { box-shadow:0 0 50px rgba(239,68,68,0.18); }
  }
  .sos-alert-card.active-alert:hover { transform:translateY(-4px); box-shadow:0 20px 50px rgba(239,68,68,0.2); }
  .sos-alert-card.resolved-alert { border-color:rgba(52,211,153,0.15); }
  .sos-alert-card.resolved-alert:hover { transform:translateY(-4px); box-shadow:0 20px 50px rgba(0,0,0,0.4); border-color:rgba(52,211,153,0.3); }

  /* top strip */
  .sos-card-strip {
    position:absolute; top:0; left:0; right:0; height:3px; border-radius:20px 20px 0 0;
  }
  .sos-card-strip.active-alert { background:linear-gradient(90deg,#ef4444,#f97316); animation:stripPulse 1.5s ease-in-out infinite alternate; }
  .sos-card-strip.resolved-alert { background:linear-gradient(90deg,#34d399,#059669); }
  @keyframes stripPulse {
    from { opacity:0.7; }
    to   { opacity:1; }
  }

  /* card header */
  .sos-card-header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
  .sos-card-user { display:flex; align-items:center; gap:12px; }
  .sos-user-avatar {
    width:44px; height:44px; border-radius:13px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-size:15px; font-weight:700; color:#fff;
    position:relative;
  }
  .sos-user-avatar.active-avatar {
    background:linear-gradient(135deg,#ef4444,#f97316);
    box-shadow:0 4px 16px rgba(239,68,68,0.4);
  }
  .sos-user-avatar.resolved-avatar {
    background:linear-gradient(135deg,#34d399,#059669);
    box-shadow:0 4px 14px rgba(52,211,153,0.25);
  }
  /* ping ring on active */
  .sos-user-avatar.active-avatar::after {
    content:'';
    position:absolute; inset:-4px;
    border-radius:17px;
    border:2px solid rgba(239,68,68,0.4);
    animation:ringPing 1.5s ease-out infinite;
  }
  @keyframes ringPing {
    0%   { transform:scale(1); opacity:0.8; }
    100% { transform:scale(1.3); opacity:0; }
  }

  .sos-user-name { font-size:14.5px; font-weight:600; color:#fff; }
  .sos-user-email { font-size:11.5px; color:rgba(255,255,255,0.32); margin-top:3px; }

  /* status badge */
  .sos-status-badge {
    flex-shrink:0; padding:5px 12px; border-radius:20px;
    font-size:11px; font-weight:700; letter-spacing:0.5px;
    display:flex; align-items:center; gap:6px;
  }
  .sos-status-badge.active-badge {
    background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.35); color:#f87171;
  }
  .sos-status-badge.active-badge::before {
    content:''; width:6px; height:6px; border-radius:50%;
    background:#ef4444; box-shadow:0 0 6px #ef4444;
    animation:pulse 1.2s infinite;
  }
  .sos-status-badge.resolved-badge {
    background:rgba(52,211,153,0.1); border:1px solid rgba(52,211,153,0.25); color:#6ee7b7;
  }

  /* SOS label */
  .sos-label-row { display:flex; align-items:center; gap:10px; }
  .sos-sos-tag {
    font-family:'Playfair Display',serif;
    font-size:20px; font-weight:800; letter-spacing:1px;
  }
  .sos-sos-tag.active  { color:#ef4444; text-shadow:0 0 20px rgba(239,68,68,0.5); }
  .sos-sos-tag.resolved { color:rgba(255,255,255,0.2); }
  .sos-sos-icon { font-size:22px; }

  /* time */
  .sos-card-time {
    font-size:12px; color:rgba(255,255,255,0.25);
    display:flex; align-items:center; gap:5px;
  }

  /* info grid */
  .sos-info-grid {
    display:grid; grid-template-columns:1fr 1fr; gap:10px;
  }
  .sos-info-item {
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05);
    border-radius:10px; padding:10px 13px;
  }
  .sos-info-label { font-size:10.5px; color:rgba(255,255,255,0.28); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:4px; }
  .sos-info-val { font-size:13.5px; font-weight:500; color:rgba(255,255,255,0.75); }

  /* resolve button */
  .sos-resolve-btn {
    width:100%; padding:12px; border:none; border-radius:12px;
    background:linear-gradient(135deg,#ef4444,#f97316);
    color:#fff; font-family:'DM Sans',sans-serif;
    font-size:14px; font-weight:600; cursor:pointer;
    box-shadow:0 6px 20px rgba(239,68,68,0.35);
    transition:transform 0.2s, box-shadow 0.2s;
    position:relative; overflow:hidden;
    display:flex; align-items:center; justify-content:center; gap:8px;
    letter-spacing:0.3px;
  }
  .sos-resolve-btn:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(239,68,68,0.5); }
  .sos-resolve-btn:active { transform:translateY(0); }
  .sos-resolve-btn:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
  .sos-resolve-btn::after {
    content:''; position:absolute; top:0; left:-100%;
    width:60%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
    transform:skewX(-20deg); animation:shimmer 2.5s 0.5s infinite;
  }
  @keyframes shimmer { 0%{left:-100%} 100%{left:160%} }

  .sos-resolved-tag {
    font-size:13px; color:#6ee7b7;
    display:flex; align-items:center; justify-content:center; gap:6px;
    padding:10px;
    background:rgba(52,211,153,0.06); border:1px solid rgba(52,211,153,0.15); border-radius:12px;
  }

  /* ── Spinner ── */
  .sos-spinner {
    display:inline-block; width:14px; height:14px;
    border:2px solid rgba(255,255,255,0.3); border-top-color:#fff;
    border-radius:50%; animation:spin 0.6s linear infinite;
  }

  /* ── Empty ── */
  .sos-empty { text-align:center; padding:80px 0; animation:fadeUp 0.6s both; }
  .sos-empty-icon { font-size:56px; margin-bottom:16px; opacity:0.4; }
  .sos-empty h3 { font-family:'Playfair Display',serif; font-size:22px; color:rgba(255,255,255,0.4); margin-bottom:8px; }
  .sos-empty p { font-size:13.5px; color:rgba(255,255,255,0.2); }

  /* ── Loading ── */
  .sos-loading { min-height:100vh; background:#0a0f1e; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; }
  .sos-loading-ring { width:48px;height:48px;border:3px solid rgba(239,68,68,0.15);border-top-color:#ef4444;border-radius:50%;animation:spin 0.8s linear infinite; }
  .sos-loading p { color:rgba(255,255,255,0.3); font-size:14px; }

  /* ── Toast ── */
  .sos-toast {
    position:fixed; bottom:28px; right:28px; z-index:999;
    padding:13px 20px; border-radius:14px;
    font-size:13.5px; font-family:'DM Sans',sans-serif;
    display:flex; align-items:center; gap:10px;
    backdrop-filter:blur(20px);
    animation:toastIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
    box-shadow:0 16px 40px rgba(0,0,0,0.4);
  }
  .sos-toast.success { background:rgba(52,211,153,0.12); border:1px solid rgba(52,211,153,0.3); color:#6ee7b7; }
  .sos-toast.error   { background:rgba(239,68,68,0.1);  border:1px solid rgba(239,68,68,0.3);  color:#fca5a5; }
  @keyframes toastIn { from{opacity:0;transform:translateY(16px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);} }

  @keyframes spin  { to { transform:rotate(360deg); } }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(1.5);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }

  @media(max-width:900px) {
    .sos-main { padding:24px 20px; }
    .sos-stats-row { grid-template-columns:1fr 1fr; }
    .sos-cards-grid { grid-template-columns:1fr; }
  }
`;

const NAV_ITEMS = [
  { icon:"🏠", label:"Manage Rooms",      path:"/admin/rooms"      },
  { icon:"🎓", label:"Student Dashboard", path:"/student"          },
  { icon:"👥", label:"Manage Students",   path:"/admin/students"   },
  { icon:"📋", label:"Entry Logs",        path:"/admin/logs"       },
  { icon:"💬", label:"Complaints",        path:"/admin/complaints" },
  { icon:"🚨", label:"SOS Alerts",        path:"/admin/sos",       active:true },
  { icon:"💰", label:"Rent Management",   path:"/admin/rent"       },
  { icon:"📊", label:"Analytics",         path:"/admin/analytics"  },
];

function getInitials(name) {
  return name ? name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "?";
}

function formatDateTime(dt) {
  if (!dt) return { date:"—", time:"—" };
  const d = new Date(dt);
  return {
    date: d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
    time: d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true }),
  };
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`sos-toast ${type}`}>{type === "success" ? "✅" : "⚠"} {msg}</div>;
}

export default function SOSAlerts() {
  const [alerts,    setAlerts]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [resolving, setResolving] = useState({});
  const [toast,     setToast]     = useState(null);
  const [filter,    setFilter]    = useState("all");

  // Poll SOS alerts while this screen is open.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchAlerts();
    const timer = setInterval(fetchAlerts, 5000);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/sos`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Active alerts first
      data.sort((a, b) => (a.status === "Active" ? -1 : 1));
      setAlerts(data);
    } catch {
      showToast("Failed to fetch SOS alerts", "error");
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (id) => {
    setResolving(r => ({ ...r, [id]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/sos/${id}`, {
        method: "PUT", headers: authHeaders(), body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error();
      showToast("SOS alert resolved successfully");
      fetchAlerts();
    } catch {
      showToast("Failed to resolve alert", "error");
    } finally {
      setResolving(r => ({ ...r, [id]: false }));
    }
  };

  const activeCount   = alerts.filter(a => a.status === "Active").length;
  const resolvedCount = alerts.filter(a => a.status !== "Active").length;

  const filtered = alerts.filter(a =>
    filter === "all"      ? true :
    filter === "active"   ? a.status === "Active" :
    a.status !== "Active"
  );

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="sos-loading">
        <div className="sos-loading-ring" />
        <p>Loading SOS alerts…</p>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="sos-root">
        <div className="sos-blob sos-blob-1" />
        <div className="sos-blob sos-blob-2" />
        <div className="sos-blob sos-blob-3" />
        <div className="sos-grid" />

        {/* ── Sidebar ── */}
        <aside className="sos-sidebar">
          <div className="sos-sidebar-logo">🏠</div>
          {NAV_ITEMS.map((item, i) => (
            <button key={i}
              className={`sos-nav-btn ${item.active ? "active" : ""}`}
              onClick={() => { window.location.href = item.path; }}
            >
              {item.icon}
              <span className="sos-tooltip">{item.label}</span>
            </button>
          ))}
          <div className="sos-sidebar-spacer" />
          <button className="sos-logout-btn" onClick={() => {
            clearAuth();
            window.location.href = "/";
          }}>↩</button>
        </aside>

        {/* ── Main ── */}
        <main className="sos-main">

          {/* Top Bar */}
          <div className="sos-topbar">
            <div className="sos-topbar-left">
              <h1>SOS <span>Alerts</span></h1>
              <p>SafeNest · Emergency notifications from students</p>
            </div>
            <div className="sos-topbar-right">
              {activeCount > 0 && (
                <div className="sos-live-badge">
                  <div className="sos-live-dot" />
                  {activeCount} Active Emergency{activeCount > 1 ? "s" : ""}
                </div>
              )}
              <button className="sos-back-btn" onClick={() => { window.location.href = "/admin"; }}>
                ← Dashboard
              </button>
              <div className="sos-avatar">A</div>
            </div>
          </div>

          {/* Stats */}
          <div className="sos-stats-row">
            {[
              { icon:"🚨", label:"Total Alerts",    val:alerts.length,  color:"#f97316", bg:"rgba(249,115,22,0.12)", bc:"rgba(249,115,22,0.2)"  },
              { icon:"🔴", label:"Active Now",       val:activeCount,    color:"#ef4444", bg:"rgba(239,68,68,0.12)",  bc:"rgba(239,68,68,0.25)"   },
              { icon:"✅", label:"Resolved",         val:resolvedCount,  color:"#34d399", bg:"rgba(52,211,153,0.1)",  bc:"rgba(52,211,153,0.2)"   },
            ].map(({ icon, label, val, color, bg, bc }) => (
              <div className="sos-mini-stat" key={label}>
                <div className="sos-mini-icon" style={{ background:bg, border:`1px solid ${bc}` }}>{icon}</div>
                <div>
                  <div className="sos-mini-val" style={{ color }}>{val}</div>
                  <div className="sos-mini-lbl">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="sos-toolbar">
            {[
              { key:"all",      label:"All Alerts"       },
              { key:"active",   label:"🔴 Active",  danger:true },
              { key:"resolved", label:"✅ Resolved"       },
            ].map(({ key, label, danger }) => (
              <button key={key}
                className={`sos-filter-btn ${filter === key ? "active" : ""} ${danger ? "danger" : ""}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
            <span className="sos-count-badge">{filtered.length} alert{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Section */}
          <div className="sos-section-label">Alert Feed</div>
          <div className="sos-divider" />

          {filtered.length === 0 ? (
            <div className="sos-empty">
              <div className="sos-empty-icon">{filter === "active" ? "🟢" : "🚨"}</div>
              <h3>{filter === "active" ? "No active emergencies" : "No alerts found"}</h3>
              <p>{filter === "active" ? "All students are safe right now" : "SOS alerts will appear here when triggered"}</p>
            </div>
          ) : (
            <div className="sos-cards-grid">
              {filtered.map((a, idx) => {
                const isActive  = a.status === "Active";
                const cardClass = isActive ? "active-alert" : "resolved-alert";
                const dt = formatDateTime(a.createdAt);
                return (
                  <div className={`sos-alert-card ${cardClass}`} key={a._id}
                    style={{ animationDelay:`${0.05 * idx}s` }}
                  >
                    <div className={`sos-card-strip ${cardClass}`} />

                    {/* Header */}
                    <div className="sos-card-header">
                      <div className="sos-card-user">
                        <div className={`sos-user-avatar ${isActive ? "active-avatar" : "resolved-avatar"}`}>
                          {getInitials(a.student?.name)}
                        </div>
                        <div>
                          <div className="sos-user-name">{a.student?.name || "Unknown"}</div>
                          <div className="sos-user-email">{a.student?.email || ""}</div>
                        </div>
                      </div>
                      <div className={`sos-status-badge ${isActive ? "active-badge" : "resolved-badge"}`}>
                        {isActive ? "ACTIVE" : "Resolved"}
                      </div>
                    </div>

                    {/* SOS label */}
                    <div className="sos-label-row">
                      <span className="sos-sos-icon">{isActive ? "🚨" : "🛡️"}</span>
                      <span className={`sos-sos-tag ${isActive ? "active" : "resolved"}`}>
                        {isActive ? "EMERGENCY SOS" : "SOS — Resolved"}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="sos-info-grid">
                      <div className="sos-info-item">
                        <div className="sos-info-label">Triggered At</div>
                        <div className="sos-info-val">{dt.time}</div>
                      </div>
                      <div className="sos-info-item">
                        <div className="sos-info-label">Date</div>
                        <div className="sos-info-val">{dt.date}</div>
                      </div>
                      <div className="sos-info-item">
                        <div className="sos-info-label">Room</div>
                        <div className="sos-info-val" style={{color:"#f97316"}}>
                          {a.student?.room?.roomNumber || "N/A"}
                        </div>
                      </div>
                      <div className="sos-info-item">
                        <div className="sos-info-label">Priority</div>
                        <div className="sos-info-val" style={{color: isActive ? "#ef4444" : "#34d399"}}>
                          {isActive ? "🔴 High" : "✅ Cleared"}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    {isActive ? (
                      <button
                        className="sos-resolve-btn"
                        disabled={resolving[a._id]}
                        onClick={() => resolveAlert(a._id)}
                      >
                        {resolving[a._id]
                          ? <><span className="sos-spinner" /> Resolving…</>
                          : <>🛡️ Mark as Resolved</>
                        }
                      </button>
                    ) : (
                      <div className="sos-resolved-tag">✅ Emergency Resolved</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
