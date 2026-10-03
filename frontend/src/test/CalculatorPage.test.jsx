import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import CalculatorPage from "../pages/CalculatorPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));
vi.mock("../lib/share", () => ({
  fullUrl: (p) => `http://localhost${p}`,
  whatsappUrl: (text, url) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  twitterUrl: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  copyToClipboard: vi.fn().mockResolvedValue(true),
}));
vi.mock("../lib/track", () => ({ track: vi.fn() }));

function renderCalc() {
  return render(
    <MemoryRouter initialEntries={["/calculator"]}>
      <CalculatorPage />
    </MemoryRouter>,
  );
}

describe("CalculatorPage", () => {
  it("renders the title and subtitle", () => {
    renderCalc();
    expect(screen.getByRole("heading", { name: "Salary Calculator" })).toBeInTheDocument();
    expect(screen.getByText(/Calculate CTC breakdown/)).toBeInTheDocument();
  });

  it("shows breakdown when CTC is entered", async () => {
    renderCalc();
    await userEvent.type(screen.getByPlaceholderText("Enter annual CTC in ₹"), "600000");
    expect(screen.getAllByText("Basic Salary").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Net Take-Home \(Monthly\)/).length).toBeGreaterThan(0);
  });

  it("shows share buttons when result is computed", async () => {
    renderCalc();
    await userEvent.type(screen.getByPlaceholderText("Enter annual CTC in ₹"), "600000");
    expect(screen.getByLabelText("Share on WhatsApp")).toBeInTheDocument();
  });

  it("shows no result when input is empty", () => {
    renderCalc();
    expect(screen.queryByText(/Net Take-Home \(Monthly\)/)).not.toBeInTheDocument();
  });

  it("toggles metro HRA rate", async () => {
    renderCalc();
    await userEvent.type(screen.getByPlaceholderText("Enter annual CTC in ₹"), "600000");
    expect(screen.getAllByText(/40%/).length).toBeGreaterThan(0);
    await userEvent.click(screen.getByLabelText(/Metro city/));
    expect(screen.getAllByText(/50%/).length).toBeGreaterThan(0);
  });

  it("renders the info section", () => {
    renderCalc();
    expect(screen.getByText("How Indian Salary Structure Works")).toBeInTheDocument();
  });
});
