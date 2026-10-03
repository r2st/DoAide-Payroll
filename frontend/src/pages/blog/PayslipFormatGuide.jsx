import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function PayslipFormatGuide() {
  usePageTitle("What to Include in a Payslip — Indian Payslip Format Guide");

  return (
    <article className="blog-article">
      <h1>What to Include in a Payslip — Indian Payslip Format Guide</h1>
      <p className="blog-meta">Updated October 2026 · 7 min read</p>

      <section>
        <h2>Why Payslips Matter</h2>
        <p>
          A payslip is a legal document that details an employee&apos;s earnings and deductions
          for a pay period. Under the Payment of Wages Act, 1936, employers must provide wage
          slips to all employees. Beyond legal compliance, payslips serve as proof of income
          for loans, visas, and tax filing.
        </p>
      </section>

      <section>
        <h2>Mandatory Payslip Components</h2>
        <ul>
          <li><strong>Company name and address</strong></li>
          <li><strong>Employee name, ID, and designation</strong></li>
          <li><strong>Pay period</strong> — Month and year</li>
          <li><strong>Days worked and leave taken</strong></li>
          <li><strong>Earnings breakdown</strong> — Basic, HRA, DA, Special Allowance, overtime</li>
          <li><strong>Deductions breakdown</strong> — PF, ESI, Professional Tax, TDS, loan recovery</li>
          <li><strong>Gross pay and net pay</strong></li>
          <li><strong>PAN and UAN numbers</strong></li>
          <li><strong>Bank account details</strong> (last 4 digits)</li>
        </ul>
      </section>

      <section>
        <h2>Payslip Formats for Different Workers</h2>
        <h3>Salaried Employees</h3>
        <p>
          Standard format with full earnings, statutory deductions (PF, ESI, PT, TDS),
          and employer contributions shown separately.
        </p>

        <h3>Contractors (Section 194C/194J)</h3>
        <p>
          Payment slip showing invoice reference, gross amount, TDS deduction (typically 1-10%
          depending on nature of work), and net payable.
        </p>

        <h3>Interns</h3>
        <p>
          Simplified stipend slip. Interns below the basic exemption limit usually have
          no TDS. No PF or ESI deductions apply to stipends.
        </p>

        <h3>Freelancers</h3>
        <p>
          Invoice-based payment with GST (if registered), TDS under section 194J (10% for
          professional services), and net payable after deductions.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul>
          <li>Issue payslips on a fixed date each month</li>
          <li>Use a consistent format across the organization</li>
          <li>Include YTD totals for earnings and tax deductions</li>
          <li>Keep payslips confidential — share only with the employee</li>
          <li>Maintain digital records for at least 3 years</li>
        </ul>
      </section>

      <section>
        <h2>Get Free Templates</h2>
        <p>
          Download professional <Link to="/templates">payslip templates</Link> for salaried
          employees, contractors, interns, and freelancers — free on DoAide Payroll.
        </p>
      </section>
    </article>
  );
}
