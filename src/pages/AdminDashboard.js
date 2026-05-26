import { useEffect, useState } from "react";
import { API_BASE_URL, clearAuth } from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ad-root {
    min-height: 100vh;
    background: #0a0f1e;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    overflow-x: hidden;
    position: relative;
  }

  /* ── Ambient blobs ── */
  .ad-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.13;
    pointer-events: none;
    animation: blobFloat 9s ease-in-out infinite alternate;
  }
  .ad-blob-1 { width:600px;height:600px;background:radial-gradient(circle,#f97316,#ea580c);top:-160px;right:-120px;animation-delay:0s; }
  .ad-blob-2 { width:400px;height:400px;background:radial-gradient(circle,#fb923c,#f59e0b);bottom:-100px;left:-80px;animation-delay:3.5s; }
  .ad-blob-3 { width:300px;height:300px;background:radial-gradient(circle,#fcd34d,#f97316);top:40%;left:38%;animation-delay:1.8s; }
  @keyframes blobFloat {
    0%   { transform: scale(1) translate(0,0); }
    100% { transform: scale(1.1) translate(18px,-18px); }
  }

  /* ── Grid ── */
  .ad-grid {
    position: fixed; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(249,115,22,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(249,115,22,0.035) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  /* ── Sidebar ── */
  .ad-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0; width: 72px;
    background: rgba(255,255,255,0.02);
    border-right: 1px solid rgba(249,115,22,0.1);
    backdrop-filter: blur(20px);
    display: flex; flex-direction: column; align-items: center;
    padding: 24px 0; gap: 8px; z-index: 100;
    animation: slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes slideInLeft {
    from { opacity:0; transform: translateX(-20px); }
    to   { opacity:1; transform: translateX(0); }
  }

  .ad-sidebar-logo {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #f97316, #fbbf24);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    margin-bottom: 16px;
    box-shadow: 0 8px 24px rgba(249,115,22,0.45);
    flex-shrink: 0;
  }

  .ad-nav-btn {
    width: 48px; height: 48px;
    border-radius: 14px;
    border: 1px solid transparent;
    background: transparent;
    color: rgba(255,255,255,0.35);
    font-size: 20px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
    position: relative;
  }
  .ad-nav-btn:hover, .ad-nav-btn.active {
    background: rgba(249,115,22,0.12);
    border-color: rgba(249,115,22,0.3);
    color: #f97316;
    box-shadow: 0 0 20px rgba(249,115,22,0.15);
  }
  .ad-nav-btn .ad-tooltip {
    position: absolute; left: 62px;
    background: rgba(15,20,40,0.95);
    border: 1px solid rgba(249,115,22,0.2);
    color: #fff; font-size: 12px; font-family: 'DM Sans', sans-serif;
    padding: 5px 10px; border-radius: 8px;
    white-space: nowrap; pointer-events: none;
    opacity: 0; transform: translateX(-6px);
    transition: all 0.18s; z-index: 200;
  }
  .ad-nav-btn:hover .ad-tooltip { opacity:1; transform: translateX(0); }

  /* logout at bottom */
  .ad-sidebar-spacer { flex: 1; }
  .ad-logout-btn {
    width: 44px; height: 44px;
    border-radius: 12px; border: 1px solid rgba(239,68,68,0.25);
    background: rgba(239,68,68,0.06);
    color: rgba(239,68,68,0.6);
    font-size: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .ad-logout-btn:hover { background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.5); }

  /* ── Main Content ── */
  .ad-main {
    margin-left: 72px;
    padding: 40px 48px;
    position: relative; z-index: 1;
    animation: fadeIn 0.5s 0.1s both;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  /* ── Top Bar ── */
  .ad-topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 40px;
    animation: fadeUp 0.6s 0.1s both;
  }

  .ad-topbar-left h1 {
    font-family: 'Playfair Display', serif;
    font-size: 34px; font-weight: 800;
    letter-spacing: -0.8px; line-height: 1.1;
  }
  .ad-topbar-left h1 span { color: #f97316; }
  .ad-topbar-left p {
    color: rgba(255,255,255,0.38);
    font-size: 13.5px; margin-top: 5px; font-weight: 300;
  }

  .ad-topbar-right {
    display: flex; align-items: center; gap: 14px;
  }
  .ad-badge {
    background: rgba(249,115,22,0.12);
    border: 1px solid rgba(249,115,22,0.25);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 12.5px; font-weight: 500;
    color: #fb923c;
    display: flex; align-items: center; gap: 6px;
  }
  .ad-badge::before {
    content: '';
    width: 7px; height: 7px;
    background: #f97316; border-radius: 50%;
    box-shadow: 0 0 6px #f97316;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.5; transform:scale(1.4); }
  }

  .ad-avatar {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, #f97316, #fbbf24);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 700; color: #fff;
    box-shadow: 0 4px 16px rgba(249,115,22,0.35);
  }

  .ad-bell {
    width: 40px; height: 40px; border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.68);
    display: flex; align-items: center; justify-content: center;
    position: relative; cursor: pointer;
    transition: all 0.2s;
    font-size: 17px;
  }
  .ad-bell:hover {
    border-color: rgba(249,115,22,0.35);
    background: rgba(249,115,22,0.08);
    color: #f97316;
  }
  .ad-bell-count {
    position: absolute; top: -5px; right: -5px;
    min-width: 18px; height: 18px; padding: 0 5px;
    border-radius: 999px;
    background: #ef4444;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 16px rgba(239,68,68,0.5);
  }

  /* ── Section Label ── */
  .ad-section-label {
    font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 1.5px;
    color: rgba(255,255,255,0.25);
    margin-bottom: 16px;
  }

  /* ── Stat Cards ── */
  .ad-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }

  .ad-stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 26px 24px;
    position: relative; overflow: hidden;
    cursor: default;
    transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
    animation: fadeUp 0.6s both;
  }
  .ad-stat-card:nth-child(1) { animation-delay: 0.15s; }
  .ad-stat-card:nth-child(2) { animation-delay: 0.22s; }
  .ad-stat-card:nth-child(3) { animation-delay: 0.29s; }
  .ad-stat-card:nth-child(4) { animation-delay: 0.36s; }

  .ad-stat-card:hover {
    transform: translateY(-4px);
    border-color: rgba(249,115,22,0.3);
    box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(249,115,22,0.08);
  }

  /* glow ring on hover */
  .ad-stat-card::before {
    content: '';
    position: absolute; inset: 0; border-radius: 20px;
    background: radial-gradient(circle at 80% 20%, rgba(249,115,22,0.07), transparent 60%);
    opacity: 0; transition: opacity 0.3s;
  }
  .ad-stat-card:hover::before { opacity: 1; }

  .ad-stat-icon {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 18px;
  }

  .ad-stat-label {
    font-size: 12px; font-weight: 500;
    color: rgba(255,255,255,0.38);
    text-transform: uppercase; letter-spacing: 0.8px;
    margin-bottom: 8px;
  }

  .ad-stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 44px; font-weight: 800;
    line-height: 1; letter-spacing: -1px;
  }

  .ad-stat-sub {
    font-size: 12px; color: rgba(255,255,255,0.25);
    margin-top: 10px;
    display: flex; align-items: center; gap: 5px;
  }

  /* occupancy bar */
  .ad-occ-bar-wrap {
    margin-top: 14px;
    height: 4px; border-radius: 4px;
    background: rgba(255,255,255,0.07); overflow: hidden;
  }
  .ad-occ-bar {
    height: 100%; border-radius: 4px;
    background: linear-gradient(90deg, #f97316, #fbbf24);
    animation: barGrow 1s 0.5s cubic-bezier(0.16,1,0.3,1) both;
    transform-origin: left;
  }
  @keyframes barGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  /* ── Quick Actions ── */
  .ad-actions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 40px;
  }

  .ad-action-btn {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 18px 16px;
    cursor: pointer;
    display: flex; align-items: center; gap: 13px;
    transition: all 0.22s;
    animation: fadeUp 0.6s both;
    text-align: left;
  }
  .ad-action-btn:nth-child(1) { animation-delay: 0.2s; }
  .ad-action-btn:nth-child(2) { animation-delay: 0.25s; }
  .ad-action-btn:nth-child(3) { animation-delay: 0.3s; }
  .ad-action-btn:nth-child(4) { animation-delay: 0.35s; }
  .ad-action-btn:nth-child(5) { animation-delay: 0.4s; }
  .ad-action-btn:nth-child(6) { animation-delay: 0.45s; }
  .ad-action-btn:nth-child(7) { animation-delay: 0.5s; }
  .ad-action-btn:nth-child(8) { animation-delay: 0.55s; }

  .ad-action-btn:hover {
    background: rgba(249,115,22,0.08);
    border-color: rgba(249,115,22,0.3);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }

  .ad-action-icon {
    width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
    background: rgba(249,115,22,0.1);
    border: 1px solid rgba(249,115,22,0.15);
    transition: background 0.2s;
  }
  .ad-action-btn:hover .ad-action-icon {
    background: rgba(249,115,22,0.2);
  }

  .ad-action-text { flex: 1; }
  .ad-action-name {
    font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.85);
    margin-bottom: 2px;
  }
  .ad-action-desc {
    font-size: 11px; color: rgba(255,255,255,0.28); font-weight: 300;
  }
  .ad-action-arrow {
    color: rgba(249,115,22,0.4); font-size: 14px;
    transition: transform 0.2s, color 0.2s;
  }
  .ad-action-btn:hover .ad-action-arrow {
    color: #f97316; transform: translateX(3px);
  }

  /* ── Loading ── */
  .ad-loading {
    min-height: 100vh; background: #0a0f1e;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
  }
  .ad-loading-ring {
    width: 48px; height: 48px;
    border: 3px solid rgba(249,115,22,0.15);
    border-top-color: #f97316;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ad-loading p {
    font-family: 'DM Sans', sans-serif;
    color: rgba(255,255,255,0.3); font-size: 14px;
  }

  /* ── Divider ── */
  .ad-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(249,115,22,0.18), transparent);
    margin: 8px 0 28px;
  }

  @keyframes fadeUp {
    from { opacity:0; transform: translateY(18px); }
    to   { opacity:1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .ad-stats-grid { grid-template-columns: repeat(2, 1fr); }
    .ad-actions-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .ad-main { padding: 24px 20px; }
    .ad-stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
    .ad-actions-grid { grid-template-columns: 1fr 1fr; }
    .ad-topbar-left h1 { font-size: 26px; }
  }
`;

const NAV_ITEMS = [
  { icon: "🏠", label: "Manage Rooms",       path: "/admin/rooms"      },
  { icon: "🎓", label: "Student Dashboard",  path: "/student"          },
  { icon: "👥", label: "Manage Students",    path: "/admin/students"   },
  { icon: "📋", label: "Entry Logs",         path: "/admin/logs"       },
  { icon: "💬", label: "Manage Complaints",  path: "/admin/complaints" },
  { icon: "🚨", label: "SOS Alerts",         path: "/admin/sos"        },
  { icon: "💰", label: "Rent Management",    path: "/admin/rent"       },
  { icon: "📊", label: "Analytics",          path: "/admin/analytics"  },
];

const STAT_CONFIG = [
  { key: "totalRooms",        label: "Total Rooms",        icon: "RM",  color: "#f97316", bg: "rgba(249,115,22,0.12)"  },
  { key: "totalStudents",     label: "Total Students",     icon: "ST",  color: "#22d3ee", bg: "rgba(34,211,238,0.12)"  },
  { key: "occupiedRooms",     label: "Occupied Rooms",     icon: "OC",  color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  { key: "availableRooms",    label: "Available Rooms",    icon: "AV",  color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
  { key: "pendingComplaints", label: "Pending Complaints", icon: "CP",  color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  { key: "sos",               label: "Active SOS",         icon: "SOS", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState(null);
  const [activeSos, setActiveSos] = useState([]);

  // Load dashboard data once and poll SOS in the background.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { 
    fetchStats(); 
    fetchSosAlerts();
    const interval = setInterval(fetchSosAlerts, 5000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const playSosSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "square";
      oscillator.frequency.value = 800; // Beep
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
    } catch(e) {}
  };

  const fetchSosAlerts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/sos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const pending = data.filter(a => a.status === "Active");
        setActiveSos(prev => {
          if(pending.length > prev.length) playSosSound();
          return pending;
        });
      }
    } catch {}
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setStats(data);
    } catch {
      setError("Failed to load dashboard stats.");
    }
  };

  const navigate = (path) => { window.location.href = path; };

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  if (!stats && !error) return (
    <>
      <style>{styles}</style>
      <div className="ad-loading">
        <div className="ad-loading-ring" />
        <p>Loading dashboard…</p>
      </div>
    </>
  );

  const occupancyPct = stats?.occupancyRate ?? (
    stats ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) || 0 : 0
  );

  return (
    <>
      <style>{styles}</style>
      <div className="ad-root">
        {activeSos.length > 0 && (
          <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 9999,
            background: "rgba(239, 68, 68, 0.95)", border: "1px solid #f87171",
            borderRadius: 16, padding: 20, color: "#fff",
            boxShadow: "0 10px 40px rgba(239, 68, 68, 0.5)",
            animation: "pulse 1.5s infinite"
          }}>
            <h3 style={{fontSize: 18, marginBottom: 10, display: "flex", alignItems: "center", gap: 8}}>
              <span style={{fontSize: 24}}>🚨</span> EMERGENCY SOS!
            </h3>
            {activeSos.map(alert => (
              <div key={alert._id} style={{fontSize: 14, marginBottom: 5}}>
                <strong>{alert.student?.name || "Unknown student"}</strong> (Room {alert.student?.room?.roomNumber || "Unassigned"}) - {new Date(alert.createdAt).toLocaleTimeString()}
              </div>
            ))}
            <button onClick={() => navigate("/admin/sos")} style={{
              marginTop: 10, width: "100%", padding: "8px", background: "#fff",
              color: "#ef4444", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer"
            }}>View Alerts</button>
          </div>
        )}

        {/* Blobs & Grid */}
        <div className="ad-blob ad-blob-1" />
        <div className="ad-blob ad-blob-2" />
        <div className="ad-blob ad-blob-3" />
        <div className="ad-grid" />

        {/* ── Sidebar ── */}
        <aside className="ad-sidebar">
          <div className="ad-sidebar-logo">🏠</div>
          {NAV_ITEMS.map((item, i) => (
            <button
              key={i}
              className={`ad-nav-btn ${activeNav === i ? "active" : ""}`}
              onClick={() => { setActiveNav(i); navigate(item.path); }}
            >
              {item.icon}
              <span className="ad-tooltip">{item.label}</span>
            </button>
          ))}
          <div className="ad-sidebar-spacer" />
          <button className="ad-logout-btn" onClick={handleLogout} title="Logout">↩</button>
        </aside>

        {/* ── Main ── */}
        <main className="ad-main">

          {/* Top Bar */}
          <div className="ad-topbar">
            <div className="ad-topbar-left">
              <h1>Admin <span>Dashboard</span></h1>
              <p>Safe<strong style={{color:"#f97316"}}>Nest</strong> · Smart Hostel Management · {new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long" })}</p>
            </div>
            <div className="ad-topbar-right">
              <div className="ad-badge">System Online</div>
              <button className="ad-bell" title="SOS notifications" onClick={() => navigate("/admin/sos")}>
                !
                {activeSos.length > 0 && <span className="ad-bell-count">{activeSos.length}</span>}
              </button>
              <div className="ad-avatar">A</div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"12px",padding:"12px 18px",color:"#fca5a5",marginBottom:"28px",fontSize:"14px"}}>
              ⚠ &nbsp;{error}
            </div>
          )}

          {/* Stat Cards */}
          <div className="ad-section-label">Overview</div>
          <div className="ad-divider" />
          <div className="ad-stats-grid">
            {STAT_CONFIG.map(({ key, label, icon, color, bg }) => (
              <div className="ad-stat-card" key={key}>
                <div className="ad-stat-icon" style={{ background: bg, border: `1px solid ${color}30` }}>
                  {icon}
                </div>
                <div className="ad-stat-label">{label}</div>
                <div className="ad-stat-value" style={{ color }}>{stats ? stats[key] : "—"}</div>
                {key === "occupiedRooms" && stats && (
                  <>
                    <div className="ad-stat-sub">
                      <span>{occupancyPct}% occupancy rate</span>
                    </div>
                    <div className="ad-occ-bar-wrap">
                      <div className="ad-occ-bar" style={{ width: `${occupancyPct}%` }} />
                    </div>
                  </>
                )}
                {key === "availableRooms" && stats && (
                  <div className="ad-stat-sub">
                    <span style={{color:"#34d399"}}>{stats.availableRooms} rooms free</span>
                  </div>
                )}
                {key === "pendingComplaints" && stats && (
                  <div className="ad-stat-sub"><span>Needs admin review</span></div>
                )}
                {key === "sos" && stats && (
                  <div className="ad-stat-sub"><span>Active emergency alerts</span></div>
                )}
                {key === "totalStudents" && stats && (
                  <div className="ad-stat-sub"><span>Enrolled residents</span></div>
                )}
                {key === "totalRooms" && stats && (
                  <div className="ad-stat-sub"><span>Across all floors</span></div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="ad-section-label">Quick Actions</div>
          <div className="ad-divider" />
          <div className="ad-actions-grid">
            {[
              { icon:"🏠", name:"Manage Rooms",      desc:"View & edit room inventory",   path:"/admin/rooms"      },
              { icon:"🎓", name:"Student Dashboard", desc:"See student portal view",       path:"/student"          },
              { icon:"👥", name:"Manage Students",   desc:"Add, edit, remove residents",  path:"/admin/students"   },
              { icon:"📋", name:"Entry Logs",        desc:"Gate & check-in history",       path:"/admin/logs"       },
              { icon:"💬", name:"Complaints",        desc:"Review pending complaints",     path:"/admin/complaints" },
              { icon:"🚨", name:"SOS Alerts",        desc:"Emergency notifications",       path:"/admin/sos"        },
              { icon:"💰", name:"Rent Management",   desc:"Dues, payments & receipts",     path:"/admin/rent"       },
              { icon:"📊", name:"Analytics",         desc:"Reports & occupancy trends",    path:"/admin/analytics"  },
            ].map((item, i) => (
              <button key={i} className="ad-action-btn" onClick={() => navigate(item.path)}>
                <div className="ad-action-icon">{item.icon}</div>
                <div className="ad-action-text">
                  <div className="ad-action-name">{item.name}</div>
                  <div className="ad-action-desc">{item.desc}</div>
                </div>
                <span className="ad-action-arrow">→</span>
              </button>
            ))}
          </div>

        </main>
      </div>
    </>
  );
}

export default AdminDashboard;
