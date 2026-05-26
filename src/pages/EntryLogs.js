import { useEffect, useState } from "react";
import { API_BASE_URL, clearAuth } from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .el-root {
    min-height: 100vh;
    background: #0a0f1e;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    overflow-x: hidden;
    position: relative;
  }

  /* ── Blobs ── */
  .el-blob {
    position: fixed; border-radius: 50%;
    filter: blur(90px); opacity: 0.13;
    pointer-events: none;
    animation: blobFloat 9s ease-in-out infinite alternate;
  }
  .el-blob-1 { width:560px;height:560px;background:radial-gradient(circle,#f97316,#ea580c);top:-140px;right:-100px;animation-delay:0s; }
  .el-blob-2 { width:380px;height:380px;background:radial-gradient(circle,#fb923c,#f59e0b);bottom:-80px;left:-60px;animation-delay:3s; }
  .el-blob-3 { width:280px;height:280px;background:radial-gradient(circle,#fcd34d,#f97316);top:45%;left:40%;animation-delay:1.5s; }
  @keyframes blobFloat {
    0%   { transform: scale(1) translate(0,0); }
    100% { transform: scale(1.1) translate(16px,-16px); }
  }

  /* ── Grid ── */
  .el-grid {
    position: fixed; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(249,115,22,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(249,115,22,0.035) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  /* ── Sidebar ── */
  .el-sidebar {
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
  .el-sidebar-logo {
    width:44px; height:44px; border-radius:14px;
    background: linear-gradient(135deg,#f97316,#fbbf24);
    display: flex; align-items: center; justify-content: center;
    font-size:20px; margin-bottom:16px;
    box-shadow: 0 8px 24px rgba(249,115,22,0.45); flex-shrink:0;
  }
  .el-nav-btn {
    width:48px; height:48px; border-radius:14px;
    border:1px solid transparent; background:transparent;
    color:rgba(255,255,255,0.35); font-size:20px;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    transition:all 0.2s; position:relative;
  }
  .el-nav-btn:hover, .el-nav-btn.active {
    background:rgba(249,115,22,0.12); border-color:rgba(249,115,22,0.3);
    color:#f97316; box-shadow:0 0 20px rgba(249,115,22,0.15);
  }
  .el-nav-btn .el-tooltip {
    position:absolute; left:62px;
    background:rgba(15,20,40,0.95); border:1px solid rgba(249,115,22,0.2);
    color:#fff; font-size:12px; font-family:'DM Sans',sans-serif;
    padding:5px 10px; border-radius:8px;
    white-space:nowrap; pointer-events:none;
    opacity:0; transform:translateX(-6px);
    transition:all 0.18s; z-index:200;
  }
  .el-nav-btn:hover .el-tooltip { opacity:1; transform:translateX(0); }
  .el-sidebar-spacer { flex:1; }
  .el-logout-btn {
    width:44px; height:44px; border-radius:12px;
    border:1px solid rgba(239,68,68,0.25);
    background:rgba(239,68,68,0.06); color:rgba(239,68,68,0.6);
    font-size:18px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:all 0.2s;
  }
  .el-logout-btn:hover { background:rgba(239,68,68,0.15); color:#f87171; border-color:rgba(239,68,68,0.5); }

  /* ── Main ── */
  .el-main {
    margin-left: 72px;
    padding: 40px 48px;
    position: relative; z-index: 1;
  }

  /* ── Top Bar ── */
  .el-topbar {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:40px;
    animation: fadeUp 0.6s 0.1s both;
  }
  .el-topbar-left h1 {
    font-family:'Playfair Display',serif;
    font-size:34px; font-weight:800;
    letter-spacing:-0.8px; line-height:1.1;
  }
  .el-topbar-left h1 span { color:#f97316; }
  .el-topbar-left p { color:rgba(255,255,255,0.38); font-size:13.5px; margin-top:5px; font-weight:300; }
  .el-topbar-right { display:flex; align-items:center; gap:14px; }
  .el-back-btn {
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
    border-radius:12px; padding:9px 18px; color:rgba(255,255,255,0.6);
    font-family:'DM Sans',sans-serif; font-size:13.5px; cursor:pointer;
    display:flex; align-items:center; gap:7px; transition:all 0.2s;
  }
  .el-back-btn:hover { border-color:rgba(249,115,22,0.35); color:#f97316; background:rgba(249,115,22,0.07); }
  .el-refresh-btn {
    background:rgba(249,115,22,0.1); border:1px solid rgba(249,115,22,0.25);
    border-radius:12px; padding:9px 16px; color:#f97316;
    font-family:'DM Sans',sans-serif; font-size:13.5px; cursor:pointer;
    display:flex; align-items:center; gap:7px; transition:all 0.2s;
  }
  .el-refresh-btn:hover { background:rgba(249,115,22,0.18); }
  .el-refresh-btn.spinning span { display:inline-block; animation:spin 0.7s linear infinite; }
  .el-avatar {
    width:40px; height:40px; border-radius:12px;
    background:linear-gradient(135deg,#f97316,#fbbf24);
    display:flex; align-items:center; justify-content:center;
    font-size:16px; font-weight:700; color:#fff;
    box-shadow:0 4px 16px rgba(249,115,22,0.35);
  }

  /* ── Divider ── */
  .el-section-label {
    font-size:11px; font-weight:600;
    text-transform:uppercase; letter-spacing:1.5px;
    color:rgba(255,255,255,0.25); margin-bottom:16px;
  }
  .el-divider {
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(249,115,22,0.18),transparent);
    margin:8px 0 28px;
  }

  /* ── Stats Row ── */
  .el-stats-row {
    display:grid; grid-template-columns:repeat(4,1fr);
    gap:16px; margin-bottom:32px;
    animation:fadeUp 0.6s 0.15s both;
  }
  .el-mini-stat {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; padding:18px 20px;
    display:flex; align-items:center; gap:14px;
    transition:all 0.22s;
  }
  .el-mini-stat:hover { border-color:rgba(249,115,22,0.25); transform:translateY(-2px); }
  .el-mini-icon {
    width:40px; height:40px; border-radius:10px;
    display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;
  }
  .el-mini-val {
    font-family:'Playfair Display',serif;
    font-size:26px; font-weight:800; line-height:1;
  }
  .el-mini-lbl { font-size:11.5px; color:rgba(255,255,255,0.3); margin-top:3px; }

  /* ── Toolbar ── */
  .el-toolbar {
    display:flex; align-items:center; gap:14px; margin-bottom:28px; flex-wrap:wrap;
    animation:fadeUp 0.6s 0.2s both;
  }
  .el-search-wrap { position:relative; flex:1; min-width:200px; max-width:360px; }
  .el-search-icon {
    position:absolute; left:14px; top:50%; transform:translateY(-50%);
    font-size:15px; color:rgba(249,115,22,0.45); pointer-events:none;
  }
  .el-search {
    width:100%; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08); border-radius:12px;
    padding:11px 16px 11px 40px; color:#fff;
    font-family:'DM Sans',sans-serif; font-size:14px; outline:none;
    transition:all 0.22s;
  }
  .el-search::placeholder { color:rgba(255,255,255,0.2); }
  .el-search:focus {
    background:rgba(249,115,22,0.06);
    border-color:rgba(249,115,22,0.45);
    box-shadow:0 0 0 3px rgba(249,115,22,0.1);
  }
  .el-filter-btn {
    padding:10px 16px; border-radius:12px; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    border:1px solid rgba(255,255,255,0.08);
    background:rgba(255,255,255,0.03); color:rgba(255,255,255,0.5);
    transition:all 0.2s;
  }
  .el-filter-btn:hover, .el-filter-btn.active {
    background:rgba(249,115,22,0.1); border-color:rgba(249,115,22,0.3); color:#f97316;
  }
  .el-count-badge {
    margin-left:auto;
    font-size:12px; color:rgba(255,255,255,0.25);
    white-space:nowrap;
  }

  /* ── Table Card ── */
  .el-table-card {
    background:rgba(255,255,255,0.02);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:20px; overflow:hidden;
    animation:fadeUp 0.6s 0.25s both;
  }

  /* header row */
  .el-table-head {
    display:grid;
    grid-template-columns: 2fr 2.2fr 1fr 2fr 2fr 1.2fr;
    padding:14px 24px;
    background:rgba(249,115,22,0.05);
    border-bottom:1px solid rgba(255,255,255,0.06);
  }
  .el-th {
    font-size:11px; font-weight:600;
    text-transform:uppercase; letter-spacing:1.2px;
    color:rgba(255,255,255,0.3);
  }

  /* data rows */
  .el-table-body {}
  .el-table-row {
    display:grid;
    grid-template-columns: 2fr 2.2fr 1fr 2fr 2fr 1.2fr;
    padding:16px 24px;
    border-bottom:1px solid rgba(255,255,255,0.04);
    align-items:center;
    transition:background 0.18s;
    animation:fadeUp 0.4s both;
  }
  .el-table-row:last-child { border-bottom:none; }
  .el-table-row:hover { background:rgba(249,115,22,0.04); }

  /* student cell */
  .el-cell-student { display:flex; align-items:center; gap:10px; }
  .el-row-avatar {
    width:32px; height:32px; border-radius:9px; flex-shrink:0;
    background:linear-gradient(135deg,#f97316,#fbbf24);
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:700; color:#fff;
  }
  .el-row-name { font-size:13.5px; font-weight:500; color:#fff; }

  /* generic cell */
  .el-cell { font-size:13px; color:rgba(255,255,255,0.55); }
  .el-cell.room {
    font-size:12.5px; font-weight:600;
    color:#f97316; background:rgba(249,115,22,0.1);
    border:1px solid rgba(249,115,22,0.2);
    border-radius:8px; padding:3px 10px;
    display:inline-block;
  }
  .el-cell.room.na { background:rgba(255,255,255,0.04); border-color:rgba(255,255,255,0.08); color:rgba(255,255,255,0.3); }

  /* time cell */
  .el-time-wrap {}
  .el-time-main { font-size:13px; color:rgba(255,255,255,0.75); font-weight:500; }
  .el-time-sub { font-size:11px; color:rgba(255,255,255,0.28); margin-top:2px; }

  /* status badge */
  .el-status {
    display:inline-flex; align-items:center; gap:6px;
    padding:5px 12px; border-radius:20px;
    font-size:11.5px; font-weight:600; letter-spacing:0.3px;
  }
  .el-status.inside {
    background:rgba(52,211,153,0.1); border:1px solid rgba(52,211,153,0.25); color:#6ee7b7;
  }
  .el-status.inside::before {
    content:''; width:6px; height:6px; border-radius:50%;
    background:#34d399; box-shadow:0 0 6px #34d399;
    animation:pulse 2s infinite;
  }
  .el-status.outside {
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); color:rgba(255,255,255,0.4);
  }
  @keyframes pulse {
    0%,100%{opacity:1;transform:scale(1);}
    50%{opacity:0.5;transform:scale(1.4);}
  }

  /* duration pill */
  .el-duration {
    font-size:11px; color:rgba(249,115,22,0.7);
    background:rgba(249,115,22,0.07); border:1px solid rgba(249,115,22,0.15);
    border-radius:8px; padding:2px 8px; margin-top:4px;
    display:inline-block;
  }

  /* ── Empty ── */
  .el-empty {
    text-align:center; padding:72px 0;
  }
  .el-empty-icon { font-size:48px; margin-bottom:14px; opacity:0.4; }
  .el-empty h3 { font-family:'Playfair Display',serif; font-size:20px; color:rgba(255,255,255,0.35); margin-bottom:8px; }
  .el-empty p { font-size:13px; color:rgba(255,255,255,0.2); }

  /* ── Loading ── */
  .el-loading {
    min-height:100vh; background:#0a0f1e;
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px;
  }
  .el-loading-ring {
    width:48px; height:48px;
    border:3px solid rgba(249,115,22,0.15); border-top-color:#f97316;
    border-radius:50%; animation:spin 0.8s linear infinite;
  }
  .el-loading p { color:rgba(255,255,255,0.3); font-size:14px; }

  /* ── Toast ── */
  .el-toast {
    position:fixed; bottom:28px; right:28px; z-index:999;
    padding:13px 20px; border-radius:14px;
    font-size:13.5px; font-family:'DM Sans',sans-serif;
    display:flex; align-items:center; gap:10px;
    backdrop-filter:blur(20px);
    animation:toastIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
    box-shadow:0 16px 40px rgba(0,0,0,0.4);
  }
  .el-toast.error { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#fca5a5; }
  @keyframes toastIn {
    from{opacity:0;transform:translateY(16px) scale(0.97);}
    to{opacity:1;transform:translateY(0) scale(1);}
  }

  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes fadeUp {
    from{opacity:0;transform:translateY(18px);}
    to{opacity:1;transform:translateY(0);}
  }

  @media(max-width:1100px) {
    .el-table-head, .el-table-row { grid-template-columns:2fr 1fr 2fr 1.4fr; }
    .el-th:nth-child(2), .el-table-row .el-cell:nth-child(2) { display:none; }
  }
  @media(max-width:768px) {
    .el-main { padding:24px 16px; }
    .el-stats-row { grid-template-columns:1fr 1fr; }
  }
`;

const NAV_ITEMS = [
  { icon:"🏠", label:"Manage Rooms",      path:"/admin/rooms"      },
  { icon:"🎓", label:"Student Dashboard", path:"/student"          },
  { icon:"👥", label:"Manage Students",   path:"/admin/students"   },
  { icon:"📋", label:"Entry Logs",        path:"/admin/logs",      active:true },
  { icon:"💬", label:"Complaints",        path:"/admin/complaints" },
  { icon:"🚨", label:"SOS Alerts",        path:"/admin/sos"        },
  { icon:"💰", label:"Rent Management",   path:"/admin/rent"       },
  { icon:"📊", label:"Analytics",         path:"/admin/analytics"  },
];

function getInitials(name) {
  return name ? name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "?";
}

function formatDate(dt) {
  if (!dt) return null;
  const d = new Date(dt);
  return {
    date: d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
    time: d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true }),
  };
}

function getDuration(checkIn, checkOut) {
  const end = checkOut ? new Date(checkOut) : new Date();
  const mins = Math.floor((end - new Date(checkIn)) / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return `${h}h ${m}m`;
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`el-toast ${type}`}>⚠ {msg}</div>;
}

export default function EntryLogs() {
  const [logs, setLogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [toast, setToast]   = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | inside | outside

  // Entry logs are loaded once, with manual refresh available in the UI.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchLogs(); }, []);

  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const fetchLogs = async (showSpin = false) => {
    if (showSpin) setSpinning(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/entry/logs`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLogs(data);
    } catch {
      setToast({ msg: "Failed to fetch entry logs", type: "error" });
    } finally {
      setLoading(false);
      setSpinning(false);
    }
  };

  const filtered = logs.filter(log => {
    const q = search.toLowerCase();
    const matchSearch =
      log.student?.name?.toLowerCase().includes(q) ||
      log.student?.email?.toLowerCase().includes(q) ||
      log.room?.roomNumber?.toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "inside" && !log.checkOut) ||
      (filter === "outside" && !!log.checkOut);
    return matchSearch && matchFilter;
  });

  const insideCount  = logs.filter(l => !l.checkOut).length;
  const outsideCount = logs.filter(l => !!l.checkOut).length;
  const uniqueStudents = new Set(logs.map(l => l.student?._id)).size;

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="el-loading">
        <div className="el-loading-ring" />
        <p>Loading entry logs…</p>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="el-root">
        <div className="el-blob el-blob-1" />
        <div className="el-blob el-blob-2" />
        <div className="el-blob el-blob-3" />
        <div className="el-grid" />

        {/* ── Sidebar ── */}
        <aside className="el-sidebar">
          <div className="el-sidebar-logo">🏠</div>
          {NAV_ITEMS.map((item, i) => (
            <button key={i}
              className={`el-nav-btn ${item.active ? "active" : ""}`}
              onClick={() => { window.location.href = item.path; }}
            >
              {item.icon}
              <span className="el-tooltip">{item.label}</span>
            </button>
          ))}
          <div className="el-sidebar-spacer" />
          <button className="el-logout-btn" onClick={() => {
            clearAuth();
            window.location.href = "/";
          }}>↩</button>
        </aside>

        {/* ── Main ── */}
        <main className="el-main">

          {/* Top Bar */}
          <div className="el-topbar">
            <div className="el-topbar-left">
              <h1>Entry <span>Logs</span></h1>
              <p>SafeNest · Gate check-in and check-out history</p>
            </div>
            <div className="el-topbar-right">
              <button className={`el-refresh-btn ${spinning ? "spinning" : ""}`}
                onClick={() => fetchLogs(true)}>
                <span>↻</span> Refresh
              </button>
              <button className="el-back-btn" onClick={() => { window.location.href = "/admin"; }}>
                ← Dashboard
              </button>
              <div className="el-avatar">A</div>
            </div>
          </div>

          {/* Stats */}
          <div className="el-stats-row">
            {[
              { icon:"📋", label:"Total Logs",      val:logs.length,      color:"#f97316", bg:"rgba(249,115,22,0.12)",  bc:"rgba(249,115,22,0.2)" },
              { icon:"🟢", label:"Currently Inside", val:insideCount,      color:"#34d399", bg:"rgba(52,211,153,0.1)",   bc:"rgba(52,211,153,0.2)"  },
              { icon:"🚪", label:"Checked Out",      val:outsideCount,     color:"#a78bfa", bg:"rgba(167,139,250,0.1)",  bc:"rgba(167,139,250,0.2)" },
              { icon:"👤", label:"Unique Students",  val:uniqueStudents,   color:"#22d3ee", bg:"rgba(34,211,238,0.1)",   bc:"rgba(34,211,238,0.2)"  },
            ].map(({ icon, label, val, color, bg, bc }) => (
              <div className="el-mini-stat" key={label}>
                <div className="el-mini-icon" style={{ background:bg, border:`1px solid ${bc}` }}>{icon}</div>
                <div>
                  <div className="el-mini-val" style={{ color }}>{val}</div>
                  <div className="el-mini-lbl">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="el-toolbar">
            <div className="el-search-wrap">
              <span className="el-search-icon">🔍</span>
              <input className="el-search" placeholder="Search student, email or room…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {["all","inside","outside"].map(f => (
              <button key={f}
                className={`el-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All Logs" : f === "inside" ? "🟢 Inside" : "🚪 Checked Out"}
              </button>
            ))}
            <span className="el-count-badge">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Section */}
          <div className="el-section-label">Log History</div>
          <div className="el-divider" />

          {/* Table */}
          <div className="el-table-card">
            <div className="el-table-head">
              <div className="el-th">Student</div>
              <div className="el-th">Email</div>
              <div className="el-th">Room</div>
              <div className="el-th">Check In</div>
              <div className="el-th">Check Out</div>
              <div className="el-th">Status</div>
            </div>

            <div className="el-table-body">
              {filtered.length === 0 ? (
                <div className="el-empty">
                  <div className="el-empty-icon">📋</div>
                  <h3>{search ? "No results found" : "No logs yet"}</h3>
                  <p>{search ? "Try a different search term" : "Entry logs will appear here"}</p>
                </div>
              ) : (
                filtered.map((log, idx) => {
                  const cin  = formatDate(log.checkIn);
                  const cout = log.checkOut ? formatDate(log.checkOut) : null;
                  const dur  = getDuration(log.checkIn, log.checkOut);
                  const room = log.room?.roomNumber || log.student?.room?.roomNumber;
                  return (
                    <div className="el-table-row" key={log._id}
                      style={{ animationDelay:`${0.04 * idx}s` }}
                    >
                      {/* Student */}
                      <div className="el-cell-student">
                        <div className="el-row-avatar">{getInitials(log.student?.name)}</div>
                        <div className="el-row-name">{log.student?.name || "—"}</div>
                      </div>

                      {/* Email */}
                      <div className="el-cell" style={{fontSize:"12.5px",color:"rgba(255,255,255,0.38)"}}>
                        {log.student?.email || "—"}
                      </div>

                      {/* Room */}
                      <div>
                        <span className={`el-cell room ${!room ? "na" : ""}`}>
                          {room || "N/A"}
                        </span>
                      </div>

                      {/* Check In */}
                      <div className="el-time-wrap">
                        <div className="el-time-main">{cin?.time}</div>
                        <div className="el-time-sub">{cin?.date}</div>
                      </div>

                      {/* Check Out */}
                      <div className="el-time-wrap">
                        {cout ? (
                          <>
                            <div className="el-time-main">{cout.time}</div>
                            <div className="el-time-sub">{cout.date}</div>
                            <div className="el-duration">⏱ {dur}</div>
                          </>
                        ) : (
                          <div className="el-time-sub" style={{color:"rgba(52,211,153,0.6)"}}>Still inside</div>
                        )}
                      </div>

                      {/* Status */}
                      <div>
                        <span className={`el-status ${log.checkOut ? "outside" : "inside"}`}>
                          {log.checkOut ? "Out" : "Inside"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </main>

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
