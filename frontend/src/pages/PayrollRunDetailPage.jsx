import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../hooks/useAuth";
import api, { errorMessage } from "../lib/api";

export default function PayrollRunDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, canWrite } = useAuth();
  const [run, setRun] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  usePageTitle(run ? `Payroll ${run.pay_period_start}` : "Payroll Run");

  const load = () => {
    api.payroll.getRun(id).then((r) => {
      setRun(r.data.run);
      setPayslips(r.data.payslips || []);
    }).catch((e) => setError(errorMessage(e)));
  };
  useEffect(() => { load(); }, [id]);

  const compute = async () => {
    setLoading(true);
    try {
      await api.payroll.computeRun(id);
      load();
    } catch (e) { setError(errorMessage(e)); }
    finally { setLoading(false); }
  };

  const approve = async () => {
    setLoading(true);
    try {
      await api.payroll.approveRun(id);
      load();
    } catch (e) { setError(errorMessage(e)); }
    finally { setLoading(false); }
  };

  if (!run) return <div className="page"><div className="skeleton-bar w-full h-64" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Payroll: {run.pay_period_start} – {run.pay_period_end}</h1>
          <span className={`badge badge-${run.status}`}>{run.status}</span>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/payroll")}>Back</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid mb-6">
        <div className="stat-card"><span className="stat-value">₹{Number(run.total_gross).toLocaleString("en-IN")}</span><span className="stat-label">Gross</span></div>
        <div className="stat-card"><span className="stat-value">₹{Number(run.total_deductions).toLocaleString("en-IN")}</span><span className="stat-label">Deductions</span></div>
        <div className="stat-card"><span className="stat-value">₹{Number(run.total_net).toLocaleString("en-IN")}</span><span className="stat-label">Net Pay</span></div>
        <div className="stat-card"><span className="stat-value">{run.employee_count}</span><span className="stat-label">Employees</span></div>
      </div>

      <div className="flex gap-3 mb-6">
        {canWrite && run.status === "draft" && (
          <button className="btn btn-primary" onClick={compute} disabled={loading}>
            {loading ? "Computing..." : "Compute Salaries"}
          </button>
        )}
        {user?.role === "owner" && run.status === "computed" && (
          <button className="btn btn-primary" onClick={approve} disabled={loading}>
            {loading ? "Approving..." : "Approve Run"}
          </button>
        )}
      </div>

      <h2>Payslips ({payslips.length})</h2>
      {payslips.length === 0 ? (
        <p className="empty-state">No payslips generated yet. Compute salaries first.</p>
      ) : (
        <table className="table">
          <thead><tr><th>Employee</th><th>Days</th><th>Gross</th><th>Deductions</th><th>Net</th><th>PDF</th></tr></thead>
          <tbody>
            {payslips.map((p) => (
              <tr key={p.id}>
                <td>{p.employee_id}</td>
                <td>{p.days_worked}/{p.days_in_period}</td>
                <td>₹{Number(p.gross_salary).toLocaleString("en-IN")}</td>
                <td>₹{Number(p.total_deductions).toLocaleString("en-IN")}</td>
                <td>₹{Number(p.net_salary).toLocaleString("en-IN")}</td>
                <td><a href={api.payroll.downloadPayslipPdf(p.id)} target="_blank" rel="noreferrer" className="link">Download</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
