import { Link, Outlet } from "react-router-dom";

const ARTICLES = [
  {
    slug: "salary-structure-india-ctc-explained",
    title: "CTC, Gross, Net Salary — Indian Salary Structure Explained",
    description: "Understand the difference between CTC, gross salary, and net take-home pay. Learn how basic, HRA, PF, ESI, and TDS affect your paycheck.",
  },
  {
    slug: "pf-esi-compliance-guide-2026",
    title: "PF & ESI Compliance Guide for Indian Employers 2026",
    description: "Complete guide to Provident Fund and ESI registration, contribution rates, filing deadlines, and penalties for Indian businesses.",
  },
  {
    slug: "payslip-format-india-what-to-include",
    title: "What to Include in a Payslip — Indian Payslip Format Guide",
    description: "Legal requirements for payslips in India, mandatory components, and best practices for professional salary statements.",
  },
];

export { ARTICLES };

export default function BlogLayout() {
  return (
    <div className="blog-layout">
      <header className="blog-header">
        <Link to="/" className="blog-home-link">&larr; Back to DoAide Payroll</Link>
        <h1 className="blog-title">DoAide Payroll Blog</h1>
        <p className="blog-subtitle">Guides and resources for Indian payroll and compliance</p>
      </header>
      <Outlet />
    </div>
  );
}

export function BlogIndex() {
  return (
    <div className="blog-index">
      {ARTICLES.map((a) => (
        <Link key={a.slug} to={`/blog/${a.slug}`} className="blog-card">
          <h2>{a.title}</h2>
          <p>{a.description}</p>
          <span className="blog-read-more">Read more &rarr;</span>
        </Link>
      ))}
    </div>
  );
}
