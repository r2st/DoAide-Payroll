import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../hooks/useAuth";
import api, { errorMessage } from "../lib/api";

export default function PayrollPage() {
  usePageTitle("Payroll");
  const { canWrite } = useAuth();
  const [runs, setRuns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const load = () => api.payroll.listRuns().then((r) => setRuns(r.data || [])).catch((e) => setError(errorMessage(e)));
  useEffect(() => { load(); }, []);

  const handleCreate = async (data) => {
    try {
      await api.payroll.createRun(data);
      setShowForm(false);
      load();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Payroll Runs</h1>
        {canWrite && <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>New Payroll Run</button>}
      </div>
      {error && <div className="alert alert-error">{error}</div>}

      {showForm && <PayrollRunForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

      {runs.length === 0 ? (
        <p className="empty-state">No payroll runs. Create one to get started.</p>
      ) : (
        <table className="table">
          <thead><tr><th>Period</th><th>Status</th><th>Employees</th><th>Gross</th><th>Net</th></tr></thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.id}>
                <td><Link to={`/payroll/${r.id}`}>{r.pay_period_start} – {r.pay_period_end}</Link></td>
                <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                <td>{r.employee_count}</td>
                <td>₹{Number(r.total_gross).toLocaleString("en-IN")}</td>
                <td>₹{Number(r.total_net).toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function PayrollRunForm({ onSubmit, onCancel }) {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  const [form, setForm] = useState({ pay_period_start: firstDay, pay_period_end: lastDay, notes: "" });
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form className="card form-card mb-4" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <h3>New Payroll Run</h3>
      <div className="form-grid">
        <label>Period Start<input type="date" value={form.pay_period_start} onChange={upd("pay_period_start")} required /></label>
        <label>Period End<input type="date" value={form.pay_period_end} onChange={upd("pay_period_end")} required /></label>
        <label>Notes<input value={form.notes} onChange={upd("notes")} /></label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Create Run</button>
      </div>
    </form>
  );
}
