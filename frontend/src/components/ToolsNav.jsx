import { Link, useLocation } from "react-router-dom";

const TOOLS = [
  { path: "/calculator", label: "Salary Calculator" },
  { path: "/payslip-generator", label: "Payslip Generator" },
  { path: "/batch", label: "Batch Payslips" },
  { path: "/checker", label: "PF/ESI Checker" },
  { path: "/professional-tax", label: "Professional Tax" },
  { path: "/templates", label: "Templates" },
];

export default function ToolsNav() {
  const { pathname } = useLocation();

  return (
    <nav className="tools-nav" aria-label="Payroll tools">
      <a href="https://payroll.doaide.com" className="tools-nav-brand">
        DoAide <em>Payroll</em>
      </a>
      <div className="tools-nav-links">
        {TOOLS.map((t) => (
          <Link
            key={t.path}
            to={t.path}
            className={`tools-nav-link${pathname === t.path ? " active" : ""}`}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <Link to="/" className="tools-nav-cta">Sign up free</Link>
    </nav>
  );
}
