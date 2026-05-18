import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { employeeAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { FiUsers, FiTrendingUp, FiAward, FiCpu } from "react-icons/fi";

const ScoreBar = ({ score }) => {
  const color = score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--danger)";
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-fill" style={{ width: `${score}%`, background: color }} />
    </div>
  );
};

const getDepartmentBadge = (dept) => {
  const map = {
    Development: "badge-dev", HR: "badge-hr", Marketing: "badge-yellow",
    Sales: "badge-green", Finance: "badge-yellow", Operations: "badge-dev",
    Design: "badge-hr", QA: "badge-green",
  };
  return map[dept] || "badge-dev";
};

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    employeeAPI.getAll().then((res) => {
      setEmployees(res.data.employees);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const avgScore = employees.length
    ? Math.round(employees.reduce((s, e) => s + e.performanceScore, 0) / employees.length)
    : 0;
  const topPerformers = employees.filter((e) => e.performanceScore >= 80).length;
  const needsTraining = employees.filter((e) => e.performanceScore < 60).length;

  const stats = [
    { label: "Total Employees", value: employees.length, icon: <FiUsers size={20} />, color: "var(--accent)" },
    { label: "Avg Performance", value: `${avgScore}/100`, icon: <FiTrendingUp size={20} />, color: "var(--warning)" },
    { label: "Top Performers", value: topPerformers, icon: <FiAward size={20} />, color: "var(--success)" },
    { label: "Need Training", value: needsTraining, icon: <FiCpu size={20} />, color: "var(--danger)" },
  ];

  const topFive = [...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 5);

  // Dept distribution
  const deptMap = {};
  employees.forEach((e) => { deptMap[e.department] = (deptMap[e.department] || 0) + 1; });

  return (
    <div style={{ padding: "32px 0", animation: "fadeSlideIn 0.3s ease" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontFamily: "var(--font-mono)", marginBottom: 6 }}>
            Good {new Date().getHours() < 12 ? "Morning" : "Afternoon"}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "var(--text2)" }}>Here's your team's performance overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid-2" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {stats.map((s) => (
            <div key={s.label} className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text2)", fontSize: 13, fontWeight: 600 }}>{s.label}</span>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: `${s.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center", color: s.color,
                }}>
                  {s.icon}
                </div>
              </div>
              <div style={{ fontSize: 28, fontFamily: "var(--font-mono)", fontWeight: 700, color: s.color }}>
                {loading ? "—" : s.value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 24 }}>
          {/* Top Performers */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>🏆 Top Performers</h2>
              <Link to="/employees" style={{ color: "var(--accent)", fontSize: 13 }}>View all →</Link>
            </div>
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : topFive.length === 0 ? (
              <p style={{ color: "var(--text2)", textAlign: "center" }}>No employees yet. <Link to="/add-employee" style={{ color: "var(--accent)" }}>Add one →</Link></p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {topFive.map((emp, i) => (
                  <div key={emp._id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : "var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: i < 2 ? "#000" : "var(--text2)",
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, truncate: true }}>{emp.name}</span>
                        <span style={{
                          fontSize: 13, fontFamily: "var(--font-mono)", fontWeight: 700,
                          color: emp.performanceScore >= 80 ? "var(--success)" : emp.performanceScore >= 60 ? "var(--warning)" : "var(--danger)",
                        }}>
                          {emp.performanceScore}
                        </span>
                      </div>
                      <ScoreBar score={emp.performanceScore} />
                    </div>
                    <span className={`badge ${getDepartmentBadge(emp.department)}`} style={{ fontSize: 11, flexShrink: 0 }}>
                      {emp.department}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Department Breakdown */}
          <div className="card">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📊 By Department</h2>
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : Object.keys(deptMap).length === 0 ? (
              <p style={{ color: "var(--text2)", textAlign: "center" }}>No data yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {Object.entries(deptMap).sort((a, b) => b[1] - a[1]).map(([dept, count]) => (
                  <div key={dept}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 14 }}>{dept}</span>
                      <span style={{ color: "var(--text2)", fontSize: 13 }}>{count} employee{count > 1 ? "s" : ""}</span>
                    </div>
                    <div className="score-bar-wrap">
                      <div className="score-bar-fill" style={{
                        width: `${(count / employees.length) * 100}%`,
                        background: "var(--accent)",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
              <Link to="/add-employee" className="btn btn-primary btn-sm">+ Add Employee</Link>
              <Link to="/ai-recommendations" className="btn btn-outline btn-sm">⚡ AI Insights</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
