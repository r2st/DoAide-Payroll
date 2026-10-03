import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function SalaryStructureGuide() {
  usePageTitle("CTC, Gross, Net Salary — Indian Salary Structure Explained");

  return (
    <article className="blog-article">
      <h1>CTC, Gross, Net Salary — Indian Salary Structure Explained</h1>
      <p className="blog-meta">Updated October 2026 · 8 min read</p>

      <section>
        <h2>What Is CTC (Cost to Company)?</h2>
        <p>
          CTC is the total amount a company spends on an employee per year. It includes your
          gross salary, employer contributions to PF and ESI, gratuity provisions, and any
          other benefits like insurance or meal vouchers. CTC is not what you receive in your
          bank account — it is the employer&apos;s total cost.
        </p>
      </section>

      <section>
        <h2>CTC vs Gross vs Net Salary</h2>
        <p>
          <strong>CTC</strong> = Gross Salary + Employer PF + Employer ESI + Gratuity + Benefits.
          <br />
          <strong>Gross Salary</strong> = Basic + HRA + DA + Special Allowances (before deductions).
          <br />
          <strong>Net Salary</strong> = Gross Salary − Employee PF − Employee ESI − Professional Tax − TDS.
        </p>
        <p>
          For a CTC of ₹6,00,000 per year, the net take-home is typically 70-80% depending
          on the salary structure and tax regime chosen.
        </p>
      </section>

      <section>
        <h2>Key Salary Components</h2>
        <h3>Basic Salary (40-50% of CTC)</h3>
        <p>
          The fixed component of your salary. PF, gratuity, and HRA are calculated as percentages
          of Basic. A higher Basic means higher PF contributions but also higher retirement savings.
        </p>

        <h3>House Rent Allowance (HRA)</h3>
        <p>
          Typically 40% of Basic for non-metro cities and 50% for metro cities (Delhi, Mumbai,
          Kolkata, Chennai). HRA is partially or fully tax-exempt if you pay rent.
        </p>

        <h3>Dearness Allowance (DA)</h3>
        <p>
          Meant to offset inflation. Common in government and PSU pay structures. Many private
          companies fold DA into Special Allowance instead.
        </p>

        <h3>Special Allowance</h3>
        <p>
          The balancing figure — whatever remains after Basic, HRA, and other fixed components
          are allocated. Fully taxable.
        </p>
      </section>

      <section>
        <h2>Statutory Deductions</h2>
        <p>
          Every salaried employee in India is subject to mandatory deductions:
        </p>
        <ul>
          <li><strong>Employee Provident Fund (EPF)</strong> — 12% of Basic, capped at ₹15,000 Basic</li>
          <li><strong>Employee State Insurance (ESI)</strong> — 0.75% of gross, if gross ≤ ₹21,000/month</li>
          <li><strong>Professional Tax</strong> — ₹200/month (varies by state, max ₹2,500/year)</li>
          <li><strong>Tax Deducted at Source (TDS)</strong> — Based on your annual income and tax regime</li>
        </ul>
      </section>

      <section>
        <h2>Calculate Your Take-Home Pay</h2>
        <p>
          Use our free <Link to="/calculator">salary calculator</Link> to get an instant CTC
          breakdown with PF, ESI, HRA, and net take-home calculation.
        </p>
      </section>
    </article>
  );
}
