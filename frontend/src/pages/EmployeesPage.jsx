import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../hooks/useAuth";
import api, { errorMessage } from "../lib/api";

export default function EmployeesPage() {
  usePageTitle("Employees");
  const { canWrite } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api.employees.list({ search: search || undefined }).then((r) => {
      setEmployees(r.data.employees);
      setTotal(r.data.total);
    }).catch((e) => setError(errorMessage(e)));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data) => {
    try {
      await api.employees.create(data);
      setShowForm(false);
      load();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Employees ({total})</h1>
        {canWrite && <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>Add Employee</button>}
      </div>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-bar mb-4">
        <input placeholder="Search by name, code, or department..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {showForm && <EmployeeForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

      {employees.length === 0 ? (
        <p className="empty-state">No employees found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Code</th><th>Name</th><th>Department</th><th>Designation</th><th>Status</th></tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id}>
                <td><Link to={`/employees/${e.id}`}>{e.employee_code}</Link></td>
                <td>{e.full_name}</td>
                <td>{e.department || "—"}</td>
                <td>{e.designation || "—"}</td>
                <td><span className={`badge badge-${e.employment_status}`}>{e.employment_status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function EmployeeForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    employee_code: "", full_name: "", email: "", phone: "",
    date_of_joining: new Date().toISOString().slice(0, 10),
    department: "", designation: "",
  });
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form className="card form-card mb-4" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <h3>New Employee</h3>
      <div className="form-grid">
        <label>Code<input value={form.employee_code} onChange={upd("employee_code")} required /></label>
        <label>Full Name<input value={form.full_name} onChange={upd("full_name")} required /></label>
        <label>Email<input type="email" value={form.email} onChange={upd("email")} /></label>
        <label>Phone<input value={form.phone} onChange={upd("phone")} /></label>
        <label>Joining Date<input type="date" value={form.date_of_joining} onChange={upd("date_of_joining")} required /></label>
        <label>Department<input value={form.department} onChange={upd("department")} /></label>
        <label>Designation<input value={form.designation} onChange={upd("designation")} /></label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Create</button>
      </div>
    </form>
  );
}
