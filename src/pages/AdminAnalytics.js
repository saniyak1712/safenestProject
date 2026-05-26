import { useEffect, useState } from "react";
import { API_BASE_URL, clearAuth } from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .an-root { min-height:100vh; background:#0a0f1e; font-family:'DM Sans',sans-serif; color:#fff; overflow-x:hidden; position:relative; }

  /* Blobs */
  .an-blob { position:fixed;border-radius:50%;filter:blur(90px);opacity:0.13;pointer-events:none;animation:blobFloat 9s ease-in-out infinite alternate; }
  .an-blob-1 { width:560px;height:560px;background:radial-gradient(circle,#f97316,#ea580c);top:-140px;right:-100px;animation-delay:0s; }
  .an-blob-2 { width:380px;height:380px;background:radial-gradient(circle,#fbbf24,#f59e0b);bottom:-80px;left:-60px;animation-delay:3s; }
  .an-blob-3 { width:280px;height:280px;background:radial-gradient(circle,#a78bfa,#f97316);top:45%;left:40%;animation-delay:1.5s; }
  @keyframes blobFloat { 0%{transform:scale(1) translate(0,0);}100%{transform:scale(1.1) translate(16px,-16px);} }

  /* Grid */
  .an-grid { position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(249,115,22,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.035) 1px,transparent 1px);background-size:52px 52px; }

  /* Sidebar */
  .an-sidebar { position:fixed;top:0;left:0;bottom:0;width:72px;background:rgba(255,255,255,0.02);border-right:1px solid rgba(249,115,22,0.1);backdrop-filter:blur(20px);display:flex;flex-direction:column;align-items:center;padding:24px 0;gap:8px;z-index:100;animation:slideIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes slideIn { from{opacity:0;transform:translateX(-20px);}to{opacity:1;transform:translateX(0);} }
  .an-logo { width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#f97316,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:16px;box-shadow:0 8px 24px rgba(249,115,22,0.45);flex-shrink:0; }
  .an-nav { width:48px;height:48px;border-radius:14px;border:1px solid transparent;background:transparent;color:rgba(255,255,255,0.35);font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;position:relative; }
  .an-nav:hover,.an-nav.active { background:rgba(249,115,22,0.12);border-color:rgba(249,115,22,0.3);color:#f97316;box-shadow:0 0 20px rgba(249,115,22,0.15); }
  .an-nav .tip { position:absolute;left:62px;background:rgba(15,20,40,0.95);border:1px solid rgba(249,115,22,0.2);color:#fff;font-size:12px;font-family:'DM Sans',sans-serif;padding:5px 10px;border-radius:8px;white-space:nowrap;pointer-events:none;opacity:0;transform:translateX(-6px);transition:all 0.18s;z-index:200; }
  .an-nav:hover .tip { opacity:1;transform:translateX(0); }
  .an-spacer { flex:1; }
  .an-out { width:44px;height:44px;border-radius:12px;border:1px solid rgba(239,68,68,0.25);background:rgba(239,68,68,0.06);color:rgba(239,68,68,0.6);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s; }
  .an-out:hover { background:rgba(239,68,68,0.15);color:#f87171;border-color:rgba(239,68,68,0.5); }

  /* Main */
  .an-main { margin-left:72px;padding:40px 48px;position:relative;z-index:1; }

  /* Topbar */
  .an-topbar { display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;animation:fadeUp 0.6s 0.1s both; }
  .an-topbar-left h1 { font-family:'Playfair Display',serif;font-size:34px;font-weight:800;letter-spacing:-0.8px;line-height:1.1; }
  .an-topbar-left h1 span { color:#f97316; }
  .an-topbar-left p { color:rgba(255,255,255,0.38);font-size:13.5px;margin-top:5px;font-weight:300; }
  .an-topbar-right { display:flex;align-items:center;gap:14px; }
  .an-back { background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:12px;padding:9px 18px;color:rgba(255,255,255,0.6);font-family:'DM Sans',sans-serif;font-size:13.5px;cursor:pointer;display:flex;align-items:center;gap:7px;transition:all 0.2s; }
  .an-back:hover { border-color:rgba(249,115,22,0.35);color:#f97316;background:rgba(249,115,22,0.07); }
  .an-avatar { width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#f97316,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff;box-shadow:0 4px 16px rgba(249,115,22,0.35); }

  /* Section */
  .an-slabel { font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,0.25);margin-bottom:16px; }
  .an-div { height:1px;background:linear-gradient(90deg,transparent,rgba(249,115,22,0.18),transparent);margin:8px 0 28px; }

  /* KPI Row */
  .an-kpi { display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:36px;animation:fadeUp 0.6s 0.15s both; }
  .an-kpi-card { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:18px;padding:20px 18px;position:relative;overflow:hidden;transition:all 0.25s;cursor:default; }
  .an-kpi-card:hover { transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,0.4); }
  .an-kpi-card::before { content:'';position:absolute;inset:0;border-radius:18px;background:radial-gradient(circle at 85% 10%,var(--glow),transparent 60%);opacity:0;transition:opacity 0.3s; }
  .an-kpi-card:hover::before { opacity:1; }
  .an-kpi-icon { width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;margin-bottom:14px; }
  .an-kpi-val { font-family:'Playfair Display',serif;font-size:36px;font-weight:800;line-height:1;letter-spacing:-1px; }
  .an-kpi-lbl { font-size:11.5px;color:rgba(255,255,255,0.35);margin-top:6px;text-transform:uppercase;letter-spacing:0.6px; }
  .an-kpi-bar { height:3px;border-radius:3px;margin-top:14px;overflow:hidden;background:rgba(255,255,255,0.06); }
  .an-kpi-fill { height:100%;border-radius:3px;animation:barGrow 1.2s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes barGrow { from{transform:scaleX(0);}to{transform:scaleX(1);} }

  /* Chart layout */
  .an-charts { display:grid;grid-template-columns:1.6fr 1fr;gap:20px;margin-bottom:28px; }
  .an-chart-card { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:28px;animation:fadeUp 0.6s 0.3s both; }
  .an-chart-title { font-family:'Playfair Display',serif;font-size:18px;font-weight:700;margin-bottom:6px; }
  .an-chart-sub { font-size:12.5px;color:rgba(255,255,255,0.3);margin-bottom:24px; }

  /* SVG Bar Chart */
  .an-bar-svg { width:100%;overflow:visible; }
  .an-bar-group rect { transition:opacity 0.2s; }
  .an-bar-group:hover rect { opacity:0.8; }
  .an-bar-group .bar-val { font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;fill:#fff;text-anchor:middle;opacity:0; animation:valFadeIn 0.4s forwards; }
  @keyframes valFadeIn { from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);} }
  .an-bar-anim { animation:barRise 1s cubic-bezier(0.16,1,0.3,1) both; transform-origin:bottom; }
  @keyframes barRise { from{transform:scaleY(0);}to{transform:scaleY(1);} }

  /* Donut chart (occupancy) */
  .an-donut-wrap { display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%; }
  .an-donut-svg { overflow:visible; }
  .an-donut-track { fill:none;stroke:rgba(255,255,255,0.06);stroke-width:22; }
  .an-donut-fill { fill:none;stroke-width:22;stroke-linecap:round;animation:donutFill 1.2s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes donutFill { from{stroke-dashoffset:var(--full);}to{stroke-dashoffset:var(--offset);} }
  .an-donut-label { text-anchor:middle;dominant-baseline:middle; }
  .an-donut-pct { font-family:'Playfair Display',serif;font-size:32px;font-weight:800;fill:#fff; }
  .an-donut-sub { font-family:'DM Sans',sans-serif;font-size:12px;fill:rgba(255,255,255,0.35); }
  .an-donut-legend { display:flex;flex-direction:column;gap:10px;margin-top:20px;width:100%; }
  .an-legend-item { display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(255,255,255,0.6); }
  .an-legend-dot { width:10px;height:10px;border-radius:3px;flex-shrink:0; }
  .an-legend-val { margin-left:auto;font-weight:600;color:#fff;font-size:14px; }

  /* Bottom row */
  .an-bottom { display:grid;grid-template-columns:1fr 1fr;gap:20px; }

  /* Activity list */
  .an-activity-list { display:flex;flex-direction:column;gap:0; }
  .an-activity-item { display:flex;align-items:center;gap:14px;padding:13px 0;border-bottom:1px solid rgba(255,255,255,0.05); }
  .an-activity-item:last-child { border-bottom:none; }
  .an-act-icon { width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0; }
  .an-act-info { flex:1; }
  .an-act-name { font-size:13.5px;font-weight:500;color:#fff; }
  .an-act-desc { font-size:12px;color:rgba(255,255,255,0.3);margin-top:2px; }
  .an-act-val { font-size:14px;font-weight:600; }

  /* Horizontal bar chart */
  .an-hbar-list { display:flex;flex-direction:column;gap:14px; }
  .an-hbar-item {}
  .an-hbar-head { display:flex;justify-content:space-between;margin-bottom:6px; }
  .an-hbar-label { font-size:13px;color:rgba(255,255,255,0.65); }
  .an-hbar-num { font-size:13px;font-weight:600; }
  .an-hbar-track { height:8px;border-radius:8px;background:rgba(255,255,255,0.06);overflow:hidden; }
  .an-hbar-fill { height:100%;border-radius:8px;animation:barGrow 1s cubic-bezier(0.16,1,0.3,1) both; }

  /* Loading */
  .an-loading { min-height:100vh;background:#0a0f1e;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px; }
  .an-loading-ring { width:48px;height:48px;border:3px solid rgba(249,115,22,0.15);border-top-color:#f97316;border-radius:50%;animation:spin 0.8s linear infinite; }
  .an-loading p { color:rgba(255,255,255,0.3);font-size:14px; }

  /* Toast */
  .an-toast { position:fixed;bottom:28px;right:28px;z-index:999;padding:13px 20px;border-radius:14px;font-size:13.5px;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:10px;backdrop-filter:blur(20px);animation:toastIn 0.35s cubic-bezier(0.16,1,0.3,1) both;box-shadow:0 16px 40px rgba(0,0,0,0.4); }
  .an-toast.error { background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#fca5a5; }
  @keyframes toastIn { from{opacity:0;transform:translateY(16px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);} }

  @keyframes spin { to{transform:rotate(360deg);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }

  @media(max-width:1200px){ .an-kpi{grid-template-columns:repeat(3,1fr);} .an-charts{grid-template-columns:1fr;} .an-bottom{grid-template-columns:1fr;} }
  @media(max-width:900px){ .an-main{padding:24px 20px;} .an-kpi{grid-template-columns:repeat(2,1fr);} }
`;

const NAV_ITEMS = [
  { icon:"🏠", label:"Manage Rooms",      path:"/admin/rooms"      },
  { icon:"🎓", label:"Student Dashboard", path:"/student"          },
  { icon:"👥", label:"Manage Students",   path:"/admin/students"   },
  { icon:"📋", label:"Entry Logs",        path:"/admin/logs"       },
  { icon:"💬", label:"Complaints",        path:"/admin/complaints" },
  { icon:"🚨", label:"SOS Alerts",        path:"/admin/sos"        },
  { icon:"💰", label:"Rent Management",   path:"/admin/rent"       },
  { icon:"📊", label:"Analytics",         path:"/admin/analytics", active:true },
];

const KPI_CONFIG = [
  { key:"totalRooms",    label:"Total Rooms",    icon:"🏢", color:"#f97316", bg:"rgba(249,115,22,0.12)", bc:"rgba(249,115,22,0.2)", glow:"rgba(249,115,22,0.06)" },
  { key:"totalStudents", label:"Students",       icon:"🎓", color:"#22d3ee", bg:"rgba(34,211,238,0.1)",  bc:"rgba(34,211,238,0.2)",  glow:"rgba(34,211,238,0.05)" },
  { key:"occupiedRooms", label:"Occupied",       icon:"🔑", color:"#a78bfa", bg:"rgba(167,139,250,0.1)", bc:"rgba(167,139,250,0.2)", glow:"rgba(167,139,250,0.06)" },
  { key:"complaints",    label:"Complaints",     icon:"💬", color:"#fbbf24", bg:"rgba(251,191,36,0.1)",  bc:"rgba(251,191,36,0.2)",  glow:"rgba(251,191,36,0.05)" },
  { key:"sos",           label:"SOS Alerts",     icon:"🚨", color:"#f87171", bg:"rgba(239,68,68,0.12)",  bc:"rgba(239,68,68,0.22)",  glow:"rgba(239,68,68,0.06)" },
];

const BAR_CONFIG = [
  { key:"totalRooms",    label:"Rooms",      color:"#f97316", gradient:["#f97316","#fbbf24"] },
  { key:"totalStudents", label:"Students",   color:"#22d3ee", gradient:["#22d3ee","#06b6d4"] },
  { key:"lateEntries",   label:"Late In",    color:"#a78bfa", gradient:["#a78bfa","#7c3aed"] },
  { key:"complaints",    label:"Complaints", color:"#fbbf24", gradient:["#fbbf24","#f59e0b"] },
  { key:"sos",           label:"SOS",        color:"#f87171", gradient:["#f87171","#ef4444"] },
];

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`an-toast ${type}`}>⚠ {msg}</div>;
}

// Custom animated SVG bar chart
function BarChart({ data, config }) {
  const W = 560, H = 220, pad = { t:20, r:16, b:48, l:36 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const maxVal = Math.max(...config.map(c => data[c.key] || 0), 1);
  const barW = (innerW / config.length) * 0.5;
  const gap  = innerW / config.length;
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(maxVal * f));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="an-bar-svg">
      <defs>
        {config.map((c, i) => (
          <linearGradient key={i} id={`bg${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.gradient[0]} stopOpacity="0.95" />
            <stop offset="100%" stopColor={c.gradient[1]} stopOpacity="0.6" />
          </linearGradient>
        ))}
      </defs>

      {/* Grid lines */}
      {gridLines.map((v, i) => {
        const y = pad.t + innerH - (v / maxVal) * innerH;
        return (
          <g key={i}>
            <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={pad.l - 6} y={y + 4} fill="rgba(255,255,255,0.22)" fontSize="10" textAnchor="end" fontFamily="DM Sans">{v}</text>
          </g>
        );
      })}

      {/* Bars */}
      {config.map((c, i) => {
        const val = data[c.key] || 0;
        const bh = Math.max((val / maxVal) * innerH, val > 0 ? 4 : 0);
        const x = pad.l + i * gap + gap / 2 - barW / 2;
        const y = pad.t + innerH - bh;
        return (
          <g className="an-bar-group" key={i}>
            {/* bg bar (full height, very faint) */}
            <rect x={x} y={pad.t} width={barW} height={innerH} rx="6" fill="rgba(255,255,255,0.03)" />
            {/* data bar */}
            <rect
              x={x} y={y} width={barW} height={bh} rx="6"
              fill={`url(#bg${i})`}
              className="an-bar-anim"
              style={{ animationDelay:`${0.1 * i}s` }}
            />
            {/* value label */}
            <text
              className="bar-val"
              x={x + barW / 2} y={y - 8}
              style={{ animationDelay:`${0.1 * i + 0.6}s` }}
            >{val}</text>
            {/* x label */}
            <text x={x + barW / 2} y={H - 10} fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle" fontFamily="DM Sans">{c.label}</text>
            {/* color dot */}
            <rect x={x + barW / 2 - 4} y={H - 26} width="8" height="3" rx="2" fill={c.color} />
          </g>
        );
      })}
    </svg>
  );
}

// Donut chart for occupancy
function DonutChart({ occupied, total }) {
  const R = 72, CX = 90, CY = 90;
  const circ = 2 * Math.PI * R;
  const pct = total > 0 ? occupied / total : 0;
  const offset = circ * (1 - pct);
  return (
    <div className="an-donut-wrap">
      <svg viewBox="0 0 180 180" className="an-donut-svg" width="180" height="180">
        <defs>
          <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <circle cx={CX} cy={CY} r={R} className="an-donut-track" />
        <circle
          cx={CX} cy={CY} r={R}
          className="an-donut-fill"
          stroke="url(#donutGrad)"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${CX} ${CY})`}
          style={{ "--full": circ, "--offset": offset }}
        />
        <text x={CX} y={CY - 8} className="an-donut-label">
          <tspan className="an-donut-pct" x={CX} dy="0">{Math.round(pct * 100)}%</tspan>
          <tspan className="an-donut-sub" x={CX} dy="20">Occupancy</tspan>
        </text>
      </svg>
      <div className="an-donut-legend">
        {[
          { label:"Occupied Rooms", val:occupied,          color:"#f97316" },
          { label:"Available Rooms",val:Math.max(0,total-occupied), color:"rgba(255,255,255,0.12)" },
          { label:"Total Capacity", val:total,             color:"#22d3ee"  },
        ].map(({ label, val, color }) => (
          <div className="an-legend-item" key={label}>
            <div className="an-legend-dot" style={{ background:color }} />
            <span>{label}</span>
            <span className="an-legend-val">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const [stats, setStats]   = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast]   = useState(null);

  // Analytics data loads once when the report opens.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchStats(); }, []);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStats(data);
    } catch {
      setToast({ msg: "Failed to load analytics", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const total    = stats.totalRooms    || 0;
  const occupied = stats.occupiedRooms || 0;
//   const avail    = Math.max(0, total - occupied);
  const occPct   = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const hbarData = [
    { label:"Rooms Occupied",  val:occupied,           max:total||1,      color:"linear-gradient(90deg,#f97316,#fbbf24)" },
    { label:"Students Housed", val:stats.totalStudents||0, max:Math.max(stats.totalStudents||0,total)||1, color:"linear-gradient(90deg,#22d3ee,#06b6d4)" },
    { label:"Complaints Filed",val:stats.complaints||0, max:Math.max(stats.complaints||0,10),  color:"linear-gradient(90deg,#fbbf24,#f59e0b)" },
    { label:"SOS Triggered",   val:stats.sos||0,        max:Math.max(stats.sos||0,10),         color:"linear-gradient(90deg,#f87171,#ef4444)" },
    { label:"Late Entries",    val:stats.lateEntries||0,max:Math.max(stats.lateEntries||0,10), color:"linear-gradient(90deg,#a78bfa,#7c3aed)" },
  ];

  const activityItems = [
    { icon:"🏢", bg:"rgba(249,115,22,0.12)", bc:"rgba(249,115,22,0.2)", name:"Room Utilisation", desc:"Occupied vs available", val:`${occPct}%`, color:"#f97316" },
    { icon:"🎓", bg:"rgba(34,211,238,0.1)",  bc:"rgba(34,211,238,0.2)", name:"Total Students",   desc:"Currently enrolled",   val:stats.totalStudents||0, color:"#22d3ee" },
    { icon:"💬", bg:"rgba(251,191,36,0.1)",  bc:"rgba(251,191,36,0.2)", name:"Open Complaints",  desc:"Awaiting resolution",  val:stats.complaints||0, color:"#fbbf24" },
    { icon:"🚨", bg:"rgba(239,68,68,0.1)",   bc:"rgba(239,68,68,0.2)",  name:"SOS Alerts",       desc:"Emergency events",     val:stats.sos||0, color:"#f87171" },
    { icon:"🌙", bg:"rgba(167,139,250,0.1)", bc:"rgba(167,139,250,0.2)",name:"Late Entries",     desc:"After curfew",         val:stats.lateEntries||0, color:"#a78bfa" },
  ];

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="an-loading">
        <div className="an-loading-ring" />
        <p>Loading analytics…</p>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="an-root">
        <div className="an-blob an-blob-1" /><div className="an-blob an-blob-2" /><div className="an-blob an-blob-3" />
        <div className="an-grid" />

        {/* Sidebar */}
        <aside className="an-sidebar">
          <div className="an-logo">🏠</div>
          {NAV_ITEMS.map((item, i) => (
            <button key={i} className={`an-nav ${item.active ? "active" : ""}`}
              onClick={() => { window.location.href = item.path; }}>
              {item.icon}<span className="tip">{item.label}</span>
            </button>
          ))}
          <div className="an-spacer" />
          <button className="an-out" onClick={() => {
            clearAuth();
            window.location.href = "/";
          }}>↩</button>
        </aside>

        {/* Main */}
        <main className="an-main">

          {/* Topbar */}
          <div className="an-topbar">
            <div className="an-topbar-left">
              <h1>Admin <span>Analytics</span></h1>
              <p>SafeNest · System-wide metrics and hostel performance overview</p>
            </div>
            <div className="an-topbar-right">
              <button className="an-back" onClick={() => { window.location.href = "/admin"; }}>← Dashboard</button>
              <div className="an-avatar">A</div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="an-slabel">Key Metrics</div>
          <div className="an-div" />
          <div className="an-kpi">
            {KPI_CONFIG.map(({ key, label, icon, color, bg, bc, glow }, i) => {
              const val = stats[key] || 0;
              const maxVal = Math.max(...KPI_CONFIG.map(c => stats[c.key] || 0), 1);
              const pct = val / maxVal;
              return (
                <div className="an-kpi-card" key={key}
                  style={{ "--glow":glow, border:`1px solid ${bc}`, animationDelay:`${0.05*i}s` }}
                >
                  <div className="an-kpi-icon" style={{ background:bg, border:`1px solid ${bc}` }}>{icon}</div>
                  <div className="an-kpi-val" style={{ color }}>{val}</div>
                  <div className="an-kpi-lbl">{label}</div>
                  <div className="an-kpi-bar">
                    <div className="an-kpi-fill" style={{ width:`${pct*100}%`, background:`linear-gradient(90deg,${color},${color}aa)`, animationDelay:`${0.1*i+0.3}s` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="an-slabel">Visual Breakdown</div>
          <div className="an-div" />
          <div className="an-charts">
            {/* Bar chart */}
            <div className="an-chart-card">
              <div className="an-chart-title">System Overview</div>
              <div className="an-chart-sub">Rooms · Students · Late entries · Complaints · SOS</div>
              <BarChart data={stats} config={BAR_CONFIG} />
            </div>

            {/* Donut */}
            <div className="an-chart-card" style={{ display:"flex", flexDirection:"column" }}>
              <div className="an-chart-title">Room Occupancy</div>
              <div className="an-chart-sub">Current fill rate across all rooms</div>
              <DonutChart occupied={occupied} total={total} />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="an-slabel">Detailed Breakdown</div>
          <div className="an-div" />
          <div className="an-bottom">
            {/* Activity summary */}
            <div className="an-chart-card">
              <div className="an-chart-title">Summary</div>
              <div className="an-chart-sub">At-a-glance hostel status</div>
              <div className="an-activity-list">
                {activityItems.map(({ icon, bg, bc, name, desc, val, color }) => (
                  <div className="an-activity-item" key={name}>
                    <div className="an-act-icon" style={{ background:bg, border:`1px solid ${bc}` }}>{icon}</div>
                    <div className="an-act-info">
                      <div className="an-act-name">{name}</div>
                      <div className="an-act-desc">{desc}</div>
                    </div>
                    <div className="an-act-val" style={{ color }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Horizontal bars */}
            <div className="an-chart-card">
              <div className="an-chart-title">Relative Scale</div>
              <div className="an-chart-sub">Proportional view of key indicators</div>
              <div className="an-hbar-list">
                {hbarData.map(({ label, val, max, color }, i) => (
                  <div className="an-hbar-item" key={label} style={{ animationDelay:`${0.1*i}s` }}>
                    <div className="an-hbar-head">
                      <span className="an-hbar-label">{label}</span>
                      <span className="an-hbar-num">{val}</span>
                    </div>
                    <div className="an-hbar-track">
                      <div className="an-hbar-fill"
                        style={{ width:`${Math.round((val/max)*100)}%`, background:color, animationDelay:`${0.1*i+0.2}s` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
