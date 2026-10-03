import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import TemplatesPage from "../pages/TemplatesPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));
vi.mock("../lib/share", () => ({
  fullUrl: (p) => `http://localhost${p}`,
  whatsappUrl: (t, u) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
  twitterUrl: (t, u) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
  copyToClipboard: vi.fn().mockResolvedValue(true),
}));
vi.mock("../lib/track", () => ({ track: vi.fn() }));

import { copyToClipboard } from "../lib/share";

function renderTemplates() {
  return render(
    <MemoryRouter initialEntries={["/templates"]}>
      <TemplatesPage />
    </MemoryRouter>,
  );
}

describe("TemplatesPage", () => {
  it("renders the title", () => {
    renderTemplates();
    expect(screen.getByRole("heading", { name: "Payslip Templates" })).toBeInTheDocument();
  });

  it("shows all 6 template cards", () => {
    renderTemplates();
    const buttons = screen.getAllByText("Copy Columns");
    expect(buttons).toHaveLength(6);
    expect(screen.getByText("Standard Payslip")).toBeInTheDocument();
    expect(screen.getByText("Detailed Payslip")).toBeInTheDocument();
    expect(screen.getByText("Contractor Payment")).toBeInTheDocument();
    expect(screen.getByText("Intern Stipend")).toBeInTheDocument();
    expect(screen.getByText("Freelancer Invoice")).toBeInTheDocument();
  });

  it("copies columns when button is clicked", async () => {
    renderTemplates();
    const buttons = screen.getAllByText("Copy Columns");
    await userEvent.click(buttons[0]);
    expect(copyToClipboard).toHaveBeenCalledWith(expect.stringContaining("Employee Name"));
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });

  it("renders the info section", () => {
    renderTemplates();
    expect(screen.getByText("Which Payslip Format Should You Use?")).toBeInTheDocument();
  });
});
