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
