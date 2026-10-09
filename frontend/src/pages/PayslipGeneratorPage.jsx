import { useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";

const BASE = "/api/v1";

const TEMPLATES = [
  { value: "standard", label: "Standard", desc: "Clean and professional" },
  { value: "corporate", label: "Corporate", desc: "Dark header with gold accents" },
  { value: "modern", label: "Modern", desc: "Indigo theme with modern layout" },
];

function field(label, name, value, onChange, opts = {}) {
  return (
    <label className="calc-label" key={name}>
      {label}
      <input
        className="calc-input"
        name={name}
        value={value}
        onChange={onChange}
        type={opts.type || "text"}
        placeholder={opts.placeholder || ""}
        required={opts.required}
        min={opts.min}
        step={opts.step}
        inputMode={opts.inputMode}
      />
    </label>
  );
}

const INITIAL = {
  company_name: "",
  company_address: "",
  employee_name: "",
  employee_id: "",
  designation: "",
  department: "",
  pan: "",
  bank_account: "",
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
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

export default function PayslipGeneratorPage() {
  usePageTitle("Free Payslip Generator — Download Salary Slip PDF Instantly");
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function generate(e) {
    e.preventDefault();
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
        month: parseInt(form.month),
        year: parseInt(form.year),
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
      const res = await fetch(`${BASE}/free/payslip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to generate payslip");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip_${form.employee_name.replace(/\s+/g, "_")}_${String(form.month).padStart(2, "0")}_${form.year}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      track("payslip_generate", { template: form.template });
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
          <h1 className="tool-title">Free Payslip Generator</h1>
          <p className="tool-subtitle">
            Generate professional salary slips in PDF format. Choose from multiple templates. No sign-up required.
          </p>

          <form className="calc-card" onSubmit={generate}>
            <h3 className="calc-result-heading">Company Details</h3>
            {field("Company Name *", "company_name", form.company_name, set, { required: true, placeholder: "Acme Corp Pvt Ltd" })}
            {field("Company Address", "company_address", form.company_address, set, { placeholder: "123 MG Road, Bangalore" })}

            <h3 className="calc-result-heading">Employee Details</h3>
            {field("Employee Name *", "employee_name", form.employee_name, set, { required: true, placeholder: "Ravi Kumar" })}
            {field("Employee ID", "employee_id", form.employee_id, set, { placeholder: "EMP001" })}
            {field("Designation *", "designation", form.designation, set, { required: true, placeholder: "Software Engineer" })}
            {field("Department", "department", form.department, set, { placeholder: "Engineering" })}
            {field("PAN", "pan", form.pan, set, { placeholder: "ABCDE1234F" })}
            {field("Bank Account", "bank_account", form.bank_account, set, { placeholder: "1234567890" })}

            <div className="calc-row">
              <label className="calc-label">
                Month
                <select className="calc-input" name="month" value={form.month} onChange={set}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i).toLocaleString("en", { month: "long" })}
                    </option>
                  ))}
                </select>
              </label>
              {field("Year", "year", form.year, set, { type: "number", min: "2000" })}
            </div>

            <h3 className="calc-result-heading">Earnings (₹)</h3>
            {field("Basic Salary *", "basic_salary", form.basic_salary, set, { type: "number", required: true, min: "1", step: "1", inputMode: "numeric", placeholder: "25000" })}
            <div className="calc-row">
              {field("HRA", "hra", form.hra, set, { type: "number", min: "0", step: "1", inputMode: "numeric" })}
              {field("DA", "da", form.da, set, { type: "number", min: "0", step: "1", inputMode: "numeric" })}
            </div>
            <div className="calc-row">
              {field("Conveyance", "conveyance", form.conveyance, set, { type: "number", min: "0", step: "1", inputMode: "numeric" })}
              {field("Medical", "medical", form.medical, set, { type: "number", min: "0", step: "1", inputMode: "numeric" })}
            </div>
            <div className="calc-row">
              {field("Special Allowance", "special_allowance", form.special_allowance, set, { type: "number", min: "0", step: "1", inputMode: "numeric" })}
              {field("Other Allowance", "other_allowance", form.other_allowance, set, { type: "number", min: "0", step: "1", inputMode: "numeric" })}
            </div>

            <h3 className="calc-result-heading">Deductions (₹)</h3>
            <div className="calc-row">
              {field("Provident Fund", "provident_fund", form.provident_fund, set, { type: "number", min: "0", step: "1", inputMode: "numeric" })}
              {field("ESI", "esi", form.esi, set, { type: "number", min: "0", step: "1", inputMode: "numeric" })}
            </div>
            <div className="calc-row">
              {field("Professional Tax", "professional_tax", form.professional_tax, set, { type: "number", min: "0", step: "1", inputMode: "numeric" })}
              {field("TDS", "tds", form.tds, set, { type: "number", min: "0", step: "1", inputMode: "numeric" })}
            </div>
            {field("Other Deductions", "other_deductions", form.other_deductions, set, { type: "number", min: "0", step: "1", inputMode: "numeric" })}

            <h3 className="calc-result-heading">Template</h3>
            <div className="template-selector">
              {TEMPLATES.map((t) => (
                <label key={t.value} className={`template-option${form.template === t.value ? " active" : ""}`}>
                  <input
                    type="radio"
                    name="template"
                    value={t.value}
                    checked={form.template === t.value}
                    onChange={set}
                  />
                  <strong>{t.label}</strong>
                  <span>{t.desc}</span>
                </label>
              ))}
            </div>

            {error && <p className="calc-error">{error}</p>}

            <button type="submit" className="btn-primary btn-lg" disabled={loading}>
              {loading ? "Generating..." : "Download Payslip PDF"}
            </button>
          </form>

          <ShareButtons
            path="/payslip-generator"
            text="Generate free salary slips in PDF — multiple templates, no sign-up — DoAide Payroll"
          />

          <section className="tool-info">
            <h2>What Is a Payslip?</h2>
            <p>
              A payslip (also called salary slip or pay stub) is a document issued by an employer
              detailing an employee's salary components — earnings, deductions, and net pay for a specific month.
              It serves as proof of income for loans, visa applications, and tax filing.
            </p>
            <h3>Why Use Our Free Payslip Generator?</h3>
            <ul>
              <li><strong>No sign-up</strong> — Generate payslips instantly without creating an account.</li>
              <li><strong>Multiple templates</strong> — Choose from Standard, Corporate, or Modern designs.</li>
              <li><strong>Indian format</strong> — Includes PF, ESI, Professional Tax, and TDS fields.</li>
              <li><strong>PDF download</strong> — Professional PDF ready to print or share.</li>
              <li><strong>Batch generation</strong> — Generate payslips for multiple months at once.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
