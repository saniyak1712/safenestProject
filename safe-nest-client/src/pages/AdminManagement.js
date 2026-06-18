import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, authHeaders, clearAuth } from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .am-root { min-height:100vh; background:#0a0f1e; font-family:'DM Sans',sans-serif; color:#fff; }

  /* Sidebar */
  .am-sidebar {
    position:fixed; top:0; left:0; width:240px; height:100vh;
    background:rgba(255,255,255,0.03); border-right:1px solid rgba(249,115,22,0.15);
    backdrop-filter:blur(20px); padding:32px 20px; display:flex; flex-direction:column; gap:8px; z-index:100;
  }
  .am-sidebar::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#f97316,#fbbf24,transparent); }
  .am-brand { display:flex; align-items:center; gap:10px; margin-bottom:32px; }
  .am-brand-icon { width:40px; height:40px; background:linear-gradient(135deg,#f97316,#fbbf24); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 6px 20px rgba(249,115,22,0.4); }
  .am-brand-text { font-family:'Playfair Display',serif; font-size:20px; font-weight:800; }
  .am-brand-text span { color:#f97316; }
  .am-badge { font-size:9px; font-weight:600; background:rgba(249,115,22,0.2); color:#f97316; border:1px solid rgba(249,115,22,0.3); border-radius:4px; padding:2px 6px; text-transform:uppercase; letter-spacing:1px; margin-top:4px; display:inline-block; }
  .am-nav-item { display:flex; align-items:center; gap:10px; padding:11px 14px; border-radius:10px; color:rgba(255,255,255,0.5); font-size:14px; cursor:pointer; transition:all 0.2s; border:1px solid transparent; }
  .am-nav-item:hover { background:rgba(249,115,22,0.08); color:#f97316; border-color:rgba(249,115,22,0.15); }
  .am-nav-item.active { background:rgba(249,115,22,0.12); color:#f97316; border-color:rgba(249,115,22,0.25); }
  .am-nav-spacer { flex:1; }
  .am-logout { color:rgba(239,68,68,0.7) !important; }
  .am-logout:hover { background:rgba(239,68,68,0.08) !important; color:#ef4444 !important; border-color:rgba(239,68,68,0.2) !important; }

  /* Main */
  .am-main { margin-left:240px; padding:40px; }
  .am-header { margin-bottom:32px; animation:fadeUp 0.5s both; }
  .am-header h1 { font-family:'Playfair Display',serif; font-size:30px; font-weight:800; margin-bottom:6px; }
  .am-header p { color:rgba(255,255,255,0.4); font-size:14px; }

  /* Create form */
  .am-create-card {
    background:rgba(255,255,255,0.03); border:1px solid rgba(249,115,22,0.18);
    border-radius:18px; padding:28px; margin-bottom:32px; animation:fadeUp 0.5s 0.1s both;
  }
  .am-create-title { font-size:15px; font-weight:600; color:rgba(255,255,255,0.7); margin-bottom:20px; display:flex; align-items:center; gap:8px; }
  .am-form-row { display:grid; grid-template-columns:1fr 1fr 1fr auto; gap:12px; align-items:end; }
  .am-field label { display:block; font-size:11px; font-weight:500; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:1px; margin-bottom:7px; }
  .am-input {
    width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
    border-radius:10px; padding:11px 14px; color:#fff; font-family:'DM Sans',sans-serif;
    font-size:14px; outline:none; transition:all 0.2s;
  }
  .am-input::placeholder { color:rgba(255,255,255,0.22); }
  .am-input:focus { background:rgba(249,115,22,0.06); border-color:rgba(249,115,22,0.5); box-shadow:0 0 0 3px rgba(249,115,22,0.08); }

  .am-btn-create {
    padding:11px 22px; background:linear-gradient(135deg,#f97316,#fbbf24);
    border:none; border-radius:10px; color:#fff; font-family:'DM Sans',sans-serif;
    font-size:14px; font-weight:500; cursor:pointer; transition:all 0.2s; white-space:nowrap;
    box-shadow:0 6px 20px rgba(249,115,22,0.3);
  }
  .am-btn-create:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(249,115,22,0.45); }
  .am-btn-create:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

  /* Admins list */
  .am-list-card { background:rgba(255,255,255,0.03); border:1px solid rgba(249,115,22,0.12); border-radius:18px; overflow:hidden; animation:fadeUp 0.5s 0.2s both; }
  .am-list-header { padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:space-between; }
  .am-list-header-title { font-size:15px; font-weight:600; color:rgba(255,255,255,0.7); }
  .am-count-badge { background:rgba(249,115,22,0.15); color:#f97316; border-radius:20px; padding:3px 10px; font-size:12px; font-weight:600; }

  .am-table { width:100%; border-collapse:collapse; }
  .am-th { padding:12px 20px; text-align:left; font-size:11px; font-weight:500; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid rgba(255,255,255,0.05); }
  .am-td { padding:16px 20px; font-size:14px; color:rgba(255,255,255,0.8); border-bottom:1px solid rgba(255,255,255,0.04); vertical-align:middle; }
  .am-tr:last-child .am-td { border-bottom:none; }
  .am-tr:hover .am-td { background:rgba(249,115,22,0.03); }

  .am-avatar { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#f97316,#fbbf24); display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; color:#fff; margin-right:10px; flex-shrink:0; }
  .am-name-cell { display:flex; align-items:center; }
  .am-role-badge { background:rgba(249,115,22,0.12); color:#f97316; border:1px solid rgba(249,115,22,0.25); border-radius:6px; padding:2px 8px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }

  .am-actions-cell { display:flex; align-items:center; gap:8px; }
  .am-btn-delete { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); color:#ef4444; border-radius:8px; padding:6px 12px; font-size:12px; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
  .am-btn-delete:hover { background:rgba(239,68,68,0.2); border-color:rgba(239,68,68,0.5); }
  .am-btn-pass { background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.25); color:#818cf8; border-radius:8px; padding:6px 12px; font-size:12px; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
  .am-btn-pass:hover { background:rgba(99,102,241,0.2); border-color:rgba(99,102,241,0.5); }

  /* Empty state */
  .am-empty { padding:48px; text-align:center; color:rgba(255,255,255,0.25); }
  .am-empty-icon { font-size:40px; margin-bottom:12px; }

  /* Alerts */
  .am-alert { border-radius:10px; padding:10px 14px; font-size:13px; margin-bottom:16px; animation:fadeUp 0.3s both; }
  .am-alert.success { background:rgba(52,211,153,0.1); border:1px solid rgba(52,211,153,0.3); color:#34d399; }
  .am-alert.error { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#fca5a5; }

  /* Password modal */
  .am-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:999; display:flex; align-items:center; justify-content:center; }
  .am-modal {
    background:#0f1629; border:1px solid rgba(249,115,22,0.25); border-radius:20px;
    padding:32px; width:100%; max-width:380px; animation:fadeUp 0.3s both;
  }
  .am-modal h3 { font-family:'Playfair Display',serif; font-size:22px; margin-bottom:6px; }
  .am-modal p { color:rgba(255,255,255,0.4); font-size:13px; margin-bottom:20px; }
  .am-modal-actions { display:flex; gap:10px; margin-top:16px; }
  .am-btn-cancel { flex:1; padding:11px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:10px; color:rgba(255,255,255,0.6); font-family:'DM Sans',sans-serif; font-size:14px; cursor:pointer; transition:all 0.2s; }
  .am-btn-confirm { flex:1; padding:11px; background:linear-gradient(135deg,#6366f1,#818cf8); border:none; border-radius:10px; color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; transition:all 0.2s; }
  .am-btn-confirm:disabled { opacity:0.5; cursor:not-allowed; }

  .am-spinner { display:inline-block; width:13px; height:13px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.6s linear infinite; vertical-align:middle; margin-right:6px; }
  @keyframes spin { to{transform:rotate(360deg);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
`;

export default function AdminManagement() {
  const navigate = useNavigate();

  // List state
  const [admins, setAdmins]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [alert, setAlert]       = useState(null); // { type, msg }

  // Create form state
  const [form, setForm]         = useState({ name: "", email: "", password: "" });
  const [creating, setCreating] = useState(false);

  // Password modal state
  const [pwModal, setPwModal]   = useState(null); // { adminId, adminName }
  const [newPw, setNewPw]       = useState("");
  const [changingPw, setChangingPw] = useState(false);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/all-admins`, { headers: authHeaders() });
      if (res.status === 401) { clearAuth(); navigate("/"); return; }
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch {
      showAlert("error", "Failed to load admins");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  // Create admin
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      return showAlert("error", "All fields are required");
    }
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/create-admin`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showAlert("success", `✅ Admin "${form.name}" created successfully`);
      setForm({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (err) {
      showAlert("error", err.message || "Failed to create admin");
    } finally {
      setCreating(false);
    }
  };

  // Delete admin
  const handleDelete = async (adminId, adminName) => {
    if (!window.confirm(`Delete admin "${adminName}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/${adminId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showAlert("success", `✅ Admin "${adminName}" deleted`);
      fetchAdmins();
    } catch (err) {
      showAlert("error", err.message || "Failed to delete admin");
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!newPw || newPw.length < 6) return showAlert("error", "Password must be at least 6 characters");
    setChangingPw(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/${pwModal.adminId}/password`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showAlert("success", `✅ Password updated for "${pwModal.adminName}"`);
      setPwModal(null);
      setNewPw("");
    } catch (err) {
      showAlert("error", err.message || "Failed to update password");
    } finally {
      setChangingPw(false);
    }
  };

  const handleLogout = () => { clearAuth(); navigate("/", { replace: true }); };

  return (
    <>
      <style>{styles}</style>
      <div className="am-root">

        {/* Sidebar */}
        <aside className="am-sidebar">
          <div className="am-brand">
            <div className="am-brand-icon">🏠</div>
            <div>
              <div className="am-brand-text">Safe<span>Nest</span></div>
              <span className="am-badge">Super Admin</span>
            </div>
          </div>
          <div className="am-nav-item" onClick={() => navigate("/superadmin")}>🏠 Dashboard</div>
          <div className="am-nav-item active">🛡 Manage Admins</div>
          <div className="am-nav-item" onClick={() => navigate("/admin")}>📊 Admin Panel</div>
          <div className="am-nav-spacer" />
          <div className="am-nav-item am-logout" onClick={handleLogout}>🚪 Logout</div>
        </aside>

        {/* Main */}
        <main className="am-main">
          <div className="am-header">
            <h1>Manage Admins 🛡</h1>
            <p>Create, view, and manage admin accounts · Only superAdmin can access this</p>
          </div>

          {alert && <div className={`am-alert ${alert.type}`}>{alert.msg}</div>}

          {/* Create Admin Form */}
          <div className="am-create-card">
            <div className="am-create-title">➕ Create New Admin</div>
            <form onSubmit={handleCreate}>
              <div className="am-form-row">
                <div className="am-field">
                  <label>Full Name</label>
                  <input className="am-input" placeholder="John Doe" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="am-field">
                  <label>Email</label>
                  <input className="am-input" type="email" placeholder="admin@example.com" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="am-field">
                  <label>Password</label>
                  <input className="am-input" type="password" placeholder="Min. 6 characters" value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                </div>
                <button className="am-btn-create" type="submit" disabled={creating}>
                  {creating ? <><span className="am-spinner" />Creating…</> : "Create Admin"}
                </button>
              </div>
            </form>
          </div>

          {/* Admins List */}
          <div className="am-list-card">
            <div className="am-list-header">
              <span className="am-list-header-title">All Admins</span>
              <span className="am-count-badge">{admins.length} admin{admins.length !== 1 ? "s" : ""}</span>
            </div>

            {loading ? (
              <div className="am-empty"><div className="am-spinner" style={{ width:24,height:24 }} /></div>
            ) : admins.length === 0 ? (
              <div className="am-empty">
                <div className="am-empty-icon">🛡</div>
                <div>No admins yet — create one above</div>
              </div>
            ) : (
              <table className="am-table">
                <thead>
                  <tr>
                    <th className="am-th">Admin</th>
                    <th className="am-th">Email</th>
                    <th className="am-th">Role</th>
                    <th className="am-th">Created</th>
                    <th className="am-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin._id} className="am-tr">
                      <td className="am-td">
                        <div className="am-name-cell">
                          <div className="am-avatar">{admin.name.charAt(0).toUpperCase()}</div>
                          {admin.name}
                        </div>
                      </td>
                      <td className="am-td">{admin.email}</td>
                      <td className="am-td"><span className="am-role-badge">{admin.role}</span></td>
                      <td className="am-td">{new Date(admin.createdAt).toLocaleDateString()}</td>
                      <td className="am-td">
                        <div className="am-actions-cell">
                          <button className="am-btn-pass"
                            onClick={() => { setPwModal({ adminId: admin._id, adminName: admin.name }); setNewPw(""); }}>
                            🔑 Password
                          </button>
                          <button className="am-btn-delete" onClick={() => handleDelete(admin._id, admin.name)}>
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Change Password Modal */}
      {pwModal && (
        <div className="am-modal-overlay" onClick={e => e.target === e.currentTarget && setPwModal(null)}>
          <div className="am-modal">
            <h3>Change Password</h3>
            <p>Setting new password for <strong style={{ color:"#f97316" }}>{pwModal.adminName}</strong></p>
            <div className="am-field">
              <label>New Password</label>
              <input className="am-input" type="password" placeholder="Min. 6 characters"
                value={newPw} onChange={e => setNewPw(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleChangePassword()} />
            </div>
            <div className="am-modal-actions">
              <button className="am-btn-cancel" onClick={() => setPwModal(null)}>Cancel</button>
              <button className="am-btn-confirm" onClick={handleChangePassword} disabled={changingPw}>
                {changingPw ? <><span className="am-spinner" />Saving…</> : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
