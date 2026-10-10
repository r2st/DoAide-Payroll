import { Link } from "react-router-dom";
import { useEffect } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";

const SCHEMA = [
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Professional Tax Rates 2026: State-wise Slab Chart",
    description:
      "Complete state-wise Professional Tax slab chart for 2026 — monthly rates, annual limits, exemptions, and employer obligations for every Indian state and union territory.",
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
        "https://payroll.doaide.com/blog/professional-tax-rates-2026-state-wise-slab-chart",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Professional Tax in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Professional Tax (PT) is a state-level tax levied on salaried individuals, professionals, and traders. It is deducted by the employer from the employee's salary each month and deposited with the respective state government. The maximum Professional Tax that any state can levy is ₹2,500 per year, as per Article 276 of the Indian Constitution.",
        },
      },
      {
        "@type": "Question",
        name: "Which states levy Professional Tax in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "States that levy Professional Tax include Maharashtra, Karnataka, West Bengal, Andhra Pradesh, Telangana, Tamil Nadu, Kerala, Gujarat, Madhya Pradesh, Odisha, Assam, Meghalaya, Tripura, Bihar, Jharkhand, Chhattisgarh, Manipur, Mizoram, Nagaland, and Sikkim. States like Delhi, Haryana, Uttar Pradesh, Rajasthan, and Uttarakhand do not levy Professional Tax.",
        },
      },
      {
        "@type": "Question",
        name: "What is the maximum Professional Tax in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The maximum Professional Tax any state can levy is ₹2,500 per year, as mandated by Article 276 of the Indian Constitution. Most states that levy PT charge either ₹200/month (₹2,400/year) or a slab-based structure reaching up to ₹200-₹300/month for higher salary brackets.",
        },
      },
      {
        "@type": "Question",
        name: "Is Professional Tax deductible from income tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Professional Tax paid is fully deductible from taxable income under Section 16(iii) of the Income Tax Act. This deduction is available under both the Old Tax Regime and the New Tax Regime. The deduction is claimed in the year the tax is actually paid, not the year it is due.",
        },
      },
      {
        "@type": "Question",
        name: "Who is exempt from Professional Tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Exemptions vary by state, but common categories include: parents of children with permanent disability, members of the armed forces, persons with physical disability above 40%, badli workers in the textile industry, and individuals above 65 years of age. Women are exempt in some states. Check your specific state's rules for detailed exemption criteria.",
        },
      },
    ],
  },
];

export default function ProfessionalTaxGuide() {
  usePageTitle("Professional Tax Rates 2026: State-wise Slab Chart");

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(SCHEMA);
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <article className="blog-article">
      <h1>Professional Tax Rates 2026: State-wise Slab Chart</h1>
      <p className="blog-meta">Published October 2026 · 11 min read</p>

      <section>
        <h2>What Is Professional Tax?</h2>
        <p>
          Professional Tax (PT) is a state-level tax levied on salaried employees,
          self-employed professionals, and traders in India. Unlike income tax which is
          collected by the central government, Professional Tax is collected by individual
          state governments. The Constitution of India (Article 276) caps the maximum
          Professional Tax at ₹2,500 per year.
        </p>
        <p>
          For salaried employees, PT is deducted by the employer from the monthly salary and
          deposited with the state government. The employer is responsible for both deduction
          and timely remittance. Failure to deduct or deposit PT can result in penalties and
          interest for the employer.
        </p>
      </section>

      <section>
        <h2>States That Levy Professional Tax</h2>
        <p>
          Not all Indian states impose Professional Tax. Here is the current status for 2026:
        </p>

        <h3>States WITH Professional Tax</h3>
        <ul>
          <li>Maharashtra</li>
          <li>Karnataka</li>
          <li>West Bengal</li>
          <li>Andhra Pradesh</li>
          <li>Telangana</li>
          <li>Tamil Nadu</li>
          <li>Kerala</li>
          <li>Gujarat</li>
          <li>Madhya Pradesh</li>
          <li>Odisha</li>
          <li>Assam</li>
          <li>Meghalaya</li>
          <li>Tripura</li>
          <li>Bihar</li>
          <li>Jharkhand</li>
          <li>Chhattisgarh</li>
          <li>Manipur</li>
          <li>Mizoram</li>
          <li>Nagaland</li>
          <li>Sikkim</li>
        </ul>

        <h3>States WITHOUT Professional Tax</h3>
        <ul>
          <li>Delhi</li>
          <li>Haryana</li>
          <li>Uttar Pradesh</li>
          <li>Rajasthan</li>
          <li>Uttarakhand</li>
          <li>Himachal Pradesh</li>
          <li>Punjab</li>
          <li>Jammu & Kashmir</li>
          <li>Goa</li>
          <li>Chandigarh and other Union Territories (except Puducherry)</li>
        </ul>
        <p>
          If your employees work across multiple states, you must deduct PT based on the state
          where each employee works, not where the company is registered. Use our{" "}
          <Link to="/professional-tax">Professional Tax calculator</Link> to look up the
          exact slab for any state instantly.
        </p>
      </section>

      <section>
        <h2>State-wise Professional Tax Slab Chart 2026</h2>
        <p>
          Below are the monthly PT slabs for the major states. Rates are per month unless
          otherwise noted.
        </p>

        <h3>Maharashtra</h3>
        <ul>
          <li>Up to ₹7,500/month: Nil</li>
          <li>₹7,501 to ₹10,000: ₹175/month</li>
          <li>Above ₹10,000: ₹200/month (₹300 in February to reach ₹2,500/year)</li>
        </ul>

        <h3>Karnataka</h3>
        <ul>
          <li>Up to ₹15,000/month: Nil</li>
          <li>₹15,001 to ₹25,000: ₹200/month</li>
          <li>Above ₹25,000: ₹200/month</li>
        </ul>

        <h3>West Bengal</h3>
        <ul>
          <li>Up to ₹10,000/month: Nil</li>
          <li>₹10,001 to ₹15,000: ₹110/month</li>
          <li>₹15,001 to ₹25,000: ₹130/month</li>
          <li>₹25,001 to ₹40,000: ₹150/month</li>
          <li>Above ₹40,000: ₹200/month</li>
        </ul>

        <h3>Andhra Pradesh</h3>
        <ul>
          <li>Up to ₹15,000/month: Nil</li>
          <li>₹15,001 to ₹20,000: ₹150/month</li>
          <li>Above ₹20,000: ₹200/month</li>
        </ul>

        <h3>Telangana</h3>
        <ul>
          <li>Up to ₹15,000/month: Nil</li>
          <li>₹15,001 to ₹20,000: ₹150/month</li>
          <li>Above ₹20,000: ₹200/month</li>
        </ul>

        <h3>Tamil Nadu</h3>
        <ul>
          <li>Up to ₹21,000/half-year: Nil</li>
          <li>₹21,001 to ₹30,000: ₹135/half-year</li>
          <li>₹30,001 to ₹45,000: ₹315/half-year</li>
          <li>₹45,001 to ₹60,000: ₹690/half-year</li>
          <li>₹60,001 to ₹75,000: ₹1,025/half-year</li>
          <li>Above ₹75,000: ₹1,250/half-year</li>
        </ul>

        <h3>Kerala</h3>
        <ul>
          <li>Up to ₹11,999/month: Nil</li>
          <li>₹12,000 to ₹17,999: ₹120/month</li>
          <li>₹18,000 to ₹24,999: ₹180/month</li>
          <li>₹25,000 to ₹29,999: ₹200/month</li>
          <li>Above ₹30,000: ₹208/month (₹2,500/year)</li>
        </ul>

        <h3>Gujarat</h3>
        <ul>
          <li>Up to ₹5,999/month: Nil</li>
          <li>₹6,000 to ₹8,999: ₹80/month</li>
          <li>₹9,000 to ₹11,999: ₹150/month</li>
          <li>Above ₹12,000: ₹200/month</li>
        </ul>

        <h3>Madhya Pradesh</h3>
        <ul>
          <li>Up to ₹18,750/month: Nil</li>
          <li>₹18,751 to ₹25,000: ₹125/month</li>
          <li>Above ₹25,000: ₹208/month (₹2,500/year)</li>
        </ul>

        <h3>Odisha</h3>
        <ul>
          <li>Up to ₹16,000/month: Nil</li>
          <li>₹16,001 to ₹25,000: ₹150/month</li>
          <li>Above ₹25,000: ₹200/month</li>
        </ul>
      </section>

      <section>
        <h2>How Professional Tax Is Calculated</h2>
        <p>
          PT is calculated based on the employee&apos;s gross monthly salary (before any deductions).
          The employer determines which slab the employee falls into based on the state where the
          employee works and deducts the applicable amount.
        </p>
        <p>
          For example, an employee working in Maharashtra with a gross salary of ₹50,000/month
          would have ₹200 deducted as PT in most months, and ₹300 in February — totalling
          ₹2,500 for the year. An employee in Delhi with the same salary pays zero PT, as Delhi
          does not levy this tax.
        </p>
        <p>
          Calculate the exact PT for any salary and state using our{" "}
          <Link to="/professional-tax">Professional Tax calculator</Link>.
        </p>
      </section>

      <section>
        <h2>Professional Tax Exemptions</h2>
        <p>
          While exemptions vary by state, some common categories of exemption include:
        </p>
        <ul>
          <li>Parents or guardians of children with permanent disability or mental disability</li>
          <li>Members of the armed forces (Army, Navy, Air Force) — as they are governed by central law</li>
          <li>Persons with physical disability of 40% or above (certified by a medical board)</li>
          <li>Badli workers in the textile industry (in some states like Maharashtra)</li>
          <li>Senior citizens above 65 years of age (in some states)</li>
          <li>Women employees (in some states like Madhya Pradesh for certain salary slabs)</li>
        </ul>
        <p>
          Always check the specific exemption rules for the state in question, as criteria and
          documentation requirements differ.
        </p>
      </section>

      <section>
        <h2>Employer Obligations for Professional Tax</h2>
        <p>
          As an employer, you are responsible for:
        </p>
        <ul>
          <li><strong>Registration</strong> — Register with the state&apos;s PT authority within 30 days of becoming liable (varies by state)</li>
          <li><strong>Deduction</strong> — Deduct PT from each employee&apos;s salary every month based on the applicable slab</li>
          <li><strong>Remittance</strong> — Deposit the deducted PT with the state government by the due date (typically by the 15th or end of the following month)</li>
          <li><strong>Returns</strong> — File PT returns monthly, quarterly, or annually depending on state rules</li>
          <li><strong>Records</strong> — Maintain records of all PT deductions and remittances for inspection</li>
        </ul>
      </section>

      <section>
        <h2>PT Filing Due Dates by State</h2>
        <ul>
          <li><strong>Maharashtra</strong>: Monthly by the last day of the following month</li>
          <li><strong>Karnataka</strong>: Monthly by the 20th of the following month</li>
          <li><strong>West Bengal</strong>: Monthly by the 21st of the following month</li>
          <li><strong>Tamil Nadu</strong>: Half-yearly by 30th September and 31st March</li>
          <li><strong>Gujarat</strong>: Monthly by the 15th of the following month</li>
          <li><strong>Andhra Pradesh / Telangana</strong>: Monthly by the 10th of the following month</li>
          <li><strong>Kerala</strong>: Half-yearly within 15 days of the end of the half-year</li>
        </ul>
      </section>

      <section>
        <h2>Penalties for Non-Compliance</h2>
        <p>
          Failing to deduct, deposit, or file PT returns can attract:
        </p>
        <ul>
          <li><strong>Interest on late payment</strong>: Typically 1-2% per month on the outstanding amount</li>
          <li><strong>Penalty for late filing</strong>: Fixed penalties ranging from ₹1,000 to ₹10,000 depending on the state</li>
          <li><strong>Prosecution</strong>: In cases of persistent non-compliance, employers can face prosecution under the state PT Act</li>
          <li><strong>Denial of IT deduction</strong>: If PT is not actually paid, the Section 16(iii) deduction is denied for the employee</li>
        </ul>
      </section>

      <section>
        <h2>Professional Tax and Income Tax Deduction</h2>
        <p>
          Professional Tax paid during the financial year is fully deductible from taxable income
          under Section 16(iii) of the Income Tax Act. This deduction is available under both the
          Old Tax Regime and the New Tax Regime. Key points:
        </p>
        <ul>
          <li>The deduction is claimed in the year the tax is actually paid, not the year it accrues</li>
          <li>If your employer deducts PT but fails to deposit it with the state, you may still claim the deduction (but the employer faces penalties)</li>
          <li>Self-employed individuals can claim PT as a business expense under Section 37</li>
          <li>PT paid in one state but working in another — deduction is based on PT actually paid, regardless of state</li>
        </ul>
      </section>

      <section>
        <h2>Multi-State Payroll and Professional Tax</h2>
        <p>
          Companies with employees across multiple states face the additional complexity of
          applying different PT slabs based on each employee&apos;s work location. Important
          considerations:
        </p>
        <ul>
          <li>PT is determined by the state where the employee works, not the company&apos;s registered state</li>
          <li>Remote employees are generally taxed based on their primary work location</li>
          <li>Employees transferring between states mid-year need PT recalculation from the transfer date</li>
          <li>The employer must register separately in each state where employees are located</li>
        </ul>
        <p>
          This is where payroll software becomes essential. DoAide Payroll automatically applies
          the correct PT slab based on each employee&apos;s state, so you never have to look up
          slabs manually.
        </p>
      </section>

      <section>
        <h2>Look Up Your Professional Tax</h2>
        <p>
          Use our free <Link to="/professional-tax">Professional Tax calculator</Link> to
          instantly look up the PT slab for any state and salary. For a complete picture of all
          payroll deductions including PF, ESI, PT, and TDS, try our{" "}
          <Link to="/calculator">salary calculator</Link>. Read the{" "}
          <Link to="/blog/payroll-processing-india-2026-guide">
            complete payroll processing guide
          </Link>{" "}
          to understand how PT fits into the broader payroll workflow.
        </p>
      </section>

      <section>
        <h2>Frequently Asked Questions</h2>

        <h3>What is Professional Tax in India?</h3>
        <p>
          Professional Tax (PT) is a state-level tax levied on salaried individuals, professionals,
          and traders. It is deducted by the employer from the employee&apos;s salary each month and
          deposited with the respective state government. The maximum Professional Tax that any
          state can levy is ₹2,500 per year, as per Article 276 of the Indian Constitution.
        </p>

        <h3>Which states levy Professional Tax in India?</h3>
        <p>
          States that levy Professional Tax include Maharashtra, Karnataka, West Bengal, Andhra
          Pradesh, Telangana, Tamil Nadu, Kerala, Gujarat, Madhya Pradesh, Odisha, Assam,
          Meghalaya, Tripura, Bihar, Jharkhand, Chhattisgarh, Manipur, Mizoram, Nagaland, and
          Sikkim. States like Delhi, Haryana, Uttar Pradesh, Rajasthan, and Uttarakhand do not
          levy Professional Tax.
        </p>

        <h3>What is the maximum Professional Tax in India?</h3>
        <p>
          The maximum Professional Tax any state can levy is ₹2,500 per year, as mandated by
          Article 276 of the Indian Constitution. Most states that levy PT charge either
          ₹200/month (₹2,400/year) or a slab-based structure reaching up to ₹200-₹300/month
          for higher salary brackets.
        </p>

        <h3>Is Professional Tax deductible from income tax?</h3>
        <p>
          Yes, Professional Tax paid is fully deductible from taxable income under Section 16(iii)
          of the Income Tax Act. This deduction is available under both the Old Tax Regime and the
          New Tax Regime. The deduction is claimed in the year the tax is actually paid, not the
          year it is due.
        </p>

        <h3>Who is exempt from Professional Tax?</h3>
        <p>
          Exemptions vary by state, but common categories include: parents of children with
          permanent disability, members of the armed forces, persons with physical disability
          above 40%, badli workers in the textile industry, and individuals above 65 years of age.
          Women are exempt in some states. Check your specific state&apos;s rules for detailed
          exemption criteria.
        </p>
      </section>
    </article>
  );
}
