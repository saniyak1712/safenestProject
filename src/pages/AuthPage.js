import { useState } from "react";

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" fill="currentColor" stroke="none" opacity="0.15"/>
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const InputField = ({ label, type, placeholder, value, onChange, showToggle, onToggle, showPassword }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold tracking-widest uppercase text-slate-500">{label}</label>
    <div className="relative">
      <input
        type={showToggle ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 hover:border-slate-300 pr-10"
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <EyeIcon open={showPassword} />
        </button>
      )}
    </div>
  </div>
);

export default function SafeNestAuth() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isLogin = mode === "login";

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
    }, 1200);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setForm({ name: "", email: "", password: "", confirm: "" });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f1f2e 0%, #0e2233 40%, #072a2a 70%, #0d1f2d 100%)" }}>

      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #14b8a6, transparent)" }} />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #0ea5e9, transparent)" }} />
      <div className="absolute top-10 right-10 w-40 h-40 rounded-full opacity-5 blur-2xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #2dd4bf, transparent)" }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#14b8a6 1px, transparent 1px), linear-gradient(90deg, #14b8a6 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Glow border */}
        <div className="absolute -inset-px rounded-2xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.4), rgba(14,165,233,0.1), rgba(20,184,166,0.2))" }} />

        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #14b8a6, #0ea5e9, #14b8a6)" }} />

          <div className="p-8 sm:p-10">

            {/* Brand */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg"
                style={{ background: "linear-gradient(135deg, #0f766e, #0e7490)" }}>
                <span className="text-white"><ShieldIcon /></span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800"
                style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.03em" }}>
                SafeNest
              </h1>
              <p className="text-xs text-slate-400 mt-1 tracking-widest uppercase font-medium">
                {isLogin ? "Welcome back" : "Create your account"}
              </p>
            </div>

            {/* Tab Toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-7">
              {["login", "register"].map((tab) => (
                <button key={tab} onClick={() => switchMode(tab)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 capitalize
                    ${mode === tab
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                    }`}>
                  {tab === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-4">
              {!isLogin && (
                <InputField label="Full Name" type="text" placeholder="Jane Doe"
                  value={form.name} onChange={handleChange("name")} />
              )}
              <InputField label="Email Address" type="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange("email")} />
              <InputField label="Password" type="password" placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                value={form.password} onChange={handleChange("password")}
                showToggle showPassword={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              {!isLogin && (
                <InputField label="Confirm Password" type="password" placeholder="Repeat your password"
                  value={form.confirm} onChange={handleChange("confirm")}
                  showToggle showPassword={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
              )}
            </div>

            {/* Forgot password */}
            {isLogin && (
              <div className="flex justify-end mt-2">
                <button className="text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {/* CTA Button */}
            <button onClick={handleSubmit}
              disabled={loading}
              className={`mt-6 w-full py-3.5 rounded-xl text-white text-sm font-bold tracking-wide shadow-lg
                transition-all duration-200 active:scale-[0.98] relative overflow-hidden
                ${submitted ? "bg-emerald-500" : "hover:brightness-110 hover:shadow-teal-200/50"}
              `}
              style={!submitted ? { background: "linear-gradient(135deg, #0f766e, #0e7490)" } : {}}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {isLogin ? "Signing in…" : "Creating account…"}
                </span>
              ) : submitted ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {isLogin ? "Signed in!" : "Account created!"}
                </span>
              ) : (
                isLogin ? "Sign In to SafeNest" : "Create My Account"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">or continue with</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Social */}
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md">
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Footer toggle */}
            <p className="text-center text-xs text-slate-400 mt-6">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => switchMode(isLogin ? "register" : "login")}
                className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                {isLogin ? "Sign up free" : "Sign in instead"}
              </button>
            </p>
          </div>
        </div>

        {/* Tagline below card */}
        <p className="text-center text-xs text-slate-500 mt-5 tracking-wide">
          🔒 256-bit encrypted · SOC 2 compliant · GDPR ready
        </p>
      </div>
    </div>
  );
}