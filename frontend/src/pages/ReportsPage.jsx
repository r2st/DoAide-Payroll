import { useState, useEffect } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import api, { errorMessage } from "../lib/api";

export default function ReportsPage() {
  usePageTitle("Reports");
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.reports.monthly({ year, month })
      .then((r) => setReport(r.data))
      .catch((e) => setError(errorMessage(e)));
  }, [year, month]);

  return (
    <div className="page">
      <div className="page-header"><h1>Payroll Reports</h1></div>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card form-card mb-4">
        <div className="form-grid">
          <label>Year<input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} min={2020} /></label>
          <label>Month
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(2000, i).toLocaleString("en", { month: "long" })}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {report && (
        <div className="stats-grid mb-6">
          <div className="stat-card"><span className="stat-value">₹{Number(report.total_gross).toLocaleString("en-IN")}</span><span className="stat-label">Total Gross</span></div>
          <div className="stat-card"><span className="stat-value">₹{Number(report.total_deductions).toLocaleString("en-IN")}</span><span className="stat-label">Total Deductions</span></div>
          <div className="stat-card"><span className="stat-value">₹{Number(report.total_net).toLocaleString("en-IN")}</span><span className="stat-label">Total Net</span></div>
          <div className="stat-card"><span className="stat-value">₹{Number(report.total_employer_cost).toLocaleString("en-IN")}</span><span className="stat-label">Employer Cost</span></div>
        </div>
      )}

      <div className="card">
        <h3>Monthly Summary — {report?.month || `${year}-${String(month).padStart(2, "0")}`}</h3>
        <p>Employees processed: {report?.employee_count ?? 0}</p>
      </div>
    </div>
  );
}
