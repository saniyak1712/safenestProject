import { useEffect, useState } from "react";
import { API_BASE_URL, clearAuth } from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mc-root {
    min-height: 100vh;
    background: #0a0f1e;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    overflow-x: hidden;
    position: relative;
  }

  /* ── Blobs ── */
  .mc-blob {
    position: fixed; border-radius: 50%;
    filter: blur(90px); opacity: 0.13;
    pointer-events: none;
    animation: blobFloat 9s ease-in-out infinite alternate;
  }
  .mc-blob-1 { width:560px;height:560px;background:radial-gradient(circle,#f97316,#ea580c);top:-140px;right:-100px;animation-delay:0s; }
  .mc-blob-2 { width:380px;height:380px;background:radial-gradient(circle,#fb923c,#f59e0b);bottom:-80px;left:-60px;animation-delay:3s; }
  .mc-blob-3 { width:280px;height:280px;background:radial-gradient(circle,#fcd34d,#f97316);top:45%;left:40%;animation-delay:1.5s; }
  @keyframes blobFloat {
    0%   { transform:scale(1) translate(0,0); }
    100% { transform:scale(1.1) translate(16px,-16px); }
  }

  /* ── Grid ── */
  .mc-grid {
    position:fixed; inset:0; pointer-events:none;
    background-image:
      linear-gradient(rgba(249,115,22,0.035) 1px,transparent 1px),
      linear-gradient(90deg,rgba(249,115,22,0.035) 1px,transparent 1px);
    background-size:52px 52px;
  }

  /* ── Sidebar ── */
  .mc-sidebar {
    position:fixed; top:0; left:0; bottom:0; width:72px;
    background:rgba(255,255,255,0.02);
    border-right:1px solid rgba(249,115,22,0.1);
    backdrop-filter:blur(20px);
    display:flex; flex-direction:column; align-items:center;
    padding:24px 0; gap:8px; z-index:100;
    animation:slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes slideInLeft {
    from{opacity:0;transform:translateX(-20px);}
    to{opacity:1;transform:translateX(0);}
  }
  .mc-sidebar-logo {
    width:44px;height:44px;border-radius:14px;
    background:linear-gradient(135deg,#f97316,#fbbf24);
    display:flex;align-items:center;justify-content:center;
    font-size:20px;margin-bottom:16px;
    box-shadow:0 8px 24px rgba(249,115,22,0.45);flex-shrink:0;
  }
  .mc-nav-btn {
    width:48px;height:48px;border-radius:14px;
    border:1px solid transparent;background:transparent;
    color:rgba(255,255,255,0.35);font-size:20px;
    cursor:pointer;display:flex;align-items:center;justify-content:center;
    transition:all 0.2s;position:relative;
  }
  .mc-nav-btn:hover,.mc-nav-btn.active {
    background:rgba(249,115,22,0.12);border-color:rgba(249,115,22,0.3);
    color:#f97316;box-shadow:0 0 20px rgba(249,115,22,0.15);
  }
  .mc-nav-btn .mc-tooltip {
    position:absolute;left:62px;
    background:rgba(15,20,40,0.95);border:1px solid rgba(249,115,22,0.2);
    color:#fff;font-size:12px;font-family:'DM Sans',sans-serif;
    padding:5px 10px;border-radius:8px;
    white-space:nowrap;pointer-events:none;
    opacity:0;transform:translateX(-6px);
    transition:all 0.18s;z-index:200;
  }
  .mc-nav-btn:hover .mc-tooltip{opacity:1;transform:translateX(0);}
  .mc-sidebar-spacer{flex:1;}
  .mc-logout-btn {
    width:44px;height:44px;border-radius:12px;
    border:1px solid rgba(239,68,68,0.25);
    background:rgba(239,68,68,0.06);color:rgba(239,68,68,0.6);
    font-size:18px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:all 0.2s;
  }
  .mc-logout-btn:hover{background:rgba(239,68,68,0.15);color:#f87171;border-color:rgba(239,68,68,0.5);}

  /* ── Main ── */
  .mc-main {
    margin-left:72px;
    padding:40px 48px;
    position:relative;z-index:1;
  }

  /* ── Top Bar ── */
  .mc-topbar {
    display:flex;align-items:center;justify-content:space-between;
    margin-bottom:40px;
    animation:fadeUp 0.6s 0.1s both;
  }
  .mc-topbar-left h1 {
    font-family:'Playfair Display',serif;
    font-size:34px;font-weight:800;
    letter-spacing:-0.8px;line-height:1.1;
  }
  .mc-topbar-left h1 span{color:#f97316;}
  .mc-topbar-left p{color:rgba(255,255,255,0.38);font-size:13.5px;margin-top:5px;font-weight:300;}
  .mc-topbar-right{display:flex;align-items:center;gap:14px;}
  .mc-back-btn {
    background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);
    border-radius:12px;padding:9px 18px;color:rgba(255,255,255,0.6);
    font-family:'DM Sans',sans-serif;font-size:13.5px;cursor:pointer;
    display:flex;align-items:center;gap:7px;transition:all 0.2s;
  }
  .mc-back-btn:hover{border-color:rgba(249,115,22,0.35);color:#f97316;background:rgba(249,115,22,0.07);}
  .mc-avatar {
    width:40px;height:40px;border-radius:12px;
    background:linear-gradient(135deg,#f97316,#fbbf24);
    display:flex;align-items:center;justify-content:center;
    font-size:16px;font-weight:700;color:#fff;
    box-shadow:0 4px 16px rgba(249,115,22,0.35);
  }

  /* ── Section label / divider ── */
  .mc-section-label {
    font-size:11px;font-weight:600;
    text-transform:uppercase;letter-spacing:1.5px;
    color:rgba(255,255,255,0.25);margin-bottom:16px;
  }
  .mc-divider {
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(249,115,22,0.18),transparent);
    margin:8px 0 28px;
  }

  /* ── Stats Row ── */
  .mc-stats-row {
    display:grid;grid-template-columns:repeat(3,1fr);
    gap:16px;margin-bottom:32px;
    animation:fadeUp 0.6s 0.15s both;
  }
  .mc-mini-stat {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:16px;padding:18px 20px;
    display:flex;align-items:center;gap:14px;
    transition:all 0.22s;
  }
  .mc-mini-stat:hover{border-color:rgba(249,115,22,0.25);transform:translateY(-2px);}
  .mc-mini-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
  .mc-mini-val{font-family:'Playfair Display',serif;font-size:26px;font-weight:800;line-height:1;}
  .mc-mini-lbl{font-size:11.5px;color:rgba(255,255,255,0.3);margin-top:3px;}

  /* ── Toolbar ── */
  .mc-toolbar {
    display:flex;align-items:center;gap:14px;margin-bottom:28px;flex-wrap:wrap;
    animation:fadeUp 0.6s 0.2s both;
  }
  .mc-search-wrap{position:relative;flex:1;min-width:200px;max-width:340px;}
  .mc-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:15px;color:rgba(249,115,22,0.45);pointer-events:none;}
  .mc-search {
    width:100%;background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);border-radius:12px;
    padding:11px 16px 11px 40px;color:#fff;
    font-family:'DM Sans',sans-serif;font-size:14px;outline:none;
    transition:all 0.22s;
  }
  .mc-search::placeholder{color:rgba(255,255,255,0.2);}
  .mc-search:focus{background:rgba(249,115,22,0.06);border-color:rgba(249,115,22,0.45);box-shadow:0 0 0 3px rgba(249,115,22,0.1);}
  .mc-filter-btn {
    padding:10px 16px;border-radius:12px;cursor:pointer;
    font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;
    border:1px solid rgba(255,255,255,0.08);
    background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.5);
    transition:all 0.2s;
  }
  .mc-filter-btn:hover,.mc-filter-btn.active{background:rgba(249,115,22,0.1);border-color:rgba(249,115,22,0.3);color:#f97316;}
  .mc-count-badge{margin-left:auto;font-size:12px;color:rgba(255,255,255,0.25);white-space:nowrap;}

  /* ── Cards Grid ── */
  .mc-cards-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(340px,1fr));
    gap:20px;
  }

  .mc-complaint-card {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:20px;padding:24px;
    position:relative;overflow:hidden;
    transition:all 0.25s;
    animation:fadeUp 0.5s both;
    display:flex;flex-direction:column;gap:16px;
  }
  .mc-complaint-card:hover{
    transform:translateY(-4px);
    box-shadow:0 20px 50px rgba(0,0,0,0.4),0 0 24px rgba(249,115,22,0.06);
  }
  .mc-complaint-card.pending{border-color:rgba(251,191,36,0.2);}
  .mc-complaint-card.pending:hover{border-color:rgba(251,191,36,0.4);}
  .mc-complaint-card.resolved{border-color:rgba(52,211,153,0.15);}

  /* top strip */
  .mc-card-strip{
    position:absolute;top:0;left:0;right:0;height:3px;border-radius:20px 20px 0 0;
  }
  .mc-card-strip.pending{background:linear-gradient(90deg,#f59e0b,#fbbf24);}
  .mc-card-strip.resolved{background:linear-gradient(90deg,#34d399,#059669);}

  /* card header */
  .mc-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
  .mc-card-user{display:flex;align-items:center;gap:11px;}
  .mc-user-avatar{
    width:38px;height:38px;border-radius:11px;flex-shrink:0;
    background:linear-gradient(135deg,#f97316,#fbbf24);
    display:flex;align-items:center;justify-content:center;
    font-size:13px;font-weight:700;color:#fff;
    box-shadow:0 3px 12px rgba(249,115,22,0.28);
  }
  .mc-user-name{font-size:14px;font-weight:600;color:#fff;}
  .mc-user-email{font-size:11.5px;color:rgba(255,255,255,0.32);margin-top:2px;}

  .mc-status-badge{
    flex-shrink:0;padding:5px 12px;border-radius:20px;
    font-size:11px;font-weight:600;letter-spacing:0.4px;
    display:flex;align-items:center;gap:6px;
  }
  .mc-status-badge.pending{background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.25);color:#fbbf24;}
  .mc-status-badge.pending::before{content:'';width:6px;height:6px;border-radius:50%;background:#fbbf24;box-shadow:0 0 6px #fbbf24;animation:pulse 2s infinite;}
  .mc-status-badge.resolved{background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.25);color:#6ee7b7;}

  /* title */
  .mc-card-title{
    font-family:'Playfair Display',serif;
    font-size:17px;font-weight:700;color:#fff;
    line-height:1.3;letter-spacing:-0.2px;
  }

  /* description */
  .mc-card-desc{
    font-size:13.5px;color:rgba(255,255,255,0.45);
    line-height:1.65;font-weight:300;
    background:rgba(255,255,255,0.02);
    border:1px solid rgba(255,255,255,0.05);
    border-radius:10px;padding:12px 14px;
  }

  /* footer */
  .mc-card-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:2px;}
  .mc-card-date{font-size:11.5px;color:rgba(255,255,255,0.25);display:flex;align-items:center;gap:5px;}

  /* resolve button */
  .mc-resolve-btn {
    padding:9px 20px;border:none;border-radius:11px;
    background:linear-gradient(135deg,#f97316,#fbbf24);
    color:#fff;font-family:'DM Sans',sans-serif;
    font-size:13px;font-weight:500;cursor:pointer;
    box-shadow:0 4px 16px rgba(249,115,22,0.3);
    transition:transform 0.2s,box-shadow 0.2s;
    position:relative;overflow:hidden;
    display:flex;align-items:center;gap:7px;
  }
  .mc-resolve-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(249,115,22,0.45);}
  .mc-resolve-btn:active{transform:translateY(0);}
  .mc-resolve-btn:disabled{opacity:0.45;cursor:not-allowed;transform:none;}
  .mc-resolve-btn::after{
    content:'';position:absolute;top:0;left:-100%;
    width:60%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
    transform:skewX(-20deg);animation:shimmer 3s 1s infinite;
  }
  @keyframes shimmer{0%{left:-100%}100%{left:160%}}

  /* resolved tick */
  .mc-resolved-tag{
    font-size:12px;color:#6ee7b7;
    display:flex;align-items:center;gap:5px;
  }

  /* ── Spinner ── */
  .mc-spinner{
    display:inline-block;width:13px;height:13px;
    border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;
    border-radius:50%;animation:spin 0.6s linear infinite;
    vertical-align:middle;
  }

  /* ── Empty ── */
  .mc-empty{text-align:center;padding:80px 0;animation:fadeUp 0.6s both;}
  .mc-empty-icon{font-size:52px;margin-bottom:16px;opacity:0.4;}
  .mc-empty h3{font-family:'Playfair Display',serif;font-size:22px;color:rgba(255,255,255,0.4);margin-bottom:8px;}
  .mc-empty p{font-size:13.5px;color:rgba(255,255,255,0.2);}

  /* ── Loading ── */
  .mc-loading{min-height:100vh;background:#0a0f1e;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;}
  .mc-loading-ring{width:48px;height:48px;border:3px solid rgba(249,115,22,0.15);border-top-color:#f97316;border-radius:50%;animation:spin 0.8s linear infinite;}
  .mc-loading p{color:rgba(255,255,255,0.3);font-size:14px;}

  /* ── Toast ── */
  .mc-toast{
    position:fixed;bottom:28px;right:28px;z-index:999;
    padding:13px 20px;border-radius:14px;
    font-size:13.5px;font-family:'DM Sans',sans-serif;
    display:flex;align-items:center;gap:10px;
    backdrop-filter:blur(20px);
    animation:toastIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
    box-shadow:0 16px 40px rgba(0,0,0,0.4);
  }
  .mc-toast.success{background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.3);color:#6ee7b7;}
  .mc-toast.error{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#fca5a5;}
  @keyframes toastIn{from{opacity:0;transform:translateY(16px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);}}

  @keyframes spin{to{transform:rotate(360deg);}}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(1.4);}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}

  @media(max-width:900px){
    .mc-main{padding:24px 20px;}
    .mc-stats-row{grid-template-columns:1fr 1fr;}
    .mc-cards-grid{grid-template-columns:1fr;}
  }
`;

const NAV_ITEMS = [
  { icon:"🏠", label:"Manage Rooms",      path:"/admin/rooms"      },
  { icon:"🎓", label:"Student Dashboard", path:"/student"          },
  { icon:"👥", label:"Manage Students",   path:"/admin/students"   },
  { icon:"📋", label:"Entry Logs",        path:"/admin/logs"       },
  { icon:"💬", label:"Complaints",        path:"/admin/complaints", active:true },
  { icon:"🚨", label:"SOS Alerts",        path:"/admin/sos"        },
  { icon:"💰", label:"Rent Management",   path:"/admin/rent"       },
  { icon:"📊", label:"Analytics",         path:"/admin/analytics"  },
];

function getInitials(name) {
  return name ? name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "?";
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`mc-toast ${type}`}>{type === "success" ? "✅" : "⚠"} {msg}</div>;
}

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [resolving, setResolving]   = useState({});
  const [toast, setToast]           = useState(null);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("all");

  // Complaints are loaded once and refreshed after mutations.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchComplaints(); }, []);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setComplaints(data);
    } catch {
      showToast("Failed to fetch complaints", "error");
    } finally {
      setLoading(false);
    }
  };

  const resolveComplaint = async (id, title) => {
    setResolving(r => ({ ...r, [id]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints/${id}`, {
        method: "PUT", headers: authHeaders(), body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error();
      showToast(`"${title}" marked as resolved`);
      fetchComplaints();
    } catch {
      showToast("Failed to resolve complaint", "error");
    } finally {
      setResolving(r => ({ ...r, [id]: false }));
    }
  };

  const filtered = complaints.filter(c => {
    const q = search.toLowerCase();
    const matchSearch =
      c.student?.name?.toLowerCase().includes(q) ||
      c.title?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "pending"  && c.status === "Pending") ||
      (filter === "resolved" && c.status !== "Pending");
    return matchSearch && matchFilter;
  });

  const pendingCount  = complaints.filter(c => c.status === "Pending").length;
  const resolvedCount = complaints.filter(c => c.status !== "Pending").length;

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="mc-loading">
        <div className="mc-loading-ring" />
        <p>Loading complaints…</p>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="mc-root">
        <div className="mc-blob mc-blob-1" />
        <div className="mc-blob mc-blob-2" />
        <div className="mc-blob mc-blob-3" />
        <div className="mc-grid" />

        {/* ── Sidebar ── */}
        <aside className="mc-sidebar">
          <div className="mc-sidebar-logo">🏠</div>
          {NAV_ITEMS.map((item, i) => (
            <button key={i}
              className={`mc-nav-btn ${item.active ? "active" : ""}`}
              onClick={() => { window.location.href = item.path; }}
            >
              {item.icon}
              <span className="mc-tooltip">{item.label}</span>
            </button>
          ))}
          <div className="mc-sidebar-spacer" />
          <button className="mc-logout-btn" onClick={() => {
            clearAuth();
            window.location.href = "/";
          }}>↩</button>
        </aside>

        {/* ── Main ── */}
        <main className="mc-main">

          {/* Top Bar */}
          <div className="mc-topbar">
            <div className="mc-topbar-left">
              <h1>Manage <span>Complaints</span></h1>
              <p>SafeNest · Review and resolve student complaints</p>
            </div>
            <div className="mc-topbar-right">
              <button className="mc-back-btn" onClick={() => { window.location.href = "/admin"; }}>
                ← Dashboard
              </button>
              <div className="mc-avatar">A</div>
            </div>
          </div>

          {/* Stats */}
          <div className="mc-stats-row">
            {[
              { icon:"💬", label:"Total Complaints", val:complaints.length, color:"#f97316", bg:"rgba(249,115,22,0.12)", bc:"rgba(249,115,22,0.2)" },
              { icon:"⏳", label:"Pending",           val:pendingCount,      color:"#fbbf24", bg:"rgba(251,191,36,0.1)",  bc:"rgba(251,191,36,0.2)" },
              { icon:"✅", label:"Resolved",          val:resolvedCount,     color:"#34d399", bg:"rgba(52,211,153,0.1)",  bc:"rgba(52,211,153,0.2)" },
            ].map(({ icon, label, val, color, bg, bc }) => (
              <div className="mc-mini-stat" key={label}>
                <div className="mc-mini-icon" style={{background:bg, border:`1px solid ${bc}`}}>{icon}</div>
                <div>
                  <div className="mc-mini-val" style={{color}}>{val}</div>
                  <div className="mc-mini-lbl">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="mc-toolbar">
            <div className="mc-search-wrap">
              <span className="mc-search-icon">🔍</span>
              <input className="mc-search" placeholder="Search complaints…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {["all","pending","resolved"].map(f => (
              <button key={f}
                className={`mc-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f === "pending" ? "⏳ Pending" : "✅ Resolved"}
              </button>
            ))}
            <span className="mc-count-badge">{filtered.length} complaint{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Section */}
          <div className="mc-section-label">Complaint Feed</div>
          <div className="mc-divider" />

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="mc-empty">
              <div className="mc-empty-icon">💬</div>
              <h3>{search ? "No results found" : "No complaints yet"}</h3>
              <p>{search ? "Try a different search term" : "All clear — no complaints have been filed"}</p>
            </div>
          ) : (
            <div className="mc-cards-grid">
              {filtered.map((c, idx) => {
                const isPending = c.status === "Pending";
                const statusKey = isPending ? "pending" : "resolved";
                return (
                  <div className={`mc-complaint-card ${statusKey}`} key={c._id}
                    style={{ animationDelay:`${0.05 * idx}s` }}
                  >
                    <div className={`mc-card-strip ${statusKey}`} />

                    {/* Header */}
                    <div className="mc-card-header">
                      <div className="mc-card-user">
                        <div className="mc-user-avatar">{getInitials(c.student?.name)}</div>
                        <div>
                          <div className="mc-user-name">{c.student?.name || "Unknown"}</div>
                          <div className="mc-user-email">{c.student?.email || ""}</div>
                        </div>
                      </div>
                      <div className={`mc-status-badge ${statusKey}`}>
                        {isPending ? "Pending" : "Resolved"}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="mc-card-title">{c.title}</div>

                    {/* Description */}
                    <div className="mc-card-desc">{c.description}</div>

                    {/* Footer */}
                    <div className="mc-card-footer">
                      <div className="mc-card-date">
                        📅 {formatDate(c.createdAt) || "Unknown date"}
                      </div>
                      {isPending ? (
                        <button
                          className="mc-resolve-btn"
                          disabled={resolving[c._id]}
                          onClick={() => resolveComplaint(c._id, c.title)}
                        >
                          {resolving[c._id]
                            ? <><span className="mc-spinner" /> Resolving…</>
                            : <>✓ Mark Resolved</>
                          }
                        </button>
                      ) : (
                        <div className="mc-resolved-tag">✅ Resolved</div>
                      )}
                    </div>
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
