import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { BlogIndex } from "../pages/BlogLayout";

describe("BlogIndex", () => {
  it("renders all 6 article cards", () => {
    render(
      <MemoryRouter>
        <BlogIndex />
      </MemoryRouter>,
    );
    expect(screen.getByText(/CTC, Gross, Net Salary/)).toBeInTheDocument();
    expect(screen.getByText(/PF & ESI Compliance Guide/)).toBeInTheDocument();
    expect(screen.getByText(/What to Include in a Payslip/)).toBeInTheDocument();
    expect(screen.getByText(/Payroll Processing in India 2026/)).toBeInTheDocument();
    expect(screen.getByText(/EPF Calculation 2026/)).toBeInTheDocument();
    expect(screen.getByText(/Professional Tax Rates 2026/)).toBeInTheDocument();
  });

  it("renders read more links", () => {
    render(
      <MemoryRouter>
        <BlogIndex />
      </MemoryRouter>,
    );
    const links = screen.getAllByText(/Read more/);
    expect(links).toHaveLength(6);
  });
});
