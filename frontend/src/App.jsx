import { Routes, Route } from "react-router-dom";
import Shell from "./components/Shell";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import EmployeesPage from "./pages/EmployeesPage";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import PayrollPage from "./pages/PayrollPage";
import PayrollRunDetailPage from "./pages/PayrollRunDetailPage";
import AttendancePage from "./pages/AttendancePage";
import LeavesPage from "./pages/LeavesPage";
import ReportsPage from "./pages/ReportsPage";
import CompliancePage from "./pages/CompliancePage";
import SettingsPage from "./pages/SettingsPage";
import PricingPage from "./pages/PricingPage";
import CalculatorPage from "./pages/CalculatorPage";
import CheckerPage from "./pages/CheckerPage";
import TemplatesPage from "./pages/TemplatesPage";
import EmbedPage from "./pages/EmbedPage";
import PayslipGeneratorPage from "./pages/PayslipGeneratorPage";
import BatchPage from "./pages/BatchPage";
import ProfessionalTaxPage from "./pages/ProfessionalTaxPage";
import BlogLayout, { BlogIndex } from "./pages/BlogLayout";
import SalaryStructureGuide from "./pages/blog/SalaryStructureGuide";
import PfEsiComplianceGuide from "./pages/blog/PfEsiComplianceGuide";
import PayslipFormatGuide from "./pages/blog/PayslipFormatGuide";
import PayrollProcessingGuide from "./pages/blog/PayrollProcessingGuide";
import EpfCalculationGuide from "./pages/blog/EpfCalculationGuide";
import ProfessionalTaxGuide from "./pages/blog/ProfessionalTaxGuide";

function Home() {
  const { user, loading } = useAuth();
  if (loading) return <div className="skeleton-page"><div className="skeleton-bar w-full h-64" /></div>;
  if (!user) return <LandingPage />;
  return (
    <Shell>
      <DashboardPage />
    </Shell>
  );
}

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <Shell>{children}</Shell>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/calculator" element={<CalculatorPage />} />
      <Route path="/payslip-generator" element={<PayslipGeneratorPage />} />
      <Route path="/batch" element={<BatchPage />} />
      <Route path="/checker" element={<CheckerPage />} />
      <Route path="/professional-tax" element={<ProfessionalTaxPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/embed" element={<EmbedPage />} />
      <Route path="/blog" element={<BlogLayout />}>
        <Route index element={<BlogIndex />} />
        <Route path="salary-structure-india-ctc-explained" element={<SalaryStructureGuide />} />
        <Route path="pf-esi-compliance-guide-2026" element={<PfEsiComplianceGuide />} />
        <Route path="payslip-format-india-what-to-include" element={<PayslipFormatGuide />} />
        <Route path="payroll-processing-india-2026-guide" element={<PayrollProcessingGuide />} />
        <Route path="epf-calculation-2026-employee-employer-contribution" element={<EpfCalculationGuide />} />
        <Route path="professional-tax-rates-2026-state-wise-slab-chart" element={<ProfessionalTaxGuide />} />
      </Route>
      <Route path="/employees" element={<Protected><EmployeesPage /></Protected>} />
      <Route path="/employees/:id" element={<Protected><EmployeeDetailPage /></Protected>} />
      <Route path="/payroll" element={<Protected><PayrollPage /></Protected>} />
      <Route path="/payroll/:id" element={<Protected><PayrollRunDetailPage /></Protected>} />
      <Route path="/attendance" element={<Protected><AttendancePage /></Protected>} />
      <Route path="/leaves" element={<Protected><LeavesPage /></Protected>} />
      <Route path="/reports" element={<Protected><ReportsPage /></Protected>} />
      <Route path="/compliance" element={<Protected><CompliancePage /></Protected>} />
      <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
    </Routes>
  );
}
