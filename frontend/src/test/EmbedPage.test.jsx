import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import EmbedPage from "../pages/EmbedPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));
vi.mock("../lib/share", () => ({
  copyToClipboard: vi.fn().mockResolvedValue(true),
  embedSnippet: (tool) => `<iframe src="http://localhost/embed/${tool}" title="DoAide Payroll"></iframe>`,
}));
vi.mock("../lib/track", () => ({ track: vi.fn() }));

import { copyToClipboard } from "../lib/share";

function renderEmbed() {
  return render(
    <MemoryRouter initialEntries={["/embed"]}>
      <EmbedPage />
    </MemoryRouter>,
  );
}

describe("EmbedPage", () => {
  afterEach(() => vi.clearAllMocks());

  it("renders title", () => {
    renderEmbed();
    expect(screen.getByRole("heading", { name: "Embed Payroll Tools on Your Website" })).toBeInTheDocument();
  });

  it("shows tool selector buttons", () => {
    renderEmbed();
    expect(screen.getAllByText(/Salary Calculator/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PF\/ESI Checker/).length).toBeGreaterThan(0);
  });

  it("shows embed snippet", () => {
    renderEmbed();
    expect(screen.getByText(/iframe/)).toBeInTheDocument();
  });

  it("copies embed code when button clicked", async () => {
    renderEmbed();
    await userEvent.click(screen.getByText("Copy embed code"));
    expect(copyToClipboard).toHaveBeenCalledWith(expect.stringContaining("<iframe"));
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });

  it("switches tool when selector is clicked", async () => {
    renderEmbed();
    const toolGroup = screen.getByRole("group", { name: /Choose tool/ });
    expect(toolGroup).toBeInTheDocument();
    const checkerBtn = toolGroup.querySelector("button:nth-child(2)");
    await userEvent.click(checkerBtn);
    await userEvent.click(screen.getByText("Copy embed code"));
    expect(copyToClipboard).toHaveBeenCalledWith(expect.stringContaining("checker"));
  });
});
