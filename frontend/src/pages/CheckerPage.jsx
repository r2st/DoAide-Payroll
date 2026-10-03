import { useEffect, useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";

function check(employees, wages) {
  const pfMandatory = employees >= 20;
  const pfVoluntary = !pfMandatory && employees >= 1;
  const esiApplicable = employees >= 10 && wages <= 21000;
  const esiOrgEligible = employees >= 10;

  const pfEmployee = Math.round(Math.min(wages, 15000) * 0.12);
  const pfEmployer = pfEmployee;
  const esiEmployee = esiApplicable ? Math.round(wages * 0.0075) : 0;
  const esiEmployer = esiApplicable ? Math.round(wages * 0.0325) : 0;

  return {
    pfMandatory, pfVoluntary, esiApplicable, esiOrgEligible,
    pfEmployee, pfEmployer, esiEmployee, esiEmployer,
  };
}

export default function CheckerPage() {
  usePageTitle("PF & ESI Eligibility Checker — Check Compliance Requirements");
  const [employees, setEmployees] = useState("");
  const [wages, setWages] = useState("");

  const empNum = parseInt(employees);
  const wageNum = parseFloat(wages);
  const valid = Number.isFinite(empNum) && empNum > 0 && Number.isFinite(wageNum) && wageNum > 0;
  const result = valid ? check(empNum, wageNum) : null;

  useEffect(() => {
    if (result) track("pf_esi_check", { employees: empNum, wages: wageNum });
  }, [result, empNum, wageNum]);

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">PF & ESI Eligibility Checker</h1>
          <p className="tool-subtitle">
            Check if your business needs to register for PF and ESI. Enter employee count and wages to see compliance requirements.
          </p>

          <div className="calc-card">
            <label className="calc-label">
              Number of employees
              <input
                type="number"
                className="calc-input"
                value={employees}
                onChange={(e) => setEmployees(e.target.value)}
                placeholder="Total employee count"
                min="1"
                inputMode="numeric"
                autoFocus
              />
            </label>

            <label className="calc-label">
              Monthly wages of employee (₹)
              <input
                type="number"
                className="calc-input"
                value={wages}
                onChange={(e) => setWages(e.target.value)}
                placeholder="Gross monthly wages"
                min="0"
                inputMode="numeric"
              />
            </label>

            {result && (
              <div className="calc-result" aria-live="polite">
                <div className={`checker-box ${result.pfMandatory ? "checker-yes" : "checker-no"}`}>
                  <h3>Provident Fund (PF)</h3>
                  {result.pfMandatory ? (
                    <>
                      <p className="checker-status">Mandatory</p>
                      <p>With {empNum} employees, PF registration is mandatory (threshold: 20 employees).</p>
                    </>
                  ) : result.pfVoluntary ? (
                    <>
                      <p className="checker-status checker-status-optional">Voluntary</p>
                      <p>With {empNum} employees, PF registration is voluntary. It becomes mandatory at 20 employees.</p>
                    </>
                  ) : (
                    <>
                      <p className="checker-status">Not Required</p>
                      <p>PF registration is not applicable.</p>
                    </>
                  )}
                  {(result.pfMandatory || result.pfVoluntary) && (
                    <div className="checker-rates">
                      <span>Employee contribution: 12% = ₹{result.pfEmployee}/mo</span>
                      <span>Employer contribution: 12% = ₹{result.pfEmployer}/mo</span>
                    </div>
                  )}
                </div>

                <div className={`checker-box ${result.esiApplicable ? "checker-yes" : "checker-no"}`}>
                  <h3>Employee State Insurance (ESI)</h3>
                  {result.esiApplicable ? (
                    <>
                      <p className="checker-status">Applicable</p>
                      <p>ESI applies: {empNum} employees (≥10) and wages ₹{wageNum.toLocaleString("en-IN")} (≤₹21,000).</p>
                    </>
                  ) : !result.esiOrgEligible ? (
                    <>
                      <p className="checker-status">Not Applicable</p>
                      <p>ESI requires at least 10 employees. You have {empNum}.</p>
                    </>
                  ) : (
                    <>
                      <p className="checker-status">Not Applicable for This Employee</p>
                      <p>Your organization qualifies (≥10 employees) but this employee&apos;s wages exceed ₹21,000/month.</p>
                    </>
                  )}
                  {result.esiApplicable && (
                    <div className="checker-rates">
                      <span>Employee: 0.75% = ₹{result.esiEmployee}/mo</span>
                      <span>Employer: 3.25% = ₹{result.esiEmployer}/mo</span>
                    </div>
                  )}
                </div>

                <ShareButtons
                  path="/checker"
                  text={`PF/ESI eligibility check: ${empNum} employees, ₹${wageNum.toLocaleString("en-IN")} wages — checked free on DoAide Payroll`}
                />
              </div>
            )}
          </div>

          <section className="tool-info">
            <h2>PF & ESI Compliance Rules</h2>
            <p>
              Indian labour laws require employers to contribute to Provident Fund (PF) and Employee
              State Insurance (ESI) based on employee count and wages.
            </p>
            <h3>PF Rules</h3>
            <ul>
              <li>Mandatory for establishments with 20 or more employees</li>
              <li>Employee contribution: 12% of Basic (capped at ₹15,000 basic)</li>
              <li>Employer contribution: 12% of Basic (3.67% to EPF, 8.33% to EPS)</li>
              <li>Monthly filing: ECR (Electronic Challan cum Return) by 15th of next month</li>
            </ul>
            <h3>ESI Rules</h3>
            <ul>
              <li>Applicable to establishments with 10+ employees</li>
              <li>Covers employees with monthly wages up to ₹21,000</li>
              <li>Employee contribution: 0.75% of gross wages</li>
              <li>Employer contribution: 3.25% of gross wages</li>
              <li>Half-yearly contribution periods: April-September and October-March</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
