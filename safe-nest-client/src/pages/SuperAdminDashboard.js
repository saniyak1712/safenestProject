import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, authHeaders, clearAuth } from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .sa-root { min-height:100vh; background:#0a0f1e; font-family:'DM Sans',sans-serif; color:#fff; }

  /* Sidebar */
  .sa-sidebar {
    position:fixed; top:0; left:0; width:240px; height:100vh;
    background:rgba(255,255,255,0.03); border-right:1px solid rgba(249,115,22,0.15);
    backdrop-filter:blur(20px); padding:32px 20px; display:flex; flex-direction:column; gap:8px; z-index:100;
  }
  .sa-brand { display:flex; align-items:center; gap:10px; margin-bottom:32px; }
  .sa-brand-icon { width:40px; height:40px; background:linear-gradient(135deg,#f97316,#fbbf24); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 6px 20px rgba(249,115,22,0.4); }
  .sa-brand-text { font-family:'Playfair Display',serif; font-size:20px; font-weight:800; }
  .sa-brand-text span { color:#f97316; }
  .sa-badge { font-size:9px; font-weight:600; background:rgba(249,115,22,0.2); color:#f97316; border:1px solid rgba(249,115,22,0.3); border-radius:4px; padding:2px 6px; text-transform:uppercase; letter-spacing:1px; margin-top:4px; display:inline-block; }

  .sa-nav-item {
    display:flex; align-items:center; gap:10px; padding:11px 14px; border-radius:10px;
    color:rgba(255,255,255,0.5); font-size:14px; cursor:pointer; text-decoration:none;
    transition:all 0.2s; border:1px solid transparent;
  }
  .sa-nav-item:hover { background:rgba(249,115,22,0.08); color:#f97316; border-color:rgba(249,115,22,0.15); }
  .sa-nav-item.active { background:rgba(249,115,22,0.12); color:#f97316; border-color:rgba(249,115,22,0.25); }
  .sa-nav-spacer { flex:1; }
  .sa-logout { color:rgba(239,68,68,0.7) !important; }
  .sa-logout:hover { background:rgba(239,68,68,0.08) !important; color:#ef4444 !important; border-color:rgba(239,68,68,0.2) !important; }

  /* Main */
  .sa-main { margin-left:240px; padding:40px; min-height:100vh; }

  /* Header */
  .sa-header { margin-bottom:40px; animation:fadeUp 0.6s both; }
  .sa-header h1 { font-family:'Playfair Display',serif; font-size:32px; font-weight:800; margin-bottom:6px; }
  .sa-header p { color:rgba(255,255,255,0.4); font-size:14px; }

  /* Stats */
  .sa-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:20px; margin-bottom:40px; }
  .sa-stat {
    background:rgba(255,255,255,0.03); border:1px solid rgba(249,115,22,0.12);
    border-radius:16px; padding:24px; animation:fadeUp 0.6s both; cursor:pointer;
    transition:all 0.25s;
  }
  .sa-stat:hover { border-color:rgba(249,115,22,0.3); background:rgba(249,115,22,0.05); transform:translateY(-2px); }
  .sa-stat-icon { font-size:28px; margin-bottom:12px; }
  .sa-stat-value { font-size:36px; font-weight:700; color:#f97316; margin-bottom:4px; }
  .sa-stat-label { font-size:13px; color:rgba(255,255,255,0.4); }

  /* Quick actions */
  .sa-section-title { font-size:16px; font-weight:600; color:rgba(255,255,255,0.6); text-transform:uppercase; letter-spacing:1px; margin-bottom:16px; }
  .sa-actions { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; }
  .sa-action {
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
    border-radius:14px; padding:20px; cursor:pointer; transition:all 0.25s; text-decoration:none; color:inherit;
  }
  .sa-action:hover { border-color:rgba(249,115,22,0.3); background:rgba(249,115,22,0.06); transform:translateY(-2px); }
  .sa-action-icon { font-size:24px; margin-bottom:10px; }
  .sa-action-title { font-size:15px; font-weight:600; color:#fff; margin-bottom:4px; }
  .sa-action-desc { font-size:12px; color:rgba(255,255,255,0.35); }

  @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }

  /* Top accent line */
  .sa-sidebar::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#f97316,#fbbf24,transparent); }
`;

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [adminCount, setAdminCount] = useState("—");
  const name = localStorage.getItem("name") || "Super Admin";

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/superadmin/admins`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => Array.isArray(data) && setAdminCount(data.length))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/", { replace: true });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sa-root">

        {/* Sidebar */}
        <aside className="sa-sidebar">
          <div className="sa-brand">
            <div className="sa-brand-icon">🏠</div>
            <div>
              <div className="sa-brand-text">Safe<span>Nest</span></div>
              <span className="sa-badge">Super Admin</span>
            </div>
          </div>

          <div className="sa-nav-item active" onClick={() => navigate("/superadmin")}>🏠 Dashboard</div>
          <div className="sa-nav-item" onClick={() => navigate("/superadmin/admins")}>🛡 Manage Admins</div>
          <div className="sa-nav-item" onClick={() => navigate("/admin")}>📊 Admin Panel</div>

          <div className="sa-nav-spacer" />
          <div className="sa-nav-item sa-logout" onClick={handleLogout}>🚪 Logout</div>
        </aside>

        {/* Main */}
        <main className="sa-main">
          <div className="sa-header">
            <h1>Welcome, {name} 👑</h1>
            <p>SafeNest Super Admin Control Panel · Full system access</p>
          </div>

          {/* Stats */}
          <div className="sa-stats">
            <div className="sa-stat" onClick={() => navigate("/superadmin/admins")}>
              <div className="sa-stat-icon">🛡</div>
              <div className="sa-stat-value">{adminCount}</div>
              <div className="sa-stat-label">Active Admins</div>
            </div>
            <div className="sa-stat" onClick={() => navigate("/admin/students")}>
              <div className="sa-stat-icon">🎓</div>
              <div className="sa-stat-value">View</div>
              <div className="sa-stat-label">All Students</div>
            </div>
            <div className="sa-stat" onClick={() => navigate("/admin/analytics")}>
              <div className="sa-stat-icon">📊</div>
              <div className="sa-stat-value">View</div>
              <div className="sa-stat-label">Analytics</div>
            </div>
            <div className="sa-stat" onClick={() => navigate("/admin/sos")}>
              <div className="sa-stat-icon">🚨</div>
              <div className="sa-stat-value">View</div>
              <div className="sa-stat-label">SOS Alerts</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="sa-section-title">Quick Actions</div>
          <div className="sa-actions">
            <div className="sa-action" onClick={() => navigate("/superadmin/admins")}>
              <div className="sa-action-icon">➕</div>
              <div className="sa-action-title">Create Admin</div>
              <div className="sa-action-desc">Add a new admin account to the system</div>
            </div>
            <div className="sa-action" onClick={() => navigate("/admin/rooms")}>
              <div className="sa-action-icon">🏠</div>
              <div className="sa-action-title">Manage Rooms</div>
              <div className="sa-action-desc">View and manage all hostel rooms</div>
            </div>
            <div className="sa-action" onClick={() => navigate("/admin/complaints")}>
              <div className="sa-action-icon">📋</div>
              <div className="sa-action-title">Complaints</div>
              <div className="sa-action-desc">Review all student complaints</div>
            </div>
            <div className="sa-action" onClick={() => navigate("/admin/logs")}>
              <div className="sa-action-icon">📝</div>
              <div className="sa-action-title">Entry Logs</div>
              <div className="sa-action-desc">View all hostel entry & exit records</div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
