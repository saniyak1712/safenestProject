import { useState } from "react";
import { API_BASE_URL } from "../utils/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rg-root {
    min-height: 100vh;
    background: #0a0f1e;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
    position: relative;
  }

  /* Blobs */
  .rg-blob { position:fixed;border-radius:50%;filter:blur(80px);opacity:0.18;pointer-events:none;animation:blobFloat 8s ease-in-out infinite alternate; }
  .rg-blob-1 { width:520px;height:520px;background:radial-gradient(circle,#f97316,#ea580c);top:-120px;left:-80px;animation-delay:0s; }
  .rg-blob-2 { width:380px;height:380px;background:radial-gradient(circle,#fb923c,#f59e0b);bottom:-80px;right:-60px;animation-delay:3s; }
  .rg-blob-3 { width:260px;height:260px;background:radial-gradient(circle,#fcd34d,#f97316);top:50%;left:50%;transform:translate(-50%,-50%);animation-delay:1.5s; }
  @keyframes blobFloat { 0%{transform:scale(1) translate(0,0);}100%{transform:scale(1.12) translate(20px,-20px);} }
  .rg-blob-3 { animation: blobFloat3 8s ease-in-out infinite alternate; }
  @keyframes blobFloat3 { 0%{transform:translate(-50%,-50%) scale(1);}100%{transform:translate(calc(-50% + 20px),calc(-50% - 20px)) scale(1.12);} }

  /* Grid */
  .rg-grid { position:fixed;inset:0;background-image:linear-gradient(rgba(249,115,22,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.04) 1px,transparent 1px);background-size:48px 48px;pointer-events:none; }

  /* Card */
  .rg-card {
    position:relative;width:440px;
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(249,115,22,0.18);
    border-radius:24px;padding:52px 44px 44px;
    backdrop-filter:blur(24px);
    box-shadow:0 0 0 1px rgba(249,115,22,0.06),0 32px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.06);
    animation:cardIn 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes cardIn { from{opacity:0;transform:translateY(32px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);} }

  /* Top accent */
  .rg-card::before { content:'';position:absolute;top:0;left:10%;right:10%;height:2px;background:linear-gradient(90deg,transparent,#f97316,#fbbf24,transparent);border-radius:0 0 2px 2px; }

  /* Logo */
  .rg-logo { display:flex;align-items:center;gap:12px;margin-bottom:28px;animation:fadeUp 0.6s 0.1s both; }
  .rg-logo-icon { width:44px;height:44px;background:linear-gradient(135deg,#f97316,#fbbf24);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 8px 24px rgba(249,115,22,0.4); }
  .rg-logo-text { font-family:'Playfair Display',serif;font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.5px; }
  .rg-logo-text span { color:#f97316; }

  /* Heading */
  .rg-heading { animation:fadeUp 0.6s 0.15s both;margin-bottom:8px; }
  .rg-heading h1 { font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.5px;line-height:1.2; }
  .rg-heading p { color:rgba(255,255,255,0.4);font-size:14px;margin-top:6px;font-weight:300;letter-spacing:0.2px; }

  /* Divider */
  .rg-divider { height:1px;background:linear-gradient(90deg,transparent,rgba(249,115,22,0.2),transparent);margin:22px 0;animation:fadeUp 0.6s 0.2s both; }

  /* Steps indicator */
  .rg-steps { display:flex;align-items:center;gap:6px;margin-bottom:24px;animation:fadeUp 0.6s 0.22s both; }
  .rg-step-dot { width:28px;height:4px;border-radius:4px;background:rgba(255,255,255,0.08);transition:all 0.3s; }
  .rg-step-dot.done { background:linear-gradient(90deg,#f97316,#fbbf24); }
  .rg-step-dot.active { background:rgba(249,115,22,0.5); }

  /* Field */
  .rg-field { margin-bottom:16px;animation:fadeUp 0.6s both; }
  .rg-field:nth-child(1){animation-delay:0.25s;}
  .rg-field:nth-child(2){animation-delay:0.3s;}
  .rg-field:nth-child(3){animation-delay:0.35s;}
  .rg-label { display:block;font-size:11.5px;font-weight:500;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px; }
  .rg-input-wrap { position:relative; }
  .rg-input-icon { position:absolute;left:16px;top:50%;transform:translateY(-50%);color:rgba(249,115,22,0.5);font-size:15px;pointer-events:none;transition:color 0.2s; }
  .rg-input {
    width:100%;background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);border-radius:12px;
    padding:13px 16px 13px 44px;color:#fff;
    font-family:'DM Sans',sans-serif;font-size:15px;outline:none;
    transition:all 0.25s;
  }
  .rg-input::placeholder { color:rgba(255,255,255,0.22); }
  .rg-input:focus { background:rgba(249,115,22,0.06);border-color:rgba(249,115,22,0.5);box-shadow:0 0 0 3px rgba(249,115,22,0.1); }
  .rg-input.valid { border-color:rgba(52,211,153,0.4);background:rgba(52,211,153,0.04); }
  .rg-input:focus ~ .rg-input-icon, .rg-input.valid ~ .rg-input-icon { color:#f97316; }

  /* checkmark for valid */
  .rg-check { position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#34d399;font-size:15px;opacity:0;transition:opacity 0.2s; }
  .rg-input.valid + .rg-check { opacity:1; }

  /* Eye toggle */
  .rg-eye { position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:15px;padding:4px;transition:color 0.2s; }
  .rg-eye:hover { color:#f97316; }

  /* Password strength */
  .rg-strength-bar { display:flex;gap:4px;margin-top:8px; }
  .rg-strength-seg { flex:1;height:3px;border-radius:3px;background:rgba(255,255,255,0.08);transition:background 0.3s; }
  .rg-strength-label { font-size:11px;color:rgba(255,255,255,0.3);margin-top:5px;text-align:right; }

  /* Error */
  .rg-error { background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:10px 14px;color:#fca5a5;font-size:13px;margin-bottom:14px;animation:shake 0.4s ease; }
  @keyframes shake { 0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-6px);}40%,80%{transform:translateX(6px);} }

  /* Register button */
  .rg-btn {
    width:100%;padding:15px;margin-top:10px;
    background:linear-gradient(135deg,#f97316,#fb923c,#fbbf24);
    background-size:200% 200%;
    animation:fadeUp 0.6s 0.4s both, gradShift 4s ease infinite;
    border:none;border-radius:12px;color:#fff;
    font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;
    letter-spacing:0.3px;cursor:pointer;
    position:relative;overflow:hidden;
    box-shadow:0 8px 32px rgba(249,115,22,0.35);
    transition:transform 0.2s,box-shadow 0.2s;
  }
  @keyframes gradShift { 0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;} }
  .rg-btn:hover { transform:translateY(-2px);box-shadow:0 12px 40px rgba(249,115,22,0.5); }
  .rg-btn:active { transform:translateY(0); }
  .rg-btn:disabled { opacity:0.5;cursor:not-allowed;transform:none; }
  .rg-btn::after { content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);transform:skewX(-20deg);animation:shimmer 3s 2s infinite; }
  @keyframes shimmer { 0%{left:-100%;}100%{left:160%;} }

  /* Spinner */
  .rg-spinner { display:inline-block;width:15px;height:15px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite;vertical-align:middle;margin-right:8px; }
  @keyframes spin { to{transform:rotate(360deg);} }

  /* Divider OR */
  .rg-or { display:flex;align-items:center;gap:12px;margin:20px 0;animation:fadeUp 0.6s 0.45s both; }
  .rg-or-line { flex:1;height:1px;background:rgba(255,255,255,0.06); }
  .rg-or span { color:rgba(255,255,255,0.2);font-size:12px;text-transform:uppercase;letter-spacing:1px; }

  /* Login link */
  .rg-login-btn {
    width:100%;padding:14px;background:transparent;
    border:1px solid rgba(255,255,255,0.1);border-radius:12px;
    color:rgba(255,255,255,0.6);font-family:'DM Sans',sans-serif;
    font-size:14px;cursor:pointer;transition:all 0.25s;
    animation:fadeUp 0.6s 0.5s both;
  }
  .rg-login-btn:hover { border-color:rgba(249,115,22,0.4);background:rgba(249,115,22,0.06);color:#f97316; }

  /* Benefits list */
  .rg-benefits { margin-top:22px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.05);display:flex;flex-direction:column;gap:8px;animation:fadeUp 0.6s 0.55s both; }
  .rg-benefit { display:flex;align-items:center;gap:9px;font-size:12.5px;color:rgba(255,255,255,0.3); }
  .rg-benefit-dot { width:5px;height:5px;border-radius:50%;background:#f97316;flex-shrink:0; }

  /* Footer */
  .rg-footer { text-align:center;margin-top:20px;color:rgba(255,255,255,0.12);font-size:11.5px;animation:fadeUp 0.6s 0.6s both; }

  /* Success state */
  .rg-success { text-align:center;animation:fadeUp 0.5s both; }
  .rg-success-icon { font-size:52px;margin-bottom:16px; }
  .rg-success h2 { font-family:'Playfair Display',serif;font-size:24px;font-weight:800;color:#fff;margin-bottom:8px; }
  .rg-success p { color:rgba(255,255,255,0.4);font-size:14px;margin-bottom:24px; }
  .rg-success-btn { width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#f97316,#fbbf24);color:#fff;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;box-shadow:0 8px 28px rgba(249,115,22,0.35);transition:all 0.2s; }
  .rg-success-btn:hover { transform:translateY(-2px);box-shadow:0 12px 36px rgba(249,115,22,0.5); }

  @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
`;

function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: "", colors: [] };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const palettes = [
    [],
    ["#ef4444","#ef444430","#ef444430"],
    ["#f59e0b","#f59e0b","#f59e0b30"],
    ["#fbbf24","#fbbf24","#fbbf2450"],
    ["#34d399","#34d399","#34d399","#34d39940"],
    ["#34d399","#34d399","#34d399","#34d399","#34d399"],
  ];
  return { score, label: labels[score] || "", colors: palettes[score] || [] };
}

export default function Register() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);

  const isValidEmail = email.includes("@") && email.includes(".");
  const isValidName  = name.trim().length >= 2;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValidName)  { setError("Please enter your full name."); return; }
    if (!isValidEmail) { setError("Please enter a valid email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "student" }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Registration failed");
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filledSteps = [isValidName, isValidEmail, password.length >= 6];

  return (
    <>
      <style>{styles}</style>
      <div className="rg-root">
        <div className="rg-blob rg-blob-1" />
        <div className="rg-blob rg-blob-2" />
        <div className="rg-blob rg-blob-3" />
        <div className="rg-grid" />

        <div className="rg-card">

          {success ? (
            <div className="rg-success">
              <div className="rg-success-icon">🎉</div>
              <h2>Welcome to SafeNest!</h2>
              <p>Your account has been created successfully.<br />You can now sign in to your dashboard.</p>
              <button className="rg-success-btn" onClick={() => { window.location.href = "/"; }}>
                Go to Login →
              </button>
            </div>
          ) : (
            <>
              {/* Logo */}
              <div className="rg-logo">
                <div className="rg-logo-icon">🏠</div>
                <div className="rg-logo-text">Safe<span>Nest</span></div>
              </div>

              {/* Heading */}
              <div className="rg-heading">
                <h1>Create account</h1>
                <p>Join SafeNest and manage your hostel experience</p>
              </div>

              {/* Step dots */}
              <div className="rg-divider" />
              <div className="rg-steps">
                {filledSteps.map((done, i) => (
                  <div key={i} className={`rg-step-dot ${done ? "done" : i === filledSteps.findIndex(s => !s) ? "active" : ""}`} />
                ))}
              </div>

              {/* Error */}
              {error && <div className="rg-error">⚠ &nbsp;{error}</div>}

              <form onSubmit={handleRegister}>

                {/* Name */}
                <div className="rg-field">
                  <label className="rg-label">Full Name</label>
                  <div className="rg-input-wrap">
                    <input
                      className={`rg-input ${isValidName && name ? "valid" : ""}`}
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                    <span className="rg-input-icon">👤</span>
                    <span className="rg-check">✓</span>
                  </div>
                </div>

                {/* Email */}
                <div className="rg-field">
                  <label className="rg-label">Email Address</label>
                  <div className="rg-input-wrap">
                    <input
                      className={`rg-input ${isValidEmail && email ? "valid" : ""}`}
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                    <span className="rg-input-icon">✉</span>
                    <span className="rg-check">✓</span>
                  </div>
                </div>

                {/* Password */}
                <div className="rg-field">
                  <label className="rg-label">Password</label>
                  <div className="rg-input-wrap">
                    <input
                      className={`rg-input ${password.length >= 6 ? "valid" : ""}`}
                      type={showPass ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <span className="rg-input-icon">🔒</span>
                    <button type="button" className="rg-eye" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                      {showPass ? "🙈" : "👁"}
                    </button>
                  </div>
                  {password && (
                    <>
                      <div className="rg-strength-bar">
                        {[0,1,2,3,4].map(i => (
                          <div key={i} className="rg-strength-seg"
                            style={{ background: strength.colors[i] || "rgba(255,255,255,0.08)" }} />
                        ))}
                      </div>
                      <div className="rg-strength-label" style={{ color: strength.colors[0] || "rgba(255,255,255,0.3)" }}>
                        {strength.label}
                      </div>
                    </>
                  )}
                </div>

                {/* Submit */}
                <button className="rg-btn" type="submit" disabled={loading}>
                  {loading
                    ? <><span className="rg-spinner" />Creating account…</>
                    : "Create Account →"
                  }
                </button>
              </form>

              <div className="rg-or">
                <div className="rg-or-line" /><span>or</span><div className="rg-or-line" />
              </div>

              <button className="rg-login-btn" onClick={() => { window.location.href = "/"; }}>
                Already have an account? Sign In
              </button>

              {/* Benefits */}
              <div className="rg-benefits">
                {["Secure room assignment & management","Real-time entry & exit tracking","Instant complaint & SOS support"].map(b => (
                  <div className="rg-benefit" key={b}>
                    <div className="rg-benefit-dot" />
                    {b}
                  </div>
                ))}
              </div>

              <div className="rg-footer">SafeNest · Smart Hostel Management · © 2026</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
