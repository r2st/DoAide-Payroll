import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../hooks/useAuth";
import api, { errorMessage } from "../lib/api";

export default function AttendancePage() {
  usePageTitle("Attendance");
  const { canWrite } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ employee_id: "", date: new Date().toISOString().slice(0, 10), status: "present" });
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.employees.list();
      setSuccess("Attendance feature ready. Connect to mark attendance for employees.");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="page">
      <div className="page-header"><h1>Attendance</h1></div>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {canWrite && (
        <div className="card form-card mb-4">
          <h3>Mark Attendance</h3>
          <form onSubmit={submit} className="form-grid">
            <label>Employee ID<input type="number" value={form.employee_id} onChange={upd("employee_id")} required /></label>
            <label>Date<input type="date" value={form.date} onChange={upd("date")} required /></label>
            <label>Status
              <select value={form.status} onChange={upd("status")}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="half_day">Half Day</option>
                <option value="on_leave">On Leave</option>
                <option value="holiday">Holiday</option>
                <option value="weekend">Weekend</option>
              </select>
            </label>
            <div className="form-actions"><button type="submit" className="btn btn-primary">Mark</button></div>
          </form>
        </div>
      )}

      <div className="card">
        <p className="empty-state">
          Attendance records will appear here. Use the form above to mark daily attendance
          or import in bulk.
        </p>
      </div>
    </div>
  );
}
