import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

const FEATURES = [
  { title: "Employee Management", desc: "Complete employee records with PAN, bank details, UAN, and ESI tracking.", icon: "👥" },
  { title: "Auto Salary Computation", desc: "Basic, HRA, DA, special allowances calculated automatically with proration.", icon: "🧮" },
  { title: "PF/ESI/TDS Compliance", desc: "Indian statutory deductions computed per latest rules and slab rates.", icon: "🏛️" },
  { title: "Payslip Generation", desc: "Professional PDF payslips with full earnings and deductions breakdown.", icon: "📄" },
  { title: "Leave Management", desc: "Casual, sick, earned leave tracking with balance management.", icon: "🗓️" },
  { title: "Reports & Analytics", desc: "Monthly, quarterly payroll reports with department breakdowns.", icon: "📊" },
];

const PLANS = [
  { name: "Free", price: "₹0", period: "/mo", employees: "Up to 10 employees", features: ["Basic payroll", "Payslip PDF", "PF/ESI/TDS", "Email support"] },
  { name: "Starter", price: "₹999", period: "/mo", employees: "Up to 100 employees", features: ["Everything in Free", "Leave management", "Attendance tracking", "Reports", "Priority support"], highlight: true },
  { name: "Pro", price: "₹2,499", period: "/mo", employees: "Unlimited employees", features: ["Everything in Starter", "Bulk processing", "API access", "Custom reports", "Dedicated support"] },
];

export default function LandingPage() {
  usePageTitle(null);
  return (
    <div className="landing">
      <section className="landing-hero">
        <h1>Indian Payroll,<br /><span className="text-brand">Made Simple.</span></h1>
        <p className="landing-subtitle">
          Automated salary computation, PF/ESI/TDS compliance, and payslip generation
          for Indian SMBs. Get started in minutes.
        </p>
        <div className="landing-cta">
          <Link to="/auth" className="btn btn-primary btn-lg">Get Started Free</Link>
          <Link to="/pricing" className="btn btn-secondary btn-lg">View Pricing</Link>
        </div>
      </section>

      <section className="landing-features">
        <h2>Everything You Need</h2>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-pricing" id="pricing">
        <h2>Simple, Transparent Pricing</h2>
        <div className="pricing-grid">
          {PLANS.map((p) => (
            <div key={p.name} className={`pricing-card ${p.highlight ? "pricing-highlight" : ""}`}>
              <h3>{p.name}</h3>
              <div className="pricing-amount">
                <span className="pricing-price">{p.price}</span>
                <span className="pricing-period">{p.period}</span>
              </div>
              <p className="pricing-employees">{p.employees}</p>
              <ul className="pricing-features">
                {p.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <Link to="/auth" className={`btn ${p.highlight ? "btn-primary" : "btn-secondary"} w-full`}>
                {p.name === "Free" ? "Start Free" : "Get Started"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <p>DoAide Payroll — Built for Indian businesses.</p>
      </footer>
    </div>
  );
}
