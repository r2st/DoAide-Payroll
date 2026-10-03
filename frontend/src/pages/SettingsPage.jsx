import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../hooks/useAuth";

export default function SettingsPage() {
  usePageTitle("Settings");
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="page-header"><h1>Settings</h1></div>

      <div className="detail-grid">
        <div className="card">
          <h3>Account</h3>
          <dl className="detail-list">
            <dt>Name</dt><dd>{user?.full_name}</dd>
            <dt>Email</dt><dd>{user?.email}</dd>
            <dt>Role</dt><dd>{user?.role}</dd>
          </dl>
        </div>

        <div className="card">
          <h3>Business</h3>
          <dl className="detail-list">
            <dt>Company</dt><dd>{user?.business?.company_name}</dd>
            <dt>PAN</dt><dd>{user?.business?.pan || "—"}</dd>
            <dt>Plan</dt><dd>{user?.business?.plan?.toUpperCase()}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
