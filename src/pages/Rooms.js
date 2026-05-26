import { useEffect, useState } from "react";
import { API_BASE_URL, clearAuth } from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rm-root {
    min-height: 100vh;
    background: #0a0f1e;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    overflow-x: hidden;
    position: relative;
  }

  /* ── Blobs ── */
  .rm-blob {
    position: fixed; border-radius: 50%;
    filter: blur(90px); opacity: 0.13;
    pointer-events: none;
    animation: blobFloat 9s ease-in-out infinite alternate;
  }
  .rm-blob-1 { width:560px;height:560px;background:radial-gradient(circle,#f97316,#ea580c);top:-140px;right:-100px;animation-delay:0s; }
  .rm-blob-2 { width:380px;height:380px;background:radial-gradient(circle,#fb923c,#f59e0b);bottom:-80px;left:-60px;animation-delay:3s; }
  .rm-blob-3 { width:280px;height:280px;background:radial-gradient(circle,#fcd34d,#f97316);top:45%;left:40%;animation-delay:1.5s; }
  @keyframes blobFloat {
    0%   { transform: scale(1) translate(0,0); }
    100% { transform: scale(1.1) translate(16px,-16px); }
  }

  /* ── Grid ── */
  .rm-grid {
    position: fixed; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(249,115,22,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(249,115,22,0.035) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  /* ── Sidebar ── */
  .rm-sidebar {
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
  .rm-sidebar-logo {
    width:44px; height:44px; border-radius:14px;
    background: linear-gradient(135deg,#f97316,#fbbf24);
    display:flex; align-items:center; justify-content:center;
    font-size:20px; margin-bottom:16px;
    box-shadow: 0 8px 24px rgba(249,115,22,0.45); flex-shrink:0;
  }
  .rm-nav-btn {
    width:48px; height:48px; border-radius:14px;
    border:1px solid transparent; background:transparent;
    color:rgba(255,255,255,0.35); font-size:20px;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    transition:all 0.2s; position:relative;
  }
  .rm-nav-btn:hover, .rm-nav-btn.active {
    background:rgba(249,115,22,0.12); border-color:rgba(249,115,22,0.3);
    color:#f97316; box-shadow:0 0 20px rgba(249,115,22,0.15);
  }
  .rm-nav-btn .rm-tooltip {
    position:absolute; left:62px;
    background:rgba(15,20,40,0.95); border:1px solid rgba(249,115,22,0.2);
    color:#fff; font-size:12px; font-family:'DM Sans',sans-serif;
    padding:5px 10px; border-radius:8px;
    white-space:nowrap; pointer-events:none;
    opacity:0; transform:translateX(-6px);
    transition:all 0.18s; z-index:200;
  }
  .rm-nav-btn:hover .rm-tooltip { opacity:1; transform:translateX(0); }
  .rm-sidebar-spacer { flex:1; }
  .rm-logout-btn {
    width:44px; height:44px; border-radius:12px;
    border:1px solid rgba(239,68,68,0.25);
    background:rgba(239,68,68,0.06); color:rgba(239,68,68,0.6);
    font-size:18px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:all 0.2s;
  }
  .rm-logout-btn:hover { background:rgba(239,68,68,0.15); color:#f87171; border-color:rgba(239,68,68,0.5); }

  /* ── Main ── */
  .rm-main {
    margin-left: 72px;
    padding: 40px 48px;
    position: relative; z-index: 1;
  }

  /* ── Top Bar ── */
  .rm-topbar {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom: 40px;
    animation: fadeUp 0.6s 0.1s both;
  }
  .rm-topbar-left h1 {
    font-family:'Playfair Display',serif;
    font-size:34px; font-weight:800;
    letter-spacing:-0.8px; line-height:1.1;
  }
  .rm-topbar-left h1 span { color:#f97316; }
  .rm-topbar-left p { color:rgba(255,255,255,0.38); font-size:13.5px; margin-top:5px; font-weight:300; }
  .rm-topbar-right { display:flex; align-items:center; gap:14px; }
  .rm-back-btn {
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
    border-radius:12px; padding:9px 18px; color:rgba(255,255,255,0.6);
    font-family:'DM Sans',sans-serif; font-size:13.5px; cursor:pointer;
    display:flex; align-items:center; gap:7px; transition:all 0.2s;
  }
  .rm-back-btn:hover { border-color:rgba(249,115,22,0.35); color:#f97316; background:rgba(249,115,22,0.07); }
  .rm-avatar {
    width:40px; height:40px; border-radius:12px;
    background:linear-gradient(135deg,#f97316,#fbbf24);
    display:flex; align-items:center; justify-content:center;
    font-size:16px; font-weight:700; color:#fff;
    box-shadow:0 4px 16px rgba(249,115,22,0.35);
  }

  /* ── Divider ── */
  .rm-divider {
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(249,115,22,0.18),transparent);
    margin: 8px 0 28px;
  }
  .rm-section-label {
    font-size:11px; font-weight:600;
    text-transform:uppercase; letter-spacing:1.5px;
    color:rgba(255,255,255,0.25); margin-bottom:16px;
  }

  /* ── Add Room Form Card ── */
  .rm-form-card {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(249,115,22,0.15);
    border-radius:20px; padding:28px 30px;
    margin-bottom:36px;
    position:relative; overflow:hidden;
    animation: fadeUp 0.6s 0.15s both;
  }
  .rm-form-card::before {
    content:'';
    position:absolute; top:0; left:8%; right:8%; height:2px;
    background:linear-gradient(90deg,transparent,#f97316,#fbbf24,transparent);
    border-radius:0 0 2px 2px;
  }
  .rm-form-title {
    font-family:'Playfair Display',serif;
    font-size:18px; font-weight:700; margin-bottom:20px; color:#fff;
  }
  .rm-form-row {
    display:grid; grid-template-columns:1fr 1fr 1fr auto;
    gap:14px; align-items:end;
  }
  .rm-field-wrap { display:flex; flex-direction:column; gap:7px; }
  .rm-field-label {
    font-size:11px; font-weight:600;
    text-transform:uppercase; letter-spacing:1px;
    color:rgba(255,255,255,0.35);
  }
  .rm-input {
    width:100%; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.09); border-radius:12px;
    padding:12px 16px; color:#fff;
    font-family:'DM Sans',sans-serif; font-size:14px; outline:none;
    transition:all 0.22s;
  }
  .rm-input::placeholder { color:rgba(255,255,255,0.2); }
  .rm-input:focus {
    background:rgba(249,115,22,0.06);
    border-color:rgba(249,115,22,0.5);
    box-shadow:0 0 0 3px rgba(249,115,22,0.1);
  }
  .rm-add-btn {
    padding:12px 26px; border:none; border-radius:12px;
    background:linear-gradient(135deg,#f97316,#fbbf24);
    color:#fff; font-family:'DM Sans',sans-serif;
    font-size:14px; font-weight:500; cursor:pointer;
    white-space:nowrap;
    box-shadow:0 6px 20px rgba(249,115,22,0.35);
    transition:transform 0.2s, box-shadow 0.2s;
    position:relative; overflow:hidden;
  }
  .rm-add-btn:hover {
    transform:translateY(-2px);
    box-shadow:0 10px 30px rgba(249,115,22,0.5);
  }
  .rm-add-btn:active { transform:translateY(0); }
  .rm-add-btn::after {
    content:''; position:absolute; top:0; left:-100%;
    width:60%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
    transform:skewX(-20deg); animation:shimmer 3s 1s infinite;
  }
  @keyframes shimmer { 0%{left:-100%} 100%{left:160%} }

  /* ── Toast ── */
  .rm-toast {
    position:fixed; bottom:28px; right:28px; z-index:999;
    padding:13px 20px; border-radius:14px;
    font-size:13.5px; font-family:'DM Sans',sans-serif;
    display:flex; align-items:center; gap:10px;
    backdrop-filter:blur(20px);
    animation:toastIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
    box-shadow:0 16px 40px rgba(0,0,0,0.4);
  }
  .rm-toast.success {
    background:rgba(52,211,153,0.12); border:1px solid rgba(52,211,153,0.3); color:#6ee7b7;
  }
  .rm-toast.error {
    background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#fca5a5;
  }
  @keyframes toastIn {
    from { opacity:0; transform:translateY(16px) scale(0.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  /* ── Stats Bar ── */
  .rm-stats-row {
    display:grid; grid-template-columns:repeat(3,1fr);
    gap:16px; margin-bottom:32px;
    animation: fadeUp 0.6s 0.2s both;
  }
  .rm-mini-stat {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; padding:18px 20px;
    display:flex; align-items:center; gap:14px;
    transition:all 0.22s;
  }
  .rm-mini-stat:hover { border-color:rgba(249,115,22,0.25); transform:translateY(-2px); }
  .rm-mini-icon {
    width:40px; height:40px; border-radius:10px;
    display:flex; align-items:center; justify-content:center; font-size:18px;
    flex-shrink:0;
  }
  .rm-mini-info {}
  .rm-mini-val {
    font-family:'Playfair Display',serif;
    font-size:26px; font-weight:800; line-height:1;
  }
  .rm-mini-lbl { font-size:11.5px; color:rgba(255,255,255,0.3); margin-top:3px; }

  /* ── Room Cards Grid ── */
  .rm-cards-grid {
    display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));
    gap:18px;
  }

  .rm-room-card {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:18px; padding:22px;
    position:relative; overflow:hidden;
    transition:all 0.25s;
    animation: fadeUp 0.5s both;
  }
  .rm-room-card:hover {
    border-color:rgba(249,115,22,0.3);
    transform:translateY(-4px);
    box-shadow:0 20px 50px rgba(0,0,0,0.4), 0 0 24px rgba(249,115,22,0.07);
  }
  .rm-room-card::before {
    content:''; position:absolute; inset:0; border-radius:18px;
    background:radial-gradient(circle at 80% 10%, rgba(249,115,22,0.06), transparent 60%);
    opacity:0; transition:opacity 0.3s;
  }
  .rm-room-card:hover::before { opacity:1; }

  /* status strip at top */
  .rm-room-strip {
    position:absolute; top:0; left:0; right:0; height:3px;
    border-radius:18px 18px 0 0;
  }

  .rm-room-header {
    display:flex; align-items:flex-start; justify-content:space-between;
    margin-bottom:18px;
  }
  .rm-room-number {
    font-family:'Playfair Display',serif;
    font-size:24px; font-weight:800; letter-spacing:-0.5px;
  }
  .rm-room-status {
    padding:4px 10px; border-radius:20px;
    font-size:11px; font-weight:600; letter-spacing:0.4px;
  }
  .rm-room-status.occupied {
    background:rgba(167,139,250,0.12); border:1px solid rgba(167,139,250,0.25); color:#c4b5fd;
  }
  .rm-room-status.available {
    background:rgba(52,211,153,0.1); border:1px solid rgba(52,211,153,0.25); color:#6ee7b7;
  }

  .rm-room-meta {
    display:grid; grid-template-columns:1fr 1fr;
    gap:12px; margin-bottom:18px;
  }
  .rm-meta-item {
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06);
    border-radius:10px; padding:10px 12px;
  }
  .rm-meta-label { font-size:10.5px; color:rgba(255,255,255,0.28); text-transform:uppercase; letter-spacing:0.7px; margin-bottom:4px; }
  .rm-meta-value { font-size:16px; font-weight:600; color:#fff; }
  .rm-meta-value.rent { color:#fbbf24; }

  /* occupancy dots */
  .rm-occ-wrap { margin-bottom:18px; }
  .rm-occ-label { font-size:11px; color:rgba(255,255,255,0.28); margin-bottom:8px; }
  .rm-occ-dots { display:flex; gap:6px; }
  .rm-dot {
    width:10px; height:10px; border-radius:50%;
    background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1);
    transition:all 0.2s;
  }
  .rm-dot.filled { background:#f97316; border-color:#f97316; box-shadow:0 0 6px rgba(249,115,22,0.5); }

  .rm-delete-btn {
    width:100%; padding:10px; border-radius:10px;
    border:1px solid rgba(239,68,68,0.2);
    background:rgba(239,68,68,0.05); color:rgba(239,68,68,0.6);
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    cursor:pointer; transition:all 0.2s;
    display:flex; align-items:center; justify-content:center; gap:7px;
  }
  .rm-delete-btn:hover {
    background:rgba(239,68,68,0.15); color:#f87171;
    border-color:rgba(239,68,68,0.45);
    transform:translateY(-1px);
  }

  /* ── Empty State ── */
  .rm-empty {
    text-align:center; padding:80px 0;
    animation: fadeUp 0.6s both;
  }
  .rm-empty-icon { font-size:52px; margin-bottom:16px; opacity:0.4; }
  .rm-empty h3 {
    font-family:'Playfair Display',serif;
    font-size:22px; color:rgba(255,255,255,0.4); margin-bottom:8px;
  }
  .rm-empty p { font-size:13.5px; color:rgba(255,255,255,0.2); }

  /* ── Loading ── */
  .rm-loading {
    min-height:100vh; background:#0a0f1e;
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px;
  }
  .rm-loading-ring {
    width:48px; height:48px;
    border:3px solid rgba(249,115,22,0.15); border-top-color:#f97316;
    border-radius:50%; animation:spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  .rm-loading p { color:rgba(255,255,255,0.3); font-size:14px; }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Confirm Modal ── */
  .rm-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,0.65);
    backdrop-filter:blur(6px); z-index:500;
    display:flex; align-items:center; justify-content:center;
    animation:fadeIn 0.2s both;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .rm-modal {
    background:#0f1628; border:1px solid rgba(249,115,22,0.2);
    border-radius:20px; padding:32px;
    width:360px; text-align:center;
    box-shadow:0 40px 80px rgba(0,0,0,0.6);
    animation:modalIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes modalIn {
    from{opacity:0;transform:scale(0.94) translateY(12px)}
    to{opacity:1;transform:scale(1) translateY(0)}
  }
  .rm-modal-icon { font-size:40px; margin-bottom:14px; }
  .rm-modal h3 { font-family:'Playfair Display',serif; font-size:20px; margin-bottom:8px; }
  .rm-modal p { color:rgba(255,255,255,0.4); font-size:13.5px; margin-bottom:24px; line-height:1.6; }
  .rm-modal-actions { display:flex; gap:12px; }
  .rm-modal-cancel {
    flex:1; padding:11px; border-radius:11px;
    border:1px solid rgba(255,255,255,0.1); background:transparent;
    color:rgba(255,255,255,0.5); font-family:'DM Sans',sans-serif;
    font-size:14px; cursor:pointer; transition:all 0.2s;
  }
  .rm-modal-cancel:hover { border-color:rgba(255,255,255,0.25); color:#fff; }
  .rm-modal-confirm {
    flex:1; padding:11px; border-radius:11px;
    border:1px solid rgba(239,68,68,0.3);
    background:rgba(239,68,68,0.12); color:#f87171;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
    cursor:pointer; transition:all 0.2s;
  }
  .rm-modal-confirm:hover { background:rgba(239,68,68,0.25); color:#fca5a5; }

  @media(max-width:900px) {
    .rm-main { padding:24px 20px; }
    .rm-form-row { grid-template-columns:1fr 1fr; }
    .rm-stats-row { grid-template-columns:1fr 1fr; }
  }
`;

const NAV_ITEMS = [
  { icon:"🏠", label:"Manage Rooms",      path:"/admin/rooms",      active:true  },
  { icon:"🎓", label:"Student Dashboard", path:"/student"                        },
  { icon:"👥", label:"Manage Students",   path:"/admin/students"                 },
  { icon:"📋", label:"Entry Logs",        path:"/admin/logs"                     },
  { icon:"💬", label:"Complaints",        path:"/admin/complaints"               },
  { icon:"🚨", label:"SOS Alerts",        path:"/admin/sos"                      },
  { icon:"💰", label:"Rent Management",   path:"/admin/rent"                     },
  { icon:"📊", label:"Analytics",         path:"/admin/analytics"                },
];

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`rm-toast ${type}`}>
      {type === "success" ? "✅" : "⚠"} {msg}
    </div>
  );
}

function ConfirmModal({ roomNumber, onConfirm, onCancel }) {
  return (
    <div className="rm-overlay">
      <div className="rm-modal">
        <div className="rm-modal-icon">🗑️</div>
        <h3>Delete Room {roomNumber}?</h3>
        <p>This action is permanent and cannot be undone. All associated data will be removed.</p>
        <div className="rm-modal-actions">
          <button className="rm-modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="rm-modal-confirm" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [rent, setRent] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [confirmRoom, setConfirmRoom] = useState("");

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRooms(data);
    } catch {
      showToast("Failed to fetch rooms", "error");
    } finally {
      setLoading(false);
    }
  };
  // Room inventory loads once and is refreshed after create/delete actions.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchRooms();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ roomNumber, capacity: Number(capacity), rent: Number(rent) }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed");
      }
      showToast(`Room ${roomNumber} added successfully`);
      setRoomNumber(""); setCapacity(""); setRent("");
      fetchRooms();
    } catch (err) {
      showToast(err.message || "Failed to add room", "error");
    }
  };

  const handleDeleteRoom = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/${confirmId}`, {
        method: "DELETE", headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      showToast(`Room ${confirmRoom} deleted`);
      setConfirmId(null);
      fetchRooms();
    } catch {
      showToast("Failed to delete room", "error");
      setConfirmId(null);
    }
  };

  // Derived stats
  const totalRooms = rooms.length;
  const totalCapacity = rooms.reduce((s, r) => s + (r.capacity || 0), 0);
  const avgRent = totalRooms ? Math.round(rooms.reduce((s, r) => s + (r.rent || 0), 0) / totalRooms) : 0;

  if (loading && rooms.length === 0) return (
    <>
      <style>{styles}</style>
      <div className="rm-loading">
        <div className="rm-loading-ring" />
        <p>Loading rooms…</p>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="rm-root">
        <div className="rm-blob rm-blob-1" />
        <div className="rm-blob rm-blob-2" />
        <div className="rm-blob rm-blob-3" />
        <div className="rm-grid" />

        {/* ── Sidebar ── */}
        <aside className="rm-sidebar">
          <div className="rm-sidebar-logo">🏠</div>
          {NAV_ITEMS.map((item, i) => (
            <button key={i}
              className={`rm-nav-btn ${item.active ? "active" : ""}`}
              onClick={() => { window.location.href = item.path; }}
            >
              {item.icon}
              <span className="rm-tooltip">{item.label}</span>
            </button>
          ))}
          <div className="rm-sidebar-spacer" />
          <button className="rm-logout-btn" onClick={() => {
            clearAuth();
            window.location.href = "/";
          }}>↩</button>
        </aside>

        {/* ── Main ── */}
        <main className="rm-main">

          {/* Top Bar */}
          <div className="rm-topbar">
            <div className="rm-topbar-left">
              <h1>Room <span>Management</span></h1>
              <p>SafeNest · Add, view and manage all hostel rooms</p>
            </div>
            <div className="rm-topbar-right">
              <button className="rm-back-btn" onClick={() => { window.location.href = "/admin"; }}>
                ← Dashboard
              </button>
              <div className="rm-avatar">A</div>
            </div>
          </div>

          {/* Add Room Form */}
          <div className="rm-section-label">Add New Room</div>
          <div className="rm-divider" />
          <div className="rm-form-card">
            <div className="rm-form-title">Register a Room</div>
            <form onSubmit={handleAddRoom}>
              <div className="rm-form-row">
                <div className="rm-field-wrap">
                  <label className="rm-field-label">Room Number</label>
                  <input className="rm-input" type="text" placeholder="e.g. A101"
                    value={roomNumber} onChange={e => setRoomNumber(e.target.value)} required />
                </div>
                <div className="rm-field-wrap">
                  <label className="rm-field-label">Capacity</label>
                  <input className="rm-input" type="number" placeholder="e.g. 3" min="1"
                    value={capacity} onChange={e => setCapacity(e.target.value)} required />
                </div>
                <div className="rm-field-wrap">
                  <label className="rm-field-label">Monthly Rent (₹)</label>
                  <input className="rm-input" type="number" placeholder="e.g. 8000" min="0"
                    value={rent} onChange={e => setRent(e.target.value)} required />
                </div>
                <button type="submit" className="rm-add-btn">+ Add Room</button>
              </div>
            </form>
          </div>

          {/* Mini Stats */}
          <div className="rm-stats-row">
            <div className="rm-mini-stat">
              <div className="rm-mini-icon" style={{background:"rgba(249,115,22,0.12)",border:"1px solid rgba(249,115,22,0.2)"}}>🏢</div>
              <div className="rm-mini-info">
                <div className="rm-mini-val" style={{color:"#f97316"}}>{totalRooms}</div>
                <div className="rm-mini-lbl">Total Rooms</div>
              </div>
            </div>
            <div className="rm-mini-stat">
              <div className="rm-mini-icon" style={{background:"rgba(34,211,238,0.1)",border:"1px solid rgba(34,211,238,0.2)"}}>🛏</div>
              <div className="rm-mini-info">
                <div className="rm-mini-val" style={{color:"#22d3ee"}}>{totalCapacity}</div>
                <div className="rm-mini-lbl">Total Bed Capacity</div>
              </div>
            </div>
            <div className="rm-mini-stat">
              <div className="rm-mini-icon" style={{background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.2)"}}>💰</div>
              <div className="rm-mini-info">
                <div className="rm-mini-val" style={{color:"#fbbf24"}}>₹{avgRent.toLocaleString()}</div>
                <div className="rm-mini-lbl">Average Rent</div>
              </div>
            </div>
          </div>

          {/* Room Cards */}
          <div className="rm-section-label">All Rooms</div>
          <div className="rm-divider" />

          {rooms.length === 0 ? (
            <div className="rm-empty">
              <div className="rm-empty-icon">🏢</div>
              <h3>No rooms yet</h3>
              <p>Add your first room using the form above</p>
            </div>
          ) : (
            <div className="rm-cards-grid">
              {rooms.map((room, idx) => {
                const isOccupied = (room.occupants?.length || 0) >= room.capacity;
                const occupied = room.occupants?.length || 0;
                return (
                  <div className="rm-room-card" key={room._id}
                    style={{ animationDelay: `${0.05 * idx}s` }}
                  >
                    <div className="rm-room-strip"
                      style={{ background: isOccupied
                        ? "linear-gradient(90deg,#a78bfa,#7c3aed)"
                        : "linear-gradient(90deg,#34d399,#059669)" }} />

                    <div className="rm-room-header">
                      <div className="rm-room-number">#{room.roomNumber}</div>
                      <div className={`rm-room-status ${isOccupied ? "occupied" : "available"}`}>
                        {isOccupied ? "Occupied" : "Available"}
                      </div>
                    </div>

                    <div className="rm-room-meta">
                      <div className="rm-meta-item">
                        <div className="rm-meta-label">Capacity</div>
                        <div className="rm-meta-value">{room.capacity} beds</div>
                      </div>
                      <div className="rm-meta-item">
                        <div className="rm-meta-label">Monthly Rent</div>
                        <div className="rm-meta-value rent">₹{room.rent?.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="rm-occ-wrap">
                      <div className="rm-occ-label">Occupancy · {occupied}/{room.capacity}</div>
                      <div className="rm-occ-dots">
                        {Array.from({ length: room.capacity }).map((_, i) => (
                          <div key={i} className={`rm-dot ${i < occupied ? "filled" : ""}`} />
                        ))}
                      </div>
                    </div>

                    <button className="rm-delete-btn"
                      onClick={() => { setConfirmId(room._id); setConfirmRoom(room.roomNumber); }}>
                      🗑 Remove Room
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Confirm Modal */}
        {confirmId && (
          <ConfirmModal
            roomNumber={confirmRoom}
            onConfirm={handleDeleteRoom}
            onCancel={() => setConfirmId(null)}
          />
        )}

        {/* Toast */}
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}

export default Rooms;
