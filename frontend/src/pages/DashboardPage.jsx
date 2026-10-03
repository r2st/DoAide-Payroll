import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../hooks/useAuth";
import api from "../lib/api";

export default function DashboardPage() {
  usePageTitle("Dashboard");
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    api.employees.list({ limit: 1 }).then((r) => setStats((s) => ({ ...s, employees: r.data.total }))).catch(() => {});
    api.payroll.listRuns().then((r) => setRuns(r.data?.slice(0, 5) || [])).catch(() => {});
    api.leaves.list({ status: "pending" }).then((r) => setStats((s) => ({ ...s, pendingLeaves: r.data?.length || 0 }))).catch(() => {});
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="text-muted">Welcome back, {user?.full_name}</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Employees" value={stats?.employees ?? "—"} />
        <StatCard label="Pending Leaves" value={stats?.pendingLeaves ?? "—"} />
        <StatCard label="Payroll Runs" value={runs.length} />
        <StatCard label="Plan" value={user?.business?.plan?.toUpperCase() || "FREE"} />
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <h2>Recent Payroll Runs</h2>
          <Link to="/payroll" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        {runs.length === 0 ? (
          <p className="empty-state">No payroll runs yet. <Link to="/payroll">Create one</Link></p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Period</th><th>Status</th><th>Employees</th><th>Net Pay</th></tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id}>
                  <td><Link to={`/payroll/${r.id}`}>{r.pay_period_start} – {r.pay_period_end}</Link></td>
                  <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                  <td>{r.employee_count}</td>
                  <td>₹{Number(r.total_net).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="quick-actions mt-6">
        <Link to="/employees" className="btn btn-secondary">Manage Employees</Link>
        <Link to="/payroll" className="btn btn-primary">Run Payroll</Link>
        <Link to="/leaves" className="btn btn-secondary">Review Leaves</Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
