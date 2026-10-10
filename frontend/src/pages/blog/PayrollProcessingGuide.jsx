import { Link } from "react-router-dom";
import { useEffect } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";

const SCHEMA = [
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Payroll Processing in India 2026: Complete Guide for HR Managers",
    description:
      "Step-by-step guide covering Indian payroll processing — from salary structure and statutory deductions to compliance filings and automation tips for HR managers.",
    datePublished: "2026-10-10",
    dateModified: "2026-10-10",
    author: { "@type": "Organization", name: "DoAide Payroll" },
    publisher: {
      "@type": "Organization",
      name: "DoAide Payroll",
      url: "https://payroll.doaide.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://payroll.doaide.com/blog/payroll-processing-india-2026-guide",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are the mandatory statutory deductions in Indian payroll?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Indian payroll must include Employee Provident Fund (EPF) at 12% of basic, Employee State Insurance (ESI) at 0.75% of gross wages (if gross ≤ ₹21,000/month), Professional Tax (varies by state, max ₹2,500/year), and Tax Deducted at Source (TDS) based on the applicable income tax slab.",
        },
      },
      {
        "@type": "Question",
        name: "What is the payroll processing cycle in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A typical Indian payroll cycle runs monthly: collect attendance by the 25th, process salary calculations by the 28th, disburse salaries by the last working day, file PF/ESI challans by the 15th of the following month, and deposit TDS by the 7th of the following month.",
        },
      },
      {
        "@type": "Question",
        name: "Is payroll software mandatory for Indian companies?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Payroll software is not legally mandatory, but it is strongly recommended for businesses with more than 10 employees. Manual processing increases the risk of calculation errors, missed compliance deadlines, and penalties from EPFO and ESIC.",
        },
      },
      {
        "@type": "Question",
        name: "How do I calculate net take-home salary from CTC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Net take-home = Gross Salary minus Employee PF minus Employee ESI minus Professional Tax minus TDS. Gross Salary is CTC minus employer contributions (employer PF, employer ESI, gratuity). For a ₹6 LPA CTC, net take-home is typically 70-80% of CTC.",
        },
      },
      {
        "@type": "Question",
        name: "What are the penalties for late PF and ESI payment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Late PF payment attracts 12% annual interest plus damages ranging from 5% to 100% of arrears depending on the delay. Late ESI payment attracts 12% annual interest. Both can also lead to prosecution of the employer under the respective Acts.",
        },
      },
    ],
  },
];

export default function PayrollProcessingGuide() {
  usePageTitle(
    "Payroll Processing in India 2026: Complete Guide for HR Managers",
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(SCHEMA);
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <article className="blog-article">
      <h1>Payroll Processing in India 2026: Complete Guide for HR Managers</h1>
      <p className="blog-meta">Published October 2026 · 12 min read</p>

      <section>
        <h2>Why Indian Payroll Processing Is Unique</h2>
        <p>
          Payroll in India is not just about depositing salaries into bank accounts. It involves
          a complex web of statutory deductions, compliance filings, tax calculations, and
          employee benefits that HR managers must navigate every single month. With multiple
          central and state-level regulations — from the Employees&apos; Provident Fund Act to
          state-specific Professional Tax rules — getting payroll right requires meticulous
          attention to detail.
        </p>
        <p>
          This guide walks you through the entire payroll processing lifecycle in India for 2026,
          covering everything from salary structure design to monthly compliance filings. Whether
          you manage payroll for a 10-person startup or a 500-employee enterprise, these steps
          remain fundamentally the same.
        </p>
      </section>

      <section>
        <h2>Step 1: Define Your Salary Structure</h2>
        <p>
          Before processing payroll, every organisation needs a well-defined salary structure.
          Indian salary structures typically break Cost to Company (CTC) into several components:
        </p>
        <ul>
          <li><strong>Basic Salary</strong> — Usually 40-50% of CTC. This is the foundation on which PF, gratuity, and HRA are calculated.</li>
          <li><strong>House Rent Allowance (HRA)</strong> — 40% of Basic for non-metro, 50% for metro cities. Partially exempt from tax if the employee pays rent.</li>
          <li><strong>Dearness Allowance (DA)</strong> — Inflation adjustment, more common in government and PSU structures.</li>
          <li><strong>Special Allowance</strong> — The balancing component after Basic, HRA, and other fixed allowances. Fully taxable.</li>
          <li><strong>Employer Contributions</strong> — Employer&apos;s share of PF (12% of Basic), ESI (3.25% of gross if applicable), and gratuity provision (4.81% of Basic).</li>
        </ul>
        <p>
          Need help designing a salary structure? Use our{" "}
          <Link to="/calculator">free salary calculator</Link> to build a compliant CTC
          breakdown in seconds.
        </p>
      </section>

      <section>
        <h2>Step 2: Collect Attendance and Leave Data</h2>
        <p>
          Accurate attendance tracking is the backbone of payroll accuracy. Before running
          payroll each month, HR must consolidate:
        </p>
        <ul>
          <li>Days worked, including half-days and overtime hours</li>
          <li>Leaves taken — categorised as earned leave, sick leave, or casual leave</li>
          <li>Loss of Pay (LOP) days — unpaid absence that directly reduces gross salary</li>
          <li>Holidays and weekly offs that fall within the pay period</li>
        </ul>
        <p>
          Most payroll errors originate from inaccurate attendance data. Aim to freeze attendance
          by the 25th of each month so salary calculations can begin promptly.
        </p>
      </section>

      <section>
        <h2>Step 3: Calculate Gross Salary</h2>
        <p>
          Gross salary is the total earnings before any deductions. For a full month:
        </p>
        <p>
          <strong>Gross Salary = Basic + HRA + DA + Special Allowance + Any Variable Pay</strong>
        </p>
        <p>
          If an employee has LOP days, prorate each component:
          Component for Month = (Component ÷ Total Working Days) × Days Worked.
          Variable pay, bonuses, and reimbursements are added on top if applicable for that
          month.
        </p>
      </section>

      <section>
        <h2>Step 4: Apply Statutory Deductions</h2>
        <p>
          This is where Indian payroll gets complex. Four mandatory deductions apply:
        </p>

        <h3>Employee Provident Fund (EPF)</h3>
        <p>
          Employee contributes 12% of Basic salary (capped at ₹15,000 Basic, so maximum
          ₹1,800/month). Employer matches with 12% — split as 3.67% to EPF and 8.33% to
          EPS (Pension Scheme). For a deeper breakdown, read our{" "}
          <Link to="/blog/epf-calculation-2026-employee-employer-contribution">
            EPF calculation guide
          </Link>.
        </p>

        <h3>Employee State Insurance (ESI)</h3>
        <p>
          Applicable only if the employee&apos;s gross wage is ₹21,000/month or less. Employee
          pays 0.75% and employer pays 3.25% of gross wages. Check eligibility using our{" "}
          <Link to="/checker">PF & ESI checker</Link>.
        </p>

        <h3>Professional Tax (PT)</h3>
        <p>
          A state-level tax with rates varying by state. Most states cap it at ₹200/month
          (₹2,400/year) or ₹2,500/year. Use our{" "}
          <Link to="/professional-tax">Professional Tax calculator</Link> to look up
          exact rates for each state, or read the{" "}
          <Link to="/blog/professional-tax-rates-2026-state-wise-slab-chart">
            state-wise PT slab chart
          </Link>.
        </p>

        <h3>Tax Deducted at Source (TDS)</h3>
        <p>
          Employers must deduct income tax from salary each month based on the employee&apos;s
          projected annual income. The employee chooses between the Old Tax Regime (with
          deductions under 80C, 80D, HRA exemption) and the New Tax Regime (lower rates,
          no deductions). TDS is deposited with the government by the 7th of the following month.
        </p>
      </section>

      <section>
        <h2>Step 5: Calculate Net Take-Home Pay</h2>
        <p>
          After deductions, the formula is straightforward:
        </p>
        <p>
          <strong>
            Net Salary = Gross Salary − Employee PF − Employee ESI − Professional Tax − TDS
          </strong>
        </p>
        <p>
          This is what gets credited to the employee&apos;s bank account. A CTC of ₹6,00,000
          per year typically yields a monthly net salary between ₹35,000 and ₹40,000 depending
          on the salary structure and tax regime. Try our{" "}
          <Link to="/calculator">salary calculator</Link> for an instant breakdown.
        </p>
      </section>

      <section>
        <h2>Step 6: Generate Payslips</h2>
        <p>
          Every employee is entitled to a monthly payslip that details their earnings and
          deductions. A compliant Indian payslip must include:
        </p>
        <ul>
          <li>Employee name, designation, and employee ID</li>
          <li>Pay period and number of working days</li>
          <li>Earnings breakdown (Basic, HRA, DA, Special Allowance)</li>
          <li>Deductions breakdown (PF, ESI, PT, TDS, LOP)</li>
          <li>Net pay and payment mode</li>
          <li>YTD (Year-to-Date) totals for earnings and deductions</li>
        </ul>
        <p>
          Generate professional payslips instantly with our{" "}
          <Link to="/payslip-generator">free payslip generator</Link>, or process an entire
          team with <Link to="/batch">batch payroll</Link>.
        </p>
      </section>

      <section>
        <h2>Step 7: Disburse Salaries</h2>
        <p>
          Most Indian companies process salary payments via NEFT or IMPS bank transfers.
          Best practice is to credit salaries by the last working day of the month. Maintain
          a salary register with transaction references for audit purposes.
        </p>
      </section>

      <section>
        <h2>Step 8: File Statutory Returns</h2>
        <p>
          After salary disbursement, the following compliance filings are due each month:
        </p>
        <ul>
          <li><strong>PF (ECR filing)</strong> — Due by the 15th of the following month via the EPFO unified portal</li>
          <li><strong>ESI challan</strong> — Due by the 15th of the following month via the ESIC portal</li>
          <li><strong>TDS deposit</strong> — Due by the 7th of the following month (Form 26AS)</li>
          <li><strong>Professional Tax</strong> — Monthly or half-yearly depending on state rules</li>
        </ul>
        <p>
          Missing these deadlines attracts interest, penalties, and in severe cases, prosecution.
          Learn more in our{" "}
          <Link to="/blog/pf-esi-compliance-guide-2026">PF & ESI compliance guide</Link>.
        </p>
      </section>

      <section>
        <h2>Common Payroll Processing Mistakes</h2>
        <p>
          Even experienced HR teams make these errors:
        </p>
        <ul>
          <li><strong>Incorrect PF calculation on variable pay</strong> — PF is calculated on Basic only, not on the full gross salary</li>
          <li><strong>Not updating tax declarations mid-year</strong> — Employees may submit updated investment proofs; TDS should be recalculated quarterly</li>
          <li><strong>Ignoring state-specific PT slabs</strong> — Professional Tax rates differ across states and change periodically</li>
          <li><strong>Skipping ESI for eligible employees</strong> — Failure to register eligible employees can result in backdated liability</li>
          <li><strong>Manual spreadsheet errors</strong> — Formula mistakes in Excel-based payroll compound month after month</li>
        </ul>
      </section>

      <section>
        <h2>Payroll Processing Checklist for HR Managers</h2>
        <p>
          Follow this monthly checklist to ensure nothing slips through:
        </p>
        <ul>
          <li>☐ Freeze attendance and leave records by the 25th</li>
          <li>☐ Verify any salary revisions, new joiners, or exits</li>
          <li>☐ Calculate gross salary with prorated components</li>
          <li>☐ Apply PF, ESI, PT, and TDS deductions</li>
          <li>☐ Generate and distribute payslips</li>
          <li>☐ Disburse salaries by the last working day</li>
          <li>☐ File PF ECR by the 15th of the next month</li>
          <li>☐ File ESI challan by the 15th of the next month</li>
          <li>☐ Deposit TDS by the 7th of the next month</li>
          <li>☐ File Professional Tax as per state schedule</li>
        </ul>
      </section>

      <section>
        <h2>Automate Your Payroll Processing</h2>
        <p>
          Manual payroll processing is error-prone and time-consuming. DoAide Payroll automates
          the entire workflow — from CTC structuring and{" "}
          <Link to="/calculator">salary calculation</Link> to{" "}
          <Link to="/payslip-generator">payslip generation</Link> and{" "}
          <Link to="/batch">batch processing</Link>. Check your{" "}
          <Link to="/checker">PF & ESI eligibility</Link>, look up{" "}
          <Link to="/professional-tax">Professional Tax rates</Link>, and download{" "}
          <Link to="/templates">ready-made payroll templates</Link> — all free.
        </p>
      </section>

      <section>
        <h2>Frequently Asked Questions</h2>

        <h3>What are the mandatory statutory deductions in Indian payroll?</h3>
        <p>
          Indian payroll must include Employee Provident Fund (EPF) at 12% of basic, Employee
          State Insurance (ESI) at 0.75% of gross wages (if gross ≤ ₹21,000/month), Professional
          Tax (varies by state, max ₹2,500/year), and Tax Deducted at Source (TDS) based on the
          applicable income tax slab.
        </p>

        <h3>What is the payroll processing cycle in India?</h3>
        <p>
          A typical Indian payroll cycle runs monthly: collect attendance by the 25th, process
          salary calculations by the 28th, disburse salaries by the last working day, file PF/ESI
          challans by the 15th of the following month, and deposit TDS by the 7th of the following
          month.
        </p>

        <h3>Is payroll software mandatory for Indian companies?</h3>
        <p>
          Payroll software is not legally mandatory, but it is strongly recommended for businesses
          with more than 10 employees. Manual processing increases the risk of calculation errors,
          missed compliance deadlines, and penalties from EPFO and ESIC.
        </p>

        <h3>How do I calculate net take-home salary from CTC?</h3>
        <p>
          Net take-home = Gross Salary minus Employee PF minus Employee ESI minus Professional
          Tax minus TDS. Gross Salary is CTC minus employer contributions (employer PF, employer
          ESI, gratuity). For a ₹6 LPA CTC, net take-home is typically 70-80% of CTC.
        </p>

        <h3>What are the penalties for late PF and ESI payment?</h3>
        <p>
          Late PF payment attracts 12% annual interest plus damages ranging from 5% to 100% of
          arrears depending on the delay. Late ESI payment attracts 12% annual interest. Both can
          also lead to prosecution of the employer under the respective Acts.
        </p>
      </section>
    </article>
  );
}
