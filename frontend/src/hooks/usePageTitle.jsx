import { useEffect } from "react";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — DoAide Payroll` : "DoAide Payroll";
  }, [title]);
}
