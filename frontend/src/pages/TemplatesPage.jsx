import { useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { copyToClipboard } from "../lib/share";
import { track } from "../lib/track";

const TEMPLATES = [
  {
    key: "standard",
    name: "Standard Payslip",
    desc: "Basic payslip with earnings, deductions, and net pay. Suitable for most salaried employees.",
    columns: ["Employee Name", "Employee ID", "Basic", "HRA", "Conveyance", "PF", "ESI", "TDS", "Net Pay"],
  },
  {
    key: "detailed",
    name: "Detailed Payslip",
    desc: "Comprehensive payslip with all allowances, deductions, YTD totals, and tax computation.",
    columns: ["Name", "PAN", "Basic", "HRA", "DA", "Special Allowance", "Medical", "LTA", "PF", "ESI", "PT", "TDS", "Gross", "Total Deductions", "Net Pay", "YTD Gross", "YTD Tax"],
  },
  {
    key: "ctc",
    name: "CTC Breakdown",
    desc: "Full CTC structure showing employee cost and employer contributions side by side.",
    columns: ["Component", "Monthly", "Annual", "Basic", "HRA", "Special Allowance", "Employer PF", "Employer ESI", "Gratuity", "Total CTC", "Net Take-Home"],
  },
  {
    key: "contractor",
    name: "Contractor Payment",
    desc: "Payment slip for independent contractors with invoice reference and TDS at 10%.",
    columns: ["Contractor Name", "PAN", "Invoice No", "Invoice Date", "Gross Amount", "TDS (10%)", "Net Payable", "Payment Date", "UTR/Reference"],
  },
  {
    key: "intern",
    name: "Intern Stipend",
    desc: "Simplified stipend slip for interns with basic details and no statutory deductions.",
    columns: ["Intern Name", "Department", "Stipend Period", "Monthly Stipend", "Days Worked", "Pro-rated Amount", "TDS (if applicable)", "Net Payable"],
  },
  {
    key: "freelancer",
    name: "Freelancer Invoice",
    desc: "Payment record for freelancers with project details, GST, and TDS deduction.",
    columns: ["Freelancer Name", "PAN", "GSTIN", "Project", "Gross Fee", "GST (18%)", "Total Invoice", "TDS (10%)", "Net Payable"],
  },
];

export default function TemplatesPage() {
  usePageTitle("Free Payslip Templates — Download Professional Payslip Formats");
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = async (template) => {
    const csv = template.columns.join(",");
    const ok = await copyToClipboard(csv);
    if (ok) {
      track("template_copy", { template: template.key });
      setCopiedKey(template.key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Payslip Templates</h1>
          <p className="tool-subtitle">
            Free professional payslip templates for Indian businesses. Copy the column headers and customize for your needs.
          </p>

          <div className="template-grid">
            {TEMPLATES.map((t) => (
              <div key={t.key} className="template-card">
                <h3>{t.name}</h3>
                <p>{t.desc}</p>
                <div className="template-preview">
                  {t.columns.slice(0, 5).map((col) => (
                    <span key={col} className="template-col">{col}</span>
                  ))}
                  {t.columns.length > 5 && (
                    <span className="template-col template-more">+{t.columns.length - 5} more</span>
                  )}
                </div>
                <button
                  onClick={() => handleCopy(t)}
                  className="btn btn-primary template-copy-btn"
                >
                  {copiedKey === t.key ? "Copied!" : "Copy Columns"}
                </button>
              </div>
            ))}
          </div>

          <ShareButtons
            path="/templates"
            text="Free payslip templates for Indian businesses — 6 formats on DoAide Payroll"
          />

          <section className="tool-info">
            <h2>Which Payslip Format Should You Use?</h2>
            <ul>
              <li><strong>Standard</strong> — Best for most salaried employees. Covers basic statutory requirements.</li>
              <li><strong>Detailed</strong> — For organizations needing YTD tracking and full tax computation visibility.</li>
              <li><strong>CTC Breakdown</strong> — Ideal for offer letters and annual compensation reviews.</li>
              <li><strong>Contractor</strong> — For 194C/194J TDS compliance with independent contractors.</li>
              <li><strong>Intern</strong> — Simplified format for stipend payments without PF/ESI deductions.</li>
              <li><strong>Freelancer</strong> — Handles GST-registered freelancers with proper TDS treatment.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
