import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import LandingPage from '../pages/LandingPage';

vi.mock('../hooks/usePageTitle', () => ({
  usePageTitle: vi.fn(),
}));

function renderLanding() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );
}

describe('LandingPage', () => {
  it('renders hero heading with gold accent', () => {
    renderLanding();
    const headline = document.querySelector('.landing-headline');
    expect(headline).toBeInTheDocument();
    expect(headline.textContent).toContain('Indian Payroll');
    expect(screen.getByText('Made Simple')).toBeInTheDocument();
  });

  it('renders DoAide brand logo in header', () => {
    renderLanding();
    const brand = document.querySelector('.landing-brand-text');
    expect(brand).toBeInTheDocument();
    expect(brand.textContent).toContain('DoAide');
    expect(brand.textContent).toContain('Payroll');
  });

  it('renders header navigation links', () => {
    renderLanding();
    const nav = document.querySelector('.landing-nav');
    expect(nav).toBeInTheDocument();
    expect(nav.textContent).toContain('Pricing');
    expect(nav.textContent).toContain('Login');
    expect(nav.textContent).toContain('Get Started');
  });

  it('renders all 6 feature cards', () => {
    renderLanding();
    expect(screen.getByText('Employee Management')).toBeInTheDocument();
    expect(screen.getByText('Auto Salary Computation')).toBeInTheDocument();
    expect(screen.getByText('PF/ESI/TDS Compliance')).toBeInTheDocument();
    expect(screen.getByText('Payslip Generation')).toBeInTheDocument();
    expect(screen.getByText('Leave & Attendance')).toBeInTheDocument();
    expect(screen.getByText('Reports & Analytics')).toBeInTheDocument();
  });

  it('renders how-it-works section with 3 steps', () => {
    renderLanding();
    const howHeading = document.getElementById('how-heading');
    expect(howHeading).toBeInTheDocument();
    expect(howHeading.textContent).toBe('How It Works');
    const steps = document.querySelectorAll('.landing-step');
    expect(steps.length).toBe(3);
    expect(screen.getByText('Add your employees')).toBeInTheDocument();
    expect(screen.getByText('Run payroll with one click')).toBeInTheDocument();
    expect(screen.getByText('Download payslips & reports')).toBeInTheDocument();
  });

  it('renders pricing section with INR prices', () => {
    renderLanding();
    expect(screen.getByText('Simple, Transparent Pricing')).toBeInTheDocument();
    expect(screen.getByText('₹0')).toBeInTheDocument();
    expect(screen.getByText('₹999')).toBeInTheDocument();
    expect(screen.getByText('₹2,499')).toBeInTheDocument();
  });

  it('renders pricing tiers with featured badge', () => {
    renderLanding();
    expect(screen.getByText('Most Popular')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('renders testimonials', () => {
    renderLanding();
    expect(screen.getByText(/Rahul P\./)).toBeInTheDocument();
    expect(screen.getByText(/Meera S\./)).toBeInTheDocument();
    expect(screen.getByText(/Amit G\./)).toBeInTheDocument();
  });

  it('renders FAQ section with accordion', async () => {
    renderLanding();
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();

    const user = userEvent.setup();
    const firstQ = screen.getByText(/PF and ESI/);
    expect(firstQ).toBeInTheDocument();
    await user.click(firstQ);
    expect(screen.getByText(/12% on basic/)).toBeInTheDocument();
  });

  it('has get started CTA links', () => {
    renderLanding();
    const links = screen.getAllByText(/Get Started|Start Free/);
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders footer with DoAide products', () => {
    renderLanding();
    expect(screen.getByText('DoAide Products')).toBeInTheDocument();
    expect(screen.getByText('doaide.com')).toBeInTheDocument();
    expect(screen.getByText('GST')).toBeInTheDocument();
    expect(screen.getByText('Voice')).toBeInTheDocument();
  });

  it('renders particle field for brand animation', () => {
    const { container } = renderLanding();
    const particles = container.querySelectorAll('.landing-particle');
    expect(particles.length).toBe(12);
  });

  it('renders pipeline graphic', () => {
    const { container } = renderLanding();
    const pipeline = container.querySelector('.landing-pipeline');
    expect(pipeline).toBeInTheDocument();
  });

  it('renders hero robot SVG', () => {
    const { container } = renderLanding();
    const robot = container.querySelector('.landing-hero-robot');
    expect(robot).toBeInTheDocument();
  });
});
