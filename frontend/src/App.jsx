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
  return user ? <DashboardPage /> : <LandingPage />;
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
        <Route path="/employees/:id" element={<ProtectedRoute><EmployeeDetailPage /></ProtectedRoute>} />
        <Route path="/payroll" element={<ProtectedRoute><PayrollPage /></ProtectedRoute>} />
        <Route path="/payroll/:id" element={<ProtectedRoute><PayrollRunDetailPage /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
        <Route path="/leaves" element={<ProtectedRoute><LeavesPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/compliance" element={<ProtectedRoute><CompliancePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Routes>
    </Shell>
  );
}
