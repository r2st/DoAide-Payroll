import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="skeleton-page">
        <div className="skeleton-bar w-48 h-8 mb-4" />
        <div className="skeleton-bar w-full h-64" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  return children;
}
