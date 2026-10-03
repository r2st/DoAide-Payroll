import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function PfEsiComplianceGuide() {
  usePageTitle("PF & ESI Compliance Guide for Indian Employers 2026");

  return (
    <article className="blog-article">
      <h1>PF & ESI Compliance Guide for Indian Employers 2026</h1>
      <p className="blog-meta">Updated October 2026 · 10 min read</p>

      <section>
        <h2>Provident Fund (PF) — Overview</h2>
        <p>
          The Employees&apos; Provident Fund is a retirement savings scheme managed by the EPFO.
          It is mandatory for establishments with 20 or more employees, and voluntary for
          smaller businesses.
        </p>
      </section>

      <section>
        <h2>PF Registration Thresholds</h2>
        <ul>
          <li>20+ employees → PF registration is mandatory</li>
          <li>Fewer than 20 → Voluntary registration allowed</li>
          <li>Once registered, you cannot de-register even if employee count drops below 20</li>
        </ul>
      </section>

      <section>
        <h2>PF Contribution Rates</h2>
        <p>
          Both employee and employer contribute 12% of Basic salary (capped at ₹15,000 Basic,
          meaning maximum contribution is ₹1,800/month each).
        </p>
        <ul>
          <li>Employee: 12% → goes to EPF account</li>
          <li>Employer: 12% → split as 3.67% to EPF + 8.33% to EPS (Pension Scheme)</li>
          <li>Employer also pays 0.5% EDLI (insurance) + admin charges</li>
        </ul>
      </section>

      <section>
        <h2>PF Filing Deadlines</h2>
        <ul>
          <li>Monthly ECR filing: by 15th of the following month</li>
          <li>Annual return: Form 3A and 6A by 25th April</li>
          <li>Late payment: 12% interest + damages up to 100% of arrears</li>
        </ul>
      </section>

      <section>
        <h2>Employee State Insurance (ESI) — Overview</h2>
        <p>
          ESI provides medical, sickness, maternity, and disability benefits to employees.
          It is managed by the ESIC.
        </p>
      </section>

      <section>
        <h2>ESI Applicability</h2>
        <ul>
          <li>10+ employees (in most states) → ESI registration is mandatory</li>
          <li>Covers employees with monthly wages up to ₹21,000</li>
          <li>Once covered, employee stays covered for the contribution period even if wages increase</li>
        </ul>
      </section>

      <section>
        <h2>ESI Contribution Rates</h2>
        <ul>
          <li>Employee: 0.75% of gross wages</li>
          <li>Employer: 3.25% of gross wages</li>
          <li>Total: 4% of gross wages</li>
        </ul>
      </section>

      <section>
        <h2>ESI Filing</h2>
        <ul>
          <li>Half-yearly contribution periods: April–September and October–March</li>
          <li>Monthly challan: by 15th of following month</li>
          <li>Half-yearly return: within 42 days of contribution period end</li>
        </ul>
      </section>

      <section>
        <h2>Check Your Compliance Requirements</h2>
        <p>
          Use our free <Link to="/checker">PF & ESI eligibility checker</Link> to instantly
          see if your business needs to register for PF and ESI.
        </p>
      </section>
    </article>
  );
}
