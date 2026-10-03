import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../hooks/useTheme";
import { AuthProvider } from "../hooks/useAuth";
import App from "../App";

vi.mock("../lib/api", () => ({
  default: {
    me: vi.fn().mockRejectedValue(new Error("not logged in")),
    logout: vi.fn(),
    employees: { list: vi.fn().mockRejectedValue(new Error()) },
    payroll: { listRuns: vi.fn().mockRejectedValue(new Error()) },
    leaves: { list: vi.fn().mockRejectedValue(new Error()), getBalances: vi.fn().mockRejectedValue(new Error()) },
    reports: { monthly: vi.fn().mockRejectedValue(new Error()), compliance: vi.fn().mockRejectedValue(new Error()) },
    health: { check: vi.fn().mockRejectedValue(new Error()) },
  },
  onUnauthorized: vi.fn(),
  errorMessage: (e) => e?.message || "error",
}));

function renderApp(route = "/") {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe("App", () => {
  it("renders landing page when not authenticated", async () => {
    renderApp("/");
    expect(await screen.findByText(/Indian Payroll/i)).toBeInTheDocument();
  });

  it("renders auth page at /auth", async () => {
    renderApp("/auth");
    const tabs = await screen.findAllByText(/Sign In/i);
    expect(tabs.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  it("renders pricing page at /pricing", async () => {
    renderApp("/pricing");
    expect(await screen.findByText(/Transparent Pricing/i)).toBeInTheDocument();
  });
});
