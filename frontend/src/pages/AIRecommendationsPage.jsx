import { useState, useEffect } from "react";
import { employeeAPI, aiAPI } from "../utils/api";
import toast from "react-hot-toast";
import { FiZap, FiList } from "react-icons/fi";

export default function AIRecommendationsPage() {
  const [employees, setEmployees] = useState([]);
  const [rankings, setRankings] = useState(null);
  const [loadingRank, setLoadingRank] = useState(false);
  const [loadingIndividual, setLoadingIndividual] = useState(null);
  const [recommendations, setRecommendations] = useState({});

  useEffect(() => {
    employeeAPI.getRankings().then((res) => setEmployees(res.data.rankings)).catch(() => {});
  }, []);

  const handleRankAll = async () => {
    setLoadingRank(true);
    try {
      const res = await aiAPI.rankAll();
      setRankings(res.data.rankingAnalysis);
      toast.success("AI team analysis complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI request failed");
    } finally { setLoadingRank(false); }
  };

  const handleIndividual = async (emp) => {
    setLoadingIndividual(emp._id);
    try {
      const res = await aiAPI.recommend(emp._id);
      setRecommendations((prev) => ({ ...prev, [emp._id]: res.data.recommendation }));
      toast.success(`Recommendation for ${emp.name} ready!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "AI request failed");
    } finally { setLoadingIndividual(null); }
  };

  const scoreColor = (s) => s >= 80 ? "var(--success)" : s >= 60 ? "var(--warning)" : "var(--danger)";

  return (
    <div style={{ padding: "32px 0", animation: "fadeSlideIn 0.3s ease" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-mono)", fontSize: 22, marginBottom: 6 }}>⚡ AI Insights</h1>
          <p style={{ color: "var(--text2)" }}>AI-powered performance analysis and recommendations</p>
        </div>

        {/* Team Analysis */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🧠 Full Team AI Analysis</h2>
              <p style={{ color: "var(--text2)", fontSize: 13 }}>Generate rankings & insights for all {employees.length} employees</p>
            </div>
            <button className="btn btn-primary" onClick={handleRankAll} disabled={loadingRank || employees.length === 0}>
              <FiZap size={14} /> {loadingRank ? "Analyzing..." : "Analyze All"}
            </button>
          </div>

          {rankings && (
            <div style={{
              background: "var(--bg2)", borderRadius: "var(--radius-sm)", padding: 20,
              fontSize: 14, lineHeight: 1.9, whiteSpace: "pre-wrap", color: "var(--text)",
              borderLeft: "3px solid var(--accent)",
            }}>
              {rankings}
            </div>
          )}
        </div>

        {/* Employee Rankings Table */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <FiList />
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Employee Rankings</h2>
          </div>
          {employees.length === 0 ? (
            <p style={{ color: "var(--text2)", textAlign: "center", padding: 40 }}>No employees yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {employees.map((emp) => (
                <div key={emp._id} style={{
                  background: "var(--bg2)", borderRadius: "var(--radius-sm)", padding: 16,
                  display: "flex", alignItems: "center", gap: 16,
                  border: "1px solid var(--border)",
                }}>
                  {/* Rank badge */}
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: emp.rank === 1 ? "#FFD70020" : emp.rank === 2 ? "#C0C0C020" : emp.rank === 3 ? "#CD7F3220" : "var(--bg3)",
                    border: `2px solid ${emp.rank === 1 ? "#FFD700" : emp.rank === 2 ? "#C0C0C0" : emp.rank === 3 ? "#CD7F32" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14,
                    color: emp.rank <= 3 ? (emp.rank === 1 ? "#FFD700" : emp.rank === 2 ? "#C0C0C0" : "#CD7F32") : "var(--text2)",
                  }}>
                    #{emp.rank}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{emp.name}</div>
                    <div style={{ color: "var(--text2)", fontSize: 12 }}>{emp.department} · {emp.experience} yrs exp</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                      {emp.skills.slice(0, 4).map((s) => (
                        <span key={s} className="skill-tag">{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 700, color: scoreColor(emp.performanceScore) }}>
                      {emp.performanceScore}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>/ 100</div>
                  </div>

                  {/* Action */}
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleIndividual(emp)}
                    disabled={loadingIndividual === emp._id}
                    style={{ flexShrink: 0 }}
                  >
                    <FiZap size={13} />
                    {loadingIndividual === emp._id ? "..." : "Recommend"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Individual Recommendations */}
        {Object.keys(recommendations).length > 0 && (
          <div className="card">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📋 Individual Recommendations</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {employees
                .filter((e) => recommendations[e._id])
                .map((emp) => (
                  <div key={emp._id} style={{ borderLeft: "3px solid var(--accent)", paddingLeft: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>{emp.name}
                      <span style={{ color: "var(--text2)", fontWeight: 400, fontSize: 13, marginLeft: 8 }}>
                        — {emp.department} · Score: {emp.performanceScore}
                      </span>
                    </div>
                    <div style={{
                      background: "var(--bg2)", borderRadius: "var(--radius-sm)", padding: 14,
                      fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "var(--text)",
                    }}>
                      {recommendations[emp._id]}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
