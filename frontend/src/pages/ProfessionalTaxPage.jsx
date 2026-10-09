import { useEffect, useState } from "react";
import ToolsNav from "../components/ToolsNav";
import ShareButtons from "../components/ShareButtons";
import { usePageTitle } from "../hooks/usePageTitle";

const BASE = "/api/v1";

function fmt(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function ProfessionalTaxPage() {
  usePageTitle("Professional Tax by State — India PT Rates & Calculator");
  const [states, setStates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [slabs, setSlabs] = useState([]);
  const [salary, setSalary] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/free/professional-tax`)
      .then((r) => r.json())
      .then((d) => {
        setStates(d.states || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`${BASE}/free/professional-tax/${selected}`)
      .then((r) => r.json())
      .then((d) => setSlabs(d.slabs || []));
  }, [selected]);

  async function calculate() {
    if (!selected || !salary) return;
    const res = await fetch(`${BASE}/free/professional-tax/${selected}/calculate?monthly_salary=${salary}`);
    const d = await res.json();
    setResult(d);
  }

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Professional Tax by State</h1>
          <p className="tool-subtitle">
            Professional tax rates across Indian states. Select a state to see slab rates and calculate your PT.
          </p>

          <div className="calc-card">
            {loading ? (
              <p>Loading states...</p>
            ) : (
              <>
                <h3 className="calc-result-heading">Select State</h3>
                <div className="state-grid">
                  {states.map((s) => (
                    <button
                      key={s.code}
                      type="button"
                      className={`state-btn${selected === s.code ? " active" : ""}`}
                      onClick={() => { setSelected(s.code); setResult(null); }}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>

                {selected && slabs.length > 0 && (
                  <div className="calc-result" aria-live="polite">
                    <h3 className="calc-result-heading">
                      {selected.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — PT Slabs
                    </h3>
                    <table className="pt-table">
                      <thead>
                        <tr>
                          <th>Monthly Salary Range</th>
                          <th>Tax / Month</th>
                        </tr>
                      </thead>
                      <tbody>
                        {slabs.map((slab, i) => (
                          <tr key={i}>
                            <td>
                              {fmt(slab.min)} — {slab.max ? fmt(slab.max) : "Above"}
                            </td>
                            <td>₹{slab.tax}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <h3 className="calc-result-heading">Calculate Your PT</h3>
                    <label className="calc-label">
                      Monthly Gross Salary (₹)
                      <input
                        className="calc-input"
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="Enter monthly salary"
                        min="0"
                        inputMode="numeric"
                      />
                    </label>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={calculate}
                      disabled={!salary}
                    >
                      Calculate
                    </button>

                    {result && (
                      <div className="calc-result-row calc-total" style={{ marginTop: "1rem" }}>
                        <span>Professional Tax</span>
                        <strong>₹{result.professional_tax}/month (₹{result.annual_tax}/year)</strong>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <ShareButtons
            path="/professional-tax"
            text="Professional Tax rates by Indian state — free calculator on DoAide Payroll"
          />

          <section className="tool-info">
            <h2>What is Professional Tax?</h2>
            <p>
              Professional Tax (PT) is a state-level tax levied on salaried individuals and professionals in India.
              Each state has its own slab structure. It is typically deducted by the employer from the employee's salary
              and remitted to the state government. The maximum PT is capped at ₹2,500 per year.
            </p>
            <h3>Key Points</h3>
            <ul>
              <li>PT rates vary significantly across states.</li>
              <li>Not all states levy Professional Tax.</li>
              <li>PT is deductible under Section 16 of the Income Tax Act.</li>
              <li>Employers are responsible for deduction and remittance.</li>
              <li>February often has a higher PT deduction (notably in Maharashtra).</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
