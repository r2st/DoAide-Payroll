import { Link } from "react-router-dom";
import { useEffect } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";

const SCHEMA = [
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline:
      "EPF Calculation 2026: Employee and Employer Contribution Explained",
    description:
      "Learn how EPF contributions are calculated for both employee and employer in India — contribution rates, wage ceiling, EPS split, and monthly examples.",
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
      "@id":
        "https://payroll.doaide.com/blog/epf-calculation-2026-employee-employer-contribution",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the EPF contribution rate for employees in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Employees contribute 12% of their Basic salary plus Dearness Allowance (DA) to EPF. This is capped at a Basic+DA of ₹15,000/month, making the maximum mandatory employee contribution ₹1,800/month. Employees can voluntarily contribute more through Voluntary Provident Fund (VPF).",
        },
      },
      {
        "@type": "Question",
        name: "How is the employer's EPF contribution split between EPF and EPS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The employer also contributes 12% of Basic+DA, but this is split: 3.67% goes to the EPF account and 8.33% goes to the Employee Pension Scheme (EPS). The EPS contribution is capped at ₹15,000 Basic, meaning a maximum of ₹1,250/month to EPS. If Basic exceeds ₹15,000, the excess employer contribution goes entirely to EPF.",
        },
      },
      {
        "@type": "Question",
        name: "What is the EPF wage ceiling in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The statutory wage ceiling for EPF is ₹15,000/month (Basic + DA). Contributions are mandatory up to this ceiling. Employees earning above this can opt for contributions on their actual Basic salary, but the employer is only legally required to contribute on ₹15,000.",
        },
      },
      {
        "@type": "Question",
        name: "What is the current EPF interest rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The EPF interest rate for FY 2025-26 is 8.25% per annum, as declared by the EPFO. Interest is calculated monthly but credited annually. The rate is reviewed each year by the Central Board of Trustees.",
        },
      },
      {
        "@type": "Question",
        name: "Can I withdraw my EPF balance before retirement?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Partial EPF withdrawal is allowed for specific purposes: housing (after 5 years of service), medical emergencies, marriage, education, and pre-retirement (after age 54 or within 1 year of retirement). Full withdrawal is permitted after 2 months of unemployment or at age 58. Early withdrawal before 5 years of continuous service attracts TDS at 10% if PAN is provided.",
        },
      },
    ],
  },
];

export default function EpfCalculationGuide() {
  usePageTitle(
    "EPF Calculation 2026: Employee and Employer Contribution Explained",
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
      <h1>
        EPF Calculation 2026: Employee and Employer Contribution Explained
      </h1>
      <p className="blog-meta">Published October 2026 · 10 min read</p>

      <section>
        <h2>What Is the Employees&apos; Provident Fund (EPF)?</h2>
        <p>
          The Employees&apos; Provident Fund is India&apos;s largest retirement savings scheme,
          managed by the Employees&apos; Provident Fund Organisation (EPFO). Under the EPF &
          Miscellaneous Provisions Act, 1952, both employee and employer contribute a percentage
          of the employee&apos;s salary each month into a dedicated PF account. The accumulated
          corpus earns interest and is available for withdrawal upon retirement, resignation,
          or specific life events.
        </p>
        <p>
          EPF is mandatory for all establishments with 20 or more employees. Once an establishment
          is registered, it cannot de-register even if the headcount drops below 20. Smaller
          companies can register voluntarily.
        </p>
      </section>

      <section>
        <h2>EPF Contribution Rates for 2026</h2>
        <p>
          Both employee and employer contribute 12% of the employee&apos;s Basic salary plus
          Dearness Allowance (DA). Here is how each contribution breaks down:
        </p>

        <h3>Employee Contribution — 12%</h3>
        <p>
          The entire 12% of the employee&apos;s contribution goes into the EPF account. This is
          deducted from the employee&apos;s gross salary each month. The contribution is calculated
          on Basic + DA, capped at ₹15,000/month.
        </p>
        <ul>
          <li>Contribution rate: 12% of (Basic + DA)</li>
          <li>Maximum mandatory contribution: ₹1,800/month (12% of ₹15,000)</li>
          <li>Employees can contribute more voluntarily through VPF</li>
        </ul>

        <h3>Employer Contribution — 12% (Split)</h3>
        <p>
          The employer also contributes 12% of Basic + DA, but the amount is split between two
          schemes:
        </p>
        <ul>
          <li><strong>3.67%</strong> → Employee Provident Fund (EPF) — goes into the employee&apos;s PF account</li>
          <li><strong>8.33%</strong> → Employee Pension Scheme (EPS) — goes into the pension fund (capped at ₹15,000 Basic)</li>
        </ul>
        <p>
          If an employee&apos;s Basic + DA exceeds ₹15,000, the EPS contribution remains at ₹1,250/month
          (8.33% of ₹15,000), and the remaining employer contribution goes entirely to EPF.
        </p>

        <h3>Additional Employer Charges</h3>
        <ul>
          <li>EDLI (Employees&apos; Deposit Linked Insurance): 0.50% of Basic + DA (capped at ₹15,000)</li>
          <li>EPF admin charges: 0.50% of Basic + DA (minimum ₹75/month if PF payable)</li>
          <li>EDLI admin charges: Nil (waived since 2018)</li>
        </ul>
      </section>

      <section>
        <h2>EPF Calculation Example</h2>
        <p>
          Let&apos;s calculate EPF for an employee with a Basic salary of ₹25,000/month:
        </p>

        <h3>Scenario: Basic Salary = ₹25,000/month</h3>
        <ul>
          <li><strong>Employee PF</strong>: 12% of ₹15,000 = <strong>₹1,800/month</strong> (capped at statutory ceiling)</li>
          <li><strong>Employer PF (EPF portion)</strong>: 12% of ₹15,000 − EPS = ₹1,800 − ₹1,250 = <strong>₹550/month</strong></li>
          <li><strong>Employer EPS</strong>: 8.33% of ₹15,000 = <strong>₹1,250/month</strong></li>
          <li><strong>Total to employee&apos;s EPF account</strong>: ₹1,800 + ₹550 = <strong>₹2,350/month</strong></li>
        </ul>
        <p>
          Note: Many companies contribute on actual Basic (not just the ₹15,000 ceiling) as an
          enhanced benefit. In that case, the employee would contribute ₹3,000 (12% of ₹25,000)
          and the employer&apos;s EPF portion would be correspondingly higher. Check your company&apos;s
          policy.
        </p>

        <h3>Scenario: Basic Salary = ₹12,000/month (Below Ceiling)</h3>
        <ul>
          <li><strong>Employee PF</strong>: 12% of ₹12,000 = <strong>₹1,440/month</strong></li>
          <li><strong>Employer EPS</strong>: 8.33% of ₹12,000 = <strong>₹1,000/month</strong></li>
          <li><strong>Employer EPF</strong>: ₹1,440 − ₹1,000 = <strong>₹440/month</strong></li>
          <li><strong>Total to employee&apos;s EPF account</strong>: ₹1,440 + ₹440 = <strong>₹1,880/month</strong></li>
        </ul>

        <p>
          Use our <Link to="/calculator">salary calculator</Link> to see the exact PF
          breakdown for any salary.
        </p>
      </section>

      <section>
        <h2>EPF Wage Ceiling — ₹15,000 Explained</h2>
        <p>
          The statutory wage ceiling for EPF is ₹15,000/month (Basic + DA). This means:
        </p>
        <ul>
          <li>Employers are legally required to contribute PF only on the first ₹15,000 of Basic + DA</li>
          <li>Many employers voluntarily contribute on the full Basic as a benefit</li>
          <li>Employees earning above ₹15,000 Basic can opt out of EPF (but this is rare in practice)</li>
          <li>The ceiling has not been revised since 2014 — a revision is expected but has not been announced for 2026</li>
        </ul>
      </section>

      <section>
        <h2>EPF Interest Rate for 2025-26</h2>
        <p>
          The EPFO has declared an interest rate of <strong>8.25% per annum</strong> for
          FY 2025-26. Key points:
        </p>
        <ul>
          <li>Interest is calculated on the monthly running balance</li>
          <li>Interest is credited to the account at the end of the financial year</li>
          <li>Interest on contributions above ₹2.5 lakh/year is taxable (for employees not contributing to EPS)</li>
          <li>The rate is reviewed annually by the Central Board of Trustees</li>
        </ul>
      </section>

      <section>
        <h2>Employee Pension Scheme (EPS) — How It Works</h2>
        <p>
          The EPS is a defined-benefit pension scheme funded by redirecting 8.33% of the
          employer&apos;s PF contribution. Key eligibility and benefit rules:
        </p>
        <ul>
          <li>Minimum 10 years of service required to qualify for pension</li>
          <li>Pension starts at age 58 (early pension available from age 50 at reduced rates)</li>
          <li>Monthly pension = (Pensionable Salary × Years of Service) ÷ 70</li>
          <li>Pensionable salary = Average of last 60 months of Basic + DA (capped at ₹15,000)</li>
          <li>Maximum monthly pension under the current ceiling: approximately ₹7,500/month</li>
        </ul>
      </section>

      <section>
        <h2>Voluntary Provident Fund (VPF)</h2>
        <p>
          Employees can contribute more than the mandatory 12% of Basic to their PF account
          through VPF. The additional contribution:
        </p>
        <ul>
          <li>Earns the same interest rate as EPF (8.25% for 2025-26)</li>
          <li>Is eligible for Section 80C deduction (up to ₹1.5 lakh combined limit)</li>
          <li>Has no upper limit on contribution percentage (up to 100% of Basic)</li>
          <li>Does not attract any matching employer contribution</li>
        </ul>
      </section>

      <section>
        <h2>EPF Withdrawal Rules</h2>
        <p>
          Partial withdrawal is allowed for specific purposes:
        </p>
        <ul>
          <li><strong>Housing</strong> — Up to 90% of balance after 5 years of service</li>
          <li><strong>Medical emergency</strong> — Up to 6 months&apos; Basic, no service requirement</li>
          <li><strong>Marriage/Education</strong> — Up to 50% of employee&apos;s share after 7 years</li>
          <li><strong>Pre-retirement</strong> — Up to 90% after age 54 or within 1 year of retirement</li>
        </ul>
        <p>
          Full withdrawal is allowed after 2 months of unemployment or at age 58. Withdrawals
          before 5 years of continuous service attract TDS at 10% (with PAN) or 30% (without PAN).
        </p>
      </section>

      <section>
        <h2>EPF Compliance for Employers</h2>
        <p>
          Employers must file monthly Electronic Challan cum Return (ECR) on the EPFO unified
          portal by the 15th of the following month. Key compliance requirements:
        </p>
        <ul>
          <li>Register on the EPFO unified portal with the establishment code</li>
          <li>Generate and upload monthly ECR with employee-wise contribution details</li>
          <li>Pay contributions online via approved banks</li>
          <li>File annual returns (Form 3A and 6A) by 25th April</li>
          <li>Maintain records of all contributions for inspection</li>
        </ul>
        <p>
          Late payment penalties include 12% annual interest and damages up to 100% of arrears.
          Read our complete{" "}
          <Link to="/blog/pf-esi-compliance-guide-2026">PF & ESI compliance guide</Link>{" "}
          for filing deadlines and penalty details.
        </p>
      </section>

      <section>
        <h2>EPF vs NPS vs PPF — Quick Comparison</h2>
        <ul>
          <li><strong>EPF</strong>: Mandatory for salaried employees, guaranteed 8.25% interest, employer matches contribution</li>
          <li><strong>NPS</strong>: Voluntary, market-linked returns (typically 9-12%), additional ₹50,000 tax deduction under 80CCD(1B)</li>
          <li><strong>PPF</strong>: Voluntary, government-backed 7.1% interest, 15-year lock-in, ₹1.5 lakh annual cap</li>
        </ul>
        <p>
          For most salaried employees, EPF is the primary retirement vehicle. NPS offers higher
          potential returns with market risk, while PPF provides guaranteed but lower returns
          with longer lock-in.
        </p>
      </section>

      <section>
        <h2>Calculate Your EPF Contribution</h2>
        <p>
          Use our free <Link to="/calculator">salary calculator</Link> to instantly see
          your EPF contribution breakdown, EPS allocation, and net take-home after all
          deductions. Check if your establishment needs PF registration with our{" "}
          <Link to="/checker">PF & ESI eligibility checker</Link>.
        </p>
      </section>

      <section>
        <h2>Frequently Asked Questions</h2>

        <h3>What is the EPF contribution rate for employees in 2026?</h3>
        <p>
          Employees contribute 12% of their Basic salary plus Dearness Allowance (DA) to EPF.
          This is capped at a Basic+DA of ₹15,000/month, making the maximum mandatory employee
          contribution ₹1,800/month. Employees can voluntarily contribute more through VPF.
        </p>

        <h3>
          How is the employer&apos;s EPF contribution split between EPF and EPS?
        </h3>
        <p>
          The employer also contributes 12% of Basic+DA, but this is split: 3.67% goes to the
          EPF account and 8.33% goes to the Employee Pension Scheme (EPS). The EPS contribution
          is capped at ₹15,000 Basic, meaning a maximum of ₹1,250/month to EPS. If Basic exceeds
          ₹15,000, the excess employer contribution goes entirely to EPF.
        </p>

        <h3>What is the EPF wage ceiling in 2026?</h3>
        <p>
          The statutory wage ceiling for EPF is ₹15,000/month (Basic + DA). Contributions are
          mandatory up to this ceiling. Employees earning above this can opt for contributions on
          their actual Basic salary, but the employer is only legally required to contribute on
          ₹15,000.
        </p>

        <h3>What is the current EPF interest rate?</h3>
        <p>
          The EPF interest rate for FY 2025-26 is 8.25% per annum, as declared by the EPFO.
          Interest is calculated monthly but credited annually. The rate is reviewed each year
          by the Central Board of Trustees.
        </p>

        <h3>Can I withdraw my EPF balance before retirement?</h3>
        <p>
          Partial EPF withdrawal is allowed for specific purposes: housing (after 5 years of
          service), medical emergencies, marriage, education, and pre-retirement (after age 54 or
          within 1 year of retirement). Full withdrawal is permitted after 2 months of unemployment
          or at age 58. Early withdrawal before 5 years of continuous service attracts TDS at 10%
          if PAN is provided.
        </p>
      </section>
    </article>
  );
}
