import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "doaide_payroll_theme";

function resolveTheme(preference) {
  if (preference === "system") {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }
  return preference;
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "dark";
    } catch {
      return "dark";
    }
  });

  const resolved = resolveTheme(preference);

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {}
  }, [preference, resolved]);

  useEffect(() => {
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => {
      document.documentElement.dataset.theme = resolveTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [preference]);

  const cycle = () => {
    const order = ["dark", "light", "system"];
    const next = order[(order.indexOf(preference) + 1) % order.length];
    setPreference(next);
  };

  return (
    <ThemeContext.Provider value={{ preference, resolved, cycle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
