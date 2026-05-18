import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { employeeAPI, aiAPI } from "../utils/api";
import { FiArrowLeft, FiCpu, FiBookOpen } from "react-icons/fi";

const DEPARTMENTS = ["Development", "HR", "Marketing", "Sales", "Finance", "Operations", "Design", "QA"];

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [trainingLoading, setTrainingLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [training, setTraining] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    employeeAPI.getById(id).then((res) => {
      setEmployee(res.data.employee);
      setForm(res.data.employee);
      if (res.data.employee.aiRecommendation) setRecommendation(res.data.employee.aiRecommendation);
      setLoading(false);
    }).catch(() => { toast.error("Employee not found"); navigate("/employees"); });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || form.skills.includes(s)) return;
    setForm({ ...form, skills: [...form.skills, s] });
    setSkillInput("");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await employeeAPI.update(id, {
        ...form,
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      setEmployee(res.data.employee);
      setForm(res.data.employee);
      setEditMode(false);
      toast.success("Employee updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setSaving(false); }
  };

  const handleGetAI = async () => {
    setAiLoading(true);
    try {
      const res = await aiAPI.recommend(id);
      setRecommendation(res.data.recommendation);
      toast.success("AI recommendation generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI request failed");
    } finally { setAiLoading(false); }
  };

  const handleGetTraining = async () => {
    setTrainingLoading(true);
    try {
      const res = await aiAPI.trainingSuggestions(id);
      setTraining(res.data.trainingSuggestions);
      toast.success("Training plan generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI request failed");
    } finally { setTrainingLoading(false); }
  };

  if (loading) return <div className="loading-center" style={{ height: "60vh" }}><div className="spinner" /></div>;

  const score = form.performanceScore || employee?.performanceScore;
  const scoreColor = score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--danger)";

  return (
    <div style={{ padding: "32px 0", animation: "fadeSlideIn 0.3s ease" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Back */}
        <button className="btn btn-outline btn-sm" onClick={() => navigate("/employees")} style={{ marginBottom: 20 }}>
          <FiArrowLeft size={14} /> Back to Employees
        </button>

        {/* Header card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-mono)", fontSize: 22, marginBottom: 4 }}>{employee.name}</h1>
              <p style={{ color: "var(--text2)" }}>{employee.email}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setEditMode(!editMode)}>
                {editMode ? "Cancel" : "✏️ Edit"}
              </button>
              {editMode && (
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>

          <div className="grid-2" style={{ gap: 20 }}>
            <div className="form-group">
              <label>Department</label>
              {editMode
                ? <select name="department" value={form.department} onChange={handleChange}>
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                : <div style={{ padding: "10px 14px", background: "var(--bg2)", borderRadius: "var(--radius-sm)" }}>
                    <span className="badge badge-dev">{employee.department}</span>
                  </div>
              }
            </div>
            <div className="form-group">
              <label>Performance Score</label>
              {editMode
                ? <input name="performanceScore" type="number" min="0" max="100" value={form.performanceScore} onChange={handleChange} />
                : <div style={{ padding: "10px 14px", background: "var(--bg2)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, color: scoreColor }}>{employee.performanceScore}</span>
                    <div style={{ flex: 1 }}>
                      <div className="score-bar-wrap"><div className="score-bar-fill" style={{ width: `${employee.performanceScore}%`, background: scoreColor }} /></div>
                    </div>
                  </div>
              }
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              {editMode
                ? <input name="experience" type="number" min="0" value={form.experience} onChange={handleChange} />
                : <div style={{ padding: "10px 14px", background: "var(--bg2)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-mono)" }}>
                    {employee.experience} years
                  </div>
              }
            </div>
            <div className="form-group">
              <label>Skills</label>
              <div style={{ padding: editMode ? 0 : "10px 14px", background: editMode ? "transparent" : "var(--bg2)", borderRadius: "var(--radius-sm)" }}>
                {editMode && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input placeholder="Add skill..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
                    <button type="button" className="btn btn-outline btn-sm" onClick={addSkill}>+</button>
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(editMode ? form.skills : employee.skills).map((s) => (
                    <span key={s} className="skill-tag"
                      onClick={() => editMode && setForm({ ...form, skills: form.skills.filter((x) => x !== s) })}
                      style={{ cursor: editMode ? "pointer" : "default" }}>
                      {s}{editMode ? " ✕" : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Section */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-mono)", fontSize: 16 }}>⚡ AI Recommendation</h2>
            <button className="btn btn-primary btn-sm" onClick={handleGetAI} disabled={aiLoading}>
              <FiCpu size={13} /> {aiLoading ? "Generating..." : "Generate"}
            </button>
          </div>
          {recommendation ? (
            <div style={{
              background: "var(--bg2)", borderRadius: "var(--radius-sm)", padding: 16,
              fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "var(--text)",
              borderLeft: "3px solid var(--accent)",
            }}>
              {recommendation}
            </div>
          ) : (
            <p style={{ color: "var(--text3)", fontSize: 13 }}>Click "Generate" to get an AI-powered recommendation for this employee.</p>
          )}
        </div>

        {/* Training Section */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-mono)", fontSize: 16 }}>📚 Training Suggestions</h2>
            <button className="btn btn-outline btn-sm" onClick={handleGetTraining} disabled={trainingLoading}>
              <FiBookOpen size={13} /> {trainingLoading ? "Generating..." : "Generate"}
            </button>
          </div>
          {training ? (
            <div style={{
              background: "var(--bg2)", borderRadius: "var(--radius-sm)", padding: 16,
              fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "var(--text)",
              borderLeft: "3px solid var(--success)",
            }}>
              {training}
            </div>
          ) : (
            <p style={{ color: "var(--text3)", fontSize: 13 }}>Click "Generate" to get personalized training suggestions.</p>
          )}
        </div>
      </div>
    </div>
  );
}
