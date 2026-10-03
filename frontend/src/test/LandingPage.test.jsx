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
  it('renders hero heading', () => {
    renderLanding();
    expect(screen.getByText(/Indian Payroll/)).toBeInTheDocument();
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

  it('renders how-it-works section', () => {
    renderLanding();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('renders pricing section with INR prices', () => {
    renderLanding();
    expect(screen.getByText('Simple, Transparent Pricing')).toBeInTheDocument();
    expect(screen.getByText('₹0')).toBeInTheDocument();
    expect(screen.getByText('₹999')).toBeInTheDocument();
    expect(screen.getByText('₹2,499')).toBeInTheDocument();
  });

  it('renders testimonials', () => {
    renderLanding();
    expect(screen.getByText(/Rajesh M\./)).toBeInTheDocument();
  });

  it('renders FAQ section with accordion', async () => {
    renderLanding();
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();

    const user = userEvent.setup();
    const firstQ = screen.getByText(/PF and ESI/);
    await user.click(firstQ);
  });

  it('has get started links', () => {
    renderLanding();
    const links = screen.getAllByText(/Get Started/);
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders footer with DoAide products', () => {
    renderLanding();
    expect(screen.getByText('DoAide Products')).toBeInTheDocument();
    expect(screen.getByText('doaide.com')).toBeInTheDocument();
  });
});
