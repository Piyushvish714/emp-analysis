import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "hr" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = mode === "login"
        ? await authAPI.login({ email: form.email, password: form.password })
        : await authAPI.signup(form);

      login(res.data.token, res.data.user);
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: 24,
    }}>
      {/* Background grid effect */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 420, animation: "fadeSlideIn 0.3s ease" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, background: "var(--accent)", borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 16px", boxShadow: "var(--shadow-accent)",
          }}>⚡</div>
          <h1 style={{ fontFamily: "var(--font-mono)", fontSize: 22, marginBottom: 6 }}>
            HR<span style={{ color: "var(--accent)" }}>Analytics</span>
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>AI-Powered Performance Intelligence</p>
        </div>

        {/* Card */}
        <div className="card" style={{ boxShadow: "var(--shadow)" }}>
          {/* Mode Toggle */}
          <div style={{
            display: "flex", background: "var(--bg2)", borderRadius: "var(--radius-sm)",
            padding: 4, marginBottom: 24, gap: 4,
          }}>
            {["login", "signup"].map((m) => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "8px", border: "none", borderRadius: 6,
                background: mode === m ? "var(--accent)" : "transparent",
                color: mode === m ? "#fff" : "var(--text2)",
                fontWeight: 600, fontSize: 14, transition: "all 0.2s",
              }}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "signup" && (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="name" placeholder="Aman Verma" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select name="role" value={form.role} onChange={handleChange}>
                    <option value="hr">HR Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: "100%", justifyContent: "center", marginTop: 8, padding: "12px" }}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", color: "var(--text3)", fontSize: 12, marginTop: 16 }}>
          Secured with JWT Authentication
        </p>
      </div>
    </div>
  );
}
