import { useEffect, useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";

function fmt(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function compute(ctc, metro) {
  const monthly = ctc / 12;
  const basic = ctc * 0.5;
  const basicMo = basic / 12;
  const hra = basic * (metro ? 0.5 : 0.4);
  const hraMo = hra / 12;

  const pfBasicCap = Math.min(basicMo, 15000);
  const epfEmployee = Math.round(pfBasicCap * 0.12);
  const epfEmployer = Math.round(pfBasicCap * 0.12);

  const grossMo = monthly;
  const esiApplicable = grossMo <= 21000;
  const esiEmployee = esiApplicable ? Math.round(grossMo * 0.0075) : 0;
  const esiEmployer = esiApplicable ? Math.round(grossMo * 0.0325) : 0;

  const pt = 200;

  const specialMo = Math.max(0, monthly - basicMo - hraMo);

  const totalDeductions = epfEmployee + esiEmployee + pt;
  const netMo = Math.round(monthly - totalDeductions);

  return {
    basic, hra, basicMo, hraMo, specialMo,
    epfEmployee, epfEmployer, esiEmployee, esiEmployer, esiApplicable,
    pt, totalDeductions, netMo, grossMo: monthly,
  };
}

export default function CalculatorPage() {
  usePageTitle("Free Salary Calculator — CTC Breakdown for Indian Employees");
  const [ctc, setCtc] = useState("");
  const [metro, setMetro] = useState(false);

  const parsed = parseFloat(ctc);
  const valid = Number.isFinite(parsed) && parsed > 0;
  const result = valid ? compute(parsed, metro) : null;

  useEffect(() => {
    if (result) track("salary_calculate", { ctc: parsed });
  }, [result, parsed]);

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Salary Calculator</h1>
          <p className="tool-subtitle">
            Calculate CTC breakdown with PF, ESI, HRA, and deductions for Indian employees. No sign-up required.
          </p>

          <div className="calc-card">
            <label className="calc-label">
              Annual CTC (₹)
              <input
                type="number"
                className="calc-input"
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
                placeholder="Enter annual CTC in ₹"
                min="0"
                step="1000"
                inputMode="numeric"
                autoFocus
              />
            </label>

            <label className="calc-checkbox-label">
              <input
                type="checkbox"
                checked={metro}
                onChange={(e) => setMetro(e.target.checked)}
              />
              Metro city (HRA at 50% of basic instead of 40%)
            </label>

            {result && (
              <div className="calc-result" aria-live="polite">
                <h3 className="calc-result-heading">Monthly Breakdown</h3>
                <div className="calc-result-row">
                  <span>Basic Salary</span>
                  <strong>{fmt(result.basicMo)}</strong>
                </div>
                <div className="calc-result-row">
                  <span>HRA ({metro ? "50%" : "40%"} of Basic)</span>
                  <strong>{fmt(result.hraMo)}</strong>
                </div>
                <div className="calc-result-row">
                  <span>Special Allowance</span>
                  <strong>{fmt(result.specialMo)}</strong>
                </div>
                <div className="calc-result-row calc-result-sub">
                  <span>Gross Salary</span>
                  <strong>{fmt(result.grossMo)}</strong>
                </div>

                <h3 className="calc-result-heading">Deductions</h3>
                <div className="calc-result-row">
                  <span>Employee PF (12%)</span>
                  <strong>-{fmt(result.epfEmployee)}</strong>
                </div>
                {result.esiApplicable && (
                  <div className="calc-result-row">
                    <span>Employee ESI (0.75%)</span>
                    <strong>-{fmt(result.esiEmployee)}</strong>
                  </div>
                )}
                <div className="calc-result-row">
                  <span>Professional Tax</span>
                  <strong>-{fmt(result.pt)}</strong>
                </div>

                <div className="calc-result-row calc-total">
                  <span>Net Take-Home (Monthly)</span>
                  <strong>{fmt(result.netMo)}</strong>
                </div>
                <div className="calc-result-row">
                  <span>Net Take-Home (Annual)</span>
                  <strong>{fmt(result.netMo * 12)}</strong>
                </div>

                <h3 className="calc-result-heading">Employer Cost</h3>
                <div className="calc-result-row">
                  <span>Employer PF (12%)</span>
                  <strong>{fmt(result.epfEmployer)}</strong>
                </div>
                {result.esiApplicable && (
                  <div className="calc-result-row">
                    <span>Employer ESI (3.25%)</span>
                    <strong>{fmt(result.esiEmployer)}</strong>
                  </div>
                )}

                <ShareButtons
                  path="/calculator"
                  text={`CTC ${fmt(parsed)} → Take-home ${fmt(result.netMo)}/month — calculated free on DoAide Payroll`}
                />
              </div>
            )}
          </div>

          <section className="tool-info">
            <h2>How Indian Salary Structure Works</h2>
            <p>
              CTC (Cost to Company) is the total amount a company spends on an employee annually.
              It includes gross salary, employer PF/ESI contributions, and other benefits.
            </p>
            <h3>Standard CTC Components</h3>
            <ul>
              <li><strong>Basic Salary</strong> — Typically 40-50% of CTC. PF and gratuity are calculated on this.</li>
              <li><strong>HRA</strong> — 40% of Basic (non-metro) or 50% (metro cities: Delhi, Mumbai, Kolkata, Chennai).</li>
              <li><strong>PF</strong> — 12% of Basic (capped at ₹15,000 basic = ₹1,800/month max contribution).</li>
              <li><strong>ESI</strong> — Applicable if gross salary ≤ ₹21,000/month. Employee: 0.75%, Employer: 3.25%.</li>
              <li><strong>Professional Tax</strong> — State-level tax, typically ₹200/month (varies by state).</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
