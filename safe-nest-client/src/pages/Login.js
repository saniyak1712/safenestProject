import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL, dashboardPathFor } from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .sn-root {
    min-height: 100vh;
    background: #0a0f1e;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
    position: relative;
  }

  /* Ambient blobs */
  .sn-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
    pointer-events: none;
    animation: blobFloat 8s ease-in-out infinite alternate;
  }
  .sn-blob-1 {
    width: 520px; height: 520px;
    background: radial-gradient(circle, #f97316, #ea580c);
    top: -120px; right: -80px;
    animation-delay: 0s;
  }
  .sn-blob-2 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, #fb923c, #f59e0b);
    bottom: -80px; left: -60px;
    animation-delay: 3s;
  }
  .sn-blob-3 {
    width: 260px; height: 260px;
    background: radial-gradient(circle, #fcd34d, #f97316);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 1.5s;
  }

  @keyframes blobFloat {
    0% { transform: scale(1) translate(0, 0); }
    100% { transform: scale(1.12) translate(20px, -20px); }
  }

  /* Grid texture */
  .sn-grid {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  /* Card */
  .sn-card {
    position: relative;
    width: 440px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(249,115,22,0.18);
    border-radius: 24px;
    padding: 52px 44px 44px;
    backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(249,115,22,0.06),
      0 32px 80px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.06);
    animation: cardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Top accent line */
  .sn-card::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #f97316, #fbbf24, transparent);
    border-radius: 0 0 2px 2px;
  }

  /* Logo */
  .sn-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
    animation: fadeUp 0.6s 0.1s both;
  }

  .sn-logo-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #f97316, #fbbf24);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    box-shadow: 0 8px 24px rgba(249,115,22,0.4);
  }

  .sn-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.5px;
  }

  .sn-logo-text span {
    color: #f97316;
  }

  /* Heading */
  .sn-heading {
    animation: fadeUp 0.6s 0.15s both;
    margin-bottom: 8px;
  }

  .sn-heading h1 {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }

  .sn-heading p {
    color: rgba(255,255,255,0.4);
    font-size: 14px;
    margin-top: 6px;
    font-weight: 300;
    letter-spacing: 0.2px;
  }

  /* Divider */
  .sn-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(249,115,22,0.2), transparent);
    margin: 24px 0;
    animation: fadeUp 0.6s 0.2s both;
  }

  /* Field */
  .sn-field {
    margin-bottom: 18px;
    animation: fadeUp 0.6s both;
  }
  .sn-field:nth-child(1) { animation-delay: 0.25s; }
  .sn-field:nth-child(2) { animation-delay: 0.3s; }

  .sn-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.45);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }

  .sn-input-wrap {
    position: relative;
  }

  .sn-input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(249,115,22,0.5);
    font-size: 16px;
    pointer-events: none;
    transition: color 0.2s;
  }

  .sn-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 14px 16px 14px 44px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    transition: all 0.25s;
  }

  .sn-input::placeholder { color: rgba(255,255,255,0.22); }

  .sn-input:focus {
    background: rgba(249,115,22,0.06);
    border-color: rgba(249,115,22,0.5);
    box-shadow: 0 0 0 3px rgba(249,115,22,0.1);
  }

  .sn-input:focus + .sn-input-icon { color: #f97316; }

  /* Eye toggle */
  .sn-eye {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255,255,255,0.3);
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
    transition: color 0.2s;
  }
  .sn-eye:hover { color: #f97316; }

  /* Forgot */
  .sn-forgot {
    text-align: right;
    margin-top: 8px;
  }
  .sn-forgot a {
    color: rgba(249,115,22,0.7);
    font-size: 12.5px;
    text-decoration: none;
    transition: color 0.2s;
  }
  .sn-forgot a:hover { color: #f97316; }

  /* Login Button */
  .sn-btn-login {
    width: 100%;
    padding: 15px;
    margin-top: 28px;
    background: linear-gradient(135deg, #f97316, #fb923c, #fbbf24);
    background-size: 200% 200%;
    animation: fadeUp 0.6s 0.35s both, gradientShift 4s ease infinite;
    border: none;
    border-radius: 12px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.3px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(249,115,22,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .sn-btn-login:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(249,115,22,0.5);
  }

  .sn-btn-login:active { transform: translateY(0); }

  /* Shimmer on button */
  .sn-btn-login::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    transform: skewX(-20deg);
    animation: shimmer 3s 2s infinite;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 160%; }
  }

  /* Divider OR */
  .sn-or {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
    animation: fadeUp 0.6s 0.4s both;
  }

  .sn-or-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }

  .sn-or span {
    color: rgba(255,255,255,0.2);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Register Button */
  .sn-btn-register {
    width: 100%;
    padding: 14px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    color: rgba(255,255,255,0.6);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.25s;
    animation: fadeUp 0.6s 0.45s both;
    letter-spacing: 0.2px;
  }

  .sn-btn-register:hover {
    border-color: rgba(249,115,22,0.4);
    background: rgba(249,115,22,0.06);
    color: #f97316;
  }

  /* Footer */
  .sn-footer {
    text-align: center;
    margin-top: 28px;
    color: rgba(255,255,255,0.15);
    font-size: 11.5px;
    letter-spacing: 0.3px;
    animation: fadeUp 0.6s 0.5s both;
  }

  /* Error */
  .sn-error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 10px;
    padding: 10px 14px;
    color: #fca5a5;
    font-size: 13.5px;
    margin-bottom: 16px;
    animation: shake 0.4s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Loading spinner */
  .sn-spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      login(data);
      navigate(dashboardPathFor(data.role), { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sn-root">
        {/* Blobs */}
        <div className="sn-blob sn-blob-1" />
        <div className="sn-blob sn-blob-2" />
        <div className="sn-blob sn-blob-3" />
        <div className="sn-grid" />

        <div className="sn-card">
          {/* Logo */}
          <div className="sn-logo">
            <div className="sn-logo-icon">🏠</div>
            <div className="sn-logo-text">Safe<span>Nest</span></div>
          </div>

          {/* Heading */}
          <div className="sn-heading">
            <h1>Welcome back</h1>
            <p>Sign in to manage your hostel dashboard</p>
          </div>

          <div className="sn-divider" />

          {/* Error */}
          {error && <div className="sn-error">⚠ &nbsp;{error}</div>}

          {/* Form */}
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="sn-field">
              <label className="sn-label">Email Address</label>
              <div className="sn-input-wrap">
                <input
                  className="sn-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="sn-input-icon">✉</span>
              </div>
            </div>

            {/* Password */}
            <div className="sn-field">
              <label className="sn-label">Password</label>
              <div className="sn-input-wrap">
                <input
                  className="sn-input"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="sn-input-icon">🔒</span>
                <button
                  type="button"
                  className="sn-eye"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
              <div className="sn-forgot">
                <a href="/forgot-password">Forgot password?</a>
              </div>
            </div>

            {/* Login Button */}
            <button className="sn-btn-login" type="submit" disabled={loading}>
              {loading ? (
                <><span className="sn-spinner" />Signing in…</>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          {/* OR divider */}
          <div className="sn-or">
            <div className="sn-or-line" />
            <span>or</span>
            <div className="sn-or-line" />
          </div>

          {/* Register */}
          <button
            className="sn-btn-register"
            onClick={() => { window.location.href = "/register"; }}
          >
            Create a new account
          </button>

          {/* Footer */}
          <div className="sn-footer">
            SafeNest · Smart Hostel Management · © 2026
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
