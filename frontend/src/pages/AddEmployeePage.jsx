import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { employeeAPI } from "../utils/api";

const DEPARTMENTS = ["Development", "HR", "Marketing", "Sales", "Finance", "Operations", "Design", "QA"];

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", department: "Development",
    skills: [], performanceScore: "", experience: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    if (form.skills.includes(s)) { toast.error("Skill already added"); return; }
    setForm({ ...form, skills: [...form.skills, s] });
    setSkillInput("");
  };

  const removeSkill = (skill) => setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.skills.length === 0) { toast.error("Please add at least one skill"); return; }
    setLoading(true);
    try {
      await employeeAPI.add({
        ...form,
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      toast.success("Employee added successfully! ✅");
      navigate("/employees");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Failed to add employee";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "32px 0", animation: "fadeSlideIn 0.3s ease" }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-mono)", fontSize: 22, marginBottom: 6 }}>Add New Employee</h1>
          <p style={{ color: "var(--text2)" }}>Fill in the employee's details to add them to the system</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="grid-2">
              <div className="form-group">
                <label>Full Name *</label>
                <input name="name" placeholder="Aman Verma" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input name="email" type="email" placeholder="aman@company.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Department *</label>
              <select name="department" value={form.department} onChange={handleChange}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Performance Score (0–100) *</label>
                <input
                  name="performanceScore" type="number" min="0" max="100"
                  placeholder="85" value={form.performanceScore} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label>Years of Experience *</label>
                <input
                  name="experience" type="number" min="0" max="50"
                  placeholder="3" value={form.experience} onChange={handleChange} required
                />
              </div>
            </div>

            {/* Skills */}
            <div className="form-group">
              <label>Skills *</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  placeholder="Type a skill and press Add (e.g. React)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn btn-outline" onClick={addSkill} style={{ whiteSpace: "nowrap" }}>
                  + Add
                </button>
              </div>
              {form.skills.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                  {form.skills.map((skill) => (
                    <span key={skill} className="skill-tag" style={{ cursor: "pointer" }} onClick={() => removeSkill(skill)}>
                      {skill} ✕
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Score preview */}
            {form.performanceScore && (
              <div style={{
                background: "var(--bg2)", borderRadius: "var(--radius-sm)", padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  fontSize: 20, fontFamily: "var(--font-mono)", fontWeight: 700,
                  color: form.performanceScore >= 80 ? "var(--success)" : form.performanceScore >= 60 ? "var(--warning)" : "var(--danger)",
                }}>
                  {form.performanceScore}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "var(--text2)", fontSize: 12, marginBottom: 6 }}>Performance Preview</div>
                  <div className="score-bar-wrap">
                    <div className="score-bar-fill" style={{
                      width: `${form.performanceScore}%`,
                      background: form.performanceScore >= 80 ? "var(--success)" : form.performanceScore >= 60 ? "var(--warning)" : "var(--danger)",
                    }} />
                  </div>
                </div>
                <span style={{ fontSize: 12, color: "var(--text2)" }}>
                  {form.performanceScore >= 80 ? "🏆 Top Performer" : form.performanceScore >= 60 ? "✅ Good" : "⚠️ Needs Training"}
                </span>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, justifyContent: "center" }}>
                {loading ? "Adding..." : "Add Employee →"}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => navigate("/employees")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
