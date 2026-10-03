import { useState, useEffect } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import api, { errorMessage } from "../lib/api";

export default function CompliancePage() {
  usePageTitle("Compliance");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.reports.compliance()
      .then((r) => setReport(r.data))
      .catch((e) => setError(errorMessage(e)));
  }, []);

  return (
    <div className="page">
      <div className="page-header"><h1>Statutory Compliance</h1></div>
      {error && <div className="alert alert-error">{error}</div>}

      {report && (
        <>
          <div className="stats-grid mb-6">
            <div className="stat-card"><span className="stat-value">₹{Number(report.pf_total).toLocaleString("en-IN")}</span><span className="stat-label">PF (Total)</span></div>
            <div className="stat-card"><span className="stat-value">₹{Number(report.esi_total).toLocaleString("en-IN")}</span><span className="stat-label">ESI (Total)</span></div>
            <div className="stat-card"><span className="stat-value">₹{Number(report.tds_total).toLocaleString("en-IN")}</span><span className="stat-label">TDS (Total)</span></div>
            <div className="stat-card"><span className="stat-value">₹{Number(report.pt_total).toLocaleString("en-IN")}</span><span className="stat-label">Professional Tax</span></div>
          </div>

          <div className="card">
            <h3>Filing Status</h3>
            {report.filings.length === 0 ? (
              <p className="empty-state">No filings recorded yet.</p>
            ) : (
              <table className="table">
                <thead><tr><th>Type</th><th>Period</th><th>Due Date</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {report.filings.map((f, i) => (
                    <tr key={i}>
                      <td>{f.type}</td>
                      <td>{f.period}</td>
                      <td>{f.due_date}</td>
                      <td>₹{Number(f.amount).toLocaleString("en-IN")}</td>
                      <td><span className={`badge badge-${f.status}`}>{f.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
