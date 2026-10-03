import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

const NAV = [
  { to: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { to: "/employees", label: "Employees", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
  { to: "/payroll", label: "Payroll", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
  { to: "/attendance", label: "Attendance", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { to: "/leaves", label: "Leaves", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { to: "/reports", label: "Reports", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { to: "/compliance", label: "Compliance", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
];

export default function Shell({ children }) {
  const { user, logout } = useAuth();
  const { preference, cycle } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const themeIcon = preference === "dark" ? "🌙" : preference === "light" ? "☀️" : "💻";

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-header-inner">
          <Link to="/" className="shell-brand">
            <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
              <rect width="32" height="32" rx="6" fill="#F0B429" />
              <text x="5" y="23" fontFamily="system-ui" fontWeight="bold" fontSize="18" fill="#1a1a2e">₹</text>
            </svg>
            <span>DoAide Payroll</span>
          </Link>
          <nav className="shell-nav desktop-only">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`shell-nav-link ${location.pathname === n.to ? "active" : ""}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="shell-actions">
            <button onClick={cycle} className="btn-icon" title={`Theme: ${preference}`}>
              {themeIcon}
            </button>
            {user && (
              <button onClick={logout} className="btn-ghost">
                Sign Out
              </button>
            )}
            <button className="btn-icon mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
              ☰
            </button>
          </div>
        </div>
      </header>
      {menuOpen && (
        <nav className="mobile-nav">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`mobile-nav-link ${location.pathname === n.to ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
      <main className="shell-main">{children}</main>
    </div>
  );
}
