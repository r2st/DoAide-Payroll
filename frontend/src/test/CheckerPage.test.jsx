import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import CheckerPage from "../pages/CheckerPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));
vi.mock("../lib/share", () => ({
  fullUrl: (p) => `http://localhost${p}`,
  whatsappUrl: (t, u) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
  twitterUrl: (t, u) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
  copyToClipboard: vi.fn().mockResolvedValue(true),
}));
vi.mock("../lib/track", () => ({ track: vi.fn() }));

function renderChecker() {
  return render(
    <MemoryRouter initialEntries={["/checker"]}>
      <CheckerPage />
    </MemoryRouter>,
  );
}

describe("CheckerPage", () => {
  it("renders title and inputs", () => {
    renderChecker();
    expect(screen.getByRole("heading", { name: "PF & ESI Eligibility Checker" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Total employee count")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Gross monthly wages")).toBeInTheDocument();
  });

  it("shows PF Mandatory for 20+ employees", async () => {
    renderChecker();
    await userEvent.type(screen.getByPlaceholderText("Total employee count"), "25");
    await userEvent.type(screen.getByPlaceholderText("Gross monthly wages"), "18000");
    expect(screen.getByText("Mandatory")).toBeInTheDocument();
    expect(screen.getByText(/PF registration is mandatory/)).toBeInTheDocument();
  });

  it("shows PF Voluntary for fewer than 20 employees", async () => {
    renderChecker();
    await userEvent.type(screen.getByPlaceholderText("Total employee count"), "10");
    await userEvent.type(screen.getByPlaceholderText("Gross monthly wages"), "15000");
    expect(screen.getByText("Voluntary")).toBeInTheDocument();
  });

  it("shows ESI Applicable when wages ≤ ₹21,000 and ≥10 employees", async () => {
    renderChecker();
    await userEvent.type(screen.getByPlaceholderText("Total employee count"), "15");
    await userEvent.type(screen.getByPlaceholderText("Gross monthly wages"), "18000");
    expect(screen.getByText("Applicable")).toBeInTheDocument();
    expect(screen.getAllByText(/0.75%/).length).toBeGreaterThan(0);
  });

  it("shows ESI Not Applicable when wages > ₹21,000", async () => {
    renderChecker();
    await userEvent.type(screen.getByPlaceholderText("Total employee count"), "15");
    await userEvent.type(screen.getByPlaceholderText("Gross monthly wages"), "25000");
    expect(screen.getByText("Not Applicable for This Employee")).toBeInTheDocument();
  });

  it("shows share buttons when result is computed", async () => {
    renderChecker();
    await userEvent.type(screen.getByPlaceholderText("Total employee count"), "20");
    await userEvent.type(screen.getByPlaceholderText("Gross monthly wages"), "15000");
    expect(screen.getByLabelText("Share on WhatsApp")).toBeInTheDocument();
  });

  it("renders the info section", () => {
    renderChecker();
    expect(screen.getByText("PF & ESI Compliance Rules")).toBeInTheDocument();
  });
});
