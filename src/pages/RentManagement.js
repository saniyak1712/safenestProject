import { useEffect, useState } from "react";
import { API_BASE_URL, clearAuth } from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rm2-root { min-height:100vh; background:#0a0f1e; font-family:'DM Sans',sans-serif; color:#fff; overflow-x:hidden; position:relative; }

  /* Blobs */
  .rm2-blob { position:fixed; border-radius:50%; filter:blur(90px); opacity:0.13; pointer-events:none; animation:blobFloat 9s ease-in-out infinite alternate; }
  .rm2-blob-1 { width:560px;height:560px;background:radial-gradient(circle,#f97316,#ea580c);top:-140px;right:-100px;animation-delay:0s; }
  .rm2-blob-2 { width:380px;height:380px;background:radial-gradient(circle,#fbbf24,#f59e0b);bottom:-80px;left:-60px;animation-delay:3s; }
  .rm2-blob-3 { width:280px;height:280px;background:radial-gradient(circle,#fcd34d,#f97316);top:45%;left:40%;animation-delay:1.5s; }
  @keyframes blobFloat { 0%{transform:scale(1) translate(0,0);} 100%{transform:scale(1.1) translate(16px,-16px);} }

  /* Grid */
  .rm2-grid { position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(249,115,22,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.035) 1px,transparent 1px);background-size:52px 52px; }

  /* Sidebar */
  .rm2-sidebar { position:fixed;top:0;left:0;bottom:0;width:72px;background:rgba(255,255,255,0.02);border-right:1px solid rgba(249,115,22,0.1);backdrop-filter:blur(20px);display:flex;flex-direction:column;align-items:center;padding:24px 0;gap:8px;z-index:100;animation:slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes slideInLeft { from{opacity:0;transform:translateX(-20px);}to{opacity:1;transform:translateX(0);} }
  .rm2-logo { width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#f97316,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:16px;box-shadow:0 8px 24px rgba(249,115,22,0.45);flex-shrink:0; }
  .rm2-nav { width:48px;height:48px;border-radius:14px;border:1px solid transparent;background:transparent;color:rgba(255,255,255,0.35);font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;position:relative; }
  .rm2-nav:hover,.rm2-nav.active { background:rgba(249,115,22,0.12);border-color:rgba(249,115,22,0.3);color:#f97316;box-shadow:0 0 20px rgba(249,115,22,0.15); }
  .rm2-nav .tip { position:absolute;left:62px;background:rgba(15,20,40,0.95);border:1px solid rgba(249,115,22,0.2);color:#fff;font-size:12px;font-family:'DM Sans',sans-serif;padding:5px 10px;border-radius:8px;white-space:nowrap;pointer-events:none;opacity:0;transform:translateX(-6px);transition:all 0.18s;z-index:200; }
  .rm2-nav:hover .tip { opacity:1;transform:translateX(0); }
  .rm2-spacer { flex:1; }
  .rm2-out { width:44px;height:44px;border-radius:12px;border:1px solid rgba(239,68,68,0.25);background:rgba(239,68,68,0.06);color:rgba(239,68,68,0.6);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s; }
  .rm2-out:hover { background:rgba(239,68,68,0.15);color:#f87171;border-color:rgba(239,68,68,0.5); }

  /* Main */
  .rm2-main { margin-left:72px;padding:40px 48px;position:relative;z-index:1; }

  /* Topbar */
  .rm2-topbar { display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;animation:fadeUp 0.6s 0.1s both; }
  .rm2-topbar-left h1 { font-family:'Playfair Display',serif;font-size:34px;font-weight:800;letter-spacing:-0.8px;line-height:1.1; }
  .rm2-topbar-left h1 span { color:#f97316; }
  .rm2-topbar-left p { color:rgba(255,255,255,0.38);font-size:13.5px;margin-top:5px;font-weight:300; }
  .rm2-topbar-right { display:flex;align-items:center;gap:14px; }
  .rm2-back { background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:12px;padding:9px 18px;color:rgba(255,255,255,0.6);font-family:'DM Sans',sans-serif;font-size:13.5px;cursor:pointer;display:flex;align-items:center;gap:7px;transition:all 0.2s; }
  .rm2-back:hover { border-color:rgba(249,115,22,0.35);color:#f97316;background:rgba(249,115,22,0.07); }
  .rm2-avatar { width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#f97316,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff;box-shadow:0 4px 16px rgba(249,115,22,0.35); }

  /* Section */
  .rm2-slabel { font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,0.25);margin-bottom:16px; }
  .rm2-div { height:1px;background:linear-gradient(90deg,transparent,rgba(249,115,22,0.18),transparent);margin:8px 0 28px; }

  /* Stats */
  .rm2-stats { display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px;animation:fadeUp 0.6s 0.15s both; }
  .rm2-stat { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:18px 20px;display:flex;align-items:center;gap:14px;transition:all 0.22s; }
  .rm2-stat:hover { border-color:rgba(249,115,22,0.25);transform:translateY(-2px); }
  .rm2-stat-icon { width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0; }
  .rm2-stat-val { font-family:'Playfair Display',serif;font-size:22px;font-weight:800;line-height:1; }
  .rm2-stat-lbl { font-size:11.5px;color:rgba(255,255,255,0.3);margin-top:3px; }

  /* Toolbar */
  .rm2-toolbar { display:flex;align-items:center;gap:14px;margin-bottom:28px;flex-wrap:wrap;animation:fadeUp 0.6s 0.2s both; }
  .rm2-search-wrap { position:relative;flex:1;min-width:200px;max-width:340px; }
  .rm2-si { position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:15px;color:rgba(249,115,22,0.45);pointer-events:none; }
  .rm2-search { width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:11px 16px 11px 40px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:all 0.22s; }
  .rm2-search::placeholder { color:rgba(255,255,255,0.2); }
  .rm2-search:focus { background:rgba(249,115,22,0.06);border-color:rgba(249,115,22,0.45);box-shadow:0 0 0 3px rgba(249,115,22,0.1); }
  .rm2-fbtn { padding:10px 16px;border-radius:12px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.5);transition:all 0.2s; }
  .rm2-fbtn:hover,.rm2-fbtn.active { background:rgba(249,115,22,0.1);border-color:rgba(249,115,22,0.3);color:#f97316; }
  .rm2-cbadge { margin-left:auto;font-size:12px;color:rgba(255,255,255,0.25);white-space:nowrap; }

  /* Cards grid */
  .rm2-grid2 { display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:20px; }

  /* Card */
  .rm2-card { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:24px;position:relative;overflow:hidden;transition:all 0.25s;animation:fadeUp 0.5s both;display:flex;flex-direction:column;gap:16px; }
  .rm2-card.paid { border-color:rgba(52,211,153,0.12); }
  .rm2-card.paid:hover { border-color:rgba(52,211,153,0.3);transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,0.4); }
  .rm2-card.pending { border-color:rgba(251,191,36,0.15); }
  .rm2-card.pending:hover { border-color:rgba(251,191,36,0.4);transform:translateY(-4px);box-shadow:0 20px 50px rgba(251,191,36,0.08); }

  .rm2-strip { position:absolute;top:0;left:0;right:0;height:3px;border-radius:20px 20px 0 0; }
  .rm2-strip.paid { background:linear-gradient(90deg,#34d399,#059669); }
  .rm2-strip.pending { background:linear-gradient(90deg,#f59e0b,#fbbf24); }

  /* Card header */
  .rm2-card-head { display:flex;align-items:flex-start;justify-content:space-between;gap:12px; }
  .rm2-card-user { display:flex;align-items:center;gap:12px; }
  .rm2-uavatar { width:44px;height:44px;border-radius:13px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;background:linear-gradient(135deg,#f97316,#fbbf24);box-shadow:0 4px 14px rgba(249,115,22,0.3); }
  .rm2-uname { font-family:'Playfair Display',serif;font-size:17px;font-weight:700;letter-spacing:-0.2px;color:#fff; }
  .rm2-uemail { font-size:12px;color:rgba(255,255,255,0.32);margin-top:3px; }
  .rm2-status-badge { flex-shrink:0;padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.4px;display:flex;align-items:center;gap:6px; }
  .rm2-status-badge.paid { background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.25);color:#6ee7b7; }
  .rm2-status-badge.pending { background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.25);color:#fbbf24; }
  .rm2-status-badge.pending::before { content:'';width:6px;height:6px;border-radius:50%;background:#fbbf24;box-shadow:0 0 6px #fbbf24;animation:dotPulse 1.8s infinite; }
  @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(1.5);} }

  /* Info pills */
  .rm2-info-row { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
  .rm2-info-box { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:11px;padding:11px 14px; }
  .rm2-info-lbl { font-size:10.5px;text-transform:uppercase;letter-spacing:0.8px;color:rgba(255,255,255,0.28);margin-bottom:5px; }
  .rm2-info-val { font-size:16px;font-weight:600;color:#fff; }
  .rm2-info-val.rent { color:#fbbf24; }
  .rm2-info-val.room { color:#f97316; }

  /* Due date bar */
  .rm2-due-bar { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:11px;padding:11px 14px;display:flex;align-items:center;justify-content:space-between; }
  .rm2-due-label { font-size:10.5px;text-transform:uppercase;letter-spacing:0.8px;color:rgba(255,255,255,0.28); }
  .rm2-due-val { font-size:13px;font-weight:500;color:rgba(255,255,255,0.6); }
  .rm2-due-val.overdue { color:#f87171; }

  /* Form row */
  .rm2-form-row { display:flex;gap:10px;align-items:center;flex-wrap:wrap; }
  .rm2-input { flex:1;min-width:120px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:11px;padding:10px 14px;color:#fff;font-family:'DM Sans',sans-serif;font-size:13.5px;outline:none;transition:all 0.2s; }
  .rm2-input::placeholder { color:rgba(255,255,255,0.2); }
  .rm2-input:focus { background:rgba(249,115,22,0.06);border-color:rgba(249,115,22,0.4);box-shadow:0 0 0 3px rgba(249,115,22,0.08); }
  .rm2-input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(0.5); }

  .rm2-set-btn { padding:10px 18px;border:none;border-radius:11px;background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.3);color:#f97316;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap;transition:all 0.2s;display:flex;align-items:center;gap:6px; }
  .rm2-set-btn:hover { background:rgba(249,115,22,0.25);transform:translateY(-1px); }
  .rm2-set-btn:disabled { opacity:0.4;cursor:not-allowed;transform:none; }

  .rm2-pay-btn { padding:10px 18px;border:none;border-radius:11px;background:linear-gradient(135deg,#34d399,#059669);color:#fff;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap;box-shadow:0 4px 14px rgba(52,211,153,0.25);transition:all 0.2s;display:flex;align-items:center;gap:6px;position:relative;overflow:hidden; }
  .rm2-pay-btn:hover { transform:translateY(-2px);box-shadow:0 8px 22px rgba(52,211,153,0.4); }
  .rm2-pay-btn:disabled { opacity:0.4;cursor:not-allowed;transform:none; }
  .rm2-pay-btn::after { content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);transform:skewX(-20deg);animation:shimmer 3s 1s infinite; }
  @keyframes shimmer { 0%{left:-100%}100%{left:160%} }

  /* Spinner */
  .rm2-spin { display:inline-block;width:13px;height:13px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite;vertical-align:middle; }
  @keyframes spin { to{transform:rotate(360deg);} }

  /* Empty */
  .rm2-empty { text-align:center;padding:80px 0;animation:fadeUp 0.6s both; }
  .rm2-empty-icon { font-size:52px;margin-bottom:14px;opacity:0.4; }
  .rm2-empty h3 { font-family:'Playfair Display',serif;font-size:22px;color:rgba(255,255,255,0.4);margin-bottom:8px; }
  .rm2-empty p { font-size:13.5px;color:rgba(255,255,255,0.2); }

  /* Loading */
  .rm2-loading { min-height:100vh;background:#0a0f1e;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px; }
  .rm2-loading-ring { width:48px;height:48px;border:3px solid rgba(249,115,22,0.15);border-top-color:#f97316;border-radius:50%;animation:spin 0.8s linear infinite; }
  .rm2-loading p { color:rgba(255,255,255,0.3);font-size:14px; }

  /* Toast */
  .rm2-toast { position:fixed;bottom:28px;right:28px;z-index:999;padding:13px 20px;border-radius:14px;font-size:13.5px;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:10px;backdrop-filter:blur(20px);animation:toastIn 0.35s cubic-bezier(0.16,1,0.3,1) both;box-shadow:0 16px 40px rgba(0,0,0,0.4); }
  .rm2-toast.success { background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.3);color:#6ee7b7; }
  .rm2-toast.error { background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#fca5a5; }
  @keyframes toastIn { from{opacity:0;transform:translateY(16px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }

  @media(max-width:1100px){.rm2-stats{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:900px){.rm2-main{padding:24px 20px;}.rm2-grid2{grid-template-columns:1fr;}}
`;

const NAV_ITEMS = [
  { icon:"🏠", label:"Manage Rooms",      path:"/admin/rooms"      },
  { icon:"🎓", label:"Student Dashboard", path:"/student"          },
  { icon:"👥", label:"Manage Students",   path:"/admin/students"   },
  { icon:"📋", label:"Entry Logs",        path:"/admin/logs"       },
  { icon:"💬", label:"Complaints",        path:"/admin/complaints" },
  { icon:"🚨", label:"SOS Alerts",        path:"/admin/sos"        },
  { icon:"💰", label:"Rent Management",   path:"/admin/rent",      active:true },
  { icon:"📊", label:"Analytics",         path:"/admin/analytics"  },
];

function getInitials(name) {
  return name ? name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "?";
}

function formatDate(d) {
  if (!d) return "Not set";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

function isOverdue(due) {
  if (!due) return false;
  return new Date(due) < new Date();
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`rm2-toast ${type}`}>{type === "success" ? "✅" : "⚠"} {msg}</div>;
}

export default function RentManagement() {
  const [students, setStudents]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all");
  // per-student form state
  const [amounts, setAmounts]     = useState({});
  const [dueDates, setDueDates]   = useState({});
  const [setting, setSetting]     = useState({});
  const [paying, setPaying]       = useState({});

  // Rent data loads once and is refreshed after set/pay actions.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchStudents(); }, []);

  const showToast = (msg, type="success") => setToast({ msg, type });

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rent`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStudents(data);
    } catch {
      showToast("Failed to fetch rent data", "error");
    } finally {
      setLoading(false);
    }
  };

  const setRent = async (id, name) => {
    const amount = amounts[id]; const due = dueDates[id];
    if (!amount) { showToast("Enter a rent amount", "error"); return; }
    setSetting(s => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/rent/set/${id}`, {
        method:"PUT", headers: authHeaders(),
        body: JSON.stringify({ rentAmount: amount, rentDueDate: due }),
      });
      if (!res.ok) throw new Error();
      showToast(`Rent set for ${name}`);
      setAmounts(a => ({ ...a, [id]: "" }));
      setDueDates(d => ({ ...d, [id]: "" }));
      fetchStudents();
    } catch {
      showToast("Failed to set rent", "error");
    } finally {
      setSetting(s => ({ ...s, [id]: false }));
    }
  };

  const markPaid = async (id, name) => {
    setPaying(p => ({ ...p, [id]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/rent/pay/${id}`, {
        method:"PUT", headers: authHeaders(), body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error();
      showToast(`${name}'s rent marked as paid`);
      fetchStudents();
    } catch {
      showToast("Failed to mark as paid", "error");
    } finally {
      setPaying(p => ({ ...p, [id]: false }));
    }
  };

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.room?.roomNumber?.toLowerCase().includes(q);
    const matchFilter = filter === "all" || (filter === "paid" && s.rentPaid) || (filter === "pending" && !s.rentPaid);
    return matchSearch && matchFilter;
  });

  const paidCount    = students.filter(s => s.rentPaid).length;
  const pendingCount = students.filter(s => !s.rentPaid).length;
//   const totalRent    = students.reduce((sum, s) => sum + (s.rentAmount || 0), 0);
  const collected    = students.filter(s => s.rentPaid).reduce((sum, s) => sum + (s.rentAmount || 0), 0);

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="rm2-loading">
        <div className="rm2-loading-ring" />
        <p>Loading rent data…</p>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="rm2-root">
        <div className="rm2-blob rm2-blob-1" /><div className="rm2-blob rm2-blob-2" /><div className="rm2-blob rm2-blob-3" />
        <div className="rm2-grid" />

        {/* Sidebar */}
        <aside className="rm2-sidebar">
          <div className="rm2-logo">🏠</div>
          {NAV_ITEMS.map((item, i) => (
            <button key={i} className={`rm2-nav ${item.active ? "active" : ""}`} onClick={() => { window.location.href = item.path; }}>
              {item.icon}<span className="tip">{item.label}</span>
            </button>
          ))}
          <div className="rm2-spacer" />
          <button className="rm2-out" onClick={() => { clearAuth(); window.location.href = "/"; }}>↩</button>
        </aside>

        {/* Main */}
        <main className="rm2-main">

          {/* Topbar */}
          <div className="rm2-topbar">
            <div className="rm2-topbar-left">
              <h1>Rent <span>Management</span></h1>
              <p>SafeNest · Set, track and collect monthly rent from residents</p>
            </div>
            <div className="rm2-topbar-right">
              <button className="rm2-back" onClick={() => { window.location.href = "/admin"; }}>← Dashboard</button>
              <div className="rm2-avatar">A</div>
            </div>
          </div>

          {/* Stats */}
          <div className="rm2-stats">
            {[
              { icon:"👥", label:"Total Students",  val:students.length,                     color:"#f97316", bg:"rgba(249,115,22,0.12)", bc:"rgba(249,115,22,0.2)" },
              { icon:"✅", label:"Paid",             val:paidCount,                           color:"#34d399", bg:"rgba(52,211,153,0.1)",  bc:"rgba(52,211,153,0.2)" },
              { icon:"⏳", label:"Pending",          val:pendingCount,                        color:"#fbbf24", bg:"rgba(251,191,36,0.1)",  bc:"rgba(251,191,36,0.2)" },
              { icon:"💰", label:"Collected",        val:`₹${collected.toLocaleString()}`,    color:"#a78bfa", bg:"rgba(167,139,250,0.1)", bc:"rgba(167,139,250,0.2)" },
            ].map(({ icon, label, val, color, bg, bc }) => (
              <div className="rm2-stat" key={label}>
                <div className="rm2-stat-icon" style={{ background:bg, border:`1px solid ${bc}` }}>{icon}</div>
                <div>
                  <div className="rm2-stat-val" style={{ color }}>{val}</div>
                  <div className="rm2-stat-lbl">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="rm2-toolbar">
            <div className="rm2-search-wrap">
              <span className="rm2-si">🔍</span>
              <input className="rm2-search" placeholder="Search by name, email or room…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {["all","pending","paid"].map(f => (
              <button key={f} className={`rm2-fbtn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f === "pending" ? "⏳ Pending" : "✅ Paid"}
              </button>
            ))}
            <span className="rm2-cbadge">{filtered.length} resident{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Section */}
          <div className="rm2-slabel">Residents</div>
          <div className="rm2-div" />

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="rm2-empty">
              <div className="rm2-empty-icon">💰</div>
              <h3>{search ? "No results found" : "No students yet"}</h3>
              <p>{search ? "Try a different search term" : "Rent data will appear here once students are assigned rooms"}</p>
            </div>
          ) : (
            <div className="rm2-grid2">
              {filtered.map((s, idx) => {
                const sk = s.rentPaid ? "paid" : "pending";
                const overdue = !s.rentPaid && isOverdue(s.rentDueDate);
                return (
                  <div className={`rm2-card ${sk}`} key={s._id} style={{ animationDelay:`${0.05*idx}s` }}>
                    <div className={`rm2-strip ${sk}`} />

                    {/* Header */}
                    <div className="rm2-card-head">
                      <div className="rm2-card-user">
                        <div className="rm2-uavatar">{getInitials(s.name)}</div>
                        <div>
                          <div className="rm2-uname">{s.name}</div>
                          <div className="rm2-uemail">{s.email}</div>
                        </div>
                      </div>
                      <div className={`rm2-status-badge ${sk}`}>{s.rentPaid ? "Paid" : "Pending"}</div>
                    </div>

                    {/* Info pills */}
                    <div className="rm2-info-row">
                      <div className="rm2-info-box">
                        <div className="rm2-info-lbl">Room</div>
                        <div className="rm2-info-val room">{s.room?.roomNumber || "Unassigned"}</div>
                      </div>
                      <div className="rm2-info-box">
                        <div className="rm2-info-lbl">Monthly Rent</div>
                        <div className="rm2-info-val rent">₹{(s.rentAmount || 0).toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Due date */}
                    <div className="rm2-due-bar">
                      <div className="rm2-due-label">Due Date</div>
                      <div className={`rm2-due-val ${overdue ? "overdue" : ""}`}>
                        {overdue ? "⚠ " : "📅 "}{formatDate(s.rentDueDate)}
                      </div>
                    </div>

                    {/* Form */}
                    <div className="rm2-form-row">
                      <input
                        className="rm2-input"
                        type="number"
                        placeholder="₹ Set rent amount"
                        value={amounts[s._id] || ""}
                        onChange={e => setAmounts(a => ({ ...a, [s._id]: e.target.value }))}
                        min="0"
                      />
                      <input
                        className="rm2-input"
                        type="date"
                        value={dueDates[s._id] || ""}
                        onChange={e => setDueDates(d => ({ ...d, [s._id]: e.target.value }))}
                        style={{ maxWidth:160 }}
                      />
                    </div>
                    <div className="rm2-form-row">
                      <button
                        className="rm2-set-btn"
                        disabled={setting[s._id]}
                        onClick={() => setRent(s._id, s.name)}
                        style={{ flex:1 }}
                      >
                        {setting[s._id] ? <><span className="rm2-spin" /> Setting…</> : "✎ Set Rent"}
                      </button>
                      {!s.rentPaid && (
                        <button
                          className="rm2-pay-btn"
                          disabled={paying[s._id]}
                          onClick={() => markPaid(s._id, s.name)}
                          style={{ flex:1 }}
                        >
                          {paying[s._id] ? <><span className="rm2-spin" /> Marking…</> : "✓ Mark Paid"}
                        </button>
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
