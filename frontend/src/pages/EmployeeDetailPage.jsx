import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import api, { errorMessage } from "../lib/api";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);
  const [salary, setSalary] = useState(null);
  const [error, setError] = useState("");

  usePageTitle(emp?.full_name || "Employee");

  useEffect(() => {
    api.employees.get(id).then((r) => setEmp(r.data)).catch((e) => setError(errorMessage(e)));
    api.employees.getSalary(id).then((r) => setSalary(r.data)).catch(() => {});
  }, [id]);

  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!emp) return <div className="page"><div className="skeleton-bar w-full h-64" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{emp.full_name}</h1>
          <p className="text-muted">{emp.employee_code} — {emp.department || "No department"} — {emp.designation || "No designation"}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/employees")}>Back</button>
      </div>

      <div className="detail-grid">
        <div className="card">
          <h3>Personal Details</h3>
          <dl className="detail-list">
            <dt>Email</dt><dd>{emp.email || "—"}</dd>
            <dt>Phone</dt><dd>{emp.phone || "—"}</dd>
            <dt>Date of Birth</dt><dd>{emp.date_of_birth || "—"}</dd>
            <dt>Date of Joining</dt><dd>{emp.date_of_joining}</dd>
            <dt>Status</dt><dd><span className={`badge badge-${emp.employment_status}`}>{emp.employment_status}</span></dd>
            <dt>PAN</dt><dd>{emp.pan || "—"}</dd>
            <dt>UAN</dt><dd>{emp.uan || "—"}</dd>
            <dt>ESI</dt><dd>{emp.esi_number || "—"}</dd>
          </dl>
        </div>

        <div className="card">
          <h3>Bank Details</h3>
          <dl className="detail-list">
            <dt>Bank</dt><dd>{emp.bank_name || "—"}</dd>
            <dt>IFSC</dt><dd>{emp.bank_ifsc || "—"}</dd>
          </dl>

          <h3 className="mt-4">Salary Structure</h3>
          {salary ? (
            <dl className="detail-list">
              <dt>Basic</dt><dd>₹{Number(salary.basic_salary).toLocaleString("en-IN")}</dd>
              <dt>HRA</dt><dd>{Number(salary.hra_percentage)}% of Basic</dd>
              <dt>DA</dt><dd>{Number(salary.da_percentage)}% of Basic</dd>
              <dt>CTC</dt><dd>₹{Number(salary.ctc).toLocaleString("en-IN")}</dd>
              <dt>PF</dt><dd>{salary.pf_applicable ? "Yes" : "No"}</dd>
              <dt>ESI</dt><dd>{salary.esi_applicable ? "Yes" : "No"}</dd>
              <dt>TDS Regime</dt><dd>{salary.tds_regime.toUpperCase()}</dd>
              <dt>Effective From</dt><dd>{salary.effective_from}</dd>
            </dl>
          ) : (
            <p className="text-muted">No salary structure configured.</p>
          )}
        </div>
      </div>
    </div>
  );
}
