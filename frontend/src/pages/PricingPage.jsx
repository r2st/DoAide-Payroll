import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

const PLANS = [
  { name: "Free", price: "₹0", employees: "10", features: ["Basic payroll", "Payslip PDF", "PF/ESI/TDS calculations", "Email support"] },
  { name: "Starter", price: "₹999", employees: "100", features: ["Everything in Free", "Leave management", "Attendance tracking", "Monthly reports", "Priority support"], highlight: true },
  { name: "Pro", price: "₹2,499", employees: "Unlimited", features: ["Everything in Starter", "Bulk payroll processing", "API access", "Custom reports", "Compliance filings", "Dedicated support"] },
];

export default function PricingPage() {
  usePageTitle("Pricing");
  return (
    <div className="page">
      <div className="page-header text-center"><h1>Simple, Transparent Pricing</h1><p className="text-muted">Choose the plan that fits your business</p></div>
      <div className="pricing-grid">
        {PLANS.map((p) => (
          <div key={p.name} className={`pricing-card ${p.highlight ? "pricing-highlight" : ""}`}>
            <h3>{p.name}</h3>
            <div className="pricing-amount">
              <span className="pricing-price">{p.price}</span>
              <span className="pricing-period">/month</span>
            </div>
            <p className="pricing-employees">{p.employees} employees</p>
            <ul className="pricing-features">
              {p.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <Link to="/auth" className={`btn ${p.highlight ? "btn-primary" : "btn-secondary"} w-full`}>
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
