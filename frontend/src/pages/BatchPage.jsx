import { useState } from "react";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";

const BASE = "/api/v1";

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i).toLocaleString("en", { month: "long" }),
}));

const INITIAL = {
  company_name: "",
  company_address: "",
  employee_name: "",
  employee_id: "",
  designation: "",
  department: "",
  pan: "",
  bank_account: "",
  basic_salary: "",
  hra: "0",
  da: "0",
  conveyance: "0",
  medical: "0",
  special_allowance: "0",
  other_allowance: "0",
  provident_fund: "0",
  esi: "0",
  professional_tax: "0",
  tds: "0",
  other_deductions: "0",
  template: "standard",
};

export default function BatchPage() {
  usePageTitle("Batch Payslip Generator — Multiple Months at Once");
  const [form, setForm] = useState(INITIAL);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function toggleMonth(m) {
    setSelectedMonths((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m].sort((a, b) => a - b),
    );
  }

  async function generate(e) {
    e.preventDefault();
    if (selectedMonths.length === 0) {
      setError("Select at least one month");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const body = {
        company_name: form.company_name,
        company_address: form.company_address,
        employee_name: form.employee_name,
        employee_id: form.employee_id,
        designation: form.designation,
        department: form.department,
        pan: form.pan,
        bank_account: form.bank_account,
        months: selectedMonths.map((m) => ({ month: m, year })),
        earnings: {
          basic_salary: form.basic_salary,
          hra: form.hra || "0",
          da: form.da || "0",
          conveyance: form.conveyance || "0",
          medical: form.medical || "0",
          special_allowance: form.special_allowance || "0",
          other_allowance: form.other_allowance || "0",
        },
        deductions: {
          provident_fund: form.provident_fund || "0",
          esi: form.esi || "0",
          professional_tax: form.professional_tax || "0",
          tds: form.tds || "0",
          other_deductions: form.other_deductions || "0",
        },
        template: form.template,
      };
      const res = await fetch(`${BASE}/free/payslip/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to generate batch");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslips_${form.employee_name.replace(/\s+/g, "_")}_${year}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      track("payslip_batch", { count: selectedMonths.length });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Batch Payslip Generator</h1>
          <p className="tool-subtitle">
            Generate payslips for multiple months at once. Download as a ZIP file. No sign-up required.
          </p>

          <form className="calc-card" onSubmit={generate}>
            <h3 className="calc-result-heading">Company & Employee</h3>
            <label className="calc-label">
              Company Name *
              <input className="calc-input" name="company_name" value={form.company_name} onChange={set} required placeholder="Acme Corp" />
            </label>
            <label className="calc-label">
              Employee Name *
              <input className="calc-input" name="employee_name" value={form.employee_name} onChange={set} required placeholder="Ravi Kumar" />
            </label>
            <label className="calc-label">
              Designation *
              <input className="calc-input" name="designation" value={form.designation} onChange={set} required placeholder="Software Engineer" />
            </label>
            <div className="calc-row">
              <label className="calc-label">
                Employee ID
                <input className="calc-input" name="employee_id" value={form.employee_id} onChange={set} placeholder="EMP001" />
              </label>
              <label className="calc-label">
                Department
                <input className="calc-input" name="department" value={form.department} onChange={set} placeholder="Engineering" />
              </label>
            </div>

            <h3 className="calc-result-heading">Select Months</h3>
            <label className="calc-label">
              Year
              <input className="calc-input" type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} min="2000" max="2100" />
            </label>
            <div className="month-grid">
              {MONTHS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={`month-btn${selectedMonths.includes(m.value) ? " active" : ""}`}
                  onClick={() => toggleMonth(m.value)}
                >
                  {m.label.slice(0, 3)}
                </button>
              ))}
            </div>
            <p className="calc-hint">
              {selectedMonths.length === 0 ? "Click months to select" : `${selectedMonths.length} month(s) selected`}
            </p>

            <h3 className="calc-result-heading">Earnings (₹)</h3>
            <label className="calc-label">
              Basic Salary *
              <input className="calc-input" name="basic_salary" type="number" value={form.basic_salary} onChange={set} required min="1" placeholder="25000" inputMode="numeric" />
            </label>
            <div className="calc-row">
              <label className="calc-label">HRA<input className="calc-input" name="hra" type="number" value={form.hra} onChange={set} min="0" inputMode="numeric" /></label>
              <label className="calc-label">DA<input className="calc-input" name="da" type="number" value={form.da} onChange={set} min="0" inputMode="numeric" /></label>
              <label className="calc-label">Special<input className="calc-input" name="special_allowance" type="number" value={form.special_allowance} onChange={set} min="0" inputMode="numeric" /></label>
            </div>

            <h3 className="calc-result-heading">Deductions (₹)</h3>
            <div className="calc-row">
              <label className="calc-label">PF<input className="calc-input" name="provident_fund" type="number" value={form.provident_fund} onChange={set} min="0" inputMode="numeric" /></label>
              <label className="calc-label">ESI<input className="calc-input" name="esi" type="number" value={form.esi} onChange={set} min="0" inputMode="numeric" /></label>
              <label className="calc-label">PT<input className="calc-input" name="professional_tax" type="number" value={form.professional_tax} onChange={set} min="0" inputMode="numeric" /></label>
            </div>
            <label className="calc-label">TDS<input className="calc-input" name="tds" type="number" value={form.tds} onChange={set} min="0" inputMode="numeric" /></label>

            <h3 className="calc-result-heading">Template</h3>
            <select className="calc-input" name="template" value={form.template} onChange={set}>
              <option value="standard">Standard</option>
              <option value="corporate">Corporate</option>
              <option value="modern">Modern</option>
            </select>

            {error && <p className="calc-error">{error}</p>}

            <button type="submit" className="btn-primary btn-lg" disabled={loading}>
              {loading ? "Generating..." : `Download ${selectedMonths.length || ""} Payslip${selectedMonths.length !== 1 ? "s" : ""} as ZIP`}
            </button>
          </form>

          <section className="tool-info">
            <h2>Batch Payslip Generation</h2>
            <p>
              Need payslips for an entire financial year? Select multiple months, enter salary details once,
              and download all payslips as a single ZIP file. Great for year-end documentation, loan applications,
              or audit compliance.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
