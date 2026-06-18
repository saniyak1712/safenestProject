import { useEffect, useState } from "react";
import { API_BASE_URL, clearAuth } from "../utils/api";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
 
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
  .ms-root {
    min-height: 100vh;
    background: #0a0f1e;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    overflow-x: hidden;
    position: relative;
  }
 
  /* ── Blobs ── */
  .ms-blob {
    position: fixed; border-radius: 50%;
    filter: blur(90px); opacity: 0.13;
    pointer-events: none;
    animation: blobFloat 9s ease-in-out infinite alternate;
  }
  .ms-blob-1 { width:560px;height:560px;background:radial-gradient(circle,#f97316,#ea580c);top:-140px;right:-100px;animation-delay:0s; }
  .ms-blob-2 { width:380px;height:380px;background:radial-gradient(circle,#fb923c,#f59e0b);bottom:-80px;left:-60px;animation-delay:3s; }
  .ms-blob-3 { width:280px;height:280px;background:radial-gradient(circle,#fcd34d,#f97316);top:45%;left:40%;animation-delay:1.5s; }
  @keyframes blobFloat {
    0%   { transform:scale(1) translate(0,0); }
    100% { transform:scale(1.1) translate(16px,-16px); }
  }
 
  /* ── Grid ── */
  .ms-grid {
    position:fixed; inset:0; pointer-events:none;
    background-image:
      linear-gradient(rgba(249,115,22,0.035) 1px,transparent 1px),
      linear-gradient(90deg,rgba(249,115,22,0.035) 1px,transparent 1px);
    background-size:52px 52px;
  }
 
  /* ── Sidebar ── */
  .ms-sidebar {
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
  .ms-sidebar-logo {
    width:44px;height:44px;border-radius:14px;
    background:linear-gradient(135deg,#f97316,#fbbf24);
    display:flex;align-items:center;justify-content:center;
    font-size:20px;margin-bottom:16px;
    box-shadow:0 8px 24px rgba(249,115,22,0.45);flex-shrink:0;
  }
  .ms-nav-btn {
    width:48px;height:48px;border-radius:14px;
    border:1px solid transparent;background:transparent;
    color:rgba(255,255,255,0.35);font-size:20px;
    cursor:pointer;display:flex;align-items:center;justify-content:center;
    transition:all 0.2s;position:relative;
  }
  .ms-nav-btn:hover,.ms-nav-btn.active {
    background:rgba(249,115,22,0.12);border-color:rgba(249,115,22,0.3);
    color:#f97316;box-shadow:0 0 20px rgba(249,115,22,0.15);
  }
  .ms-nav-btn .ms-tooltip {
    position:absolute;left:62px;
    background:rgba(15,20,40,0.95);border:1px solid rgba(249,115,22,0.2);
    color:#fff;font-size:12px;font-family:'DM Sans',sans-serif;
    padding:5px 10px;border-radius:8px;
    white-space:nowrap;pointer-events:none;
    opacity:0;transform:translateX(-6px);
    transition:all 0.18s;z-index:200;
  }
  .ms-nav-btn:hover .ms-tooltip{opacity:1;transform:translateX(0);}
  .ms-sidebar-spacer{flex:1;}
  .ms-logout-btn {
    width:44px;height:44px;border-radius:12px;
    border:1px solid rgba(239,68,68,0.25);
    background:rgba(239,68,68,0.06);color:rgba(239,68,68,0.6);
    font-size:18px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:all 0.2s;
  }
  .ms-logout-btn:hover{background:rgba(239,68,68,0.15);color:#f87171;border-color:rgba(239,68,68,0.5);}
 
  /* ── Main ── */
  .ms-main {
    margin-left:72px;
    padding:40px 48px;
    position:relative;z-index:1;
  }
 
  /* ── Top Bar ── */
  .ms-topbar {
    display:flex;align-items:center;justify-content:space-between;
    margin-bottom:40px;
    animation:fadeUp 0.6s 0.1s both;
  }
  .ms-topbar-left h1 {
    font-family:'Playfair Display',serif;
    font-size:34px;font-weight:800;
    letter-spacing:-0.8px;line-height:1.1;
  }
  .ms-topbar-left h1 span{color:#f97316;}
  .ms-topbar-left p{color:rgba(255,255,255,0.38);font-size:13.5px;margin-top:5px;font-weight:300;}
  .ms-topbar-right{display:flex;align-items:center;gap:14px;}
  .ms-back-btn {
    background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);
    border-radius:12px;padding:9px 18px;color:rgba(255,255,255,0.6);
    font-family:'DM Sans',sans-serif;font-size:13.5px;cursor:pointer;
    display:flex;align-items:center;gap:7px;transition:all 0.2s;
  }
  .ms-back-btn:hover{border-color:rgba(249,115,22,0.35);color:#f97316;background:rgba(249,115,22,0.07);}
  .ms-avatar {
    width:40px;height:40px;border-radius:12px;
    background:linear-gradient(135deg,#f97316,#fbbf24);
    display:flex;align-items:center;justify-content:center;
    font-size:16px;font-weight:700;color:#fff;
    box-shadow:0 4px 16px rgba(249,115,22,0.35);
  }
 
  /* ── Section label / divider ── */
  .ms-section-label {
    font-size:11px;font-weight:600;
    text-transform:uppercase;letter-spacing:1.5px;
    color:rgba(255,255,255,0.25);margin-bottom:16px;
  }
  .ms-divider {
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(249,115,22,0.18),transparent);
    margin:8px 0 28px;
  }
 
  /* ── Stats row ── */
  .ms-stats-row {
    display:grid;grid-template-columns:repeat(3,1fr);
    gap:16px;margin-bottom:36px;
    animation:fadeUp 0.6s 0.15s both;
  }
  .ms-mini-stat {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:16px;padding:18px 20px;
    display:flex;align-items:center;gap:14px;
    transition:all 0.22s;
  }
  .ms-mini-stat:hover{border-color:rgba(249,115,22,0.25);transform:translateY(-2px);}
  .ms-mini-icon {
    width:40px;height:40px;border-radius:10px;
    display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;
  }
  .ms-mini-val {
    font-family:'Playfair Display',serif;
    font-size:26px;font-weight:800;line-height:1;
  }
  .ms-mini-lbl{font-size:11.5px;color:rgba(255,255,255,0.3);margin-top:3px;}
 
  /* ── Search bar ── */
  .ms-search-wrap {
    position:relative;margin-bottom:28px;
    animation:fadeUp 0.6s 0.2s both;
    max-width:380px;
  }
  .ms-search-icon {
    position:absolute;left:14px;top:50%;transform:translateY(-50%);
    font-size:15px;color:rgba(249,115,22,0.45);pointer-events:none;
  }
  .ms-search {
    width:100%;background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);border-radius:12px;
    padding:11px 16px 11px 40px;color:#fff;
    font-family:'DM Sans',sans-serif;font-size:14px;outline:none;
    transition:all 0.22s;
  }
  .ms-search::placeholder{color:rgba(255,255,255,0.2);}
  .ms-search:focus{
    background:rgba(249,115,22,0.06);
    border-color:rgba(249,115,22,0.45);
    box-shadow:0 0 0 3px rgba(249,115,22,0.1);
  }
 
  /* ── Student Cards Grid ── */
  .ms-cards-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
    gap:18px;
  }
 
  .ms-student-card {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:20px;padding:24px;
    position:relative;overflow:hidden;
    transition:all 0.25s;
    animation:fadeUp 0.5s both;
  }
  .ms-student-card:hover {
    border-color:rgba(249,115,22,0.28);
    transform:translateY(-4px);
    box-shadow:0 20px 50px rgba(0,0,0,0.4),0 0 24px rgba(249,115,22,0.07);
  }
  .ms-student-card::before {
    content:'';position:absolute;inset:0;border-radius:20px;
    background:radial-gradient(circle at 85% 10%,rgba(249,115,22,0.06),transparent 60%);
    opacity:0;transition:opacity 0.3s;
  }
  .ms-student-card:hover::before{opacity:1;}
 
  /* avatar + info row */
  .ms-card-header {
    display:flex;align-items:center;gap:14px;margin-bottom:20px;
  }
  .ms-student-avatar {
    width:46px;height:46px;border-radius:14px;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;
    font-size:18px;font-weight:700;color:#fff;
    background:linear-gradient(135deg,#f97316,#fbbf24);
    box-shadow:0 4px 14px rgba(249,115,22,0.3);
  }
  .ms-student-info{}
  .ms-student-name {
    font-family:'Playfair Display',serif;
    font-size:17px;font-weight:700;letter-spacing:-0.3px;
  }
  .ms-student-email {
    font-size:12px;color:rgba(255,255,255,0.35);margin-top:3px;
  }
  .ms-room-tag {
    margin-left:auto;flex-shrink:0;
    padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;
    background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.25);color:#6ee7b7;
  }
  .ms-room-tag.unassigned {
    background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.1);color:rgba(255,255,255,0.3);
  }
 
  /* assign row */
  .ms-assign-row {
    display:flex;gap:10px;align-items:center;
  }
  .ms-select-wrap{position:relative;flex:1;}
  .ms-select-arrow {
    position:absolute;right:12px;top:50%;transform:translateY(-50%);
    color:rgba(249,115,22,0.5);pointer-events:none;font-size:12px;
  }
  .ms-select {
    width:100%;appearance:none;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.09);border-radius:12px;
    padding:11px 34px 11px 14px;color:#fff;
    font-family:'DM Sans',sans-serif;font-size:13.5px;outline:none;
    cursor:pointer;transition:all 0.22s;
  }
  .ms-select option{background:#0f1628;color:#fff;}
  .ms-select:focus{
    background:rgba(249,115,22,0.06);
    border-color:rgba(249,115,22,0.45);
    box-shadow:0 0 0 3px rgba(249,115,22,0.1);
  }
  .ms-assign-btn {
    padding:11px 20px;border:none;border-radius:12px;
    background:linear-gradient(135deg,#f97316,#fbbf24);
    color:#fff;font-family:'DM Sans',sans-serif;
    font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap;
    box-shadow:0 4px 16px rgba(249,115,22,0.3);
    transition:transform 0.2s,box-shadow 0.2s;
    position:relative;overflow:hidden;
  }
  .ms-assign-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(249,115,22,0.45);}
  .ms-assign-btn:active{transform:translateY(0);}
  .ms-assign-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
  .ms-assign-btn::after {
    content:'';position:absolute;top:0;left:-100%;
    width:60%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
    transform:skewX(-20deg);animation:shimmer 3s 1s infinite;
  }
  @keyframes shimmer{0%{left:-100%}100%{left:160%}}
 
  /* ── Empty state ── */
  .ms-empty {
    text-align:center;padding:80px 0;
    animation:fadeUp 0.6s both;
  }
  .ms-empty-icon{font-size:52px;margin-bottom:16px;opacity:0.4;}
  .ms-empty h3{font-family:'Playfair Display',serif;font-size:22px;color:rgba(255,255,255,0.4);margin-bottom:8px;}
  .ms-empty p{font-size:13.5px;color:rgba(255,255,255,0.2);}
 
  /* ── Loading ── */
  .ms-loading {
    min-height:100vh;background:#0a0f1e;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;
  }
  .ms-loading-ring {
    width:48px;height:48px;
    border:3px solid rgba(249,115,22,0.15);border-top-color:#f97316;
    border-radius:50%;animation:spin 0.8s linear infinite;
  }
  @keyframes spin{to{transform:rotate(360deg);}}
  .ms-loading p{color:rgba(255,255,255,0.3);font-size:14px;}
 
  /* ── Toast ── */
  .ms-toast {
    position:fixed;bottom:28px;right:28px;z-index:999;
    padding:13px 20px;border-radius:14px;
    font-size:13.5px;font-family:'DM Sans',sans-serif;
    display:flex;align-items:center;gap:10px;
    backdrop-filter:blur(20px);
    animation:toastIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
    box-shadow:0 16px 40px rgba(0,0,0,0.4);
  }
  .ms-toast.success{background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.3);color:#6ee7b7;}
  .ms-toast.error{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#fca5a5;}
  @keyframes toastIn{
    from{opacity:0;transform:translateY(16px) scale(0.97);}
    to{opacity:1;transform:translateY(0) scale(1);}
  }
 
  /* ── Spinner inside button ── */
  .ms-btn-spinner {
    display:inline-block;width:13px;height:13px;
    border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;
    border-radius:50%;animation:spin 0.6s linear infinite;
    vertical-align:middle;margin-right:6px;
  }
 
  @keyframes fadeUp{
    from{opacity:0;transform:translateY(18px);}
    to{opacity:1;transform:translateY(0);}
  }
 
  @media(max-width:900px){
    .ms-main{padding:24px 20px;}
    .ms-stats-row{grid-template-columns:1fr 1fr;}
    .ms-cards-grid{grid-template-columns:1fr;}
  }
`;
 
const NAV_ITEMS = [
  { icon:"🏠", label:"Manage Rooms",      path:"/admin/rooms"      },
  { icon:"🎓", label:"Student Dashboard", path:"/student"          },
  { icon:"👥", label:"Manage Students",   path:"/admin/students",  active:true },
  { icon:"📋", label:"Entry Logs",        path:"/admin/logs"       },
  { icon:"💬", label:"Complaints",        path:"/admin/complaints" },
  { icon:"🚨", label:"SOS Alerts",        path:"/admin/sos"        },
  { icon:"💰", label:"Rent Management",   path:"/admin/rent"       },
  { icon:"📊", label:"Analytics",         path:"/admin/analytics"  },
];
 
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`ms-toast ${type}`}>{type === "success" ? "✅" : "⚠"} {msg}</div>;
}
 
function getInitials(name) {
  return name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) : "?";
}
 
function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState({});
  const [assigning, setAssigning] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
 
  // Student and room lists are loaded once and refreshed after assignment.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchStudents(); fetchRooms(); },[]);
 
  const showToast = (msg, type = "success") => setToast({ msg, type });
 
  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
 
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/students`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStudents(data);
    } catch {
      showToast("Failed to fetch students", "error");
    } finally {
      setLoading(false);
    }
  };
 
  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRooms(data);
    } catch {}
  };

   
 
  const assignRoom = async (studentId) => {
    const roomId = selectedRoom[studentId];
    if (!roomId) { showToast("Please select a room first", "error"); return; }
    setAssigning(a => ({ ...a, [studentId]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms/${roomId}/assign/${studentId}`, {
        method: "PUT", headers: authHeaders(), body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error();
      const roomName = rooms.find(r => r._id === roomId)?.roomNumber || "";
      showToast(`Room ${roomName} assigned successfully`);
      fetchStudents();
      fetchRooms();
    } catch {
      showToast("Failed to assign room", "error");
    } finally {
      setAssigning(a => ({ ...a, [studentId]: false }));
    }
  };
 
  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );
 
  const assigned = students.filter(s => s.room).length;
  const unassigned = students.length - assigned;
 
  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="ms-loading">
        <div className="ms-loading-ring" />
        <p>Loading students…</p>
      </div>
    </>
  );
 
  return (
    <>
      <style>{styles}</style>
      <div className="ms-root">
        <div className="ms-blob ms-blob-1" />
        <div className="ms-blob ms-blob-2" />
        <div className="ms-blob ms-blob-3" />
        <div className="ms-grid" />
 
        {/* ── Sidebar ── */}
        <aside className="ms-sidebar">
          <div className="ms-sidebar-logo">🏠</div>
          {NAV_ITEMS.map((item, i) => (
            <button key={i}
              className={`ms-nav-btn ${item.active ? "active" : ""}`}
              onClick={() => { window.location.href = item.path; }}
            >
              {item.icon}
              <span className="ms-tooltip">{item.label}</span>
            </button>
          ))}
          <div className="ms-sidebar-spacer" />
          <button className="ms-logout-btn" onClick={() => {
            clearAuth();
            window.location.href = "/";
          }}>↩</button>
        </aside>
 
        {/* ── Main ── */}
        <main className="ms-main">
 
          {/* Top Bar */}
          <div className="ms-topbar">
            <div className="ms-topbar-left">
              <h1>Manage <span>Students</span></h1>
              <p>SafeNest · Assign and oversee all hostel residents</p>
            </div>
            <div className="ms-topbar-right">
              <button className="ms-back-btn" onClick={() => { window.location.href = "/admin"; }}>
                ← Dashboard
              </button>
              <div className="ms-avatar">A</div>
            </div>
          </div>
 
          {/* Stats */}
          <div className="ms-stats-row">
            <div className="ms-mini-stat">
              <div className="ms-mini-icon" style={{background:"rgba(249,115,22,0.12)",border:"1px solid rgba(249,115,22,0.2)"}}>👥</div>
              <div>
                <div className="ms-mini-val" style={{color:"#f97316"}}>{students.length}</div>
                <div className="ms-mini-lbl">Total Students</div>
              </div>
            </div>
            <div className="ms-mini-stat">
              <div className="ms-mini-icon" style={{background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)"}}>✅</div>
              <div>
                <div className="ms-mini-val" style={{color:"#34d399"}}>{assigned}</div>
                <div className="ms-mini-lbl">Room Assigned</div>
              </div>
            </div>
            <div className="ms-mini-stat">
              <div className="ms-mini-icon" style={{background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.2)"}}>⏳</div>
              <div>
                <div className="ms-mini-val" style={{color:"#fbbf24"}}>{unassigned}</div>
                <div className="ms-mini-lbl">Awaiting Room</div>
              </div>
            </div>
          </div>
 
          {/* Search */}
          <div className="ms-search-wrap">
            <span className="ms-search-icon">🔍</span>
            <input
              className="ms-search"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
 
          {/* Section */}
          <div className="ms-section-label">All Students ({filtered.length})</div>
          <div className="ms-divider" />
 
          {filtered.length === 0 ? (
            <div className="ms-empty">
              <div className="ms-empty-icon">👥</div>
              <h3>{search ? "No matches found" : "No students yet"}</h3>
              <p>{search ? "Try a different name or email" : "Students will appear here once registered"}</p>
            </div>
          ) : (
            <div className="ms-cards-grid">
              {filtered.map((student, idx) => {
                const currentRoom = rooms.find(r =>
                  r.occupants?.some(o => (o._id || o) === student._id)
                );
                return (
                  <div className="ms-student-card" key={student._id}
                    style={{ animationDelay: `${0.05 * idx}s` }}
                  >
                    <div className="ms-card-header">
                      <div className="ms-student-avatar">{getInitials(student.name)}</div>
                      <div className="ms-student-info">
                        <div className="ms-student-name">{student.name}</div>
                        <div className="ms-student-email">{student.email}</div>
                      </div>
                      <div className={`ms-room-tag ${currentRoom ? "" : "unassigned"}`}>
                        {currentRoom ? `Room ${currentRoom.roomNumber}` : "Unassigned"}
                      </div>
                    </div>
 
                    <div className="ms-assign-row">
                      <div className="ms-select-wrap">
                        <select
                          className="ms-select"
                          value={selectedRoom[student._id] || ""}
                          onChange={e => setSelectedRoom({ ...selectedRoom, [student._id]: e.target.value })}
                        >
                          <option value="">Select a room…</option>
                          {rooms.map(room => (
                            <option key={room._id} value={room._id}>
                              Room {room.roomNumber} · {room.capacity} beds · ₹{room.rent?.toLocaleString()}
                            </option>
                          ))}
                        </select>
                        <span className="ms-select-arrow">▾</span>
                      </div>
 
                      <button
                        className="ms-assign-btn"
                        onClick={() => assignRoom(student._id)}
                        disabled={assigning[student._id] || !selectedRoom[student._id]}
                      >
                        {assigning[student._id]
                          ? <><span className="ms-btn-spinner" />Assigning…</>
                          : "Assign →"
                        }
                      </button>
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
 
export default ManageStudents;
