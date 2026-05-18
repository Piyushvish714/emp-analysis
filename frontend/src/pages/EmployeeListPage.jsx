import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { employeeAPI } from "../utils/api";
import { FiSearch, FiTrash2, FiEdit3, FiRefreshCw } from "react-icons/fi";

const DEPARTMENTS = ["All", "Development", "HR", "Marketing", "Sales", "Finance", "Operations", "Design", "QA"];

const ScoreChip = ({ score }) => {
  const color = score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--danger)";
  const label = score >= 80 ? "High" : score >= 60 ? "Mid" : "Low";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 700, color,
      }}>
        {score}
      </div>
      <span style={{ fontSize: 11, color: "var(--text2)" }}>{label}</span>
    </div>
  );
};

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: "", department: "All", skill: "" });
  const [deleting, setDeleting] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.name) params.name = search.name;
      if (search.department !== "All") params.department = search.department;
      if (search.skill) params.skill = search.skill;

      const isFiltered = search.name || search.department !== "All" || search.skill;
      const res = isFiltered
        ? await employeeAPI.search(params)
        : await employeeAPI.getAll();

      setEmployees(res.data.employees);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This action cannot be undone.`)) return;
    setDeleting(id);
    try {
      await employeeAPI.delete(id);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
      toast.success(`${name} removed.`);
    } catch {
      toast.error("Failed to delete employee");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={{ padding: "32px 0", animation: "fadeSlideIn 0.3s ease" }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-mono)", fontSize: 22, marginBottom: 4 }}>Employees</h1>
            <p style={{ color: "var(--text2)" }}>{employees.length} record{employees.length !== 1 ? "s" : ""} found</p>
          </div>
          <Link to="/add-employee" className="btn btn-primary">+ Add Employee</Link>
        </div>

        {/* Search & Filter */}
        <div className="card" style={{ marginBottom: 24 }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="form-group" style={{ flex: "1 1 180px" }}>
              <label>Search by Name</label>
              <input
                placeholder="e.g. Aman..."
                value={search.name}
                onChange={(e) => setSearch({ ...search, name: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ flex: "1 1 150px" }}>
              <label>Department</label>
              <select value={search.department} onChange={(e) => setSearch({ ...search, department: e.target.value })}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: "1 1 150px" }}>
              <label>Skill</label>
              <input
                placeholder="e.g. React..."
                value={search.skill}
                onChange={(e) => setSearch({ ...search, skill: e.target.value })}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary"><FiSearch size={14} /> Search</button>
              <button type="button" className="btn btn-outline" onClick={() => {
                setSearch({ name: "", department: "All", skill: "" });
                setTimeout(() => fetchEmployees(), 0);
              }}>
                <FiRefreshCw size={14} />
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-center card"><div className="spinner" /><span>Loading employees...</span></div>
        ) : employees.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ color: "var(--text2)", marginBottom: 16 }}>No employees found</p>
            <Link to="/add-employee" className="btn btn-primary">Add First Employee</Link>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Employee", "Department", "Skills", "Score", "Experience", "Actions"].map((h) => (
                    <th key={h} style={{
                      padding: "14px 16px", textAlign: "left", fontSize: 12,
                      color: "var(--text2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr key={emp._id} style={{
                    borderBottom: i < employees.length - 1 ? "1px solid var(--border)" : "none",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg2)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{emp.name}</div>
                      <div style={{ color: "var(--text3)", fontSize: 12 }}>{emp.email}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className="badge badge-dev">{emp.department}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {emp.skills.slice(0, 3).map((s) => (
                          <span key={s} className="skill-tag">{s}</span>
                        ))}
                        {emp.skills.length > 3 && (
                          <span style={{ fontSize: 12, color: "var(--text3)" }}>+{emp.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <ScoreChip score={emp.performanceScore} />
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--text2)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                      {emp.experience} yr{emp.experience !== 1 ? "s" : ""}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Link to={`/employees/${emp._id}`} className="btn btn-outline btn-sm">
                          <FiEdit3 size={13} /> View
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(emp._id, emp.name)}
                          disabled={deleting === emp._id}
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
