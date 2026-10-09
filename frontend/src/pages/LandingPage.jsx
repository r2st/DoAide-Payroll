import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { copyToClipboard, fullUrl } from "../lib/share";

const DOAIDE_PRODUCTS = [
  { name: "409A", url: "https://409a.doaide.com" },
  { name: "Analytics", url: "https://analytics-app.doaide.com" },
  { name: "Contracts", url: "https://contracts.doaide.com" },
  { name: "Desk", url: "https://desk.doaide.com" },
  { name: "GST", url: "https://gst.doaide.com" },
  { name: "Inventory", url: "https://inventory.doaide.com" },
  { name: "Invoicer", url: "https://invoicer.doaide.com" },
  { name: "Jobs", url: "https://job.doaide.com" },
  { name: "Med", url: "https://med.doaide.com" },
  { name: "Proposals", url: "https://proposals.doaide.com" },
  { name: "Pulse", url: "https://pulse.doaide.com" },
  { name: "Reach", url: "https://reach.doaide.com" },
  { name: "Realty", url: "https://realty.doaide.com" },
  { name: "Scheduler", url: "https://scheduler.doaide.com" },
  { name: "Support", url: "https://support.doaide.com" },
  { name: "Trade", url: "https://trade.doaide.com" },
  { name: "Voice", url: "https://voice.doaide.com" },
];

const TYPEWRITER_PHRASES = [
  "Salary computed in seconds",
  "PF, ESI, TDS — always accurate",
  "One-click payroll runs",
  "Professional payslips, instantly",
];

function RobotFace({ size = 32, color }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <line x1="16" y1="6" x2="16" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="1.5" r="1.5" fill={color} />
      <rect x="5" y="6" width="22" height="17" rx="5" fill={color} />
      <ellipse cx="11" cy="13" rx="2.5" ry="3" fill="#0A0A0B" />
      <ellipse cx="21" cy="13" rx="2.5" ry="3" fill="#0A0A0B" />
      <circle cx="11.5" cy="12.5" r="1" fill={color} opacity="0.6" />
      <circle cx="21.5" cy="12.5" r="1" fill={color} opacity="0.6" />
      <path d="M12 19Q16 22 20 19" stroke="#0A0A0B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <rect x="1" y="10" width="4" height="5" rx="2" fill={color} opacity="0.8" />
      <rect x="27" y="10" width="4" height="5" rx="2" fill={color} opacity="0.8" />
    </svg>
  );
}

function HeroRobot({ color }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" width="120" height="100" className="landing-hero-robot" aria-hidden="true">
      <line x1="60" y1="18" x2="60" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="60" cy="4" r="3" fill={color} className="landing-antenna-glow" />
      <rect x="25" y="18" width="70" height="55" rx="16" fill={color} />
      <ellipse cx="42" cy="40" rx="8" ry="10" fill="#0A0A0B" />
      <ellipse cx="78" cy="40" rx="8" ry="10" fill="#0A0A0B" />
      <circle cx="44" cy="38" r="3" fill={color} opacity="0.5" />
      <circle cx="80" cy="38" r="3" fill={color} opacity="0.5" />
      <path d="M45 60 Q60 72 75 60" stroke="#0A0A0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="5" y="30" width="16" height="18" rx="6" fill={color} opacity="0.8" />
      <rect x="99" y="30" width="16" height="18" rx="6" fill={color} opacity="0.8" />
    </svg>
  );
}

function Typewriter({ phrases }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[index];
    let timeout;
    if (!deleting && text === phrase) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
    } else {
      const speed = deleting ? 30 : 60;
      timeout = setTimeout(() => {
        setText(deleting ? phrase.slice(0, text.length - 1) : phrase.slice(0, text.length + 1));
      }, speed);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, phrases]);

  return (
    <span className="landing-typewriter" aria-label={phrases[index]}>
      {text}
      <span className="landing-cursor" aria-hidden="true">|</span>
    </span>
  );
}

function PipelineGraphic() {
  return (
    <div className="landing-pipeline" aria-hidden="true">
      <svg viewBox="0 0 520 90" xmlns="http://www.w3.org/2000/svg">
        <line x1="78" y1="36" x2="152" y2="36" stroke="rgba(240,180,41,0.2)" strokeWidth="2" />
        <line x1="218" y1="36" x2="302" y2="36" stroke="rgba(240,180,41,0.2)" strokeWidth="2" />
        <line x1="368" y1="36" x2="442" y2="36" stroke="rgba(240,180,41,0.2)" strokeWidth="2" />

        <circle r="3" fill="#F0B429" opacity="0.8">
          <animateMotion dur="2s" repeatCount="indefinite" path="M78,36 L152,36" />
        </circle>
        <circle r="2" fill="#F7CC5F" opacity="0.5">
          <animateMotion dur="2s" repeatCount="indefinite" begin="0.5s" path="M78,36 L152,36" />
        </circle>
        <circle r="3" fill="#F0B429" opacity="0.8">
          <animateMotion dur="2s" repeatCount="indefinite" begin="0.7s" path="M218,36 L302,36" />
        </circle>
        <circle r="2" fill="#F7CC5F" opacity="0.5">
          <animateMotion dur="2s" repeatCount="indefinite" begin="1.2s" path="M218,36 L302,36" />
        </circle>
        <circle r="3" fill="#F0B429" opacity="0.8">
          <animateMotion dur="2s" repeatCount="indefinite" begin="1.4s" path="M368,36 L442,36" />
        </circle>
        <circle r="2" fill="#F7CC5F" opacity="0.5">
          <animateMotion dur="2s" repeatCount="indefinite" begin="1.9s" path="M368,36 L442,36" />
        </circle>

        {/* Add Employees */}
        <circle cx="50" cy="36" r="28" fill="rgba(240,180,41,0.06)" stroke="rgba(240,180,41,0.25)" strokeWidth="1.5" />
        <path d="M44 42v-8a1.5 1.5 0 011.5-1.5h5l3 3v6.5a1.5 1.5 0 01-1.5 1.5h-6.5a1.5 1.5 0 01-1.5-1.5z" fill="none" stroke="#F0B429" strokeWidth="1.3" strokeLinejoin="round" />
        <circle cx="50" cy="37" r="2.5" fill="none" stroke="#F0B429" strokeWidth="1.2" />
        <path d="M46 43c0-2.2 1.8-3 4-3s4 .8 4 3" fill="none" stroke="#F0B429" strokeWidth="1.2" strokeLinecap="round" />
        <text x="50" y="78" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="'IBM Plex Mono',monospace">Add</text>

        {/* Compute */}
        <circle cx="190" cy="36" r="28" fill="rgba(240,180,41,0.06)" stroke="rgba(240,180,41,0.25)" strokeWidth="1.5" />
        <rect x="181" y="27" width="18" height="18" rx="2" fill="none" stroke="#F0B429" strokeWidth="1.3" />
        <line x1="185" y1="31" x2="195" y2="31" stroke="#F0B429" strokeWidth="1" strokeLinecap="round" />
        <line x1="185" y1="35" x2="195" y2="35" stroke="#F0B429" strokeWidth="1" strokeLinecap="round" />
        <line x1="185" y1="39" x2="191" y2="39" stroke="#F0B429" strokeWidth="1" strokeLinecap="round" />
        <path d="M193 38l2 2 3-3" fill="none" stroke="#F0B429" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="190" y="78" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="'IBM Plex Mono',monospace">Compute</text>

        {/* Comply */}
        <circle cx="330" cy="36" r="28" fill="rgba(240,180,41,0.06)" stroke="rgba(240,180,41,0.25)" strokeWidth="1.5" />
        <path d="M330 24c-6 3-10 5-10 12 0 6.5 4 10.5 10 13 6-2.5 10-6.5 10-13 0-7-4-9-10-12z" fill="none" stroke="#F0B429" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M325 36l3 3 7-7" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="330" y="78" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="'IBM Plex Mono',monospace">Comply</text>

        {/* Payslip */}
        <circle cx="470" cy="36" r="28" fill="rgba(240,180,41,0.06)" stroke="rgba(240,180,41,0.25)" strokeWidth="1.5" />
        <path d="M462 42V28h10l4 4v10H462z" fill="none" stroke="#F0B429" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M472 28v4h4" fill="none" stroke="#F0B429" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M465 35h8M465 38h5" stroke="#F0B429" strokeWidth="1" strokeLinecap="round" />
        <text x="470" y="78" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="'IBM Plex Mono',monospace">Payslip</text>
      </svg>
    </div>
  );
}

const PARTICLES = [
  { left: "8%", top: "15%", size: 3, delay: 0, dur: 18 },
  { left: "22%", top: "65%", size: 2, delay: 3, dur: 22 },
  { left: "35%", top: "30%", size: 4, delay: 7, dur: 15 },
  { left: "50%", top: "80%", size: 2, delay: 1, dur: 20 },
  { left: "65%", top: "20%", size: 3, delay: 5, dur: 17 },
  { left: "78%", top: "55%", size: 2, delay: 9, dur: 23 },
  { left: "90%", top: "35%", size: 3, delay: 2, dur: 19 },
  { left: "15%", top: "85%", size: 2, delay: 6, dur: 21 },
  { left: "42%", top: "45%", size: 3, delay: 4, dur: 16 },
  { left: "72%", top: "75%", size: 2, delay: 8, dur: 24 },
  { left: "88%", top: "10%", size: 4, delay: 10, dur: 14 },
  { left: "5%", top: "50%", size: 2, delay: 11, dur: 25 },
];

function ParticleField() {
  return (
    <div className="landing-particles" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="landing-particle"
          style={{
            left: p.left, top: p.top, width: p.size, height: p.size,
            animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

const FEATURES = [
  {
    title: "Employee Management",
    desc: "Complete employee records with PAN, bank details, UAN, and ESI tracking. All in one place.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: "Auto Salary Computation",
    desc: "Basic, HRA, DA, special allowances calculated automatically with proration for mid-month joins.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" /><path d="M14 16l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "PF/ESI/TDS Compliance",
    desc: "Indian statutory deductions computed per latest government rules and income tax slab rates.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Payslip Generation",
    desc: "Professional PDF payslips with full earnings, deductions, and net pay breakdown. Ready to share.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: "Leave & Attendance",
    desc: "Casual, sick, and earned leave tracking with balance management and attendance logs.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
  {
    title: "Reports & Analytics",
    desc: "Monthly and quarterly payroll reports with department breakdowns and compliance summaries.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Add your employees", desc: "Enter employee details — PAN, bank account, salary structure. Import from Excel or add manually." },
  { step: "2", title: "Run payroll with one click", desc: "DoAide computes gross pay, statutory deductions (PF, ESI, TDS), and net pay automatically." },
  { step: "3", title: "Download payslips & reports", desc: "Generate PDF payslips for every employee and download compliance reports for PF, ESI, and TDS filings." },
];

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    desc: "For startups and micro businesses",
    features: ["Up to 10 employees", "Basic payroll", "Payslip PDF", "PF/ESI/TDS", "Email support"],
    cta: "Start Free",
  },
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    desc: "For growing businesses",
    features: ["Up to 100 employees", "Everything in Free", "Leave management", "Attendance tracking", "Reports", "Priority support"],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Pro",
    price: "₹2,499",
    period: "/month",
    desc: "For large organizations",
    features: ["Unlimited employees", "Everything in Starter", "Bulk processing", "API access", "Custom reports", "Dedicated support"],
    cta: "Contact Sales",
  },
];

const TESTIMONIALS = [
  { name: "Rahul P.", role: "HR Manager", quote: "We used to spend two days on payroll every month. DoAide does it in 20 minutes with zero errors." },
  { name: "Meera S.", role: "Chartered Accountant", quote: "The PF/ESI calculations are always accurate. We stopped worrying about compliance notices." },
  { name: "Amit G.", role: "Founder, 30-person startup", quote: "For a 30-person company, the free plan covers everything we need. Best payroll tool for Indian startups." },
];

const FAQ_ITEMS = [
  { q: "Does DoAide Payroll handle PF and ESI?", a: "Yes. PF at 12% on basic (capped at ₹15,000) and ESI (0.75% employee + 3.25% employer, for gross up to ₹21,000) are calculated automatically per the latest government rules." },
  { q: "Can I generate payslips?", a: "Yes. Professional PDF payslips with complete earnings and deductions breakdown are generated automatically each pay run. Share them with employees instantly." },
  { q: "How many employees can I manage for free?", a: "The Free plan supports up to 10 employees with full payroll features including PF, ESI, and TDS calculation. No credit card required to start." },
  { q: "Does it support leave management?", a: "Starter and Pro plans include leave tracking for casual, sick, and earned leave with balance management and approval workflows." },
  { q: "Is my employee data secure?", a: "All employee and financial data is encrypted at rest and in transit. We follow Indian data protection standards and never share your data with third parties." },
  { q: "Can I run payroll for previous months?", a: "Yes. You can run payroll for any past month, make corrections, and generate revised payslips when needed." },
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="landing-faq" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="landing-section-title">Frequently Asked Questions</h2>
      <dl className="landing-faq-list">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="landing-faq-item">
            <dt>
              <button
                className="landing-faq-q"
                aria-expanded={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {item.q}
                <span className="landing-faq-chevron" aria-hidden="true">{openIndex === i ? "−" : "+"}</span>
              </button>
            </dt>
            {openIndex === i && <dd className="landing-faq-a">{item.a}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}

function ReferralBanner() {
  const [copied, setCopied] = useState(false);
  const url = fullUrl("/?ref=invite");
  const handleCopy = async () => {
    const ok = await copyToClipboard(url);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  return (
    <section className="landing-referral">
      <h2>Invite Your HR Team or Accountant</h2>
      <p>Share DoAide Payroll with your team — manage all employee payroll in one place.</p>
      <div className="landing-referral-actions">
        <a
          href={`https://wa.me/?text=${encodeURIComponent("Check out DoAide Payroll — free payroll software for Indian businesses: " + url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn landing-btn-primary"
        >
          Share on WhatsApp
        </a>
        <button onClick={handleCopy} className="btn landing-copy-btn">
          {copied ? "Link copied!" : "Copy invite link"}
        </button>
      </div>
    </section>
  );
}

export default function LandingPage() {
  usePageTitle("Indian Payroll Made Simple — DoAide Payroll");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const vis = visible ? "landing-visible" : "";

  return (
    <div className="landing-root">
      <ParticleField />

      <header className={`landing-header ${vis}`}>
        <a href="https://doaide.com" className="landing-brand">
          <RobotFace size={28} color="#F0B429" />
          <span className="landing-brand-text">
            DoAide <em>Payroll</em>
          </span>
        </a>
        <nav className="landing-nav">
          <Link to="/pricing" className="landing-nav-link">Pricing</Link>
          <Link to="/auth" className="landing-nav-link">Login</Link>
          <Link to="/auth" className="landing-nav-cta">Get Started</Link>
        </nav>
      </header>

      <main>
        <section className={`landing-hero ${vis}`}>
          <div className="landing-hero-robot-wrap">
            <HeroRobot color="#F0B429" />
          </div>
          <h1 className="landing-headline">
            Indian Payroll, <span className="landing-gold">Made Simple</span>
          </h1>
          <p className="landing-subtitle">
            Automated salary computation, PF/ESI/TDS compliance, and payslip
            generation for Indian SMBs. Get started in minutes.
          </p>
          <div className="landing-typewriter-wrap">
            <Typewriter phrases={TYPEWRITER_PHRASES} />
          </div>
          <PipelineGraphic />
          <div className="landing-hero-features">
            <div className="landing-hero-feature">
              <strong>Free forever</strong>
              <span>Up to 10 employees</span>
            </div>
            <div className="landing-hero-feature">
              <strong>From ₹999/mo</strong>
              <span>100+ employees, full compliance</span>
            </div>
          </div>
          <div className="landing-hero-actions">
            <Link to="/auth" className="landing-btn-primary">Start Free</Link>
            <Link to="/pricing" className="landing-btn-secondary">View Pricing</Link>
          </div>
        </section>

        <section className="landing-section" aria-labelledby="features-heading">
          <h2 id="features-heading" className="landing-section-title">Everything You Need for Indian Payroll</h2>
          <p className="landing-section-subtitle">
            From salary computation to compliance reports, DoAide Payroll handles the entire payroll lifecycle for Indian businesses.
          </p>
          <div className="landing-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="landing-feature-card">
                <div className="landing-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-section" aria-labelledby="how-heading">
          <h2 id="how-heading" className="landing-section-title">How It Works</h2>
          <div className="landing-steps">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="landing-step">
                <div className="landing-step-num">{s.step}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-section" aria-labelledby="pricing-heading">
          <h2 id="pricing-heading" className="landing-section-title">Simple, Transparent Pricing</h2>
          <p className="landing-section-subtitle">Start free with up to 10 employees. Upgrade as your team grows.</p>
          <div className="landing-pricing-grid">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`landing-pricing-card ${plan.featured ? "landing-pricing-featured" : ""}`}>
                {plan.featured && <span className="landing-pricing-badge">Most Popular</span>}
                <h3>{plan.name}</h3>
                <p className="landing-pricing-desc">{plan.desc}</p>
                <div className="landing-pricing-amount">
                  <span className="landing-pricing-price">{plan.price}</span>
                  <span className="landing-pricing-period">{plan.period}</span>
                </div>
                <ul className="landing-pricing-features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <svg className="landing-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/auth" className={plan.featured ? "landing-btn-primary landing-btn-block" : "landing-btn-outline landing-btn-block"}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-section" aria-labelledby="testimonials-heading">
          <h2 id="testimonials-heading" className="landing-section-title">Trusted by Indian Businesses</h2>
          <div className="landing-testimonials">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.name} className="landing-testimonial">
                <p>&ldquo;{t.quote}&rdquo;</p>
                <footer>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <FaqSection />

        <section className="landing-section" aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="landing-section-title">Free Payroll Tools</h2>
          <p className="landing-section-subtitle">No sign-up required. Use instantly.</p>
          <div className="landing-tool-cards">
            <Link to="/calculator" className="landing-tool-card">
              <div className="landing-tool-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="10" y2="10" /><line x1="14" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="10" y2="14" /><line x1="14" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="16" y2="18" />
                </svg>
              </div>
              <strong>Salary Calculator</strong>
              <span>CTC breakdown with PF, ESI, TDS</span>
            </Link>
            <Link to="/checker" className="landing-tool-card">
              <div className="landing-tool-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <strong>PF/ESI Checker</strong>
              <span>Check compliance requirements</span>
            </Link>
            <Link to="/payslip-generator" className="landing-tool-card">
              <div className="landing-tool-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <strong>Payslip Generator</strong>
              <span>Free PDF salary slips</span>
            </Link>
            <Link to="/batch" className="landing-tool-card">
              <div className="landing-tool-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="3" width="20" height="18" rx="2" /><line x1="2" y1="9" x2="22" y2="9" /><line x1="8" y1="3" x2="8" y2="21" />
                </svg>
              </div>
              <strong>Batch Payslips</strong>
              <span>Multiple months as ZIP</span>
            </Link>
            <Link to="/professional-tax" className="landing-tool-card">
              <div className="landing-tool-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <strong>Professional Tax</strong>
              <span>State-wise PT rates</span>
            </Link>
          </div>
        </section>

        <ReferralBanner />

        <section className="landing-cta">
          <h2>Ready to Simplify Payroll?</h2>
          <p>Start running payroll today. Free forever for up to 10 employees. No credit card required.</p>
          <Link to="/auth" className="landing-btn-primary landing-cta-btn">
            Get Started Free
          </Link>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-nav" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          <div className="landing-footer-col">
            <h4>Free Tools</h4>
            <Link to="/calculator">Salary Calculator</Link>
            <Link to="/payslip-generator">Payslip Generator</Link>
            <Link to="/batch">Batch Payslips</Link>
            <Link to="/checker">PF/ESI Checker</Link>
            <Link to="/professional-tax">Professional Tax</Link>
            <Link to="/templates">Templates</Link>
          </div>
          <div className="landing-footer-col">
            <h4>Product</h4>
            <Link to="/pricing">Pricing</Link>
            <a href="#features-heading" onClick={(e) => { e.preventDefault(); document.getElementById("features-heading")?.scrollIntoView({ behavior: "smooth" }); }}>Features</a>
            <a href="#faq-heading" onClick={(e) => { e.preventDefault(); document.getElementById("faq-heading")?.scrollIntoView({ behavior: "smooth" }); }}>FAQ</a>
          </div>
          <div className="landing-footer-col">
            <h4>Resources</h4>
            <Link to="/blog">Blog</Link>
            <Link to="/blog/salary-structure-india-ctc-explained">Salary Structure Guide</Link>
            <Link to="/blog/pf-esi-compliance-guide-2026">PF/ESI Guide</Link>
          </div>
          <div className="landing-footer-col">
            <h4>Company</h4>
            <a href="https://doaide.com">About DoAide</a>
            <a href="mailto:support@doaide.com">Contact</a>
          </div>
        </div>
        <div className="landing-footer-products">
          <h4>DoAide Products</h4>
          <div className="landing-footer-product-links">
            {DOAIDE_PRODUCTS.map((p) => (
              <a key={p.name} href={p.url} className="landing-footer-link">{p.name}</a>
            ))}
          </div>
        </div>
        <div className="landing-footer-bottom">
          <a href="https://doaide.com" className="landing-footer-home">
            <RobotFace size={16} color="#F0B429" />
            doaide.com
          </a>
          <span className="landing-footer-copy">&copy; {new Date().getFullYear()} DoAide. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
