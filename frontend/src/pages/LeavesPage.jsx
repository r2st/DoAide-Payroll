import { useState, useEffect } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../hooks/useAuth";
import api, { errorMessage } from "../lib/api";

export default function LeavesPage() {
  usePageTitle("Leaves");
  const { canWrite } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("requests");

  const load = () => {
    api.leaves.list({}).then((r) => setLeaves(r.data || [])).catch((e) => setError(errorMessage(e)));
    api.leaves.getBalances({}).then((r) => setBalances(r.data || [])).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const handleAction = async (id, status) => {
    try {
      await api.leaves.action(id, { status });
      load();
    } catch (e) { setError(errorMessage(e)); }
  };

  const initBalances = async () => {
    try {
      const res = await api.leaves.initializeBalances({});
      setError("");
      load();
      alert(`Created ${res.data.balances_created} leave balances for ${res.data.year}`);
    } catch (e) { setError(errorMessage(e)); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Leave Management</h1>
        {canWrite && <button className="btn btn-secondary" onClick={initBalances}>Initialize Balances</button>}
      </div>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="tabs mb-4">
        <button className={`tab ${tab === "requests" ? "active" : ""}`} onClick={() => setTab("requests")}>Requests</button>
        <button className={`tab ${tab === "balances" ? "active" : ""}`} onClick={() => setTab("balances")}>Balances</button>
      </div>

      {tab === "requests" && (
        leaves.length === 0 ? <p className="empty-state">No leave requests.</p> : (
          <table className="table">
            <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th>{canWrite && <th>Action</th>}</tr></thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id}>
                  <td>{l.employee_id}</td>
                  <td>{l.leave_type}</td>
                  <td>{l.start_date}</td>
                  <td>{l.end_date}</td>
                  <td>{Number(l.days)}</td>
                  <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                  {canWrite && <td>
                    {l.status === "pending" && <>
                      <button className="btn btn-sm btn-primary mr-2" onClick={() => handleAction(l.id, "approved")}>Approve</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleAction(l.id, "rejected")}>Reject</button>
                    </>}
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {tab === "balances" && (
        balances.length === 0 ? <p className="empty-state">No balances. Click "Initialize Balances" to set up.</p> : (
          <table className="table">
            <thead><tr><th>Employee</th><th>Type</th><th>Year</th><th>Allocated</th><th>Used</th><th>Remaining</th></tr></thead>
            <tbody>
              {balances.map((b) => (
                <tr key={b.id}>
                  <td>{b.employee_id}</td>
                  <td>{b.leave_type}</td>
                  <td>{b.year}</td>
                  <td>{Number(b.allocated)}</td>
                  <td>{Number(b.used)}</td>
                  <td>{Number(b.allocated) + Number(b.carried_forward) - Number(b.used)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
