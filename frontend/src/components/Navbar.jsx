import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiUsers, FiPlusCircle, FiBarChart2, FiCpu, FiLogOut, FiUser } from "react-icons/fi";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: <FiBarChart2 /> },
  { to: "/employees", label: "Employees", icon: <FiUsers /> },
  { to: "/add-employee", label: "Add Employee", icon: <FiPlusCircle /> },
  { to: "/ai-recommendations", label: "AI Insights", icon: <FiCpu /> },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav style={{
      background: "var(--bg2)",
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: "var(--accent)", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
          }}>⚡</div>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 15 }}>
            HR<span style={{ color: "var(--accent)" }}>Analytics</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: 4 }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: "var(--radius-sm)",
                fontSize: 13, fontWeight: 500,
                color: location.pathname === link.to ? "#fff" : "var(--text2)",
                background: location.pathname === link.to ? "var(--accent)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        {/* User + Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text2)", fontSize: 13 }}>
            <FiUser />
            <span>{user?.name || "User"}</span>
            <span className="badge badge-dev" style={{ fontSize: 11 }}>{user?.role}</span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            <FiLogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
